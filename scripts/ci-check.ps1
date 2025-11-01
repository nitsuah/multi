#!/usr/bin/env pwsh
# Run the exact same checks as CI
# This ensures you catch issues before pushing

Write-Host "🔍 Running CI checks locally..." -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

try {
    Write-Host "✓ Step 1: Type Check" -ForegroundColor Yellow
    npm run typecheck
    Write-Host "✅ Type check passed" -ForegroundColor Green
    Write-Host ""

    Write-Host "✓ Step 2: Lint" -ForegroundColor Yellow
    npm run lint
    Write-Host "✅ Lint passed" -ForegroundColor Green
    Write-Host ""

    Write-Host "✓ Step 3: Run Tests" -ForegroundColor Yellow
    npm run test:ci
    Write-Host "✅ Tests passed" -ForegroundColor Green
    Write-Host ""

    Write-Host "✓ Step 4: Build" -ForegroundColor Yellow
    npm run build
    Write-Host "✅ Build passed" -ForegroundColor Green
    Write-Host ""

    Write-Host "🎉 All CI checks passed! Safe to push." -ForegroundColor Green
    exit 0
}
catch {
    Write-Host ""
    Write-Host "❌ CI checks FAILED!" -ForegroundColor Red
    Write-Host "Fix the errors above before pushing." -ForegroundColor Red
    exit 1
}
