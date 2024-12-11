import { MapContainer, GeoJSON } from "react-leaflet";
import { ImportedGeoJSON, StateFeature } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";
import { PoliticalCategory } from "../../types/map";

// Nový interface pro statesInfo z states.json
interface StatesData {
  lastUpdated: string;
  states: Array<{
    name: string;
    abbreviation: string;
    political_status: PoliticalCategory;
    population: number;
    area: number;
    gdp: number;
    gdp_per_capita: number;
    governor_name: string;
    governor_party: string;
    electoral_votes: number;
  }>;
}

interface StateInsetProps {
  stateName: string;
  center: [number, number];
  zoom: number;
  geoData: ImportedGeoJSON;
  statesInfo: StatesData; // Přidáme statesInfo prop
  simplified?: boolean;
  onStateSelect?: (state: StateFeature) => void;
}

export const StateInset = ({
  stateName,
  center,
  zoom,
  geoData,
  statesInfo,
  simplified = false,
  onStateSelect,
}: StateInsetProps) => {
  const stateGeo = geoData.features.find(
    (f) => f.properties.name === stateName
  ) as StateFeature;

  if (!stateGeo) return null;

  const handleClick = () => {
    if (onStateSelect) {
      onStateSelect(stateGeo);
    }
  };

  // Najít politický status státu z statesInfo
  const matchedState = statesInfo.states.find((s) => s.name === stateName);
  const fillColor = matchedState
    ? getPoliticalColor(matchedState.political_status)
    : "#CCCCCC";

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer ${
        simplified ? "w-48 h-36" : "w-48 h-48"
      }`}
      onClick={handleClick}
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
          data={stateGeo}
          style={{
            fillColor: fillColor,
            fillOpacity: 0.9,
            weight: 1,
            color: "#FF9913",
          }}
        />
      </MapContainer>
    </div>
  );
};
