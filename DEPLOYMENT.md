# Netlify Deployment Guide

## Files Prepared for Deployment

Your Receipt Generator app is now ready for Netlify deployment with the following files:

- ✅ `netlify.toml` - Netlify configuration file
- ✅ `_redirects` - Client-side routing support
- ✅ `README.md` - Project documentation
- ✅ `.gitignore` - Git ignore rules
- ✅ Fixed Firestore error handling
- ✅ Fixed Dialog accessibility warning

## Step-by-Step Deployment

### 1. Push to Git Repository

First, commit all your files to a Git repository (GitHub, GitLab, etc.):

```bash
git init
git add .
git commit -m "Initial commit - Receipt Generator app"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Drag & Drop (Quick)
1. Build the project locally: `npx vite build`
2. Go to [Netlify](https://netlify.app)
3. Drag the `dist` folder to the deployment area

#### Option B: Git Integration (Recommended)
1. Go to [Netlify](https://netlify.app)
2. Click "New site from Git"
3. Connect your Git provider (GitHub/GitLab)
4. Select your repository
5. Netlify will auto-detect the settings from `netlify.toml`

### 3. Configure Environment Variables

In your Netlify dashboard, go to:
**Site settings → Environment variables**

Add these variables:
```
VITE_FIREBASE_API_KEY = your_firebase_api_key
VITE_FIREBASE_APP_ID = your_firebase_app_id  
VITE_FIREBASE_PROJECT_ID = your_firebase_project_id
```

### 4. Update Firebase Settings

After deployment, add your Netlify domain to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication → Settings → Authorized domains**
4. Add your Netlify domain (e.g., `yourapp.netlify.app`)

### 5. Test Your Deployment

Visit your Netlify URL and test:
- ✅ User registration/login
- ✅ Receipt creation (banking & shopping)
- ✅ Logo upload
- ✅ PDF download
- ✅ Receipt management

## Build Configuration

The app uses these settings (defined in `netlify.toml`):
- **Build command**: `npx vite build`
- **Publish directory**: `dist`
- **Node version**: 20
- **Redirects**: All routes go to `index.html` for client-side routing

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Ensure Firebase project is properly configured

### Authentication Issues
- Verify your Netlify domain is added to Firebase authorized domains
- Check that Firebase API keys are correctly set

### Firestore Issues  
- The app handles "failed-precondition" errors gracefully
- Create Firestore indexes if prompted by Firebase console

## Environment Variables Reference

Your Firebase config values come from:
1. Firebase Console → Project Settings
2. Under "Your apps" → Web app
3. In the "SDK setup and configuration" section

The app is now production-ready! 🚀