$task = Get-ScheduledTask -TaskName 'PennyCentral-AnalyticsDelta' -ErrorAction SilentlyContinue
if ($task) {
    $settings = $task.Settings
    $settings.StartWhenAvailable = $true
    Set-ScheduledTask -TaskName 'PennyCentral-AnalyticsDelta' -Settings $settings
    Write-Host "Updated: StartWhenAvailable = true (catches up if PC was off)"
} else {
    Write-Host "Task not found. Create it first with schtasks."
}
