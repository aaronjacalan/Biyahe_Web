"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { RotateCcw, X } from "lucide-react";
import type { MapGeoJSONFeature, StyleSpecification } from "maplibre-gl";
import {
  Map as LibreMap,
  LngLat,
  setWorkerCount,
  setWorkerUrl,
} from "maplibre-gl";
import type { Ref } from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { BUILDING_LAYERS } from "./building-metrics";
import type { CebuPlace } from "./cebu-config";
import { CEBU_MAP, CEBU_PLACES } from "./cebu-config";
import type { CebuBoundary } from "./geography";
import { isInCebu, isInCebuCoverage } from "./geography";
import { cebuStyle } from "./map-style";

type Building = {
  name: string;
  footprint: boolean;
};
export type MapControls = {
  resetLocation: () => void;
  pointNorth: () => void;
};

type MapCanvasProps = {
  controls: Ref<MapControls>;
  onReadyChange: (ready: boolean) => void;
};

export default function MapCanvas({ controls, onReadyChange }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibreMap | null>(null);
  const boundaryRef = useRef<CebuBoundary | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [building, setBuilding] = useState<Building | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const controller = new AbortController();
    let disposed = false;
    let instance: LibreMap | null = null;
    let observer: ResizeObserver | null = null;
    let lastValidCenter = new LngLat(...CEBU_MAP.center);
    setStatus("loading");
    setError("");
    setWarning("");
    setBuilding(null);

    const timeout = window.setTimeout(() => {
      if (!disposed) {
        setError(
          "The map is taking too long to load. Check your connection and try again.",
        );
        setStatus("error");
      }
    }, 25000);

    async function initialize() {
      try {
        const [styleResponse, boundaryResponse, exclusionsResponse] =
          await Promise.all([
            fetch(CEBU_MAP.styleUrl, {
              signal: controller.signal,
              cache: attempt > 0 ? "reload" : "default",
            }),
            fetch(CEBU_MAP.boundaryUrl, {
              signal: controller.signal,
              cache: attempt > 0 ? "reload" : "default",
            }),
            fetch(CEBU_MAP.exclusionsUrl, {
              signal: controller.signal,
              cache: attempt > 0 ? "reload" : "default",
            }),
          ]);
        if (!styleResponse.ok || !boundaryResponse.ok || !exclusionsResponse.ok)
          throw new Error("Map data is unavailable. Please try again.");
        const [style, boundary, exclusions] = await Promise.all([
          styleResponse.json() as Promise<StyleSpecification>,
          boundaryResponse.json() as Promise<CebuBoundary>,
          exclusionsResponse.json() as Promise<CebuBoundary>,
        ]);
        if (disposed) return;
        boundaryRef.current = boundary;
        setWorkerUrl(CEBU_MAP.workerUrl);
        setWorkerCount(2);
        const map = new LibreMap({
          container,
          style: cebuStyle(style, exclusions),
          center: CEBU_MAP.center,
          zoom: CEBU_MAP.zoom,
          pitch: CEBU_MAP.pitch,
          bearing: CEBU_MAP.bearing,
          minZoom: CEBU_MAP.minZoom,
          maxZoom: CEBU_MAP.maxZoom,
          maxPitch: CEBU_MAP.maxPitch,
          minPitch: CEBU_MAP.minPitch,
          maxBounds: CEBU_MAP.bounds,
          renderWorldCopies: false,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
          canvasContextAttributes: { antialias: true },
          maxTileCacheSize: 80,
          cancelPendingTileRequestsWhileZooming: true,
          attributionControl: false,
          fadeDuration: 150,
          // Covers gestures, keyboard input and animations.
          // Coastal water stays open; neighboring islands stay excluded.
          transformCameraUpdate: ({ center, pitch, zoom }) => {
            if (isInCebuCoverage([center.lng, center.lat], exclusions))
              lastValidCenter = center;
            return {
              center: lastValidCenter,
              pitch: Math.max(CEBU_MAP.minPitch, pitch),
              zoom: Math.max(CEBU_MAP.minZoom, zoom),
            };
          },
        });
        instance = map;
        mapRef.current = map;
        // Some provider POIs have no matching sprite. Keep their labels and
        // substitute a tiny neutral marker without another network request.
        const fallbackIcon = new Uint8Array(12 * 12 * 4);
        for (let y = 0; y < 12; y++) {
          for (let x = 0; x < 12; x++) {
            const offset = (y * 12 + x) * 4;
            fallbackIcon.set(
              [112, 132, 96, (x - 5.5) ** 2 + (y - 5.5) ** 2 <= 16 ? 255 : 0],
              offset,
            );
          }
        }
        map.on("styleimagemissing", ({ id }) => {
          if (!map.hasImage(id))
            map.addImage(id, { width: 12, height: 12, data: fallbackIcon });
        });
        map
          .getCanvas()
          .setAttribute(
            "aria-label",
            "Interactive Cebu map. Use arrow keys to pan and plus and minus to zoom.",
          );
        map.on("load", () => {
          if (disposed) return;
          window.clearTimeout(timeout);
          setStatus("ready");
        });
        map.on("error", () => {
          if (!disposed)
            setWarning(
              "Some map details could not load. Check your connection or reload the map.",
            );
        });
        map.on("idle", () => {
          if (!disposed) setWarning("");
        });
        map.on("webglcontextlost", () => {
          if (!disposed) {
            setError(
              "The map’s graphics connection was interrupted. Reload the map to continue.",
            );
            setStatus("error");
          }
        });

        map.on("click", (event) => {
          if (
            !isInCebuCoverage([event.lngLat.lng, event.lngLat.lat], exclusions)
          ) {
            setBuilding(null);
            return;
          }
          const feature: MapGeoJSONFeature | undefined =
            map.queryRenderedFeatures(event.point, {
              layers: BUILDING_LAYERS,
            })[0];
          if (!feature) {
            setBuilding(null);
            return;
          }
          setBuilding({
            name: String(feature.properties.name || "Cebu building"),
            footprint: feature.layer.id === "cebu-building-footprints",
          });
        });
        observer = new ResizeObserver(() => map.resize());
        observer.observe(container);
      } catch (reason) {
        if (disposed) return;
        window.clearTimeout(timeout);
        setError(
          reason instanceof Error ? reason.message : "The map could not load.",
        );
        setStatus("error");
      }
    }
    void initialize();
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
      observer?.disconnect();
      instance?.remove();
      mapRef.current = null;
      boundaryRef.current = null;
    };
  }, [attempt]);

  useEffect(() => {
    onReadyChange(status === "ready");
  }, [onReadyChange, status]);

  function flyTo(destination: CebuPlace) {
    const map = mapRef.current;
    const boundary = boundaryRef.current;
    if (!map || !boundary || !isInCebu(destination.center, boundary)) return;
    setBuilding(null);
    map.flyTo({
      center: destination.center,
      zoom: destination.zoom,
      pitch: CEBU_MAP.pitch,
      minZoom: CEBU_MAP.minZoom,
      bearing: CEBU_MAP.bearing,
      duration: 1400,
    });
  }

  useImperativeHandle(controls, () => ({
    resetLocation: () => flyTo(CEBU_PLACES[0]),
    pointNorth: () => {
      mapRef.current?.easeTo({ bearing: 0, duration: 500 });
    },
  }));

  return (
    <div className="cebu-map-workspace">
      <div ref={containerRef} className="cebu-map-canvas" />

      {status === "loading" && (
        <output className="map-message map-surface">
          <span className="map-loading-dot" />
          Loading Cebu’s streets…
        </output>
      )}
      {status === "error" && (
        <div className="map-message map-surface map-error" role="alert">
          <h2>Let’s try that again.</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            <RotateCcw size={16} aria-hidden="true" /> Reload map
          </button>
        </div>
      )}
      {warning && status === "ready" && (
        <output className="map-warning map-surface">
          {warning}
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Reload
          </button>
        </output>
      )}

      {building && (
        <aside
          className="building-card map-surface"
          aria-label="Selected building"
          aria-live="polite"
        >
          <button
            className="building-close"
            type="button"
            onClick={() => setBuilding(null)}
            aria-label="Close building details"
          >
            <X size={17} />
          </button>
          <p className="map-eyebrow">BUILDING DETAILS</p>
          <h2>{building.name}</h2>
          <small>
            {building.footprint
              ? "Full building footprint shown as a low 3D foundation beneath mapped parts. "
              : ""}
            Building names depend on OpenStreetMap coverage.
          </small>
        </aside>
      )}
    </div>
  );
}
