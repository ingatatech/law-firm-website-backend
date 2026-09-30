# Law Firm Website — Backend

Node.js + Express + Prisma + PostgreSQL.

## What's built vs. not built yet

**Working now (public endpoints + login):**
- `GET /api/practice-areas` and `/api/practice-areas/:slug`
- `GET /api/attorneys` and `/api/attorneys/:id`
- `GET /api/articles` and `/api/articles/:slug` (published only — drafts stay hidden)
- `GET /api/faqs`
- `POST /api/consultation-requests`
- `POST /api/contact-inquiries`
- `POST /api/auth/login` (use the seeded admin: `admin@example-law.rw` / `ChangeMe123!`)
- `GET /api/health` — quick check the server is alive


## Testing the endpoints

With the server running,

```
GET  http://localhost:5000/api/practice-areas
GET  http://localhost:5000/api/health
