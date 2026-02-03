# Run from project root: .\scripts\setup-dev.ps1

$venvPath = ".venv"

Write-Host "Setting up isolated dev environment..." -ForegroundColor Green

# Create venv if needed
if (-Not (Test-Path $venvPath)) {
    Write-Host "Creating .venv..."
    python -m venv $venvPath
} else {
    Write-Host ".venv already exists — reusing it."
}

# Activate
& "$venvPath\Scripts\Activate.ps1"

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip

# Install pinned dev tools
Write-Host "Installing dev tools from dev-requirements.txt..." -ForegroundColor Cyan
pip install -r dev-requirements.txt

# Install pre-commit hooks (safe to re-run)
Write-Host "Installing pre-commit hooks..." -ForegroundColor Cyan
pre-commit install

Write-Host ""
Write-Host "Dev environment ready! ✅" -ForegroundColor Green
Write-Host "VS Code will auto-detect .venv — no manual activation needed." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: .\scripts\setup-dev.ps1 (from project root)"
Write-Host "  2. Ruff and pre-commit will auto-run on git commit"
Write-Host "  3. To manually run Ruff: python -m ruff format . && python -m ruff check ."
