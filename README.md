# Strawberry Cover Watch

Fayette County North (SPIN / Lexington 6 N) strawberry fall row-cover decision-support prototype.

## Run locally

Requires Python 3 and a browser; no package installation or build required.

    python -m http.server 8000

Open http://localhost:8000. Internet access is required for station data. Serve via HTTP rather than double-clicking index.html because the app uses JavaScript modules.

## Move to GitHub

Create an empty repository, extract this ZIP, and upload these files to its root (or commit and push them with Git). No hosting or deployment workflow is included. GitHub Pages need not be enabled.

## Files

- index.html: interface, styling, guidance, student activity
- app.js: station retrieval, chart, historical review, CSV export
- logic.js: daily data extraction and rolling calculations

## Data and methods

Data: Kentucky Mesonet at WKU. Station SPIN, local days America/New_York.
Manifest: https://d266k7wxhw6o23.cloudfront.net/daily/SPIN/manifest.json
Station summary: https://www.kymesonet.org/data/summary/SPIN

Observed mean uses TAIR Avg_Val converted Celsius to Fahrenheit. Optional midpoint uses (high+low)/2. Weekly values average seven daily values; comparisons use unrounded temperatures. Today is excluded. Source validity flag and at least 90% coverage are required. Missing/invalid days prevent a weekly result and break streaks. The 90% coverage requirement is a prototype design choice.

The 50 F threshold is a fall plasticulture decision cue, not an automatic cover recommendation or frost warning. Assess acclimation and forecasts. Guidance: UK Fruit Facts, November-December 2024:
https://horticulture.mgcafe.uky.edu/sites/horticulture.ca.uky.edu/files/November-December%202024%20Fruit%20Facts.pdf

## Alerts

The code refreshes on page load or button press and does not send background alerts. A separate ChatGPT automation was configured for Brent; it is not part of this repository.

## Student development ideas

Compare averaging methods and threshold dates; validate against canopy sensors and observed acclimation; add station selection; investigate forecast information separately from observations.

## Status

Exported 2026-11-10. Live data loading, method switching and historical review were checked in browser. Calculations were checked for exact-threshold and missing-data cases. The upstream public feed can change; no API availability guarantee is implied. Choose a license before public distribution. No hosting credentials or deployment configuration are included.

## Multi-station and historical update

The station selector discovers all active Kentucky Mesonet stations from the public metadata manifest. Each station uses its own local time zone. Default: SPIN. History is loaded on request using all YYYY_L entries exposed in the selected station manifest, with up to three simultaneous annual downloads and in-memory caching. No fixed five-year limit and no substitution of nearby stations. Switching station or daily averaging method clears history to prevent mixing results.

Each September 1–December 31 season lists first observed weekly threshold, first seven-day streak, lowest/highest daily average, data completeness, and ongoing/complete/partial status. Earliest, latest and average dates use only complete past seasons with a threshold occurrence; excluded seasons remain visible. No-crossing complete seasons are counted separately. This is not a standardized climate normal.

The date of an initial crossing may precede later warm spells. Missing observations can conceal an earlier crossing. Station moves or instrument changes are not homogenized. Historical minimum/maximum columns describe daily averages, not extreme instantaneous readings.

No website publication is included. The separately configured ChatGPT alert remains for SPIN and does not follow station selection. Run calculation checks with `node tests.mjs`.

## Grower-guidance revision and planning projection
Primary cue now uses a rolling weekly average strictly below 50°F, following UK wording. Seven consecutive daily averages ≤50°F is descriptive, not a published requirement. Establishment and acclimation checks guide the winter-cover message. Separate purpose selections explain growth-promoting covers and protection ahead of damaging cold. No forecast is retrieved.

The historical planning projection uses the median first weekly-cue date from all complete PRIOR fall seasons with a crossing; minimum three qualifying seasons (design choice). It displays earliest/latest observed dates and sample size. It is not a forecast, confidence interval, validated optimum covering date, or current-season-adjusted estimate. Ongoing seasons are excluded. A passed estimate is flagged rather than replaced by an unsupported future date.

Sources: UK Fruit Facts November–December 2024; UK CCD-CP-16 Plasticulture Strawberries; NC State Strawberries: Late Planting and the Use of Floating Row Covers; NC State 2025 Update: Winter Disease Control in Strawberries. Direct source links are embedded in index.html.

## Forecast estimate (supersedes historical projection as primary estimate)
The forward-looking panel fetches 14 daily means/minima/maxima from Open-Meteo at the selected Mesonet coordinates and local time zone. It combines valid observed daily means through yesterday with model estimates from today onward, calculates each future seven-day mean, and reports the first below-50°F crossing. Today remains wholly model-estimated. Missing days are not interpolated. Historical selection disables live projections. No crossing within the horizon is reported as such; historical dates are never substituted. Days 8–14 are marked extended outlook. The ±3°F forecast perturbation is a sensitivity scenario, not a calibrated uncertainty interval. Forecast retrieval time is shown, not misrepresented as model issuance time.

Open-Meteo attribution: https://open-meteo.com/ ; documentation: https://open-meteo.com/en/docs . Review service licensing and usage terms before commercial deployment. Forecasts are gridded, not farm-canopy temperatures. No bias correction or biological optimal-date model has been validated. The existing ChatGPT alert remains a separate observed-data SPIN alert.
