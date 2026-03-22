$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$generator = Join-Path $scriptRoot "seo_audit\generate_audit.py"
$requirements = Join-Path $scriptRoot "seo_audit\requirements.txt"

$checkScript = @'
modules = ["requests", "bs4", "docx", "lxml", "pypdf", "playwright"]
missing = []
for name in modules:
    try:
        __import__(name)
    except Exception:
        missing.append(name)
if missing:
    raise SystemExit(1)
'@

$checkScript | python - | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Installing Python packages for SEO audit generator..."
  python -m pip install -r $requirements
}

$browserCheck = @'
from playwright.sync_api import sync_playwright
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        browser.close()
except Exception:
    raise SystemExit(1)
'@

$browserCheck | python - | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Installing Chromium for Playwright..."
  python -m playwright install chromium
}

python $generator @args
