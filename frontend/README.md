# Moringa Desk Frontend

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
