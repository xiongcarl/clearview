// Developer maintenance command: validate and rebuild in a staging directory.
// Installed browser settings are untouched. Chrome must be reloaded afterwards.
import {readFile,writeFile,mkdtemp,cp,rm,rename,mkdir,access} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {preprocess} from './filter-preprocess.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const offline=process.argv.includes('--offline'),dryRun=process.argv.includes('--dry-run');
const dependencies=process.env.AD_SHIELD_DEPENDENCIES?new URL(process.env.AD_SHIELD_DEPENDENCIES):new URL('./node_modules/',import.meta.url);
await access(new URL('@adguard/dnr-converter/dist/index.js',dependencies)).catch(()=>{throw new Error('請先在 tools 執行 npm ci --ignore-scripts。');});
const stage=await mkdtemp(path.join(root,'.filter-stage-'));
const backup=path.join(root,'.previous-web-lists');
// uBO default companion lists. Unbreak removes known false positives; quick fixes carry
// the latest anti-adblock repairs; privacy adds tracker rules not in EasyPrivacy.
const EXTRA_FIXES=['unbreak.txt','quick-fixes.txt','privacy.txt'];
const definitions=[['easylist','https://easylist.to/easylist/easylist.txt'],['easyprivacy','https://easylist.to/easylist/easyprivacy.txt'],['chinese','https://filters.adtidy.org/extension/chromium/filters/224.txt'],['annoyances','https://easylist-downloads.adblockplus.org/fanboy-annoyance.txt'],['fixes','https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt']];
async function download(url){const response=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'error'});if(!response.ok)throw new Error('Source HTTP '+response.status);const reader=response.body.getReader();let size=0,chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>6000000){await reader.cancel();throw new Error('Source too large');}chunks.push(value);}return Buffer.concat(chunks).toString('utf8');}
const committed=[];let oldBackupMoved=false;
try{
  for(const name of ['data','vendor','common.js','tools'])await cp(path.join(root,name),path.join(stage,name),{recursive:true,filter:source=>!source.split(path.sep).some(x=>['node_modules','_metadata'].includes(x))});
  if(!offline){
    const ultimate=await download('https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/ultimate-onlydomains.txt');const previous=await readFile(path.join(root,'data/ultimate-domains.txt'),'utf8');if(ultimate.length<previous.length*0.5)throw new Error('Truncated ULTIMATE snapshot');await writeFile(path.join(stage,'data/ultimate-domains.txt'),ultimate);
    const directory=path.join(stage,'data/filters');const includes={};
    for(const [id,url] of definitions){let text=await download(url);const old=await readFile(path.join(root,'data/filters',id+'.txt'),'utf8');if(text.length<old.length*0.5 || !(id==='fixes'?text.startsWith('! Title: uBlock filters'):id==='chinese'?text.includes('! Title: AdGuard Chinese filter'):text.startsWith('[Adblock')))throw new Error('Invalid or truncated '+id);if(id==='fixes')text+='\n'+EXTRA_FIXES.map(x=>'!#include '+x).join('\n')+'\n';await writeFile(path.join(directory,id+'.txt'),text);if(id==='fixes'){
      async function resolve(text,depth=0){if(depth>5)throw new Error('Too many includes');for(const match of text.matchAll(/^!#include ([a-z0-9-]+\.txt)\s*$/gm)){const name=match[1];if(name in includes)continue;const child=await download('https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/'+name);if(child.length<50)throw new Error('Truncated include');includes[name]=child;await writeFile(path.join(directory,'fixes-'+name),child);await resolve(child,depth+1);}}
      await resolve(text);preprocess(text,includes);
    }}
  }
  const env={...process.env,AD_SHIELD_DEPENDENCIES:dependencies.href,AD_SHIELD_CONVERTER:new URL('@adguard/dnr-converter/dist/index.js',dependencies).href};
  for(const name of ['build-web-filters.mjs','build-advanced.mjs','build-enhanced.mjs','build-local-coverage.mjs','build-cosmetics.mjs']){const result=spawnSync(process.execPath,[path.join(stage,'tools',name)],{env,stdio:'inherit'});if(result.status!==0)throw new Error('Build failed: '+name);}
  const result=spawnSync(process.execPath,['--check',path.join(stage,'advanced-main.js')],{stdio:'inherit'});if(result.status!==0)throw new Error('Generated script syntax invalid');
  const meta=JSON.parse(await readFile(path.join(stage,'data/web-meta.json'),'utf8'));if(meta.length!==5 || meta.some(x=>x.networkRules<100))throw new Error('Incomplete rulesets');
  if(dryRun){console.log('重建驗證成功；原插件未變更。');}
  else{
    // Keep one previous version; all replacements stay on the same filesystem.
    await rm(backup+'.older',{recursive:true,force:true});try{await rename(backup,backup+'.older');oldBackupMoved=true;}catch(error){if(error.code!=='ENOENT')throw error;}
    await mkdir(backup,{recursive:true});
    for(const name of ['data','advanced-main.js','vendor/publicsuffix.js','vendor/redirects']){
      await mkdir(path.dirname(path.join(backup,name)),{recursive:true});await rename(path.join(root,name),path.join(backup,name));
      committed.push(name);await rename(path.join(stage,name),path.join(root,name));
    }
    await rm(backup+'.older',{recursive:true,force:true});console.log('清單已更新。請到 chrome://extensions 重新載入插件及網頁；前一版保存在 .previous-web-lists。');
  }
}catch(error){
  for(const name of committed.slice().reverse()){await rm(path.join(root,name),{recursive:true,force:true});await rename(path.join(backup,name),path.join(root,name));}
  if(committed.length || oldBackupMoved){await rm(backup,{recursive:true,force:true});if(oldBackupMoved)await rename(backup+'.older',backup);}
  throw error;
}finally{await rm(stage,{recursive:true,force:true});}
