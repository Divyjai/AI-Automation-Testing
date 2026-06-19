# Configuration

## Setup

```bash
cp .env.example .env
# Edit .env with your local values
```

## Files

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.example` | Template documenting all variables | Yes |
| `.env` | Local secrets and overrides | No (gitignored) |
| `.env.staging` | Optional staging overrides | No (gitignored) |
| `env.config.ts` | Loads env, exports typed `env` object | Yes |
| `test-data.ts` | Stable test data sourced from env | Yes |

## Usage

```typescript
import { env, hasAccountCredentials } from './env.config';
import { testData } from './test-data';
```

Never read `process.env` directly in tests or page objects.

## Switch Environment

```bash
ENV_FILE=.env.staging npx playwright test
```
