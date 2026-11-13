from pathlib import Path
from bs4 import BeautifulSoup
import re, urllib.parse

ROOT = Path(__file__).resolve().parents[1]
missing = []
for html_path in ROOT.glob('*.html'):
    soup = BeautifulSoup(html_path.read_text(encoding='utf-8'), 'html.parser')
    for tag, attr in [('a', 'href'), ('img', 'src'), ('link', 'href'), ('script', 'src')]:
        for node in soup.find_all(tag):
            value = node.get(attr)
            if not value or value.startswith(('http://', 'https://', '#', 'mailto:', 'data:')):
                continue
            clean = urllib.parse.urlparse(value).path
            if not clean:
                continue
            target = (html_path.parent / clean).resolve()
            if not target.exists():
                missing.append((html_path.name, tag, value))
js = (ROOT / 'assets/js/data.js').read_text(encoding='utf-8')
for value in re.findall(r"['\"]([^'\"]+\.html(?:#[^'\"]*)?)['\"]", js):
    if value.startswith(('http://', 'https://', '#')):
        continue
    path = urllib.parse.urlparse(value).path
    if path and not (ROOT / path).exists():
        missing.append(('data.js', 'internal', value))
print('HTML files:', len(list(ROOT.glob('*.html'))))
print('Missing targets:', missing)
print('Unique missing:', len(set(item[2] for item in missing)))
raise SystemExit(1 if missing else 0)