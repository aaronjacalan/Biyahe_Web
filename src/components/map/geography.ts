import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import { CEBU_MAP } from "./cebu-config";

export type CebuBoundary = Feature<Polygon | MultiPolygon>;

function inRing([x, y]: Position, ring: Position[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function isInCebu(point: Position, boundary: CebuBoundary) {
  const polygons =
    boundary.geometry.type === "Polygon"
      ? [boundary.geometry.coordinates]
      : boundary.geometry.coordinates;
  return polygons.some(
    ([outer, ...holes]) =>
      inRing(point, outer) && !holes.some((hole) => inRing(point, hole)),
  );
}

// Keep Cebu's coastal water, ports and reclaimed land open. The exclusions
// cover neighboring provinces, with a small precomputed shoreline buffer.
export function isInCebuCoverage(point: Position, exclusions: CebuBoundary) {
  const [lng, lat] = point;
  const [[west, south], [east, north]] = CEBU_MAP.bounds;
  return (
    lng >= west &&
    lng <= east &&
    lat >= south &&
    lat <= north &&
    !isInCebu(point, exclusions)
  );
}

// Allow labels beyond Cebu's older shoreline but not on neighboring islands.
export function coastalCoverageBoundary(
  boundary: CebuBoundary,
): Feature<Polygon> {
  const polygons =
    boundary.geometry.type === "Polygon"
      ? [boundary.geometry.coordinates]
      : boundary.geometry.coordinates;
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [120, 7],
          [128, 7],
          [128, 15],
          [120, 15],
          [120, 7],
        ],
        ...polygons.map(([outer]) => outer),
      ],
    },
  };
}
