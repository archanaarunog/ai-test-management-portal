from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import activity, auth, dashboard, notifications, tests
from app.core.config import settings
from app.schemas.api import HealthResponse

app = FastAPI(title="AI Test Management Portal API", version="1.0.0",
              description="JWT-secured API for test cases, executions, dashboard metrics, activity, and notifications.")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True,
                   allow_methods=["*"], allow_headers=["Authorization", "Content-Type"])
api = "/api"
app.include_router(auth.router, prefix=api)
app.include_router(tests.router, prefix=api)
app.include_router(dashboard.router, prefix=api)
app.include_router(activity.router, prefix=api)
app.include_router(notifications.router, prefix=api)


@app.get("/health", tags=["Health"], response_model=HealthResponse)
def health():
    return {"status": "ok"}
