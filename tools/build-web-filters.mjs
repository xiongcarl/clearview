// Reproducible build. Install pinned dependencies from tools/package.json first.
import {readFile,writeFile,readdir,mkdir,copyFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import {cancellationPolicy} from './badfilter-policy.mjs';
import {protectHeadRequests} from './redirect-policy.mjs';
import {createHash} from 'node:crypto';
import {preprocess} from './filter-preprocess.mjs';
import {compileCosmetics} from './cosmetic-compiler.mjs';
import {configureNodeRegexValidator} from './node-regex-validator.mjs';
import {normalizeNetworkAliases} from './network-aliases.mjs';
await configureNodeRegexValidator();
const {FilterConverter,Filter,Rule}=await import(process.env.AD_SHIELD_CONVERTER || '@adguard/dnr-converter');
const root=new URL('../extension/',import.meta.url);
const dependency=process.env.AD_SHIELD_DEPENDENCIES;
const redirectSource=dependency?new URL('@adguard/scriptlets/dist/redirect-files/',dependency):new URL('./node_modules/@adguard/scriptlets/dist/redirect-files/',import.meta.url);
const redirectFiles=new Set(await readdir(redirectSource));
await mkdir(new URL('vendor/redirects/',root),{recursive:true});
const includes={};for(const file of await readdir(new URL('data/filters/',root)))if(/^fixes-.+\.txt$/.test(file))includes[file.slice(6)]=await readFile(new URL('data/filters/'+file,root),'utf8');
const ctx=vm.createContext({URL});vm.runInContext(await readFile(new URL('common.js',root),'utf8'),ctx);
const A=ctx.AdShield;
const definitions=[['easylist','EasyList','https://easylist.to/easylist/easylist.txt'],['easyprivacy','EasyPrivacy','https://easylist.to/easylist/easyprivacy.txt'],['chinese','AdGuard Chinese (incl. EasyList China)','https://filters.adtidy.org/extension/chromium/filters/224.txt'],['annoyances','Fanboy Annoyances','https://easylist-downloads.adblockplus.org/fanboy-annoyance.txt'],['fixes','uAssets site fixes','https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt']];
// Navigation is allowed at priority 1000 (common.js) so clicked links, mail redirects and
// sign-in flows never break. Domain-only $popup/$document rules name whole ad networks
// (popunders, malvertising), so lift them above that allow; path patterns stay below it.
const POPUP_BOOST=1000;
// Applied after protectHeadRequests, which re-ranks priorities into 100+2n.
const isPopupNetwork=rule=>!!rule.condition.resourceTypes?.includes('main_frame') && !rule.condition.regexFilter && /^\|\|[a-z0-9*-]+(?:\.[a-z0-9*-]+)+\^?$/.test(rule.condition.urlFilter || '');
const popupIds={};
const report=[];const cosmetics={};const actions={};const allRules={};const provenance=[];
await mkdir(new URL('data/web-rules/',root),{recursive:true});
for(let index=0;index<definitions.length;index++){
  const [id,name,source]=definitions[index];const text=await readFile(new URL(`data/filters/${id}.txt`,root),'utf8');
  if(!text.startsWith('[Adblock') && !(id==='fixes' && text.startsWith('! Title: uBlock filters')) && !(id==='chinese' && text.includes('! Title: AdGuard Chinese filter')))throw new Error('Invalid source: '+id);
  const lines=id==='fixes'?preprocess(text,includes):text.split(/\r?\n/);const network=lines.filter(x=>x && !/^[!\[]/.test(x) && !/#(?:#|@#|\?#|\$#|%#)/.test(x));
  const normalizedNetwork=network.map(normalizeNetworkAliases);
  const [{ruleset,errors,limitations}]=await new FilterConverter().convert([new Filter(index+1,normalizedNetwork.join('\n'))],{maxNumberOfRules:200000,maxNumberOfRegexpRules:250,maxNumberOfUnsafeRules:5000,resourcesPath:'/vendor/redirects',withSourceMap:true});
  if(errors.some(error=>error.reason?.includes('chrome.declarativeNetRequest is not available')))throw new Error('Missing Node regex validation; refusing an incomplete build');
  let unsupportedActions=0;let rules=(await ruleset.getDeclarativeRules()).filter(rule=>{if(['block','allow','allowAllRequests','upgradeScheme'].includes(rule.action.type))return true;if(rule.action.type==='redirect' && rule.action.redirect?.extensionPath?.startsWith('/vendor/redirects/') && redirectFiles.has(rule.action.redirect.extensionPath.slice('/vendor/redirects/'.length)))return true;unsupportedActions++;return false;});
  for(const file of new Set(rules.filter(x=>x.action.type==='redirect').map(x=>x.action.redirect.extensionPath.slice('/vendor/redirects/'.length))))await copyFile(new URL(file,redirectSource),new URL('vendor/redirects/'+file,root));
  provenance.push({id,ruleset,idMap:new Map(rules.map((rule,i)=>[rule.id,i+1])),headParents:new Map(),directParents:new Map()});
  rules=rules.map((rule,i)=>({...rule,id:i+1}));popupIds[id]=new Set(rules.filter(isPopupNetwork).map(x=>x.id));allRules[id]=rules;
  await writeFile(new URL(`data/web-rules/${id}.json`,root),JSON.stringify(rules)+'\n');
  actions[id]=Object.fromEntries(rules.map(x=>[x.id,x.action.type]));
  const compiled=compileCosmetics(lines,A);
  const entries=compiled.ordinary.entries,unsupportedCosmetic=compiled.unsupportedCosmetic;
  cosmetics[id]=compiled.ordinary;
  const meta={id,name,source,version:id==='fixes'?'sha256:'+createHash('sha256').update(text+JSON.stringify(Object.entries(includes).sort())).digest('hex').slice(0,12):text.match(/^! Version:\s*(.+)$/m)?.[1] || text.match(/^! Last modified:\s*(.+)$/m)?.[1] || 'bundled',networkRules:rules.length,redirectRules:rules.filter(x=>x.action.type==='redirect').length,unsupportedActions,cosmeticRules:entries.filter(x=>!x.exception).length,cosmeticExceptions:entries.filter(x=>x.exception).length,conversionErrors:errors.length,limitations:limitations.length,unsupportedCosmetic};
  report.push(meta);
}
const priorities=[...new Set(Object.values(allRules).flatMap(rules=>rules.map(rule=>rule.priority || 1)))].sort((a,b)=>a-b);
for(const [id,rules] of Object.entries(allRules)){
  const protectedSet=protectHeadRequests(rules,priorities);
  protectedSet.rules=protectedSet.rules.map(rule=>popupIds[id].has(rule.id)?{...rule,priority:rule.priority+POPUP_BOOST}:rule);
  const source=provenance.find(x=>x.id===id);
  source.headParents=protectedSet.headParents;
  await writeFile(new URL(`data/web-rules/${id}.json`,root),JSON.stringify(protectedSet.rules)+'\n');
  actions[id]=Object.fromEntries(protectedSet.rules.map(x=>[x.id,x.action.type]));
  if(id!=='annoyances'){protectedSet.rules.filter(x=>x.action.type==='redirect').forEach((x,i)=>source.directParents.set(x.id,i+1));const direct=protectedSet.rules.filter(x=>x.action.type==='redirect').map((x,i)=>({...x,id:i+1,priority:x.priority+1,action:{type:'block'}}));await writeFile(new URL(`data/web-rules/direct-${id}.json`,root),JSON.stringify(direct)+'\n');}
  const meta=report.find(x=>x.id===id);meta.networkRules=protectedSet.rules.length;meta.headBlockRules=protectedSet.headBlockRules;console.log(JSON.stringify(meta));
}
await writeFile(new URL('data/web-meta.json',root),JSON.stringify(report)+'\n');
await writeFile(new URL('data/web-cosmetics.json',root),JSON.stringify(cosmetics)+'\n');
await writeFile(new URL('data/web-actions.json',root),JSON.stringify(actions)+'\n');

await writeFile(new URL('data/badfilter-policy.json',root),JSON.stringify(await cancellationPolicy(provenance,Rule))+'\n');
