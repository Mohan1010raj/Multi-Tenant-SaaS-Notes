# SaaS Notes - Multi-tenant Demo

This is a sample multi-tenant SaaS Notes application built with Next.js (API routes) and Prisma (SQLite).
It implements:
- Multi-tenancy (shared schema with `tenantId` column).
- JWT authentication.
- Roles: Admin and Member.
- Subscription gating: Free plan = max 3 notes; Pro = unlimited.
- Required endpoints and a minimal animated frontend.

## Architecture & Multi-Tenancy choice
**Approach:** Shared schema with a `tenantId` column on user and note models.
Reason: simple to implement and efficient for small demo projects; keeps strict logical isolation in application layer and DB queries always filter by tenant.

## Predefined test accounts (password = password)
- admin@acme.test (Admin, tenant: acme)
- user@acme.test (Member, tenant: acme)
- admin@globex.test (Admin, tenant: globex)
- user@globex.test (Member, tenant: globex)

## Scripts
- `npm install`
- `npx prisma migrate dev --name init` (or `prisma migrate deploy`)
- `npm run seed` — seeds tenants, users, and notes.
- `npm run dev` — runs Next.js dev server.

## API Endpoints (examples)
- `GET /api/health` → `{ "status": "ok" }`
- `POST /api/auth/login` — returns `token`
- `POST /api/tenants/:slug/upgrade` — Admin only, upgrades tenant to pro
- Notes CRUD under `/api/notes`

## Deployment
Both backend and frontend are in this Next.js app and can be deployed to Vercel.
Set environment variables in Vercel:
- `JWT_SECRET` — secret for signing tokens (default provided in .env.local)
- `DATABASE_URL` — sqlite file url (default in .env.local)

## Important
This is a demo. For production use:
- Use Postgres or another managed DB.
- Harden JWT & cookie handling, HTTPS, input validation.
- Add rate limiting and proper email invite flows.

