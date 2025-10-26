# 🔧 Fix Google OAuth Client ID Mismatch

## 🚨 **Problem Identified:**
Your deployed API is using Client ID: `180660121835-166mq0jh45um408tkdamsg528kfhcubi.apps.googleusercontent.com`
But your Google Cloud Console is configured for: `1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com`

## ✅ **Solution: Update Render Environment Variables**

### Step 1: Access Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your `travelapi-r7bq` service
3. Click on it to open the service details

### Step 2: Update Environment Variables
1. Go to the **Environment** tab
2. Update these variables:

```env
GOOGLE_CLIENT_ID=1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback
FRONTEND_URL=https://www.comfortmytrip.com
SESSION_SECRET=your_session_secret_here
```

### Step 3: Redeploy
1. After updating environment variables, click **Save**
2. Render will automatically redeploy your service
3. Wait for deployment to complete (usually 2-3 minutes)

### Step 4: Test OAuth Flow
1. Visit: `https://travelapi-r7bq.onrender.com/api/v1/auth/google`
2. Complete Google authentication
3. Verify redirect to your frontend

## 🔍 **Current Configuration Status:**

### ✅ **Google Cloud Console (Correct):**
- Client ID: `1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com`
- Redirect URIs: 
  - `https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback`
  - `https://www.comfortmytrip.com/auth/callback`
- Authorized Origins: `https://www.comfortmytrip.com`

### ❌ **Render Environment (Needs Update):**
- Currently using: `180660121835-166mq0jh45um408tkdamsg528kfhcubi.apps.googleusercontent.com`
- Should be: `1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com`

## 🎯 **After Fix:**
Your OAuth flow will work correctly:
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth
3. User authenticates
4. Google redirects back to your API
5. API generates JWT token
6. User redirected to frontend with token

## 🚀 **Quick Test Command:**
```bash
curl -I "https://travelapi-r7bq.onrender.com/api/v1/auth/google"
```
Should show redirect to Google with correct Client ID.

---
**Fix this and your Google OAuth will work perfectly! 🎉**
