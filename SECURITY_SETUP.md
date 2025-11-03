# API Key Security Setup Guide

This guide explains how to properly secure your Google Maps API keys to prevent unauthorized usage and unexpected charges.

## Problem

Google Maps Platform detected that we were using a single unrestricted API key for multiple services:
- Maps JavaScript API (frontend)
- Geocoding API (frontend)

This is a security vulnerability because:
1. API keys in frontend code are publicly visible
2. Anyone can extract and abuse the key
3. You're responsible for charges from unauthorized usage

## Solution

We've implemented a **two-key architecture** with proper restrictions:

### Key #1: Frontend Key (Maps JavaScript API)
- **Used for**: Displaying maps in the browser
- **Restriction Type**: HTTP referrers (websites)
- **Stored in**: `.env` file as `REACT_APP_GOOGLE_MAPS_API_KEY`

### Key #2: Backend Key (Geocoding API)
- **Used for**: Converting addresses to coordinates
- **Restriction Type**: IP addresses (Cloud Functions)
- **Stored in**: Firebase Functions config (NOT in frontend code)

## Setup Instructions

### Step 1: Create Two API Keys in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Create **Key #1 - Frontend Key**:
   - Click **Create Credentials** → **API key**
   - Name it: "Atraves - Frontend (Maps)"
   - Click **Restrict Key**
   - Under "API restrictions", select "Restrict key"
   - Choose: **Maps JavaScript API**
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domains:
     ```
     atraves.net/*
     www.atraves.net/*
     localhost:3000/*
     ```
   - Save

4. Create **Key #2 - Backend Key**:
   - Click **Create Credentials** → **API key**
   - Name it: "Atraves - Backend (Geocoding)"
   - Click **Restrict Key**
   - Under "API restrictions", select "Restrict key"
   - Choose: **Geocoding API**
   - Under "Application restrictions", select "IP addresses"
   - You'll need to add Cloud Functions IP addresses (see Step 3)
   - Save

### Step 2: Update Frontend Environment Variables

1. Copy your **Frontend Key** (Key #1)
2. Update your `.env` file:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your_frontend_key_here
   ```

### Step 3: Set Backend Key in Firebase Functions

1. Copy your **Backend Key** (Key #2)
2. Run this command in your terminal:
   ```bash
   firebase functions:config:set google.geocoding_api_key="YOUR_BACKEND_KEY_HERE"
   ```

3. Verify it's set:
   ```bash
   firebase functions:config:get
   ```

### Step 4: Get Cloud Functions IP Addresses

After deploying your functions (Step 5), you'll need to:

1. Find your function's outbound IP addresses:
   - Cloud Functions use Google's IP ranges
   - For App Engine standard: [Download IP ranges](https://www.gstatic.com/ipranges/goog.json)
   - OR use a more secure approach: Set up VPC connector for static IPs

2. **Recommended approach**: For better security, restrict by:
   - Setting up Firebase App Check (recommended)
   - Using Cloud Functions identity to call Google APIs with service account

### Step 5: Install Dependencies and Deploy

1. Install Cloud Functions dependencies:
   ```bash
   cd functions
   npm install
   cd ..
   ```

2. Deploy only functions:
   ```bash
   firebase deploy --only functions
   ```

3. Deploy everything:
   ```bash
   npm run build
   firebase deploy
   ```

### Step 6: Verify Everything Works

1. Open your deployed site: `https://atraves.net`
2. Try geocoding an address (e.g., search for "San Francisco")
3. Check that maps display correctly
4. Check browser console for errors

## Architecture Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────┐              ┌──────────────────┐
│ Maps JavaScript │              │  Geocoding       │
│    API Call     │              │  Request         │
│                 │              │                  │
│ Uses: Frontend  │              │  Calls: Cloud    │
│ Key (HTTP       │              │  Function        │
│ Referrer        │              │                  │
│ Restricted)     │              │                  │
└─────────────────┘              └────────┬─────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │ Cloud Function   │
                                 │ (Backend)        │
                                 │                  │
                                 │ Uses: Backend    │
                                 │ Key (IP          │
                                 │ Restricted)      │
                                 └────────┬─────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │ Google Geocoding │
                                 │      API         │
                                 └──────────────────┘
```

## Security Benefits

✅ **Frontend key** can only be used from your website
✅ **Backend key** is never exposed to users
✅ **Backend key** can only be called from Cloud Functions IPs
✅ Rate limiting and monitoring at the backend level
✅ No more security warnings from Google
✅ Protected from unauthorized charges

## Troubleshooting

### "Geocoding service is not configured" error
- Make sure you've set the backend key with `firebase functions:config:set`
- Redeploy functions after setting config

### "This API key is not authorized to use this service"
- Check that your API key restrictions match the service being called
- Verify HTTP referrer restrictions include your domain

### Maps not loading
- Check that frontend key has Maps JavaScript API enabled
- Verify HTTP referrer restrictions in Google Cloud Console

### "Invalid argument" error
- The address parameter might be empty or invalid
- Check browser console for detailed error messages

## Cost Monitoring

Set up billing alerts in Google Cloud Console:
1. Go to **Billing** → **Budgets & alerts**
2. Create a budget alert
3. Set threshold alerts (e.g., at 50%, 90%, 100% of expected usage)

## Additional Security Recommendations

1. **Enable Firebase App Check** for additional security
2. **Set up monitoring** with Firebase/Google Cloud Monitoring
3. **Implement rate limiting** in Cloud Functions
4. **Regular security audits** of API key usage
5. **Rotate keys periodically** (every 90 days)

## References

- [Google Maps API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Firebase Functions Environment Config](https://firebase.google.com/docs/functions/config-env)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
