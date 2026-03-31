const services=[{name:'gateway',port:8000},{name:'auth',port:8001},{name:'reservation',port:8002},{name:'guest',port:8003},{name:'restaurant',port:8004},{name:'billing',port:8005}];
(async()=>{
  for(const s of services){
    process.stdout.write(`\n=== ${s.name} (${s.port}) === `);
    try{const h=await fetch(`http://localhost:${s.port}/health`);process.stdout.write('health '+h.status);}catch(e){process.stdout.write('health fail '+e.message);}    
    process.stdout.write(' | ');
    try{const d=await fetch(`http://localhost:${s.port}/api-docs`);process.stdout.write('api-docs '+d.status+' len:'+ (await d.text()).length);}catch(e){process.stdout.write('api-docs fail '+e.message);}    
  }
  console.log('');
})();
