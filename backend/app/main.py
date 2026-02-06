from fastapi import FastAPI

from backend.app.api.health import router as health_router

app = FastAPI(title="Moringa Desk API")

app.include_router(health_router)
