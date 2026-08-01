import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper component to re-center map dynamically when a guard is selected
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const initialGuards = [
  { id: "g1", name: "Guard A - Patrol", lat: 37.7749, lng: -122.4194, status: "Active" },
  { id: "g2", name: "Guard B - Dispatch", lat: 34.0522, lng: -118.2437, status: "Alert" },
  { id: "g3", name: "Guard C - Stationed", lat: 40.7128, lng: -74.006, status: "Active" },
];

export default function MapCard() {
  const [guards, setGuards] = useState(initialGuards);
  const [selectedGuard, setSelectedGuard] = useState(null);

  // Real-time socket listener for guard location updates
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const socket = io(backendUrl, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") || "" }
    });

    socket.on("connect", () => {
      console.log("MapCard connected to dispatch socket:", socket.id);
    });

    // Listen for live location updates from guards
    socket.on("guardLocationUpdate", (data) => {
      // Expected data payload: { id, lat, lng, status }
      setGuards((prevGuards) =>
        prevGuards.map((g) => (g.id === data.id ? { ...g, ...data } : g))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const mapCenter = selectedGuard
    ? [selectedGuard.lat, selectedGuard.lng]
    : [37.7749, -122.4194];

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-slate-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Guard & Security Dispatch Map</h2>
        {selectedGuard && (
          <button
            onClick={() => setSelectedGuard(null)}
            className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700 transition"
          >
            Reset View
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guard List Side Panel */}
        <div className="col-span-1 bg-slate-800 p-3 rounded-xl max-h-[350px] overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Active Units ({guards.length})
          </p>
          <ul className="space-y-2">
            {guards.map((guard) => (
              <li
                key={guard.id}
                onClick={() => setSelectedGuard(guard)}
                className={`cursor-pointer p-3 rounded-xl transition flex justify-between items-center ${
                  selectedGuard?.id === guard.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-700 bg-slate-900"
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{guard.name}</p>
                  <p className="text-xs text-slate-400">
                    {guard.lat.toFixed(4)}, {guard.lng.toFixed(4)}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    guard.status === "Alert"
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {guard.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Map Container */}
        <div className="col-span-2 h-[350px] rounded-xl overflow-hidden z-0">
          <MapContainer
            center={mapCenter}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <MapRecenter center={selectedGuard ? [selectedGuard.lat, selectedGuard.lng] : null} />

            {guards.map((guard) => (
              <Marker
                key={guard.id}
                position={[guard.lat, guard.lng]}
                eventHandlers={{
                  click: () => setSelectedGuard(guard),
                }}
              >
                <Popup>
                  <div className="text-slate-900">
                    <p className="font-bold">{guard.name}</p>
                    <p className="text-xs">Status: {guard.status}</p>
                    <p className="text-xs">
                      Lat: {guard.lat.toFixed(4)} | Lng: {guard.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
}
