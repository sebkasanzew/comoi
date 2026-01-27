# Accessing GitHub Actions Logs

This guide explains how AI assistants (and humans) can access GitHub Actions workflow logs for debugging CI failures.

## Prerequisites

1. **GitHub CLI (`gh`)** must be installed and authenticated:
   ```bash
   # Check if installed
   gh --version
   
   # Authenticate if needed
   gh auth login
   ```

2. **Disable pager** for programmatic access by setting environment variables:
   ```bash
   export PAGER=''
   export GH_PAGER=''
   ```

## Quick Commands

### List Recent Workflow Runs

```bash
# List the 5 most recent workflow runs
PAGER='' GH_PAGER='' gh run list --limit 5

# Get JSON output with specific fields
PAGER='' GH_PAGER='' gh run list --json databaseId,status,conclusion,name,headBranch --limit 5
```

### Get Workflow Run for Current Branch

```bash
# Get the current branch name
BRANCH=$(git branch --show-current)

# List runs for this branch
PAGER='' GH_PAGER='' gh run list --branch "$BRANCH" --limit 5
```

### View Workflow Run Details

```bash
# Replace RUN_ID with the actual run ID (e.g., 21398180818)
RUN_ID=21398180818

# Get job details as JSON
PAGER='' GH_PAGER='' gh run view $RUN_ID --json jobs

# Get only failed logs (most useful for debugging)
PAGER='' GH_PAGER='' gh run view $RUN_ID --log-failed 2>&1 | cat | head -500
```

### Get Logs for a Specific Job

```bash
# First, get the job IDs from the run
PAGER='' GH_PAGER='' gh run view $RUN_ID --json jobs | jq '.jobs[] | {name, databaseId, conclusion}'

# Then get logs for a specific job using the API
JOB_ID=61601871054  # Replace with actual job ID
PAGER='' GH_PAGER='' gh api "repos/sebkasanzew/comoi/actions/jobs/$JOB_ID/logs" 2>&1 | cat | tail -300
```

## Complete Script for AI Assistants

Here's a complete script to get workflow logs for the current branch:

```bash
#!/bin/bash
# Get GitHub Actions logs for the current branch

# Disable pager
export PAGER=''
export GH_PAGER=''

# Get current branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"

# Get the most recent run for this branch
RUN_INFO=$(gh run list --branch "$BRANCH" --limit 1 --json databaseId,status,conclusion,name)
RUN_ID=$(echo "$RUN_INFO" | jq -r '.[0].databaseId')
STATUS=$(echo "$RUN_INFO" | jq -r '.[0].status')
CONCLUSION=$(echo "$RUN_INFO" | jq -r '.[0].conclusion')

echo "Run ID: $RUN_ID"
echo "Status: $STATUS"
echo "Conclusion: $CONCLUSION"

if [ "$STATUS" = "completed" ] && [ "$CONCLUSION" = "failure" ]; then
  echo ""
  echo "=== Failed Job Logs ==="
  gh run view "$RUN_ID" --log-failed 2>&1 | cat | head -500
fi
```

## For AI Assistants: Step-by-Step Process

When debugging CI failures:

1. **Get the current branch:**
   ```bash
   git branch --show-current
   ```

2. **List recent runs for this branch:**
   ```bash
   PAGER='' GH_PAGER='' gh run list --branch "BRANCH_NAME" --limit 5
   ```

3. **Get job details for a specific run:**
   ```bash
   PAGER='' GH_PAGER='' gh run view RUN_ID --json jobs
   ```

4. **Identify failed jobs** by looking at `conclusion: failure` in the jobs list.

5. **Get failed logs:**
   ```bash
   PAGER='' GH_PAGER='' gh run view RUN_ID --log-failed 2>&1 | cat | head -500
   ```

6. **For more detailed logs of a specific job:**
   ```bash
   PAGER='' GH_PAGER='' gh api "repos/OWNER/REPO/actions/jobs/JOB_ID/logs" 2>&1 | cat | tail -300
   ```

## Important Notes

- Always use `PAGER='' GH_PAGER=''` to prevent the CLI from opening an interactive pager
- Pipe output through `cat` to ensure plain text output
- Use `head -N` or `tail -N` to limit output length (logs can be very long)
- The `--log-failed` flag only shows logs from failed steps, which is usually what you want

## GitHub Environment Variables Required for E2E Tests

The E2E tests require these environment variables to be set in GitHub:

### Repository Variables (Settings → Secrets and variables → Actions → Variables)
- `EXPO_PUBLIC_CONVEX_URL` - Your Convex deployment URL

### Repository Secrets (Settings → Secrets and variables → Actions → Secrets)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

Make sure these are added to the `development` environment or set as repository-level secrets/variables.
