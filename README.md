# SproutFund

SproutFund helps first-time investors — especially college students — make smart decisions with their money. Users enter a budget, timeline, and risk tolerance, and the app generates personalized investment strategies powered by the Claude AI. Results include specific fund names, allocation percentages, platform recommendations, and a visual portfolio breakdown.

---

## Tech Stack

### Frontend

- **React 19** — UI framework
- **Vite** — build tool and dev server
- **React Router v7** — client-side routing
- **Plain CSS** — styling (no Tailwind or CSS frameworks)

### Backend

- **Java 17+** — language
- **Spring Boot 3** — REST API framework
- **Maven** — dependency management and build tool
- **Anthropic Java SDK** — Claude AI integration

### Database & Auth

- **Supabase** — hosted Postgres database + authentication
- Auth (sign up/login/sessions) is handled entirely by Supabase Auth on the frontend (`@supabase/supabase-js`)
- The Spring Boot backend verifies Supabase-issued JWTs and reads/writes `investment_recommendations` directly over Postgres — it never touches passwords or `auth.users`

### Design System

- Located in `green-design/` — fonts, color tokens, spacing rules, and component patterns
- Primary font: **Maison Neue Extended** (headings) + **Capsule Sans Text Mono** (body)
- Accent color: `#ccff00`

---

## Project Structure

```text
SproutFund/
├── frontend/                        # React app (Vite)
│   ├── public/
│   │   └── fonts/                   # Design system fonts
│   ├── .env.local                   # Local env vars (Supabase URL/anon key) — never commit this
│   └── src/
│       ├── components/              # Reusable components (BudgetInput, etc.)
│       ├── context/                 # Auth and Theme context providers
│       ├── lib/                     # Supabase client, shared label maps
│       ├── pages/                   # Page-level components (InvestmentForm, Results, History)
│       ├── App.jsx
│       └── main.jsx
├── backend/                         # Spring Boot API
│   ├── .env                         # Local env vars — never commit this
│   └── src/main/java/com/sproutfund/
│       ├── config/                  # Spring beans (Claude API client setup)
│       ├── controller/              # REST controllers
│       ├── dto/                     # Request/response DTOs
│       ├── model/                   # Domain models (InvestmentRequest, InvestmentRecommendation, etc.)
│       ├── security/                # Spring Security resource-server config (verifies Supabase JWTs)
│       └── service/                 # Business logic (Claude API calls)
├── supabase/
│   └── schema.sql                   # Run once in the Supabase SQL Editor — profiles, investment_recommendations, RLS
└── green-design/                    # Design system reference
```

---

## Getting Started

### Prerequisites

Make sure these are installed before you begin:

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Java 17+** — [adoptium.net](https://adoptium.net)
- **Maven 3.9+** — [maven.apache.org](https://maven.apache.org)

### 1. Clone the repo

```bash
git clone https://github.com/valeriachaconlanz/SproutFund.git
cd SproutFund
```

### 2. Set up environment variables

Both files have committed templates — [`backend/.env.example`](backend/.env.example) and [`frontend/.env.local.example`](frontend/.env.local.example). Copy the template and fill in the real values, or paste in the ready-made files from the group chat. The real `.env` / `.env.local` are gitignored and never committed.

**Frontend** — get `frontend/.env.local` from the group chat, or create it yourself:

```text
SproutFund/
└── frontend/
    └── .env.local   ← place it here
```

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Backend** — get the `.env` file from the group chat and save it inside the `backend/` folder:

```text
SproutFund/
└── backend/
    └── .env   ← place it here
```

```bash
export ANTHROPIC_API_KEY=sk-ant-...              # Claude AI key
export SUPABASE_PROJECT_REF=xxxx                 # Project reference ID
export SUPABASE_DB_URL=jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:5432/postgres
export SUPABASE_DB_USER=postgres.xxxx            # "postgres." + your project ref
export SUPABASE_DB_PASSWORD=...                   # Database password
```

> **Use the Session pooler host above, not `db.<ref>.supabase.co`.** Supabase's
> direct connection host resolves to an IPv6 address *only* — it has no IPv4
> address at all. It therefore works exclusively on networks that provide
> working IPv6, which many campus, guest, office, and wired networks do not.
> The pooler host has an IPv4 address and reaches the same database, so it
> works everywhere. Note the `aws-1` prefix and the `SUPABASE_DB_USER` line —
> the pooler requires the username to be `postgres.<project-ref>`, not plain
> `postgres`.

#### Creating the file in VS Code (Windows)

On Windows, File Explorer and Notepad make files that start with a dot hard to create — they rename `.env` or add a hidden `.txt`. Create it inside VS Code instead:

1. In the **Explorer** sidebar (left), click the **`backend`** folder to select it (or **`frontend`** for the frontend file).
2. Click the **New File** icon at the top of the Explorer, or right-click the folder → **New File…**
3. Type the name exactly, **including the leading dot** — `.env` for the backend, `.env.local` for the frontend — and press **Enter**.
4. Paste in the variables, fill in the real values, and save with **Ctrl + S**.
5. Check the name in the sidebar reads exactly `.env` (not `.env.txt` or `env`). If it's wrong, right-click → **Rename** and fix it.

> **Fastest way:** right-click the matching `.env.example` in the sidebar → **Copy**, then **Paste**, then **Rename** the copy to `.env` (or `.env.local`) and fill in the values.

**Loading it on Windows:** the frontend file needs nothing else — Vite reads `.env.local` automatically. For the backend, PowerShell can't `source` a file, so open a **Git Bash** terminal in VS Code (Terminal → New Terminal, then choose **Git Bash** from the dropdown on the right of the terminal panel) and run the same commands as the Mac steps: `source .env && mvn spring-boot:run`. Git Bash ships with Git, which you already have from cloning.

> Both `.env` and `.env.local` are gitignored — they will never be committed. Do not share them anywhere other than the group chat.

### 3. Start the backend

Open a terminal in the `backend/` folder, load the env file, and start the server.

**Mac / Linux:**

```bash
cd backend
source .env
mvn spring-boot:run
```

**Windows (PowerShell):**

```powershell
cd backend
$env:ANTHROPIC_API_KEY="sk-ant-..."
$env:SUPABASE_PROJECT_REF="xxxx"
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:5432/postgres"
$env:SUPABASE_DB_USER="postgres.xxxx"
$env:SUPABASE_DB_PASSWORD="..."
mvn spring-boot:run
```

Wait until you see this line before moving on:

```text
Started SproutFundApplication in X seconds
```

The backend runs at `http://localhost:8080`.

### 4. Start the frontend

Open a **second terminal** in the `frontend/` folder:

```bash
cd frontend
npm install   # only needed the first time
npm run dev
```

The frontend runs at `http://localhost:5173`.

> Both the backend and frontend must be running at the same time.

### 5. Test the full flow

1. Go to `http://localhost:5173`
2. Click **Sign up** and create an account with any name, email, and password (if your Supabase project requires email confirmation, confirm it before logging in)
3. Log in with those credentials
4. Fill out the investment form — enter a budget, select a timeline, select a risk level
5. Click **Get My Investment Plan**
6. You should see a results page with an allocation bar, strategy cards, and platform recommendations generated by Claude
7. Click **Save This Plan**, then visit **Saved Plans** in the nav to see it persisted

---

## Troubleshooting

### "There was an error generating your plan"

- Make sure you loaded the env variables in the same terminal before `mvn spring-boot:run` (see step 3)
- Check the backend terminal for error logs — a line starting with `ERROR` will tell you what went wrong

### Backend won't start

- Confirm Java 17+ is installed: `java -version`
- Confirm Maven is installed: `mvn -version`
- Make sure you're running `mvn spring-boot:run` from inside the `backend/` folder, not the root
- A `401`/JWKS error on startup usually means `SUPABASE_PROJECT_REF` is wrong in your `.env`
- A datasource connection error usually means `SUPABASE_DB_URL` / `SUPABASE_DB_PASSWORD` is wrong, or `supabase/schema.sql` hasn't been run yet
- **`FATAL: password authentication failed for user "postgres"`** — your `.env` has an outdated or placeholder password. Get the current shared password from the group chat. Don't reset the password in the dashboard: it's shared, so a reset breaks everyone's `.env` until the new one is re-shared.
- **`java.net.NoRouteToHostException: No route to host`** (or a connection **timeout**) while connecting to `db.<ref>.supabase.co:5432` — **this is not a password problem, so do not reset the password.** That host has an IPv6 address and no IPv4 address, so it is unreachable from any network without working IPv6. Switch `SUPABASE_DB_URL` to the Session pooler host and add `SUPABASE_DB_USER` — see [step 2](#2-set-up-environment-variables). This is the single most common setup failure.

  Why it's confusing: the direct host works fine on networks that hand out real IPv6 (many home ISPs, phone hotspots), and fails on those that don't (lots of campus, guest, office, and wired networks). So the *same* `.env` can work at home and fail on campus, which makes it look like the credentials went bad. They didn't. To confirm IPv6 is the cause:

  ```bash
  dig +short db.<ref>.supabase.co A      # empty — the host has no IPv4 address
  dig +short db.<ref>.supabase.co AAAA   # an address — IPv6 only
  ping6 -c1 2606:4700:4700::1111         # fails if your network has no IPv6
  ```

  Use the pooler host permanently and this cannot bite you: it has an IPv4 address and reaches the same database.
- **`FATAL: (ENOTFOUND) tenant/user postgres.<ref> not found`** — you're on the pooler but with the wrong regional host. The prefix matters: this project uses `aws-1-us-east-2`, *not* `aws-0-us-east-2`. Copy the exact host from the dashboard (Database → Connection string → Session pooler). Also check `SUPABASE_DB_USER` is `postgres.<ref>` and not plain `postgres`.
- **`Schema-validation: wrong column type` / `missing column`** — the live database doesn't match the code. Re-run the latest [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor so the tables match the JPA entities (the backend boots with `ddl-auto=validate`).

### Frontend shows a blank page or routing error

- Make sure the backend is running first
- Make sure `frontend/.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set — the app throws on startup without them
- Try a hard refresh (`Cmd + Shift + R`)

### Signed up but can't log in

- If your Supabase project has "Confirm email" enabled, you must click the confirmation link sent to your inbox before logging in

---

## Branching & Git Workflow

We use **feature branches** — never push directly to `main`.

```text
main                          ← stable, reviewed code only
└── feature/your-feature-name ← your working branch
```

**Starting a new feature:**

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Pushing your work:**

```bash
git push origin feature/your-feature-name
```

Then open a **Pull Request** on GitHub from your branch → `main` and request a teammate to review before merging.

---

## Recommended IDE & Extensions

**Visual Studio Code** — [code.visualstudio.com](https://code.visualstudio.com)

| Extension | Purpose |
| --- | --- |
| **ES7+ React/Redux/React-Native snippets** | React component and hook shortcuts |
| **Prettier - Code Formatter** | Auto-formats JS, JSX, CSS on save |
| **ESLint** | Catches JS/React errors as you type |
| **Extension Pack for Java** | Java language support, debugging, Maven integration |
| **Spring Boot Extension Pack** | Spring Boot run/debug support inside VS Code |
| **GitLens** | See git blame, history, and branch info inline |
| **Git Graph** | Visual branch and commit history |
| **Path Intellisense** | Autocompletes file paths in imports |
| **CSS Variable Autocomplete** | Suggests `--var` tokens defined in your CSS |

**Enable Format on Save:** `Cmd + ,` → search "format on save" → check the box.

---

## API Reference

Sign up, login, and session management are handled entirely by Supabase Auth on the frontend (`@supabase/supabase-js`) — there are no `/api/auth/*` endpoints.

Endpoints that take an `Authorization: Bearer <supabase-access-token>` header read the token from the current Supabase session. `POST /api/investment` is the one **public** endpoint: generating a plan needs no user identity, so logged-out visitors can take the survey. Everything that touches saved data requires a token and is scoped to that token's user.

| Endpoint | Auth | Purpose |
| --- | --- | --- |
| `POST /api/investment` | Public | Generate a plan (nothing is saved) |
| `POST /api/investment/save` | Bearer token | Persist a generated plan |
| `GET /api/investment/history` | Bearer token | List the user's saved plans |
| `PATCH /api/investment/{id}` | Bearer token | Rename a saved plan |
| `DELETE /api/investment/{id}` | Bearer token | Delete a saved plan |

Requests to an authenticated endpoint without a valid token get `401`. The `{id}` routes only match rows owned by the token's user — someone else's `id` returns `404`, not `403`.

### POST /api/investment

Accepts the user's investment inputs and returns AI-generated strategies from Claude.

**Public — no `Authorization` header required.** Generating a plan computes strategies from the budget, timeline, and risk tolerance alone; it never reads or writes user data.

**Request body:**

```json
{
  "budget": 5000,
  "timeline": "medium",
  "riskTolerance": "high"
}
```

| Field | Type | Values |
| --- | --- | --- |
| `budget` | number | Any positive number |
| `timeline` | string | `"short"` · `"medium"` · `"long"` |
| `riskTolerance` | string | `"low"` · `"medium"` · `"high"` |

**Response:**

```json
{
  "budget": 5000,
  "timeline": "medium",
  "riskTolerance": "high",
  "strategies": [
    {
      "name": "Index Fund Core",
      "allocation": 60,
      "description": "A low-cost, diversified approach...",
      "vehicles": ["VTI (Vanguard Total Stock Market ETF)", "FZROX (Fidelity Zero)"],
      "platform": "Fidelity or Schwab"
    },
    {
      "name": "Growth ETFs",
      "allocation": 40,
      "description": "Higher-upside exposure...",
      "vehicles": ["QQQ (Invesco QQQ Trust)"],
      "platform": "Robinhood or Fidelity"
    }
  ],
  "disclaimer": "Always consult a licensed financial advisor before making investment decisions."
}
```

This endpoint only generates a plan — it isn't saved until you call `/api/investment/save`.

---

### POST /api/investment/save

Persists a generated plan for the current user. Send back the same shape `/api/investment` returned.

**Requires `Authorization: Bearer <token>`.** The plan is stored against the token's user.

**Request body:** same fields as the `/api/investment` response (`budget`, `timeline`, `riskTolerance`, `strategies`, `disclaimer`).

**Response:** the saved `InvestmentRecommendation`, including its `id` and `createdAt`.

---

### GET /api/investment/history

Returns the current user's saved recommendations, newest first.

**Requires `Authorization: Bearer <token>`.**

**Response:**

```json
[
  {
    "id": 1,
    "budget": 5000,
    "timeline": "medium",
    "riskTolerance": "high",
    "strategies": [ /* ... */ ],
    "disclaimer": "...",
    "createdAt": "2026-06-30T12:00:00Z"
  }
]
```

---

### PATCH /api/investment/{id}

Renames a saved plan.

**Requires `Authorization: Bearer <token>`.**

**Request body:**

```json
{ "title": "My retirement plan" }
```

**Response:** the updated `InvestmentRecommendation`. Returns `404` if `{id}` doesn't exist **or** belongs to another user.

---

### DELETE /api/investment/{id}

Deletes a saved plan.

**Requires `Authorization: Bearer <token>`.**

**Response:** `204 No Content`. Returns `404` if `{id}` doesn't exist **or** belongs to another user.
