# SchoolHub

SchoolHub is a full-stack web application for managing school life. It provides an Express API backed by PostgreSQL and a modern React frontend for features like clubs, events, posts and announcements.

## Features
- JWT-based authentication and user profile management
- Admin tools and role-based access
- Manage clubs, events, announcements, posts and achievements
- Notifications system
- File uploads with optional AWS S3 support
- REST API consumed by a Vite + React frontend

## Installation

### Prerequisites
- Node.js v22 or newer
- PostgreSQL database
- (optional) Redis server
- npm

### Steps
1. Clone the repository.
2. Install dependencies for each package:
   ```bash
   npm --prefix backend install
   npm --prefix frontend install
   ```
3. Configure environment variables:
   - **Backend**: copy `backend/.env.example` to `backend/.env` and adjust values.
   - **Frontend**: create `frontend/.env` and set variables such as `VITE_API_URL` and `ASSET_URL`.
4. Apply database migrations and seed initial data:
   ```bash
   npm --prefix backend run migrate
   npm --prefix backend run seed # optional
   ```

## Running the Project

### Development
Start each service individually or together:
```bash
npm run backend:dev     # start Express API with nodemon
npm run frontend:dev    # start Vite dev server
npm run dev:all         # start both servers
```

### Production
```bash
npm --prefix frontend run build   # build static assets
npm --prefix backend start        # launch API server
npm --prefix frontend run preview # serve built frontend locally
```

## Folder Structure
```
backend/   - Express API, migrations and tests
frontend/  - React + Vite web client
scripts/   - shared utility scripts
```

## Environment Variables

### Backend (`backend/.env`)
See `backend/.env.example` for the full list:
```dotenv
PORT=3000
JWT_SECRET=changeme
REDIS_URL=redis://localhost:6379
CLIENT_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=schoolhub
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

### Frontend (`frontend/.env`)
```dotenv
VITE_API_URL=http://localhost:3000/api
ASSET_URL=http://localhost:3000
```

## Testing
Run unit and integration tests for both packages:
```bash
npm --prefix backend test
npm --prefix frontend test
```

## Contributing
1. Fork the repository and create your branch (`git checkout -b feature/foo`).
2. Commit your changes (`git commit -am 'Add feature'`).
3. Push to the branch (`git push origin feature/foo`).
4. Open a Pull Request.

Please ensure tests pass before submitting.

## License
This project is licensed under the [MIT License](LICENSE).
