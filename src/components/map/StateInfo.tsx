import { ArrowRight } from "lucide-react";
import { StateFeature, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateInfoProps {
  selectedState: StateFeature | null;
  statePolitics: Record<string, PoliticalCategory>;
}

export const StateInfo = ({ selectedState, statePolitics }: StateInfoProps) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedState ? selectedState.properties.name : "Select a State"}
        </h2>
        {selectedState && (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            onClick={() =>
              window.open(
                `/state/${selectedState.properties.name.toLowerCase()}`,
                "_blank"
              )
            }
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {selectedState ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-600">Political Leaning</span>
            <div
              className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: getPoliticalColor(
                  selectedState.properties.name,
                  statePolitics
                ),
                color: ["solid-dem", "solid-rep"].includes(
                  statePolitics[selectedState.properties.name]
                )
                  ? "white"
                  : "black",
              }}
            >
              {statePolitics[selectedState.properties.name]
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Click on a state to view detailed information
        </p>
      )}
    </div>
  );
};
