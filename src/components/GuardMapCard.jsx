import React from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GuardMapCard() {
	const position = [37.7749, -122.4194]; // Replace with real client location

	return (
		<div className="w-full h-72">
			<MapContainer
				center={position}
				zoom={15}
				className="h-full w-full rounded-xl"
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
				/>
				<Marker position={position}>
					<Popup>Client Site</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
