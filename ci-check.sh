#!/usr/bin/env bash
# Run the exact same checks as CI
# This ensures you catch issues before pushing

set -e

echo "🔍 Running CI checks locally..."
echo ""

echo "✓ Step 1: Type Check"
npm run typecheck
echo "✅ Type check passed"
echo ""

echo "✓ Step 2: Lint"
npm run lint
echo "✅ Lint passed"
echo ""

echo "✓ Step 3: Run Tests"
npm run test:ci
echo "✅ Tests passed"
echo ""

echo "✓ Step 4: Build"
npm run build
echo "✅ Build passed"
echo ""

echo "🎉 All CI checks passed! Safe to push."
