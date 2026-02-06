from fastapi import FastAPI

from backend.app.api.auth import router as auth_router
from backend.app.api.health import router as health_router
from backend.app.api.questions import router as questions_router

app = FastAPI(title="Moringa Desk API")

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(questions_router)
