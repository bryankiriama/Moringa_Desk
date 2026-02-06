import os
import importlib


def test_session_factory_without_connecting() -> None:
    os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

    session_module = importlib.import_module("backend.app.db.session")

    assert session_module.database_url
    assert callable(session_module.SessionLocal)

    session = session_module.SessionLocal()
    session.close()
