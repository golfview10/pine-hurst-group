# PowerShell Script to Convert JPG images to PNG
# Usage: Right-click and "Run with PowerShell"

Add-Type -AssemblyName System.Drawing

# Determine script root properly (supports ISE and Console)
$rootPath = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
Write-Host "Scanning for images in: $rootPath" -ForegroundColor Cyan

# Find all JPG/JPEG files
$files = Get-ChildItem -Path $rootPath -Recurse -Include *.jpg, *.jpeg

if ($files.Count -eq 0) {
    Write-Host "No .jpg files found." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($files.Count) files to process..." -ForegroundColor Green

foreach ($file in $files) {
    $jpgPath = $file.FullName
    $pngPath = $jpgPath -replace '\.jpe?g$', '.png'

    if (Test-Path $pngPath) {
        Write-Host "[SKIP] Duplicate found for $($file.Name). Deleting JPG..." -ForegroundColor Yellow
        try { Remove-Item $jpgPath -Force -ErrorAction Stop } catch { Write-Warning "Could not delete $jpgPath" }
        continue
    }

    try {
        Write-Host "Converting: $($file.Name)... " -NoNewline
        
        # Load Image into MemoryStream to avoid file locking on the source JPG
        $bytes = [System.IO.File]::ReadAllBytes($jpgPath)
        $ms = [System.IO.MemoryStream]::new($bytes)
        $img = [System.Drawing.Image]::FromStream($ms)

        # Save as PNG
        $img.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        Write-Host "Done." -ForegroundColor Green
    }
    catch {
        Write-Host "FAILED. Error: $_" -ForegroundColor Red
    }
    finally {
        # Cleanup Resources
        if ($img) { $img.Dispose(); $img = $null }
        if ($ms) { $ms.Dispose(); $ms = $null }
    }

    # Clean up original file after successful conversion (outside the lock)
    if (Test-Path $pngPath) {
        try {
            Remove-Item $jpgPath -Force -ErrorAction Stop
        }
        catch {
            Write-Warning "Converted but could not delete original: $($file.Name)"
        }
    }
}

Write-Host "All operations complete!" -ForegroundColor Cyan
# Small pause to see output if run from double-click, but with timeout
Start-Sleep -Seconds 2
