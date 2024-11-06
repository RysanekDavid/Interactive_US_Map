import { MapContainer, GeoJSON } from "react-leaflet";
import { ImportedGeoJSON, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateInsetProps {
  stateName: string;
  center: [number, number];
  zoom: number;
  statesData: ImportedGeoJSON;
  statePolitics: Record<string, PoliticalCategory>;
  simplified?: boolean;
}

export const StateInset = ({
  stateName,
  center,
  zoom,
  statesData,
  statePolitics,
  simplified = false,
}: StateInsetProps) => {
  const stateData = statesData.features.find(
    (f) => f.properties.name === stateName
  );

  if (!stateData) return null;

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
        simplified ? "w-48 h-36" : "w-48 h-48"
      }`}
    >
      {/* Nadpis přímo nad mapou uvnitř boxu, pevně pozicovaný */}
      <div
        className="absolute top-0 w-full text-center text-xs font-semibold text-gray-600 bg-white bg-opacity-30 p-1 z-[1000]"
        style={{ pointerEvents: "none" }}
      >
        {stateName}
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <GeoJSON
          data={stateData}
          style={{
            fillColor: getPoliticalColor(stateName, statePolitics),
            fillOpacity: 0.8,
            weight: 1,
            color: "#FF9913",
          }}
        />
      </MapContainer>
    </div>
  );
};
