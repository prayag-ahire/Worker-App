# PowerShell script to update app icon
# This script helps you understand what needs to be done

Write-Host "=== ProWorker App Icon Update Script ===" -ForegroundColor Cyan
Write-Host ""

$sourceLogo = "src\assets\images\proworker_blue_logo_v1.png"

# Check if source logo exists
if (Test-Path $sourceLogo) {
    Write-Host "✓ Found your logo: $sourceLogo" -ForegroundColor Green
    $fileSize = (Get-Item $sourceLogo).Length / 1KB
    Write-Host "  File size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Gray
} else {
    Write-Host "✗ Logo not found at: $sourceLogo" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Current Icon Files ===" -ForegroundColor Cyan

$mipmapFolders = @(
    "android\app\src\main\res\mipmap-mdpi",
    "android\app\src\main\res\mipmap-hdpi",
    "android\app\src\main\res\mipmap-xhdpi",
    "android\app\src\main\res\mipmap-xxhdpi",
    "android\app\src\main\res\mipmap-xxxhdpi"
)

foreach ($folder in $mipmapFolders) {
    if (Test-Path $folder) {
        $launcher = Join-Path $folder "ic_launcher.png"
        if (Test-Path $launcher) {
            $size = (Get-Item $launcher).Length
            Write-Host "✓ $folder\ic_launcher.png ($size bytes)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== What You Need to Do ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "PowerShell cannot resize images without additional tools." -ForegroundColor Yellow
Write-Host "You need to use an online tool to generate properly sized icons." -ForegroundColor Yellow
Write-Host ""
Write-Host "STEPS:" -ForegroundColor White
Write-Host "1. Go to: https://icon.kitchen/" -ForegroundColor White
Write-Host "2. Upload: $sourceLogo" -ForegroundColor White
Write-Host "3. Download the generated icon pack" -ForegroundColor White
Write-Host "4. Extract and copy the mipmap-* folders to:" -ForegroundColor White
Write-Host "   android\app\src\main\res\" -ForegroundColor White
Write-Host "5. Run: adb uninstall com.workerapp" -ForegroundColor White
Write-Host "6. Run: npx react-native run-android" -ForegroundColor White
Write-Host ""
Write-Host "Alternative: Use an image editor to manually resize to these sizes:" -ForegroundColor Cyan
Write-Host "  - mipmap-mdpi: 48x48 px" -ForegroundColor Gray
Write-Host "  - mipmap-hdpi: 72x72 px" -ForegroundColor Gray
Write-Host "  - mipmap-xhdpi: 96x96 px" -ForegroundColor Gray
Write-Host "  - mipmap-xxhdpi: 144x144 px" -ForegroundColor Gray
Write-Host "  - mipmap-xxxhdpi: 192x192 px" -ForegroundColor Gray
Write-Host ""
