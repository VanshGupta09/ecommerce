import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req?.cookies?.jwtToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?.id).select(
            "-password -jwtToken"
        )

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error || "Invalid access token")
    }
})

export const authoriseRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req?.user?.role)) {
            throw new ApiError(401, `Role: ${req?.user?.role} is not allowed to access the resource`)
        }
        next()
    }
}