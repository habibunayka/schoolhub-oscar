# SchoolHub

SchoolHub is a full-stack monorepo that provides a web platform for managing school activities. It combines an Express.js API and a modern React interface to handle authentication, clubs, events, posts, and more.

## Features

- 🔐 JWT-based authentication and authorization
- 🏫 Manage clubs, categories, and events
- 📢 Announcements, posts, and notifications
- 📦 PostgreSQL database with migration and seeding scripts
- ☁️ Optional AWS S3 support for file uploads
- ⚛️ React + Vite front-end styled with Tailwind CSS

## Installation

### Prerequisites

- Node.js >= 22
- PostgreSQL and Redis instances
- (Optional) S3-compatible storage for assets

### Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/habibunayka/schoolhub-oscar
cd schoolhub-oscar
npm install --prefix backend
npm install --prefix frontend
```

## Environment Setup

### Backend (`backend/.env`)

Copy the example file and adjust values as needed:

```bash
cp backend/.env.example backend/.env
```

Key variables:

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
```

### Frontend (`frontend/.env`)

Create a file with your API endpoint:

```dotenv
VITE_API_URL=http://localhost:3000/api
ASSET_URL=http://localhost:3000
```

## Database

Run database migrations (and optional seed data):

```bash
cd backend
npm run migrate
npm run seed   # optional
```

## Running the Project

### Development

```bash
# In separate terminals
npm run backend:dev   # start API
npm run frontend:dev  # start Vite frontend
# or run both at once
npm run dev:all
```

### Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview   # or serve dist/ with your web server
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Folder Structure

```text
backend/   - Express API and database layer
frontend/  - React web interface
scripts/   - utility scripts
```

## Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies and ensure tests pass.
3. Submit a pull request for review.

## License

MIT
