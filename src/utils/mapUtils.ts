import { PoliticalCategory } from "../types/map";

export const getPoliticalColor = (
  political_status: PoliticalCategory
): string => {
  switch (political_status) {
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
      return "#4A5568";
    default:
      return "#CCCCCC";
  }
};

export const legendItems = [
  { label: "Silně demokratický", color: "#0000FF" }, // Solid Democratic
  { label: "Mírně demokratický", color: "#99CCFF" }, // Lean Democratic
  { label: "Kolísavý stát", color: "#FFD700" }, // Swing State
  { label: "Mírně republikánský", color: "#FFB6C1" }, // Lean Republican
  { label: "Silně republikánský", color: "#FF0000" }, // Solid Republican
];
