$pages = @(
    "/",
    "/store-finder",
    "/guide",
    "/trip-tracker",
    "/resources",
    "/about",
    "/cashback"
)

$baseUrl = "http://localhost:3001"
$outputDir = "test-results"

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
    npx lighthouse $url --output json --output-path $mobileOutput --form-factor mobile --chrome-flags="--headless"

    # Desktop
    $desktopOutput = "$outputDir/lighthouse-$name-desktop.json"
    Write-Host "  Running Desktop Audit -> $desktopOutput"
    npx lighthouse $url --output json --output-path $desktopOutput --preset desktop --form-factor desktop --chrome-flags="--headless"
}
