import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews,deleteReview, getAdminProducts } from '../controllers/productControllers.js';
import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js';
const router = express.Router();


router.route("/products").get( getAllProducts);
router.route("/admin/products").get(getAdminProducts,isAuthenticatedUser,authorizedRoles("admin"));
router.route("/admin/product/new").post(isAuthenticatedUser , authorizedRoles("admin") ,createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser , authorizedRoles("admin") , updateProduct).delete(isAuthenticatedUser , authorizedRoles("admin") , deleteProduct)
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview)


export default router;