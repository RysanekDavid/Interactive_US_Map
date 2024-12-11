//src/types/map.ts
import type { Feature, Geometry, FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";

// Existující rozhraní pro mapu
export interface StateProperties {
  name: string;
  density: number;
}

// Politické kategorie
export type PoliticalCategory =
  | "solid-dem"
  | "lean-dem"
  | "swing"
  | "lean-rep"
  | "solid-rep"
  | "independent-territory";

// Nové rozhraní pro data států z BE
export interface StateData {
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
}

export interface StatesDataResponse {
  lastUpdated: string;
  states: StateData[];
}

// Existující rozhraní pro GeoJSON
export interface ImportedGeoJSON extends FeatureCollection {
  type: "FeatureCollection";
  features: Array<Feature<Geometry, StateProperties>>;
}

export type StateFeature = Feature<Geometry, StateProperties>;

// Konstanty pro mapu
export const USA_BOUNDS = new LatLngBounds(
  [75, -200], // Jihozápadní bod - posunutý více na jih
  [-30, 0] // Severovýchodní bod - zahrnuje celou oblast
);

export const MIN_ZOOM = 4;
export const MAX_ZOOM = 7;
