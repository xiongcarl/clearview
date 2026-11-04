// The sharded engine must select exactly what a full walk of data/web-cosmetics.json selects.
import {readFile} from 'node:fs/promises';import vm from 'node:vm';
const root=new URL('../',import.meta.url);const read=p=>readFile(new URL(p,root),'utf8');
const context=vm.createContext({URL,console,chrome:{runtime:{getURL:p=>p}},fetch:async p=>({json:async()=>JSON.parse(await read(p))})});
context.globalThis=context;
for(const file of ['vendor/publicsuffix.js','common.js','web-filtering.js','cosmetic-engine.js'])vm.runInContext(await read(file),context);
const {AdShield:A,WebFiltering:W,CosmeticEngine:E}=context;
const db=JSON.parse(await read('data/web-cosmetics.json'));const ext=JSON.parse(await read('data/extended-cosmetics.json'));const base=JSON.parse(await read('data/builtin-cosmetics.json'));const coverage=JSON.parse(await read('data/local-coverage.json'));
const generic={};for(const id of [...Object.keys(db),'base'])generic[id]=(await read(`data/engine/generic-${id}.css`)).split('\n').filter(Boolean).map(x=>x.slice(0,-'{display:none!important}'.length));
const hosts=new Set(['example.com','news.example.tw','www.google.com','a.b.c.co.uk','localhost.test']);
const expand=key=>key.endsWith('.*')?[key.slice(0,-2)+'.com',key.slice(0,-2)+'.co.uk','www.'+key.slice(0,-2)+'.net']:[key,'sub.'+key];
const pick=(list,step)=>list.filter((_,i)=>i%step===0);
for(const id of Object.keys(db)){
  const keys=new Set();for(const e of db[id].entries)for(const k of [...e.include,...e.exclude])keys.add(k);for(const o of db[id].genericOff || [])for(const k of [o.host,...(o.include || []),...(o.exclude || [])])if(k)keys.add(k);
  for(const k of pick([...keys],Number(process.env.STEP || 15)))expand(k).forEach(h=>hosts.add(h));
  for(const o of db[id].genericOff || [])for(const k of [o.host,...(o.include || [])])if(k)expand(k).forEach(h=>hosts.add(h));
}
const variants=[{easylist:true,easyprivacy:true,chinese:true,annoyances:false,fixes:true},{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true},{easylist:false,easyprivacy:false,chinese:true,annoyances:false,fixes:false}];
const same=(a,b)=>a.size===b.size && [...a].every(x=>b.has(x));
let checked=0,offHosts=0;
for(const enabled of variants){
  const staticSet=new Set([...generic.base,...Object.keys(db).filter(id=>enabled[id]).flatMap(id=>generic[id])]);
  for(const host of hosts){
    if(!A.validDomain(host))continue;
    const selection=W.policy(host,db,enabled,ext);
    const permitted=s=>!selection.generic && !selection.exceptions.has(s);
    const old=new Set([...W.cosmeticSelectors(host,db,enabled,selection),...base.filter(permitted),...(enabled.easylist?coverage.cosmetic.filter(g=>!g.hosts.length).flatMap(g=>g.selectors).filter(permitted):[])]);
    const now=await E.resolve(host,enabled,ext);
    if(now.generic!==selection.generic || now.specific!==selection.specific)throw new Error(`policy differs on ${host}: ${now.generic}/${now.specific} vs ${selection.generic}/${selection.specific}`);
    const actual=new Set(now.selectors);if(!selection.generic)for(const s of staticSet)actual.add(s);else offHosts++;
    // Static CSS is global, so a selector it holds must not be excepted on any host.
    if(!selection.generic)for(const s of selection.exceptions)if(staticSet.has(s))throw new Error(`excepted selector is static on ${host}: ${s}`);
    if(!same(old,actual)){const miss=[...old].filter(x=>!actual.has(x)).slice(0,5),extra=[...actual].filter(x=>!old.has(x)).slice(0,5);throw new Error(`selectors differ on ${host}: missing ${JSON.stringify(miss)} extra ${JSON.stringify(extra)}`);}
    const oldComponent=new Set(W.cosmeticSelectors(host,db,enabled,selection,true));
    if(!same(oldComponent,now.scoped))throw new Error(`component selectors differ on ${host}`);
    const oldExt=new Set(W.extendedSelectors(host,ext,enabled,selection));const newExt=new Set(E.extendedSelectors(host,ext,enabled,now));
    if(!same(oldExt,newExt))throw new Error(`extended differs on ${host}`);
    checked++;
  }
}
console.log(`engine matches the full walk on ${checked} host/list combinations (${offHosts} with generic hiding off).`);
