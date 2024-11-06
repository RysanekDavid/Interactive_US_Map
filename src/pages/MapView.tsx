import { useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { TooltipOptions } from "leaflet";
import usStatesDataRaw from "@/data/us-states.json";

import { MainLayout } from "../components/layout/MainLayout";
import { MapControls } from "../components/map/MapControls";
import { StateInset } from "../components/map/StateInset";
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

const usStatesData = usStatesDataRaw as unknown as ImportedGeoJSON;

const MapView = () => {
  const [selectedState, setSelectedState] = useState<StateFeature | null>(null);
  const [hoveredState, setHoveredState] = useState<StateFeature | null>(null);

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

      const tooltipOptions: TooltipOptions = {
        permanent: true,
        direction: "center",
        className: "state-label",
        offset: [0, 0],
      };

      layer.bindTooltip(abbr, tooltipOptions);
    }

    layer.on({
      mouseover: () => setHoveredState(feature),
      mouseout: () => setHoveredState(null),
      click: () => setSelectedState(feature),
    });
  };

  return (
    <MainLayout>
      <div className="flex-1 flex gap-6">
        {/* Map Container */}
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

            {/* Inset maps */}
            <div className="absolute left-4 bottom-4 z-[1000] space-y-2">
              <StateInset
                stateName="Alaska"
                center={[64.2008, -149.4937]}
                zoom={3}
                statesData={usStatesData}
                statePolitics={statePolitics}
              />
              <StateInset
                stateName="Hawaii"
                center={[20.7984, -156.3319]}
                zoom={6}
                statesData={usStatesData}
                statePolitics={statePolitics}
              />
            </div>

            <MapControls />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        {/* Side Panel */}
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
