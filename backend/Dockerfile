FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create directories for uploads and processed files
# RUN mkdir -p /app/uploads /app/processed

EXPOSE 8000

# CMD ["python", "app.py"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]