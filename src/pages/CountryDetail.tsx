import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { getPoliticalColor } from "../utils/mapUtils";
import { PoliticalCategory } from "../types/map";
import { StateEditor } from "../components/editor/StateEditor";
import { fetchWithRetry } from "../utils/api";

interface Section {
  id: string;
  title: string;
  content: string;
}

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
  gdp_rank?: number; // pro zobrazení ranku HDP
}

interface StateDetailData {
  lastUpdated: string;
  states: {
    [key: string]: {
      sections: Section[];
    };
  };
}

interface StatesData {
  lastUpdated: string;
  states: StateData[];
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

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

const translatePoliticalStatus = (status: PoliticalCategory): string => {
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
      return "Nezávislé teritorium";
    default:
      return status;
  }
};

const CountryDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [statesData, setStatesData] = useState<StatesData | null>(null);

  const countryName = statesData?.states.find(
    (state) => state.name.toLowerCase().replace(/\s+/g, "-") === name
  )?.name;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Načteme states.json normálně
        const statesResponse = await fetch("/data/states.json");
        const statesJson: StatesData = await statesResponse.json();
        setStatesData(statesJson);

        if (!name) return;

        const foundState = statesJson.states.find(
          (s) => s.name.toLowerCase().replace(/\s+/g, "-") === name
        );

        if (!foundState) {
          throw new Error(`Stát nenalezen: ${name}`);
        }

        setStateData(foundState);

        // Načteme statesDetail.json z BE s retry logikou
        const detailResponse = await fetchWithRetry(
          `${import.meta.env.VITE_API_URL}/api/states/statesDetail`
        );
        const detailData: StateDetailData = await detailResponse.json();
        const stateDetail = detailData.states[foundState.name];

        setSections(stateDetail?.sections || []);
      } catch (error) {
        console.error("Nepodařilo se načíst data o státu:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Server je momentálně nedostupný, zkuste to prosím za chvíli"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const saveUpdatedSections = async (updatedSections: Section[]) => {
    if (!countryName) return;

    try {
      // Načteme aktuální data z BE s retry logikou
      const detailResponse = await fetchWithRetry(
        `${import.meta.env.VITE_API_URL}/api/states/statesDetail`
      );
      const detailData: StateDetailData = await detailResponse.json();

      // Připravíme aktualizovaná data
      const updatedDetailData = {
        ...detailData,
        states: {
          ...detailData.states,
          [countryName]: {
            sections: updatedSections,
          },
        },
        lastUpdated: new Date().toISOString(),
      };

      // Pošleme aktualizaci na BE s retry logikou
      const saveResponse = await fetchWithRetry(
        `${import.meta.env.VITE_API_URL}/api/states/updateDetail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDetailData),
        }
      );

      if (!saveResponse.ok) {
        throw new Error(
          "Server je momentálně nedostupný, zkuste to prosím za chvíli"
        );
      }

      setSections(updatedSections);
    } catch (error) {
      console.error("Nepodařilo se uložit sekce:", error);
      throw new Error(
        "Server je momentálně nedostupný, zkuste to prosím za chvíli"
      );
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !countryName) return;

    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      content: `<h1>${newSectionTitle}</h1><p>Zde přidejte obsah...</p>`,
    };

    try {
      const updatedSections = [...sections, newSection];
      await saveUpdatedSections(updatedSections);
      setNewSectionTitle("");
      setIsAddingSection(false);
    } catch (error) {
      console.error("Nepodařilo se uložit novou sekci:", error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!countryName) return;

    try {
      const updatedSections = sections.filter((section) => section.id !== id);
      await saveUpdatedSections(updatedSections);
    } catch (error) {
      console.error("Nepodařilo se smazat sekci:", error);
    }
  };

  const handleSaveContent = async (sectionId: string, content: string) => {
    if (!countryName) return;

    try {
      const updatedSections = sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      );
      await saveUpdatedSections(updatedSections);
    } catch (error) {
      console.error("Nepodařilo se uložit obsah:", error);
    }
  };

  if (!stateData || !countryName) {
    if (!loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Stát nenalezen
            </h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Zpět na mapu
            </Link>
          </div>
        </div>
      );
    }
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám data o státu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  const gdpRankText = stateData.gdp_rank ? ` (#${stateData.gdp_rank})` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na mapu
        </Link>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítám data o státu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            {/* Hlavička státu */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative h-48 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800">
                <div className="absolute inset-0 bg-black/5" />
                <div className="relative h-full flex items-center px-8">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden p-2">
                      <img
                        src={`/StateFlags/Flag_of_${stateData.name
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join("_")}.svg`}
                        alt={`Vlajka státu ${stateData.name}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <span class="text-5xl font-bold text-slate-700">
                                ${stateData.abbreviation}
                              </span>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2">
                        {stateData.name}
                      </h1>
                      <div
                        className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: getPoliticalColor(
                            stateData.political_status
                          ),
                          color: ["solid-dem", "solid-rep"].includes(
                            stateData.political_status
                          )
                            ? "white"
                            : "black",
                        }}
                      >
                        {translatePoliticalStatus(stateData.political_status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid s daty o státu */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">HDP</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(stateData.gdp)}
                      {gdpRankText}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Na obyvatele: {formatCurrency(stateData.gdp_per_capita)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Populace</div>
                    <div className="text-xl font-bold">
                      {formatNumber(stateData.population)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Rozloha</div>
                    <div className="text-xl font-bold">
                      {formatNumber(stateData.area)} km²
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Guvernér</div>
                    <div className="text-xl font-bold">
                      {stateData.governor_name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {translateParty(stateData.governor_party)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Počet volitelů
                    </div>
                    <div className="text-xl font-bold">
                      {stateData.electoral_votes}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sekce obsahu */}
            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                    {sections.length > 1 && (
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    <StateEditor
                      initialContent={section.content}
                      onSave={(content) =>
                        handleSaveContent(section.id, content)
                      }
                    />
                  </div>
                </section>
              ))}

              {isAddingSection ? (
                <div className="flex items-center gap-4 bg-white rounded-lg shadow-lg p-4">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Název sekce..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={handleAddSection}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Přidat
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingSection(false);
                      setNewSectionTitle("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingSection(true)}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Přidat novou sekci
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountryDetail;
