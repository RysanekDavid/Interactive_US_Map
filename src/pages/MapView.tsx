import { useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import type { Feature, Geometry, GeoJsonObject } from "geojson";
import { PathOptions, LatLngBounds, TooltipOptions } from "leaflet";
import usStatesData from "../data/us-states.json";

// Typy pro vlastnosti států
interface StateProperties {
  name: string;
  density: number;
}

// Definice politických kategorií států
type PoliticalCategory =
  | "solid-dem"
  | "lean-dem"
  | "swing"
  | "lean-rep"
  | "solid-rep";

// Mapování názvů států na zkratky
const stateAbbreviations: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

// Politická příslušnost států
const statePolitics: { [key: string]: PoliticalCategory } = {
  // Solid Democratic states
  California: "solid-dem",
  Washington: "solid-dem",
  Illinois: "solid-dem",
  "New York": "solid-dem",
  Maine: "solid-dem",

  // Lean Democratic states
  Oregon: "lean-dem",
  "New Mexico": "lean-dem",
  Colorado: "lean-dem",
  Virginia: "lean-dem",
  Minnesota: "lean-dem",

  // Swing states
  Nevada: "swing",
  Arizona: "swing",
  Wisconsin: "swing",
  Michigan: "swing",
  Pennsylvania: "swing",
  "North Carolina": "swing",
  Georgia: "swing",

  // Lean Republican states
  Florida: "lean-rep",

  // Solid Republican states
  Idaho: "solid-rep",
  Montana: "solid-rep",
  Wyoming: "solid-rep",
  Utah: "solid-rep",
  "North Dakota": "solid-rep",
  "South Dakota": "solid-rep",
  Nebraska: "solid-rep",
  Kansas: "solid-rep",
  Oklahoma: "solid-rep",
  Texas: "solid-rep",
  Missouri: "solid-rep",
  Arkansas: "solid-rep",
  Louisiana: "solid-rep",
  Mississippi: "solid-rep",
  Alabama: "solid-rep",
  Tennessee: "solid-rep",
  Kentucky: "solid-rep",
  Indiana: "solid-rep",
  Ohio: "solid-rep",
  "West Virginia": "solid-rep",
  "South Carolina": "solid-rep",
  Alaska: "solid-rep",
  Iowa: "solid-rep",
};

type StateFeature = Feature<Geometry, StateProperties>;
type StyleFunction = (
  feature: Feature<Geometry, StateProperties> | undefined
) => PathOptions;

const MapView = () => {
  const [selectedState, setSelectedState] = useState<StateFeature | null>(null);
  const [hoveredState, setHoveredState] = useState<StateFeature | null>(null);

  // Upravená konfigurace mapy pro zahrnutí Aljašky a Havaje
  const MIN_ZOOM = 2;
  const MAX_ZOOM = 8;
  const USA_BOUNDS = new LatLngBounds(
    [18.91619, -171.79111], // Jihozápadní hranice (zahrnuje Havaj)
    [71.35776, -66.96466] // Severovýchodní hranice (zahrnuje Aljašku)
  );

  // Funkce pro určení barvy podle politické příslušnosti
  const getPoliticalColor = (stateName: string): string => {
    const category = statePolitics[stateName];
    switch (category) {
      case "solid-dem":
        return "#0000FF"; // Tmavě modrá
      case "lean-dem":
        return "#99CCFF"; // Světle modrá
      case "swing":
        return "#FFD700"; // Zlatá/žlutá
      case "lean-rep":
        return "#FFB6C1"; // Světle červená
      case "solid-rep":
        return "#FF0000"; // Tmavě červená
      default:
        return "#CCCCCC"; // Šedá pro případné chybějící státy
    }
  };

  // Style funkce pro státy s memoizací
  const style: StyleFunction = useMemo(
    () => (feature) => {
      if (!feature || !feature.properties) {
        return {
          weight: 1,
          color: "#666",
          opacity: 1,
          fillColor: "#CCCCCC",
          fillOpacity: 0.6,
          dashArray: "3",
        };
      }

      const { properties } = feature;
      const isSelected = selectedState?.properties.name === properties.name;
      const isHovered = hoveredState?.properties.name === properties.name;

      return {
        weight: isSelected || isHovered ? 3 : 1,
        color: "#666",
        opacity: 1,
        fillColor: getPoliticalColor(properties.name),
        fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6,
        dashArray: isSelected ? "" : "3",
      };
    },
    [selectedState, hoveredState]
  );

  // Event handler pro interakci se státy
  const onEachFeature = (feature: StateFeature, layer: L.Layer) => {
    if (feature.properties.name) {
      const abbr =
        stateAbbreviations[feature.properties.name] || feature.properties.name;

      const tooltipOptions: TooltipOptions = {
        permanent: true,
        direction: "center",
        className: "state-label",
        offset: [0, 0] as [number, number],
      };

      layer.bindTooltip(abbr, tooltipOptions);
    }

    layer.on({
      mouseover: () => setHoveredState(feature),
      mouseout: () => setHoveredState(null),
      click: () => setSelectedState(feature),
    });
  };

  const legendItems = [
    { label: "Solid Democratic", color: "#0000FF" },
    { label: "Lean Democratic", color: "#99CCFF" },
    { label: "Swing State", color: "#FFD700" },
    { label: "Lean Republican", color: "#FFB6C1" },
    { label: "Solid Republican", color: "#FF0000" },
  ];

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-grow relative h-[calc(100vh-2rem)]">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={3}
          className="w-full h-full absolute rounded-lg shadow-lg"
          zoomControl={false}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxBounds={USA_BOUNDS}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          bounceAtZoomLimits={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            noWrap={true}
            bounds={USA_BOUNDS}
          />
          <GeoJSON
            data={usStatesData as unknown as GeoJsonObject}
            style={style}
            onEachFeature={onEachFeature}
          />
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>

      <div className="md:w-80 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4">US States Info</h2>
        {selectedState ? (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {selectedState.properties.name}
            </h3>
            <p className="text-gray-600 mb-2">
              Political Leaning:{" "}
              {statePolitics[selectedState.properties.name]
                ?.replace("-", " ")
                .toUpperCase()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Select a state to view details</p>
        )}

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Political Leaning Legend</h4>
          {legendItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
