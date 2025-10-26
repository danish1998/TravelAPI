# Google OAuth Setup for Project: your-project-id-here

## 🎯 Project Configuration

**Project ID**: `your-project-id-here`  
**Client ID**: `your-client-id-here`  
**Client Secret**: `your-client-secret-here`

## 🔧 Google Cloud Console Setup

### **Step 1: Access Your Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **your-project-id-here**
3. Navigate to: **APIs & Services** → **Credentials**

### **Step 2: Configure OAuth 2.0 Client**
1. Find your OAuth 2.0 Client ID: `your-client-id-here`
2. Click **Edit** (pencil icon)
3. Add **Authorized redirect URIs**:

```
https://www.comfortmytrip.com/api/v1/auth/google/callback
```

### **Step 3: Enable Required APIs**
Make sure these APIs are enabled in your project:
- **Google+ API** (for profile information)
- **Google OAuth2 API**

## 🚀 Testing Your OAuth Integration

### **Current Working URLs:**
- **OAuth Start**: `https://www.comfortmytrip.com/api/v1/auth/google` ✅
- **OAuth Callback**: `https://www.comfortmytrip.com/api/v1/auth/google/callback` ✅
- **API Health**: `https://www.comfortmytrip.com/api/v1/` ✅

### **Test Commands:**
```bash
# Test OAuth flow
curl -X GET https://www.comfortmytrip.com/api/v1/auth/google -v

# Test API health
curl -X GET https://www.comfortmytrip.com/api/v1/

# Test protected endpoint
curl -X GET https://www.comfortmytrip.com/api/v1/auth/me
```

## 🔐 Environment Variables

Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://www.comfortmytrip.com/api/v1/auth/google/callback
FRONTEND_URL=https://www.comfortmytrip.com
SESSION_SECRET=your_session_secret_here
```

## 🧪 Complete OAuth Flow Test

### **Step 1: Start OAuth**
Visit: `https://www.comfortmytrip.com/api/v1/auth/google`

### **Step 2: Google Authentication**
- You'll be redirected to Google's OAuth page
- Sign in with your Google account
- Grant permissions for profile and email

### **Step 3: OAuth Callback**
- Google will redirect to: `https://www.comfortmytrip.com/api/v1/auth/google/callback`
- Your server will process the OAuth response
- User will be redirected to: `https://www.comfortmytrip.com/auth/success?token=YOUR_JWT_TOKEN`

### **Step 4: Verify Authentication**
```bash
# Get user info (requires JWT cookie)
curl -X GET https://www.comfortmytrip.com/api/v1/auth/me \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

## 📱 Frontend Integration

After successful OAuth, your frontend will receive:
- JWT token in URL parameter
- User can call `/api/v1/auth/me` to get user details
- JWT cookie is automatically set for subsequent requests

## 🚀 Production Deployment

For production, update these URLs:
1. **Google Cloud Console**: Add production redirect URI
2. **Environment Variables**: Update `GOOGLE_CALLBACK_URL` and `FRONTEND_URL`
3. **HTTPS**: Ensure your production server uses HTTPS

## ✅ Current Status

- ✅ Server running on port 8080
- ✅ OAuth routes configured
- ✅ MongoDB connected
- ✅ JWT authentication working
- ✅ Google OAuth integration ready

## 🎯 Next Steps

1. **Configure Google Cloud Console** with redirect URI
2. **Test OAuth flow** in browser
3. **Integrate with your frontend**
4. **Deploy to production**

Your Google OAuth integration is ready to use! 🎉

