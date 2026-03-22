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
import shutil
try:
    with sync_playwright() as p:
        executable_path = (
            shutil.which("chromium")
            or shutil.which("chromium-browser")
            or shutil.which("google-chrome")
            or shutil.which("google-chrome-stable")
        )
        kwargs = {"headless": True}
        if executable_path:
            kwargs["executable_path"] = executable_path
        browser = p.chromium.launch(**kwargs)
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
