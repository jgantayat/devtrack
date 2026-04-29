---
description: Sync with remote main, create a feature branch, analyze changes, and raise a pull request with a reviewed commit message and PR description.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git fetch:*), Bash(git pull:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*)
---

## Run these commands:

```
git status
git fetch origin
git diff HEAD origin/main --stat
```

## Your task:

You are about to execute a full Git workflow — from syncing the local repo with the remote `main` branch all the way to opening a Pull Request. Follow every step below **in order** and **never skip the approval gates**.

---

## Step 1 — Sync local `main` with remote

Switch to `main` and pull the latest changes from remote:

```
git checkout main
git pull origin main
```

Confirm the local `main` is now up to date before proceeding.

---

## Step 2 — Create a new feature branch

Derive a short, kebab-case branch name from the staged/unstaged changes you can already observe (e.g. `feat/add-payment-gateway`, `fix/null-pointer-login`).

```
git checkout -b <branch-name>
```

State the branch name you chose and the reasoning behind it.

---

## Step 3 — Analyze the changes

Run the following to understand what has changed:

```
git status
git diff
git diff --staged
```

Produce a structured summary:

| Category | Details |
|----------|---------|
| **New files** | List any newly created files |
| **Modified files** | List files with changes and briefly what changed |
| **Deleted files** | List any removed files |
| **Key context** | Explain the *why* — what feature, fix, or refactor do these changes represent? |

---

## Step 4 — Stage all changes

```
git add .
```

---

## Step 5 — Propose the commit message (APPROVAL GATE 1)

Using the diff analysis from Step 3, compose a commit message following the format below.

### Commit types with emojis:

Only use the following emojis:

* ✨ `feat:` — New feature
* 🐛 `fix:` — Bug fix
* 🔨 `refactor:` — Refactoring code
* 📝 `docs:` — Documentation
* 🎨 `style:` — Styling / formatting
* ✅ `test:` — Tests
* ⚡ `perf:` — Performance

### Format:

```
<emoji> <type>: <concise_description>

<optional_body_explaining_why — use present tense, explain WHY not just WHAT>
```

### Example:

```
✨ feat: add JWT-based authentication to API gateway

Replaces session-based auth to support stateless horizontal scaling.
Tokens are signed with RS256 and expire in 1 hour.
```

> ⛔ **STOP — Do NOT commit yet.**
> Present the proposed commit message to the user and ask:
> *"Does this commit message look good? Reply **yes** to commit, or suggest changes."*

Only proceed to Step 6 after the user explicitly approves.

---

## Step 6 — Commit the code

Once the user approves the commit message:

```
git commit -m "<approved commit message>"
```

Then push the feature branch to remote:

```
git push origin <branch-name>
```

---

## Step 7 — Propose the Pull Request (APPROVAL GATE 2)

Compose a PR using the structure below. Base the content on the diff analysis from Step 3 and the approved commit message.

### PR format:

```
Title:   <emoji> <type>: <same concise description as commit>

## Summary
<1–3 sentences describing what this PR does and why>

## Changes
- <bullet: new file / modified file — what changed and why>
- <bullet: ...>

## Type of Change
- [ ] ✨ New feature
- [ ] 🐛 Bug fix
- [ ] 🔨 Refactor
- [ ] 📝 Documentation
- [ ] 🎨 Style / formatting
- [ ] ✅ Tests
- [ ] ⚡ Performance

## Testing
<Describe how the changes were tested or how a reviewer can verify them>

## Notes for Reviewer
<Any context, caveats, or areas to pay special attention to>
```

> ⛔ **STOP — Do NOT create the PR yet.**
> Present the full PR title and description to the user and ask:
> *"Does this Pull Request description look good? Reply **yes** to create the PR, or suggest changes."*

Only proceed to Step 8 after the user explicitly approves.

---

## Step 8 — Create the Pull Request

Once the user approves the PR description:

```
gh pr create \
  --base main \
  --head <branch-name> \
  --title "<approved PR title>" \
  --body "<approved PR body>"
```

After creation, run:

```
gh pr view
```

Display the PR URL to the user.

---

## Output summary

After completing all steps, show a final recap:

| Step | Status |
|------|--------|
| Synced local `main` with remote | ✅ |
| Created feature branch | ✅ `<branch-name>` |
| Analyzed and staged changes | ✅ |
| Commit message approved & committed | ✅ |
| Pushed branch to remote | ✅ |
| PR description approved & PR created | ✅ |
| PR URL | `<url>` |

---

## Rules

* **Never auto-commit** — always wait for user approval at Gate 1.
* **Never auto-create a PR** — always wait for user approval at Gate 2.
* Use **present tense** in all commit messages and PR descriptions.
* Explain **why** a change was made, not just what changed.
* If `gh` CLI is not authenticated, alert the user: *"Run `gh auth login` first, then re-run this command."*