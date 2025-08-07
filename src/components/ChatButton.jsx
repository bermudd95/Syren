import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatButton() {
	const navigate = useNavigate();

	const openChat = () => {
		window.open("/guard-chat", "_blank");
	};

	return (
		<div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-semibold mb-4">
				Communication
			</h2>
			<button
				onClick={openChat}
				className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
			>
				Chat with Client
			</button>
		</div>
	);
}
