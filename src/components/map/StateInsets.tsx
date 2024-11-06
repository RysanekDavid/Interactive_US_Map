import { PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateInsetsProps {
  statePolitics: Record<string, PoliticalCategory>;
  onStateSelect?: (state: string) => void;
}

export const StateInsets = ({
  statePolitics,
  onStateSelect,
}: StateInsetsProps) => {
  // Pomocná funkce pro převod GeoJSON MultiPolygon koordinátů na SVG path
  const transformMultiPolygon = (coordinates: number[][][]): string => {
    // Převod a měřítko pro lepší viditelnost
    const scale = -50; // Záporné pro převrácení Y osy
    const translateX = 200;
    const translateY = 40;

    return coordinates
      .map((polygon) => {
        return (
          polygon
            .map((coord, i) => {
              const x = coord[0] * scale + translateX;
              const y = coord[1] * scale + translateY;
              return `${i === 0 ? "M" : "L"}${x},${y}`;
            })
            .join(" ") + "Z"
        );
      })
      .join(" ");
  };

  // Cesty k jednotlivým polygonům Aljašky
  const ALASKA_POLYGONS = [
    [
      [-162.255031, 54.978353],
      [-162.249682, 54.9759],
      [-162.235675, 54.962601],
      [-162.232962, 54.890984],
      [-162.236806, 54.88163],
      [-162.275316, 54.845565],
      [-162.282944, 54.841216],
      [-162.30058, 54.832594],
      [-162.321094, 54.827928],
      [-162.349315, 54.836049],
      [-162.326811, 54.98533],
      [-162.266743, 54.982133],
      [-162.255031, 54.978353],
    ],
    [
      [-159.324364, 54.928329],
      [-159.317681, 54.933707],
      [-159.278696, 54.948514],
      [-159.20567, 54.927438],
      [-159.324364, 54.928329],
    ],
    // Další polygony můžeš přidat zde
  ];

  return (
    <div className="absolute left-4 bottom-24 w-[300px] z-[1000]">
      {/* Alaska */}
      <div
        className="bg-white rounded-lg shadow-lg p-2 mb-2 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => onStateSelect?.("Alaska")}
      >
        <div className="text-xs text-gray-500 mb-1">AK • 3</div>
        <svg viewBox="-50 -50 300 300" className="w-full h-[150px]">
          <path
            d={transformMultiPolygon(ALASKA_POLYGONS)}
            fill={getPoliticalColor("Alaska", statePolitics)}
            stroke="white"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      {/* Hawaii */}
      <div
        className="bg-white rounded-lg shadow-lg p-2 mb-2 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => onStateSelect?.("Hawaii")}
      >
        <div className="text-xs text-gray-500 mb-1">HI • 4</div>
        <svg viewBox="0 0 100 100" className="w-full h-[80px]">
          <circle
            cx="20"
            cy="50"
            r="3"
            fill={getPoliticalColor("Hawaii", statePolitics)}
          />
          <circle
            cx="40"
            cy="50"
            r="3"
            fill={getPoliticalColor("Hawaii", statePolitics)}
          />
          <circle
            cx="60"
            cy="50"
            r="3"
            fill={getPoliticalColor("Hawaii", statePolitics)}
          />
          <circle
            cx="80"
            cy="50"
            r="3"
            fill={getPoliticalColor("Hawaii", statePolitics)}
          />
        </svg>
      </div>

      {/* Puerto Rico */}
      <div
        className="bg-white rounded-lg shadow-lg p-2 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => onStateSelect?.("Puerto Rico")}
      >
        <div className="text-xs text-gray-500 mb-1">PR</div>
        <div className="w-full h-[60px] bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">Territory</span>
        </div>
      </div>
    </div>
  );
};
