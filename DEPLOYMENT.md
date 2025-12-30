# Deployment Guide

This guide will help you deploy the Christmas Tree of Kindness application to Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account
- Render account
- Groq API key

## Backend Deployment (Render)

### 1. Prepare Your Backend

1. Push your code to GitHub
2. Make sure `requirements.txt` includes all dependencies
3. Ensure `Procfile` exists in the `backend/` directory

### 2. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Choose a name (e.g., `christmas-db`)
4. Select the free tier
5. Click "Create Database"
6. Note the **Internal Database URL** (you'll need this)

### 3. Deploy Backend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `christmas-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `cd backend && gunicorn santa_project.wsgi:application`
   - **Root Directory**: Leave empty (or set to `backend` if needed)

4. Add Environment Variables:
   ```
   SECRET_KEY=<generate-a-secure-random-key>
   DEBUG=False
   # ALLOWED_HOSTS is optional - will auto-allow .onrender.com domains if not set
   DATABASE_URL=<your-postgres-internal-url-from-step-2>
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app
   CSRF_COOKIE_SECURE=True
   CSRF_COOKIE_HTTPONLY=True
   GROQ_API_KEY=<your-groq-api-key>
   ```
   
   **Note**: If you don't set `ALLOWED_HOSTS`, the app will automatically allow any `.onrender.com` subdomain. You can optionally set it to your specific domain if you prefer.

5. Click "Create Web Service"

6. Wait for deployment to complete and note your backend URL (e.g., `https://christmas-backend.onrender.com`)

### 4. Update Backend Settings

After deployment, update the environment variables in Render:
- Set `CORS_ALLOWED_ORIGINS` to your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- Set `CSRF_TRUSTED_ORIGINS` to your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- `ALLOWED_HOSTS` is optional - it will auto-allow `.onrender.com` domains if not set

## Frontend Deployment (Vercel)

### 1. Prepare Your Frontend

1. Make sure your code is pushed to GitHub
2. Ensure `frontend/` directory contains your React app

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
   Replace `your-render-backend-url` with your actual Render backend URL

6. Click "Deploy"

7. Wait for deployment and note your Vercel URL (e.g., `https://christmas-app.vercel.app`)

### 3. Update Backend CORS Settings

After getting your Vercel URL, go back to Render and update:
- `CORS_ALLOWED_ORIGINS` to include your Vercel URL
- `CSRF_TRUSTED_ORIGINS` to include your Vercel URL

## Database Migration

The database will be automatically migrated during the build process. If you need to run migrations manually:

```bash
# On Render, you can use the Render Shell or run migrations in the build command
cd backend && python manage.py migrate
```

## Local Development

### Backend

1. Create a `.env` file in the `backend/` directory:
   ```env
   SECRET_KEY=your-dev-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   GROQ_API_KEY=your-groq-api-key
   ```

2. Run migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```

3. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

2. Install dependencies and start:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Troubleshooting

### CORS Errors

- Make sure `CORS_ALLOWED_ORIGINS` in Render includes your exact Vercel URL (with `https://`)
- Check that there are no trailing slashes in the URLs

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly in Render
- Check that the PostgreSQL database is running
- Ensure migrations have been run

### Static Files Not Loading

- Run `python manage.py collectstatic` if needed
- Check that WhiteNoise middleware is enabled in production

### Session/Cookie Issues

- Ensure `CSRF_COOKIE_SECURE=True` in production (HTTPS only)
- Verify `CORS_ALLOW_CREDENTIALS=True` is set
- Check that frontend uses `withCredentials: true` in API calls

## Environment Variables Summary

### Backend (Render)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` in production
- `ALLOWED_HOSTS` - Your Render backend URL
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Render)
- `CORS_ALLOWED_ORIGINS` - Your Vercel frontend URL
- `CSRF_TRUSTED_ORIGINS` - Your Vercel frontend URL
- `CSRF_COOKIE_SECURE` - `True` in production
- `GROQ_API_KEY` - Your Groq API key

### Frontend (Vercel)
- `VITE_API_URL` - Your Render backend URL + `/api`

## Notes

- The database automatically switches between SQLite (dev) and PostgreSQL (prod) based on `DATABASE_URL`
- In development, SQLite is used automatically
- In production, Render provides `DATABASE_URL` automatically for PostgreSQL
- Make sure to update CORS settings after getting your production URLs

