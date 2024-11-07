// V types/map.ts - přidat novou kategorii
export type PoliticalCategory =
  | "solid-dem"
  | "lean-dem"
  | "swing"
  | "lean-rep"
  | "solid-rep"
  | "independent-territory";

// V mapUtils.ts - upravit funkci pro barvy
export const getPoliticalColor = (
  stateName: string,
  statePolitics: Record<string, PoliticalCategory>
): string => {
  const category = statePolitics[stateName];
  switch (category) {
    case "solid-dem":
      return "#0000FF";
    case "lean-dem":
      return "#99CCFF";
    case "swing":
      return "#FFD700";
    case "lean-rep":
      return "#FFB6C1";
    case "solid-rep":
      return "#FF0000";
    case "independent-territory":
      return "#4A5568"; // tmavě šedá
    default:
      return "#CCCCCC";
  }
};

export const legendItems = [
  { label: "Solid Democratic", color: "#0000FF" },
  { label: "Lean Democratic", color: "#99CCFF" },
  { label: "Swing State", color: "#FFD700" },
  { label: "Lean Republican", color: "#FFB6C1" },
  { label: "Solid Republican", color: "#FF0000" },
  { label: "Independent Territory", color: "#4A5568" },
];

// V mapData.ts - aktualizovat data pro Puerto Rico
export const statePolitics: { [key: string]: PoliticalCategory } = {
  "Puerto Rico": "independent-territory",
};
