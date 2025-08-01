import React from "react";
import StatusCard from "./components/StatusCard";
import IncidentLog from "./components/IncidentLog";
import VideoPreview from "./components/VideoPreview";
import MapCard from "./components/MapCard";
import TopNav from "./components/TopNav";
import SettingsButton from "./components/SettingsButton";
import "./App.css";

export default function App() {
	return (
		<div className="min-h-screen flex flex-col">
			<TopNav />
			<header className="flex justify-between items-center px-6 pt-4">
				<h1 className="text-2xl font-semibold text-white">
					Client Dashboard
				</h1>
			</header>
			<div className="flex flex-col md:flex-row justify-between px-6 py-4 gap-4">
				<div className="flex flex-col gap-4 md:w-2/3">
					<StatusCard />
					<VideoPreview />
				</div>
				<div className="flex flex-col gap-4 md:w-1/3">
					<IncidentLog />

					<div className="bg-gradient-to-r from-slate-700/30 to-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-sm p-6 text-white">
						<h2 className="text-xl font-bold mb-4">
							Edit Zone
						</h2>
						<MapCard />
					</div>
				</div>
			</div>
			<div className="px-6 py-4">
				<SettingsButton />
			</div>
		</div>
	);
}
