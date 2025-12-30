# How to Get Your Access Token

## Quick Steps:

1. **Open your Vercel app** in a browser:
   - Go to: https://kind-act.vercel.app
   
2. **Log in** with your credentials

3. **Open Browser Console** (F12 or Right-click → Inspect → Console)

4. **Run this command** in the console:
   ```javascript
   localStorage.getItem('accessToken')
   ```

5. **Copy the token** (it will be a long string starting with `eyJ...`)

6. **Run the script**:
   ```bash
   cd backend
   python3 add_community_dummy_data.py https://christmas-backend-je1j.onrender.com YOUR_NEW_TOKEN
   ```

## Alternative: Use curl to get a fresh token

If you prefer, you can login via API and get a token:

```bash
curl -X POST https://christmas-backend-je1j.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "YOUR_USERNAME", "password": "YOUR_PASSWORD"}'
```

This will return a response with `access` and `refresh` tokens. Use the `access` token.

