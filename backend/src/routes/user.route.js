import express from "express";
import { logOutUser, loginUser, registerUser, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getUserDetailsForAdmin, updateProfileByAdmin, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT, authoriseRoles } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.route("/register").post(upload, registerUser);
// router.route("/register").post(upload.single("avatar"), registerUser);
// router.route("/register").post(upload.fields([
//     {
//         name: "avatar",
//         maxCount: 1
//     }
// ]), registerUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/update").patch(verifyJWT, updatePassword);
router.route("/me/update").patch(verifyJWT, updateProfile);
router.route("/password/reset/:id").patch(resetPassword);
router.route("/me").get(verifyJWT, getUserDetails);
router.route("/logout").get(logOutUser);
router.route("/admin/users").get(verifyJWT, authoriseRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(verifyJWT, authoriseRoles("admin"), getUserDetailsForAdmin)
    .patch(verifyJWT, authoriseRoles("admin"), updateProfileByAdmin)
    .delete(verifyJWT, authoriseRoles("admin"), deleteUser);
// router.route("/admin/user/:id").patch(verifyJWT,authoriseRoles("admin"),updateProfileByAdmin);
// router.route("/delete-user/:id").delete(verifyJWT,authoriseRoles("admin"),deleteUser);


export default router;