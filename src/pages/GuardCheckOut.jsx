import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/Logo 1.png";
export default function CheckOut() {
	const navigate = useNavigate();
	const { guardId } = useParams();
	const [loading, setLoading] = useState(false);

	const handleCheckOut = () => {
		setLoading(true);
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				const res = await fetch("/api/check-out", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						guardId,
						location,
					}),
				});

				setLoading(false);
				if (res.ok) {
					navigate("/dashboard");
				} else {
					console.error("Check-out failed");
				}
			},
		);
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen bg-slate-900">
			<div className="justify-center items-center pb-3">
				<img
					src={Logo}
					alt="Logo"
					className="h-40 w-auto rounded-lg"
				/>
			</div>

			<div className="bg-white text-black p-6 rounded-xl shadow-xl w-96">
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Confirm Check-Out
				</h2>

				<p className="text-center mb-4">
					Are you sure you want to check out?
				</p>

				<button
					onClick={handleCheckOut}
					disabled={loading}
					className="w-full bg-red-600 hover:bg-red-700 p-2 rounded disabled:opacity-60"
				>
					{loading
						? "Checking out..."
						: "Check Out"}
				</button>
			</div>
		</div>
	);
}
