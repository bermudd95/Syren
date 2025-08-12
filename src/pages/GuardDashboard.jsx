import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import ChatButton from "../components/ChatButton";
import GuardMapCard from "../components/GuardMapCard";
import "../App.css";

export default function GuardDashboard() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col">
			<TopNav />
			<header className="flex justify-between items-center px-6 pt-4">
				<h1 className="text-2xl font-semibold text-white">
					Guard Dashboard
				</h1>
			</header>

			<div className="flex flex-col md:flex-row justify-between px-6 py-4 gap-4">
				<div className="flex flex-col gap-4 md:w-2/3">
					<div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
						<div className="space-x-4">
							<button
								onClick={() =>
									navigate(
										"/guard/check-in",
									)
								}
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
							>
								Check In
							</button>
							<button
								onClick={() =>
									navigate(
										"/guard/check-out",
									)
								}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							>
								Check Out
							</button>
						</div>
					</div>
					<ChatButton />
				</div>

				<div className="flex flex-col gap-4 md:w-1/3">
					<div className="bg-gradient-to-r from-slate-700/30 to-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-sm p-6 text-white">
						<GuardMapCard />
					</div>
				</div>
			</div>
		</div>
	);
}
