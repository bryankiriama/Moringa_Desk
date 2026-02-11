from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from sqlalchemy import select

from backend.app.db.session import SessionLocal
from backend.app.models.question import Question
from backend.app.models.user import User
from backend.app.repositories.answer_repo import create_answer
from backend.app.repositories.question_repo import create_question
from backend.app.services.answer_service import accept_answer


@dataclass(frozen=True)
class SeedAnswer:
    body: str
    accepted: bool = False


@dataclass(frozen=True)
class SeedQuestion:
    title: str
    category: str
    stage: str
    body: str
    answers: list[SeedAnswer]


QUESTIONS: list[SeedQuestion] = [
    SeedQuestion(
        title="React useEffect runs twice in development",
        category="Frontend",
        stage="React",
        body=(
            "I noticed that my useEffect hook runs twice when my component mounts in "
            "development mode. Is this a bug, or am I doing something wrong?"
        ),
        answers=[
            SeedAnswer(
                body=(
                    "This is expected behavior in React 18 when using StrictMode. React "
                    "intentionally double-invokes certain lifecycle methods in development "
                    "to help catch side effects. This does not happen in production builds."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "If the behavior causes issues during development, you can temporarily "
                    "remove StrictMode, but it is better to ensure your effects are idempotent."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="FastAPI CORS error when calling API from Vite",
        category="Backend",
        stage="APIs",
        body=(
            "My frontend running on localhost:5173 cannot call my FastAPI backend on "
            "localhost:8000. The browser blocks the request with a CORS error."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "You need to add CORSMiddleware to your FastAPI app and allow the "
                    "frontend origin: allow_origins=[\"http://localhost:5173\"]"
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Make sure the middleware is added before including your routers, "
                    "otherwise it won’t apply."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="JWT token works on login but fails on protected routes",
        category="Authentication",
        stage="Security",
        body=(
            "Login returns a JWT token successfully, but protected endpoints return "
            "\"Invalid token\" or 401."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Check that the frontend sends the token in the Authorization header "
                    "using the format: Authorization: Bearer <token>"
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Also confirm that the JWT_SECRET and algorithm are the same when "
                    "encoding and decoding the token."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="PostgreSQL foreign key violation when inserting answers",
        category="Database",
        stage="SQL",
        body=(
            "I get a foreign key constraint error when creating an answer linked to a "
            "question."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "This usually happens when the question_id does not exist in the "
                    "questions table. Verify the question was committed before inserting "
                    "the answer."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Ensure that your session is flushed or committed before using the "
                    "generated question ID."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Redux Toolkit createAsyncThunk never reaches fulfilled",
        category="Frontend",
        stage="State Management",
        body=(
            "My thunk dispatches pending but never reaches fulfilled or rejected."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "This often means an exception is thrown before returning data. Wrap "
                    "your API call in a try/catch and return rejectWithValue properly."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Check the Network tab - failed requests that aren't handled can "
                    "silently break the thunk flow."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Axios requests missing Authorization header",
        category="Frontend",
        stage="APIs",
        body=(
            "Even after login, my backend says the user is unauthenticated."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "You need an Axios request interceptor that injects the token from "
                    "localStorage or Redux into every request."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Make sure the interceptor is registered before any API calls are made."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Vite environment variables are undefined",
        category="Frontend",
        stage="Tooling",
        body=(
            "process.env.API_URL is undefined in my Vite project."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Vite only exposes variables prefixed with VITE_ and accessed via: "
                    "import.meta.env.VITE_API_BASE_URL"
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Restart the dev server after editing .env files."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="How to mark an answer as accepted correctly",
        category="Backend",
        stage="Business Logic",
        body=(
            "How should I implement accepted answers so only one answer is accepted?"
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Store accepted_answer_id on the question and update it when accepting "
                    "a new answer. Unset the previous accepted answer if one exists."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Only allow the question author to perform this action."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Votes changing but score not updating correctly",
        category="Backend",
        stage="Logic",
        body=(
            "Users can upvote/downvote, but the score seems incorrect."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Ensure score is calculated as: score = upvotes - downvotes and that "
                    "only one vote per user per target exists."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Allow users to change votes instead of creating new rows."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="When should I use tags vs categories?",
        category="UX",
        stage="Design",
        body=(
            "I'm confused about when to use tags instead of categories."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Categories should be limited and structured (e.g. Frontend, Backend). "
                    "Tags are flexible and help with searching and filtering."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Keep tags admin-managed to avoid duplicates."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Notifications not appearing after voting",
        category="Backend",
        stage="Events",
        body=(
            "Voting works but no notification is created."
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Ensure notification creation is triggered as a side effect after a "
                    "successful vote, and skip notification if the actor is the content "
                    "owner."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Check that the notification payload includes enough data for "
                    "navigation."
                )
            ),
        ],
    ),
    SeedQuestion(
        title="Best way to seed a development database",
        category="DevOps",
        stage="Setup",
        body=(
            "What's the best way to populate sample data for development?"
        ),
        answers=[
            SeedAnswer(
                body=(
                    "Use a Python script that calls your own API endpoints so passwords "
                    "are hashed and logic is respected."
                ),
                accepted=True,
            ),
            SeedAnswer(
                body=(
                    "Avoid raw SQL inserts for auth-related data unless you fully "
                    "understand the schema."
                )
            ),
        ],
    ),
]


def round_robin(items: list[User]) -> Iterable[User]:
    idx = 0
    while True:
        yield items[idx % len(items)]
        idx += 1


def pick_other_students(students: list[User], *, exclude: set[str], count: int) -> list[User]:
    picked: list[User] = []
    for student in students:
        if str(student.id) in exclude:
            continue
        picked.append(student)
        if len(picked) == count:
            break
    if len(picked) < count:
        for student in students:
            if str(student.id) in exclude:
                continue
            if student not in picked:
                picked.append(student)
            if len(picked) == count:
                break
    return picked


def main() -> None:
    session = SessionLocal()
    try:
        students = list(
            session.scalars(select(User).where(User.role == "student")).all()
        )
        if not students:
            students = list(session.scalars(select(User)).all())

        if not students:
            raise SystemExit("No users found to assign as authors.")

        author_cycle = round_robin(students)

        created_questions = 0
        created_answers = 0
        accepted_answers = 0

        existing_titles = {
            title for (title,) in session.execute(select(Question.title)).all()
        }

        for q in QUESTIONS:
            if q.title in existing_titles:
                continue

            author = next(author_cycle)
            question = create_question(
                session,
                author_id=author.id,
                title=q.title,
                body=q.body,
                category=q.category,
                stage=q.stage,
            )
            created_questions += 1

            exclude_ids = {str(author.id)}
            answer_authors = pick_other_students(
                students, exclude=exclude_ids, count=len(q.answers)
            )
            for answer_data, answer_author in zip(q.answers, answer_authors, strict=False):
                answer = create_answer(
                    session,
                    question_id=question.id,
                    author_id=answer_author.id,
                    body=answer_data.body,
                )
                created_answers += 1
                if answer_data.accepted:
                    accept_answer(
                        session,
                        question_id=question.id,
                        answer_id=answer.id,
                        acting_user_id=author.id,
                    )
                    accepted_answers += 1

        print(
            "Seed complete:",
            f"questions={created_questions}",
            f"answers={created_answers}",
            f"accepted={accepted_answers}",
        )
    finally:
        session.close()


if __name__ == "__main__":
    main()
