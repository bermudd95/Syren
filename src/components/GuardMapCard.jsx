import React, { useState, useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
	connectSocket,
	getSocket,
} from "../backend/utilities/socket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: new URL(
		"leaflet/dist/images/marker-icon-2x.png",
		import.meta.url,
	).href,
	iconUrl: new URL(
		"leaflet/dist/images/marker-icon.png",
		import.meta.url,
	).href,
	shadowUrl: new URL(
		"leaflet/dist/images/marker-shadow.png",
		import.meta.url,
	).href,
});

export default function GuardMapCard({
	siteId,
	initialCenter = [37.7749, -122.4194],
	zoom = 13,
}) {
	const [markers, setMarkers] = useState([]);

	useEffect(() => {
		let mounted = true;
		async function load() {
			const query = siteId
				? `?siteId=${encodeURIComponent(siteId)}`
				: "";
			const res = await fetch(
				`/api/guardShift/checkins${query}`,
			);
			const data = await res.json();
			if (data.checkins && mounted) {
				setMarkers(
					data.checkins.map((c) => ({
						id: c._id,
						guardName: c.guardName,
						location: [
							c.location.lat,
							c.location.lng,
						],
						priority: c.priority,
						checkInTime: c.checkInTime,
					})),
				);
			}
		}
		load();

		(async () => {
			const socket = await connectSocket(siteId);
			socket.on("guardCheckedIn", (payload) => {
				if (payload.siteId !== siteId) return;
				setMarkers((prev) => [
					{
						id: payload.id,
						guardName: payload.guardName,
						location: [
							payload.location.lat,
							payload.location.lng,
						],
						priority: payload.priority,
						checkInTime: payload.checkInTime,
					},
					...prev,
				]);
			});
			socket.on("guardCheckedOut", ({ id }) => {
				setMarkers((prev) =>
					prev.filter((m) => m.id !== id),
				);
			});
		})();

		return () => {
			mounted = false;
			const socket = getSocket();
			if (socket) {
				socket.off("guardCheckedIn");
				socket.off("guardCheckedOut");
			}
		};
	}, [siteId]);

	return (
		<div className="w-full h-72 rounded-xl overflow-hidden">
			<MapContainer
				center={initialCenter}
				zoom={zoom}
				className="h-full w-full"
			>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				{markers.map((m) => (
					<Marker
						key={m.id}
						position={m.location}
					>
						<Popup>
							<div>
								<strong>
									{m.guardName}
								</strong>
								<br />
								Priority: {m.priority}
								<br />
								{new Date(
									m.checkInTime,
								).toLocaleString()}
								<br />
								<small>
									Click marker to view or
									checkout
								</small>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
