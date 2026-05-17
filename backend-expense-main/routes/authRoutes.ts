import express from "express";
import * as authController from "../Controllers/authController";

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").get(authController.logout);
router.route("/google").post(authController.googleSignIn);
router.route("/forgot-password").post(authController.forgotPassword);

export default router;
