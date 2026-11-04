// Build-time only. Turns data/web-cosmetics.json into what the runtime engine reads:
// one static CSS file per list for selectors that apply everywhere, and hostname-keyed
// shards for everything scoped to a site, so a page never needs the whole database.
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const database=await json('data/web-cosmetics.json');const extended=await json('data/extended-cosmetics.json');
const builtin=await json('data/builtin-cosmetics.json');const coverage=await json('data/local-coverage.json');
export const SHARDS=256;
const shardOf=key=>{let hash=0x811c9dc5;for(let i=0;i<key.length;i++){hash^=key.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0)%SHARDS;};
const ids=Object.keys(database);
// A selector with an exception anywhere cannot be global: the exception would have no way to undo it.
const excepted=new Set();
for(const id of ids)for(const entry of [...database[id].entries,...(extended[id]?.entries || [])])if(entry.exception)excepted.add(entry.selector);
const shards=Array.from({length:SHARDS},()=>({}));const add=(key,record)=>{(shards[shardOf(key)][key] ||= []).push(record);};
const generic={},conditional={},globalExceptions={},cancelled={},offKeys=new Set();const globalOff={};
for(const id of ids){
  const css=new Set();conditional[id]=[];globalExceptions[id]=[];cancelled[id]=[];globalOff[id]=[];
  for(const {selector,include,exclude,exception} of database[id].entries){
    if(exception){if(include.length)for(const key of include)add(key,[id,1,selector,exclude]);else globalExceptions[id].push({selector,exclude});continue;}
    if(include.length){for(const key of include)add(key,[id,0,selector,exclude]);continue;}
    if(!exclude.length && !excepted.has(selector))css.add(selector);else conditional[id].push({selector,exclude});
  }
  for(const off of database[id].genericOff || []){
    if(off.badfilter){cancelled[id].push(off.key);continue;}
    const record={key:off.key,host:off.host,include:off.include || [],exclude:off.exclude || [],generic:off.generic,specific:off.specific,all:off.all};
    const scope=off.host?[off.host]:off.include || [];
    if(!scope.length){globalOff[id].push(record);continue;}
    for(const key of scope){add(key,[id,2,record]);if(off.generic!==false)offKeys.add(key);}
  }
  generic[id]=css;
}
// Curated built-ins and host-less local coverage apply through the same split.
conditional.base=builtin.filter(selector=>excepted.has(selector)).map(selector=>({selector,exclude:[]}));
generic.base=new Set(builtin.filter(selector=>!excepted.has(selector)));
for(const group of coverage.cosmetic)if(!group.hosts.length)for(const selector of group.selectors){if(excepted.has(selector))conditional.easylist.push({selector,exclude:[]});else generic.easylist.add(selector);}
const out=new URL('data/engine/',root);await rm(new URL('s/',out),{recursive:true,force:true});await mkdir(new URL('s/',out),{recursive:true});
const counts={};
for(const [id,css] of Object.entries(generic)){counts[id]=css.size;await writeFile(new URL(`generic-${id}.css`,out),[...css].map(selector=>`${selector}{display:none!important}`).join('\n')+'\n');}
await writeFile(new URL('meta.json',out),JSON.stringify({shards:SHARDS,lists:ids,conditional,globalExceptions,globalOff,cancelled,offKeys:[...offKeys].sort()}));
for(let i=0;i<SHARDS;i++)await writeFile(new URL(`s/${i}.json`,out),JSON.stringify(shards[i]));
// Rule IDs that do anything but block; almost every rule blocks, so the rest is the default.
const actions=await json('data/web-actions.json');
await writeFile(new URL('rule-actions.json',out),JSON.stringify(Object.fromEntries(Object.entries(actions).map(([id,rules])=>[id,Object.fromEntries(Object.entries(rules).filter(([,type])=>type!=='block'))]))));
const sizes=shards.map(x=>JSON.stringify(x).length);
console.log({counts,conditional:Object.fromEntries(Object.entries(conditional).map(([k,v])=>[k,v.length])),offKeys:offKeys.size,shardMaxKB:Math.round(Math.max(...sizes)/1024),shardTotalMB:+(sizes.reduce((a,b)=>a+b)/1e6).toFixed(1)});
