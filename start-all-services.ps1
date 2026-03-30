$root = 'C:\Users\ASUS\OneDrive\Documents\GitHub\hotelina-microservices-system'
$services = @('api-gateway','auth-service','billing-service','reservation-service','guest-service','restaurant-service')
foreach ($s in $services) {
  $path = Join-Path $root $s
  Start-Process powershell.exe -ArgumentList '-NoExit','-Command',"Set-Location -Path '$path'; npm install; npm run dev"
}
