# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Fallback.pics seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Discuss the vulnerability publicly

### Please DO:

Email us directly at: **security@fallback.pics**

Include the following information:

1. Type of vulnerability (e.g., XSS, CSRF, SQL Injection)
2. Full paths of source file(s) related to the vulnerability
3. Location of the affected source code (tag/branch/commit or direct URL)
4. Step-by-step instructions to reproduce the issue
5. Proof-of-concept or exploit code (if possible)
6. Impact of the issue, including how an attacker might exploit it

### What to expect:

1. **Initial Response**: Within 48 hours, we will acknowledge receipt of your report
2. **Assessment**: Within 7 days, we will confirm the vulnerability and determine its severity
3. **Fix Development**: We will develop a fix and test it thoroughly
4. **Disclosure**: We will notify you when the fix is deployed
5. **Credit**: With your permission, we will publicly credit you for the discovery

## Security Best Practices for Deployment

When deploying your own instance of Fallback.pics:

### 1. Use HTTPS Only
Always serve your instance over HTTPS to prevent man-in-the-middle attacks.

### 2. Configure Rate Limiting
Implement rate limiting to prevent abuse:
```toml
# In wrangler.toml
[env.production.rate_limiting]
requests_per_minute = 100
```

### 3. Set Appropriate CORS Headers
Configure CORS headers to control which domains can use your service:
```javascript
headers: {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET',
}
```

### 4. Monitor Usage
Regularly monitor your Cloudflare Analytics for unusual patterns.

### 5. Keep Dependencies Updated
Regularly update dependencies to patch known vulnerabilities:
```bash
pnpm update
pnpm audit
```

### 6. Use Environment Variables
Never commit sensitive configuration to your repository. Use environment variables:
```bash
# Good
API_KEY=${{ secrets.API_KEY }}

# Bad
API_KEY="sk-1234567890"
```

## Security Features

Fallback.pics includes several security features by default:

- **No Data Storage**: We don't store any user data or images
- **No Cookies**: We don't use cookies or tracking
- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **Input Validation**: All input parameters are validated and sanitized
- **Rate Limiting**: Built-in rate limiting prevents abuse
- **HTTPS Only**: Enforced HTTPS in production

## Vulnerability Disclosure Policy

We follow responsible disclosure practices:

1. Security issues are fixed before public disclosure
2. We aim to fix critical vulnerabilities within 7 days
3. We will credit researchers who report valid vulnerabilities
4. We request a 30-day embargo before public disclosure

## Contact

For security concerns, contact: **security@fallback.pics**

For general support: **support@fallback.pics**

Thank you for helping keep Fallback.pics secure!