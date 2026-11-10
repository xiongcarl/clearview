// Gmail-shaped redirect fixtures, isolated Chrome and loopback HTTPS only.
// GPL-3.0-or-later. No email contents, tokens or daily browser profile.
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {spawn,execFileSync} from 'node:child_process';
import {X509Certificate,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:https';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv.slice(2).find(x=>!x.startsWith('--')) || fileURLToPath(new URL('../extension/',import.meta.url)));
const observe=process.argv.includes('--observe');
const out=path.join(root,'testing-output/navigation'),profile=path.join(out,'profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const keyFile=path.join(profile,'fixture-key.pem'),certFile=path.join(profile,'fixture-cert.pem');
execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',keyFile,'-out',certFile,'-days','1','-subj','/CN=ad-shield-local-fixture'],{stdio:'ignore'});
const cert=await readFile(certFile),key=await readFile(keyFile),spki=createHash('sha256').update(new X509Certificate(cert).publicKey.export({type:'spki',format:'der'})).digest('base64');
let destinationHits=0,redirectHits=0;
const server=createServer({key,cert},(req,res)=>{
 const u=new URL(req.url,'https://'+req.headers.host);res.setHeader('Content-Type','text/html');
 if(u.pathname==='/url'){redirectHits++;const finish=()=>{res.writeHead(302,{Location:u.searchParams.get('q')});res.end();};if(u.searchParams.has('fixtureDelay'))setTimeout(finish,1100);else finish();return;}
 if(u.pathname==='/destination'){destinationHits++;res.end('<p>Destination reached</p>');return;}
 res.end('<!doctype html><meta charset="utf-8"><a id="link" target="_blank" href="https://docs.example.test/destination?case=mail">Price page</a><iframe id="native" hidden></iframe><script>window.borrowed=native.contentWindow.open;</script><p>Mail-shaped local fixture</p>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-proxy-server',`--ignore-certificate-errors-spki-list=${spki}`,`--host-resolver-rules=MAP * 127.0.0.1:${server.address().port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='',ws,seq=0;const pending=new Map(),results=[];child.stderr.on('data',x=>stderr+=x);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout '+method));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});}
async function evaluate(s,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},s);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
async function until(s,expression){for(let i=0;i<100;i++){if(await evaluate(s,expression))return;await sleep(75);}throw Error('Readiness timeout: '+expression);}
function check(name,actual,expected){const entry={name,actual,expected,pass:isDeepStrictEqual(actual,expected)};results.push(entry);console.log(JSON.stringify(entry));if(!observe)assert.deepEqual(actual,expected,name);}
try{
 let endpoint;for(let i=0;i<100;i++){try{endpoint=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!endpoint)throw Error(stderr.slice(-2000));
 ws=new WebSocket(`ws://127.0.0.1:${endpoint[0]}${endpoint[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const {id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);await until(popup.sessionId,"document.getElementById('enabled') && !document.getElementById('enabled').disabled");
 const defaults=(await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})")).settings;
 check('Default popup mode is native',defaults.popupMode,'balanced');
 check('Extra service blocking defaults off',defaults.strictThirdParty,false);
 check('Broad enhanced tracking defaults off',defaults.enhancedTracking,false);
 check('Annoyances defaults off',defaults.webFilters.annoyances,false);
 const page=await attach('https://normal.example.test/'),s=page.sessionId;
 await until(s,"document.readyState==='complete' && !!document.body");
 check('Native window.open retained',await evaluate(s,"window.open.toString().includes('[native code]')"),true);
 check('Native form submit retained',await evaluate(s,"HTMLFormElement.prototype.submit.toString().includes('[native code]')"),true);
 async function configure(value){const response=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(response.ok,true);}
 async function click(){const p=await evaluate(s,"(()=>{const r=document.querySelector('#go').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");for(const type of ['mousePressed','mouseReleased'])await send('Input.dispatchMouseEvent',{type,...p,button:'left',clickCount:1},s);}
 const destination='https://accounts.google.com/destination?state=local-fixture';
 async function flow(name,html,handler){
  await evaluate(s,`document.body.innerHTML=${JSON.stringify(html)};document.querySelector('#go').onclick=${handler};true`);
  const before=new Set((await send('Target.getTargets')).targetInfos.map(t=>t.targetId));await click();await sleep(850);
  let created=[];for(let i=0;i<50;i++){created=(await send('Target.getTargets')).targetInfos.filter(t=>t.type==='page'&&!before.has(t.targetId));if(created.length===1 && created[0].url===destination)break;await sleep(100);}
  check(name+' one window',created.length,1);check(name+' destination reached',created.map(t=>t.url),[destination]);
  for(const t of created)await send('Target.closeTarget',{targetId:t.targetId});
 }
 await flow('Login button','<button id=go>Sign in with Google</button>',`()=>window.open(${JSON.stringify(destination)},'_blank','noopener')`);
 await flow('Delayed sign-in','<button id=go>Sign in</button>',`()=>setTimeout(()=>window.open(${JSON.stringify(destination)},'_blank'),250)`);
 await flow('Blank handoff','<button id=go>Authorize</button>',`()=>{const w=window.open('','_blank');setTimeout(()=>w.location=${JSON.stringify(destination)},250)}`);
 await flow('Delegated link','<a id=go href="'+destination+'" target=_blank>Continue</a>',`function(e){e.preventDefault();const a=document.createElement('a');a.href=this.href;a.target='_blank';a.rel='noopener';document.body.append(a);a.click();a.remove();}`);
 await flow('Targeted login form','<form action="https://accounts.google.com/destination" target="_blank"><input name=state value=local-fixture><button id=go>Authorize</button></form>','null');
 const ad='https://doubleclick.net/destination';
 async function adBlocked(name){const before=destinationHits;const result=await evaluate(s,`fetch(${JSON.stringify(ad)}).then(r=>r.text()).catch(()=>'BLOCKED')`);check(name+' prevents origin request',destinationHits-before,0);check(name+' returns no advertising payload',['','BLOCKED'].includes(result),true);}
 await adBlocked('Advertising subresource');
 await flow('Explicit top-level navigation through a listed domain','<a id=go href="'+destination+'" target=_blank>Continue</a>','null');
 const top=await attach(ad);await until(top.sessionId,`location.href===${JSON.stringify(ad)} && document.readyState==='complete' && !!document.body`);check('Top-level navigation not blanket blocked',await evaluate(top.sessionId,"document.body.textContent.includes('Destination reached')"),true);await send('Target.closeTarget',{targetId:top.targetId});
 await configure({blockDomains:['doubleclick.net']});
 const match=await evaluate(popup.sessionId,`chrome.declarativeNetRequest.testMatchOutcome(${JSON.stringify({url:ad,type:'main_frame',initiator:'https://normal.example.test/'})})`);
 check('Explicit manual domain block retains priority',match.matchedRules.some(x=>x.ruleId===10011),true);
 await configure({blockDomains:['doubleclick.net'],allowDomains:['doubleclick.net']});
 const allowed=await evaluate(popup.sessionId,`chrome.declarativeNetRequest.testMatchOutcome(${JSON.stringify({url:ad,type:'main_frame',initiator:'https://normal.example.test/'})})`);
 check('Manual allow still overrides manual navigation block',allowed.matchedRules.some(x=>x.ruleId===10012),true);
 const auth=await evaluate(popup.sessionId,"chrome.declarativeNetRequest.testMatchOutcome({url:'https://accounts.google.com/gsi/client',type:'script',initiator:'https://normal.example.test/'})");
 check('Google sign-in resources have a scoped exception',auth.matchedRules.some(x=>x.ruleId===10009),true);
 await configure({compatSites:['normal.example.test'],enhancedTracking:true,strictThirdParty:true});
 const compat=await evaluate(popup.sessionId,"chrome.declarativeNetRequest.testMatchOutcome({url:'https://normal.example.test/analytics.js',initiator:'https://normal.example.test/',type:'script'})");
 check('Compatibility restores first-party functions',compat.matchedRules.some(x=>x.ruleId===10010),true);
 await adBlocked('Compatibility third-party advertising');
 // Simulate upgrade in this isolated profile, never touch the user's settings.
 const workerInfo=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='service_worker' && x.url.startsWith(`chrome-extension://${id}/`));const worker=(await send('Target.attachToTarget',{targetId:workerInfo.targetId,flatten:true})).sessionId;
 const legacy={...defaults,enabled:true,popupMode:'strict',siteModes:[{host:'site.example',mode:'strict'}],enhancedTracking:true,directBlocking:true,strictThirdParty:true,webFilters:{...defaults.webFilters,annoyances:true},whitelist:['kept.example'],blockDomains:['blocked.example']};
 await evaluate(worker,`(async()=>{await chrome.storage.local.set({settings:${JSON.stringify(legacy)}});await chrome.storage.local.remove('navigationCompatibilityVersion');await initialize();})()`);
 const migrated=await evaluate(worker,"chrome.storage.local.get(['settings','navigationCompatibilityVersion','navigationSettingsBackup'])");
 check('Upgrade selects native navigation',migrated.settings.popupMode,'balanced');check('Upgrade repairs old strict site modes',migrated.settings.siteModes,[{host:'site.example',mode:'balanced'}]);
 check('Upgrade disables high-risk presets',[migrated.settings.enhancedTracking,migrated.settings.directBlocking,migrated.settings.strictThirdParty,migrated.settings.webFilters.annoyances],[false,false,false,false]);
 check('Upgrade preserves whitelist',migrated.settings.whitelist,['kept.example']);check('Upgrade preserves manual blocks',migrated.settings.blockDomains,['blocked.example']);check('Upgrade backs up prior settings',migrated.navigationSettingsBackup,legacy);
 await evaluate(worker,"(async()=>{const {settings}=await chrome.storage.local.get('settings');await chrome.storage.local.set({settings:{...settings,popupMode:'strict'}});await initialize();})()");
 check('Migration does not reset later explicit choices',await evaluate(worker,"chrome.storage.local.get('settings').then(x=>x.settings.popupMode)"),'strict');
}finally{
 await writeFile(path.join(out,'results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,observe,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} navigation compatibility checks passed.`);
 ws?.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();server.closeAllConnections();server.close();
}
