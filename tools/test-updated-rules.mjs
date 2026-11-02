// Real Chrome comparison; isolated profile, only loopback fixtures. GPL-3.0-or-later.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv[2] || fileURLToPath(new URL('../',import.meta.url)));
const baseline=process.argv.includes('--baseline');
const out=path.join(root,'testing-output'),profile=path.join(out,'updated-rules-profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const hits=new Map();
const server=createServer((req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><p>Normal page</p>');return;}
 const key=req.headers.host+req.url;hits.set(key,(hits.get(key)||0)+1);
 res.setHeader('Content-Type','text/plain');res.end('resource-ok');
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const port=server.address().port;
const child=spawn(process.env.AD_SHIELD_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-proxy-server',`--host-resolver-rules=MAP * 127.0.0.1`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
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
 const defaults={enabled:true,popupMode:'off',scriptlets:false,enhancedTracking:true,hideAds:true,shadowAds:true,webFilters:{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true}};
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 await settings({});
 const p=await attach(`http://normal.example.test:${port}/`);await until(p.sessionId,"document.readyState==='complete'");
 const domains=['0175a3229c.com','0c3ff350ec.com','0cc9ed5f1c.com'];
 const adURLs=[...domains.map(host=>`http://${host}:${port}/creative.js`),...['/hao123/card/fill','/jameson_manhua/template/ads/banner.js','/i/api/kn/afterclick/event'].map(path=>`http://normal.example.test:${port}${path}`)];
 const fetchURL=url=>evaluate(p.sessionId,`fetch(${JSON.stringify(url)}).then(r=>r.text()).catch(()=>'BLOCKED')`);
 for(const url of adURLs){const u=new URL(url),key=u.host+u.pathname,before=hits.get(key)||0;check('New upstream block '+url,await fetchURL(url),'BLOCKED');check('Blocked origin receives no request '+url,(hits.get(key)||0)-before,0);}
 for(const pathname of ['/hao123/card/view','/jameson_manhua/template/images/banner.js','/i/api/kn/profile']){const url=`http://normal.example.test:${port}${pathname}`;check('Normal neighboring endpoint '+pathname,await fetchURL(url),'resource-ok');}
 const knownURL=`http://doubleclick.net:${port}/creative.js`;
 check('Existing ad resource stays suppressed',await fetchURL(knownURL)==='resource-ok',false);
 check('Existing ad origin receives no request',hits.get(`doubleclick.net:${port}/creative.js`) || 0,0);
 await settings({allowDomains:domains});
 for(const url of adURLs.slice(0,3))check('Manual domain allow still works '+url,await fetchURL(url),'resource-ok');
 await settings({whitelist:['normal.example.test']});
 for(const url of adURLs.slice(3))check('Site pause preserves normal navigation choice '+url,await fetchURL(url),'resource-ok');
 await writeFile(path.join(out,'updated-rules-results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,baseline,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} updated-rule behavior checks passed.`);
}finally{
 if(ws)ws.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();await new Promise(r=>server.close(r));
}
