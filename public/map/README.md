# Cebu boundary and map worker

`cebu-boundary.geojson` is the Cebu feature extracted from the simplified
geoBoundaries gbOpen PHL ADM2 release (boundary ID PHL-ADM2-2640588, commit
41af8f1). The source represents 2020 boundaries and includes Cebu's associated
islands and Metro Cebu cities. It is a visualization boundary, not a survey.

Sources: NAMRIA, PSA, OCHA Philippines, distributed through geoBoundaries.
License: CC BY 3.0 IGO; attribution is displayed under Settings → Map credits.

`neighboring-islands.geojson` unions Negros Occidental, Negros Oriental, Bohol,
Leyte, Southern Leyte, Masbate, and Biliran from the same release. Their land is
buffered by 300 m to conceal shoreline simplification differences, then clipped
to Cebu's bounds plus a 0.15-degree margin. Cebu itself is never buffered or
clipped. Only neighboring land is masked; Cebu's ports and coastal water remain
visible. No country-wide boundary file is shipped or loaded in the browser.

Regenerate offline with Shapely installed:
`python scripts/prepare-neighbor-mask.py <PHL-ADM2_simplified.geojson> public/map/neighboring-islands.geojson`.

Metadata: https://www.geoboundaries.org/api/current/gbOpen/PHL/ADM2/
Data: https://github.com/wmgeolab/geoBoundaries/raw/41af8f1/releaseData/gbOpen/PHL/ADM2/geoBoundaries-PHL-ADM2_simplified.geojson
License: https://creativecommons.org/licenses/by/3.0/igo/

`maplibre-gl-worker.mjs` is the unmodified worker shipped with installed
MapLibre GL JS 6.16.0 (BSD-3-Clause). It is self-hosted so Next.js can load the
ESM worker in development and production without bundler-specific worker loaders.
Refresh it from node_modules/maplibre-gl/dist when upgrading MapLibre.
