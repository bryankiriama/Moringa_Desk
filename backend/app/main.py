from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.admin_users import router as admin_users_router
from backend.app.api.answers import router as answers_router
from backend.app.api.auth import router as auth_router
from backend.app.api.faqs import router as faqs_router
from backend.app.api.flags import router as flags_router
from backend.app.api.follows import router as follows_router
from backend.app.api.health import router as health_router
from backend.app.api.me import router as me_router
from backend.app.api.notifications import router as notifications_router
from backend.app.api.questions import router as questions_router
from backend.app.api.related_questions import router as related_router
from backend.app.api.tags import router as tags_router
from backend.app.api.votes import router as votes_router

app = FastAPI(title="Moringa Desk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(answers_router)
app.include_router(votes_router)
app.include_router(tags_router)
app.include_router(follows_router)
app.include_router(notifications_router)
app.include_router(related_router)
app.include_router(faqs_router)
app.include_router(flags_router)
app.include_router(admin_users_router)
app.include_router(me_router)
