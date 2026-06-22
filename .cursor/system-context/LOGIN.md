# Login & OTP — Amazon.in

Stable context for pipeline **stage 2 Login** and authenticated test prerequisites. Enforcement rules live in `guard-rules.mdc`; stage gates live in [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md#stage-2--login-gate) stage 2.

## Credentials

| Variable | Source | Notes |
|----------|--------|-------|
| `AMAZON_EMAIL` | `.env` → `config/env.config.ts` | Required when `requires_login: true` |
| `AMAZON_PASSWORD` | `.env` → `config/env.config.ts` | Never hardcode in source |

Setup: `cp .env.example .env` and set values locally. Never commit `.env`.

## OTP policy

- OTP is **never** automated, stored in `.env`, written to files, or logged in test output
- When the OTP screen appears, `@qa-pipeline` asks the user in chat
- User replies with the OTP in chat; agent completes login via MCP `browser_*` (headed)
- See `guard-rules.mdc` Security Guards for non-negotiable enforcement

## Stage 2 procedure

| Step | Action |
|------|--------|
| Owner | `@qa-pipeline` (stage 2 only for login-only requests) |
| Channel | MCP `browser_*` headed — not CLI |
| Prerequisite | Plan gate passed; `requires_login: true` on at least one scenario (else skip stage 2) |
| Output | `playwright/.auth/amazon-user.json` (gitignored) |

## Authenticated test prerequisites

Auth specs import from `fixtures/auth.fixture.ts`:

```typescript
import { test, expect, AUTH_STATE_PATH, hasAuthState } from '../../../fixtures/auth.fixture';

test.beforeAll(() => {
  test.skip(!hasAuthState(), 'Run qa-pipeline login (stage 2) first');
});
test.use({ storageState: AUTH_STATE_PATH });
```

## Recovery

| Situation | Action |
|-----------|--------|
| OTP timeout or rejection | Re-prompt user **once** for OTP |
| Second OTP failure | **STOP** — ask user to skip auth scenarios or abort pipeline |
| Credentials missing in `.env` | **STOP** before login — ask user to configure `.env` |
| Session expired during verify/heal | Re-run stage 2 via `@qa-pipeline`; fresh OTP from user in chat |

## Routing

- Login-only request → `@qa-pipeline` stage 2 per `sdlc-core.mdc`
- Full pipeline → stage 2 after stage 1 plan gate passes
- Automate-only (`@test-generator`) → login only if auth scenarios exist **and** user approves
