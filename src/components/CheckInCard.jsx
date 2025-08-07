import React, { useState } from "react";

export default function CheckInCard() {
	const [checkedIn, setCheckedIn] = useState(false);

	const handleCheckIn = () => {
		setCheckedIn(true);
		alert("You have successfully checked in.");
		// You can also send this info to backend if needed
	};

	return (
		<div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-semibold mb-4">
				Site Check-In
			</h2>
			<button
				onClick={handleCheckIn}
				className={`px-4 py-2 rounded ${
					checkedIn
						? "bg-green-600"
						: "bg-blue-600 hover:bg-blue-700"
				}`}
				disabled={checkedIn}
			>
				{checkedIn ? "Checked In" : "Check In"}
			</button>
		</div>
	);
}
