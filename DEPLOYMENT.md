# 🚀 Deployment Guide for Fallback.pics

## ⚡ Quick Deploy Commands

```bash
# Deploy everything to production
pnpm deploy
# OR
./deploy.sh --production

# Deploy to preview environment
pnpm deploy:preview

# Deploy only the worker (API)
pnpm deploy:worker

# Deploy only the website
pnpm deploy:web
```

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: Add your domain to Cloudflare (fallback.pics or your custom domain)
3. **API Token**: Generate at Cloudflare Dashboard > My Profile > API Tokens

## Step 1: Initial Setup

### 1.1 Login to Cloudflare CLI

```bash
# Login to Cloudflare
npx wrangler login

# Or use API token
export CLOUDFLARE_API_TOKEN="your-token-here"
```

### 1.2 Add Your Domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site"
3. Enter your domain (e.g., fallback.pics)
4. Update your domain's nameservers to Cloudflare's

## Step 2: Deploy the Worker (API)

```bash
# Navigate to worker directory
cd apps/worker

# Deploy to production
npm run deploy

# Or with pnpm from root
pnpm worker:deploy
```

After deployment, you'll get a URL like: `https://fallback-pics.YOUR-SUBDOMAIN.workers.dev`

### 2.1 Configure Custom Domain

Option A: Via Dashboard
1. Go to Workers & Pages > Your Worker
2. Click "Custom Domains" tab
3. Add your domain (e.g., fallback.pics or https://fallback.pics/api/v1)

Option B: Via CLI
```bash
npx wrangler domains add fallback.pics
```

## Step 3: Deploy the Website (Documentation)

### 3.1 Build the Website

```bash
# Navigate to web directory
cd apps/web

# Build for production
npm run build

# Or from root
pnpm web:build
```

### 3.2 Deploy to Cloudflare Pages

Option A: Via Dashboard
1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Create a new project
3. Connect your GitHub repository OR upload the `dist` folder
4. Set build settings:
   - Build command: `pnpm web:build`
   - Build output directory: `apps/web/dist`
   - Root directory: `/`

Option B: Via CLI (Direct Upload)
```bash
# Install Wrangler Pages
npm install -g wrangler

# Deploy directly
npx wrangler pages deploy apps/web/dist \
  --project-name=fallback-pics-web \
  --branch=main
```

### 3.3 Configure Custom Domain for Pages

1. Go to Workers & Pages > Your Pages Project
2. Custom domains > Add domain
3. Add: `www.fallback.pics` or just `fallback.pics` for the website

## Step 4: DNS Configuration

Your DNS should look like this:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | 192.0.2.1 | ✅ Proxied |
| AAAA | @ | 100:: | ✅ Proxied |
| CNAME | www | fallback-pics-web.pages.dev | ✅ Proxied |
| CNAME | api | fallback-pics.workers.dev | ✅ Proxied |

## Step 5: Environment Variables (If Needed)

```bash
# Set secrets for Worker
npx wrangler secret put API_KEY

# Set environment variables
npx wrangler vars set NODE_ENV production
```

## Step 6: Test Production

```bash
# Test Worker endpoints
curl https://fallback.pics/400x300
curl https://fallback.pics/chart/bar/600x400
curl https://fallback.pics/animated/pulse/200x200
curl https://fallback.pics/ai/400x300?context=tech

# Test website
curl https://fallback.pics
curl https://www.fallback.pics
```

## Step 7: Update Configuration

### Update Worker for Production URL

Edit `apps/worker/src/index.ts` if needed to add CORS for your domain:

```typescript
headers.set('Access-Control-Allow-Origin', 'https://fallback.pics');
```

### Update Website for Production API

Edit `apps/web/src/config.ts`:

```typescript
export const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8787' 
  : 'https://fallback.pics';
```

## Monitoring & Analytics

1. **Worker Analytics**: Workers & Pages > Analytics
2. **Web Analytics**: Add Cloudflare Web Analytics snippet
3. **Error Tracking**: Workers & Pages > Logs

## Troubleshooting

### Worker not responding
- Check Workers & Pages > Your Worker > Logs
- Verify custom domain is active
- Check DNS propagation

### CORS issues
- Ensure Access-Control headers are set in Worker
- Check domain configuration

### Images not loading
- Verify Worker is deployed
- Check browser console for errors
- Test API endpoints directly

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Deploy Worker
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
        run: pnpm worker:deploy
      
      - name: Build Web
        run: pnpm web:build
      
      - name: Deploy Pages
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
        run: |
          npx wrangler pages deploy apps/web/dist \
            --project-name=fallback-pics-web \
            --branch=main
```

## Production Checklist

- [ ] Domain added to Cloudflare
- [ ] Worker deployed
- [ ] Custom domain configured for Worker
- [ ] Website built and deployed to Pages
- [ ] Custom domain configured for Pages
- [ ] DNS records configured
- [ ] SSL/TLS mode set to "Full (strict)"
- [ ] Page Rules configured (if needed)
- [ ] Caching rules optimized
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] GitHub Actions configured (optional)

## Costs

**Free Tier Includes:**
- 100,000 Worker requests/day
- Unlimited Pages requests
- Free SSL certificates
- Basic analytics

**Paid Plans** (if you exceed limits):
- Workers: $5/month for 10M requests
- Additional features available

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com
- **Worker Examples**: https://developers.cloudflare.com/workers/examples
- **Pages Docs**: https://developers.cloudflare.com/pages

---

## Quick Deploy Commands

```bash
# From project root
# 1. Login
npx wrangler login

# 2. Deploy Worker
cd apps/worker && npm run deploy

# 3. Build & Deploy Website
cd ../web && npm run build
npx wrangler pages deploy dist --project-name=fallback-pics-web

# 4. Add custom domains via dashboard
```

That's it! Your placeholder service is now live! 🎉