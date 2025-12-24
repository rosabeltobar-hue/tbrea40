# GitHub Actions CI/CD Setup

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **Test & Build**: Runs tests, generates coverage, builds React app
- **Functions Test**: Tests and builds Firebase Cloud Functions
- **Android Build Check**: Validates Android build configuration
- **Deploy Staging**: Auto-deploys to Firebase Hosting staging (develop branch)
- **Deploy Production**: Auto-deploys to production (main branch)

### 2. **PR Checks** (`.github/workflows/pr-checks.yml`)
Runs on every pull request.

**Checks:**
- TypeScript compilation
- Test execution
- Build validation
- Code quality checks (merge conflicts, file sizes, console.log warnings)

## Required Secrets

Configure these in **Settings → Secrets and variables → Actions**:

### Firebase Secrets
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_DONATION_FUNCTION_URL
```

### Deployment Secrets
```
FIREBASE_SERVICE_ACCOUNT_TBREAKAPP  # For Firebase deployment
FIREBASE_TOKEN                       # Firebase CI token (run: firebase login:ci)
```

## Setup Instructions

### 1. Add Firebase Service Account
```bash
# In your Firebase project, go to:
# Project Settings → Service Accounts → Generate New Private Key

# Add the entire JSON content as a GitHub secret named:
# FIREBASE_SERVICE_ACCOUNT_TBREAKAPP
```

### 2. Generate Firebase CI Token
```bash
firebase login:ci

# Copy the token and add as GitHub secret:
# FIREBASE_TOKEN
```

### 3. Add Environment Variables
Add all `REACT_APP_*` variables from your `.env` file as GitHub secrets.

### 4. Enable GitHub Actions
- Go to repository **Settings → Actions → General**
- Enable "Allow all actions and reusable workflows"
- Save changes

## Usage

### Automatic Deployments

**To Staging:**
```bash
git checkout develop
git commit -m "Your changes"
git push origin develop
```
→ Automatically deploys to Firebase Hosting staging channel

**To Production:**
```bash
git checkout main
git merge develop
git push origin main
```
→ Automatically deploys to production (tbreakapp.web.app)

### Manual Deployments

You can still use the deployment script locally:
```bash
./deploy.sh web        # Deploy to Firebase Hosting
./deploy.sh functions  # Deploy Cloud Functions
./deploy.sh all        # Deploy everything
```

## Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/rosabeltobar-hue/tbrea40/workflows/CI/CD%20Pipeline/badge.svg)
![Tests](https://github.com/rosabeltobar-hue/tbrea40/workflows/PR%20Checks/badge.svg)
```

## Troubleshooting

### Tests Failing in CI but Pass Locally
- Check that all dependencies are in `package.json`
- Ensure environment variables are set as GitHub secrets
- Check Node.js version matches (18.x)

### Firebase Deployment Fails
- Verify `FIREBASE_SERVICE_ACCOUNT_TBREAKAPP` secret is valid
- Check Firebase project permissions
- Ensure `firebase.json` is properly configured

### Build Artifacts Not Found
- Ensure the `test` job completes successfully
- Check artifact upload/download steps in workflow
- Verify artifact retention period (default: 7 days)

## Local Testing of Workflows

Use [act](https://github.com/nektos/act) to test workflows locally:
```bash
# Install act
brew install act  # macOS
# or: choco install act  # Windows

# Run workflows locally
act pull_request  # Test PR checks
act push          # Test CI/CD pipeline
```

## Monitoring

- View workflow runs: **Actions** tab in GitHub
- Check deployment status: Firebase Console → Hosting
- View logs: Click on any workflow run for detailed logs
- Coverage reports: Codecov.io (if configured)
