$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$generator = Join-Path $scriptRoot "seo_audit\generate_audit.py"
$requirements = Join-Path $scriptRoot "seo_audit\requirements.txt"

$checkScript = @'
modules = ["requests", "bs4", "docx", "lxml", "pypdf", "reportlab"]
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

python $generator @args
