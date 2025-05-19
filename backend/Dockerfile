# Use an official Python runtime
FROM python:3.12.4-alpine3.19

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy requirements first (leveraging Docker cache)
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the codebase
COPY . .

# Expose port
EXPOSE ${PORT}

# Run the Django app using gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8080"]
