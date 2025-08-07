import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../assets/Logo 1.png";

const SecurityLogin = () => {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signInWithEmailAndPassword(
				auth,
				form.email,
				form.password,
			);
			navigate("/");
		} catch (err) {
			console.error("Login error:", err);
			alert(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col justify-center items-center h-screen bg-slate-900">
			<div className="justify-center items-center pb-3">
				<img
					src={logo}
					alt="Logo"
					className="h-40 w-auto rounded-lg"
				/>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-white text-black p-6 rounded-xl shadow-xl w-96"
			>
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Guard Login
				</h2>

				<input
					type="email"
					value={form.email}
					name="email"
					placeholder="Email"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
					required
				/>

				<input
					type="password"
					name="password"
					value={form.password}
					placeholder="Password"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
					required
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-60"
				>
					{loading ? "Signing in..." : "Login"}
				</button>

				<div className="text-sm mt-3 text-center">
					<Link
						to="/forgot-password"
						className="text-blue-400 hover:underline"
					>
						Forgot Password?
					</Link>{" "}
					|
					<Link
						to="/register"
						className="text-blue-400 hover:underline ml-1"
					>
						Create Account
					</Link>
				</div>
			</form>
		</div>
	);
};

export default SecurityLogin;
