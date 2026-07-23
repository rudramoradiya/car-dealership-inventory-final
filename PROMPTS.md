# 🚗 DriveSelect — AI Development & Prompt Log

**Car Dealership Inventory System** — built with a full-stack Node/Express/Mongoose backend and a React/Vite/Tailwind frontend, developed via strict Test-Driven Development with transparent, documented AI assistance throughout.

This log records every development session, the actual prompts used, and the reasoning behind each implementation decision — in line with the assessment's AI usage policy.

---

## 📊 At a Glance

| Metric | Value |
|---|---|
| Total commits | 30 |
| AI co-authored commits | 10 (33%) |
| Human-authored commits (AI-assisted debugging/refinement only) | 20 (67%) |
| Backend REST endpoints | 11 |
| Backend test framework | Jest + Supertest + mongodb-memory-server |
| Frontend test framework | Vitest + React Testing Library |
| Frontend stack | React, Vite, Tailwind CSS |
| DashboardPage.jsx coverage | 100% statements/lines |
| AI tools used | Claude, Cursor AI, ChatGPT, AntiGravity AI |

---

## 🧰 AI Tools Used, By Phase

| Tool | Where it was used |
|---|---|
| **Claude / Cursor AI** | Monorepo scaffolding, backend TDD cycles (auth, vehicle CRUD, search, purchase/restock) |
| **ChatGPT / AntiGravity AI** | Frontend architecture, state management, UI components, styling, documentation |

---

## 🔁 Development Workflow

```
Requirement Understanding → Plan → AI Brainstorming → Review Output
→ Adapt to Codebase → Verify via Tests → Commit
```

AI tools served as development assistants throughout — not replacements for understanding or decision-making.

## ✅ Responsibilities Maintained by the Developer

- Defining assessment requirements and architectural choices
- Reviewing, modifying, and verifying all AI-generated code
- Running the full Jest and Vitest suites after every iteration
- Handling Git version control, branching, and repository structure
- Documenting the AI interaction log accurately and honestly

---

## 🗂️ Sessions Overview

| Session | Focus | AI Used | Developer Contribution |
|---|---|---|---|
| **1 — Monorepo Planning & Scaffold** | Repo structure, tech stack selection, in-memory DB test config | Claude / Cursor AI | Chose implementation order & technologies (React, Vite, Tailwind, Express, Mongoose, Jest, Vitest), wrote root scripts and `.gitignore` |
| **2 — Backend TDD** | Auth, vehicle management, dynamic filtering, atomic stock purchasing, restocking | Claude / Cursor AI | Reviewed/adapted suggestions, verified Red before Green on every cycle, debugged route-ordering (`/search` vs `/:id`), verified DB behavior |
| **3 — Frontend Architecture** | AuthContext, API service layer, ProtectedRoute, VehicleCard/SearchFilter, toast/skeleton states | ChatGPT / AntiGravity AI | Integrated API handlers, managed router layout state, fixed directory conflicts, verified role-based visibility |
| **4 — UI Overhaul & Hardening** | DriveSelect theme redesign, security hardening, 100% coverage push, currency localization, docs | AntiGravity AI / ChatGPT | Ran rebase/commit operations, finalized design polish, ensured full test pass rate, wrote final reflections |

---

## 📝 Commit-by-Commit Log

### Phase 1 — Backend Foundation

<details>
<summary><b>Commit 1</b> — feat: scaffold monorepo with health check endpoint (Phase 1) · <code>Co-authored-by: Cursor AI</code></summary>

**Prompts:**
1. *Monorepo architecture & tech stack:* "Set up a clean monorepo structure with `backend/` and `frontend/` folders. For the backend, initialize Node.js/Express with Mongoose. For the frontend, scaffold a React app using Vite and Tailwind CSS. Ensure root level has unified package management scripts and `.gitignore`."
2. *Backend test runner & memory DB:* "Configure Jest and Supertest in `backend/` alongside `mongodb-memory-server` for fast, isolated integration testing. Create a failing test for `GET /api/health` that expects a 200 status code and `{ status: 'ok' }` JSON response."
3. *Health endpoint implementation:* "Write the Express server boot file `app.js` and implement the `GET /api/health` route to satisfy the health check Supertest spec. Verify that running `npm test` inside `backend/` passes green."

**Outcome:** Bootstrapped the full-stack repo with isolated backend/frontend packages, a passing health check integration test, and in-memory DB setup for fast local test execution.

> **Reflection:** Using `mongodb-memory-server` allowed backend integration tests to run entirely decoupled from external DB instances, establishing a fast feedback loop for subsequent TDD cycles.

</details>

<details>
<summary><b>Commit 2</b> — feat(auth): add user registration endpoint with bcrypt hashing · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Password field leak fix:* "Review the `POST /api/auth/register` response handler. Ensure that even though Mongoose hashes the password via `pre-save` hooks, the returned JSON payload explicitly excludes the password field from the 201 response object."
2. *Duplicate email error handling:* "Add an explicit test case to `auth.register.test.js` checking that registering an existing email returns HTTP 400 or 409 with a clean error message, preventing unhandled MongoDB duplicate key `E11000` exceptions."

**Outcome:** Strengthened the registration flow with schema validation, secure password exclusion, and clean duplicate-email error handling.

> **Reflection:** Handling MongoDB duplicate key errors gracefully at the controller layer prevented unhandled server crashes during concurrent registration attempts.

</details>

<details>
<summary><b>Commit 3</b> — feat(auth): add login endpoint with JWT token generation · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Token payload & verification:* "Audit the JWT payload in `signToken`. Ensure the signed token includes essential claims (`id`, `email`, `role`) and has a strict expiration window (e.g., 1d). Add a test asserting that invalid or malformed passwords trigger an explicit 401 Unauthorized response."
2. *Missing credentials / malformed body:* "Add validation tests for empty payload submissions on `POST /api/auth/login`. Verify that missing required fields (either email or password) immediately return a 400 Bad Request prior to triggering bcrypt comparison."

**Outcome:** Completed the auth API suite with robust JWT generation, secure password comparison, and full coverage of 400/401 error paths.

> **Reflection:** Enforcing input validation prior to bcrypt execution eliminated unnecessary CPU overhead during credential brute-force attempts.

</details>

<details>
<summary><b>Commit 4</b> — feat(auth): add JWT authenticate middleware and protected /me route · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Header parsing edge cases:* "Audit `authenticate` middleware when parsing Authorization headers. Ensure it gracefully handles malformed headers (missing `Bearer` prefix, empty space, or plain string) by returning a clear 401 instead of throwing an unhandled split error."
2. *Expired/invalid token handling:* "Add integration test cases to `auth.me.test.js` verifying that expired tokens and tokens signed with an invalid secret are caught by `verifyToken` and return 401 with a descriptive error."

**Outcome:** Reusable JWT auth middleware plus a protected `/api/auth/me` endpoint with full edge-case coverage.

> **Reflection:** Isolating token verification into a standalone utility simplified middleware testing and kept token handling consistent across all protected routes.

</details>

<details>
<summary><b>Commit 5</b> — feat(vehicles): add admin-only POST /api/vehicles endpoint · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Admin role enforcement:* "Refine `requireAdmin` middleware to check `req.user.role === 'admin'`. Add assertions verifying standard authenticated users attempting to create a vehicle receive 403, not 401."
2. *Schema validation:* "Update the Mongoose Vehicle schema for required fields (`make`, `model`, `price`, `quantity`). Ensure missing parameters return a clean 400 detailing validation failures."

**Outcome:** Vehicle schema, admin middleware, and `POST /api/vehicles` shipped with 401/403/400 coverage.

> **Reflection:** Enforcing role checks downstream from token authentication cleanly separated identity verification from permission authorization.

</details>

<details>
<summary><b>Commit 6</b> — feat(vehicles): add public GET /api/vehicles list endpoint · <code>Co-authored-by: Cursor AI</code></summary>

**Prompts:**
1. *Public unauthenticated access:* "Implement the public `GET /api/vehicles` endpoint. Ensure this route bypasses the `authenticate` middleware so guests can retrieve the catalog without a JWT."
2. *Sorting & out-of-stock inclusion:* "Update the list controller to query all vehicles including out-of-stock items (`quantity === 0`), sorted by `createdAt: -1` so newest inventory appears first."
3. *TDD suite:* "Write 4 integration tests verifying `GET /api/vehicles` returns 200 with an array, correctly reflects out-of-stock items, works without an Authorization header, and maintains sort order."

**Outcome:** Public catalog endpoint, sorted newest-first, backed by 4 isolated integration tests.

> **Reflection:** Including out-of-stock items in the response lets the UI render disabled states and "Out of Stock" badges without a separate metadata endpoint.

</details>

<details>
<summary><b>Commit 7</b> — feat(vehicles): add public search and filter endpoint · <code>Co-authored-by: Cursor AI</code></summary>

**Prompts:**
1. *Filter utility:* "Create a `buildVehicleSearchFilter` utility transforming query params (`make`, `model`, `category`, `minPrice`, `maxPrice`) into a dynamic Mongoose filter. String filters use case-insensitive `$regex`; price maps to `$gte`/`$lte`."
2. *Public search controller:* "Implement `GET /api/vehicles/search` using the filter utility, publicly accessible, handling empty/partial query strings gracefully."
3. *Test suite:* "Write 11 integration tests verifying each query param independently, numerical ranges, case-insensitive partial matches, and combined-filter results."

**Outcome:** Dynamic search/filtering via a dedicated helper, backed by 11 integration tests.

> **Reflection:** Extracting the query-building logic into `buildVehicleSearchFilter` kept the controller lean and made complex Mongoose criteria unit-testable in isolation.

</details>

<details>
<summary><b>Commit 8</b> — feat(vehicles): add admin-only PUT /api/vehicles/:id update endpoint · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Update validation:* "Ensure `findByIdAndUpdate` uses `{ new: true, runValidators: true }` so partial payloads still respect schema rules (no negative price/quantity) and return the updated doc immediately."
2. *Invalid ID / missing resource:* "Add tests verifying updating a non-existent ID returns 404, malformed ObjectIDs return 400, and non-admin requests are blocked with 403."

**Outcome:** Secure vehicle updates with role enforcement, schema validation, and full invalid-ID handling.

> **Reflection:** Enabling `runValidators: true` prevented partial payload updates from silently bypassing model schema constraints.

</details>

<details>
<summary><b>Commit 9</b> — feat(vehicles): add admin-only DELETE /api/vehicles/:id endpoint · <code>Co-authored-by: Cursor AI</code></summary>

**Prompts:**
1. *Middleware & route:* "Implement `DELETE /api/vehicles/:id`, attaching both `authenticate` and `requireAdmin` so only admins can delete inventory."
2. *Error alignment:* "Align delete error handling with the update endpoint: 400 for invalid ObjectIDs, 404 for missing vehicles, 403 for unauthorized roles."
3. *TDD & DB assertions:* "Write 5 Supertest tests verifying successful deletion (200), non-admin rejection (403), missing token (401), invalid ID (400), and an explicit DB check that `Vehicle.findById` returns null post-deletion."

**Outcome:** Admin deletion endpoint with strict access control, confirmed by 5 tests checking both HTTP status and actual DB removal.

> **Reflection:** Querying Mongoose directly in test assertions post-request verified the document was permanently removed, preventing false-positive passes.

</details>

<details>
<summary><b>Commit 10</b> — test(vehicles): assert quantity decreases by 1 and rejects out-of-stock purchases · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Red phase — purchase spec:* "Create `vehicles.purchase.test.js`. Assert that an authenticated `POST /api/vehicles/:id/purchase` decreases quantity by exactly 1 and returns the updated stock level."
2. *Stock boundary & auth:* "Add edge cases: purchasing a vehicle with `quantity === 0` returns 400 with a stock error; unauthenticated requests return 401."

**Outcome:** Failing (Red) tests enforcing stock-decrement rules, zero-inventory rejection, and auth guards — before any controller code existed.

> **Reflection:** Writing strict boundary tests for `quantity === 0` before implementing the controller prevented negative inventory from slipping through the initial implementation.

</details>

<details>
<summary><b>Commit 11</b> — feat(vehicles): implement atomic purchase stock decrement logic · <code>Co-authored-by: Cursor</code></summary>

**Prompts:**
1. *Atomic query design:* "Implement `POST /api/vehicles/:id/purchase` with `authenticate` middleware. Use `findOneAndUpdate` with `{ _id: id, quantity: { $gt: 0 } }` and `{ $inc: { quantity: -1 } }` to safely decrement stock without race conditions."
2. *Error status distinction:* "If `findOneAndUpdate` returns null, distinguish a non-existent vehicle (404) from an out-of-stock one (400), with an appropriate message for each."
3. *Green phase:* "Run `vehicles.purchase.test.js` against the new controller — verify all 6 tests pass, covering decrement, zero-stock rejection, concurrent updates, and auth."

**Outcome:** Atomic MongoDB purchase logic preventing race conditions on concurrent buys — all 6 purchase tests green.

> **Reflection:** Using `{ $inc: { quantity: -1 } }` inside the `{ quantity: { $gt: 0 } }` filter guaranteed thread-safe inventory reduction at the database layer, with no explicit transaction locks needed.

</details>

<details>
<summary><b>Commit 12</b> — feat(vehicles): add admin-only POST /api/vehicles/:id/restock endpoint · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Payload validation:* "Audit the restock body parser. Strictly validate `amount` is a positive integer > 0. Return 400 if missing, negative, zero, or a string."
2. *Zero-stock restocking & DB assertions:* "Add tests verifying restocking a `quantity === 0` vehicle restores stock and returns it to available status. Assert non-admin → 403, non-existent ID → 404."

**Outcome:** Restock endpoint with atomic `$inc` updates and strict integer validation — completing all **11 backend API endpoints** for Phase 2, with 8 integration tests.

> **Reflection:** Restocking via atomic `$inc` enabled seamless stock recovery while preventing race conditions during concurrent admin restocks.

</details>

---

### Phase 2 — Frontend Architecture & Admin Features

<details>
<summary><b>Commit 13</b> — feat(client): setup API service layer and endpoint wrappers · <code>Co-authored-by: Cursor</code></summary>

**Prompts:**
1. *Base fetch client:* "Create a base API client wrapper `frontend/src/api/client.js` around native `fetch`. Configure default JSON headers, base URL handling, and automatic JWT Bearer token inclusion from `localStorage` if available."
2. *Modular endpoint functions:* "Implement wrapper functions for auth (`login`, `register`, `getMe`) and vehicles (`getVehicles`, `searchVehicles`, `createVehicle`, `updateVehicle`, `deleteVehicle`, `purchaseVehicle`, `restockVehicle`) with uniform error parsing."
3. *Unified export:* "Export all API functions through a single `frontend/src/api/index.js` entry point for clean, centralized imports."

**Outcome:** Centralized API client with automatic auth headers and modular wrappers for all 11 backend endpoints.

> **Reflection:** Centralizing HTTP logic into one fetch wrapper eliminated boilerplate header config in UI components and made Vitest mocking significantly cleaner.

</details>

<details>
<summary><b>Commit 14</b> — test(client): add Vitest unit test suite for API wrappers · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Fetch mocking & token injection:* "Create `api.test.js` using Vitest. Mock `global.fetch` to verify that when a JWT exists in `localStorage`, the `Authorization: Bearer` header is automatically appended to outgoing requests."
2. *Error propagation:* "Add assertions for 400/401 responses — verify backend JSON error messages are parsed and thrown as readable JS errors."

**Outcome:** Full Vitest coverage for the API client layer: header injection, body serialization, error handling.

> **Reflection:** Mocking `global.fetch` at the wrapper level verified client request logic independently, without a live backend server during frontend unit runs.

</details>

<details>
<summary><b>Commit 15</b> — test(auth): add Vitest suite for AuthContext, pages, and ProtectedRoute · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *AuthContext & token persistence:* "Create unit tests for `AuthContext`. Assert initialization reads existing JWTs from `localStorage`, restores user state, and exposes `login`/`logout` actions."
2. *ProtectedRoute & role guards:* "Add tests verifying unauthenticated users hitting protected routes redirect to `/login`, while authenticated non-admins hitting `/admin` are blocked or redirected."

**Outcome:** Test suite for core auth UI modules — context state, token persistence, form rendering, role-based guarding.

> **Reflection:** Testing `ProtectedRoute` with `MemoryRouter` made it straightforward to verify redirects across authenticated/unauthenticated/insufficient-role states without full browser navigation.

</details>

<details>
<summary><b>Commit 16</b> — feat(auth): implement authentication pages, context provider, and route guarding · <code>Co-authored-by: AntiGravity</code></summary>

**Prompts:**
1. *AuthContext implementation:* "Build `AuthContext.jsx` to manage user state and JWT tokens. Implement `login`/`register`/`logout` integrated with the API layer, synchronized with `localStorage`, auto-fetching user details on initial render if a token exists."
2. *Login/Register/ProtectedRoute:* "Create `LoginPage.jsx` and `RegisterPage.jsx` with form handling, loading indicators, and error banners. Implement `ProtectedRoute.jsx` to restrict access by auth status and role."
3. *Router integration:* "Wrap the app in `AuthProvider` within `App.jsx`. Configure routes to wrap `/dashboard` and `/admin` with `ProtectedRoute`, satisfying the previously defined auth unit tests."

**Outcome:** Full auth frontend state, login/register views, and role-aware route guards — all AuthContext/page tests green.

> **Reflection:** Centralizing token decoding/validation inside `AuthProvider` ensured smooth, flicker-free route transitions when verifying stored sessions on refresh.

</details>

<details>
<summary><b>Commit 17</b> — test(dashboard): add Vitest suite for Navbar, VehicleCard, SearchFilter, and Dashboard · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *VehicleCard & SearchFilter specs:* "Assert `VehicleCard` formats pricing as USD currency, shows an 'Out of Stock' badge at `quantity === 0`, and verify `VehicleSearchFilter` dispatches typed filter changes to parent callbacks."
2. *Navbar & Dashboard integration:* "Add rendering tests for `Navbar` verifying role-specific links (hiding Admin Panel for standard users). Create integration specs for `DashboardPage` checking loading skeletons and populated grids on API resolution."

**Outcome:** Frontend unit coverage for catalog components, search controls, navigation, and the main dashboard layout.

> **Reflection:** Testing filter state callbacks independently from API fetching validated query payload construction before coupling it to network requests.

</details>

<details>
<summary><b>Commit 18</b> — feat(dashboard): build vehicle dashboard catalog grid and search filter UI · <code>Co-authored-by: AntiGravity</code></summary>

**Prompts:**
1. *Navbar & VehicleCard:* "Create a responsive `Navbar.jsx` with mobile drawer nav, role badges, and dynamic auth links. Build `VehicleCard.jsx` with Tailwind showcasing specs, price formatting, and an 'Out of Stock' badge."
2. *Search & filter interface:* "Implement `VehicleSearchFilter.jsx` with controlled inputs for make/model/category and min/max price bounds, plus a debounced clear-filters button and submit handler."
3. *Dashboard orchestration:* "Assemble `DashboardPage.jsx` to manage inventory state, combining default fetches with active filter params. Render a responsive `VehicleCard` grid and register `/` and `/dashboard` routes."

**Outcome:** Full catalog dashboard with debounced search filtering, responsive grid, dynamic stock badges, and routing.

> **Reflection:** Coupling client-side debouncing with filter input changes prevented rapid-fire API calls, keeping the catalog responsive and bandwidth-light.

</details>

<details>
<summary><b>Commit 19</b> — test(admin): add unit tests for purchase actions, vehicle form modal, and restocking controls · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Purchase button state:* "Verify the purchase button is disabled at `quantity === 0` or while a request is pending, and that clicking it invokes `onPurchase` with the correct vehicle ID."
2. *Form/Restock modal validation:* "Verify submit triggers validation errors on missing required fields, edit mode pre-populates existing values, and restocking submits positive integer amounts correctly."

**Outcome:** Unit tests for purchase buttons, CRUD form modals, and admin restocking controls.

> **Reflection:** Enforcing form validation tests before UI implementation ensured input constraints were built natively into the components, not bolted on after.

</details>

<details>
<summary><b>Commit 20</b> — feat(admin): implement purchase flow, vehicle CRUD modal, and restocking functionality · <code>Co-authored-by: AntiGravity</code></summary>

**Prompts:**
1. *Purchase trigger:* "Connect the purchase button to the API layer, add a loading spinner during execution, disable it at `quantity === 0`, and trigger parent state updates reflecting decremented stock."
2. *CRUD & restock modals:* "Build `VehicleFormModal.jsx` handling both creation and editing with pre-populated values. Build `RestockModal.jsx` for submitting positive integer restock amounts."
3. *Dashboard integration:* "Wire purchase, create, edit, delete, and restock handlers into `DashboardPage.jsx` so any successful modal action triggers a clean inventory refresh."

**Outcome:** End-to-end purchasing, full vehicle CRUD, and admin restocking — all unit/integration tests green.

> **Reflection:** Sharing one multi-purpose modal for create/edit simplified dashboard state management while keeping validation consistent across all mutations.

</details>

<details>
<summary><b>Commit 21</b> — test(ui): add Vitest suite for SkeletonCard loading placeholder and Toast notifications · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *SkeletonCard rendering:* "Assert `SkeletonCard` renders placeholder elements with pulse/shimmer classes representing the loading grid state."
2. *Toast variants & auto-dismiss:* "Test that success/error/info variants render distinct styling, and use `vi.useFakeTimers()` to verify auto-dismiss fires after the specified duration."

**Outcome:** Test specs for feedback components — skeleton placeholders and toast timing/variants — written before implementation.

> **Reflection:** Vitest's fake timers made testing async toast auto-dismiss deterministic, without real-time delays in the test runner.

</details>

<details>
<summary><b>Commit 22</b> — style(ui): implement skeleton loaders, toast notifications, and polish UX states · <code>Co-authored-by: AntiGravity</code></summary>

**Prompts:**
1. *Skeleton component:* "Create `SkeletonCard.jsx` with Tailwind `animate-pulse` matching `VehicleCard`'s layout, with multi-line placeholders for price, title, category, and buttons."
2. *Toast component:* "Implement `Toast.jsx` supporting success/error/info variants, auto-dismiss via `setTimeout`, and a manual close trigger."
3. *Dashboard UX integration:* "Integrate `SkeletonCard` grids into initial and search-filtered loading states. Connect toast feedback to all API mutations — purchase, stock errors, creation, restock."

**Outcome:** Skeleton loading states and real-time toast feedback across all mutations — all UI unit tests passing.

> **Reflection:** Replacing full-screen spinners with layout-matching skeletons eliminated layout shift during initial hydration, especially on slower networks.

</details>

---

### Phase 3 — Security Hardening, Coverage & Polish

<details>
<summary><b>Commit 23</b> — feat(auth): add password minlength validation and role payload handling · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Password length validation:* "Enforce a minimum password length of 6 characters in the register controller. Catch Mongoose `ValidationError` and return formatted 400 responses instead of an unhandled server error."
2. *Role payload & tests:* "Allow optional role handling in the registration payload (`user` default or `admin`). Add assertions for short passwords (<6 chars) returning 400."

**Outcome:** Stricter registration security with clean validation-error formatting.

> **Reflection:** Intercepting Mongoose `ValidationError` directly in the controller boundary ensured consistent 400 responses across all auth operations.

</details>

<details>
<summary><b>Commit 24</b> — sec(auth): remove role selection from registration page for security · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Privilege escalation fix:* "Audit `authController.js` and `RegisterPage.jsx`. Remove the role dropdown from the public registration form and strip the `role` field from the accepted backend payload, forcing a default `user` role on all public signups."
2. *Test suite update:* "Update `RegisterPage.test.jsx` — remove role-dropdown assertions, add assertions that submission posts only `email`/`password`."

**Outcome:** Closed a privilege-escalation vector by enforcing role assignment server-side only.

> **Reflection:** Restricting role assignment exclusively at the server level closed a path where a manipulated payload could self-assign an admin account.

</details>

<details>
<summary><b>Commit 25</b> — feat(ui): display User role badge in Navbar for authenticated standard users · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Role badge styling:* "Render a blue 'USER' badge next to the email for standard accounts, preserving the gold 'ADMIN' badge for admins."
2. *Test coverage:* "Add assertions verifying standard users see the 'USER' badge rendered beside their email."

**Outcome:** Clear visual role indicators across both account types in the nav bar.

> **Reflection:** Explicit role indicators for both regular users and admins gave clear context on current permissions across all authenticated states.

</details>

<details>
<summary><b>Commit 26</b> — feat(auth): protect root route and enforce role-based UI action visibility in tests · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Root route guarding:* "Wrap `/` in `App.jsx` with `ProtectedRoute` so unauthenticated visitors redirect to `/login`. Assert this in `App.test.jsx`."
2. *Role-based visibility:* "Add explicit visibility assertions verifying Edit/Delete/Restock buttons and the '+ Add Vehicle' header button are completely hidden from non-admin accounts."

**Outcome:** Secured root access and verified strict role-based UI visibility across the test suite.

> **Reflection:** Enforcing role-based element hiding at the UI layer complemented backend authorization middleware, so non-admins only ever see actions they're permitted to execute.

</details>

<details>
<summary><b>Commit 27</b> — test(frontend): achieve 100% coverage for DashboardPage and update README docs · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Exhaustive coverage push:* "Add 18 unit tests to `DashboardPage.test.jsx` targeting all remaining uncovered branches — modal open/close, success/failure paths for create/edit/delete/purchase/restock, API exception boundaries, and toast triggers — to bring statement/line coverage to 100%."
2. *Documentation update:* "Update `README.md` with setup instructions, environment variable tables, full API endpoint documentation, and test suite summary metrics."

**Outcome:** **100% statement/line coverage on DashboardPage.jsx**, plus finalized project documentation.

> **Reflection:** Systematically covering error boundaries and modal state toggles pushed component coverage from 62% to 100%, confirming every user workflow and fallback path is verified.

</details>

<details>
<summary><b>Commit 28</b> — feat(frontend): support VITE_API_URL environment variable in API client · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Dynamic base URL:* "Use Vite's `import.meta.env.VITE_API_URL` for the base API URL, falling back to `http://localhost:5000` when undefined."
2. *Docs sync:* "Update `.env.example` to document `VITE_API_URL` and verify Vitest client tests handle mock environment settings correctly."

**Outcome:** Environment-configurable API base URL for local/staging/production without hardcoding.

> **Reflection:** Using `import.meta.env` with a reliable local fallback avoided hardcoded localhost references in production builds while keeping local setup frictionless.

</details>

<details>
<summary><b>Commit 29</b> — fix(backend): enable CORS middleware in Express app · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *CORS integration:* "Install and configure `cors` in `backend/src/app.js`, applied globally to allow cross-origin requests from the frontend dev server."
2. *Environment-aware origins:* "Configure CORS options around `process.env.CLIENT_URL`, ensuring credentials (Bearer tokens) and preflight OPTIONS requests pass cleanly."

**Outcome:** Resolved cross-origin errors between frontend and backend.

> **Reflection:** Enabling CORS before route declarations ensured preflight checks and credential headers were accepted cleanly across dev and production ports.

</details>

<details>
<summary><b>Commit 30</b> — style(ui): redesign DriveSelect dashboard, refactor vehicle cards and update brand assets · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Layout cleanup:* "Refactor `DashboardPage.jsx` and `VehicleSearchFilter.jsx` — remove summary stat cards, sort dropdown, navbar search bar, and stock toggle to streamline the inventory view."
2. *Card refactor & localization:* "Reposition category badges and Edit/Restock/Delete buttons into a balanced control bar. Convert currency from USD to ₹ (Indian Rupees) and replace the default favicon with a custom DriveSelect SVG."

**Outcome:** Streamlined interface, ₹ currency localization, and a custom brand favicon — all while maintaining a 100% test pass rate.

> **Reflection:** Cleaning up redundant controls and repositioning admin buttons inside the card body eliminated element overlap on responsive widths without breaking any existing tests.

</details>

### Phase 4 — Deployment & Final Documentation

<details>
<summary><b>Commit 31</b> — feat: initialize express application with core middleware and base API routes · <code>Co-authored-by: Cursor AI</code></summary>

**Prompts:**
1. *Core app skeleton:* "Initialize the core Express application: set up `express.json()` body parsing, `cors`, and a central router mount point, so all future feature routes attach to one place instead of being registered ad hoc in `app.js`."
2. *Consistent error shape:* "Add a basic 404/fallback handler for unmatched API routes so the base app returns a consistent JSON error instead of Express's default HTML error page."

**Outcome:** Established the Express app skeleton — middleware order, central router mounting, and a consistent JSON 404 handler — that all subsequent feature routes were built on top of.

> **Reflection:** Getting middleware ordering right early (body parser and CORS before route mounting) avoided a class of "why isn't `req.body` populated" bugs later during the auth/vehicle work.

</details>

<details>
<summary><b>Commit 32</b> — fix(vercel): add SPA rewrites in vercel.json to resolve 404 on page refresh · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *SPA routing on static hosting:* "After deploying the frontend to Vercel, refreshing on any route other than `/` (e.g. `/dashboard`) returns a 404 from Vercel itself, not from React Router. Help me configure `vercel.json` with the correct rewrite rule so all paths fall back to `index.html` and client-side routing takes over."

**Outcome:** Added a `vercel.json` rewrite (`"source": "/(.*)"` → `"destination": "/index.html"`) so deep-linked or refreshed SPA routes resolve correctly on Vercel's static hosting.

> **Reflection:** Classic SPA-on-static-host gotcha — Vercel doesn't know about client-side routes, so without an explicit rewrite it tries to serve a real `/dashboard` file and 404s. Worth remembering for any future Vite/CRA deploy.

</details>

<details>
<summary><b>Commit 33</b> — add application workflow screenshots to documentation · <code>Human commit</code></summary>

**Bug fixes & refinement prompts:**
1. *Screenshot captions:* "Help me write concise captions for the application workflow screenshots (login, dashboard, admin CRUD modals, purchase flow) I'm adding to the README, so a reviewer can follow the flow without running the app."

**Outcome:** Added a visual walkthrough section to the README covering registration, browsing/searching inventory, admin vehicle management, and the purchase flow.

> **Reflection:** Screenshots let a reviewer verify the UI/UX quickly without cloning and running the project locally first.

</details>

<details>