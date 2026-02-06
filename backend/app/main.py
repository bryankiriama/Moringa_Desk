from fastapi import FastAPI

app = FastAPI(title="Moringa Desk API")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
