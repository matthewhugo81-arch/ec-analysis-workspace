# EC Analysis Workspace

A compact browser workspace for ECMWF forecast analysis and European weather observations.

Live workspace: https://matthewhugo81-arch.github.io/ec-analysis-workspace/

## Views

- Four-panel analysis: 400 hPa PV, 300 hPa jet, 500 hPa geopotential, and MSLP / T850 / six-hour precipitation.
- Run consistency: four model cycles aligned to the same valid time, with a chart selector for 400 hPa PV, MSLP / T850 / six-hour precipitation, 500 hPa height / thickness, 300 hPa jet / height, or 700 hPa humidity / vertical motion. Precipitation starts at +006h; unavailable leads are marked without shifting the shared valid time.
- PV and water vapour: forecast PV beside the latest satellite animation.
- OPERA radar: CIRRUS radar beside infrared satellite imagery, with radar frame controls and independent image zoom and pan.

Water-vapour and infrared loops use individual timestamped PNG archives, with Play/Pause, previous/next frame, timeline, Latest and Refresh controls. Pause stops the playback timer and preserves the selected observation even during refresh. Satellite and radar observations have independent timestamps and are not automatically synchronized with forecasts.

## Run locally

Open `index.html` in a modern browser, or serve this directory using any static HTTP server. No installation or build step is required. Internet access is needed for live imagery. Radar requests require browser support for `fetch` and `AbortSignal.timeout`.

## Files

- `index.html`: interface and controls.
- `style.css`: compact responsive layout.
- `satellite.js`: independent WV and IR still-image playback, bounded archive loading and UTC timestamps.
- `dates.js`: shared UTC weekday, ordinal date and image timing labels.
- `app.js`: forecast URLs, run alignment, radar playback, satellite pause, zoom and pan.

## Data sources

- ECMWF forecast charts: [Icelandic Met Office](https://spakort.vedur.is/).
- Water-vapour and infrared imagery: [Meteociel](https://www.meteociel.fr/).
- Radar: [EUMETNET OPERA / CIRRUS](https://www.eumetnet.eu/observations/opera-radar-animation/), served by FMI.

Imagery is loaded directly from providers and is not included in this repository. Provider attribution, availability, retention and usage terms apply. Older model frames may be unavailable.

## Chart dates

Each forecast image has a prominent valid-time strip, for example **Sat 10th Oct · 06:00 UTC**, with its model run date and forecast lead underneath. Run consistency keeps the same valid time across all four panels, while clearly identifying each earlier run. These labels remain visible with controls hidden and in expanded charts. Radar and satellite panels show their own observation dates in the same format. All labels use UTC; hovering over a date also shows the year.

## Controls

Use the shared run date, cycle and forecast lead controls for model analysis. Arrow keys step six forecast hours, or one radar observation when the radar tab is active. Radar and forecast playback operate independently. Each radar/infrared panel supports mouse-wheel zoom, drag-to-pan and Fit to restore its complete image. Satellite pause controls remain independent of radar playback.

The compact toolbar combines forecast timing and the timeline on wide screens. Use Hide controls in the title bar to maximize chart space, and Show controls to restore the toolbar. Chart selection and forecast time are preserved; playback and arrow-key stepping continue to work.
