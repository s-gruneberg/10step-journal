# 10th Step Journal

A web application for tracking daily progress and nightly journaling in recovery, built as a hobby project.

## Live Demo

Visit [10stepjournal.com](https://10stepjournal.com) to try the application.

## Features

- User authentication and secure login
- Daily journaling interface with customizable questions
- Progress tracking and visualization
- Mobile-responsive design
- PWA support for iOS and Android
- Dark mode support

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Bootstrap for styling
- React Router for navigation
- JWT for authentication

### Backend
- Django REST Framework
- PostgreSQL database
- JWT authentication
- Railway for hosting (cheaper than AWS)

## Development Setup

### Prerequisites
- Node.js (v20 or higher)
- Python (v3.8 or higher)
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Environment Variables

### Frontend
Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend
Create a `.env` file in the backend directory:
```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Deployment

The application is deployed using:
- Frontend: AWS S3 + CloudFront
- Backend: Railway
- Database: Railway PostgreSQL

## Notes

Not sure why somebody would want to copy this and run it themselves, but feel free, it's under a gnu license.
 
## License

GNU General Public License v3.0

Copyright (c) 2024 10th Step Journal

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
