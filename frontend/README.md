# Moringa Desk Frontend

## Overview
React + Vite + TypeScript frontend for the Moringa Desk knowledge platform. The UI mirrors the backend domain (auth, questions, answers, votes, tags, follows, notifications, admin).

## Setup
1. Install dependencies:
   - `npm install`
2. Configure environment variables:
   - Create a `.env` file in `frontend/` and set:
     - `VITE_API_BASE_URL=<backend base url>`
3. Start the dev server:
   - `npm run dev`

## Environment Variables
- `VITE_API_BASE_URL`: Base URL for the backend API (e.g., `http://localhost:8000`).

## Feature Coverage (Current)
### Student
- Auth: Login, Register
- Dashboard
- Questions: list, detail, ask question
- Answers: list, create, accept
- Votes + Flags: questions and answers (refetch after action)
- Notifications: list, mark all read
- Trending

### Admin
- Admin Dashboard (static metrics + links)
- User Management: list + update role
- Manage Tags: list + create
- Manage FAQs: list + create

## Known Limitations
- No token refresh flow
- No optimistic updates (all actions refetch)
- Admin analytics metrics are static
- Tag usage counts and FAQ views are placeholders

## API Contract (Planning Only)

Base URL: `VITE_API_BASE_URL`

Auth Header: `Authorization: Bearer <token>`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Questions
- `GET /questions`
- `POST /questions`
- `GET /questions/{question_id}`
- `GET /questions/duplicates?title=...`
- `GET /questions/{question_id}/related`
- `POST /questions/{question_id}/related`
- `POST /questions/{question_id}/tags`

### Answers
- `GET /questions/{question_id}/answers`
- `POST /questions/{question_id}/answers`
- `POST /questions/{question_id}/answers/{answer_id}/accept`

### Votes
- `POST /votes`

### Tags
- `GET /tags`
- `POST /tags`

### Follows
- `POST /questions/{question_id}/follow`
- `DELETE /questions/{question_id}/follow`
- `GET /me/follows`

### Notifications
- `GET /notifications`
- `POST /notifications/mark-all-read`

### Me
- `GET /me/questions`
- `GET /me/answers`

### Flags
- `POST /flags`
- `GET /flags`

### FAQs
- `GET /faqs`
- `POST /faqs`

### Admin
- `GET /admin/users`
- `PATCH /admin/users/{user_id}`
