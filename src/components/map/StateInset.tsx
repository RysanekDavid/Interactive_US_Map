import { MapContainer, GeoJSON } from "react-leaflet";
import {
  ImportedGeoJSON,
  PoliticalCategory,
  StateFeature,
} from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateInsetProps {
  stateName: string;
  center: [number, number];
  zoom: number;
  statesData: ImportedGeoJSON;
  statePolitics: Record<string, PoliticalCategory>;
  simplified?: boolean;
  onStateSelect?: (state: StateFeature) => void; // Přidáme callback pro výběr státu
}

export const StateInset = ({
  stateName,
  center,
  zoom,
  statesData,
  statePolitics,
  simplified = false,
  onStateSelect,
}: StateInsetProps) => {
  const stateData = statesData.features.find(
    (f) => f.properties.name === stateName
  ) as StateFeature;

  if (!stateData) return null;

  const handleClick = () => {
    if (onStateSelect) {
      onStateSelect(stateData);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer ${
        simplified ? "w-48 h-36" : "w-48 h-48"
      }`}
      onClick={handleClick} // Přidáme onClick handler na celý div
    >
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
        dragging={true}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <GeoJSON
          data={stateData}
          style={{
            fillColor: getPoliticalColor(stateName, statePolitics),
            fillOpacity: 0.9,
            weight: 1,
            color: "#FF9913",
          }}
        />
      </MapContainer>
    </div>
  );
};
