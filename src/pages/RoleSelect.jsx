import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo 1.png";

export default function RoleSelectPage() {
	const navigate = useNavigate();

	const handleSelect = (role) => {
		switch (role) {
			case "admin":
				navigate("/login/admin");
				break;
			case "client":
				navigate("/login/client");
				break;
			case "guard":
				navigate("/login/guard");
				break;
			default:
				break;
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900">
			<div className="bg-white shadow-md rounded p-8 max-w-md w-full">
				<div className="flex flex-col items-center gap-4 mb-4">
					<img
						src={logo}
						alt="Syren"
						className="h-22 w-auto"
					/>
					<h2 className="text-2xl font-bold text-center mb-6 text-black">
						Select Your Role
					</h2>
				</div>
				<div className="flex gap-x-4">
					<button
						onClick={() =>
							handleSelect("admin")
						}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
					>
						Admin
					</button>
					<button
						onClick={() =>
							handleSelect("client")
						}
						className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
					>
						Client
					</button>
					<button
						onClick={() =>
							handleSelect("guard")
						}
						className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
					>
						Guard
					</button>
				</div>
			</div>
		</div>
	);
}
