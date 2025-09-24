# FOODWAY Deployment Guide

This guide will help you deploy the FOODWAY application with the backend on Render and the frontend on Vercel.

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas database (already configured)

## Backend Deployment on Render

### Step 1: Prepare Your Repository
1. Push your code to GitHub repository
2. Ensure the backend has a `start` script in `package.json` (already added)

### Step 2: Create Render Service
1. Go to https://render.com and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `foodway-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preferred plan)

### Step 3: Set Environment Variables
In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=8000
MONGODB_URL=mongodb+srv://foodway:12345@cluster0.nnxjwti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=KJHGSDIOKJOHDF
EMAIL=pcharan214@gmail.com
PASS=kpif qgym iobi ygdm
CLOUDINARY_CLOUD_NAME=charan12
CLOUDINARY_API_KEY=478681192216688
CLOUDINARY_API_SECRET=du1JrEvTmjfmDiDa-Yi9cfP4MWc
RAZORPAY_KEY_ID=rzp_test_RAcgtscfNdp1cg
RAZORPAY_KEY_SECRET=MWn5u9N8yFYjgQpVlNvix93f
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Important**: Replace `https://your-frontend-app.vercel.app` with your actual Vercel deployment URL after frontend deployment.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your backend URL: `https://your-backend-app.onrender.com`

## Frontend Deployment on Vercel

### Step 1: Update Environment Variables
1. Update your frontend `.env` file:
```
VITE_FIREBASE_APIKEY=AIzaSyC0-4hmp6ACCt5DhDvq1NVPYe-mhpgmZPc
VITE_GEOAPIKEY=AIzaSyC1kdddEeNHW4nvr4d_qO6vU2-QQBepwxc
VITE_RAZORPAY_KEY_ID=rzp_test_RAcgtscfNdp1cg
VITE_SERVER_URL=https://your-backend-app.onrender.com
```

**Important**: Replace `https://your-backend-app.onrender.com` with your actual Render backend URL.

### Step 2: Deploy to Vercel
1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (will be auto-detected from vercel.json)
   - **Output Directory**: `dist` (will be auto-detected from vercel.json)

### Step 3: Set Environment Variables in Vercel
In the Vercel project settings, add these environment variables:
```
VITE_FIREBASE_APIKEY=AIzaSyC0-4hmp6ACCt5DhDvq1NVPYe-mhpgmZPc
VITE_GEOAPIKEY=AIzaSyC1kdddEeNHW4nvr4d_qO6vU2-QQBepwxc
VITE_RAZORPAY_KEY_ID=rzp_test_RAcgtscfNdp1cg
VITE_SERVER_URL=https://your-backend-app.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Note your frontend URL: `https://your-frontend-app.vercel.app`

### Troubleshooting Vercel Deployment Issues

#### "vite command not found" Error
If you encounter a "vite command not found" error during deployment, try these solutions:

**Solution 1: Use @vercel/static-build (Recommended)**
1. **Update vercel.json** (already configured in your project):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. **Add vercel-build script** to package.json (already added):
```json
{
  "scripts": {
    "vercel-build": "vite build"
  }
}
```

3. **Specify Node.js version** with .nvmrc file (already created):
```
18
```

**Solution 2: Manual Deployment Steps**
If the above doesn't work, try these steps:

1. **Delete existing Vercel project** and create a new one
2. **Import from GitHub** with these settings:
   - Framework Preset: **Other**
   - Root Directory: `frontend`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables** in Vercel dashboard:
```
VITE_FIREBASE_APIKEY=AIzaSyC0-4hmp6ACCt5DhDvq1NVPYe-mhpgmZPc
VITE_GEOAPIKEY=AIzaSyC1kdddEeNHW4nvr4d_qO6vU2-QQBepwxc
VITE_RAZORPAY_KEY_ID=rzp_test_RAcgtscfNdp1cg
VITE_SERVER_URL=https://your-backend-app.onrender.com
```

**Solution 3: Alternative Deployment Method**
If Vercel continues to have issues, you can also deploy to:
- **Netlify**: Similar process, drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **Firebase Hosting**: Google's hosting solution

**Important Notes:**
- Ensure your repository is pushed to GitHub with all recent changes
- The build process should complete locally without errors
- Check that all environment variables are set correctly in Vercel dashboard

## Post-Deployment Configuration

### Update Backend CORS Settings
1. Go back to your Render dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```
3. Redeploy the backend service

### Test Your Deployment
1. Visit your frontend URL
2. Test user registration and login
3. Test food item browsing and filtering
4. Test order placement
5. Verify real-time updates work correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Failures**: Check build logs in Render/Vercel dashboards
4. **Database Connection**: Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)

### Logs
- **Render**: Check logs in the Render dashboard under your service
- **Vercel**: Check function logs in the Vercel dashboard

## Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Rotate API keys regularly
3. **Database**: Use strong passwords and restrict IP access when possible
4. **HTTPS**: Both Render and Vercel provide HTTPS by default

## Monitoring

- **Render**: Monitor your backend service health and logs
- **Vercel**: Monitor frontend performance and function execution
- **Database**: Monitor MongoDB Atlas for performance and usage

## Scaling

- **Render**: Upgrade to paid plans for better performance and custom domains
- **Vercel**: Automatic scaling for frontend, monitor usage limits
- **Database**: Consider upgrading MongoDB Atlas cluster for production workloads

---

**Note**: This deployment uses the free tiers of Render and Vercel. For production use, consider upgrading to paid plans for better performance, custom domains, and additional features.