import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [4, "Minimum length of name should be 4"],
        maxLength: [30, "Maximum length of name should be 10"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        maxLength: [30, "Maximum length of password should be 10"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true })

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next()
//     }
//     this.password = await bcrypt.hash(this.password, 10);
// })

userSchema.methods.getJwtToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE })
}

// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
// }

// generating password reset token
// userSchema.methods.generateResetToken = function () {
//     // generating token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // hashing and adding reset token to user schema
//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;
// }

export const User = mongoose.model("User", userSchema);