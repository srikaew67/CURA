# Agents Guide

This repository contains a small customer-service/proactive-commerce app with a Node.js backend and a React/Vite frontend.

## Project Layout

- `backend/` - Node.js HTTP API server. `backend/server.js` is the bootstrap entrypoint; implementation lives under `backend/src/`.
- `frontend/` - React 19 + TypeScript + Vite app.
- `Makefile` - Convenience targets for running backend and frontend during development.

## Common Commands

Run these from the repository root unless noted otherwise.

- `make frontend` - start the Vite dev server from `frontend/`.
- `make backend` - start the Node.js backend in watch mode from `backend/`.
- `make dev` - start both services.
- `cd backend && npm start` - start the backend once.
- `cd backend && npm run check` - syntax-check the backend.
- `cd frontend && npm run build` - type-check and build the frontend.
- `cd frontend && npm run lint` - run ESLint for the frontend.

The backend uses Node's built-in HTTP server and fetch APIs, so it currently has no runtime npm dependencies.

## Environment

Backend environment variables are loaded from `backend/.env` when present by the local env loader in `backend/server.js`.

Important backend variables:

- `PORT` - backend port, defaults to `8080`.
- `FRONTEND_ORIGIN` - CORS origin, defaults to `http://localhost:5173`.
- `OPENAI_API_KEY` - required for chat and embedding endpoints.
- `OPENAI_MODEL` - defaults to `gpt-4.1-mini`.
- `SUPABASE_URL` - required for Supabase REST calls.
- `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` - Supabase API key. Service role key takes precedence when set.

Frontend environment variables:

- `VITE_API_URL` - API base URL, defaults to `http://localhost:8080`.
- `VITE_SUPABASE_URL` - Supabase URL for direct frontend Supabase usage.
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase publishable key for direct frontend Supabase usage.

Do not commit secrets or `.env` files.

## Backend Notes

- API routing is centralized in `backend/src/app.js`; `backend/server.js` only loads env and starts the HTTP server.
- Request handlers live in `backend/src/handlers/`.
- Business logic lives in `backend/src/services/`.
- OpenAI and Supabase HTTP clients live in `backend/src/clients/`.
- JSON responses should use the existing `writeJSON` helper.
- CORS is centralized in `setCORSHeaders` in `backend/src/utils/http.js`.
- Chat flow uses OpenAI Responses API plus product context from Supabase.
- Keep handlers small when adding new behavior. Put reusable business behavior in services and shared HTTP/database helpers in clients or utils.

## Frontend Notes

- Route definitions live in `frontend/src/App.tsx`.
- Shared layout components live in `frontend/src/shared/`.
- API wrapper functions for backend endpoints live in `frontend/src/services/api.ts`.
- Direct Supabase client setup lives in `frontend/src/utils/supabase.ts`.
- Existing app pages are organized under `frontend/src/page/`.
- Match the current React function-component style and TypeScript conventions.

## Validation Before Finishing

Use the narrowest validation that covers the change:

- Frontend changes: run `cd frontend && npm run build`; run `cd frontend && npm run lint` when lint-sensitive code changed.
- Backend changes: run `cd backend && npm run check`; use `npm start` or hit `/health` when changing server startup or routing.
- Full-stack/API contract changes: verify both sides agree on paths, request bodies, and response shapes.

If validation cannot run because dependencies, tools, or network access are missing, mention the blocker clearly.

## Coding Guidelines

- Keep edits scoped to the requested task.
- Prefer existing helpers and project patterns over introducing new frameworks or abstractions.
- Do not rewrite unrelated files or generated lockfiles unless dependency changes require it.
- Preserve existing user changes in the working tree.
- Be careful with file encoding. Some current comments appear to contain mojibake; avoid broad reformatting unless explicitly fixing encoding.
- For UI work, keep the first screen usable, responsive, and consistent with the existing app rather than adding marketing-style filler.
