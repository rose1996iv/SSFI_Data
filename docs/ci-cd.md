# CI/CD Guide

## Included workflows

### 1. CI

File: `.github/workflows/ci.yml`

Runs on:

- push to `main`
- pull request targeting `main`

Checks:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

### 2. Preview deployment

File: `.github/workflows/vercel-preview.yml`

Runs on:

- pull request targeting `main`

Behavior:

- pulls Vercel preview environment
- builds with Vercel
- deploys a preview URL

### 3. Production deployment

File: `.github/workflows/vercel-production.yml`

Runs on:

- push to `main`
- manual run from GitHub Actions

Behavior:

- pulls Vercel production environment
- builds with Vercel
- deploys to production

## Required GitHub secrets

Add these in GitHub:

`Repository -> Settings -> Secrets and variables -> Actions`

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## How to get the Vercel values

### VERCEL_TOKEN

1. Open Vercel account settings.
2. Go to `Tokens`.
3. Create a new token.

### VERCEL_ORG_ID and VERCEL_PROJECT_ID

Option 1:

1. Link the project locally with `vercel link`.
2. Open `.vercel/project.json`.
3. Copy `orgId` and `projectId`.

Option 2:

1. Open the Vercel project settings.
2. Copy the project and team identifiers from the project metadata.

## How to test locally before pushing

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

If all four pass, the CI workflow should pass too.

## How to test the CI workflow

### Test on a feature branch

1. Create a branch:

   ```bash
   git checkout -b chore/test-ci
   ```

2. Make a small harmless change, for example a docs edit.
3. Push the branch:

   ```bash
   git push -u origin chore/test-ci
   ```

4. Open a pull request into `main`.
5. GitHub Actions should run:
   - `CI`
   - `Vercel Preview Deploy` if secrets are configured

## How to test preview deployment

1. Confirm the three Vercel secrets are set in GitHub.
2. Push a branch and open a pull request to `main`.
3. Wait for `Vercel Preview Deploy` to finish.
4. Open the preview URL from:
   - the workflow summary
   - the Vercel dashboard

## How to test production deployment

### Automatic production deploy

1. Merge a pull request into `main`.
2. GitHub Actions runs:
   - `CI`
   - `Vercel Production Deploy`
3. Check the production deployment URL in the workflow summary.

### Manual production deploy

1. Open `GitHub -> Actions`.
2. Choose `Vercel Production Deploy`.
3. Click `Run workflow`.

## Recommended protection rules

- require pull request before merging to `main`
- require CI checks to pass
- restrict direct pushes to `main`
- keep Vercel environment variables in Vercel, not GitHub, unless truly needed by the workflow itself

## Common failure cases

### CI fails on build

- run `npm run build` locally
- check for missing imports, invalid server/client boundaries, or type errors

### Preview or production deploy is skipped

- verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are present

### Vercel build fails

- confirm the project exists in Vercel
- confirm environment variables are configured in Vercel project settings
- confirm `NEXT_PUBLIC_SITE_URL` matches the deployed domain
