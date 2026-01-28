# Graphite workflow

Use Graphite CLI (`gt`) instead of Git for branching and submitting changes.

## Create and submit
- Create a branch and commit: `gt create --all --message "type(scope): summary"`
- Submit the current branch: `gt submit`
- Submit the entire stack: `gt submit --stack`

## Update a stack
- Modify the current branch and restack: `gt modify --all`
- Sync with trunk and restack all branches: `gt sync`

## Navigation
- Open an interactive branch picker: `gt checkout`
- Move up/down the stack: `gt up` / `gt down`
