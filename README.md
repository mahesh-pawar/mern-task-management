# Task Manager

A multi-user task management app built with the MERN stack. Users register, log in and manage their own tasks from a responsive dashboard. Each user can only see and change their own tasks.

## Features

- Register, log in and log out, with the JWT stored in an **HTTP-only cookie**
- Session restore after a page refresh (`GET /api/auth/me`)
- Protected frontend routes and protected API endpoints
- Task CRUD, quick status updates, priorities and due dates
- Server-side search (title), filters (status, priority), sorting (created / due date) and pagination
- Dashboard: total, pending, in-progress, completed and overdue counts, plus completion percentage
- Task ownership enforced on the backend: `userId` always comes from the token, never from the request
- Request validation with field-level error codes (`express-validator`)
- Centralised error handling with a consistent response envelope
- CSRF protection (SameSite cookie + Origin check), CORS limited to the client origin, and security headers with `helmet`
- Loading, empty and error states, delete confirmation, mobile-friendly layout

## Tech Stack

| Layer          | Technology                                   |
|----------------|----------------------------------------------|
| Frontend       | React 19, Vite, Tailwind CSS v4, React Router |
| HTTP client    | Axios (centralised service layer)            |
| Backend        | Node.js, Express 5                           |
| Database       | MongoDB with Mongoose                        |
| Auth           | JSON Web Tokens (`jsonwebtoken`) in HTTP-only cookies |
| Password hash  | `bcryptjs`                                   |
| Validation     | `express-validator`                          |
| Security       | `helmet`, `cors`, Origin-check CSRF middleware |

## Project Structure

```
.
├── server/
│   └── src/
│       ├── config/
│       │   ├── env.js               # Loads + validates environment variables
│       │   └── database.js          # MongoDB connection
│       ├── modules/
│       │   ├── auth/                # routes, controller, service, validator, user.model
│       │   ├── tasks/               # routes, controller, service, validator, task.model
│       │   └── dashboard/           # routes, controller, service (aggregation)
│       ├── middlewares/
│       │   ├── auth.middleware.js   # requireAuth: reads the cookie, sets req.userId
│       │   ├── csrf.middleware.js   # Origin check on state-changing requests
│       │   ├── validate.middleware.js
│       │   └── error.middleware.js  # 404 + centralised error handler
│       ├── utils/                   # AppError, apiResponse, cookie, escapeRegex
│       ├── app.js                   # Express app (middleware + routes)
│       └── server.js                # Connects to MongoDB and starts listening
└── client/
    └── src/
        ├── components/              # common/ (Button, Modal, ...), layout/, tasks/
        ├── features/                # auth/, tasks/, dashboard/ (pages + feature logic)
        ├── hooks/                   # useDebounce
        ├── layouts/                 # AppLayout, AuthLayout
        ├── routes/                  # AppRoutes, ProtectedRoute, GuestRoute
        ├── services/                # api.js (axios instance) + one service per resource
        └── utils/                   # date helpers
```

Each backend module follows **routes → validator → controller → service → model**. Controllers only deal with `req`/`res`; business logic and database access live in services.

## Getting Started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 8 and Mongoose 9). Check with `node -v`.
- **MongoDB**: either a local install that is running (default `mongodb://127.0.0.1:27017`), or a free MongoDB Atlas cluster.
- Git

### Installation

```bash
git clone https://github.com/mahesh-pawar/mern-task-management.git
cd mern-task-management
cd server && npm install
cd ../client && npm install
cd ..
```

### Environment Variables

Create `server/.env` from the example:

```bash
# macOS / Linux / Git Bash
cp server/.env.example server/.env

# Windows (Command Prompt)
copy server\.env.example server\.env
```

Then open `server/.env` and set at least:

- `JWT_SECRET`: replace the placeholder with a random string (command below).
- `MONGODB_URI`: keep the default for a local MongoDB, or paste your Atlas connection string.

| Variable         | Description                                         | Example                                   |
|------------------|-----------------------------------------------------|-------------------------------------------|
| `NODE_ENV`       | `development` or `production`                       | `development`                             |
| `PORT`           | Port the API listens on                             | `5000`                                    |
| `MONGODB_URI`    | MongoDB connection string                           | `mongodb://127.0.0.1:27017/task-manager`  |
| `JWT_SECRET`     | Secret used to sign JWTs                            | `your_random_secret`                      |
| `JWT_EXPIRES_IN` | Token lifetime (the cookie lasts 1 day)             | `1d`                                      |
| `SALT_ROUNDS`    | bcrypt salt rounds                                  | `10`                                      |
| `CLIENT_URL`     | Frontend origin allowed by CORS and the CSRF check  | `http://localhost:5173`                   |

> Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

The client needs no environment variables in development. See `client/.env.example`.

### Running Locally

```bash
# terminal 1 — API on http://localhost:5000
cd server
npm run dev

# terminal 2 — React app on http://localhost:5173
cd client
npm run dev
```

Open http://localhost:5173, click **Create one** to register, and start adding tasks. Vite proxies `/api` to the server, so the browser only ever talks to one origin.

If the server exits with `Missing required environment variables`, `server/.env` is missing or incomplete. If it can't connect to MongoDB, make sure MongoDB is running or check your `MONGODB_URI`.

Check the API is running:

```bash
curl http://localhost:5000/api/health
```

## API Reference

Every response uses the same envelope:

```json
{ "status": "success", "message": "...", "data": { } }
{ "status": "error", "code": "VALIDATION_ERROR", "message": "...", "errors": [{ "field": "title", "code": "FIELD_REQUIRED", "message": "Title is required" }] }
```

### Auth — `/api/auth`

| Method | Endpoint             | Auth | Description                                      |
|--------|----------------------|------|--------------------------------------------------|
| POST   | `/api/auth/register` | No   | Create an account and set the auth cookie        |
| POST   | `/api/auth/login`    | No   | Log in and set the auth cookie                   |
| POST   | `/api/auth/logout`   | Yes  | Clear the auth cookie                            |
| GET    | `/api/auth/me`       | Yes  | Current user (used to restore the session)       |

**Register:** `POST /api/auth/register`

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securePass123" }
```

**Success: `201 Created`.** Sets `token` as an HTTP-only cookie.

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": { "user": { "_id": "665f...", "name": "Jane Doe", "email": "jane@example.com", "createdAt": "...", "updatedAt": "..." } }
}
```

| Status | Code                   | Meaning                                   |
|--------|------------------------|-------------------------------------------|
| 400    | `VALIDATION_ERROR`     | Missing/invalid name, email or password   |
| 409    | `EMAIL_ALREADY_EXISTS` | An account with this email already exists |

**Login:** `POST /api/auth/login` with `{ "email", "password" }`. Returns `200` and sets the cookie. Returns `401 INVALID_CREDENTIALS` for an unknown email or a wrong password (the same response for both, so accounts can't be enumerated).

**Protected endpoints** return `401` with `UNAUTHORIZED`, `INVALID_TOKEN` or `TOKEN_EXPIRED` when the cookie is missing or invalid.

### Tasks — `/api/tasks` (all require auth)

| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/api/tasks`             | Create a task                   |
| GET    | `/api/tasks`             | List the user's tasks           |
| GET    | `/api/tasks/:id`         | Get one task                    |
| PUT    | `/api/tasks/:id`         | Update a task                   |
| PATCH  | `/api/tasks/:id/status`  | Update only the status          |
| DELETE | `/api/tasks/:id`         | Delete a task                   |

**Task body**

| Field         | Type   | Rules                                            |
|---------------|--------|--------------------------------------------------|
| `title`       | string | required, max 200                                |
| `description` | string | optional, max 2000                               |
| `status`      | string | `todo` (default), `in_progress`, `completed`     |
| `priority`    | string | `low`, `medium` (default), `high`                |
| `dueDate`     | string | optional ISO 8601 date; `null` clears it         |

Any `userId` sent by the client is ignored. The owner always comes from the token.

**List query parameters**

| Param      | Values                       | Default     |
|------------|------------------------------|-------------|
| `page`     | integer ≥ 1                  | `1`         |
| `limit`    | 1–50                         | `10`        |
| `status`   | `todo`, `in_progress`, `completed` | all   |
| `priority` | `low`, `medium`, `high`      | all         |
| `search`   | text, case-insensitive match on title (max 100) | — |
| `sortBy`   | `createdAt`, `dueDate`       | `createdAt` |
| `order`    | `asc`, `desc`                | `desc`      |

```
GET /api/tasks?page=1&limit=10&status=todo&priority=high&search=meeting&sortBy=createdAt&order=desc
```

```json
{
  "status": "success",
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [ { "_id": "...", "title": "Team meeting", "status": "todo", "priority": "high", "dueDate": null, "userId": "...", "createdAt": "...", "updatedAt": "..." } ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
}
```

| Status | Code               | Meaning                                                  |
|--------|--------------------|----------------------------------------------------------|
| 400    | `VALIDATION_ERROR` | Invalid body, query parameter or task id                 |
| 404    | `TASK_NOT_FOUND`   | Task doesn't exist **or belongs to another user**        |

### Dashboard: `GET /api/dashboard/stats` (requires auth)

```json
{
  "status": "success",
  "message": "Dashboard stats fetched successfully",
  "data": { "stats": { "total": 12, "pending": 9, "inProgress": 2, "completed": 1, "overdue": 1, "completionRate": 8 } }
}
```

`pending` = status `todo`. `overdue` = not completed and the due date has passed. The client saves a due date as the end of the chosen day, so a task due today only becomes overdue after today ends. Everything is computed in a single aggregation over the user's own tasks.

## Key Technical Decisions

1. **Multi-user ownership enforced on the backend.** `requireAuth` puts the id from the verified JWT on `req.userId`. Every task query filters on `{ _id, userId }`, and controllers only pass validated body fields to services (`matchedData`), so a client-supplied `userId` never reaches the database. Another user's task returns `404` rather than `403`, so the API doesn't reveal that the task exists.
2. **JWT in an HTTP-only cookie, with session restore.** The token is never readable by JavaScript, which reduces the impact of XSS. The cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production and expires after 1 day. On load, the React `AuthProvider` calls `/api/auth/me`, and protected routes wait for that call before redirecting. The client always calls the API on the same site (Vite proxy in development, a `vercel.json` rewrite in production), so `SameSite=Lax` blocks cross-site requests from carrying the cookie. A second layer, `csrf.middleware.js`, rejects state-changing requests (POST/PUT/PATCH/DELETE) whose `Origin` isn't the client. Requests with no `Origin` header, such as curl or Postman, are allowed: browsers always send `Origin` on these requests, and a non-browser client can't be tricked into sending a user's cookie.
3. **Server-side filtering, pagination and indexing.** Filters are applied before `skip`/`limit`, and the page and total count run in parallel. Search input is regex-escaped. Indexes match the actual queries: `{ userId, status, createdAt }` for the default list view and status filter, and `{ userId, dueDate }` for due-date sorting and the overdue count. `User.email` has a unique index.

## Features Intentionally Not Implemented

1. **Google / social login.** Email and password covers the requirements. OAuth would add provider setup, account linking and more failure modes.
2. **Real-time collaboration.** Tasks have a single owner, so live updates (WebSockets) and shared lists would add infrastructure without serving the core workflow.
3. **Email notifications and reminders.** These need an email provider, a job scheduler and delivery handling, which is outside the scope of an MVP.

Also out of scope: file attachments, role-based access control, teams, activity feeds.

## Known Limitations

- **No automated test suite yet.** With one more day, the first thing I'd add is Jest + Supertest + `mongodb-memory-server` integration tests running in CI.
- **No rate limiting** on login/register yet (planned with `express-rate-limit`).
- **No request logging (`morgan`) yet.**
- **Stateless JWT.** Logout clears the cookie, but a token copied before logout stays valid until it expires (1 day). A token denylist or short-lived access + refresh tokens would fix this.
- With `sortBy=dueDate&order=asc`, tasks without a due date are listed first (MongoDB sorts `null` lowest).

## Deployment

1. **Database:** create a MongoDB Atlas cluster and copy the connection string.
2. **API (Render / Railway):** root directory `server`, build `npm install`, start `npm start`. Set the environment variables above with `NODE_ENV=production` and `CLIENT_URL=https://<your-vercel-app>.vercel.app`. `NODE_ENV=production` matters: it turns on secure cookies and `trust proxy`, which secure cookies need behind the host's proxy.
3. **Client (Vercel):** root directory `client`, framework preset Vite. In `client/vercel.json`, replace `YOUR-API-HOST.onrender.com` with your API host. The rewrite keeps `/api` on the same site as the app, so the cookie stays first-party.
