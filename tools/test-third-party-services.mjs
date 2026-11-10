// Real Chrome comparison; isolated profile, only loopback fixtures. GPL-3.0-or-later.
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {X509Certificate,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:https';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv[2] || fileURLToPath(new URL('../extension/',import.meta.url)));
const baseline=process.argv.includes('--baseline');
const out=path.join(root,'testing-output'),profile=path.join(out,'third-party-services-profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
// Trust only this ephemeral fixture certificate, only in this test process.
const keyFile=path.join(profile,'fixture-key.pem'),certFile=path.join(profile,'fixture-cert.pem');
execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',keyFile,'-out',certFile,'-days','1','-subj','/CN=ad-shield-local-fixture'],{stdio:'ignore'});
const cert=await readFile(certFile),key=await readFile(keyFile);const spki=createHash('sha256').update(new X509Certificate(cert).publicKey.export({type:'spki',format:'der'})).digest('base64');
const hits=new Map();
const server=createServer({key,cert},(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 if(new URL(req.url,'http://local.test').pathname==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><p>Normal page</p>');return;}
 const key=req.headers.host+req.url;hits.set(key,(hits.get(key)||0)+1);
 res.setHeader('Content-Type','text/plain');res.end('resource-ok');
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const port=server.address().port;
const child=spawn(process.env.AD_SHIELD_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-proxy-server',`--ignore-certificate-errors-spki-list=${spki}`,`--host-resolver-rules=MAP * 127.0.0.1`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
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
 const domains=['s.youtube.com','redirector.googlevideo.com','quantcast.com','bnc.lt','i.instagram.com','ngfts.lge.com','cdn.cookielaw.org','consent.trustarc.com','cdn.privacy-mgmt.com','go.skimresources.com','cdn.dynamicyield.com','clientstream.launchdarkly.com','click.mailchimp.com','widget.intercom.io','static.klaviyo.com','dai.google.com','ssl.p.jwpcdn.com'];
 const defaults={enabled:true,popupMode:'off',scriptlets:false,enhancedTracking:true,hideAds:false,shadowAds:false,webFilters:{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true}};
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 const p=await attach(`https://normal.example.test:${port}/`);await until(p.sessionId,"document.readyState==='complete'");
 const urls=domains.map(domain=>`https://${domain}:${port}/service-probe.txt`);
 const fetchURL=(url,session=p.sessionId)=>evaluate(session,`fetch(${JSON.stringify(url)},{cache:'no-store'}).then(r=>r.text()).catch(()=>'BLOCKED')`);
 await settings({strictThirdParty:false});
 for(const url of urls)check('Default compatibility retains '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await settings({strictThirdParty:true});
 for(const url of urls){const key=new URL(url).host+new URL(url).pathname,before=hits.get(key)||0;check('Strict third-party restriction '+new URL(url).hostname,await fetchURL(url),'BLOCKED');check('No request reaches origin '+new URL(url).hostname,(hits.get(key)||0)-before,0);}
 for(const domain of ['quantcast.com.example.test','widget.intercom.io.example.test','cdn.cookielaw.org.example.test'])check('Lookalike normal host preserved '+domain,await fetchURL(`https://${domain}:${port}/service-probe.txt`),'resource-ok');
 // Use actual top-level navigation followed by first-party fetch for every host.
 for(const url of urls){const origin=new URL(url).origin;const first=await attach(origin+'/');await until(first.sessionId,`location.href===${JSON.stringify(origin+'/')} && document.readyState==='complete' && !!document.body`);check('Direct visit kept '+origin,await evaluate(first.sessionId,"document.body.textContent.includes('Normal page')"),true);check('First-party resource kept '+origin,await fetchURL(url,first.sessionId),'resource-ok');await send('Target.closeTarget',{targetId:first.targetId});}
 await settings({strictThirdParty:true,allowDomains:domains});
 for(const url of urls)check('Manual allow overrides '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await settings({strictThirdParty:true,compatSites:['normal.example.test']});
 await send('Page.navigate',{url:`https://normal.example.test:${port}/?compat`},p.sessionId);await until(p.sessionId,"document.readyState==='complete'");
 for(const url of urls)check('Compatibility restores '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await settings({strictThirdParty:true,whitelist:['normal.example.test']});
 for(const url of urls)check('Site pause restores '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await settings({strictThirdParty:true,enabled:false});
 for(const url of urls)check('Global pause restores '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await settings({strictThirdParty:false});
 for(const url of urls)check('Turning option off restores '+new URL(url).hostname,await fetchURL(url),'resource-ok');
 await writeFile(path.join(out,'third-party-services-results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,baseline,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} third-party service checks passed.`);
}finally{
 if(ws)ws.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();await new Promise(r=>server.close(r));
}
