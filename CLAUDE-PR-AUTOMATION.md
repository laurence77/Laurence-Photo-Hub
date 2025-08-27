# Claude PR Automation Guide

Automatically work on Pull Requests using Claude Code CLI.

## Quick Start

### 1. Working on Any PR
```bash
# Method 1: Using npm scripts
npm run pr:checkout 123        # Checkout PR #123
npm run pr:complete 123        # Full automation (review + fix + test + docs)

# Method 2: Using script directly  
./scripts/claude-pr.sh checkout 123
./scripts/claude-pr.sh complete 123

# Method 3: Manual Claude commands
gh pr checkout 123
claude "review this PR and fix all issues"
```

## Available Commands

### `pr:checkout <pr-number>`
- Fetches and checks out the PR branch locally
- Uses GitHub CLI to get the latest changes

### `pr:review <pr-number>` 
- Claude reviews the PR thoroughly
- Checks code quality, security, performance
- Provides specific improvement suggestions

### `pr:fix <pr-number>`
- Automatically fixes common issues:
  - TypeScript errors
  - Linting problems  
  - Security vulnerabilities
  - Performance optimizations

### `pr:test <pr-number>`
- Adds comprehensive test coverage
- Creates unit and integration tests
- Follows existing test patterns

### `pr:docs <pr-number>`
- Updates documentation
- Adds JSDoc comments
- Updates README if needed

### `pr:complete <pr-number>`
- Runs all steps automatically:
  - Review → Fix → Test → Docs
- One-command solution for PR work

## Example Workflow

### Working on PR #45
```bash
# 1. Checkout the PR
npm run pr:checkout 45

# 2. Let Claude review and fix everything
npm run pr:complete 45

# 3. Review Claude's changes
git diff

# 4. Commit the improvements
git add .
git commit -m "Claude: Fix issues and add tests for PR #45"
git push

# 5. The PR is now ready for review!
```

## Advanced Usage

### Custom Claude Commands
```bash
# Review specific files
claude "review the auth.ts file and check for security issues"

# Implement specific feedback
claude "implement the changes requested by the reviewer in comment #3"

# Add specific features
claude "add error handling to the payment processing function"

# Optimize performance
claude "optimize this component for better rendering performance"
```

### Working with Draft PRs
```bash
# Checkout draft PR
gh pr checkout 67

# Make it ready for review
claude "complete this draft PR by adding tests, docs, and fixing any issues"

# Mark as ready
gh pr ready 67
```

## Integration with GitHub

### Prerequisites
- Install GitHub CLI: `brew install gh` (macOS) or download from https://cli.github.com/
- Authenticate: `gh auth login`
- Install Claude Code (you already have this!)

### Repository Setup
The automation is already set up in this repository with:
- ✅ Helper scripts in `scripts/claude-pr.sh`
- ✅ npm commands in `package.json`
- ✅ GitHub Actions workflow for notifications

## Tips for Best Results

### 1. Be Specific with Claude
```bash
# Good
claude "fix the TypeScript errors in the UserProfile component and add proper type definitions"

# Better  
claude "the UserProfile component has these issues: missing props interface, any types, and no error handling. Please fix these specific problems"
```

### 2. Work Incrementally
```bash
# Instead of one big command, break it down:
npm run pr:review 123    # Review first
npm run pr:fix 123       # Then fix
npm run pr:test 123      # Add tests
npm run pr:docs 123      # Finally document
```

### 3. Review Claude's Changes
Always review what Claude changed before pushing:
```bash
git diff                 # See all changes
git add -p               # Stage changes selectively
```

## Troubleshooting

### Script Permission Issues
```bash
chmod +x ./scripts/claude-pr.sh
```

### GitHub CLI Not Authenticated
```bash
gh auth login
gh auth status
```

### Claude Not Found
Make sure Claude Code is in your PATH or use the full path to claude.

## Examples of What Claude Can Do

- **Fix bugs** automatically
- **Add comprehensive tests** with proper edge cases  
- **Improve TypeScript types** and eliminate any types
- **Add JSDoc documentation** to all functions
- **Optimize React components** for performance
- **Fix security vulnerabilities** 
- **Update README** and documentation
- **Implement reviewer feedback** from PR comments

---

**Ready to automate your PR workflow!** 🚀

Try it out:
```bash
npm run pr:complete [PR_NUMBER]
```