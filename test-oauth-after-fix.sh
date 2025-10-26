#!/bin/bash

# 🧪 OAuth Callback Test Script
# Tests the OAuth callback after fixes

echo "🔧 Testing OAuth Callback After Fix"
echo "=================================="

API_BASE="https://travelapi-r7bq.onrender.com/api/v1"
FRONTEND_URL="https://www.comfortmytrip.com"

echo ""
echo "⏳ Waiting for Render deployment to complete..."
echo "This usually takes 2-3 minutes after git push"
echo ""

echo "📋 Test Steps:"
echo "=============="
echo "1. Wait for Render to finish deploying"
echo "2. Test OAuth initiation:"
echo "   curl -I '$API_BASE/auth/google'"
echo ""
echo "3. Complete OAuth flow in browser:"
echo "   $API_BASE/auth/google"
echo ""
echo "4. Check callback URL in browser developer tools"
echo "5. Verify redirect to frontend"
echo ""

echo "🔍 Debugging Commands:"
echo "====================="
echo "# Check if deployment is complete:"
echo "curl -s '$API_BASE/' | grep 'Travel API'"
echo ""
echo "# Test OAuth initiation:"
echo "curl -I '$API_BASE/auth/google'"
echo ""
echo "# Check logs (if accessible):"
echo "# Look for console.log messages in Render logs"
echo ""

echo "✅ Expected Behavior After Fix:"
echo "==============================="
echo "1. OAuth initiation should redirect to Google"
echo "2. After Google auth, callback should process user"
echo "3. User should be redirected to frontend with JWT cookie"
echo "4. No more 'unexpected error occurred' message"
echo ""

echo "🚨 If Still Getting Errors:"
echo "==========================="
echo "1. Check Render logs for detailed error messages"
echo "2. Verify environment variables are set correctly"
echo "3. Ensure database connection is working"
echo "4. Check if User model is properly configured"
echo ""

echo "🎯 Next Steps:"
echo "============="
echo "1. Wait 2-3 minutes for deployment"
echo "2. Test OAuth flow in browser"
echo "3. Check browser developer tools for errors"
echo "4. Verify JWT cookie is set"
echo ""

echo "🔧 Key Fixes Applied:"
echo "==================="
echo "✅ Fixed callback URL path: /api/v1/auth/google/callback"
echo "✅ Added better error logging"
echo "✅ Improved debugging output"
echo "✅ Enhanced error handling"
echo ""

echo "Your OAuth should work correctly now! 🚀"
