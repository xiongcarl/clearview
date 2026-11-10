// Gmail-shaped redirect fixtures, isolated Chrome and loopback HTTPS only.
// GPL-3.0-or-later. No email contents, tokens or daily browser profile.
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {X509Certificate,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:https';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv.slice(2).find(x=>!x.startsWith('--')) || fileURLToPath(new URL('../extension/',import.meta.url)));
const observe=process.argv.includes('--observe');
const out=path.join(root,'testing-output'),profile=path.join(out,'mail-redirect-profile');
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
function check(name,actual,expected){const entry={name,actual,expected,pass:JSON.stringify(actual)===JSON.stringify(expected)};results.push(entry);console.log(JSON.stringify(entry));if(!observe)assert.deepEqual(actual,expected,name);}
try{
 let endpoint;for(let i=0;i<100;i++){try{endpoint=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!endpoint)throw Error(stderr.slice(-2000));
 ws=new WebSocket(`ws://127.0.0.1:${endpoint[0]}${endpoint[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const {id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);await until(popup.sessionId,"document.getElementById('enabled') && !document.getElementById('enabled').disabled");
 const settings={enabled:true,popupMode:'strict',strictThirdParty:true,directBlocking:true,enhancedTracking:true,scriptlets:true,procedural:true,hideAds:true,shadowAds:true,webFilters:{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true}};
 check('Enable full strong preset',(await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings})})`)).ok,true);
 const page=await attach('https://mail.example.test/');await until(page.sessionId,"document.readyState==='complete' && !!document.querySelector('#link')");await sleep(700);
 const s=page.sessionId;
 async function setup(mode='guard',transform='u=>u.href'){
  await evaluate(s,`(()=>{const a=document.querySelector('#link');a.href='https://docs.example.test/destination?case=mail';const u=new URL('https://www.google.com/url');u.searchParams.set('q',a.href);u.searchParams.set('source','gmail');a.dataset.saferedirecturl=(${transform})(u);a.onclick=function(e){e.preventDefault();window.returns=[];const dest=this.dataset.saferedirecturl;${mode==='borrow' ? "Reflect.apply(borrowed,window,[dest,'_blank']);" : mode==='native' ? "this.href=dest;e.stopPropagation();" : "returns.push(window.open(dest,'_blank')!==null);if(returns[0]){returns.push(window.open(this.href,'_blank')!==null);returns.push(window.open('https://ads.example.test/destination?case=extra','_blank')!==null);}"}};})()`);
 }
 async function click(key=false){await send('Target.activateTarget',{targetId:page.targetId});if(key){await evaluate(s,"document.querySelector('#link').focus()");for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Enter',code:'Enter',windowsVirtualKeyCode:13},s);return;}const p=await evaluate(s,"(()=>{const r=document.querySelector('#link').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");for(const type of ['mousePressed','mouseReleased'])await send('Input.dispatchMouseEvent',{type,...p,button:'left',clickCount:1},s);}
 async function measure(name,action,expected,originRequests=expected,redirectRequests=expected){const before=new Set((await send('Target.getTargets')).targetInfos.map(t=>t.targetId));const dh=destinationHits,rh=redirectHits;await action();await sleep(name.includes('Delayed')?1600:800);const after=(await send('Target.getTargets')).targetInfos.filter(t=>t.type==='page'&&!before.has(t.targetId));check(name+' surviving tabs',after.length,expected);if(expected===1)check(name+' reached intended destination',after.map(t=>t.url),['https://docs.example.test/destination?case=mail']);check(name+' origin requests',destinationHits-dh,originRequests);check(name+' redirect requests',redirectHits-rh,redirectRequests);for(const t of after)await send('Target.closeTarget',{targetId:t.targetId});}
 async function delegated(mode,destination='this.href',repeat=false){
  const response=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...settings,popupMode:mode}})})`);assert.equal(response.ok,true);
  await send('Page.navigate',{url:'https://mail.example.test/?mode='+mode},s);await until(s,"document.readyState==='complete' && !!document.querySelector('#link')");await sleep(400);
  await setup();await evaluate(s,`document.querySelector('#link').onclick=function(e){e.preventDefault();const a=document.createElement('a');a.href=${destination};a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();${repeat?'a.click();':''}a.remove();}`);
 }
 await delegated('strict');await measure('Strict same-link delegated click',()=>click(),1,1,0);
 await delegated('balanced');await measure('Balanced same-link delegated click',()=>click(),1,1,0);
 await delegated('strict','this.dataset.saferedirecturl');await measure('Strict safe-redirect delegated click',()=>click(),1);
 await delegated('strict','this.href',true);await measure('Delegated duplicate shares one gesture',()=>click(),1,1,0);
 await delegated('strict',"'https://ads.example.test/destination?case=extra'");await measure('Reject unrelated delegated click',()=>click(),0);
 await delegated('strict');await measure('Reject delegated click without trusted input',()=>evaluate(s,"document.querySelector('#link').click()"),0);
 await setup();await measure('Gmail safe redirect left click',()=>click(),1);check('One gesture only opens one destination',await evaluate(s,'returns'),[true,false,false]);
 await setup();await measure('Gmail safe redirect Enter',()=>click(true),1);check('Keyboard gesture only opens one destination',await evaluate(s,'returns'),[true,false,false]);
 await setup('borrow');await measure('Borrowed native safe redirect survives cleanup',()=>click(),1);
 await setup('borrow',"u=>{u.searchParams.set('fixtureDelay','1');return u.href}");await measure('Delayed safe redirect survives cleanup before final navigation',()=>click(),1);
 await measure('Redirect alias cannot spend a second native popup',()=>send('Runtime.evaluate',{expression:"Reflect.apply(borrowed,window,[document.querySelector('#link').href,'_blank']);true",userGesture:true},s),0,1,0);

 // A borrowed native window delayed at the redirect is handled by the recorder,
 // independently of whether Chrome has reached its final URL already.
 await setup();await evaluate(s,"document.querySelector('#link').onclick=function(e){e.preventDefault();window.returns=[window.open(this.dataset.saferedirecturl,'_blank')!==null];}");
 await measure('Synthetic click cannot grant redirect intent',()=>evaluate(s,"document.querySelector('#link').click()"),0);
 for(const [label,transform] of [
  ['mismatched destination',"u=>{u.searchParams.set('q','https://ads.example.test/destination?case=extra');return u.href}"],
  ['lookalike redirect host',"u=>{u.hostname='www.google.com.example.test';return u.href}"],
  ['ambiguous query',"u=>{u.searchParams.append('q','https://ads.example.test/destination?case=extra');return u.href}"],
  ['competing url parameter',"u=>{u.searchParams.set('url','https://ads.example.test/destination?case=extra');return u.href}"],
  ['credentialed URL',"u=>{u.username='user';return u.href}"],
  ['wrong redirect path',"u=>{u.pathname='/other';return u.href}"],
  ['insecure redirect',"u=>{u.protocol='http:';return u.href}"],
 ]){await setup('guard',transform);await evaluate(s,"document.querySelector('#link').onclick=function(e){e.preventDefault();window.returns=[window.open(this.dataset.saferedirecturl,'_blank')!==null];}");await measure('Reject '+label,()=>click(),0);check('Reject '+label+' before native open',await evaluate(s,'returns'),[false]);}
}finally{
 await writeFile(path.join(out,'mail-redirect-results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,observe,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} mail redirect checks passed.`);
 ws?.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();server.closeAllConnections();server.close();
}
