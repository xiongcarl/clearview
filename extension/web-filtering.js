// Scope and exceptions apply across every enabled cosmetic source.
globalThis.WebFiltering=(()=>{
  function matches(host,entry){return (!entry.include.length || AdShield.isListed(host,entry.include)) && !AdShield.isListed(host,entry.exclude);}
  function policy(host,database,enabled,extended={}){
    const off=[],exceptions=new Set(),cancelled=new Set();
    for(const [id,data] of Object.entries(database)){
      if(!enabled[id])continue;
      for(const entry of data.genericOff || []){
        if(entry.badfilter)cancelled.add(entry.key);else off.push(entry);
      }
      for(const entry of [...data.entries,...(extended[id]?.entries || [])])if(entry.exception && matches(host,entry))exceptions.add(entry.selector);
    }
    let generic=false,specific=false;
    for(const entry of off){
      if(cancelled.has(entry.key) || (entry.host && !AdShield.isListed(host,[entry.host])) || !matches(host,{include:entry.include || [],exclude:entry.exclude || []}))continue;
      generic ||= entry.generic ?? true;specific ||= entry.specific ?? !!entry.all;
    }
    return {generic,specific,exceptions};
  }
  function permits(entry,selection){return !(entry.include.length?selection.specific:selection.generic) && !selection.exceptions.has(entry.selector);}
  function select(host,database,enabled,selection,specificOnly=false){
    const result=[];
    for(const [id,data] of Object.entries(database))if(enabled[id])for(const entry of data.entries){
      if(!entry.exception && (!specificOnly || entry.include.length) && matches(host,entry) && permits(entry,selection))result.push(entry.selector);
    }
    return [...new Set(result)];
  }
  function cosmeticSelectors(host,database,enabled,selection=policy(host,database,enabled),specificOnly=false){return select(host,database,enabled,selection,specificOnly);}
  function extendedSelectors(host,database,enabled,selection=policy(host,database,enabled)){return select(host,database,enabled,selection);}
  return {matches,policy,permits,cosmeticSelectors,extendedSelectors};
})();
