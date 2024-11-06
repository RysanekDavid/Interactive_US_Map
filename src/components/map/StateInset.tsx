import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { ImportedGeoJSON, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateInsetProps {
  stateName: string;
  center: [number, number];
  zoom: number;
  statesData: ImportedGeoJSON;
  statePolitics: Record<string, PoliticalCategory>;
}

export const StateInset = ({
  stateName,
  center,
  zoom,
  statesData,
  statePolitics,
}: StateInsetProps) => {
  const stateData = statesData.features.find(
    (f) => f.properties.name === stateName
  );

  if (!stateData) return null;

  return (
    <div className="w-48 h-36 bg-white rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <GeoJSON
          data={stateData}
          style={{
            fillColor: getPoliticalColor(stateName, statePolitics),
            fillOpacity: 0.7,
            weight: 1,
            color: "#fff",
          }}
        />
      </MapContainer>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs text-center">
        {stateName}
      </div>
    </div>
  );
};
