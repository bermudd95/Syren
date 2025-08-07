import { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import logo from "../assets/Logo 1.png";

export default function RequestAssistance() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			date: new Date().toISOString().slice(0, 10),
			email: "",
			phone: "",
			location: "",
			reason: "",
			otherReason: "",
			priority: "Low",
		},
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const watchReason = watch("reason");

	const onSubmit = async (data) => {
		setLoading(true);
		setMessage("");

		// Combine reason and otherReason if 'Other' selected
		const finalData = {
			...data,
			reason:
				data.reason === "Other"
					? `Other: ${data.otherReason}`
					: data.reason,
		};
		delete finalData.otherReason;

		try {
			const auth = getAuth();
			if (!auth.currentUser) {
				throw new Error(
					"You must be signed in to request assistance.",
				);
			}
			const idToken =
				await auth.currentUser.getIdToken();
			const res = await fetch(
				"/api/assistance/request",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${idToken}`,
					},
					body: JSON.stringify(finalData),
				},
			);
			if (!res.ok) {
				throw new Error(
					(await res.json()).message ||
						"Submission failed",
				);
			}
			setMessage(
				"Request submitted — an officer will be dispatched if needed.",
			);
			reset();
		} catch (err) {
			setMessage(
				err.message || "Error sending request",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
			<div className="w-full max-w-lg bg-white text-black rounded-xl shadow p-6">
				<div className="flex flex-col items-center gap-4 mb-4">
					<img
						src={logo}
						alt="Syren"
						className="h-22 w-auto"
					/>
					<h2 className="text-lg font-semibold">
						Request Guard Assistance
					</h2>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input
							{...register("name", {
								required:
									"Name is required",
							})}
							placeholder="Full name"
							className="border p-2 rounded"
						/>
						<input
							type="date"
							{...register("date", {
								required: true,
							})}
							className="border p-2 rounded"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input
							type="email"
							{...register("email", {
								pattern: /^\S+@\S+$/i,
							})}
							placeholder="Email"
							className="border p-2 rounded"
						/>
						<input
							{...register("phone")}
							placeholder="Phone"
							className="border p-2 rounded"
						/>
					</div>

					<input
						{...register("location")}
						placeholder="Location (address)"
						className="border p-2 rounded w-full"
					/>

					{/* Request Reason Dropdown */}
					<select
						{...register("reason", {
							required: "Reason is required",
						})}
						className="border p-2 rounded w-full"
					>
						<option value="">
							Select Request Reason
						</option>
						<option value="Suspicious Activity">
							Suspicious Activity
						</option>
						<option value="Customer Escalation">
							Customer Escalation
						</option>
						<option value="Break-In">
							Break-In
						</option>
						<option value="Vandalism">
							Vandalism
						</option>
						<option value="Trespassing">
							Trespassing
						</option>
						<option value="Other">Other</option>
					</select>
					{errors.reason && (
						<p className="text-red-500 text-sm">
							{errors.reason.message}
						</p>
					)}

					{/* Conditional "Other" Textarea */}
					{watchReason === "Other" && (
						<textarea
							{...register("otherReason", {
								required:
									"Please specify the reason",
							})}
							placeholder="Please describe the reason"
							className="border p-2 rounded h-28 w-full"
						/>
					)}
					{errors.otherReason && (
						<p className="text-red-500 text-sm">
							{errors.otherReason.message}
						</p>
					)}

					{/* Priority Dropdown */}
					<select
						{...register("priority", {
							required: true,
						})}
						className="border p-2 rounded w-full"
					>
						<option value="Low">
							Low Priority
						</option>
						<option value="Medium">
							Medium Priority
						</option>
						<option value="High">
							High Priority
						</option>
						<option value="Critical">
							Critical Priority
						</option>
					</select>

					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading}
							className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
						>
							{loading
								? "Sending..."
								: "Request Assistance"}
						</button>
						{message && (
							<p className="text-sm text-gray-700">
								{message}
							</p>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
