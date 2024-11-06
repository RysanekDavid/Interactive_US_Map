import { MultiPolygon, Polygon } from "geojson";

export function geoJSONToSVGPath(geometry: Polygon | MultiPolygon): string {
  const paths: string[] = [];

  if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => {
      paths.push(polygonToPath(polygon));
    });
  } else {
    paths.push(polygonToPath(geometry.coordinates));
  }

  return paths.join(" ");
}

function polygonToPath(polygonCoords: number[][][]): string {
  return polygonCoords
    .map((ring) => {
      const path = ring.map((coord, i) => {
        const [x, y] = coord;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      });
      return path.join(" ") + "Z";
    })
    .join(" ");
}
