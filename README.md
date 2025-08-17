# Boston Amtrak Tracker

Small TypeScript/Node service that tracks Amtrak trains in New England and exposes simple JSON and GeoJSON APIs. It is an add‑on component to the Inky MBTA Tracker.

## Overview
- **Purpose:** Periodically fetch Amtrak train positions, filter to a defined service area, and serve them over HTTP.
- **Runtime:** Node 22 with Koa 3.
- **Update cadence:** Every 2 minutes.
- **Docs:** OpenAPI served at `/openapi.json` and Swagger UI at `/docs` (root `/` redirects to `/docs`).

## Endpoints
- `GET /trains`: Array of trains using `VehicleRedisSchema` fields.
- `GET /trains/geojson`: GeoJSON FeatureCollection for mapping.
- `GET /health`: Health object with last update timestamp.

## How It Works
- **Fetch:** Uses the `amtrak` NPM package to retrieve current trains.
- **Filter:** Keeps only trains within the polygon in `servicearea.geojson` using Turf `booleanPointInPolygon`.
- **Shape:** Normalizes each train to `VehicleRedisSchema` and builds a GeoJSON view on demand.
- **Serve:** Koa routes provide JSON, GeoJSON, health, and API docs with CORS.

## Configuration
- `PORT`: HTTP port (default `3000`).
- `ALLOWED_ORIGINS`: Comma‑separated list for CORS. If the request origin matches, it is allowed; otherwise defaults to `https://bos.ryanwallace.cloud`. For local testing you can set `*`.
- `servicearea.geojson`: Polygon that defines the service area; replace to change coverage.

## Local Development
Prerequisites: Node 22.x, PNPM (Corepack recommended).

- Install: `pnpm install`
- Build: `pnpm run build`
- Start: `pnpm run start`
- Watch build: `pnpm run build:watch`
- Lint: `pnpm run lint`
- Format: `pnpm run prettier`

Convenience via Taskfile (requires `task`): `task build`, `task start`, `task watch`.

## Docker
- Build locally: `./container-build.sh`
- Run with Compose:
  - `docker compose up --build` (exposes `3000:3000` and sets `ALLOWED_ORIGINS=*` in the sample file)

Images are built and pushed by GitHub Actions to GHCR on `main` and for PRs.

## Project Structure
- `src/main.ts`: Koa server, schedulers, routes, Swagger wiring.
- `src/sharedTypes.ts`: Generated TS types mirrored from Python models.
- `servicearea.geojson`: Service area polygon used for filtering.
- `openapi.json`: API contract displayed in Swagger UI.
- `Taskfile.yml`: Common tasks for build/run/lint.
- `Dockerfile`, `docker-compose.yaml`, `container-build.sh`: Containerization.
- `shared_types.py`: Pydantic models that source TS types.

## Types Generation
TypeScript types in `src/sharedTypes.ts` are generated from the Pydantic models in `shared_types.py`.

- Command: `pnpm run types`
- Mechanism: Uses `uv` to run `pydantic2ts`. The script can optionally fetch an upstream `shared_types.py` before generation.

## Real World Usage
- Used for vehicle tracking at <https://ryanwallace.cloud/map> 
  - [Source Code](https://github.com/cubismod/ryanwallace.cloud/blob/main/ryanwallace.cloud/map/src/amtrak.ts)

## Notes
- The service updates train data on a 2‑minute interval after startup; endpoints will serve the latest in‑memory snapshot.
- CORS behavior is controlled by `ALLOWED_ORIGINS` and falls back to a production domain when unspecified.
- License: Apache‑2.0.
