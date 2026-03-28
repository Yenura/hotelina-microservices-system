$root = 'C:\Users\savin\Documents\4y 2nd SEM\course work\MTIT\mtit\MTIT2\hotelina-microservices-system'
$services = @('billing-service','reservation-service','restaurant-service')
foreach ($s in $services) {
  $path = Join-Path $root $s
  Start-Process powershell.exe -ArgumentList '-NoExit','-Command',"Set-Location -Path '$path'; npm start"
}
