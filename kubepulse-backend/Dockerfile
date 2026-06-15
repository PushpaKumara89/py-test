# === STAGE 1: Builder ===
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements-prod.txt .
RUN pip install --no-cache-dir --target=/app/wheels -r requirements-prod.txt

ENV PYTHONPATH=/app/wheels
COPY . .
RUN python manage.py collectstatic --noinput

FROM gcr.io/distroless/python3-debian12:nonroot

WORKDIR /app

COPY --from=builder /app/wheels /app/wheels
COPY --from=builder /app /app

ENV PYTHONPATH=/app/wheels

CMD ["/app/wheels/bin/gunicorn", "kubepulse.wsgi:application", "--bind", "0.0.0.0:8000"]