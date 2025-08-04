import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResetEmail } from "../utilities/sendResetEmail.js";

const secret = process.env.JWT_SECRET;

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
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(
			password,
			user.password,
		);
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ userId: user._id },
			secret,
			{ expiresIn: "1h" },
		);

		res.status(200).json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found" });
		}

		const token = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{
				expiresIn: "15m",
			},
		);

		const resetLink = `http://localhost:5173/reset-password/${token}`;

		await sendResetEmail({
			email: user.email,
			username: user.username,
			resetLink,
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
	const { token } = req.params;
	const { newPassword } = req.body;

	try {
		const decoded = jwt.verify(token, secret);
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found" });
		}

		const hashedPassword = await bcrypt.hash(
			newPassword,
			10,
		);
		user.password = hashedPassword;
		await user.save();

		// Optional: send success email
		// await sendResetSuccessEmail({ email: user.email, username: user.username });

		res.status(200).json({
			message: "Password reset successful",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(400).json({
			message: "Invalid or expired token",
		});
	}
};
