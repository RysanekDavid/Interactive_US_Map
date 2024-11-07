import type { Feature, Geometry, FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";

export interface StateProperties {
  name: string;
  density: number;
}

export type PoliticalCategory =
  | "solid-dem"
  | "lean-dem"
  | "swing"
  | "lean-rep"
  | "solid-rep"
  | "independent-territory";

export interface ImportedGeoJSON extends FeatureCollection {
  type: "FeatureCollection";
  features: Array<Feature<Geometry, StateProperties>>;
}

export type StateFeature = Feature<Geometry, StateProperties>;

export const USA_BOUNDS = new LatLngBounds(
  [100, -200], // Jihozápadní bod - posunutý více na jih
  [-30, 0] // Severovýchodní bod - zahrnuje celou oblast
);

export const MIN_ZOOM = 4;
export const MAX_ZOOM = 7;
