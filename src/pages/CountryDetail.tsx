// src/pages/CountryDetail.tsx
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { stateAbbreviations, statePolitics } from "../constants/mapData";
import { stateData } from "../constants/stateData";
import { StateEditor } from "../components/editor/StateEditor";

interface CountryContent {
  history: string;
  economy: string;
  culture: string;
}

// Simulace načtení dat (v reálné aplikaci by bylo z API)
const getCountryContent = (countryName: string): CountryContent => ({
  history: `<h1>History of ${countryName}</h1><p>Add historical information here...</p>`,
  economy: `<h1>Economy of ${countryName}</h1><p>Add economic information here...</p>`,
  culture: `<h1>Culture of ${countryName}</h1><p>Add cultural information here...</p>`,
});

const CountryDetail = () => {
  const { name } = useParams<{ name: string }>();

  const countryName = Object.keys(stateData).find(
    (state) => state.toLowerCase().replace(/\s+/g, "-") === name
  );

  if (!countryName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Country not found
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  const countryInfo = stateData[countryName];
  const countryAbbr = stateAbbreviations[countryName];
  const politics = statePolitics[countryName];
  const countryContent = getCountryContent(countryName);

  const handleSaveContent = (
    section: keyof CountryContent,
    content: string
  ) => {
    // Tady by byl API call pro uložení obsahu
    console.log(`Saving ${section} content for ${countryName}:`, content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigace zpět */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>

        {/* Hlavní content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800">
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative h-full flex items-center px-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-700">
                    {countryAbbr}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {countryName}
                  </h1>
                  <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white">
                    {politics === "independent-territory"
                      ? "Independent Territory"
                      : politics
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Základní info */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">
                      Capital
                    </dt>
                    <dd className="mt-1 text-lg font-medium text-gray-900">
                      {countryInfo.capital}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">
                      Population
                    </dt>
                    <dd className="mt-1 text-lg font-medium text-gray-900">
                      {new Intl.NumberFormat("en-US").format(
                        countryInfo.population
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Editory pro různé sekce */}
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">History</h2>
            <StateEditor
              initialContent={countryContent.history}
              onSave={(content) => handleSaveContent("history", content)}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Economy</h2>
            <StateEditor
              initialContent={countryContent.economy}
              onSave={(content) => handleSaveContent("economy", content)}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Culture</h2>
            <StateEditor
              initialContent={countryContent.culture}
              onSave={(content) => handleSaveContent("culture", content)}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
