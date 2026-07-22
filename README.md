# Car Dealership Inventory System

Full-stack inventory management system for a car dealership with role-based access control, vehicle search, purchase flow, and admin CRUD operations.

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT       |
| Frontend | React (Vite), Tailwind CSS, Vitest                |
| Testing  | Jest + Supertest (backend), Vitest + RTL (frontend) |

## Project Structure

```
├── backend/          # Express API + Jest tests
├── frontend/         # React SPA + Vitest tests
├── PROMPTS.md        # AI interaction log
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas) for development

## Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/car-dealership
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev        # Start dev server
npm test           # Run tests
npm run test:coverage
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Start Vite dev server
npm test           # Run Vitest
```

## API Endpoints (Planned)

| Method | Endpoint                      | Access        |
| ------ | ----------------------------- | ------------- |
| GET    | `/api/health`                 | Public        |
| POST   | `/api/auth/register`          | Public        |
| POST   | `/api/auth/login`             | Public        |
| GET    | `/api/vehicles`               | Public        |
| GET    | `/api/vehicles/search`        | Public        |
| POST   | `/api/vehicles`               | Admin         |
| PUT    | `/api/vehicles/:id`           | Admin         |
| DELETE | `/api/vehicles/:id`           | Admin         |
| POST   | `/api/vehicles/:id/purchase`  | Authenticated |
| POST   | `/api/vehicles/:id/restock`   | Admin         |

## Development Workflow

This project follows **Test-Driven Development (TDD)**:

1. **Red** — Write a failing test
2. **Green** — Implement minimal code to pass
3. **Refactor** — Clean up while keeping tests green

## License

MIT
