// src/components/map/MapControls.tsx

import { useCallback } from "react";
import { useMap } from "react-leaflet";
import { Maximize } from "lucide-react";
import { USA_BOUNDS } from "../../types/map";

export const MapControls = () => {
  const map = useMap();

  const fitUSA = useCallback(() => {
    map.fitBounds(USA_BOUNDS);
  }, [map]);

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
      <button
        className="bg-white hover:bg-gray-100 shadow-lg p-2 rounded-lg transition-colors"
        onClick={fitUSA}
      >
        <Maximize className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};
