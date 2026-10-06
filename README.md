# HealthCoverSim — Private Health Insurance Quote Simulator

CSE3CWA / CSE5006 · Assignment 1 · 2026

HealthCoverSim is a small full-stack web app that simulates a private health insurance quote system. A user can create, view, edit and delete quote records. For each quote, the app calculates an estimated monthly and yearly premium from the cover type, hospital and extras cover, applicant ages, Lifetime Health Cover (LHC) loading, the family upgrade fee and the annual-payment discount, then explains every number in plain English.

> This is a learning simulator only. It is not financial advice and does not match any real insurer's pricing.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS, lucide-react (icons) |
| Backend | Node.js, Express 5, CORS |
| Database | SQLite via `better-sqlite3` |

## Project structure

```
.
├── client/                     React frontend (Vite)
│   ├── constants/
│   │   ├── pricing.js          Hospital and extras base prices
│   │   └── validOptions.js     Allowed values for each dropdown (shared with the server)
│   └── src/
│       ├── components/         Navbar, QuoteForm, QuoteCard, BreadCrumb, etc.
│       └── pages/              Home, list, create, detail, edit, not-found
└── server/                     Express API + SQLite
    ├── db.js                   Creates the database/table and holds all SQL queries
    ├── index.js                Server entry point
    ├── routes/quotes.js        CRUD routes + validation middleware
    └── healthcoversim.db       SQLite database file (created automatically if missing)
```

## How to install and run

### Prerequisites

- **Node.js 22 or newer** (with npm). The server uses `import.meta.dirname`, which needs a recent Node version.
- Keep the `client` and `server` folders side by side. The server imports `client/constants/validOptions.js`, so it will not start if the `client` folder is missing.

### 1. Start the backend

```bash
cd server
npm install
npm run server
```

The API runs at **http://localhost:5000**. (`npm run server` uses `nodemon`, which restarts on file changes. You can also run `node index.js`.) To use a different port, set `PORT` in a `server/.env` file.

### 2. Start the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints, normally **http://localhost:5173**.

> Both servers must be running at the same time. The frontend calls the API at `http://localhost:5000`.

## How the database is created

The database is set up by **`server/db.js`**. Every time the server starts, `db.js` opens (or creates) `server/healthcoversim.db` and runs:

```sql
CREATE TABLE IF NOT EXISTS quotes (...)
```

No manual setup step is needed. To reset to an empty database, stop the server, delete `server/healthcoversim.db`, and start the server again.

The `quotes` table stores only the **input fields**, as the assignment recommends:

| Column | Notes |
|---|---|
| `id` | Primary key, auto-increment |
| `customer_name` | Required |
| `cover_type` | Single / Couple / Family |
| `applicant1_age`, `applicant1_cover_history` | Required |
| `applicant2_age`, `applicant2_cover_history` | `NULL` for Single; required (by a `CHECK` constraint) for Couple/Family |
| `hospital_cover` | None / Basic / Bronze / Silver / Gold |
| `extras_cover` | None / Basic / Standard / Premium |
| `payment_frequency` | Monthly / Yearly |
| `annual_discount` | `NULL` for Monthly; required (by a `CHECK` constraint) for Yearly |
| `notes` | Optional |
| `created_at` | Defaults to the current time |

The premium itself is **not stored**. It is calculated when the quote detail page is displayed, so the pricing logic lives in one place.

## API endpoints

Base URL: `http://localhost:5000/api/quotes`

| Method | Path | Description | Success | Errors |
|---|---|---|---|---|
| GET | `/getAllQuotes` | List all quotes, newest first | 200 | 500 |
| GET | `/getQuote/:quoteID` | Get one quote | 200 | 400 invalid id, 404 not found |
| POST | `/` | Create a quote | 201 `{ quoteID }` | 400 invalid body |
| PUT | `/:quoteID` | Update a quote | 200 `{ quoteID }` | 400 invalid id/body, 404 not found |
| DELETE | `/:quoteID` | Delete a quote | 200 | 400 invalid id, 404 not found |

## How the quote calculation works

All base prices are **per adult, per month**. Hospital and extras are priced **separately** and then added together.

| Hospital cover | Price | Extras cover | Price |
|---|---|---|---|
| None | $0 | None | $0 |
| Basic | $90 | Basic | $25 |
| Bronze | $120 | Standard | $45 |
| Silver | $160 | Premium | $70 |
| Gold | $220 | | |

```
hospital (per adult)    = hospital tier price × (1 + that adult's LHC loading)
hospital total          = sum over adults (1 for Single, 2 for Couple/Family)
extras total            = extras tier price × adult count
family fee              = $30 if Family, otherwise $0
monthly premium         = hospital total + extras total + family fee
yearly before discount  = monthly premium × 12
yearly after discount   = yearly before discount × (1 − annual discount%)   [Yearly payment only]
```

### Lifetime Health Cover (LHC) loading

LHC loading applies **only to hospital cover, never to extras**, and is worked out **separately for each applicant**:

| Applicant's cover history | Loading |
|---|---|
| Yes (had cover before) | 0% |
| No | `(age − 30) × 2%` if age is over 30, otherwise 0% |
| Not Sure | 0%, with a warning that the quote may be inaccurate |

If hospital cover is **None**, no loading is applied because there is nothing to load.

The detail page always shows the statement:
*"Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover."*

### Monthly vs yearly payment

- **Monthly:** shows the monthly premium and the yearly premium. No discount is applied.
- **Yearly:** shows the monthly premium, the yearly premium before discount, and the yearly premium after the annual discount (0–10%).

### Worked example (Section 7 of the assignment)

Family cover, Applicant 1 aged 40 with no prior cover, Applicant 2 aged 35 with prior cover, Silver hospital, Standard extras, Yearly payment with a 5% discount:

| Step | Result |
|---|---|
| Applicant 1 loading | (40 − 30) × 2% = 20% → $160 × 1.20 = $192 |
| Applicant 2 loading | 0% → $160 |
| Hospital total | $192 + $160 = $352 |
| Extras total | $45 × 2 adults = $90 |
| Family upgrade fee | $30 |
| **Monthly premium** | $352 + $90 + $30 = **$472** |
| **Yearly before discount** | $472 × 12 = **$5,664** |
| **Yearly after 5% discount** | $5,664 × 0.95 = **$5,380.80** |

## How Family cover is calculated

Family cover is treated as **two adults plus a flat $30/month upgrade fee**:

- Hospital and extras are each charged for **2 adults**, with each adult's LHC loading calculated separately.
- The **$30/month family upgrade fee** is added **once**, automatically. The user never enters it.
- Children are **not** priced individually and their ages are not collected.
- There is no Couple or Family discount. The only discount is the annual-payment discount, which applies only when paying Yearly.

## Validation

**Frontend (`QuoteForm.jsx`):** every required field is checked before submitting; ages use number inputs limited to 18–100; the discount is limited to 0–10; and the Applicant 2 fields are rendered (and required) only when Couple or Family is selected. Error messages appear under each field.

**Backend (`routes/quotes.js`):** a `validateQuoteBody` middleware runs on both POST and PUT, so invalid data sent straight to the API is rejected with a `400` and a JSON list of errors rather than crashing. It checks that:

- the body is a JSON object and all expected keys are present;
- the customer name is a non-empty string;
- ages are integers from 18 to 100 (Applicant 2 only for Couple/Family);
- dropdown values match the allowed options, ignoring upper/lower case, and are saved in their canonical form;
- the annual discount is a number from 0 to 10 when paying Yearly;
- Applicant 2 fields are set to `NULL` for Single cover.

A separate `validateQuoteID` middleware returns `400` for non-numeric or non-positive IDs, and the routes return `404` when a quote does not exist. Invalid URLs and missing quotes show a "not found" page in the UI.

## AI use statement

> **Replace the bracketed parts below with your own account before submitting. This section must be accurate and in your own words.**

- **Tool used:** Claude
- **What it helped with:** It helped me debug code when encountering errors, assist wording for the README file, and brainstorming what design choice like structure or color pallette to use for a specific feature.
- **What I implemented and checked myself:** I coded the UI, backend functions, and the SQLite database initialization by myself. I checked on the cost calculations whether they are correct or not by testing all of the inputs from their own fields at least once.
- **One decision I made myself:** A decision I made myself is adding a home page to the web application even though it's not required, since I thought it would be a "nice to have" feature.

## Limitations

- **The LHC rule is simplified,** as the assignment allows. Loading is always `(age − 30) × 2%`, with no cap and no removal after years of continuous cover, so results will not match a real insurer.
- **The premium is calculated in the frontend** (on the detail page), not by the API. The backend validates and stores inputs but does not return a calculated premium, so other API clients would need to repeat the pricing logic.
- The API address (`http://localhost:5000`) is hard-coded in the client, so the project is set up for local use only.

## Author

Rafael Anderson · 23025356 · [Subject: CSE3CWA / CSE5006]
