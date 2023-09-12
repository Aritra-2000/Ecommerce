import express from 'express';
import { registerUser, 
       loginUser, 
       logout, 
       forgotPassword, 
       resetPassword, 
       getUserDetails, 
       updatePassword, 
       updatePofile, 
       getAllUser, 
       getSingleUser, 
       updateUserRole,
       deleteUser} from '../controllers/userController.js';

const router = express.Router();
import {isAuthenticatedUser, authorizedRoles} from "../middleware/auth.js"



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updatePofile)
router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"), getAllUser)
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser, authorizedRoles("admin"),deleteUser)

export default router;