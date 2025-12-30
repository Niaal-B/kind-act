# Vercel Frontend Deployment Guide

Step-by-step guide to deploy the frontend to Vercel.

## Prerequisites

- GitHub account with your code pushed to a repository
- Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- Your Render backend URL (e.g., `https://christmas-backend-je1j.onrender.com`)

## Step-by-Step Instructions

### Step 1: Sign in to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended) to connect your GitHub account

### Step 2: Create New Project

1. Once logged in, click **"Add New..."** button (top right)
2. Select **"Project"** from the dropdown
3. You'll see a list of your GitHub repositories

### Step 3: Import Your Repository

1. Find and click on your repository (e.g., `kind-act` or your repo name)
2. If you don't see it, click **"Adjust GitHub App Permissions"** and grant access to the repository
3. Click **"Import"** next to your repository

### Step 4: Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

#### General Settings:
- **Project Name**: `christmas-frontend` (or your preferred name)
- **Framework Preset**: `Vite` (should be auto-detected)
- **Root Directory**: `frontend` (IMPORTANT: Set this to `frontend`)

#### Build Settings:
- **Build Command**: `npm run build` (should be pre-filled)
- **Output Directory**: `build` (Vite outputs to build directory by default)
- **Install Command**: `npm install` (should be pre-filled)

### Step 5: Configure Environment Variables

1. Click on **"Environment Variables"** section
2. Add the following variable:

   **Variable Name**: `VITE_API_URL`
   
   **Value**: `https://your-render-backend-url.onrender.com/api`
   
   (Replace `your-render-backend-url` with your actual Render backend URL)
   
   Example: `https://christmas-backend-je1j.onrender.com/api`

3. Make sure it's set for **Production**, **Preview**, and **Development** environments
4. Click **"Add"**

### Step 6: Deploy

1. Click **"Deploy"** button (bottom right)
2. Wait for the build to complete (usually 1-3 minutes)
3. You'll see the build logs in real-time

### Step 7: Get Your Vercel URL

1. Once deployment completes, you'll see **"Congratulations!"**
2. Your site will be live at: `https://your-project-name.vercel.app`
3. Copy this URL - you'll need it for the next step

### Step 8: Update Backend CORS Settings

Now you need to tell your Render backend to accept requests from your Vercel frontend:

1. Go to your **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update these environment variables:

   **CORS_ALLOWED_ORIGINS**: 
   ```
   https://your-project-name.vercel.app
   ```
   (Replace with your actual Vercel URL)

   **CSRF_TRUSTED_ORIGINS**:
   ```
   https://your-project-name.vercel.app
   ```
   (Replace with your actual Vercel URL)

5. Click **"Save Changes"**
6. Render will automatically redeploy with the new settings

### Step 9: Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test the following:
   - Home page loads
   - Login/Register works
   - API calls work (check browser console for errors)
   - Navigation works

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check that `Root Directory` is set to `frontend`
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**Error: "Build command failed"**
- Check that `npm run build` works locally
- Verify Node.js version compatibility
- Check for TypeScript or linting errors

### API Calls Fail / CORS Errors

**Symptom**: Network errors or CORS errors in browser console

**Solutions**:
1. Verify `VITE_API_URL` environment variable is set correctly in Vercel
2. Check that backend CORS settings include your Vercel URL
3. Verify backend is running and accessible
4. Check browser console for specific error messages

### 404 Errors on Routes

**Symptom**: Direct URL access to routes (like `/my-tree`) returns 404

**Solution**: 
- The `vercel.json` file includes rewrite rules to handle this
- If issues persist, verify `vercel.json` is in the `frontend` directory

### Environment Variables Not Working

**Symptom**: API calls still go to localhost

**Solutions**:
1. In Vercel, go to your project → Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly
3. Make sure it's enabled for all environments (Production, Preview, Development)
4. Redeploy the project after adding/changing environment variables

## Environment Variables Reference

### Required:
- `VITE_API_URL`: Your Render backend API URL (e.g., `https://backend.onrender.com/api`)

### Optional:
- Any other Vite environment variables you might need (they must start with `VITE_`)

## Updating Your Deployment

Whenever you push changes to GitHub:

1. Vercel will automatically detect the push
2. It will create a new deployment
3. Once build completes, it will go live automatically
4. You can see all deployments in the Vercel dashboard

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Quick Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] `frontend/package.json` has correct build scripts
- [ ] `vercel.json` exists in `frontend` directory (optional but recommended)
- [ ] You have your Render backend URL ready
- [ ] You're ready to update backend CORS settings after getting Vercel URL

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check deployment logs in Vercel dashboard for specific errors

