# GitHub Push Command

Commit all changes and push to the remote repository.

## Instructions

1. First, run `git status` to see all changes
2. Run `git diff` to review the changes being committed
3. Stage all changes with `git add .`
4. Create a commit with a descriptive message based on the changes:
   - Use conventional commit format: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Keep the message concise but descriptive
5. Push to the current branch with `git push`

## Commit Message Format
```
type(scope): short description

- Detailed bullet point 1
- Detailed bullet point 2
```

## Example
```
feat(auth): add login and register pages

- Implement login form with validation
- Implement register form with validation
- Add mock API endpoints for authentication
```

If the push fails due to remote changes, pull first with `git pull --rebase` then push again.

$ARGUMENTS
