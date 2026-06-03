# Contributing to Fallback.pics

First off, thank you for considering contributing to Fallback.pics! It's people like you that make Fallback.pics such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the [Fallback.pics Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Note your environment** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the feature**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `pnpm install`
3. **Make your changes** following our coding standards
4. **Add tests** if you've added code that should be tested
5. **Ensure tests pass**: `pnpm test`
6. **Format your code**: `pnpm format`
7. **Lint your code**: `pnpm lint`
8. **Update documentation** as needed
9. **Create a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Git
- Cloudflare account (free tier is fine)

### Local Development

1. **Clone your fork**
```bash
git clone https://github.com/your-username/fallback-pics.git
cd fallback-pics
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
# Copy example configs
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env
```

4. **Start development servers**
```bash
# Start all apps
pnpm dev

# Or start individually
pnpm worker:dev
pnpm web:dev
```

### Project Structure

```
fallback-pics/
├── apps/
│   ├── worker/         # Cloudflare Worker for image generation
│   │   ├── src/       # Source code
│   │   └── tests/     # Worker tests
│   └── web/           # Documentation website
│       ├── src/       # Astro source
│       └── public/    # Static assets
├── packages/
│   ├── shared/        # Shared types and utilities
│   └── ui/           # Shared UI components
└── .github/          # GitHub workflows and templates
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Maintain strict type safety
- Avoid `any` types
- Document complex types

### Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm format` before committing
- Follow existing patterns in the codebase
- Keep functions small and focused
- Write descriptive variable names

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements

Examples:
```
feat: add webp format support
fix: correct color parsing for hex values
docs: update API documentation
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Test edge cases

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check coverage
pnpm test:coverage
```

## Working on Specific Areas

### Worker (Image Generation)

The worker handles all image generation logic:

- **Location**: `apps/worker/src/`
- **Key files**:
  - `index.ts` - Main entry point
  - `router.ts` - URL routing
  - `generator.ts` - Image generation logic
  - `cache.ts` - Cache headers

### Website (Documentation)

The documentation site is built with Astro:

- **Location**: `apps/web/src/`
- **Key areas**:
  - `pages/` - Astro pages
  - `components/` - React components
  - `layouts/` - Page layouts

### Adding New Image Formats

1. Update the generator in `apps/worker/src/generator.ts`
2. Add format detection in `apps/worker/src/router.ts`
3. Update cache headers if needed
4. Add tests for the new format
5. Update documentation

### Adding New Presets

1. Define the preset in `apps/worker/src/presets.ts`
2. Add routing logic in `apps/worker/src/router.ts`
3. Implement generation logic
4. Add tests
5. Document in the API docs

## Documentation

- Update README.md for user-facing changes
- Update API documentation for new endpoints
- Add JSDoc comments for new functions
- Include examples for new features
- Keep examples aligned with the canonical `/api/v1/...` route strategy
- Link to canonical fallback.pics pages when referencing product surfaces:
  - Homepage: `https://fallback.pics/`
  - Docs: `https://fallback.pics/docs`
  - API Reference: `https://fallback.pics/api`
  - Placeholder Image API: `https://fallback.pics/placeholder-image-api/`
  - Placeholder Image Generator: `https://fallback.pics/placeholder-image-generator/`

### External References

If you submit fallback.pics to an awesome list, framework resource page, or developer directory, keep the reference factual and useful. Use working `/api/v1/...` examples, avoid unsupported claims, and do not submit to spammy SEO directories, paid link networks, or unrelated sites.

## Questions?

Feel free to:
- Open an issue for questions
- Join our [Discord server](https://discord.gg/hwGJNnN3)
- Email us at support@fallback.pics

## Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Given credit in our documentation

Thank you for contributing! 🎉
