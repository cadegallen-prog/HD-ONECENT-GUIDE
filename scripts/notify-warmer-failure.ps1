# Show a Windows toast notification when the staging warmer fails.
# This typically means the Scouter Pro cookie has expired.

$title = "PennyCentral: Staging Warmer Failed"
$message = "The Scouter Pro cookie likely expired. Update PENNY_RAW_COOKIE in .env.local and run: npm run warm:staging"

# Use BurntToast if available (nicer notifications), otherwise fall back to BalloonTip
$hasBurntToast = Get-Module -ListAvailable -Name BurntToast -ErrorAction SilentlyContinue

if ($hasBurntToast) {
    Import-Module BurntToast
    New-BurntToastNotification -Text $title, $message -AppLogo $null
} else {
    # Fallback: system tray balloon notification
    Add-Type -AssemblyName System.Windows.Forms
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Warning
    $notify.BalloonTipTitle = $title
    $notify.BalloonTipText = $message
    $notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Error
    $notify.Visible = $true
    $notify.ShowBalloonTip(15000)

    # Keep alive long enough for the notification to display
    Start-Sleep -Seconds 20
    $notify.Dispose()
}
