import { ArrowRight, MapPin, Users, Calendar, Award } from "lucide-react";
import { StateFeature, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";
import { stateAbbreviations } from "../../constants/mapData";
import { stateData } from "../../constants/stateData";

interface StateInfoProps {
  selectedState: StateFeature | null;
  statePolitics: Record<string, PoliticalCategory>;
}

export const StateInfo = ({ selectedState, statePolitics }: StateInfoProps) => {
  const formatPopulation = (population: number) =>
    new Intl.NumberFormat("en-US").format(population);

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {selectedState ? (
        <>
          {/* Hlavička s symbolem státu */}
          <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {stateAbbreviations[selectedState.properties.name] || "??"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedState.properties.name}
                </h2>
                <div
                  className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm bg-white/20"
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
                <div className="font-medium">
                  {stateData[selectedState.properties.name]?.capital || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  Population
                </div>
                <div className="font-medium">
                  {formatPopulation(
                    stateData[selectedState.properties.name]?.population || 0
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  Joined Union
                </div>
                <div className="font-medium">
                  {stateData[selectedState.properties.name]?.yearJoined ||
                    "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Award className="w-4 h-4" />
                  Nickname
                </div>
                <div className="font-medium">
                  {stateData[selectedState.properties.name]?.nickname || "N/A"}
                </div>
              </div>
            </div>

            {/* Tlačítko pro více informací */}
            <button
              className="w-full mt-4 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors group"
              onClick={() =>
                window.open(
                  `/state/${selectedState.properties.name.toLowerCase()}`,
                  "_blank"
                )
              }
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
