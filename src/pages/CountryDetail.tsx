// src/pages/CountryDetail.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { stateAbbreviations, statePolitics } from "../constants/mapData";
import { stateData } from "../constants/stateData";
import { StateEditor } from "../components/editor/StateEditor";

interface Section {
  id: string;
  title: string;
  content: string;
}

const CountryDetail = () => {
  const { name } = useParams<{ name: string }>();

  const countryName = Object.keys(stateData).find(
    (state) => state.toLowerCase().replace(/\s+/g, "-") === name
  );

  const defaultSections = (name: string) => [
    {
      id: "1",
      title: "History",
      content: `<h1>History of ${name}</h1><p>Add historical information here...</p>`,
    },
    {
      id: "2",
      title: "Economy",
      content: `<h1>Economy of ${name}</h1><p>Add economic information here...</p>`,
    },
    {
      id: "3",
      title: "Culture",
      content: `<h1>Culture of ${name}</h1><p>Add cultural information here...</p>`,
    },
  ];

  const [sections, setSections] = useState<Section[]>(
    countryName ? defaultSections(countryName) : []
  );
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  if (!countryName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            State not found
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

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      setSections([
        ...sections,
        {
          id: Date.now().toString(),
          title: newSectionTitle,
          content: `<h1>${newSectionTitle}</h1><p>Add content here...</p>`,
        },
      ]);
      setNewSectionTitle("");
      setIsAddingSection(false);
    }
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const handleSaveContent = (sectionId: string, content: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      )
    );
    // Tady by byl API call pro uložení
    console.log(`Saving section ${sectionId}:`, content);
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

        {/* Sekce s editory */}
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.id} className="relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
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
              <StateEditor
                initialContent={section.content}
                onSave={(content) => handleSaveContent(section.id, content)}
              />
            </section>
          ))}

          {/* Přidání nové sekce */}
          {isAddingSection ? (
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section title..."
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleAddSection()}
              />
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
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
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-5 h-5" />
              Add New Section
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
