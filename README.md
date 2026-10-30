# Orange Capitals Limited — V83

Approved React/Vite frontend plus a Node.js/Express backend for Hostinger Business Web Hosting. The Hostinger build uses MySQL for shared persistent records and local backend authentication; it does not require Supabase.

## Local development

```bash
npm install
cp .env.example .env
# Set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET
# Import backend/sql/schema.sql into the MySQL database
npm run build
npm start
```

For frontend development use `npm run dev`; configure `VITE_API_URL=/api` and `VITE_AUTH_ONLY=false` in the Vite environment.

## Backend features

- First administrator bootstrap protected by a one-time secret.
- Password hashing with bcrypt and HttpOnly, Secure-in-production session cookies.
- Administrator-only staff creation, activation/deactivation, access profile, branch and password management.
- Persistent collections for customers, business development, investors, records, roles, messages, tasks, loans, inventory, vehicles, notifications, record tickets and workflow.
- Transactional multi-collection sync, branch-aware access checks and incremental change feed.
- Audit trail for sign-ins, staff management and sync writes.
- MySQL schema in `backend/sql/schema.sql`.

## Deployment

Follow `HOSTINGER_DEPLOYMENT.md` carefully. Do not enter live customer or financial data until the database health check, administrator setup, branch/access tests, cross-session sync and backup/restore tests pass.

## Important scope boundary

This backend provides secure record persistence and workflow synchronization for the existing V83 frontend. It does not execute bank transfers or verify payment settlement. Uploaded file payloads are limited in size; private object storage and signed file links are recommended before high-volume document storage. Financial calculations shown by the frontend should be independently reconciled against approved company policy before production use.
