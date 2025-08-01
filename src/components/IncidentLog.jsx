import React from "react";

function IncidentLog() {
	const logs = [
		{
			type: "Suspicious activity",
			source: "Guard report",
		},
		{
			type: "Break in",
			source: "Video Footage",
			time: "2:40 AM",
		},
		{ type: "AJ detected", source: "Person running" },
	];

	return (
		<div className="bg-gradient-to-r from-slate-700/30 to-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-sm p-6 text-white">
			<h2 className="font-semibold text-red-600">
				Incident Log
			</h2>
			<ul className="mt-2 text-sm text-gray-300 space-y-1">
				{logs.map((log, i) => (
					<li key={i}>
						<div className="font-medium">
							{log.type}
						</div>
						<div className="text-xs text-gray-200">
							{log.source}{" "}
							{log.time && `- ${log.time}`}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default IncidentLog;
