import React from "react";

function SettingsPage() {
	return (
		<div className="min-h-screen bg-gray-900 text-white px-6 py-4">
			<header className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">
					Syren
				</h1>
				<h1 className="text-2xl font-bold">
					Settings
				</h1>
			</header>

			<section className="grid md:grid-cols-2 gap-6">
				<div className="bg-gray-800 p-4 rounded shadow">
					<h2 className="text-lg font-semibold mb-2">
						Notification Preferences
					</h2>
					<form className="space-y-2">
						<label className="block">
							<input
								type="checkbox"
								className="mr-2"
							/>{" "}
							Email
						</label>
						<label className="block">
							<input
								type="checkbox"
								className="mr-2"
							/>{" "}
							SMS
						</label>
						<label className="block">
							<input
								type="checkbox"
								className="mr-2"
							/>{" "}
							Push Notification
						</label>
					</form>
				</div>

				<div className="bg-gray-800 p-4 rounded shadow">
					<h2 className="text-lg font-semibold mb-2">
						Access Permissions
					</h2>
					<input
						type="text"
						placeholder="Authorized Users"
						className="w-full p-2 rounded bg-gray-700 text-white"
					/>
				</div>

				<div className="bg-gray-800 p-4 rounded shadow">
					<h2 className="text-lg font-semibold mb-2">
						Business Hours
					</h2>
					<input
						type="text"
						placeholder="e.g. Mon-Fri 9am-5pm"
						className="w-full p-2 rounded bg-gray-700 text-white"
					/>
				</div>

				<div className="bg-gray-800 p-4 rounded shadow">
					<h2 className="text-lg font-semibold mb-2">
						Emergency Contacts
					</h2>
					<textarea
						className="w-full p-2 rounded bg-gray-700 text-white"
						rows="3"
						placeholder="Name, Phone, Email"
					></textarea>
				</div>
			</section>
		</div>
	);
}

export default SettingsPage;
