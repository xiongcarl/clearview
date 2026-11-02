// Presentational navigation only; never changes protection settings.
(()=>{
  const links=[...document.querySelectorAll('.sidebar nav a')];
  const sections=links.map(link=>document.querySelector(link.hash)).filter(Boolean);
  let scheduled=false;
  function select(id){for(const link of links){if(link.hash==='#'+id){link.setAttribute('aria-current','true');link.scrollIntoView?.({block:'nearest',inline:'nearest'});}else link.removeAttribute('aria-current');}}
  function update(){scheduled=false;const offset=innerWidth<=900?110:120;let current=sections[0];for(const section of sections)if(section.getBoundingClientRect().top<=offset)current=section;if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)current=sections.at(-1);if(current)select(current.id);}
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('hashchange',schedule);update();
})();
