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
  PoliticalCategory,
} from "../types/map";
import { getPoliticalColor } from "../utils/mapUtils";
import * as L from "leaflet";

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

const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
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
  const [statesData, setStatesData] = useState<StatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shouldShowInsets = currentZoom <= 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/states.json");
        if (!response.ok) throw new Error("Nepodařilo se načíst data států");
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error("Nepodařilo se načíst data států:", error);
        setError(
          error instanceof Error ? error.message : "Nepodařilo se načíst data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      const state = statesData?.states.find((s) => s.name === properties.name);
      const politicalColor = state
        ? getPoliticalColor(state.political_status)
        : "#CCCCCC";

      return {
        weight: isSelected || isHovered ? 3 : 1,
        color: "#666",
        opacity: 1,
        fillColor: politicalColor,
        fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6,
        dashArray: isSelected ? "" : "3",
      };
    },
    [selectedState, hoveredState, statesData]
  );

  const getStateAbbreviation = (name: string) => {
    const state = statesData?.states.find((s) => s.name === name);
    return state?.abbreviation || name;
  };

  const onEachFeature = (feature: StateFeature, layer: L.Layer) => {
    if (feature.properties.name) {
      const abbr = getStateAbbreviation(feature.properties.name);

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
          L.DomEvent.stopPropagation(e);
          setSelectedState(feature);
        },
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítám data mapy...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center text-red-600">
            <p>Chyba při načítání dat mapy: {error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Mapa */}
        <div className="lg:col-span-9 h-[calc(100vh-10rem)] relative rounded-lg overflow-hidden shadow-lg">
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
              <div className="absolute bottom-4 left-4 hidden lg:flex flex-col gap-2 lg:gap-3">
                <div className="w-36 transition-opacity duration-300">
                  <StateInset
                    stateName="Alaska"
                    center={[67.2008, -145.4937]}
                    zoom={2}
                    geoData={usStatesData}
                    statesInfo={statesData!}
                    simplified={true}
                    onStateSelect={setSelectedState}
                  />
                </div>

                <div className="w-36 transition-opacity duration-300">
                  <StateInset
                    stateName="Hawaii"
                    center={[20.7967, -157.3319]}
                    zoom={5}
                    geoData={usStatesData}
                    statesInfo={statesData!}
                    simplified={true}
                    onStateSelect={setSelectedState}
                  />
                </div>
              </div>
            )}

            <MapControls />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        {/* Postranní panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <StateInfo selectedState={selectedState} statesData={statesData} />
          <MapLegend />
        </div>
      </div>
    </MainLayout>
  );
};

export default MapView;
