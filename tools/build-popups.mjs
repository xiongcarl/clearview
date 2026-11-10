// Build-time only. Collects the lists' $popup rules into data/engine/popups.json.
// declarativeNetRequest cannot tell a popup from an ordinary navigation, so the converter
// drops these rules; the background applies them itself when a page opens a new tab.
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {preprocess} from './filter-preprocess.mjs';
const root=new URL('../extension/',import.meta.url);
const includes={};for(const file of await readdir(new URL('data/filters/',root)))if(/^fixes-.+\.txt$/.test(file))includes[file.slice(6)]=await readFile(new URL('data/filters/'+file,root),'utf8');
const plain=x=>x.length<=253 && x.split('.').every(y=>/^[a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9_])?$/.test(y));
const domain=x=>plain(x) || (x.endsWith('.*') && plain(x.slice(0,-2)));
// Resource types may sit next to popup; they describe other requests the same rule also blocks.
const TYPES=new Set(['document','doc','subdocument','frame','script','image','stylesheet','css','xmlhttprequest','xhr','other','object','media','font','ping','websocket','all','important']);
function parse(line){
  const exception=line.startsWith('@@');let body=exception?line.slice(2):line;let split;
  if(body.startsWith('/')){split=body.lastIndexOf('/$');if(split<1)return null;split+=1;}else split=body.lastIndexOf('$');
  if(split<0)return null;
  const pattern=body.slice(0,split),options=body.slice(split+1).split(',').map(x=>x.trim());
  if(!options.includes('popup'))return null;
  const rule={x:exception?1:0,tp:0,inc:[],exc:[],cs:0,bad:false};
  for(const option of options){
    if(option==='popup' || TYPES.has(option) || TYPES.has(option.replace(/^~/,'')))continue;
    if(option==='third-party' || option==='3p' || option==='~first-party' || option==='~1p')rule.tp=1;
    else if(option==='~third-party' || option==='~3p' || option==='first-party' || option==='1p')rule.tp=-1;
    else if(option==='match-case')rule.cs=1;
    else if(option==='badfilter')rule.bad=true;
    else if(/^(?:domain|from)=/.test(option)){
      for(const value of option.slice(option.indexOf('=')+1).split('|')){const name=value.replace(/^~/,'').toLowerCase();if(!domain(name))return {skip:'domain'};(value.startsWith('~')?rule.exc:rule.inc).push(name);}
    }else return {skip:option.replace(/=.*/,'')};
  }
  const host=pattern.match(/^\|\|([a-z0-9_.-]+)\^$/i);
  if(host && plain(host[1].toLowerCase()))rule.h=host[1].toLowerCase();
  else if(pattern==='' || pattern==='*')rule.r='';
  else if(/^\/.+\/$/.test(pattern)){rule.r=pattern.slice(1,-1);rule.re=1;try{new RegExp(rule.r);}catch{return {skip:'regex'};}}
  else rule.r=pattern;
  // A rule matching every popup needs a site to belong to.
  if(rule.r==='' && !rule.inc.length)return {skip:'unscoped'};
  rule.key=JSON.stringify([pattern,rule.tp,[...rule.inc].sort(),[...rule.exc].sort(),rule.x]);
  return rule;
}
const rules=[],skipped={};const cancelled=new Set();const LISTS=['easylist','easyprivacy','chinese','fixes'];
for(const id of LISTS){
  const text=await readFile(new URL(`data/filters/${id}.txt`,root),'utf8');
  for(const line of id==='fixes'?preprocess(text,includes):text.split(/\r?\n/)){
    if(!line || /^[!\[]/.test(line) || /#(?:#|@#|\?#|\$#|%#)/.test(line) || !line.includes('popup'))continue;
    const rule=parse(line.trim());if(!rule)continue;
    if(rule.skip){skipped[rule.skip]=(skipped[rule.skip] || 0)+1;continue;}
    rule.l=LISTS.indexOf(id);if(rule.bad)cancelled.add(rule.key);else rules.push(rule);
  }
}
const seen=new Set();const out=[];
for(const rule of rules){
  if(cancelled.has(rule.key) || seen.has(rule.key))continue;seen.add(rule.key);
  const entry={l:rule.l};if(rule.h)entry.h=rule.h;else{entry.r=rule.r;if(rule.re)entry.re=1;if(rule.cs)entry.cs=1;}
  if(rule.tp)entry.tp=rule.tp;if(rule.inc.length)entry.inc=rule.inc;if(rule.exc.length)entry.exc=rule.exc;if(rule.x)entry.x=1;
  out.push(entry);
}
await mkdir(new URL('data/engine/',root),{recursive:true});
await writeFile(new URL('data/engine/popups.json',root),JSON.stringify(out)+'\n');
console.log({popupRules:out.filter(x=>!x.x).length,popupExceptions:out.filter(x=>x.x).length,hostRules:out.filter(x=>x.h).length,cancelled:cancelled.size,skipped});
