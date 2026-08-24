# Prepare aligned before/after pair — full 4:3 frame, no aggressive crop.
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$real = Join-Path $root "public\images\real"
$assets = Join-Path (Split-Path $root -Parent) ".cursor\projects\c-Users-ransomeware-Projects-valentin\assets"

$beforeSrc = Join-Path $assets "before-furnishing-aligned.jpg"
$afterSrc = Join-Path $assets "after-furnishing-aligned.jpg"

if (-not (Test-Path $beforeSrc)) { $beforeSrc = Join-Path $assets "before-furnishing-wide.jpg" }
if (-not (Test-Path $afterSrc)) { $afterSrc = Join-Path $assets "after-furnishing-wide.jpg" }
if (-not (Test-Path $beforeSrc)) { $beforeSrc = Join-Path $real "before-wall.png" }
if (-not (Test-Path $afterSrc)) { $afterSrc = Join-Path $real "after-furnishing.jpg" }

$outW = 2048
$outH = 1536 # 4:3 — полный кадр, без обрезки

function Export-Fit {
  param([System.Drawing.Bitmap]$Src, [int]$OutW, [int]$OutH)

  $out = New-Object System.Drawing.Bitmap $OutW, $OutH
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($Src, 0, 0, $OutW, $OutH)
  $g.Dispose()
  return $out
}

function Save-Jpeg {
  param([System.Drawing.Bitmap]$Bmp, [string]$Path, [long]$Quality = 95)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $enc = New-Object System.Drawing.Imaging.EncoderParameters 1
  $enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, $Quality)
  $Bmp.Save($Path, $codec, $enc)
  $Bmp.Dispose()
}

$before = New-Object System.Drawing.Bitmap $beforeSrc
$after = New-Object System.Drawing.Bitmap $afterSrc

$beforeOut = Export-Fit $before $outW $outH
$afterOut = Export-Fit $after $outW $outH

$beforePath = Join-Path $real "before-furnishing-v5.jpg"
$afterPath = Join-Path $real "after-furnishing-v5.jpg"

Save-Jpeg $beforeOut $beforePath 95
Save-Jpeg $afterOut $afterPath 95

Write-Host "Wrote $beforePath ($outW x $outH)"
Write-Host "Wrote $afterPath ($outW x $outH)"
