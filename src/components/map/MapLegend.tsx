//src/components/map/MapLegend.tsx
import { legendItems } from "../../utils/mapUtils";

export const MapLegend = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold mb-4 text-gray-800">Legenda</h3>
      <div className="space-y-3">
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
