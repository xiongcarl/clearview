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
const out=path.join(root,'testing-output/regex'),profile=path.join(out,'profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const keyFile=path.join(profile,'fixture-key.pem'),certFile=path.join(profile,'fixture-cert.pem');
execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',keyFile,'-out',certFile,'-days','1','-subj','/CN=ad-shield-local-fixture'],{stdio:'ignore'});
const cert=await readFile(certFile),key=await readFile(keyFile),spki=createHash('sha256').update(new X509Certificate(cert).publicKey.export({type:'spki',format:'der'})).digest('base64');
const hits=new Map();
const server=createServer({key,cert},(req,res)=>{
 const u=new URL(req.url,'https://'+req.headers.host);const k=u.href;hits.set(k,(hits.get(k)||0)+1);
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
 const manifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'));const regexes=[];
 for(const rs of manifest.declarative_net_request.rule_resources){const rules=JSON.parse(await readFile(path.join(root,rs.path),'utf8'));for(const r of rules)if(r.condition.regexFilter)regexes.push({ruleset:rs.id,id:r.id,options:{regex:r.condition.regexFilter,isCaseSensitive:r.condition.isUrlFilterCaseSensitive??false,requireCapturing:!!r.action.redirect?.regexSubstitution}});}
 const validation=await evaluate(popup.sessionId,`Promise.all(${JSON.stringify(regexes)}.map(async x=>({...x,result:await chrome.declarativeNetRequest.isRegexSupported(x.options)})))`);
 await writeFile(path.join(out,'regex-validation.json'),JSON.stringify({version:manifest.version,browser:(await send('Browser.getVersion')).product,checked:validation.length,validation},null,2));
 check('All packaged expressions accepted by Chrome',validation.filter(x=>!x.result.isSupported).map(x=>({ruleset:x.ruleset,id:x.id,result:x.result})),[]);
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 const page=await attach('https://publisher.example.test/fixture'),s=page.sessionId;await until(s,"location.hostname==='publisher.example.test' && document.readyState==='complete' && !!document.head && !!document.body");
 async function script(url){return evaluate(s,`new Promise(resolve=>{const x=document.createElement('script');x.onload=()=>{x.remove();resolve('LOADED')};x.onerror=()=>{x.remove();resolve('BLOCKED')};x.src=${JSON.stringify(url)};document.head.append(x)})`);}
 async function request(name,url,expected){const before=hits.get(url)||0;check(name,await script(url),expected);check(name+' origin requests',(hits.get(url)||0)-before,expected==='BLOCKED'?0:1);}
 const hash='0123456789abcdef0123456789abcdef';const ad='https://cdn.example.org/'+hash+'/invoke.js';
 await request('Third-party rotating ad script blocked',ad,'BLOCKED');
 await request('Near-matching script preserved','https://cdn.example.org/'+hash.slice(1)+'/invoke.js','LOADED');
 await request('First-party same path preserved','https://publisher.example.test/'+hash+'/invoke.js','LOADED');
 check('Non-script request to same URL preserved',await evaluate(s,`fetch(${JSON.stringify(ad)}).then(r=>r.text())`),'globalThis.fixtureResource = true;');
 const generic='https://cdn.example.org/t/123/456/a12345.js';await request('Recovered site-fix ad script blocked',generic,'BLOCKED');
 await request('Neighboring site-fix script preserved','https://cdn.example.org/t/123/456/content.js','LOADED');
 const scoped='https://cdn.example.org/randomscript';
 await request('Site-specific expression stays inactive elsewhere',scoped,'LOADED');
 await send('Page.navigate',{url:'https://gimy.com.tw/fixture'},s);await until(s,"location.hostname==='gimy.com.tw' && document.readyState==='complete'");
 await request('Chinese site-specific ad script blocked',scoped,'BLOCKED');
 await request('Chinese site normal helper preserved','https://cdn.example.org/normal-helper.js','LOADED');
 await send('Page.navigate',{url:'https://publisher.example.test/fixture'},s);await until(s,"location.hostname==='publisher.example.test' && document.readyState==='complete'");
 for(const value of [{allowDomains:['cdn.example.org']},{whitelist:['publisher.example.test']},{enabled:false},{webFilters:{...defaults.webFilters,easylist:false,fixes:false}}]){await settings(value);await request('User/list exception '+JSON.stringify(value),ad,'LOADED');}
 await settings({});
 const main=await evaluate(popup.sessionId,`chrome.declarativeNetRequest.testMatchOutcome({url:${JSON.stringify(ad)},type:'main_frame',initiator:'https://publisher.example.test/'})`);check('Normal top-level navigation remains allowed',main.matchedRules.some(x=>x.ruleId===10008),true);
 // Origin is loopback; the image is a one-pixel fixture, not external content.
 const imageURL='https://www.pussyspace.com/upload/cat.image/abc.jpg';
 await evaluate(popup.sessionId,`chrome.declarativeNetRequest.updateSessionRules({addRules:[{id:90001,priority:300,action:{type:'block'},condition:{requestDomains:['pussyspace.com'],resourceTypes:['image']}}]})`);
 await send('Page.navigate',{url:'https://www.pussyspace.com/fixture'},s);await until(s,"location.hostname==='www.pussyspace.com' && document.readyState==='complete'");
 async function picture(url){return evaluate(s,`new Promise(resolve=>{const img=new Image();img.onload=()=>resolve('LOADED');img.onerror=()=>resolve('BLOCKED');img.src=${JSON.stringify(url)};})`);}
 check('Restored scoped image exception defeats conflicting block',await picture(imageURL),'LOADED');
 check('Image exception does not release unrelated image',await picture('https://www.pussyspace.com/upload/cat.image/other-123.jpg'),'BLOCKED');
 await send('Page.navigate',{url:'https://publisher.example.test/fixture'},s);await until(s,"location.hostname==='publisher.example.test' && document.readyState==='complete'");
 check('Image exception does not leak to other source sites',await picture(imageURL),'BLOCKED');
 await evaluate(popup.sessionId,'chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:[90001]})');
}finally{
 await writeFile(path.join(out,'results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,observe,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} regex browser checks passed.`);
 ws?.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();server.closeAllConnections();server.close();
}
