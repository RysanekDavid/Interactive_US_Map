import {
  ArrowRight,
  Users,
  DollarSign,
  Award,
  User,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StateFeature, PoliticalCategory } from "../../types/map";
import { getPoliticalColor } from "../../utils/mapUtils";

interface StateData {
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
  gdp_rank?: number;
}

interface StatesData {
  lastUpdated: string;
  states: StateData[];
}

interface StateInfoProps {
  selectedState: StateFeature | null;
  statesData: StatesData | null;
}

const getStateFlag = (stateName: string) => {
  return `/StateFlags/Flag_of_${stateName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_")}.svg`;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

const getStateData = (name: string, statesData: StatesData | null) => {
  if (!statesData) return null;
  return statesData.states.find((state) => state.name === name) || null;
};

const getStateAbbreviation = (name: string, statesData: StatesData | null) => {
  const state = statesData?.states.find((s) => s.name === name);
  return state?.abbreviation || "??";
};

const translateParty = (party: string) => {
  switch (party.toLowerCase()) {
    case "democrat":
      return "demokrat";
    case "republican":
      return "republikán";
    default:
      return party;
  }
};

const formatPoliticalStatus = (status: PoliticalCategory) => {
  switch (status) {
    case "solid-dem":
      return "Silně demokratický";
    case "lean-dem":
      return "Mírně demokratický";
    case "swing":
      return "Swing";
    case "lean-rep":
      return "Mírně republikánský";
    case "solid-rep":
      return "Silně republikánský";
    case "independent-territory":
      return "Nezávislé území";
    default:
      // Pokud se objeví nějaký nový status, zobrazíme ho bez úprav
      return status;
  }
};

export const StateInfo = ({ selectedState, statesData }: StateInfoProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (selectedState) {
      const stateName = selectedState.properties.name
        .toLowerCase()
        .replace(/\s+/g, "-");
      navigate(`/state/${stateName}`);
    }
  };

  const sData =
    selectedState && getStateData(selectedState.properties.name, statesData);
  const politicalStatus = sData?.political_status || "swing";

  const gdpRankText = sData?.gdp_rank ? ` (#${sData.gdp_rank})` : "";

  return (
    <div className="w-full lg:w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {selectedState ? (
        <>
          <div className="relative h-30 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 p-6">
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative flex items-center gap-4">
              <div className="w-24 h-22 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden p-2">
                <img
                  src={getStateFlag(selectedState.properties.name)}
                  alt={`Vlajka státu ${selectedState.properties.name}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <span class="text-3xl font-bold text-slate-700">
                          ${getStateAbbreviation(
                            selectedState.properties.name,
                            statesData
                          )}
                        </span>
                      `;
                    }
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedState.properties.name}
                </h2>
                <div
                  className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: getPoliticalColor(politicalStatus),
                    color: ["solid-dem", "solid-rep"].includes(politicalStatus)
                      ? "white"
                      : "black",
                  }}
                >
                  {formatPoliticalStatus(politicalStatus)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  Populace
                </div>
                <div className="font-medium text-gray-900">
                  {formatNumber(sData?.population || 0)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  Rozloha
                </div>
                <div className="font-medium text-gray-900">
                  {formatNumber(sData?.area || 0)} km²
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <DollarSign className="w-4 h-4" />
                HDP
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900">
                  {formatCurrency(sData?.gdp || 0)}
                  {gdpRankText}
                </div>
                <div className="text-sm text-gray-600">
                  Na obyvatele: {formatCurrency(sData?.gdp_per_capita || 0)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <User className="w-4 h-4" />
                Guvernér
              </div>
              <div className="font-medium text-gray-900">
                {sData?.governor_name}
                <span className="ml-2 text-sm text-gray-500">
                  {sData?.governor_party
                    ? `(${translateParty(sData.governor_party)})`
                    : ""}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Award className="w-4 h-4" />
                Počet volitelů
              </div>
              <div className="font-medium text-gray-900">
                {sData?.electoral_votes || 0}
              </div>
            </div>

            <button
              className="w-full mt-4 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2 transition-colors group"
              onClick={handleViewDetails}
            >
              Zobrazit celý detail
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
            Vyberte stát
          </h3>
          <p className="text-gray-500">
            Klikněte na libovolný stát pro zobrazení podrobných informací
          </p>
        </div>
      )}
    </div>
  );
};
