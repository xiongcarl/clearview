// Real Chrome comparison; isolated profile, only loopback fixtures. GPL-3.0-or-later.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv[2] || fileURLToPath(new URL('../extension/',import.meta.url)));
const baseline=process.argv.includes('--baseline');
const out=path.join(root,'testing-output'),profile=path.join(out,'cosmetic-browser-profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const fragment=`<div id="prefix-ad" class="adDisplay-module-slot">Advertisement</div><div id="prefix-safe" class="articleDisplay-module-slot">Article</div><div id="teaser1" style="width:autopx;">Advertisement</div><div id="teaser2" style="width:250px;">Normal teaser</div><div id="aafoot" class="top_box42">Advertisement</div><div id="safe-footer" class="reader_box42">Normal footer</div><article id="nested-ad"><header><span class="ct-sponsored">Advertisement</span></header></article><article id="nested-safe"><header><span class="ct-article">Normal article</span></header></article><div class="adsbox" id="generic">Generic placeholder</div><ins class="adsbygoogle" id="builtin">Builtin placeholder</ins>`;
let hits=0;
const server=createServer((req,res)=>{
 if(req.url.startsWith('/widget/ads.')){hits++;res.setHeader('Content-Type','text/javascript');res.end('compatibility-ok');return;}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html>'+fragment+'<div id="component"></div><script>window.component=document.getElementById("component").attachShadow({mode:"closed"});component.innerHTML='+JSON.stringify(fragment)+';</script>');
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const port=server.address().port;
const child=spawn(process.env.AD_SHIELD_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-proxy-server',`--host-resolver-rules=MAP *.example.test 127.0.0.1, MAP jetzt.de 127.0.0.1, MAP ondemandkorea.com 127.0.0.1, MAP player.pl 127.0.0.1, MAP tympanus.net 127.0.0.1`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='',ws,seq=0;const pending=new Map(),results=[];child.stderr.on('data',x=>stderr+=x);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(new Error('Timeout '+method));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});}
async function evaluate(s,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},s);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
async function until(s,expression){for(let i=0;i<100;i++){if(await evaluate(s,expression))return;await sleep(75);}throw new Error('Readiness timeout: '+expression);}
function check(name,actual,expected){results.push({name,actual,expected,pass:JSON.stringify(actual)===JSON.stringify(expected)});console.log(JSON.stringify(results.at(-1)));if(!baseline)assert.deepEqual(actual,expected,name);}
try{
 let endpoint;for(let i=0;i<100;i++){try{endpoint=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!endpoint)throw new Error(stderr.slice(-2000));
 ws=new WebSocket(`ws://127.0.0.1:${endpoint[0]}${endpoint[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const {id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);
 await until(popup.sessionId,"document.getElementById('enabled') && !document.getElementById('enabled').disabled");
 const defaults={enabled:true,popupMode:'off',scriptlets:false,enhancedTracking:false,hideAds:true,shadowAds:true,webFilters:{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true}};
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 await settings({});
 async function page(host){const p=await attach(`http://${host}:${port}/`);await until(p.sessionId,"document.readyState==='complete' && !!window.component");await sleep(1800);return p;}
 const normal=await page('normal.example.test');
 const visible=(s,selector,shadow=false)=>evaluate(s,`getComputedStyle(${shadow?'window.component':'document'}.querySelector(${JSON.stringify(selector)})).display!=='none'`);
 for(const shadow of [false,true]){
  for(const selector of ['#prefix-ad','#teaser1','#aafoot'])check(`${shadow?'closed shadow':'document'} recovered ad ${selector}`,await visible(normal.sessionId,selector,shadow),false);
  for(const selector of ['#prefix-safe','#teaser2','#safe-footer'])check(`${shadow?'closed shadow':'document'} normal neighbor ${selector}`,await visible(normal.sessionId,selector,shadow),true);
 }
 for(const host of ['jetzt.de','ondemandkorea.com','player.pl']){
  const p=await page(host);
  for(const shadow of [false,true])for(const selector of ['#generic','#builtin'])check(`${host} exception preserves ${shadow?'shadow':'document'} ${selector}`,await visible(p.sessionId,selector,shadow),true);
  await send('Target.closeTarget',{targetId:p.targetId});
 }
 const nested=await page('tympanus.net');
 check('Nested has advertisement uses procedural engine',await visible(nested.sessionId,'#nested-ad'),false);
 check('Nested has preserves ordinary adjacent article',await visible(nested.sessionId,'#nested-safe'),true);
 await settings({procedural:false});await sleep(1200);
 check('Procedural toggle restores nested advertisement',await visible(nested.sessionId,'#nested-ad'),true);
 await send('Target.closeTarget',{targetId:nested.targetId});
 await settings({whitelist:['normal.example.test']});await sleep(1200);
 check('Pause restores recovered ad',await visible(normal.sessionId,'#prefix-ad'),true);
 check('Pause restores closed shadow ad',await visible(normal.sessionId,'#prefix-ad',true),true);
 await settings({});await sleep(1200);
 check('Resume reapplies recovered ad hiding',await visible(normal.sessionId,'#prefix-ad'),false);
 const url=`http://normal.example.test:${port}/widget/ads.js`;
 const fetchExpression=`fetch(${JSON.stringify(url)}).then(r=>r.text()).catch(()=>'BLOCKED')`;
 check('Local ad path still blocked normally',await evaluate(normal.sessionId,fetchExpression),'BLOCKED');
 check('Blocked ad never reaches origin',hits,0);
 await evaluate(popup.sessionId,`chrome.declarativeNetRequest.updateSessionRules({addRules:[{id:90001,priority:1000,action:{type:'allow'},condition:{urlFilter:${JSON.stringify(url)},resourceTypes:['xmlhttprequest']}}]})`);
 check('Scoped compatibility allow overrides heuristic local block',await evaluate(normal.sessionId,fetchExpression),'compatibility-ok');
 await evaluate(popup.sessionId,'chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:[90001]})');
 check('Removing compatibility allow restores ad blocking',await evaluate(normal.sessionId,fetchExpression),'BLOCKED');
 // Chrome's parser must accept each newly recovered native selector.
 const db=JSON.parse(await readFile(path.join(root,'data/web-cosmetics.json'),'utf8'));
 const selectors=[...new Set(Object.values(db).flatMap(x=>x.entries.filter(e=>!e.exception).map(e=>e.selector)))];
 const invalid=await evaluate(normal.sessionId,`(()=>{const s=new CSSStyleSheet();return ${JSON.stringify(selectors)}.filter(x=>{try{s.replaceSync(x+'{display:none!important}');return s.cssRules.length!==1;}catch{return true;}})})()`);
 await writeFile(path.join(out,'native-selector-validation.json'),JSON.stringify({checked:selectors.length,invalid},null,2)+'\n');
 console.log('Native selectors checked: '+selectors.length+'; invalid: '+invalid.length);
 await writeFile(path.join(out,'cosmetic-browser-results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,baseline,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} target behavior checks passed.`);
}finally{
 if(ws)ws.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();await new Promise(r=>server.close(r));
}
