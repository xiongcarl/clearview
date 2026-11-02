// Build-time only. Runtime uses packaged functions; no remote code or eval bridge.
import {readFile,writeFile,readdir,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {preprocess} from './filter-preprocess.mjs';
import {compileCosmetics} from './cosmetic-compiler.mjs';
import vm from 'node:vm';
const dependency=process.env.AD_SHIELD_DEPENDENCIES;
const load=name=>import(dependency ? new URL(name+'/dist/index.js',dependency).href : name);
const {scriptlets}=await load('@adguard/scriptlets');
const {CosmeticRuleParser,QuoteUtils}=await load('@adguard/agtree');
const {convertScriptletToAdg}=await import(dependency?new URL('@adguard/scriptlets/dist/converters/index.js',dependency).href:'@adguard/scriptlets/converters');
const root=new URL('../',import.meta.url);
const context=vm.createContext({URL});vm.runInContext(await readFile(new URL('common.js',root),'utf8'),context);
const publicSuffixSource=dependency?new URL('tldts/dist/index.umd.min.js',dependency):new URL('./node_modules/tldts/dist/index.umd.min.js',import.meta.url);
await mkdir(new URL('vendor/',root),{recursive:true});
await writeFile(new URL('vendor/publicsuffix.js',root),'/* tldts 7.4.16, MIT; original sources and license in vendor/source/. */\n(()=>{const module={exports:{}};const exports=module.exports;const define=undefined;\n'+await readFile(publicSuffixSource,'utf8')+'\nglobalThis.AdShieldDomainUtils=module.exports;})();\n');
const includes={};for(const file of await readdir(new URL('data/filters/',root)))if(/^fixes-.+\.txt$/.test(file))includes[file.slice(6)]=await readFile(new URL('data/filters/'+file,root),'utf8');
const ids=['easylist','easyprivacy','chinese','annoyances','fixes'];
const plain=x=>x.length<=253 && x.split('.').every(y=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(y));
const valid=x=>plain(x) || (x.endsWith('.*') && plain(x.slice(0,-2)));
const scope=raw=>{const values=raw?raw.split(','):[];if(values.some(x=>!valid(x.replace(/^~/,''))))throw new Error('Unsupported scope');return {include:values.filter(x=>!x.startsWith('~')),exclude:values.filter(x=>x.startsWith('~')).map(x=>x.slice(1))};};
// uBO scriptlets that AdGuard Scriptlets 2.5.1 implements under another name or argument
// order. Only forms whose meaning is identical are mapped; anything else stays skipped.
function uboEquivalent(name,args){
  const pairs=rest=>{if(rest.length%2)return null;const o={};for(let i=0;i<rest.length;i+=2)o[rest[i]]=rest[i+1];return o;};
  const plain=x=>!/^(?:json|repl):/.test(x);
  switch(name){
    case 'ubo-rpnt':case 'ubo-trusted-rpnt':case 'ubo-trusted-replace-node-text':{
      // uBO: node, pattern, replacement[, 'condition', text][, 'quitAfter', n]
      const [node,pattern,replacement='',...rest]=args;const extra=pairs(rest);
      if(!node || !pattern || !extra || Object.keys(extra).some(k=>!['condition','quitAfter'].includes(k)))return null;
      return {name:'trusted-replace-node-text',args:[node,extra.condition || pattern,pattern,replacement]};
    }
    case 'ubo-trusted-replace-argument':{
      const [path,index,value,...rest]=args;const extra=pairs(rest);
      if(!path || index===undefined || value===undefined || !plain(value) || !extra || Object.keys(extra).some(k=>k!=='condition'))return null;
      return {name:'trusted-replace-argument',args:[path,index,value,...(extra.condition?[extra.condition]:[])]};
    }
    case 'ubo-trusted-set':case 'ubo-trusted-set-constant':
      return args.length<=2 && args[1]!==undefined && !/^\{\s*"value"/.test(args[1])?{name:'trusted-set-constant',args}:null;
    case 'ubo-trusted-set-cookie':return args.length>=2 && args.length<=4?{name:'trusted-set-cookie',args}:null;
    case 'ubo-trusted-set-cookie-reload':return args.length>=2 && args.length<=4?{name:'trusted-set-cookie-reload',args}:null;
    case 'ubo-trusted-set-local-storage-item':return args.length===2?{name:'trusted-set-local-storage-item',args}:null;
    case 'ubo-trusted-set-session-storage-item':return args.length===2?{name:'trusted-set-session-storage-item',args}:null;
    case 'ubo-trusted-click-element':return args.length>=1 && args.length<=3?{name:'trusted-click-element',args}:null;
    case 'ubo-trusted-set-attr':return args.length===3?{name:'trusted-set-attr',args}:null;
    case 'ubo-trusted-suppress-native-method':return args.length>=2 && args.length<=4?{name:'trusted-suppress-native-method',args}:null;
    case 'ubo-trusted-replace-outbound-text':return args.length>=2 && args.length<=3?{name:'trusted-replace-outbound-text',args}:null;
    case 'ubo-prevent-xhr':case 'ubo-trusted-prevent-xhr':return args.length===1?{name:'prevent-xhr',args}:null;
    case 'ubo-trusted-prevent-fetch':return args.length===1?{name:'prevent-fetch',args}:null;
  }
  return null;
}
const extended={};const records=[];const functions=new Map();let skippedScriptlets=0,skippedExtended=0;const skippedReasons={};
for(const id of ids){
  const text=await readFile(new URL(`data/filters/${id}.txt`,root),'utf8');
  const lines=id==='fixes'?preprocess(text,includes):text.split(/\r?\n/);const compiled=compileCosmetics(lines,context.AdShield);extended[id]=compiled.extended;skippedExtended+=compiled.unsupportedExtended;
  for(const line of lines){
    const match=line.match(/^(.*?)#(@?)(\??)#(.+)$/) || line.match(/^(.*?)#(@?)%#()(\/\/scriptlet\(.+)$/);if(!match)continue;
    const [,raw,exception,forced,selector]=match;
    if(/(?:^\+js\(|^\/\/scriptlet\()/i.test(selector)){
      if(id!=='fixes' && id!=='chinese')continue;
      try{
        const original=CosmeticRuleParser.parse(line);if(original.type!=='ScriptletInjectionRule')throw new Error('Invalid scriptlet');
        const domains=original.domains.children;const sc=scope(domains.map(x=>(x.exception?'~':'')+x.value).join(','));
        if(!sc.include.length && !exception)throw new Error('Generic scriptlets disabled');
        if(original.body.children.length===0 || original.body.children[0]?.children.length===0){if(exception)records.push({...sc,exception:true,all:true});continue;}
        for(const converted of convertScriptletToAdg(original)){
          const ast=CosmeticRuleParser.parse(converted);const args=ast.body.children[0].children.map(x=>QuoteUtils.removeQuotesAndUnescape(x.value));if(args.length!==original.body.children[0].children.length)throw new Error('Lossy argument conversion omitted');const name=args.shift();
          if(!name)throw new Error('Empty scriptlet name');
          let fn=scriptlets.getScriptletFunction(name);
          const responseAliases={'ubo-trusted-replace-xhr-response':'trusted-replace-xhr-response','ubo-trusted-replace-fetch-response':'trusted-replace-fetch-response','ubo-trusted-rpfr':'trusted-replace-fetch-response'};
          if(!fn && responseAliases[name] && args.length<=3)fn=scriptlets.getScriptletFunction(responseAliases[name]);
          let callName=name,callArgs=args;
          if(!fn){const mapped=uboEquivalent(name,args);if(mapped){fn=scriptlets.getScriptletFunction(mapped.name);callName=mapped.name;callArgs=mapped.args;}}
          if(!fn)throw new Error('Unsupported scriptlet '+name);
          const implementation=fn.name;const code=String(fn);if(functions.has(implementation) && functions.get(implementation)!==code)throw new Error('Conflicting scriptlet implementation');functions.set(implementation,code);records.push({...sc,exception:!!exception,name:callName,implementation,args:callArgs});
        }
      }catch(error){skippedScriptlets++;const reason=error.message.startsWith('Unsupported scriptlet')?'Unsupported scriptlet':error.message;skippedReasons[reason]=(skippedReasons[reason] || 0)+1;}continue;
    }

  }
}
const index={};for(let i=0;i<records.length;i++)for(const host of records[i].include){(index[host] ||= []).push(i);}
const exceptions=records.filter(x=>x.exception);
const main=`/* AdGuard Scriptlets 2.5.1 and Ad Shield. GPL v3; sources in vendor/source/. */\n(()=>{\n'use strict';\nconst host=location.hostname.toLowerCase().replace(/\\.$/,'');\nconst index=${JSON.stringify(index)};\nconst suffix=globalThis.AdShieldDomainUtils.getPublicSuffix(host,{allowPrivateDomains:false}) || '';\nconst entity=suffix && host.length>suffix.length?host.slice(0,-suffix.length-1):'';\nconst keys=[...host.split('.').map((_,i,a)=>a.slice(i).join('.')),...(entity?entity.split('.').map((_,i,a)=>a.slice(i).join('.')+'.*'):[])];\nconst candidates=[...new Set(keys.flatMap(key=>index[key] || []))];\nif(!candidates.length || globalThis.__adShieldAdvancedApplied)return;\nObject.defineProperty(globalThis,'__adShieldAdvancedApplied',{value:true});\nconst records=${JSON.stringify(records)};\nconst exceptions=${JSON.stringify(exceptions)};\nconst listed=x=>x.endsWith('.*')?(entity===x.slice(0,-2) || entity.endsWith('.'+x.slice(0,-2))):(host===x || host.endsWith('.'+x));\nconst matches=entry=>(!entry.include.length || entry.include.some(listed)) && !entry.exclude.some(listed);\nconst excluded=exceptions.filter(matches);\nconst implementations={${[...functions].map(([name,fn])=>JSON.stringify(name)+':'+fn).join(',\n')}};\nconst seen=new Set();\nfor(const i of candidates){const entry=records[i];if(entry.exception || !matches(entry))continue;const key=JSON.stringify([entry.implementation,entry.args]);if(seen.has(key) || excluded.some(x=>x.all || (x.implementation===entry.implementation && JSON.stringify(x.args)===JSON.stringify(entry.args))))continue;seen.add(key);try{implementations[entry.implementation]({name:entry.name,args:entry.args,engine:'extension',version:'2.5.1',verbose:false,domainName:host,uniqueId:'ad-shield-4'},entry.args);}catch(error){console.debug('Ad Shield site fix:',entry.name,error.message);}}\n})();\n`;
await writeFile(new URL('advanced-main.js',root),main);
await writeFile(new URL('data/scriptlet-hosts.json',root),JSON.stringify(Object.keys(index).sort())+'\n');
await writeFile(new URL('data/extended-cosmetics.json',root),JSON.stringify(extended)+'\n');
const meta={source:'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',sha256:createHash('sha256').update((await readFile(new URL('data/filters/fixes.txt',root),'utf8'))+JSON.stringify(Object.entries(includes).sort())).digest('hex'),scriptletRules:records.filter(x=>!x.exception).length,scriptletExceptions:exceptions.length,scriptletImplementations:functions.size,skippedScriptlets,skippedReasons,extendedRules:Object.values(extended).reduce((n,x)=>n+x.entries.filter(e=>!e.exception).length,0),skippedExtended};
await writeFile(new URL('data/advanced-meta.json',root),JSON.stringify(meta)+'\n');
console.log(meta);
