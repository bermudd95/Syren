import { useState } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const guards = [
	{
		id: 1,
		name: "Guard A",
		lat: 37.7749,
		lng: -122.4194,
	},
	{
		id: 2,
		name: "Guard B",
		lat: 34.0522,
		lng: -118.2437,
	},
	{ id: 3, name: "Guard C", lat: 40.7128, lng: -74.006 },
];

export default function MapCard() {
	const [selectedGuard, setSelectedGuard] =
		useState(null);
	return (
		<div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
			<h2 className="text-lg font-semibold mb-4">
				Active Guard Tracker
			</h2>

			{selectedGuard ? (
				<>
					<button
						onClick={() =>
							setSelectedGuard(null)
						}
						className="mb-4 px-3 py-1 bg-slate-800 text-sm rounded hover:bg-slate-700"
					>
						← Back to List
					</button>
					<p className="mb-2 font-medium">
						{selectedGuard.name}'s Location:
					</p>
					<MapContainer
						center={[
							selectedGuard.lat,
							selectedGuard.lng,
						]}
						zoom={13}
						scrollWheelZoom={false}
						className="h-[300px] rounded-xl z-0"
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
						/>
						<Marker
							position={[
								selectedGuard.lat,
								selectedGuard.lng,
							]}
						>
							<Popup>
								{selectedGuard.name}
							</Popup>
						</Marker>
					</MapContainer>
				</>
			) : (
				<ul className="space-y-2">
					{guards.map((guard) => (
						<li
							key={guard.id}
							className="cursor-pointer hover:bg-slate-800 p-3 rounded-xl transition"
							onClick={() =>
								setSelectedGuard(guard)
							}
						>
							{guard.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
