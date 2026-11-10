// Per-host element hiding. Everything global ships as static CSS (data/engine/generic-*.css);
// this resolves only what depends on the host, reading just the shards its hostname maps to.
globalThis.CosmeticEngine=(()=>{
  const A=globalThis.AdShield;
  const load=path=>fetch(chrome.runtime.getURL(path)).then(response=>response.json());
  let metaPromise;const meta=()=>metaPromise ||= load('data/engine/meta.json');
  const shards=new Map();
  function shardOf(key,count){let hash=0x811c9dc5;for(let i=0;i<key.length;i++){hash^=key.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0)%count;}
  function shard(index){
    if(shards.has(index)){const hit=shards.get(index);shards.delete(index);shards.set(index,hit);return hit;}
    const value=load(`data/engine/s/${index}.json`);shards.set(index,value);
    if(shards.size>32)shards.delete(shards.keys().next().value);
    return value;
  }
  // Every list key a hostname can match: its parent domains plus entity forms such as example.*.
  function hostKeys(host){
    const keys=host.split('.').map((_,i,labels)=>labels.slice(i).join('.'));
    const entity=A.entityFor(host);
    if(entity)for(const key of entity.split('.').map((_,i,labels)=>labels.slice(i).join('.')))keys.push(key+'.*');
    return keys;
  }
  const inScope=(host,exclude)=>!exclude.length || !A.isListed(host,exclude);
  async function records(host){
    const {shards:count}=await meta();const keys=hostKeys(host);
    const loaded=await Promise.all(keys.map(key=>shard(shardOf(key,count))));
    return keys.flatMap((key,i)=>loaded[i][key] || []);
  }
  async function resolve(host,enabled,extended={}){
    const data=await meta();const found=await records(host);
    const lists=data.lists.filter(id=>enabled[id]);const cancelled=new Set(lists.flatMap(id=>data.cancelled[id]));
    let generic=false,specific=false;const exceptions=new Set();
    const applyOff=off=>{
      if(cancelled.has(off.key) || (off.host && !A.isListed(host,[off.host])) || (off.include.length && !A.isListed(host,off.include)) || !inScope(host,off.exclude))return;
      generic ||= off.generic ?? true;specific ||= off.specific ?? !!off.all;
    };
    for(const id of lists){
      data.globalOff[id].forEach(applyOff);
      for(const entry of data.globalExceptions[id])if(inScope(host,entry.exclude))exceptions.add(entry.selector);
      for(const entry of extended[id]?.entries || [])if(entry.exception && extendedMatches(host,entry))exceptions.add(entry.selector);
    }
    for(const record of found){
      if(!enabled[record[0]])continue;
      if(record[1]===2)applyOff(record[2]);
      else if(record[1]===1 && inScope(host,record[3]))exceptions.add(record[2]);
    }
    const scoped=new Set();
    if(!specific)for(const record of found)if(record[1]===0 && enabled[record[0]] && inScope(host,record[3]) && !exceptions.has(record[2]))scoped.add(record[2]);
    const selectors=new Set(scoped);
    if(!generic)for(const id of [...lists,'base'])for(const entry of data.conditional[id])if(inScope(host,entry.exclude) && !exceptions.has(entry.selector))selectors.add(entry.selector);
    return {generic,specific,exceptions,selectors,scoped};
  }
  function extendedMatches(host,entry){return (!entry.include.length || A.isListed(host,entry.include)) && !A.isListed(host,entry.exclude);}
  function extendedSelectors(host,extended,enabled,selection){
    const result=new Set();
    for(const [id,data] of Object.entries(extended))if(enabled[id])for(const entry of data.entries){
      if(!entry.exception && extendedMatches(host,entry) && !(entry.include.length?selection.specific:selection.generic) && !selection.exceptions.has(entry.selector))result.add(entry.selector);
    }
    return [...result];
  }
  // selector:style(declarations) rules for this host: [selector, declarations] pairs.
  function styleRules(host,extended,enabled,selection){
    const found=new Map(),cancelled=new Set();
    for(const [id,data] of Object.entries(extended))if(enabled[id])for(const entry of data.styles || []){
      if(!extendedMatches(host,entry))continue;const key=entry.selector+'\n'+entry.style;
      if(entry.exception)cancelled.add(key);else found.set(key,[entry.selector,entry.style]);
    }
    if(selection.specific)return [];
    return [...found].filter(([key])=>!cancelled.has(key)).map(([,pair])=>pair);
  }
  // Files that hold the global selectors for the enabled lists.
  async function genericFiles(enabled){const {lists}=await meta();return ['data/engine/generic-base.css',...lists.filter(id=>enabled[id]).map(id=>`data/engine/generic-${id}.css`)];}
  return {hostKeys,resolve,extendedSelectors,styleRules,genericFiles,meta};
})();
