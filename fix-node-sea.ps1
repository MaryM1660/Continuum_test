# Исправление проблемы с node:sea на Windows
$file = Get-ChildItem -Path "node_modules" -Recurse -Filter "externals.ts" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($file) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'node:sea') {
        $content = $content -replace 'node:sea', 'node_sea'
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✓ Файл исправлен: $($file.FullName)" -ForegroundColor Green
    } else {
        Write-Host "Файл не содержит node:sea" -ForegroundColor Yellow
    }
} else {
    Write-Host "Файл externals.ts не найден" -ForegroundColor Red
}

