$ErrorActionPreference = "Stop"

param(
  [string]$Name = "",
  [ValidateSet("html", "docx")]
  [string]$Format = "html"
)

$auditsDir = Join-Path $PSScriptRoot "..\audits"

if (-not (Test-Path $auditsDir)) {
  throw "Папка audits не найдена: $auditsDir"
}

$extension = ".$Format"

if ([string]::IsNullOrWhiteSpace($Name)) {
  $target = Get-ChildItem -Path $auditsDir -Filter "*$extension" -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
} else {
  $target = Get-ChildItem -Path $auditsDir -Filter "$Name*$extension" -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

if (-not $target) {
  throw "Не найден аудит формата $extension в папке $auditsDir"
}

Write-Host "Opening audit: $($target.FullName)"
Start-Process $target.FullName
