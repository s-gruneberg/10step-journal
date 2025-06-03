# Use an official Python runtime
FROM python:3.12.2

# Set environment variables
ENV PYTHONBUFFERED=1
ENV PORT=8080

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the codebase
COPY . /app/

# Expose port
EXPOSE ${PORT}

# Set environment to production
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Run the Django app using gunicorn
CMD gunicorn backend.wsgi:application --bind 0.0.0.0:"${PORT}"
