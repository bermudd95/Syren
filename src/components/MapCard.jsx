import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

export default function MapCard() {
	return (
		<div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
			<MapContainer
				center={[37.7749, -122.4194]}
				zoom={13}
				scrollWheelZoom={true}
				className="h-full w-full z-0"
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker
					position={[37.7749, -122.4194]}
					icon={L.icon({
						iconUrl: markerIconPng,
						iconSize: [25, 41],
						iconAnchor: [12, 41],
					})}
				>
					<Popup>
						Guard on Site <br /> San Francisco
						HQ
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
