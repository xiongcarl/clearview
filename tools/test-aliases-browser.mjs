// Source-scoped filtering and compatibility fixtures, isolated loopback HTTPS.
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
const out=path.join(root,'testing-output/aliases'),profile=path.join(out,'profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const keyFile=path.join(profile,'fixture-key.pem'),certFile=path.join(profile,'fixture-cert.pem');
execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',keyFile,'-out',certFile,'-days','1','-subj','/CN=ad-shield-local-fixture'],{stdio:'ignore'});
const cert=await readFile(certFile),key=await readFile(keyFile),spki=createHash('sha256').update(new X509Certificate(cert).publicKey.export({type:'spki',format:'der'})).digest('base64');
const hits=new Map();let poweredBy;
const server=createServer({key,cert},(req,res)=>{
 const u=new URL(req.url,'https://'+req.headers.host);const k=u.href;hits.set(k,(hits.get(k)||0)+1);
 if(poweredBy)res.setHeader('X-Powered-By',poweredBy);
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Cache-Control','no-store');
 if(u.pathname==='/fixture'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Normal content</title><p>Reading fixture</p>');return;}
 if(u.pathname.endsWith('.jpg')){res.setHeader('Content-Type','image/gif');res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==','base64'));return;}
 res.setHeader('Content-Type','text/javascript');res.end('globalThis.fixtureResource = true;');
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
 const response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})"),defaults=response.settings;
 check('Extension initialized without an error',response.info.initializationError || null,null);
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 const page=await attach('https://publisher.example.test/fixture'),s=page.sessionId;await until(s,"location.hostname==='publisher.example.test' && document.readyState==='complete' && !!document.head && !!document.body");
 async function script(url){return evaluate(s,`new Promise(resolve=>{const x=document.createElement('script');x.onload=()=>{x.remove();resolve('LOADED')};x.onerror=()=>{x.remove();resolve('BLOCKED')};x.src=${JSON.stringify(url)};document.head.append(x)})`);}
 async function request(name,url,expected){const before=hits.get(url)||0;check(name,await script(url),expected);check(name+' origin requests',(hits.get(url)||0)-before,expected==='BLOCKED'?0:1);}
 async function navigate(host){await send('Page.navigate',{url:'https://'+host+'/fixture'},s);await until(s,`location.hostname===${JSON.stringify(host)} && document.readyState==='complete'`);}
 const ordinary='https://cdn.example.org/library.js';
 await request('Site-only third-party filter inactive elsewhere',ordinary,'LOADED');
 await navigate('scnlog.me');
 await request('Recovered source-specific third-party filter',ordinary,'BLOCKED');
 await request('Same-site resources preserved','https://scnlog.me/library.js','LOADED');
 await request('Google verification dependency preserved','https://www.google.com/recaptcha/api.js','LOADED');
 await request('hCaptcha dependency preserved','https://hcaptcha.com/1/api.js','LOADED');
 check('Resource type boundary preserves XHR',await evaluate(s,`fetch(${JSON.stringify(ordinary)}).then(r=>r.text())`),'globalThis.fixtureResource = true;');
 for(const value of [{allowDomains:['cdn.example.org']},{whitelist:['scnlog.me']},{enabled:false},{webFilters:{...defaults.webFilters,fixes:false}}]){await settings(value);await request('User/list exception '+JSON.stringify(value),ordinary,'LOADED');}
 await settings({});
 await navigate('scnlog.me.example.test');
 await request('Similar source hostname stays unaffected',ordinary,'LOADED');
 const scoped='https://cdn.example.org/siropu/am/core.min.js';
 await navigate('publisher.example.test');
 await request('Forum advertising module filtered',scoped,'BLOCKED');
 for(const host of ['audi-sport.net','www.audi-sport.net','hifiwigwam.com']){await navigate(host);await request('Publisher compatibility exclusion '+host,scoped,'LOADED');}
 await navigate('audi-sport.net.example.test');await request('Domain exclusion cannot leak to lookalike hostname',scoped,'BLOCKED');
 await navigate('publisher.example.test');
 const headerURL='https://www.abcdefghij.com/abc.js';
 check('Similar script with no advertising response signature',await script(headerURL),'LOADED');
 poweredBy='Example';check('Different response signature preserved',await script(headerURL),'LOADED');
 poweredBy='Express';check('Matching URL and response signature blocked',await script(headerURL),'BLOCKED');
 await navigate('university.edu');check('Excluded education source preserved',await script(headerURL),'LOADED');
 await navigate('publisher.example.test');check('Explicit destination exception preserved',await script('https://www.exploretock.com/abc.js'),'LOADED');poweredBy=undefined;
 // All hosts resolve to the loopback fixture; no external site or account is accessed.
 const compatScript='https://ads.host-cdn.net/helper.js?ready';
 await navigate('maxstream.video');await request('Recovered script compatibility exception',compatScript,'LOADED');
 await navigate('uprot.net');await request('Second source compatibility exception',compatScript,'LOADED');
 await navigate('publisher.example.test');await request('Compatibility exception stays scoped',compatScript,'BLOCKED');
 const fixes=JSON.parse(await readFile(path.join(root,'data/web-rules/fixes.json'),'utf8'));
 async function matched(url,type,initiator){return evaluate(popup.sessionId,`chrome.declarativeNetRequest.testMatchOutcome(${JSON.stringify({url,type,initiator:'https://'+initiator+'/'})})`);}
 const media=fixes.find(r=>r.condition.urlFilter==='||akamaized.net/audio/' && r.condition.initiatorDomains?.includes('open.spotify.com') && r.action.type==='redirect');
 check('Scoped media replacement is present',!!media,true);
 if(media){
  check('Media replacement limited to player origin',(await matched('https://akamaized.net/audio/spot.mp3','media','open.spotify.com')).matchedRules.some(x=>x.ruleId===media.id && x.rulesetId==='fixes'),true);
  check('Other publisher media unaffected by replacement',(await matched('https://akamaized.net/audio/spot.mp3','media','publisher.example.test')).matchedRules.some(x=>x.ruleId===media.id && x.rulesetId==='fixes'),false);
  check('Normal player media path unaffected by replacement',(await matched('https://akamaized.net/music/track.mp3','media','open.spotify.com')).matchedRules.some(x=>x.ruleId===media.id && x.rulesetId==='fixes'),false);
 }
 for(const [url,host] of [[ordinary,'scnlog.me'],[compatScript,'mail.google.com'],['https://accounts.google.com/o/oauth2/v2/auth','scnlog.me']])check('Top-level navigation preserved '+host,(await matched(url,'main_frame',host)).matchedRules.some(x=>x.ruleId===10008 || x.ruleId===10009),true);

}finally{
 await writeFile(path.join(out,'results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,observe,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} alias browser checks passed.`);
 ws?.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();server.closeAllConnections();server.close();
}
