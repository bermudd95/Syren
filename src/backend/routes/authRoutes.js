import express from "express";
import {
	signup,
	login,
	forgotPassword,
	resetPassword,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
