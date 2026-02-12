# Moringa Desk

Full-stack Q&A knowledge platform for students and admins.

## Team Members
- Brian Kiriama
- Doreen Kiplagat
- Neathan Kungu
- James Kisengi
- Collins Njuguna
- Kenneth Kipkosgei

## Stack
- Frontend: React, Vite, TypeScript, Redux Toolkit, React Router, Axios, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic, Uvicorn
- Database: SQLite (local default) or PostgreSQL via `DATABASE_URL`

## Repository Structure
- `frontend/`: React app
- `backend/`: FastAPI app
- `backend/scripts/`: local data/utility scripts
- `backend/tests/`: backend tests

## Prerequisites
- Node.js 20+
- npm 10+
- Python 3.11+

## Environment Variables

### Backend (`backend/.env`)
Use `backend/.env.example` as reference:

```env
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/moringa_desk
JWT_SECRET=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Run Locally

### 1) Start Backend (FastAPI)
From project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
set -a && source .env && set +a
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:
```bash
curl http://127.0.0.1:8000/health
```

Docs:
- Swagger: `http://127.0.0.1:8000/docs`

### 2) Start Frontend (Vite)
Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## Deployment

### Backend on Render
You can deploy using `render.yaml` (Blueprint) or manual dashboard setup.

#### Option A: Blueprint (recommended)
1. Push repository to GitHub.
2. In Render: `New` -> `Blueprint`.
3. Select this repository.
4. Render will create:
   - Web service: `moringa-desk-backend`
   - Postgres database: `moringa-desk-db`
5. After first deploy, set `CORS_ORIGINS` in Render web service to:
   - `https://<your-vercel-domain>`
   - plus local origins if needed
   - Example:
   `https://moringa-desk.vercel.app,http://localhost:5173,http://127.0.0.1:5173`

#### Option B: Manual Render setup
1. Create a `PostgreSQL` database in Render.
2. Create a `Web Service`:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables:
   - `DATABASE_URL` = Render Postgres connection string
   - `JWT_SECRET` = strong secret
   - `JWT_ALGORITHM` = `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` = `60`
   - `CORS_ORIGINS` = `https://<your-vercel-domain>,http://localhost:5173,http://127.0.0.1:5173`
4. Deploy and verify:
   - `https://<your-render-service>.onrender.com/health`

### Frontend on Vercel
1. In Vercel: `Add New` -> `Project`.
2. Import this repository.
3. Set:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add env var:
   - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`
5. Deploy.
6. Ensure backend `CORS_ORIGINS` includes your Vercel domain.

### Post-Deploy Checklist
1. Open frontend and test register/login.
2. Confirm questions list loads.
3. Confirm no browser CORS errors.
4. Confirm API health endpoint returns 200.

## Frontend Features

### Student
- Register and login
- Forgot/reset password flow
- Dashboard with live metrics and charts
- Questions list/detail/create
- Answers list/create/accept
- Vote and flag on questions/answers
- Follow/unfollow questions
- Notifications list and mark-all-read
- Tag filtering and pagination (10 questions per page)

### Admin
- Admin dashboard with metrics, category distribution, contributors, and activity timeline
- User management (list, role update, delete)
- User content counts in admin user table (questions/answers from DB)
- Tag management (list/create with real usage counts from DB)
- FAQ management (create/update/delete with category)
- Flag moderation (review, dismiss, remove content)
- Question/answer moderation from question detail (edit/delete)

## API Overview

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Questions/Answers
- `GET /questions`
- `POST /questions`
- `GET /questions/{question_id}`
- `GET /questions/{question_id}/answers`
- `POST /questions/{question_id}/answers`
- `POST /questions/{question_id}/answers/{answer_id}/accept`

### Engagement
- `POST /votes`
- `POST /flags`
- `POST /questions/{question_id}/follow`
- `DELETE /questions/{question_id}/follow`
- `GET /me/follows`
- `GET /notifications`
- `POST /notifications/mark-all-read`

### Tags/FAQs/Admin
- `GET /tags`
- `POST /tags`
- `GET /faqs`
- `POST /faqs`
- `PATCH /faqs/{faq_id}`
- `DELETE /faqs/{faq_id}`
- `GET /admin/users`
- `PATCH /admin/users/{user_id}`
- `DELETE /admin/users/{user_id}`
- `GET /flags`
- `DELETE /flags/{flag_id}`

## Development Commands

### Frontend
```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
```

### Backend Tests
```bash
cd backend
pytest
```
