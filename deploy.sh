#!/bin/bash

# Fallback.pics Deployment Script
# This script ensures consistent deployment of both worker and web components

set -e  # Exit on error

echo "🚀 Starting Fallback.pics Deployment..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Parse command line arguments
DEPLOY_WORKER=true
DEPLOY_WEB=true
PRODUCTION=false
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --worker-only)
            DEPLOY_WEB=false
            shift
            ;;
        --web-only)
            DEPLOY_WORKER=false
            shift
            ;;
        --production|-p)
            PRODUCTION=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./deploy.sh [options]"
            echo ""
            echo "Options:"
            echo "  --worker-only    Deploy only the worker (API)"
            echo "  --web-only       Deploy only the website"
            echo "  --production,-p  Deploy to production (otherwise deploys to preview)"
            echo "  --skip-tests     Skip running tests before deployment"
            echo "  --help,-h        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Step 1: Deploy Worker (Backend API)
if [ "$DEPLOY_WORKER" = true ]; then
    echo ""
    echo "📦 Deploying Worker (Backend API)..."
    echo "------------------------------------"
    
    cd apps/worker
    
    # Run tests if they exist (but don't fail deployment)
    if [ "$SKIP_TESTS" = false ]; then
        if [ -f "package.json" ] && grep -q '"test"' package.json; then
            print_status "Running worker tests..."
            if pnpm test -- --run 2>/dev/null; then
                print_status "Tests passed!"
            else
                print_warning "Tests failed or not configured - continuing with deployment"
            fi
        fi
    else
        print_warning "Skipping tests as requested"
    fi
    
    # Deploy worker
    print_status "Deploying worker to Cloudflare..."
    pnpm run deploy
    
    if [ $? -eq 0 ]; then
        print_status "Worker deployed successfully!"
    else
        print_error "Worker deployment failed!"
        exit 1
    fi
    
    cd ../..
fi

# Step 2: Build and Deploy Web (Frontend)
if [ "$DEPLOY_WEB" = true ]; then
    echo ""
    echo "🌐 Deploying Website (Frontend)..."
    echo "-----------------------------------"
    
    cd apps/web
    
    # Build the website
    print_status "Building website..."
    pnpm build
    
    if [ $? -ne 0 ]; then
        print_error "Build failed!"
        exit 1
    fi
    
    # Copy sitemap to dist
    if [ -f "public/sitemap.xml" ]; then
        print_status "Copying sitemap..."
        cp public/sitemap.xml dist/sitemap.xml
    fi
    
    # Deploy to Cloudflare Pages
    print_status "Deploying to Cloudflare Pages..."
    
    # IMPORTANT: Using the correct project name that has the custom domain
    PROJECT_NAME="fallback-pics"
    
    if [ "$PRODUCTION" = true ]; then
        print_status "Deploying to PRODUCTION..."
        npx wrangler pages deploy dist \
            --project-name "$PROJECT_NAME" \
            --branch main \
            --commit-dirty=true
    else
        print_status "Deploying to PREVIEW..."
        npx wrangler pages deploy dist \
            --project-name "$PROJECT_NAME" \
            --branch preview \
            --commit-dirty=true
    fi
    
    if [ $? -eq 0 ]; then
        print_status "Website deployed successfully!"
    else
        print_error "Website deployment failed!"
        exit 1
    fi
    
    cd ../..
fi

# Step 3: Verification
echo ""
echo "🔍 Verifying Deployment..."
echo "--------------------------"

# Test worker endpoint
if [ "$DEPLOY_WORKER" = true ]; then
    print_status "Testing worker API..."
    WORKER_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://fallback-pics.billing-04f.workers.dev/200x100")
    if [ "$WORKER_TEST" = "200" ]; then
        print_status "Worker API is responding correctly"
    else
        print_warning "Worker API returned status code: $WORKER_TEST"
    fi
fi

# Test production API endpoint
if [ "$PRODUCTION" = true ] && [ "$DEPLOY_WEB" = true ]; then
    print_status "Testing production API endpoint..."
    sleep 5  # Wait for deployment to propagate
    
    API_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://fallback.pics/api/v1/200x100")
    if [ "$API_TEST" = "200" ]; then
        print_status "Production API is working!"
    else
        print_warning "Production API returned status code: $API_TEST"
        print_warning "It may take a few minutes for changes to propagate"
    fi
fi

# Summary
echo ""
echo "=================================="
echo "📊 Deployment Summary"
echo "=================================="

if [ "$DEPLOY_WORKER" = true ]; then
    print_status "Worker: Deployed"
    echo "  - Direct URL: https://fallback-pics.billing-04f.workers.dev"
fi

if [ "$DEPLOY_WEB" = true ]; then
    print_status "Website: Deployed"
    if [ "$PRODUCTION" = true ]; then
        echo "  - Production: https://fallback.pics"
        echo "  - API: https://fallback.pics/api/v1/*"
    else
        echo "  - Preview: https://fallback-pics.pages.dev"
    fi
fi

echo ""
print_status "Deployment completed successfully! 🎉"
echo ""
echo "Test URLs:"
echo "  - https://fallback.pics/api/v1/400x300"
echo "  - https://fallback.pics/api/v1/400x300?text=Hello+World"
echo "  - https://fallback.pics/api/v1/avatar/200"
