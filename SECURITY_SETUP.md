# Security Setup Guide

## 🔐 Environment Variables Setup

This project requires several environment variables for proper operation. Follow these steps to set up your environment securely.

### Step 1: Copy the Template File

```bash
cp GOOGLE_OAUTH_CONFIG.env.example GOOGLE_OAUTH_CONFIG.env
```

### Step 2: Configure Your Environment Variables

Edit the `GOOGLE_OAUTH_CONFIG.env` file and replace the placeholder values with your actual credentials:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback
FRONTEND_URL=https://www.comfortmytrip.com
SESSION_SECRET=your_actual_session_secret_here
```

### Step 3: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to **APIs & Services** → **Credentials**
5. Create an OAuth 2.0 Client ID
6. Add the authorized redirect URI: `http://localhost:8080/api/v1/auth/google/callback`
7. Copy the Client ID and Client Secret to your environment file

### Step 4: Security Best Practices

- ✅ **Never commit secrets to version control**
- ✅ **Use environment variables for all sensitive data**
- ✅ **Keep your `.env` files local and add them to `.gitignore`**
- ✅ **Use different credentials for development and production**
- ✅ **Rotate your secrets regularly**

### Files to Keep Secure

The following files contain sensitive information and should never be committed:
- `GOOGLE_OAUTH_CONFIG.env`
- `.env`
- `.env.local`
- `.env.production`

### Production Deployment

For production deployment:
1. Set environment variables in your hosting platform
2. Update the redirect URIs in Google Cloud Console to match your production domain
3. Ensure your production server uses HTTPS
4. Use strong, unique session secrets

## 🚨 Security Incident Response

If you accidentally commit secrets:
1. **Immediately rotate the compromised credentials**
2. **Remove secrets from git history using `git filter-branch`**
3. **Force push the cleaned history**
4. **Update all affected services with new credentials**

## 📞 Support

If you need help with the OAuth setup, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [PROJECT_OAUTH_SETUP.md](./PROJECT_OAUTH_SETUP.md) for detailed setup instructions

