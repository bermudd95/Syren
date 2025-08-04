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

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />

				<Route
					path="/settings"
					element={<SettingsPage />}
				/>
				<Route
					path="/login"
					element={<LoginPage />}
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
			</Routes>
		</Router>
	</React.StrictMode>,
);
