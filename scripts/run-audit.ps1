$pages = @(
    "/",
    "/store-finder",
    "/guide",
    "/report-find",
    "/about",
    "/cashback"
)

$printBaseUrl = Join-Path $PSScriptRoot "print-base-url.js"
$baseUrl = (node $printBaseUrl).TrimEnd("/")
$outputDir = "test-results"

$lighthouseCli = Join-Path $PSScriptRoot "..\node_modules\lighthouse\cli\index.js"
if (!(Test-Path $lighthouseCli)) {
    throw "Local Lighthouse CLI not found at $lighthouseCli. Run npm ci / npm install first."
}

# Ensure output directory exists
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir
}

foreach ($page in $pages) {
    $name = $page -replace "/", ""
    if ($name -eq "") { $name = "home" }
    
    $url = "$baseUrl$page"
    
    Write-Host "Auditing $url..."

    # Mobile
    $mobileOutput = "$outputDir/lighthouse-$name-mobile.json"
    Write-Host "  Running Mobile Audit -> $mobileOutput"
    node $lighthouseCli $url --output json --output-path $mobileOutput --form-factor mobile --chrome-flags="--headless"

    # Desktop
    $desktopOutput = "$outputDir/lighthouse-$name-desktop.json"
    Write-Host "  Running Desktop Audit -> $desktopOutput"
    node $lighthouseCli $url --output json --output-path $desktopOutput --preset desktop --form-factor desktop --chrome-flags="--headless"
}
