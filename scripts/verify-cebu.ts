import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CEBU_MAP, CEBU_PLACES } from "../src/components/map/cebu-config";
import type { CebuBoundary } from "../src/components/map/geography";
import { isInCebu, isInCebuCoverage } from "../src/components/map/geography";

const boundary: CebuBoundary = JSON.parse(
  readFileSync(
    new URL("../public/map/cebu-boundary.geojson", import.meta.url),
    "utf8",
  ),
);
const exclusions: CebuBoundary = JSON.parse(
  readFileSync(
    new URL("../public/map/neighboring-islands.geojson", import.meta.url),
    "utf8",
  ),
);
for (const place of CEBU_PLACES) {
  assert.ok(
    place.zoom >= CEBU_MAP.minZoom,
    `${place.name} must keep buildings visible`,
  );
  assert.ok(
    isInCebu(place.center, boundary),
    `${place.name} must be inside the actual Cebu boundary`,
  );
  assert.ok(
    isInCebuCoverage(place.center, exclusions),
    `${place.name} must remain unmasked`,
  );
}
assert.ok(CEBU_MAP.minPitch > 0, "Camera gestures must never flatten the map");
assert.ok(CEBU_MAP.pitch >= CEBU_MAP.minPitch, "Initial view must be 3D");
assert.ok(
  CEBU_MAP.buildingMinZoom <= CEBU_MAP.minZoom,
  "Buildings must remain visible at every allowed zoom",
);
for (const [name, point] of [
  ["Manila", [120.984, 14.599]],
  ["Bohol / Tagbilaran", [123.853, 9.65]],
  ["Negros / San Carlos", [123.409, 10.48]],
  ["Leyte / Ormoc", [124.608, 11.006]],
  ["Masbate", [123.624, 12.367]],
] as const) {
  assert.equal(
    isInCebu([...point], boundary),
    false,
    `${name} must be excluded even if inside the rectangular camera bounds`,
  );
  assert.equal(
    isInCebuCoverage([...point], exclusions),
    false,
    `${name} must remain masked and inaccessible`,
  );
}
for (const [name, point] of [
  ["Talisay shoreline", [123.853, 10.244]],
  ["Cebu coastal water and reclamation", [123.88, 10.26]],
  ["Mactan channel", [123.937, 10.316]],
] as const) {
  assert.ok(
    isInCebuCoverage([...point], exclusions),
    `${name} must stay open beyond the old shoreline`,
  );
}
const polygons =
  boundary.geometry.type === "MultiPolygon"
    ? boundary.geometry.coordinates
    : [boundary.geometry.coordinates];
for (const polygon of polygons) {
  for (const ring of polygon) {
    for (const [lng, lat] of ring) {
      assert.ok(
        isInCebuCoverage([lng, lat], exclusions),
        "Neighboring-island masks must never overlap Cebu's shoreline or islands",
      );
      assert.ok(
        lng >= CEBU_MAP.bounds[0][0] &&
          lng <= CEBU_MAP.bounds[1][0] &&
          lat >= CEBU_MAP.bounds[0][1] &&
          lat <= CEBU_MAP.bounds[1][1],
        "Cebu islands must fit within the configured camera and tile bounds",
      );
    }
  }
}
console.log(
  `Verified ${CEBU_PLACES.length} Cebu destinations, excluded nearby provinces, and checked all island boundary coordinates.`,
);
