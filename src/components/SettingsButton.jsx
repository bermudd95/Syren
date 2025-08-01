import { useNavigate } from "react-router-dom";

export default function SettingsButton() {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate("/settings")}
			className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md shadow"
		>
			Settings
		</button>
	);
}
