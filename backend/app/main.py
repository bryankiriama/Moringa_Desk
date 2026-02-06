from fastapi import FastAPI

from backend.app.api.answers import router as answers_router
from backend.app.api.auth import router as auth_router
from backend.app.api.health import router as health_router
from backend.app.api.questions import router as questions_router
from backend.app.api.votes import router as votes_router

app = FastAPI(title="Moringa Desk API")

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(answers_router)
app.include_router(votes_router)
