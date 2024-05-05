import ApiResponse from "./ApiResponse.js";
import asyncHandler from "./asyncHandler.js";

export const sendToken = asyncHandler(async (user, statusCode, res) => {
    const token = await user.getJwtToken();

    const options = {
        httpOnly: true,
        secure: true,
        sameSite:"none",
        expires: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days
        ),
        // maxAge: 5 * 24 * 60 * 60 * 1000,
    }

    res.status(statusCode)
        .cookie("jwtToken", token, options)
        .json(
            new ApiResponse(200, { user, token }, "Successfull")
        )
})