# 🚀 Deployment Checklist for API Key Security Fix

## What We've Done ✅

1. ✅ Created Cloud Functions infrastructure
2. ✅ Built secure `geocode` Cloud Function endpoint
3. ✅ Updated frontend to call Cloud Function instead of Google directly
4. ✅ Installed all dependencies
5. ✅ Updated documentation (README, SECURITY_SETUP.md)
6. ✅ Added `.env.example` template

## What You Need to Do 📋

### Step 1: Create Two API Keys in Google Cloud Console

Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials?project=jb-apps-1d33e)

#### Key #1: Frontend Key (Maps JavaScript API)
```
Name: Atraves - Frontend (Maps)
API Restrictions: Maps JavaScript API ONLY
Application Restrictions: HTTP referrers
  - atraves.net/*
  - www.atraves.net/*
  - localhost:3000/* (for dev)
  - 127.0.0.1:3000/* (for dev)
```

#### Key #2: Backend Key (Geocoding API)
```
Name: Atraves - Backend (Geocoding)
API Restrictions: Geocoding API ONLY
Application Restrictions: None (for now)
  Note: After deployment, you can add IP restrictions
```

### Step 2: Update Your Local .env File

Update `/Users/justin/Desktop/Repos/atraves-react/.env`:

```bash
# Replace with your NEW Frontend Key
REACT_APP_GOOGLE_MAPS_API_KEY=AIza...your_frontend_key
REACT_APP_TEST_GOOGLE_MAPS_KEY=AIza...your_test_key

# Keep existing Firebase vars
REACT_APP_FIREBASE_API_KEY=...
# ... (rest unchanged)
```

### Step 3: Set Backend Key in Firebase Functions Config

```bash
cd /Users/justin/Desktop/Repos/atraves-react

# Set the backend geocoding API key
firebase functions:config:set google.geocoding_api_key="AIza...your_backend_key"

# Verify it's set
firebase functions:config:get
```

You should see:
```json
{
  "google": {
    "geocoding_api_key": "AIza...your_backend_key"
  }
}
```

### Step 4: Test Locally (Optional but Recommended)

```bash
# Start the development server
npm start

# In another terminal, start Firebase emulators
firebase emulators:start --only functions

# Note: You may need to update the functions initialization to use emulators
```

### Step 5: Deploy to Firebase

```bash
# Build the frontend
npm run build

# Deploy everything (functions + hosting)
firebase deploy

# OR deploy only functions first to test
firebase deploy --only functions
```

### Step 6: Test on Production

1. Visit https://atraves.net
2. Try geocoding an address:
   - Search for "San Francisco, CA"
   - Search for "Eiffel Tower"
   - Search for "1600 Amphitheatre Parkway"
3. Verify maps still load correctly
4. Check browser console for any errors

### Step 7: Add IP Restrictions (Optional, After Deploy)

After deploying, you can get your Cloud Functions' outbound IPs and add them to the Backend Key restrictions:

1. Deploy first (Step 5)
2. Monitor Cloud Functions logs to see which IPs are being used
3. Add those IPs to your Backend Key restrictions in Google Cloud Console

**OR** use the simpler approach: Keep IP restrictions empty since the key is:
- Only accessible from your Cloud Function (not in client code)
- Limited to Geocoding API only
- Can be monitored in Google Cloud Console

### Step 8: Verify Security

In Google Cloud Console:

1. Go to **APIs & Services** → **Credentials**
2. Click on each key and verify:
   - ✅ Frontend Key: HTTP referrer restricted + Maps JavaScript API only
   - ✅ Backend Key: Geocoding API only
3. Go to **APIs & Services** → **Dashboard**
4. Monitor API usage to ensure no unexpected spikes

### Step 9: Clean Up Old Key

Once everything is working:

1. Disable (don't delete immediately) your old unrestricted key
2. Monitor for 24-48 hours to ensure nothing breaks
3. If all is well, delete the old key

### Step 10: Set Up Monitoring (Recommended)

```bash
# View function logs
firebase functions:log

# Set up billing alerts in Google Cloud Console
# Navigation: Billing → Budgets & alerts → CREATE BUDGET
```

## Troubleshooting

### Error: "Geocoding service is not configured"
```bash
# Check if config is set
firebase functions:config:get

# If empty, set it again
firebase functions:config:set google.geocoding_api_key="YOUR_KEY"

# Redeploy
firebase deploy --only functions
```

### Error: "API key not valid"
- Verify the key is enabled in Google Cloud Console
- Check that Geocoding API is enabled for your project
- Make sure you copied the full key (they're long!)

### Maps not loading
- Check frontend key has Maps JavaScript API enabled
- Verify HTTP referrer restrictions include your domain
- Check browser console for specific error messages

### "Permission denied" or CORS errors
- Cloud Functions may need CORS configuration
- Verify Firebase Functions config is set correctly

## Expected Costs

With proper restrictions:
- **Maps JavaScript API**: $7 per 1,000 loads (first 28,000/month free with $200 credit)
- **Geocoding API**: $5 per 1,000 requests (first 40,000/month free with $200 credit)
- **Cloud Functions**: Free tier includes 2M invocations/month

For a portfolio site with moderate traffic, you should stay within free tiers.

## Interview Talking Points 💼

When discussing this project in interviews, you can highlight:

1. **Security Awareness**: "Google flagged a security vulnerability in my API key usage, and I immediately took action"

2. **Problem-Solving**: "I architected a solution using Cloud Functions as a secure proxy, implementing proper API key restrictions"

3. **Full-Stack Skills**: "I extended the React frontend with a Node.js backend using Firebase Cloud Functions"

4. **Best Practices**: "I followed the principle of least privilege - frontend key can only display maps, backend key can only geocode"

5. **Production Experience**: "I've dealt with real-world security issues in a deployed application"

6. **Documentation**: "I created comprehensive setup guides so other developers can understand the security architecture"

## Questions?

If you run into issues:
1. Check `firebase functions:log` for backend errors
2. Check browser console for frontend errors
3. Verify API keys are correctly set
4. Ensure Geocoding API is enabled in Google Cloud Console

Good luck with the deployment! 🎉
