import React, { useState } from "react";
import { getAuth } from "firebase/auth";

export default function CheckOutButton({ shiftId }) {
	const [loading, setLoading] = useState(false);
	const handle = async () => {
		setLoading(true);
		try {
			const auth = getAuth();
			if (!auth.currentUser)
				throw new Error("Sign in required");
			const token =
				await auth.currentUser.getIdToken();
			const res = await fetch(
				`/api/guardShift/checkout/${shiftId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const data = await res.json();
			if (!res.ok)
				throw new Error(
					data.message || "Checkout failed",
				);
			alert("Checked out");
		} catch (err) {
			alert(err.message || "Error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handle}
			className="bg-red-600 px-3 py-1 text-white rounded"
			disabled={loading}
		>
			{loading ? "..." : "Check Out"}
		</button>
	);
}
