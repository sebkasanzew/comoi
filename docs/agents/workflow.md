# AI workflow and references

This project uses AI-first development with GitHub Copilot, Graphite (stacked diffs), and Linear (project management).

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the complete workflow guide.

## Session context
When starting a new session, provide these files for context:
- [AGENTS.md](../../AGENTS.md)
- [PLAN.md](../../PLAN.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Project links
- GitHub: https://github.com/sebkasanzew/comoi
- Linear: https://linear.app/comoi
- Graphite: Use `gt` CLI for stacked diffs

## Graphite basics
- Create a branch and commit: `gt create --all --message "type(scope): summary"`
- Submit the current branch: `gt submit`
- Submit the full stack: `gt submit --stack`
- Update a branch after changes: `gt modify --all`
- Sync stacks with trunk: `gt sync`
