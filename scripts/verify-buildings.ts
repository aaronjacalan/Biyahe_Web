import assert from "node:assert/strict";
import { createExpression } from "@maplibre/maplibre-gl-style-spec";
import {
  BUILDING_BASE,
  BUILDING_HEIGHT,
  BUILDING_IS_OUTLINE,
  getBuildingMetrics,
} from "../src/components/map/building-metrics";

const height = createExpression(
  BUILDING_HEIGHT,
  "layers[0].paint.fill-extrusion-height",
);
const base = createExpression(
  BUILDING_BASE,
  "layers[0].paint.fill-extrusion-base",
);
const outline = createExpression(BUILDING_IS_OUTLINE, "layers[0].filter");
assert.equal(outline.result, "success");
if (outline.result !== "success") throw new Error("Invalid outline filter");
for (const [flag, expected] of [
  [undefined, false],
  [false, false],
  [0, false],
  ["false", false],
  ["0", false],
  [true, true],
  [1, true],
  ["true", true],
  ["1", true],
] as const) {
  const properties = flag === undefined ? {} : { hide_3d: flag };
  assert.equal(
    outline.value.evaluate({ zoom: 16 }, { type: "Polygon", properties }),
    expected,
    `Building visibility must handle hide_3d=${String(flag)}`,
  );
}
assert.equal(height.result, "success");
assert.equal(base.result, "success");
if (height.result !== "success" || base.result !== "success")
  throw new Error("Invalid building expressions");

const cases = [
  {
    properties: { render_height: 42 },
    expected: { height: 42, base: 0, estimated: false },
  },
  {
    properties: { render_height: 0, height: "15" },
    expected: { height: 15, base: 0, estimated: false },
  },
  {
    properties: { render_height: -2, height: "unknown" },
    expected: { height: 8, base: 0, estimated: true },
  },
  { properties: {}, expected: { height: 8, base: 0, estimated: true } },
  {
    properties: { render_height: 5, render_min_height: 12 },
    expected: { height: 5, base: 0, estimated: false },
  },
  {
    properties: { render_height: 30, render_min_height: 10 },
    expected: { height: 30, base: 10, estimated: false },
  },
  {
    properties: { render_height: 12, render_min_height: -4 },
    expected: { height: 12, base: 0, estimated: false },
  },
];
for (const { properties, expected } of cases) {
  assert.deepEqual(getBuildingMetrics(properties), expected);
  const feature = { type: "Polygon" as const, properties };
  assert.equal(height.value.evaluate({ zoom: 16 }, feature), expected.height);
  assert.equal(base.value.evaluate({ zoom: 16 }, feature), expected.base);
  assert.ok(
    expected.height > expected.base,
    "Every extrusion must have positive volume",
  );
}
console.log(
  `Verified ${cases.length} building cases: rendered height/base agree with displayed details.`,
);
