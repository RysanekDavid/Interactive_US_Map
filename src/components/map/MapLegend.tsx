import { legendItems } from "../../utils/mapUtils";

export const MapLegend = () => {
  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-3 text-gray-800">Legend</h3>
      <div className="space-y-2">
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
