# EC Analysis Workspace

A compact browser workspace for ECMWF forecast analysis and European weather observations.

Live workspace: https://ec-analysis-workspace.matthugo81.chatgpt.site (access restricted by the owner).

## Views

- Four-panel analysis: 400 hPa PV, 300 hPa jet, 500 hPa geopotential, and MSLP / T850 / six-hour precipitation.
- Run consistency: four model cycles aligned to the same valid time.
- PV and water vapour: forecast PV beside the latest satellite animation.
- OPERA radar: CIRRUS radar beside infrared satellite imagery, with radar frame controls and independent image zoom and pan.

Water-vapour and infrared animations include Pause / Resume controls. Pause captures the displayed frame for inspection; Resume returns to the running animation. Satellite and radar observations have independent timestamps and are not automatically synchronized with forecasts.

## Run locally

Open `index.html` in a modern browser, or serve this directory using any static HTTP server. No installation or build step is required. Internet access is needed for live imagery. Radar requests require browser support for `fetch` and `AbortSignal.timeout`.

## Files

- `index.html`: interface and controls.
- `style.css`: compact responsive layout.
- `app.js`: forecast URLs, run alignment, radar playback, satellite pause, zoom and pan.

## Data sources

- ECMWF forecast charts: [Icelandic Met Office](https://spakort.vedur.is/).
- Water-vapour and infrared imagery: [Meteociel](https://www.meteociel.fr/).
- Radar: [EUMETNET OPERA / CIRRUS](https://www.eumetnet.eu/observations/opera-radar-animation/), served by FMI.

Imagery is loaded directly from providers and is not included in this repository. Provider attribution, availability, retention and usage terms apply. Older model frames may be unavailable.

## Controls

Use the shared run date, cycle and forecast lead controls for model analysis. Arrow keys step six forecast hours, or one radar observation when the radar tab is active. Radar and forecast playback operate independently. Each radar/infrared panel supports mouse-wheel zoom, drag-to-pan and Fit to restore its complete image. Satellite pause controls remain independent of radar playback.
