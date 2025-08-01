import React from "react";

function StatusCard() {
	return (
		<div className="bg-gradient-to-r from-slate-700/30 to-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-sm p-6 text-white">
			<h2 className="font-semibold text-white">
				Live Site Status
			</h2>
			<div className="flex items-center gap-2 text-green-400 font-medium">
				<div className="w-3 h-3 bg-green-400 rounded-full" />
				Guard On Site
			</div>
			<p className="text-sm text-green-400">Safe</p>
			<div className="text-sm text-slate-200">
				<p>
					<strong>AI Scan Results:</strong> No
					Anomalies Detected
				</p>
				<p>
					<strong>Door Status:</strong> Closed
				</p>
				<p className="text-xs text-slate-300 mt-2">
					Last Check-in: Jun 26, 2025, 10:15 AM
				</p>
			</div>
		</div>
	);
}

export default StatusCard;
