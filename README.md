# Project management app

A single-owner workspace project and task manager. Every project, task, and activity event is scoped to its authenticated owner.

The client supports English and Arabic. Use the language toggle in the top bar or sign-in/sign-up pages; the choice is saved in the browser and Arabic switches the interface to right-to-left layout.

## Structure

```text
project-management/
├── client/                 # Vite + React + Tailwind client
│   └── src/
│       ├── components/     # Shared layout, forms, protected routes
│       ├── pages/          # Sign in, sign up, dashboard, project detail
│       └── services/       # Axios API client
├── server/
│   ├── prisma/             # PostgreSQL schema and initial SQL migration
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── lib/            # Prisma client
│       ├── middleware/     # Auth, validation, error handling
│       ├── routes/         # Versioned API routes
│       ├── schemas/        # Zod request schemas
│       └── services/       # Audit logging
├── .env.example
└── README.md
```

## Data model

- **User** owns zero or more projects and activity events; email is unique and the password hash is never returned by API handlers.
- **Project** belongs to exactly one user and has a title, description, status, priority, due date, and timestamps. It owns its tasks.
- **Task** belongs to exactly one project and has a title, description, status, due date, and timestamps. The project relation cascades deletion.
- **Activity** belongs to one user and optionally references a project/task. It records create/update/delete actions and a JSON snapshot; the optional target relations are set null on deletion.

The initial migration is in `server/prisma/migrations/20261017000000_init/migration.sql`. Authorization queries always include the authenticated `userId`, including nested task mutations.

## Setup

Requirements: Node.js 20+, npm, and PostgreSQL 14+.

1. Copy `server/.env.example` to `server/.env`, set `DATABASE_URL`, `JWT_SECRET` (at least 32 random characters), `CLIENT_ORIGIN`, and `COOKIE_SECURE` (`false` for local HTTP; `true` behind HTTPS). Copy `client/.env.example` to `client/.env.local` only if the API is not at `http://localhost:4000/api`.
2. Install and initialize the API:

   ```powershell
   cd server
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run dev
   ```

3. In another terminal, install and start the client:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

4. Open the Vite URL printed in the client terminal. The API listens on `http://localhost:4000` by default.

Use `npm run build` in `client` for a production bundle and `npm start` in `server` to run the API. Apply database migrations with `npx prisma migrate deploy` for production; do not use `prisma db push` as a deployment strategy. Configure the reverse proxy to serve the client and API over HTTPS, set `COOKIE_SECURE=true`, and restrict `CLIENT_ORIGIN` to the deployed client origin.

## API

All routes are under `/api`. Authentication:

- `POST /auth/signup`, `POST /auth/signin`, `POST /auth/signout`, `GET /auth/me`

Projects and dashboard (authenticated):

- `GET|POST /projects`, `GET|PATCH|DELETE /projects/:projectId`
- `GET|POST /projects/:projectId/tasks`, `PATCH|DELETE /projects/:projectId/tasks/:taskId`
- `GET /dashboard`

Project list query parameters: `search`, `status`, `priority`, `sort` (`dueDate`, `createdAt`, `title`), and `order` (`asc`, `desc`). Task list accepts `search`, `status`, `sort` (`dueDate`, `createdAt`, `title`), and `order`.

Authentication uses a signed JWT in an HTTP-only, SameSite=Lax cookie. Mutating requests require the configured application origin; the API also uses credentialed CORS, Helmet, JSON size limits, Zod validation, and per-route rate limits on sign-in/sign-up. Set `TRUST_PROXY=1` only when the service is behind a trusted reverse proxy.
