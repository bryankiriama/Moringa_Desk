# Moringa_Desk

Backend quickstart

Run the API

```bash
python -m pip install -e .
uvicorn backend.app.main:app --reload
```

Health check

```bash
curl http://127.0.0.1:8000/health
```

Config

See `backend/.env.example` for the expected environment variables.

Tests

```bash
python -m pip install -e .[dev]
pytest
```
