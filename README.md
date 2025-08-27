# SchoolHub

## Setup

1. Copy `backend/.env.example` to `backend/.env` and adjust values.
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

## Development

- `npm run backend:dev` – start Express API
- `npm run frontend:dev` – start Vite frontend
- `npm run dev:all` – start both servers

The backend exposes an HTTP API consumed by the frontend. Authentication is handled via a JWT token returned from `/auth/login`.
