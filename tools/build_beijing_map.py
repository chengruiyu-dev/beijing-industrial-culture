import json, math
from pathlib import Path

ROOT = Path(r'C:\Users\xiaoy\Desktop\工业文化平台')
data = json.loads((ROOT / 'assets/data/beijing-districts.json').read_text(encoding='utf-8'))

W, H, PAD = 1200, 900, 58
xs, ys = [], []
for feature in data['features']:
    geom = feature['geometry']
    coords = geom['coordinates']
    polygons = coords if geom['type'] == 'MultiPolygon' else [coords]
    for polygon in polygons:
        for ring in polygon:
            for lng, lat in ring:
                xs.append(lng); ys.append(lat)
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)

def project(lng, lat):
    x = PAD + (lng - minx) / (maxx - minx) * (W - PAD * 2)
    y = PAD + (maxy - lat) / (maxy - miny) * (H - PAD * 2)
    return x, y

fills = ['#eee8dc', '#e8e1d4', '#f3ede2', '#e5ded0', '#ece6da', '#e1d9ca']
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         '<rect width="1200" height="900" fill="#f5f0e6"/>']
parts.append('<g fill="none" stroke="#7e867c" stroke-width="1.2" stroke-linejoin="round" opacity="0.72">')
for i, feature in enumerate(data['features']):
    geom = feature['geometry']; coords = geom['coordinates']
    polygons = coords if geom['type'] == 'MultiPolygon' else [coords]
    d = []
    for polygon in polygons:
        for ring in polygon:
            pts = [project(lng, lat) for lng, lat in ring]
            if not pts: continue
            d.append('M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ' Z')
    parts.append(f'<path d="{" ".join(d)}" fill="{fills[i % len(fills)]}"/>')
parts.append('</g>')
parts.append('<g fill="#687168" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="13" text-anchor="middle" opacity="0.78">')
for feature in data['features']:
    props = feature['properties']
    center = props.get('centroid') or props.get('center')
    if center:
        x, y = project(center[0], center[1])
        parts.append(f'<text x="{x:.1f}" y="{y:.1f}">{props.get("name", "")}</text>')
parts.append('</g>')
# subtle coordinate grid and north indicator
parts.append('<g stroke="#777f76" stroke-width="0.6" opacity="0.12">')
for x in range(150, W, 150): parts.append(f'<line x1="{x}" y1="58" x2="{x}" y2="842"/>')
for y in range(150, H, 150): parts.append(f'<line x1="58" y1="{y}" x2="1142" y2="{y}"/>')
parts.append('</g>')
parts.append('<g transform="translate(1110 92)" opacity="0.55"><path d="M0 0 L-14 38 L0 28 L14 38 Z" fill="#b54b2c"/><text x="0" y="-10" fill="#555d55" font-family="Microsoft YaHei, sans-serif" font-size="12" text-anchor="middle">N</text></g>')
parts.append('<text x="1150" y="870" text-anchor="end" fill="#7e857d" font-family="Microsoft YaHei, sans-serif" font-size="9" letter-spacing="1">北京市行政区划示意 · DataV.GeoAtlas</text>')
parts.append('</svg>')
(ROOT / 'assets/images/beijing-industrial-map.svg').write_text('\n'.join(parts), encoding='utf-8')
print('map svg written', (ROOT / 'assets/images/beijing-industrial-map.svg').stat().st_size)