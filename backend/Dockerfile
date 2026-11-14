FROM python:3.12.12-slim-bookworm AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app app
COPY worker worker
COPY alembic alembic
COPY alembic.ini .
USER 10001:10001

FROM base AS test
USER root
COPY requirements-test.txt .
RUN pip install --no-cache-dir -r requirements-test.txt
COPY tests tests
USER 10001:10001

FROM base AS runtime
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
