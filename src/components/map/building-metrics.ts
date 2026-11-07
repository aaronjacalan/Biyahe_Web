import type { ExpressionSpecification } from "maplibre-gl";
import { CEBU_MAP } from "./cebu-config";

export const BUILDING_LAYERS = ["cebu-buildings", "cebu-building-footprints"];

// Providers may omit this flag, or encode it as false/0. Only explicit true
// values identify the overall outline of a building with separately mapped parts.
export const BUILDING_IS_OUTLINE: ExpressionSpecification = [
  "in",
  ["to-string", ["coalesce", ["get", "hide_3d"], false]],
  ["literal", ["true", "1"]],
];

const mappedHeight: ExpressionSpecification = [
  "to-number",
  ["get", "render_height"],
  0,
];
const originalHeight: ExpressionSpecification = [
  "to-number",
  ["get", "height"],
  0,
];

export const BUILDING_HEIGHT: ExpressionSpecification = [
  "case",
  [">", mappedHeight, 0],
  mappedHeight,
  [">", originalHeight, 0],
  originalHeight,
  CEBU_MAP.defaultBuildingHeight,
];

const mappedBase: ExpressionSpecification = [
  "max",
  0,
  [
    "to-number",
    ["coalesce", ["get", "render_min_height"], ["get", "min_height"], 0],
    0,
  ],
];

// Invalid bases above a roof can invert or collapse extrusion faces. Retain
// valid elevated building parts, and ground only inconsistent base values.
export const BUILDING_BASE: ExpressionSpecification = [
  "case",
  ["<", mappedBase, BUILDING_HEIGHT],
  mappedBase,
  0,
];

export function getBuildingMetrics(properties: Record<string, unknown>) {
  const renderHeight = Number(properties.render_height);
  const original = Number(properties.height);
  const mapped =
    Number.isFinite(renderHeight) && renderHeight > 0
      ? renderHeight
      : Number.isFinite(original) && original > 0
        ? original
        : null;
  const height = mapped ?? CEBU_MAP.defaultBuildingHeight;
  const rawBase = Number(
    properties.render_min_height ?? properties.min_height ?? 0,
  );
  const base =
    Number.isFinite(rawBase) && rawBase >= 0 && rawBase < height ? rawBase : 0;
  return { height, base, estimated: mapped === null };
}
