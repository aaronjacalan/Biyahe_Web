import argparse
import json
import math
from pathlib import Path
from shapely import set_precision
from shapely.geometry import box, mapping, shape
from shapely.ops import transform, unary_union

parser = argparse.ArgumentParser(description="Prepare a small neighboring-island mask from the documented geoBoundaries PHL ADM2 release.")
parser.add_argument("dataset", type=Path)
parser.add_argument("output", type=Path)
args = parser.parse_args()
names = {"Negros Occidental", "Negros Oriental", "Bohol", "Leyte", "Southern Leyte", "Masbate", "Biliran"}
data = json.loads(args.dataset.read_text(encoding="utf-8-sig"))
selected = [feature for feature in data["features"] if feature["properties"]["shapeName"] in names]
assert {feature["properties"]["shapeName"] for feature in selected} == names
# A local metric projection is adequate for this small display-only buffer.
# Buffer other islands rather than Cebu, so reclaimed Cebu coastline is intact.
x_scale = 111320 * math.cos(math.radians(10.5))
y_scale = 110574
project = lambda x, y, z=None: (x * x_scale, y * y_scale)
unproject = lambda x, y, z=None: (x / x_scale, y / y_scale)
combined = unary_union([transform(project, shape(feature["geometry"])) for feature in selected])
mask = transform(unproject, combined.buffer(300).simplify(40, preserve_topology=True))
# Keep only the part relevant to Cebu's camera/tile bounds, plus a small margin.
mask = set_precision(mask.intersection(box(123.05, 9.2, 124.8, 11.8)), 0.000001)
assert mask.is_valid
feature = {"type": "Feature", "properties": {"name": "Neighboring islands exclusion mask", "regions": sorted(names), "bufferMeters": 300, "source": "geoBoundaries gbOpen PHL ADM2, 41af8f1; NAMRIA / PSA / OCHA; CC BY 3.0 IGO"}, "geometry": mapping(mask)}
args.output.write_text(json.dumps(feature, separators=(",", ":")), encoding="utf-8")
print(f"Prepared {len(names)} neighboring regions: {args.output.stat().st_size:,} bytes")
