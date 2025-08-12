import React, { useState } from "react";
import { getAuth } from "firebase/auth";

export default function CheckInCard({ siteId, onSuccess }) {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		guardName: "",
		phone: "",
		email: "",
		priority: "Low",
	});
	const [loading, setLoading] = useState(false);

	const change = (e) =>
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!navigator.geolocation)
				throw new Error(
					"Geolocation not supported",
				);
			const pos = await new Promise((res, rej) =>
				navigator.geolocation.getCurrentPosition(
					res,
					rej,
				),
			);

			const payload = {
				guardName: form.guardName,
				phone: form.phone,
				email: form.email,
				siteId,
				location: {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				},
				priority: form.priority,
			};

			const auth = getAuth();
			if (!auth.currentUser)
				throw new Error("Please sign in first");
			const token =
				await auth.currentUser.getIdToken();

			const res = await fetch(
				"/api/guardShift/checkin",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				},
			);
			const data = await res.json();
			if (!res.ok)
				throw new Error(
					data.message || "Checkin failed",
				);

			setOpen(false);
			setForm({
				guardName: "",
				phone: "",
				email: "",
				priority: "Low",
			});
			if (onSuccess) onSuccess(data);
			alert("Checked in");
		} catch (err) {
			alert(err.message || "Error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-slate-800 text-white p-6 rounded-xl">
			<h3 className="text-lg font-semibold mb-3">
				Site Check-In
			</h3>
			<button
				className="bg-blue-600 px-4 py-2 rounded"
				onClick={() => setOpen(true)}
			>
				Check In
			</button>

			{open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white text-black p-6 rounded w-full max-w-md">
						<h4 className="text-lg font-bold mb-2">
							Guard Check-In
						</h4>
						<form
							onSubmit={submit}
							className="space-y-3"
						>
							<input
								name="guardName"
								value={form.guardName}
								onChange={change}
								placeholder="Guard name"
								className="border p-2 w-full rounded"
								required
							/>
							<input
								name="phone"
								value={form.phone}
								onChange={change}
								placeholder="Phone"
								className="border p-2 w-full rounded"
								required
							/>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={change}
								placeholder="Email"
								className="border p-2 w-full rounded"
								required
							/>
							<select
								name="priority"
								value={form.priority}
								onChange={change}
								className="border p-2 w-full rounded"
							>
								<option>Low</option>
								<option>Medium</option>
								<option>High</option>
								<option>Critical</option>
							</select>
							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() =>
										setOpen(false)
									}
									className="px-3 py-1 bg-gray-300 rounded"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={loading}
									className="px-3 py-1 bg-green-600 text-white rounded"
								>
									{loading
										? "Checking in..."
										: "Submit"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
