# Mini User Management System

## Project Overview

This application is a simple full‑stack user management system built for an intern assessment. It includes:
- Authentication (signup and login)
- Protected routes and role‑based access
- User Profile page (edit name/email, change password)
- Admin Dashboard with a paginated users table and actions to activate/deactivate non‑admin accounts
- Mobile and desktop Responsive Design

The frontend is intentionally minimal: React with hooks and Tailwind classes. The backend is an Express API with JWT authentication and MongoDB.


## Tech Stack

### Frontend
- React
- React Router
- Axios
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express 5
- MongoDB Atlas with Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- CORS
- Dotenv

### Testing
- Jest
- Supertest

### Tests cover:
- User signup
- User login
- Authentication middleware
- Protected routes
- Invalid credentials handling


## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string

### Backend (API)
1. Navigate to `backend`
2. Create a `.env` file (see Environment Variables section)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the API server in development:
   ```bash
   npm run dev
   ```
   The server listens on `PORT` (default 5000).

5. Run tests (optional):
   ```bash
   npm test
   ```

### Frontend (Web)
1. Navigate to `frontend`
2. Create a `.env` file with `VITE_API_URL` pointing to your backend URL (see Environment Variables)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Vite serves the app on `http://localhost:5173` by default (it may choose another free port if 5173 is in use).


## Environment Variables

Do not commit real values. Define these variables locally and in your deployment platform.

### Backend `.env`
- `PORT` — API port
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `MONGO_URI_TEST` — MongoDB connection for tests (optional)

### Frontend `.env`
- `VITE_API_URL` — Base URL of the backend API (e.g., `http://localhost:5000`)


## Deployment Instructions

### Backend (Render)
1. Push the repository to your Git provider
2. Create a new Web Service on Render
3. Set environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`)
4. Set the Start Command to:
   ```bash
   npm start
   ```
5. Save and deploy. Note the deployed API URL, and add it to the frontend `VITE_API_URL`.

### Frontend (Vercel)
1. Import the `frontend` directory as a project
2. Set `VITE_API_URL` in the project’s environment variables to the deployed API URL
3. Build command:
   ```bash
   npm run build
   ```
4. Output directory: `dist`
5. Deploy and verify the app can call the backend.


## Live Links

Backend API: https://backend-intern-assessment-slsb.onrender.com

Frontend App: https://useranagementsystem.vercel.app

GitHub Repository: https://github.com/ShaikhWahid99/Backend_Intern_Assessment


## Walkthrough Video
Video Link: https://drive.google.com/file/d/1nDzgNMm-e1I4JcBNmV8Oj4KTTQNzyfBF/view?usp=sharing


## API Documentation

The complete API documentation and test cases are available via Postman.

Postman Collection Link:
https://www.postman.com/aviation-geologist-83074237/workspace/backend-assessment-purplemerit/collection/38535830-2bc1b907-df88-48a3-b34a-d32c3eb89990?action=share&creator=38535830

The collection includes:
- Authentication (signup, login, logout)
- User profile management
- Admin user management (pagination, activate/deactivate)
- JWT token handling via environment variables


### Authentication

#### POST `/api/auth/signup`
Creates a new user account.

Request body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Success response (201):
```json
{
  "message": "User created successfully",
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Errors: 400 (validation), 500 (server)

#### POST `/api/auth/login`
Logs in and returns a JWT.

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Success response (200):
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Errors: 401 (invalid creds), 403 (account inactive), 500

### Users

All endpoints below require `Authorization: Bearer <token>`.

#### GET `/api/users/me`
Returns the current authenticated user.

Success response (200):
```json
{
  "_id": "<id>",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active"
}
```

Errors: 401 (no/invalid token), 404 (not found), 500

#### GET `/api/users?page=1&limit=10` (admin only)
Returns paginated list of users. Password is not included.

Success response (200):
```json
{
  "page": 1,
  "limit": 10,
  "totalUsers": 23,
  "totalPages": 3,
  "users": [
    {
      "_id": "<id>",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "status": "active"
    }
  ]
}
```

Errors: 401 (no/invalid token), 403 (non‑admin), 500

#### PATCH `/api/users/:id/activate` (admin only)
Activates a user account.

Success response (200):
```json
{ "message": "User activated successfully" }
```

Errors: 401, 403, 404 (not found), 500

#### PATCH `/api/users/:id/deactivate` (admin only)
Deactivates a user account (admin accounts are protected in UI).

Success response (200):
```json
{ "message": "User deactivated successfully" }
```

Errors: 401, 403, 404, 500

#### PUT `/api/users/me`
Updates the current user’s `fullName` and `email`.

Request body:
```json
{
  "fullName": "Johnathan Doe",
  "email": "johnathan@example.com"
}
```

Success response (200):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "<id>",
    "fullName": "Johnathan Doe",
    "email": "johnathan@example.com",
    "role": "user",
    "status": "active"
  }
}
```

Errors: 400 (validation/email in use), 401, 404, 500

#### PUT `/api/users/me/password`
Changes the current user’s password.

Request body:
```json
{
  "oldPassword": "password123",
  "newPassword": "newpass456"
}
```

Success response (200):
```json
{ "message": "Password updated successfully" }
```

Errors: 400 (validation), 401 (old password incorrect), 404, 500

---

## Notes
- CORS is configured in the backend to allow the local frontend and the deployed frontend origin. Adjust `origin` in `backend/app.js` as needed.
- Admin users are created by updating the role field in the database
- Admin accounts cannot be deactivated via the UI; inactive admins can be re‑activated.
- JWT authentication is stateless, so logout is handled client-side by removing the token


