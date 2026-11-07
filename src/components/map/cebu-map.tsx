"use client";

import { Compass, LocateFixed } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { MapControls } from "./map-canvas";

const MapCanvas = dynamic(() => import("./map-canvas"), {
  ssr: false,
  loading: () => <output className="map-message">Loading Cebu map…</output>,
});

export function CebuMap() {
  const controls = useRef<MapControls>(null);
  const [mapReady, setMapReady] = useState(false);

  return (
    <>
      <section
        id="route-finder"
        className="workspace-page map-section"
        aria-label="Route finder"
        tabIndex={-1}
      >
        <MapCanvas controls={controls} onReadyChange={setMapReady} />
      </section>
      <section
        id="info"
        className="workspace-page workspace-text-page"
        aria-labelledby="info-title"
        tabIndex={-1}
      >
        <h1 id="info-title">Info</h1>
        <p>Explore the streets, cities, and islands of Cebu in 3D.</p>
      </section>
      <section
        id="settings"
        className="workspace-page workspace-text-page"
        aria-labelledby="settings-title"
        tabIndex={-1}
      >
        <h1 id="settings-title">Settings</h1>
        <div className="map-actions">
          <button
            type="button"
            disabled={!mapReady}
            onClick={() => controls.current?.resetLocation()}
          >
            <LocateFixed size={18} aria-hidden="true" /> Return to Cebu City
          </button>
          <button
            type="button"
            disabled={!mapReady}
            onClick={() => controls.current?.pointNorth()}
          >
            <Compass size={18} aria-hidden="true" /> Point north
          </button>
        </div>
        <section
          className="map-credits map-surface"
          aria-labelledby="map-credits-title"
        >
          <h2 id="map-credits-title">Map credits</h2>
          <p>
            Tiles by <a href="https://openfreemap.org/">OpenFreeMap</a>, ©{" "}
            <a href="https://openmaptiles.org/">OpenMapTiles</a>. Map data ©{" "}
            <a href="https://www.openstreetmap.org/copyright">
              OpenStreetMap contributors
            </a>
            .
          </p>
          <p>
            Cebu boundaries from NAMRIA, PSA, and OCHA Philippines, distributed
            by <a href="https://www.geoboundaries.org/">geoBoundaries</a> under{" "}
            <a href="https://creativecommons.org/licenses/by/3.0/igo/">
              CC BY 3.0 IGO
            </a>
            .
          </p>
        </section>
      </section>
    </>
  );
}
