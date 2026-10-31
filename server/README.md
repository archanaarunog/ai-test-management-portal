# AI Test Management Portal API

FastAPI backend for the existing portal. The frontend remains unchanged. PostgreSQL is required.

## Local setup

Use Python 3.11 or newer and PostgreSQL 14 or newer. Create a database named `aitestportal`, copy `.env.example` to `.env`, and replace `JWT_SECRET_KEY` with a random secret. The example seed password and demo login are for local development only.

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

Interactive API documentation is at `http://localhost:8000/docs`; health is at `/health`. All `/api` resources except login require `Authorization: Bearer <access_token>`. Seed is idempotent and skips if users exist. To reset, recreate the development database, migrate, and seed again.

## API overview

- `POST /api/auth/login`; `GET /api/auth/me`
- `GET|POST /api/tests`, `GET|PUT|DELETE /api/tests/{id}`, `POST /api/tests/{id}/execute`
- `GET /api/dashboard/summary`, `/trends`, `/status-distribution`, `/module-coverage`
- `GET /api/activity`
- `GET /api/notifications`, `PATCH /api/notifications/{id}/read`

Dashboard totals derive from test cases and their latest persisted execution results. Module coverage is the automated-test proportion calculated from stored cases.
