# Car Dealership Inventory System

A production-ready, full-stack vehicle inventory and dealership management web application featuring role-based access control (RBAC), vehicle search and multi-parameter filtering, real-time inventory updates (restock/purchase flows), and responsive UI designed with Tailwind CSS.

Built with **Test-Driven Development (TDD)** using **Jest + Supertest** for the Express backend and **Vitest + React Testing Library** for the React frontend.

---

## Features

- **Authentication & Authorization**: Secure JWT-based auth with hashed passwords (`bcrypt`). Role-based access control supporting `customer` and `admin` roles.
- **Vehicle Catalog & Search**: Instant multi-field filtering by Make, Model, Category, and Price Range (Min/Max).
- **Admin Inventory Control**:
  - Full CRUD capabilities for adding, updating, and deleting vehicles.
  - One-click stock replenishment modal for restocking out-of-stock items.
- **Customer Purchase Flow**: Authenticated customers can purchase vehicles in real time with instant inventory decrement and stock tracking.
- **Modern UI / UX**: Dynamic notification toast alerts, modal forms, skeleton loading states, and dark/light styled aesthetics.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (ES Modules), Express.js, MongoDB, Mongoose ORM, JSON Web Tokens (`jsonwebtoken`), `bcrypt` |
| **Frontend** | React 18, Vite, React Router v7, Tailwind CSS, Lucide React icons |
| **Backend Testing** | Jest, Supertest, MongoDB Memory Server (`mongodb-memory-server`) |
| **Frontend Testing** | Vitest, React Testing Library, jsdom, `@testing-library/jest-dom` |

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Auth and Vehicle request handlers
│   │   ├── middleware/      # Auth & role checking middleware
│   │   ├── models/          # Mongoose schemas (User, Vehicle)
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # JWT generation & search helper logic
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── tests/               # 11 Jest test suites (60 tests)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Fetch client & API service layer
│   │   ├── components/      # React components (Navbar, Modals, Vehicle Cards, Toast)
│   │   ├── context/         # React Auth Context & Provider
│   │   ├── pages/           # Views (LoginPage, RegisterPage, DashboardPage)
│   │   ├── App.jsx          # App router setup
│   │   └── main.jsx         # Entry point
│   └── package.json
├── PROMPTS.md               # AI development interaction log
└── README.md                # Project documentation & coverage report
```

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB server or MongoDB Atlas connection URI (for running backend dev server)

---

## Environment Variables

### Backend Configuration (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/car-dealership

# Secret Key for JWT Signing
JWT_SECRET=your-super-secret-jwt-key

# Server Port (Default: 5000)
PORT=5000
```

### Frontend Configuration (`frontend/.env` - Optional)

By default, Vite proxies requests to `http://localhost:5000`. You can configure a custom API endpoint in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start development server with live reload
npm run dev

# Start production server
npm start
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (defaults to http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## API Endpoints

### Auth Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`customer` or `admin`). |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token. |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile. |

### Vehicle Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public | List all vehicles in inventory. |
| `GET` | `/api/vehicles/search` | Public | Filter vehicles by make, model, category, and price range. |
| `POST` | `/api/vehicles` | Admin | Create a new vehicle record. |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle details (price, make, model, stock, etc.). |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete a vehicle from inventory. |
| `POST` | `/api/vehicles/:id/purchase` | Authenticated | Purchase 1 unit of a vehicle (decrements stock). |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle inventory (increments stock). |

### System Health

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | API health check endpoint. |

---

## Test Execution & Coverage Reports

Both backend and frontend codebases have unit and integration test coverage.

### Running Backend Tests (Jest + Supertest)

```bash
cd backend

# Run all test suites
npm test

# Run tests with code coverage stats
npm run test:coverage
```

#### Backend Coverage Summary

- **Test Suites**: 11 passed, 11 total
- **Total Tests**: 60 passed, 60 total

```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |   92.41 |    89.18 |    90.9 |   92.41 |                   
 src                   |     100 |      100 |     100 |     100 |                   
  app.js               |     100 |      100 |     100 |     100 |                   
 src/controllers       |   93.67 |    93.75 |     100 |   93.67 |                   
  authController.js    |   95.83 |      100 |     100 |   95.83 | 25                
  vehicleController.js |   92.72 |    90.62 |     100 |   92.72 | 21,71,102,139     
 src/middleware        |     100 |      100 |     100 |     100 |                   
  authMiddleware.js    |     100 |      100 |     100 |     100 |                   
 src/models            |   91.66 |       50 |     100 |   91.66 |                   
  User.js              |      90 |       50 |     100 |      90 | 38                
  Vehicle.js           |     100 |      100 |     100 |     100 |                   
 src/routes            |     100 |      100 |     100 |     100 |                   
  authRoutes.js        |     100 |      100 |     100 |     100 |                   
  healthRoutes.js      |     100 |      100 |     100 |     100 |                   
  vehicleRoutes.js     |     100 |      100 |     100 |     100 |                   
 src/utils             |     100 |      100 |     100 |     100 |                   
  jwt.js               |     100 |      100 |     100 |     100 |                   
  vehicleSearch.js     |     100 |      100 |     100 |     100 |                   
-----------------------|---------|----------|---------|---------|-------------------
```

---

### Running Frontend Tests (Vitest + RTL)

```bash
cd frontend

# Run all Vitest suites
npm test

# Run Vitest in watch mode
npm run test:watch
```

#### Frontend Test Summary

- **Test Suites**: 16 passed, 16 total
- **Total Tests**: 58 passed, 58 total

```
 ✓ src/context/AuthContext.test.jsx (6 tests)
 ✓ src/components/ProtectedRoute.test.jsx (5 tests)
 ✓ src/components/VehicleCard.test.jsx (6 tests)
 ✓ src/api/vehicles.test.js (7 tests)
 ✓ src/pages/RegisterPage.test.jsx (4 tests)
 ✓ src/pages/DashboardPage.test.jsx (4 tests)
 ✓ src/components/VehicleFormModal.test.jsx (3 tests)
 ✓ src/api/client.test.js (4 tests)
 ✓ src/pages/LoginPage.test.jsx (3 tests)
 ✓ src/api/auth.test.js (3 tests)
 ✓ src/components/Navbar.test.jsx (3 tests)
 ✓ src/components/VehicleSearchFilter.test.jsx (3 tests)
 ✓ src/components/Toast.test.jsx (3 tests)
 ✓ src/components/RestockModal.test.jsx (2 tests)
 ✓ src/App.test.jsx (1 test)
 ✓ src/components/SkeletonCard.test.jsx (1 test)

 Test Files: 16 passed (16)
 Tests:      58 passed (58)
```

---

## License

This project is licensed under the [MIT License](LICENSE).
