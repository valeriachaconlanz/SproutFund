# SproutFund

SproutFund is a web application designed to help beginners (especially students from universities like FIU) learn how to invest their money wisely. The app allows users to input how much they want to invest, their desired profit timeline, and their risk tolerance, and then generates a personalized investment strategy based on those inputs. It also features a visual portfolio breakdown, market timing tips, and a student-specific mode aimed at helping people make smart decisions with money like FAFSA refunds instead of spending it impulsively. The goal is to make investing feel accessible and understandable for people who have never done it before.

---

## Tech Stack

### Frontend

- **React 19** — UI framework
- **Vite** — build tool and dev server
- **React Router v7** — client-side routing between pages
- **Plain CSS** — styling (no Tailwind or CSS frameworks)

### Backend

- **Java 17+** — language
- **Spring Boot 3** — REST API framework
- **Maven** — dependency management and build tool

### Design System

- Located in `green-design/` — contains fonts, color tokens, spacing rules, and component patterns used across the UI
- Primary font: **Maison Neue Extended** (headings) + **Capsule Sans Text Mono** (body)
- Accent color: `#ccff00`

---

## Project Structure

```text
SproutFund/
├── frontend/          # React app (Vite)
│   ├── public/
│   │   └── fonts/     # Design system fonts
│   └── src/
│       ├── components/ # Reusable components (BudgetInput, etc.)
│       ├── pages/      # Page-level components (InvestmentForm, Results)
│       ├── App.jsx
│       └── main.jsx
├── backend/           # Spring Boot API
│   └── src/main/java/com/sproutfund/
│       ├── controller/ # REST controllers
│       ├── model/      # Request/Response models
│       └── service/    # Business logic
└── green-design/      # Design system reference (fonts, tokens, guidelines)
```

---

## Running the Project Locally

### Prerequisites

- Node.js 18+ — [nodejs.org](https://nodejs.org)
- Java 17+ — [adoptium.net](https://adoptium.net)
- Maven 3.9+ — [maven.apache.org](https://maven.apache.org)

### Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`

### Start the Backend

```bash
cd backend
mvn spring-boot:run
```

Runs at `http://localhost:8080`

> Both must be running at the same time for full functionality. The frontend falls back gracefully if the backend is offline.

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

### IDE

**Visual Studio Code** — [code.visualstudio.com](https://code.visualstudio.com)

### VS Code Extensions

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

### Enable Format on Save

1. Open Settings (`Cmd + ,`)
2. Search "format on save"
3. Check the box

---

## API Reference

### POST /api/investment

Accepts the user's investment inputs and returns a personalized recommendation.

**Request body:**

```json
{
  "budget": 5000,
  "timeline": "medium"
}
```

**Timeline values:** `"short"` · `"medium"` · `"long"`

**Response:**

```json
{
  "budget": 5000,
  "timeline": "medium",
  "recommendation": "A balanced ETF portfolio..."
}
```
