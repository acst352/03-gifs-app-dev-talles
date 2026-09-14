# 03-gifs-app-dev-talles

Angular 21 standalone app: search and trending GIFs via the Giphy API. Built as part of the **Angular Udemy — DevTalles** course, with a production-grade CI/CD pipeline (GitHub Actions + Snyk + SonarCloud + Vercel).

## Stack

- **Angular 21.2** (standalone components, signals, `@angular/build` builder)
- **pnpm 11** with strict build-script approval (`pnpm-workspace.yaml` `allowBuilds`)
- **Vitest 4** + jsdom for unit/integration tests (Angular's `@angular/build:unit-test`)
- **Tailwind CSS 4** for styling
- **TypeScript 5.9**

## Project layout

```
src/
  app/
    gifs/
      components/      # gif-list, gif-list-item, side-menu, side-menu-*
      interfaces/      # Gif, GiphyResponse
      mapper/          # GifMapper (Giphy item → Gif model)
      pages/           # dashboard-page, search-page, trending-page
      services/        # GifService (HTTP, signals)
    app.ts / app.config.ts / app.routes.ts
  environments/        # environment.ts (dev template), environment.development.ts, environment.prod.generated.ts (gitignored, generated at build time)
  env.d.ts             # ImportMetaEnv typings for VITE_GIPHY_API_KEY
.env.example           # template for local .env (committed)
.env                   # local dev secrets (gitignored)
scripts/
  inject-prod-env.cjs  # prebuild script: inlines VITE_GIPHY_API_KEY into the production env file
.github/workflows/ci.yml
sonar-project.properties
.snyk
.vercelignore
pnpm-workspace.yaml
```

## Local setup

### Prerequisites

- Node.js 22.x
- pnpm 11.22+ (`npm i -g pnpm`)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Create your local .env with the Giphy API key
cp .env.example .env
# Edit .env and set VITE_GIPHY_API_KEY=<your-key>

# 3. Run dev server
pnpm start   # http://localhost:4200

# 4. Run tests
pnpm exec ng test --watch=false

# 5. Production build (requires VITE_GIPHY_API_KEY in env)
VITE_GIPHY_API_KEY=<your-key> pnpm run build
# or, in CI:
pnpm run prebuild && pnpm exec ng build --configuration=production
```

### Where to get a Giphy API key

1. https://developers.giphy.com/ → Sign in → Dashboard
2. **Create an App** (select API SDK)
3. Copy the API Key
4. Paste it into your `.env` (local dev) and into your CI/CD platform's secrets (see below)

## CI/CD pipeline

Every push to `master` and every PR triggers `.github/workflows/ci.yml`:

### Job 1 · `quality-gates`

| Step | Tool | What it does |
|---|---|---|
| Install | pnpm | install dependencies with `allowBuilds` whitelist |
| Build | Angular | smoke test compilation (dev config) |
| Tests + coverage | Vitest | unit + integration tests; emits `coverage/lcov.info` |
| Snyk test | Snyk CLI | dependency vulnerability scan; fails on `high`+ |
| Snyk monitor | Snyk CLI | uploads dep graph to Snyk dashboard (master only) |
| Snyk code | Snyk CLI | SAST scan; fails on `high`+ |
| SonarCloud | sonarcloud.io | code quality + coverage report |

### Job 2 · `deploy-vercel` (depends on quality-gates)

| Branch | Behavior |
|---|---|
| PR to `master` | `vercel deploy --target=preview`, comment URL on PR |
| Push to `master` | `vercel deploy --target=production`, aliased to the prod domain |

## Required GitHub Secrets

Configure at https://github.com/acst352/03-gifs-app-dev-talles/settings/secrets/actions:

| Secret | Source |
|---|---|
| `SNYK_TOKEN` | https://app.snyk.io/account → API Token |
| `SONAR_TOKEN` | https://sonarcloud.io/account/security → Generate Token |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | local: `vercel link` → `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | local: `vercel link` → `.vercel/project.json` → `projectId` |
| `VITE_GIPHY_API_KEY` | https://developers.giphy.com → API Key (rotated; never in repo) |

## Required Vercel env vars

Set `VITE_GIPHY_API_KEY` in Vercel project settings (Settings → Environment Variables). It's used at build time by `scripts/inject-prod-env.cjs`.

## Linear integration

Issues for this project live in Linear under the **gifs-app-dev-talles** project (workspace: `icy-alex`, team: `Icy-alex`). The current implementation tracks issue `ICY-41` (Mostrar resultados de búsqueda de gifs).

## Security notes

- **No hardcoded secrets.** All API keys live in `VITE_GIPHY_API_KEY` (env var), injected at build time via the prebuild script. The generated file (`environment.prod.generated.ts`) is gitignored.
- **Git history was rewritten** to remove any past hardcoded keys before the first push. The repository's first commit on `master` is the clean baseline.
- **Snyk** runs on every push + monitors the project for new CVEs.
- **SonarCloud** enforces code-quality gates on every PR.
- **Rotating the Giphy API key**: create a new key in the Giphy dashboard, then update the secret in GitHub and the env var in Vercel. No code changes needed.
