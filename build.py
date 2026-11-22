"""Produce a single dependency-free HTML file, including the original references."""
import base64
from pathlib import Path

root = Path(__file__).resolve().parent
html = (root / 'src/index.html').read_text()
app = (root / 'src/app.js').read_text()
for token, name in [('CHART_DATA', 'alphabet.jpg'), ('SAMPLE_DATA', 'sample.jpg')]:
    data = base64.b64encode((root / 'references' / name).read_bytes()).decode()
    html = html.replace(f'../references/{name}', 'data:image/jpeg;base64,' + data)
html = html.replace('/* STYLES */', (root / 'src/style.css').read_text())
html = html.replace('/* ENGINE */', (root / 'src/engine.js').read_text())
html = html.replace('/* APP */', app)
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist/index.html').write_text(html)
print(f'Built dist/index.html ({len(html):,} characters; works offline)')
