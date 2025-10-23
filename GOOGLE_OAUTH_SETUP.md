# Google OAuth Setup Guide

## 🚀 Google OAuth Integration Complete!

Your Travel API now supports Google OAuth authentication alongside your existing JWT system.

## 📋 Environment Variables Required

Add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=180660121835-166mq0jh45um408tkdamsg528kfhcubi.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback

# Frontend URL for redirects after OAuth
FRONTEND_URL=http://localhost:3000

# Session secret (can use same as JWT_SECRET)
SESSION_SECRET=your_session_secret_here
```

## 🔧 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:8080/api/v1/auth/google/callback` (development)
   - `https://yourdomain.com/api/v1/auth/google/callback` (production)

## 🛠️ API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Local user registration |
| `POST` | `/api/v1/auth/login` | Local user login |
| `GET` | `/api/v1/auth/logout` | Logout (clears cookies) |
| `GET` | `/api/v1/auth/google` | **Start Google OAuth flow** |
| `GET` | `/api/v1/auth/google/callback` | Google OAuth callback |
| `GET` | `/api/v1/auth/me` | Get current user info |

### Google OAuth Flow

1. **Start OAuth**: Visit `/api/v1/auth/google`
2. **User authenticates** with Google
3. **Callback**: Google redirects to `/api/v1/auth/google/callback`
4. **Success**: User is redirected to frontend with JWT token
5. **Get user info**: Call `/api/v1/auth/me` with JWT cookie

## 🧪 Testing

Run the test script:
```bash
node test-google-oauth.js
```

Or test manually:
1. Start your server: `npm run dev`
2. Visit: `http://localhost:8080/api/v1/auth/google`
3. Complete Google authentication
4. Check if you're redirected to your frontend

## 🔐 Security Features

- ✅ HTTP-only cookies for JWT storage
- ✅ Secure cookies in production
- ✅ Session management for OAuth flow
- ✅ User account linking (existing email → Google account)
- ✅ Profile picture and name from Google
- ✅ CSRF protection with SameSite cookies

## 👤 User Model Updates

The User model now supports:
- `googleId`: Google OAuth ID
- `profilePicture`: Profile picture URL from Google
- `authProvider`: 'local' or 'google'
- `mobile`: Optional for OAuth users
- `passwordHash`: Optional for OAuth users

## 🔄 Account Linking

If a user signs up with email/password and later uses Google OAuth with the same email:
- The accounts will be automatically linked
- The user will have both authentication methods available
- Profile information from Google will be merged

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Update `GOOGLE_CALLBACK_URL` to your production domain
3. Update `FRONTEND_URL` to your production frontend
4. Ensure HTTPS is enabled for secure cookies

## 📱 Frontend Integration

After OAuth success, your frontend will receive:
- JWT token in URL parameter
- User can call `/api/v1/auth/me` to get user details
- JWT cookie is automatically set for subsequent requests

## 🎯 Next Steps

1. Set up your Google Cloud Console
2. Add environment variables
3. Test the OAuth flow
4. Integrate with your frontend
5. Deploy to production

Your Google OAuth integration is ready! 🎉
