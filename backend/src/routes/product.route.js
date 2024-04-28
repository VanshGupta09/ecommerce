import express from "express";
import { addProducts, createProductReview, deleteProduct, deleteReview, getAdminProducts, getAllReviews, getProductDetails, getProducts, updateProduct } from "../controllers/product.controller.js";
import { authoriseRoles, verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").get(verifyJWT, authoriseRoles("admin"),getAdminProducts);
router.route("/product/new").post(verifyJWT, authoriseRoles("admin"), addProducts);
router.route("/product/:id")
    .get( getProductDetails)
    .patch(verifyJWT, authoriseRoles("admin"), updateProduct)
    .delete(verifyJWT, authoriseRoles("admin"), deleteProduct);
router.route("/review").patch(verifyJWT, createProductReview).delete(verifyJWT, deleteReview);
router.route("/reviews").get(getAllReviews);

export default router;