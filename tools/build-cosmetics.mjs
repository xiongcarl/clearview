// Rebuild cosmetics from bundled snapshots without downloading or changing network rules.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
import {preprocess} from './filter-preprocess.mjs';
import {compileCosmetics} from './cosmetic-compiler.mjs';
const root=new URL('../',import.meta.url),ctx=vm.createContext({URL});
vm.runInContext(await readFile(new URL('common.js',root),'utf8'),ctx);
const includes={};for(const file of await readdir(new URL('data/filters/',root)))if(/^fixes-.+\.txt$/.test(file))includes[file.slice(6)]=await readFile(new URL('data/filters/'+file,root),'utf8');
const ordinary={},extended={},report=[];
for(const id of ['easylist','easyprivacy','chinese','annoyances','fixes']){
  const raw=await readFile(new URL(`data/filters/${id}.txt`,root),'utf8');
  const result=compileCosmetics(id==='fixes'?preprocess(raw,includes):raw.split(/\r?\n/),ctx.AdShield);
  ordinary[id]=result.ordinary;extended[id]=result.extended;
  report.push({id,cosmeticRules:result.ordinary.entries.filter(x=>!x.exception).length,cosmeticExceptions:result.ordinary.entries.filter(x=>x.exception).length,extendedRules:result.extended.entries.filter(x=>!x.exception).length,hidingExceptions:result.ordinary.genericOff.filter(x=>!x.badfilter).length,hidingCancellations:result.ordinary.genericOff.filter(x=>x.badfilter).length,unsupportedCosmetic:result.unsupportedCosmetic,unsupportedExtended:result.unsupportedExtended,unsupportedExceptions:result.unsupportedExceptions});
}
await writeFile(new URL('data/web-cosmetics.json',root),JSON.stringify(ordinary)+'\n');
await writeFile(new URL('data/extended-cosmetics.json',root),JSON.stringify(extended)+'\n');
await writeFile(new URL('data/cosmetic-meta.json',root),JSON.stringify(report,null,2)+'\n');
const meta=JSON.parse(await readFile(new URL('data/web-meta.json',root),'utf8'));
for(const item of meta){const r=report.find(x=>x.id===item.id);Object.assign(item,{cosmeticRules:r.cosmeticRules,cosmeticExceptions:r.cosmeticExceptions,unsupportedCosmetic:r.unsupportedCosmetic});}
await writeFile(new URL('data/web-meta.json',root),JSON.stringify(meta)+'\n');
const advanced=JSON.parse(await readFile(new URL('data/advanced-meta.json',root),'utf8'));
advanced.extendedRules=report.reduce((n,x)=>n+x.extendedRules,0);advanced.skippedExtended=report.reduce((n,x)=>n+x.unsupportedExtended,0);
await writeFile(new URL('data/advanced-meta.json',root),JSON.stringify(advanced)+'\n');
console.log(JSON.stringify(report,null,2));
