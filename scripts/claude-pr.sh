#!/bin/bash

# Claude PR Helper Script
# Usage: ./scripts/claude-pr.sh [command] [pr-number]

set -e

PR_NUMBER=$2
COMMAND=$1

case $COMMAND in
  "checkout")
    echo "🔄 Fetching PR #$PR_NUMBER..."
    gh pr checkout $PR_NUMBER
    echo "✅ Checked out PR #$PR_NUMBER"
    ;;
  
  "review")
    echo "🔍 Claude reviewing PR #$PR_NUMBER..."
    claude "Review this pull request thoroughly. Check for:
    - Code quality and best practices
    - TypeScript type safety
    - Security vulnerabilities  
    - Performance optimizations
    - Test coverage
    - Documentation
    Provide specific suggestions for improvements."
    ;;
    
  "fix")
    echo "🛠️  Claude fixing issues in PR #$PR_NUMBER..."
    claude "Fix all issues found in this pull request:
    - Resolve any linting errors
    - Fix TypeScript errors
    - Implement missing error handling
    - Add proper types where needed
    - Optimize performance issues
    - Update tests if needed"
    ;;
    
  "test")
    echo "🧪 Claude adding tests for PR #$PR_NUMBER..."
    claude "Add comprehensive tests for the changes in this PR:
    - Unit tests for new functions
    - Integration tests for new features
    - Edge case testing
    - Error handling tests
    Follow existing test patterns and ensure good coverage."
    ;;
    
  "docs")
    echo "📚 Claude updating documentation for PR #$PR_NUMBER..."
    claude "Update documentation for changes in this PR:
    - Add JSDoc comments to new functions
    - Update README if needed
    - Add code examples
    - Document any breaking changes
    - Update API documentation"
    ;;
    
  "complete")
    echo "🚀 Claude completing PR #$PR_NUMBER..."
    # Run all steps
    ./scripts/claude-pr.sh review $PR_NUMBER
    ./scripts/claude-pr.sh fix $PR_NUMBER  
    ./scripts/claude-pr.sh test $PR_NUMBER
    ./scripts/claude-pr.sh docs $PR_NUMBER
    echo "✅ PR #$PR_NUMBER is ready for review!"
    ;;
    
  *)
    echo "Usage: $0 {checkout|review|fix|test|docs|complete} [pr-number]"
    echo ""
    echo "Commands:"
    echo "  checkout  - Checkout the PR branch"
    echo "  review    - Review the PR with Claude"
    echo "  fix       - Fix issues found by Claude"
    echo "  test      - Add tests with Claude"
    echo "  docs      - Update documentation with Claude"
    echo "  complete  - Run all steps automatically"
    exit 1
    ;;
esac