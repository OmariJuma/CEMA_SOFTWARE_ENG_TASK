# CEMA Health Information System - Backend

## Developed by Omar Juma

Flask-based backend for the CEMA Health Information System.

## Setup

1. Create a virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. PostgreSQL Setup:
   - Install PostgreSQL if not already installed
   - Create a new database:
```bash
psql -U postgres
CREATE DATABASE cema_health_db;
```

4. Create `.env` file:
```env
JWT_SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://username:password@localhost:5432/cema_health_db
SALT=your_salt_value
ALLOWED_ORIGINS=http://localhost:3000
```
`

5. Run the application:
```bash
python index.py
```

## Dependencies

Make sure you have the following PostgreSQL-related packages installed:
```bash
pip install psycopg2-binary
pip install Flask-SQLAlchemy
pip install Flask-Migrate
```

backend_cema_health_info_sys/
├── app/
│   ├── config/         # Configuration settings
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   └── utils/          # Utility functions
├── .env                # Environment variables
└── index.py           # Application entry point

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/v1/login` | User login | Public |
| `POST` | `/api/v1/signup` | User registration | Public |
| `GET` | `/api/v1/users` | Get all users | Admin only |
| `POST` | `/api/v1/users/<user_id>` | Get user profile | Authenticated |

### Health Program Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/v1/healthProgram` | List all programs | Authenticated |
| `POST` | `/api/v1/healthProgram` | Create new program | Admin only |
| `POST` | `/api/v1/healthProgram/<program_id>/patients` | Enroll user in program | Admin only |
| `GET` | `/api/v1/healthProgram/<program_id>/patients` | List enrolled patients | Admin only |

### Request/Response Examples

#### Login
```json
// Request
POST /api/v1/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "id": "user_id_here"
}
```

#### Create Health Program
```json
// Request
POST /api/v1/healthProgram
{
  "program_name": "Tuberculosis Program",
  "program_description": "Treatment and support for TB patients"
}

// Response
{
  "message": "Health program created successfully"
}
```

#### Enroll User in Program
```json
// Request
POST /api/v1/healthProgram/<program_id>/patients
{
  "user_id": "user_id_here"
}

// Response
{
  "message": "User enrolled successfully"
}
```