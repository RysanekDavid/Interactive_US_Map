import { ArrowRight, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StateFeature, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";
import { stateAbbreviations } from "../../constants/mapData";
import { stateData } from "../../constants/stateData";

interface StateInfoProps {
  selectedState: StateFeature | null;
  statePolitics: Record<string, PoliticalCategory>;
}

export const StateInfo = ({ selectedState, statePolitics }: StateInfoProps) => {
  const navigate = useNavigate();
  const formatPopulation = (population: number) =>
    new Intl.NumberFormat("en-US").format(population);

  const handleViewDetails = () => {
    if (selectedState) {
      const stateName = selectedState.properties.name
        .toLowerCase()
        .replace(/\s+/g, "-");
      navigate(`/state/${stateName}`);
    }
  };

  const formatPoliticalStatus = (status: PoliticalCategory) => {
    if (status === "independent-territory") return "Independent Territory";
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full lg:w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {selectedState ? (
        <>
          {/* Hlavička s symbolem státu */}
          <div className="relative h-32 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 p-6">
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">
                  {stateAbbreviations[selectedState.properties.name] || "??"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedState.properties.name}
                </h2>
                <div
                  className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: getPoliticalColor(
                      selectedState.properties.name,
                      statePolitics
                    ),
                    color:
                      statePolitics[selectedState.properties.name] ===
                      "independent-territory"
                        ? "white"
                        : ["solid-dem", "solid-rep"].includes(
                            statePolitics[selectedState.properties.name]
                          )
                        ? "white"
                        : "black",
                  }}
                >
                  {formatPoliticalStatus(
                    statePolitics[selectedState.properties.name]
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informace o státu */}
          <div className="p-6 space-y-4">
            {/* Základní statistiky */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  Capital
                </div>
                <div className="font-medium text-gray-900">
                  {stateData[selectedState.properties.name]?.capital}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  Population
                </div>
                <div className="font-medium text-gray-900">
                  {formatPopulation(
                    stateData[selectedState.properties.name]?.population
                  )}
                </div>
              </div>
            </div>

            {/* Tlačítko pro více informací */}
            <button
              className="w-full mt-4 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2 transition-colors group"
              onClick={handleViewDetails}
            >
              View Full Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a State
          </h3>
          <p className="text-gray-500">
            Click on any state to view detailed information
          </p>
        </div>
      )}
    </div>
  );
};
