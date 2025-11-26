# PicklePulse Deployment Guide

This guide covers deploying the PicklePulse web version to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **Node.js**: Version 18 or higher
3. **Vercel CLI**: Install globally with `npm install -g vercel`

## Deployment Methods

### Method 1: Vercel CLI (Recommended for Quick Deployment)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

#### Step 3: Deploy from Project Directory

```bash
cd /Users/Etu/Downloads/Personal/Personal\ Dev\ Project/PicklePulse
vercel
```

The CLI will:
- Ask if you want to set up and deploy (press `Y`)
- Ask for project scope (select your account)
- Ask if you want to link to existing project (press `N` for first deployment)
- Ask for project name (default: `picklepulse`)
- Ask for directory (press Enter to use current directory)
- Detect settings automatically

#### Step 4: Configure Environment Variables

After the initial deployment, add your environment variables:

```bash
vercel env add EXPO_PUBLIC_SUPABASE_URL
```

When prompted, paste your Supabase URL and select all environments (Production, Preview, Development).

```bash
vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY
```

When prompted, paste your Supabase anon key and select all environments.

#### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

This will deploy to production with your environment variables.

---

### Method 2: Vercel Dashboard (GitHub Integration)

#### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

#### Step 2: Import Project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your PicklePulse repository
4. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

#### Step 3: Automatic Deployments

Every push to your main branch will automatically trigger a new deployment.

---

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |

> **Note**: Get these values from your Supabase project dashboard under Settings → API.

---

## Updating Your Deployment

### CLI Method

```bash
vercel --prod
```

### GitHub Method

Simply push to your main branch:

```bash
git add .
git commit -m "Update app"
git push origin main
```

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails with module errors

**Solution**: Ensure all dependencies are installed:
```bash
npm install
npm run build:web
```

### Environment Variables Not Working

**Issue**: App can't connect to Supabase

**Solution**: 
1. Verify environment variables in Vercel dashboard
2. Ensure variable names start with `EXPO_PUBLIC_`
3. Redeploy after adding variables

### Blank Page After Deployment

**Issue**: Deployed site shows blank page

**Solution**:
1. Check browser console for errors
2. Verify `vercel.json` routing configuration
3. Ensure `dist` directory contains `index.html`

### 404 on Page Refresh

**Issue**: Refreshing a route shows 404 error

**Solution**: The `vercel.json` rewrites configuration should handle this. Verify the file exists and is correctly formatted.

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Domains
3. Add your domain
4. Update DNS records as instructed by Vercel

---

## Monitoring

### View Deployment Logs

```bash
vercel logs [deployment-url]
```

### Analytics

View analytics in the Vercel dashboard:
- Page views
- Performance metrics
- Error tracking

---

## Important Notes

- **Mobile-First Design**: PicklePulse is optimized for mobile. Web version works but some features (watch connectivity, haptics) are unavailable.
- **Free Tier Limits**: Vercel free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
- **Build Time**: First build may take 2-3 minutes

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Expo Web Documentation**: [docs.expo.dev/workflow/web](https://docs.expo.dev/workflow/web/)
