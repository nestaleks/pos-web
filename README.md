# Vectis POS website

Static multi-page marketing website for the Vectis POS platform. Shared navigation and footer components are loaded from `components/`; page behavior lives in `js/`; the design system is defined in `css/main.css`.

## Requirements

- Node.js 18 or newer
- No runtime dependencies

## Commands

- `npm run dev` — serve the source site at `http://127.0.0.1:4173`
- `npm test` — run the dependency-free structural validation
- `npm run check` — validate page structure, internal routes, anchors, and local assets
- `npm run build` — validate and create a production-ready `dist/` directory

Open `index.html` through the local server. Direct `file://` access cannot load shared HTML components because browsers block component `fetch()` calls from local files.
