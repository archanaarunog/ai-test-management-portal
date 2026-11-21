# Local setup: run the portal and V2 tests

This guide starts the React portal **and its FastAPI/PostgreSQL backend**, then runs the Java Playwright/TestNG suite that includes the self-healing V2 cases.

## Prerequisites

- Node.js and npm
- Python 3.11 or newer
- PostgreSQL 14 or newer, running locally, with a database named `aitestportal`
- JDK 17 or newer (the Maven project compiles with Java 17)
- Maven 3.9 or newer

## 1. Configure and install the backend

From the repository root:

```bash
cd server
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
```

Edit `server/.env` and set `DATABASE_URL` to your local PostgreSQL connection. For example, if your local PostgreSQL role is `achu` and it has no password:

```dotenv
DATABASE_URL=postgresql+psycopg://achu@localhost:5432/aitestportal
```

Create the `aitestportal` database if it does not already exist. On macOS with Homebrew PostgreSQL, for example:

```bash
brew services start postgresql@16
createdb aitestportal
```

If PostgreSQL is already running or the database already exists, leave it as-is. The database user in `DATABASE_URL` must be allowed to connect and create tables.

## 2. Install frontend dependencies

In a terminal at the repository root:

```bash
npm install
```

## 3. Start the backend and frontend

From the repository root, run the project startup script:

```bash
./start-dev.sh
```

The script applies database migrations, seeds demo data, and starts both services. Leave this terminal running. The frontend is at `http://localhost:5173`; the API is at `http://localhost:8000` and its docs are at `http://localhost:8000/docs`.

The backend is required: the current frontend uses it for authentication, tests, dashboard data, activity, and notifications. Starting Vite alone can render the page, but login and data requests will fail when the API is unavailable.

## 4. Install the Playwright Chromium browser

Open **Terminal 2** and run:

```bash
cd "/Users/achu/Downloads/Claude personal projects/ai-test-management-portal/automation-framework"
mvn -B exec:java@install-playwright
```

Run this once per machine (or again if the Playwright browser installation is removed).

## 5. Run the suite, including self-healing V2

Keep `./start-dev.sh` running in Terminal 1. In Terminal 2, from `automation-framework`, run:

```bash
mvn clean test -DsuiteXmlFile=src/test/resources/suites/testng.xml
```

The suite runs `SelfHealingV2Test` against local controlled DOM fixtures and the login regression test against the running portal. The browser is headless by default.

To run only the self-healing fixture tests:

```bash
mvn clean test -DsuiteXmlFile=src/test/resources/suites/testng.xml -Dtest=SelfHealingV2Test
```

TestNG suite selection is configured in `pom.xml` via `suiteXmlFile`; pass the property as shown above when running Maven locally.

## 6. Check results

Maven prints the pass/fail summary in Terminal 2. Detailed TestNG reports are written under:

```text
automation-framework/target/surefire-reports/
```

If login tests fail, confirm both `http://localhost:5173` and `http://localhost:8000/health` are reachable, and check Terminal 1 for backend, database, or Vite errors. Stop both services with `Ctrl+C` in Terminal 1 when finished.

## Quick command recap

```bash
# One-time backend setup (repository root)
cd server
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# Edit server/.env: set DATABASE_URL for your PostgreSQL user/database

# One-time frontend setup (repository root)
cd ..  # return from server/ to the repository root
npm install

# Terminal 1, repository root (runs migrations, seed, API, and frontend)
./start-dev.sh

# Terminal 2, after the services are running
cd automation-framework
mvn -B exec:java@install-playwright   # one-time browser install
mvn clean test -DsuiteXmlFile=src/test/resources/suites/testng.xml
```
