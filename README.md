# Media assets

Drop the following files here (referenced by `index.html` / `app.js`):

| File | Used in | Notes |
|------|---------|-------|
| `logo_nus.png` | Overview | ~52px tall |
| `logo_toronto.png` | Overview | ~44px tall |
| `logo_stengg.png` | Overview | ~26px tall |
| `fig1_overview.jpeg` | Overview figure | aspect 4000×1990 |
| `demo-cam.mp4` | Demo | robot camera, ~13.7s, muted |
| `demo-plot.mp4` | Demo | synced plot, ~13.6s |
| `workflow_1.jpeg` … `workflow_4.jpeg` | Method carousel | aspect 960×341 |

The page renders and is fully interactive without these; missing media simply shows broken-image placeholders until added.

```bash
python3 -m http.server
```
