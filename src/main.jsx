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

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />

				<Route
					path="/settings"
					element={<SettingsPage />}
				/>
			</Routes>
		</Router>
	</React.StrictMode>,
);
