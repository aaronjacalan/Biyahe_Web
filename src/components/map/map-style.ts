import type { FilterSpecification, StyleSpecification } from "maplibre-gl";
import {
  BUILDING_BASE,
  BUILDING_HEIGHT,
  BUILDING_IS_OUTLINE,
} from "./building-metrics";
import { CEBU_MAP } from "./cebu-config";
import type { CebuBoundary } from "./geography";
import { coastalCoverageBoundary } from "./geography";

export const MAP_COLORS = {
  water: "#d4e3df",
  land: "#e9e7de",
  road: "#b6c69c",
  white: "#faf7ef",
};

export function cebuStyle(
  style: StyleSpecification,
  exclusions: CebuBoundary,
): StyleSpecification {
  const coverage = coastalCoverageBoundary(exclusions);
  delete style.sources.ne2_shaded;
  const source = style.sources.openmaptiles;
  if (source?.type !== "vector")
    throw new Error("The map provider changed its vector source.");
  source.bounds = [...CEBU_MAP.bounds[0], ...CEBU_MAP.bounds[1]];
  source.minzoom = CEBU_MAP.minZoom;
  style.light = {
    anchor: "viewport",
    color: "#ffffff",
    intensity: 0.36,
    position: [1.5, 210, 35],
  };

  const labelIds = new Set([
    "highway-name-minor",
    "highway-name-major",
    "label_city",
    "label_town",
    "label_village",
    "poi_r1",
  ]);
  style.layers = style.layers.filter((layer) => {
    if (layer.type === "raster") return false;
    if (
      "source-layer" in layer &&
      ["building", "boundary"].includes(layer["source-layer"] ?? "")
    )
      return false;
    return layer.type !== "symbol" || labelIds.has(layer.id);
  });

  for (const layer of style.layers) {
    if (layer.type === "background")
      layer.paint = { "background-color": MAP_COLORS.land };
    if (layer.type === "fill") {
      const water = layer["source-layer"] === "water";
      const color = water
        ? MAP_COLORS.water
        : layer.id.includes("hospital")
          ? "#e9e3d8"
          : layer.id.includes("sand")
            ? "#efe8d3"
            : layer.id.includes("park")
              ? "#dbe2cf"
              : "#e2e4d9";
      layer.paint = { "fill-color": color, "fill-opacity": water ? 1 : 0.75 };
    }
    if (layer.type === "line") {
      const major = /motorway|trunk|primary|secondary|tertiary/.test(layer.id);
      const casing = layer.id.includes("casing");
      const water = layer["source-layer"] === "waterway";
      layer.paint = {
        ...layer.paint,
        "line-color": water
          ? MAP_COLORS.water
          : casing
            ? "#bfc6b6"
            : major
              ? MAP_COLORS.road
              : MAP_COLORS.white,
        "line-opacity": 1,
      };
      delete layer.paint["line-pattern"];
    }
    if (layer.type === "symbol") {
      const road = layer.id.startsWith("highway");
      layer.minzoom = road
        ? layer.id.includes("minor")
          ? 17
          : 16
        : layer.id === "poi_r1"
          ? 17.5
          : 14;
      layer.layout = { ...layer.layout, "text-padding": 10 };
      delete layer.layout["icon-image"];
      layer.paint = {
        "text-color": "#48553f",
        "text-halo-color": "#faf7ef",
        "text-halo-width": 1.5,
        "text-halo-blur": 0.5,
        "text-opacity": 0.9,
      };
      layer.filter = [
        "all",
        layer.filter ?? true,
        ["within", coverage],
      ] as FilterSpecification;
    }
  }

  const symbols = style.layers.filter((layer) => layer.type === "symbol");
  style.layers = style.layers.filter((layer) => layer.type !== "symbol");
  // Overall OSM building outlines were previously hidden. Draw a low foundation
  // beneath their detailed parts, so incomplete part coverage cannot erase the
  // rest of the mapped footprint or swallow the taller mapped geometry.
  style.layers.push({
    id: "cebu-building-footprints",
    type: "fill-extrusion",
    source: "openmaptiles",
    "source-layer": "building",
    minzoom: CEBU_MAP.buildingMinZoom,
    filter: BUILDING_IS_OUTLINE,
    paint: {
      "fill-extrusion-color": "#b1bda5",
      "fill-extrusion-height": [
        "min",
        BUILDING_HEIGHT,
        CEBU_MAP.outlineBuildingHeight,
      ],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 1,
      "fill-extrusion-vertical-gradient": true,
    },
  });
  style.layers.push({
    id: "cebu-buildings",
    type: "fill-extrusion",
    source: "openmaptiles",
    "source-layer": "building",
    minzoom: CEBU_MAP.buildingMinZoom,
    filter: ["!", BUILDING_IS_OUTLINE],
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        BUILDING_HEIGHT,
        0,
        "#b1bda5",
        20,
        "#a8b79c",
        80,
        "#a0b394",
        200,
        "#8da883",
      ],
      "fill-extrusion-height": BUILDING_HEIGHT,
      "fill-extrusion-base": BUILDING_BASE,
      "fill-extrusion-opacity": 1,
      "fill-extrusion-vertical-gradient": true,
    },
  });

  style.sources["cebu-mask"] = {
    type: "geojson",
    data: exclusions,
  };
  // Only cover neighboring islands; never cut along Cebu's old shoreline.
  style.layers.push(
    {
      id: "cebu-mask",
      type: "fill",
      source: "cebu-mask",
      paint: { "fill-color": MAP_COLORS.water, "fill-antialias": false },
    },
    ...symbols,
  );
  return style;
}
