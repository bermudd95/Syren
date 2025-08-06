import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
	sendResetEmail,
	sendResetSuccessEmail,
} from "../utilities/sendEmail.js";

const secret =
	import.meta.env.VITE_JWT_SECRET || "fallback_secret"; // Use env var in production

export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists" });
		}
		const hashedPassword = await bcrypt.hash(
			password,
			10,
		);
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});
		await newUser.save();
		res.status(201).json({
			message: "User created successfully",
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(400)
				.json({ message: "Invalid credentials" });
		const isMatch = await bcrypt.compare(
			password,
			user.password,
		);
		if (!isMatch)
			return res
				.status(400)
				.json({ message: "Invalid credentials" });
		const token = jwt.sign(
			{ userId: user._id },
			secret,
			{ expiresIn: "1h" },
		);
		res.status(200).json({ token });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(404)
				.json({ message: "User not found" });

		// Create a JWT token containing the userId
		const token = jwt.sign(
			{ userId: user._id },
			secret,
			{ expiresIn: "15m" },
		);
		const resetLink = `http://localhost:5173/reset-password?oobCode=${token}`;

		// send reset email (React component rendered to HTML inside sendResetEmail)
		await sendResetEmail("reset", {
			email: user.email,
			username: user.username,
			resetLink,
		});

		await sendResetEmail("reset-success", {
			email: user.email,
			username: user.username,
		});

		await sendResetEmail("service-request", {
			email: client.email,
			username: client.name,
			extraInfo: requestDetails,
		});

		await sendResetEmail("support", {
			email: user.email,
			username: user.username,
			extraInfo: supportMessage,
		});
		return res
			.status(200)
			.json({ message: "Reset email sent" });
	} catch (err) {
		console.error("Forgot password error:", err);
		return res
			.status(500)
			.json({ message: "Internal server error" });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params; // if you keep token in route param
		// Accept token in body or route param — here we support both:
		const incomingToken = token || req.body.token;
		const newPassword =
			req.body.password || req.body.newPassword;

		if (!incomingToken) {
			return res
				.status(400)
				.json({ message: "Missing token" });
		}
		if (!newPassword) {
			return res
				.status(400)
				.json({ message: "Missing new password" });
		}

		const decoded = jwt.verify(incomingToken, secret);
		const user = await User.findById(decoded.userId);
		if (!user)
			return res
				.status(404)
				.json({ message: "User not found" });

		const hashedPassword = await bcrypt.hash(
			newPassword,
			10,
		);
		user.password = hashedPassword;
		await user.save();

		// optionally send success email (non-blocking)
		try {
			await sendResetSuccessEmail({
				email: user.email,
				username: user.username,
			});
		} catch (err) {
			console.warn(
				"Failed to send reset-success email:",
				err,
			);
		}

		res.status(200).json({
			message: "Password reset successful",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		// jwt.verify throws on invalid/expired token
		return res
			.status(400)
			.json({ message: "Invalid or expired token" });
	}
};
