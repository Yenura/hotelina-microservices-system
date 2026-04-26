$root = 'C:\Users\ASUS\OneDrive\Documents\GitHub\hotelina-microservices-system'
$services = @(
  @{name='api-gateway'; port=8000},
  @{name='auth-service'; port=8001},
  @{name='billing-service'; port=8005},
  @{name='reservation-service'; port=8002},
  @{name='guest-service'; port=8003},
  @{name='restaurant-service'; port=8004}
)

foreach ($svc in $services) {
  $s = $svc.name
  $port = $svc.port
  $path = Join-Path $root $s

  $existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "Port $port already in use; skipping $s (already running)."
    continue
  }

  Write-Host "Starting $s on port $port..."
  Start-Process powershell.exe -ArgumentList '-NoExit','-Command',"Set-Location -Path '$path'; npm install; npm run dev"
}

