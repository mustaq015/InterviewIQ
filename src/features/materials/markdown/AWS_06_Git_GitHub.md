# Git and GitHub

This section covers Git commands, merge conflicts, and common issues.

## Git/GitHub Commands
```bash
git init              # Initialize
git add .            # Stage all
git commit -m 'msg'  # Commit
git push -u origin main  # Push
git pull             # Pull
git clone <url>      # Clone
git branch           # List branches
git checkout <branch> # Switch branch
git merge            # Merge
```

### Merge Conflicts
- Pull latest before pushing
- Resolve manually
- Commit again

### Issues
- **Merge conflicts**: Resolve manually
- **Large files**: Use .gitignore
- **Secrets exposed**: Revoke immediately, use git filter-repo

---

## Cheat Sheet

### Basic Commands
| Command | Description |
|---------|-------------|
| `git init` | Initialize repo |
| `git add .` | Stage all files |
| `git commit -m 'msg'` | Commit changes |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git clone <url>` | Clone repo |

### Branching
| Command | Description |
|---------|-------------|
| `git branch` | List branches |
| `git checkout -b <name>` | Create branch |
| `git checkout <name>` | Switch branch |
| `git merge <branch>` | Merge branch |
| `git rebase` | Rebase branch |

### Status & History
| Command | Description |
|---------|-------------|
| `git status` | Check status |
| `git diff` | View changes |
| `git log` | Commit history |
| `git stash` | Save changes |