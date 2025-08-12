// src/pages/AdminActiveShifts.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function AdminActiveShifts({ siteId }) {
	const [shifts, setShifts] = useState([]);
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		try {
			const auth = getAuth();
			const token =
				await auth.currentUser.getIdToken();
			const url = siteId
				? `/api/admin/shifts/active?siteId=${encodeURIComponent(
						siteId,
				  )}`
				: "/api/admin/shifts/active";
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await res.json();
			setShifts(data.shifts || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, [siteId]);

	const forceCheckout = async (id) => {
		if (!confirm("Force checkout this shift?")) return;
		const auth = getAuth();
		const token = await auth.currentUser.getIdToken();
		const res = await fetch(
			`/api/admin/shifts/force-checkout/${id}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		if (res.ok) {
			alert("Checked out");
			load();
		} else {
			const err = await res.json();
			alert(err.message || "Failed");
		}
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold mb-4">
				Active Guard Shifts
			</h2>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="px-2 py-1">Guard</th>
						<th className="px-2 py-1">Site</th>
						<th className="px-2 py-1">
							Checked In
						</th>
						<th className="px-2 py-1">
							Priority
						</th>
						<th className="px-2 py-1">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{shifts.map((s) => (
						<tr
							key={s._id}
							className="border-t"
						>
							<td className="px-2 py-1">
								{s.guardName}
							</td>
							<td className="px-2 py-1">
								{s.siteId}
							</td>
							<td className="px-2 py-1">
								{new Date(
									s.checkInTime,
								).toLocaleString()}
							</td>
							<td className="px-2 py-1">
								{s.priority}
							</td>
							<td className="px-2 py-1">
								<button
									className="bg-red-600 text-white px-2 py-1 rounded"
									onClick={() =>
										forceCheckout(s._id)
									}
								>
									Force Checkout
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
