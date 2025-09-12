# Harmoniq (formerly Flux)

A minimal full‑stack audio library explorer. Backend serves a PostgreSQL‑backed song catalog and streams files from a local `backend/db/Music` folder; frontend (CRA React) lists, filters, and plays tracks via simple endpoints.

## Project structure
```
.
├─ backend/            # Express API + PostgreSQL access
│  ├─ db/
│  │  ├─ db.js        # Pool + schema init + scanner
│  │  └─ Music/       # Place .mp3 files here (ignored in git)
│  ├─ server.js       # API routes and file streaming
│  ├─ package.json
│  └─ .env.example    # Copy to .env and fill values
├─ frontend/
│  └─ myapp/          # React app (CRA)
│     ├─ src/
│     ├─ public/
│     └─ package.json
├─ .gitignore
└─ README.md
```

## Prerequisites
- Node.js LTS (>=18)
- PostgreSQL (>=13)

## Setup
1. Backend
   - Copy env: `cp backend/.env.example backend/.env` (Windows: copy the file) and fill values
   - Install deps: `cd backend && npm install`
   - Run server: `npm start` (or `node server.js`) — defaults to `http://localhost:5000`
2. Frontend
   - Install deps: `cd frontend/myapp && npm install`
   - Start dev server: `npm start` — defaults to `http://localhost:3000`

## Environment
Backend `.env` keys:
- `PORT` — API port (default 5000)
- `CLIENT_ORIGIN` — allowed CORS origin (e.g. http://localhost:3000)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`

## Scripts
- Backend: `npm start`
- Frontend: `npm start`, `npm run build`

## Data loading
Place `.mp3` files in `backend/db/Music/`. On server start, the catalog is scanned and inserted into `songs` table (id, name, path). Large media are ignored by git; a `.gitkeep` preserves the folder.

## API
- `GET /api/songs` — list songs `{ id, name, path }`
- `GET /api/songs/:id/file` — stream file by id

## Contributing
- Use feature branches and conventional commit messages
- Keep secrets out of git; commit only `.env.example`
