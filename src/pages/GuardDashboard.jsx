import React from "react";
import TopNav from "../components/TopNav";
import CheckInCard from "../components/CheckInCard";
import ChatButton from "../components/ChatButton";
import GuardMapCard from "../components/GuardMapCard";
import "../App.css";

export default function GuardDashboard() {
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
					<CheckInCard />
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
