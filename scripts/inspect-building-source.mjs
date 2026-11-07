import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";

const metadata = await fetch("https://tiles.openfreemap.org/planet").then((r) =>
  r.json(),
);
console.log(
  JSON.stringify(
    {
      maxzoom: metadata.maxzoom,
      tiles: metadata.tiles,
      fields: metadata.vector_layers.find((l) => l.id === "building"),
    },
    null,
    2,
  ),
);
for (const [name, lng, lat] of [
  ["Talisay", 123.853, 10.25],
  ["Cebu City", 123.905, 10.3184],
]) {
  const z = 14,
    n = 2 ** z,
    x = Math.floor(((lng + 180) / 360) * n),
    y = Math.floor(
      ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n,
    );
  const url = metadata.tiles[0]
    .replace("{z}", z)
    .replace("{x}", x)
    .replace("{y}", y);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const tile = new VectorTile(
    new PbfReader(new Uint8Array(await response.arrayBuffer())),
  );
  const buildings = tile.layers.building;
  const counts = {
    total: buildings?.length ?? 0,
    absent: 0,
    true: 0,
    false: 0,
    other: 0,
  };
  const samples = [];
  for (let i = 0; i < (buildings?.length ?? 0); i++) {
    const feature = buildings.feature(i);
    const hide = feature.properties.hide_3d;
    counts[
      hide === undefined
        ? "absent"
        : hide === true
          ? "true"
          : hide === false
            ? "false"
            : "other"
    ]++;
    if (samples.length < 3)
      samples.push({ id: feature.id, properties: feature.properties });
  }
  console.log(JSON.stringify({ name, counts, samples }));
}
