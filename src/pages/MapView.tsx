import { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";
import usStatesDataRaw from "@/data/us-states.json";
import { StateInset } from "../components/map/StateInset";
import { MainLayout } from "../components/layout/MainLayout";
import { MapControls } from "../components/map/MapControls";
import { StateInfo } from "../components/map/StateInfo";
import { MapLegend } from "../components/map/MapLegend";
import {
  StateFeature,
  ImportedGeoJSON,
  MIN_ZOOM,
  MAX_ZOOM,
  USA_BOUNDS,
} from "../types/map";
import { getPoliticalColor } from "../utils/mapUtils";
import { stateAbbreviations, statePolitics } from "../constants/mapData";
import * as L from "leaflet";
// Click handler component to detect clicks outside states
const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      // Only trigger if the click wasn't on a state (prevented default)
      if (!e.originalEvent.defaultPrevented) {
        onMapClick();
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

// Existing ZoomListener component remains the same
const ZoomListener = ({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
};

const usStatesData = usStatesDataRaw as unknown as ImportedGeoJSON;

const MapView = () => {
  const [selectedState, setSelectedState] = useState<StateFeature | null>(null);
  const [hoveredState, setHoveredState] = useState<StateFeature | null>(null);
  const [currentZoom, setCurrentZoom] = useState(3);

  const shouldShowInsets = currentZoom <= 5;

  // Handler for clicks outside states
  const handleMapClick = () => {
    setSelectedState(null);
  };

  const style = useMemo(
    () => (feature: StateFeature | undefined) => {
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
        fillColor: getPoliticalColor(properties.name, statePolitics),
        fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6,
        dashArray: isSelected ? "" : "3",
      };
    },
    [selectedState, hoveredState]
  );

  const onEachFeature = (feature: StateFeature, layer: L.Layer) => {
    if (feature.properties.name) {
      const abbr =
        stateAbbreviations[feature.properties.name] || feature.properties.name;

      layer.bindTooltip(abbr, {
        permanent: true,
        direction: "center",
        className: "state-label",
        offset: [0, 0],
      });

      layer.on({
        mouseover: () => setHoveredState(feature),
        mouseout: () => setHoveredState(null),
        click: (e) => {
          // Prevent the click from bubbling to the map
          L.DomEvent.stopPropagation(e);
          setSelectedState(feature);
        },
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 flex gap-6">
        <div className="flex-grow relative rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={3}
            className="w-full h-full"
            zoomControl={false}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            maxBounds={USA_BOUNDS}
            maxBoundsViscosity={1.0}
            worldCopyJump={false}
            bounceAtZoomLimits={false}
          >
            <ZoomListener onZoomChange={setCurrentZoom} />
            <MapClickHandler onMapClick={handleMapClick} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
              bounds={USA_BOUNDS}
              className="map-tiles"
            />
            <GeoJSON
              data={usStatesData}
              style={style}
              onEachFeature={onEachFeature}
            />

            {shouldShowInsets && (
              <>
                <div className="absolute bottom-4 left-4 transition-opacity duration-300">
                  <StateInset
                    stateName="Alaska"
                    center={[67.2008, -145.4937]}
                    zoom={2}
                    statesData={usStatesData}
                    statePolitics={statePolitics}
                    simplified={true}
                    onStateSelect={setSelectedState}
                  />
                </div>

                <div className="absolute bottom-40 left-4 transition-opacity duration-300">
                  <StateInset
                    stateName="Hawaii"
                    center={[20.7967, -157.3319]}
                    zoom={5}
                    statesData={usStatesData}
                    statePolitics={statePolitics}
                    simplified={true}
                    onStateSelect={setSelectedState}
                  />
                </div>

                <div className="absolute bottom-72 left-4 transition-opacity duration-300">
                  <StateInset
                    stateName="Puerto Rico"
                    center={[18.2208, -66.3901]}
                    zoom={7}
                    statesData={usStatesData}
                    statePolitics={statePolitics}
                    simplified={true}
                    onStateSelect={setSelectedState}
                  />
                </div>
              </>
            )}

            <MapControls />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        <div>
          <StateInfo
            selectedState={selectedState}
            statePolitics={statePolitics}
          />
          <MapLegend />
        </div>
      </div>
    </MainLayout>
  );
};

export default MapView;
