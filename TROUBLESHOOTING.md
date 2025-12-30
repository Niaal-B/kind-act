# Troubleshooting Guide

## Registration/API Issues

### Issue: "Failed to load response data" or Registration fails

This guide will help you debug API connection issues between Vercel frontend and Render backend.

## Step 1: Check Registration Endpoint Directly

Test the registration endpoint directly using curl or Postman:

```bash
curl -X POST https://christmas-backend-je1j.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "",
    "last_name": ""
  }
}
```

If this works, the backend is fine. If not, check Render logs.

## Step 2: Check Browser Console for Actual Errors

1. Open your Vercel app: https://kind-act.vercel.app
2. Open DevTools (F12)
3. Go to **Console** tab
4. Try to register
5. Look for error messages (with the improved error handling, you should see detailed errors)

## Step 3: Check Network Tab for Registration Request

1. Open DevTools → **Network** tab
2. Clear the network log
3. Try to register
4. Find the request to `/api/auth/register/`
5. Click on it and check:
   - **Status Code**: Should be 200 or 201 for success, 400/500 for errors
   - **Request Payload**: Verify the data being sent
   - **Response**: Click "Response" tab to see the actual response body
   - **Headers**: Check if CORS headers are present

## Step 4: Verify Environment Variables

### In Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check `VITE_API_URL`:
   - Should be: `https://christmas-backend-je1j.onrender.com/api`
   - Must include `/api` at the end
   - Must use `https://` (not `http://`)

### In Render (Backend):
1. Go to Render Dashboard → Your Backend Service → Environment
2. Verify these are set:
   ```
   DEBUG=False
   CORS_ALLOWED_ORIGINS=https://kind-act.vercel.app
   CSRF_TRUSTED_ORIGINS=https://kind-act.vercel.app
   ```

## Step 5: Test CORS is Working

Open browser console on your Vercel app and run:

```javascript
fetch('https://christmas-backend-je1j.onrender.com/api/acts/stats/', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

If you get a CORS error, the CORS settings in Render are incorrect.

## Common Issues & Solutions

### Issue: CORS Error
**Symptoms:**
- Console shows: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- Network tab shows OPTIONS request fails

**Solution:**
- In Render, update `CORS_ALLOWED_ORIGINS` to include your exact Vercel URL
- Make sure there's no trailing slash
- Format: `https://kind-act.vercel.app` (not `https://kind-act.vercel.app/`)

### Issue: Network Error / Cannot Connect
**Symptoms:**
- Console shows: "Cannot connect to server"
- Network tab shows request failed or pending

**Solution:**
- Check `VITE_API_URL` in Vercel is correct
- Verify backend is running in Render dashboard
- Check Render service logs for errors

### Issue: 404 Not Found
**Symptoms:**
- Network tab shows 404 status
- Response shows "Not Found"

**Solution:**
- Ensure `VITE_API_URL` ends with `/api`
- Verify backend routes are correct
- Check Render service is deployed correctly

### Issue: 500 Internal Server Error
**Symptoms:**
- Network tab shows 500 status
- Response shows server error

**Solution:**
- Check Render service logs for detailed error
- Verify database is connected (check DATABASE_URL)
- Check if migrations have been run

### Issue: "Failed to load response data" in DevTools
**Symptoms:**
- Request shows 200 OK in headers
- But response tab shows "Failed to load response data"

**Possible Causes:**
- This is often just a DevTools display issue
- Response was already consumed by JavaScript
- Compression issue (Brotli/gzip)

**Solution:**
- Check the actual response in the Network tab → Response tab
- Look at the "Preview" tab instead of "Response" tab
- Check browser console for actual errors (not DevTools display issue)

## Step 6: Check Render Logs

1. Go to Render Dashboard → Your Backend Service
2. Click on **Logs** tab
3. Look for errors related to:
   - Database connection
   - Missing environment variables
   - Import errors
   - Request errors

## Step 7: Verify Database is Working

If registration involves database operations, verify the database:

1. Check Render Dashboard → Your PostgreSQL database
2. Verify it's running (should show "Available")
3. Check connection string is set correctly in backend environment variables

## Getting Help

If you're still having issues:

1. **Collect Information:**
   - Screenshot of browser console errors
   - Screenshot of Network tab (showing the failed request)
   - Render backend logs
   - Environment variables (without sensitive data)

2. **Check:**
   - Both services (frontend and backend) are deployed and running
   - Environment variables are set correctly
   - URLs match exactly (no typos, correct protocol)

3. **Test:**
   - Can you access backend directly in browser? (`https://christmas-backend-je1j.onrender.com/api/acts/stats/`)
   - Does curl/Postman work with the backend?
   - Are there any CORS errors in console?

