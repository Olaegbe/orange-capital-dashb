# Orange Capitals V83 — Hostinger deployment

This package contains the approved V83 React frontend and a Node.js/Express + MySQL backend. The frontend is served by the same Node process and calls `/api` on the same domain. No Supabase project is required by this Hostinger build.

## 1. Create the MySQL database

1. In Hostinger hPanel, open **Databases → Management** and create a MySQL database and database user.
2. Open phpMyAdmin for that database.
3. Import `backend/sql/schema.sql`.
4. Keep the database name, username, password and host available for the environment variables below. Hostinger documents `127.0.0.1` as the database host for a Node.js application connecting to a Hostinger MySQL database. Do not use `localhost` for this Node.js connection because it may resolve to IPv6 `::1`.

## 2. Configure the Node.js application

1. In hPanel, choose **Websites → Create site → Web App → Upload your website files**, then upload this ZIP.
2. Select Node.js 22 (Hostinger currently supports Node.js 18, 20, 22 and 24 for managed Node.js apps).
3. Set the build command to `npm run build`. Set the start command to `npm start`; if Hostinger asks for an entry file, use `server.js`. The project root contains both `package.json` and `server.js`. Hostinger installs npm dependencies during deployment.
4. Add these environment variables in Hostinger's Node.js application settings:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | Use Hostinger's assigned port if it requires one; otherwise leave it to the platform |
| `APP_ORIGIN` | Your HTTPS domain |
| `JWT_SECRET` | At least 48 random characters; use a unique secret |
| `ADMIN_BOOTSTRAP_SECRET` | A different, long random one-time setup secret |
| `DB_HOST` | `127.0.0.1` (Hostinger's documented local Node.js-to-MySQL host) |
| `DB_PORT` | `3306` unless Hostinger specifies otherwise |
| `DB_NAME` | Hostinger database name |
| `DB_USER` | Hostinger database username |
| `DB_PASSWORD` | Hostinger database password |
| `JSON_BODY_LIMIT` | `20mb` |

Do not upload `.env` containing real credentials into a public web directory. Set secrets through Hostinger's environment-variable controls. Never put database passwords or JWT secrets in `VITE_` variables.

## 3. Build and start

Hostinger runs the install/build/start commands from the deployment settings. Use `npm run build` as the build command and `npm start` as the start command. The Node application serves the built React site and API from one origin. The included `.env.production` tells Vite to call `/api` and enables persistent backend mode. If you build locally instead, retain that file or set the same two Vite variables during the build.

## 4. Create the first administrator

1. Open the deployed website and use the **first administrator setup** option on the login screen.
2. Enter the exact `ADMIN_BOOTSTRAP_SECRET` environment value, administrator name, email and a strong password (at least 14 characters with letters and numbers).
3. Submit once. The endpoint refuses to create another administrator after one exists.
4. Immediately remove `ADMIN_BOOTSTRAP_SECRET` from Hostinger's environment variables and restart/redeploy the application.
5. Sign in with the new administrator account and create staff accounts from **Access**.

Do not share the bootstrap secret or administrator password. There are no demo accounts or seeded customer/loan records.

## 5. Verify before entering live customer data

- Open `https://YOUR-DOMAIN/api/health`. It should return `ok: true` and `database: "connected"`.
- Sign in as the administrator.
- Create one controlled test staff account and verify its assigned branch and access restrictions.
- Create a clearly identified internal test customer/application, verify it appears in another permitted session, then delete it.
- Verify repayment, loan status, notifications and audit records before migrating any existing live records.
- Confirm HTTPS is active so the HttpOnly session cookie is secure.

## Data model and sync

Operational collections are stored as JSON documents in `oc_documents`, with indexed collection, document ID and branch columns. Key dashboard settings are in `oc_settings`; user credentials and permissions are in `oc_users`; audit entries and change-feed events are in `oc_audit_logs` and `oc_change_log`. Each sync batch is transactional. The frontend's existing 10-second polling uses the change feed.

## Important operational controls

- Back up the MySQL database daily and before every application update. Test restoring a backup.
- Restrict Hostinger database access to the application where Hostinger allows it.
- Use HTTPS only; do not disable HttpOnly or Secure session-cookie settings.
- Staff roles and branch checks are enforced by the API for collection reads/writes. Review custom access profiles before granting access.
- Uploaded photos/documents embedded in V83 record data are currently persisted as record payloads. Keep individual record payloads below 8 MB. A dedicated private object-storage service and signed download links should be added before large-scale document archiving.
- The backend records repayments and disbursement workflow data; it does not connect to a bank, initiate transfers, or independently verify bank settlement. Those capabilities require a separately approved payment/banking integration.
- This is the first operational backend release. Perform the acceptance tests above and a security review before entering real customer financial data.
