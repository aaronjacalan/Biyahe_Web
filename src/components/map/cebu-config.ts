export const CEBU_MAP = {
  center: [123.905, 10.3184] as [number, number],
  bounds: [
    [123.2, 9.35],
    [124.65, 11.65],
  ] as [[number, number], [number, number]],
  zoom: 16,
  minZoom: 14,
  maxZoom: 19,
  pitch: 58,
  minPitch: 45,
  maxPitch: 65,
  bearing: -28,
  buildingMinZoom: 13,
  defaultBuildingHeight: 8,
  outlineBuildingHeight: 3,
  styleUrl: "https://tiles.openfreemap.org/styles/liberty",
  boundaryUrl: "/map/cebu-boundary.geojson",
  exclusionsUrl: "/map/neighboring-islands.geojson",
  workerUrl: "/map/maplibre-gl-worker.mjs",
};

export const CEBU_PLACES = [
  {
    id: "cebu",
    name: "Cebu City",
    center: CEBU_MAP.center,
    zoom: CEBU_MAP.zoom,
    group: "Metro Cebu",
  },
  {
    id: "mandaue",
    name: "Mandaue City",
    center: [123.922, 10.333],
    zoom: 15.6,
    group: "Metro Cebu",
  },
  {
    id: "lapu-lapu",
    name: "Lapu-Lapu City",
    center: [123.949, 10.31],
    zoom: 15.6,
    group: "Mactan Island",
  },
  {
    id: "talisay",
    name: "Talisay City",
    center: [123.849, 10.252],
    zoom: 15.6,
    group: "Metro Cebu",
  },
  {
    id: "toledo",
    name: "Toledo City",
    center: [123.638, 10.379],
    zoom: 15.6,
    group: "Western Cebu",
  },
  {
    id: "danao",
    name: "Danao City",
    center: [124.027, 10.521],
    zoom: 15.6,
    group: "Northern Cebu",
  },
  {
    id: "carcar",
    name: "Carcar City",
    center: [123.64, 10.106],
    zoom: 15.6,
    group: "Southern Cebu",
  },
  {
    id: "bantayan",
    name: "Bantayan Island",
    center: [123.728, 11.168],
    zoom: 15,
    group: "Northern islands",
  },
  {
    id: "camotes",
    name: "Camotes Islands",
    center: [124.406, 10.647],
    zoom: 15,
    group: "Eastern islands",
  },
] satisfies {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  group: string;
}[];

export type CebuPlace = (typeof CEBU_PLACES)[number];
