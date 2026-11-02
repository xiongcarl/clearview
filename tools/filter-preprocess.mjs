// Compile the Chromium desktop / MV3 branch, never both sides of a conditional.
export function preprocess(text,includes={},depth=0){
  if(depth>5)throw new Error("Too many filter includes");
  const capabilities={env_chromium:true,env_firefox:false,env_safari:false,env_mobile:false,ext_ubol:true,env_mv3:true,ext_abp:false,ext_ublock:true,env_edge:false,env_opera:false,env_mobile_ios:false,cap_html_filtering:false,cap_ipaddress:false};
  const stack=[];let active=true;const lines=[];
  for(const line of text.split(/\r?\n/)){
    const condition=line.match(/^!#if\s+(!?)(\w+)\s*$/);
    if(condition){if(!(condition[2] in capabilities))throw new Error('Unknown filter capability: '+condition[2]);const value=condition[1]? !capabilities[condition[2]]:capabilities[condition[2]];stack.push({parent:active,value,elseSeen:false});active=active&&value;continue;}
    if(/^!#else\s*$/.test(line)){const top=stack.at(-1);if(!top || top.elseSeen)throw new Error('Invalid filter #else');top.elseSeen=true;active=top.parent&&!top.value;continue;}
    if(/^!#endif\s*$/.test(line)){const top=stack.pop();if(!top)throw new Error('Invalid filter #endif');active=top.parent;continue;}
    const include=line.match(/^!#include ([a-z0-9-]+\.txt)\s*$/);
    if(include){if(active){if(!(include[1] in includes))throw new Error('Missing filter include: '+include[1]);lines.push(...preprocess(includes[include[1]],includes,depth+1));}continue;}
    if(line.startsWith('!#'))throw new Error('Unsupported filter directive: '+line);
    if(active)lines.push(line);
  }
  if(stack.length)throw new Error('Unclosed filter conditional');return lines;
}
