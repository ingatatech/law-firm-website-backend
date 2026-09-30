# Law Firm Website — Backend

Node.js + Express + Prisma + PostgreSQL. Matches the design in `BACKEND_ANALYSIS.md` and `LawFirm_Database_Logic.pdf` from earlier planning.

## Setup — run these commands in order

```bash
npm install
```

Copy the environment file and fill in your real PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env` and replace `YOUR_USERNAME` / `YOUR_PASSWORD` with your real PostgreSQL login. Also replace `JWT_SECRET` with any long random string.

If your database tables don't exist yet:

```bash
npx prisma migrate dev --name init
```

If your tables already exist from before, skip that and just run:

```bash
npx prisma generate
```

Add a starter admin login and one sample practice area:

```bash
node prisma/seed.js
```

Start the server:

```bash
npm run dev
```

You should see: `Server running on http://localhost:5000`

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

**Not built yet (Phase 2 — admin CRUD):**
Managing practice areas, attorneys, articles, and FAQs through the API (create/edit/delete), and viewing/updating consultation requests as an admin. The `requireAuth` middleware (`src/middleware/requireAuth.js`) is ready to protect these routes once you build them — attach it to a route like this:

```js
router.post('/', requireAuth, createPracticeArea)
```

## Testing the endpoints

With the server running, test in your browser (for GET routes) or Postman/Thunder Client (for POST routes and anything needing a login):

```
GET  http://localhost:5000/api/practice-areas
GET  http://localhost:5000/api/health
POST http://localhost:5000/api/auth/login
  body: { "email": "admin@example-law.rw", "password": "ChangeMe123!" }
```

## Connecting your React frontend to this

In each page's mock-data import, replace it with a `fetch` call to the matching endpoint above. Example, in `PracticeAreas.jsx`:

```js
// Before:
import { practiceAreas } from '../data/mockData'

// After:
const [practiceAreas, setPracticeAreas] = useState([])
useEffect(() => {
  fetch('http://localhost:5000/api/practice-areas')
    .then((res) => res.json())
    .then(setPracticeAreas)
}, [])
```

Ask me to walk through this conversion for one page first before repeating it across the rest.
