# Environment Configuration

This document explains how to configure environment variables for different deployment environments.

## Environment Files

The project uses different environment files for different environments:

- **`.env.local`** - Development environment (local development)
- **`.env.production`** - Production environment (deployed application)
- **`.env.example`** - Template file with all required variables

## Required Environment Variables

### Client-side Variables (NEXT*PUBLIC*\*)

These variables are available in the browser and must be prefixed with `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_BASE_URL` - Base URL of the application
- `NEXT_PUBLIC_API_URL` - API endpoint URL for client-side requests

### Server-side Variables

These variables are only available on the server:

- `BASE_URL` - Base URL for server-side API calls (falls back to NEXT_PUBLIC_BASE_URL)
- `NODE_ENV` - Environment mode (development/production)

## Environment Setup

### Development Environment

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local`:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Production Environment

The `.env.production` file is already configured with production values:

```env
NEXT_PUBLIC_BASE_URL=https://loottantra.com
NEXT_PUBLIC_API_URL=https://loottantra.com/api
BASE_URL=https://loottantra.com
NODE_ENV=production
```

## Validation

Use the built-in environment validation script:

```bash
# Check current environment configuration
npm run check-env

# Run development with environment check
npm run dev:check

# Build with environment check
npm run build:check
```

## Usage in Code

### Client-side Components

```typescript
import { clientConfig, getApiUrl } from "@/lib/config";

// Get API URL for client-side requests
const apiUrl = getApiUrl();

// Access configuration
console.log(clientConfig.baseUrl);
console.log(clientConfig.isDevelopment);
```

### Server-side Components

```typescript
import { serverConfig, getServerApiUrl } from "@/lib/config";

// Get API URL for server-side requests
const apiUrl = getServerApiUrl();

// Access configuration
console.log(serverConfig.baseUrl);
console.log(serverConfig.isProduction);
```

### Universal Usage

```typescript
import { getBaseUrl } from "@/lib/config";

// Works on both client and server
const baseUrl = getBaseUrl();
```

## Security Notes

- Never commit `.env.local` to version control
- Client-side variables (NEXT*PUBLIC*\*) are visible in the browser
- Server-side variables are only accessible on the server
- Use server-side variables for sensitive configuration

## Deployment

### Vercel

Environment variables are automatically loaded from:

1. `.env.production` for production builds
2. `.env.local` for development builds

### Other Platforms

Make sure to set the environment variables in your deployment platform:

- `NEXT_PUBLIC_BASE_URL=https://loottantra.com`
- `NEXT_PUBLIC_API_URL=https://loottantra.com/api`
- `BASE_URL=https://loottantra.com`
- `NODE_ENV=production`

## Troubleshooting

### Environment Variables Not Loading

1. Check file names (must be exact: `.env.local`, `.env.production`)
2. Verify file location (must be in project root)
3. Run `npm run check-env` to validate configuration
4. Restart development server after changing environment files

### Build Issues

1. Run `npm run build:check` to validate before building
2. Ensure all required variables are set for the target environment
3. Check that NEXT*PUBLIC* variables are properly prefixed
