import ReactDOM from "react-dom/client";
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import "tailwindcss";
import App from "./App";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestAssistance from "./pages/RequestAssistance";
import AdminRequests from "./pages/AdminRequests";
import AdminRequestView from "./pages/AdminRequestView";
import RoleSelect from "./pages/RoleSelect";
import SecurityLogin from "./pages/SecurityLogin";
import GuardDashboard from "./pages/GuardDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route
					path="/roleSelect"
					element={<RoleSelect />}
				/>
				<Route
					path="/settings"
					element={<SettingsPage />}
				/>
				<Route
					path="/login"
					element={<LoginPage />}
				/>
				<Route
					path="/login/guard"
					element={<SecurityLogin />}
				/>
				<Route
					path="/guard/dashboard"
					element={<GuardDashboard />}
				/>
				<Route
					path="/register"
					element={<RegisterPage />}
				/>
				<Route
					path="/forgot-password"
					element={<ForgotPassword />}
				/>
				<Route
					path="/reset-password/:token"
					element={<ResetPassword />}
				/>
				<Route
					path="/request-assistance"
					element={<RequestAssistance />}
				/>
				<Route
					path="/admin/requests"
					element={<AdminRequests />}
				/>
				<Route
					path="/admin/requests/:id"
					element={<AdminRequestView />}
				/>
			</Routes>
		</Router>
	</React.StrictMode>,
);
