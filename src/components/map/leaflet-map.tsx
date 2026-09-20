import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import { CATEGORY_COLOR, CITY_CENTER, type SafetyReport } from "@/lib/safety";

export type MapRoute = {
  id: string;
  path: [number, number][];
  active: boolean;
};

export type LeafletMapProps = {
  reports: SafetyReport[];
  routes?: MapRoute[] | undefined;
  from?: [number, number] | undefined;
  to?: [number, number] | undefined;
  height?: string | undefined;
};

export default function LeafletMap({
  reports,
  routes = [],
  from,
  to,
  height = "100%",
}: LeafletMapProps) {
  const center = from ?? CITY_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height, width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {routes.map((r) => (
        <Polyline
          key={r.id}
          positions={r.path}
          pathOptions={{
            color: r.active ? "#12b8a6" : "#94a3b8",
            weight: r.active ? 6 : 3,
            opacity: r.active ? 0.95 : 0.5,
            dashArray: r.active ? undefined : "6 8",
          }}
        />
      ))}

      {from && (
        <CircleMarker
          center={from}
          radius={9}
          pathOptions={{ color: "#0f766e", fillColor: "#12b8a6", fillOpacity: 1 }}
        >
          <Popup>Start location</Popup>
        </CircleMarker>
      )}
      {to && (
        <CircleMarker
          center={to}
          radius={9}
          pathOptions={{ color: "#1e293b", fillColor: "#1e293b", fillOpacity: 1 }}
        >
          <Popup>Destination</Popup>
        </CircleMarker>
      )}

      {reports.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={r.severity === "High" ? 11 : r.severity === "Medium" ? 8 : 6}
          pathOptions={{
            color: CATEGORY_COLOR[r.category],
            fillColor: CATEGORY_COLOR[r.category],
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{r.location}</strong>
            <br />
            {r.category} · {r.severity} severity
            <br />
            <span style={{ opacity: 0.75 }}>{r.description}</span>
            <br />
            <em>{r.demo ? "Demo data" : "Community submitted (prototype)"}</em>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
