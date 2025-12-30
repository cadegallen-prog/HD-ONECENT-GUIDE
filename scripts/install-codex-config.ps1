# Install Codex config snippet into the user Codex config
# Usage: Run in PowerShell (Windows)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
$snippet = Join-Path $repoRoot '.ai\CODEX_CONFIG_SNIPPET.toml'
$codexDir = Join-Path $env:USERPROFILE '.codex'
$dest = Join-Path $codexDir 'config.toml'

if (-not (Test-Path $snippet)) {
  Write-Error "Snippet not found at $snippet"
  exit 1
}

if (-not (Test-Path $codexDir)) {
  New-Item -ItemType Directory -Path $codexDir -Force | Out-Null
}

Copy-Item -Path $snippet -Destination $dest -Force
Write-Output "Copied snippet to $dest"

# Show first 40 lines to confirm placeholders (safe) 
Write-Output "---- Begin /$dest content (first 40 lines) ----"
Get-Content $dest -TotalCount 40 | ForEach-Object { Write-Output $_ }
Write-Output "---- End preview ----"
