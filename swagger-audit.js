const services = [
  {name:'api-gateway', path:'api-gateway/src/config/swagger.js'},
  {name:'auth-service', path:'auth-service/src/config/swagger.js'},
  {name:'reservation-service', path:'reservation-service/src/config/swagger.js'},
  {name:'guest-service', path:'guest-service/src/config/swagger.js'},
  {name:'billing-service', path:'billing-service/src/config/swagger.js'},
  {name:'restaurant-service', path:'restaurant-service/src/app.js'},
];

for (const s of services) {
  try {
    const mod = require(`./${s.path}`);
    let spec = mod;
    if (typeof spec === 'function') spec = spec();
    const paths = spec?.paths ? Object.keys(spec.paths) : [];
    console.log(`${s.name}: swagger config loaded, paths:${paths.length}`);
    if (paths.length>0) console.log('  first path:', paths[0]);
  } catch (e) {
    console.error(`${s.name}: error loading swagger config:`, e.message);
  }
}
