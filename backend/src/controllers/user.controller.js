import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendToken } from "../utils/JwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { uplpadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body.avatar);

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "ecommerce/avatar",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(300, "Invalid credentials")
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(300, "This mail is already used")
    }

    if (!myCloud) {
        throw new ApiError(409, "Error while uploading image on cloudinary");
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })

    if (!user) {
        throw new ApiError(500, "Error while storing user data")
    }

    const createdUser = await User.findById(user?._id).select("-password");

    sendToken(createdUser, 201, res);
})

// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;

//     console.log("File", JSON.stringify(req.files),req.body.avatar.path);

//     if (!name || !email || !password) {
//         throw new ApiError(300, "Invalid credentials")
//     }

//     const existedUser = await User.findOne({ email });

//     if (existedUser) {
//         throw new ApiError(300, "This mail is already used")
//     }

//     console.log(req.files);
//     // console.log(req.body);
//     const avatarLocalPath = req?.files?.avatar[0]?.path;

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar is required");
//     }
//     console.log(avatarLocalPath);

//     const avatar = await uplpadOnCloudinary(avatarLocalPath);
//     console.log("avatar");

//     if (!avatar) {
//         throw new ApiError(409, "Error while uploading image on cloudinary");
//     }

//     const user = await User.create({
//         name,
//         email,
//         password,
//         avatar: {
//             public_id: "sample id",
//             url: avatar?.url
//         }
//     })

//     if (!user) {
//         throw new ApiError(500, "Error while storing user data")
//     }

//     const createdUser = await User.findById(user?._id).select("-password");

//     sendToken(createdUser, 201, res);
// })

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(300, "Enter email or password")
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(300, "Invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
    }

    sendToken(user, 201, res);
})

const logOutUser = asyncHandler((req, res) => {
    console.log("logout req");

    res.cookie('jwtToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
    });
    
    res.status(200)
        .json(
            new ApiResponse(200, {}, "Logged Out")
        )
})

const forgetPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req?.body?.email });

    if (!user) {
        throw new ApiError(300, "User not found")
    }

    // get resetPassword token
    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false })

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;


    const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user?.email,
            subject: `Ecommerce password recovery`,
            message
        })

        res.status(200).json(
            new ApiResponse(200, {}, `Email sent to ${user?.email} successfully`)
        )

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        throw new ApiError(500, error.message)
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req?.params?.id).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } // for session expiry
    })

    if (!user) {
        throw new ApiError(300, "Invalid reset token or session expired")
    }

    if (req?.body?.password !== req?.body?.confirmPassword) {
        throw new ApiError(300, "Password does not match")
    }

    user.password = req?.body?.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 201, res);
})

const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user?.id);

    res.status(200)
        .json(
            new ApiResponse(200, { user }, "User details fetched successfully")
        )
})

const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user?.id).select("+password");

    const isPasswordValid = await user.isPasswordCorrect(req?.body?.oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
    }

    if (req?.body?.newPassword !== req?.body?.confirmPassword) {
        throw new ApiError(301, "Password does not match")
    }

    user.password = req?.body?.newPassword;
    await user.save();

    sendToken(user, 200, res)
})

const updateProfile = asyncHandler(async (req, res) => {

    const newUserData = {
        name: req?.body?.name,
        email: req?.body?.email
    }

    if (req.body?.avatar !== "") {
        const user = await User.findById(req.user?.id);

        const imageId = user?.avatar?.public_id;

        await cloudinary.uploader.destroy(imageId);

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "ecommerceAvatar",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }

    }

    const user = await User.findByIdAndUpdate(req?.user?.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });


    res.status(200)
        .json(
            new ApiResponse(200, { user }, "User details updated successfully"))
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    if (!users) {
        throw new ApiError(300, "Some error occured")
    }

    res.status(200).json(
        new ApiResponse(200, { users }, "Users Fetched successfully")
    )
})

const getUserDetailsForAdmin = asyncHandler(async (req, res) => {

    const user = await User.findById(req?.params?.id);

    if (!user) {
        throw new ApiError(300, `User does not exist ${req?.params?.id}`)
    }

    res.status(200)
        .json(
            new ApiResponse(200, { user }, "User details fetched successfully")
        )
})

const updateProfileByAdmin = asyncHandler(async (req, res) => {

    const newUserData = {
        name: req?.body?.name,
        email: req?.body?.email,
        role: req?.body?.role
    }

    const user = await User.findByIdAndUpdate(req?.params?.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200)
        .json(
            new ApiResponse(200, { user }, "User details updated successfully"))
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req?.params?.id);

    if (!user) {
        throw new ApiError(300, `User does not exist ${req?.params?.id}`)
    }

    const imageId = user?.avatar?.public_id;
    await cloudinary.uploader.destroy(imageId);

    await User.findByIdAndDelete(req?.params?.id);

    res.status(200)
        .json(
            new ApiResponse(200, {}, "User deleted successfully"))
})

export {
    registerUser,
    loginUser,
    logOutUser,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getUserDetailsForAdmin,
    updateProfileByAdmin,
    deleteUser
};