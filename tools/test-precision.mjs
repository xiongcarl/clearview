// Real Chrome comparison; isolated profile, only loopback fixtures. GPL-3.0-or-later.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv[2] || fileURLToPath(new URL('../',import.meta.url)));
const baseline=process.argv.includes('--baseline');
const out=path.join(root,'testing-output'),profile=path.join(out,'precision-profile');
await mkdir(out,{recursive:true});await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const fragment=`<style>amp-embed,amp-sticky-ad,amp-video{display:block;min-height:20px}a{display:inline-block;min-height:20px}</style>
<amp-embed id="embed-adsense" type="adsense">Ad creative</amp-embed>
<amp-embed id="embed-doubleclick" type="doubleclick">Ad creative</amp-embed>
<amp-embed id="embed-a9" type="a9">Ad creative</amp-embed>
<amp-sticky-ad id="sticky"><amp-ad type="adsense">Ad creative</amp-ad></amp-sticky-ad>
<amp-embed id="safe-embed" type="custom-content">Article embed</amp-embed>
<amp-video id="safe-video">Video content</amp-video>
<amp-sticky-ad id="safe-sticky">Unidentified custom content</amp-sticky-ad>
<a id="product" rel="sponsored" href="/destination"><img alt="Product image">Read review</a>
<a id="product-background" rel="sponsored" href="/destination" style="background-image:linear-gradient(red,blue)">Product details</a>
<article id="article">Normal article</article><div class="textads" id="existing">Existing advertisement</div>`;
const hits=new Map();
const server=createServer((req,res)=>{
 hits.set(req.url,(hits.get(req.url)||0)+1);res.setHeader('Cache-Control','no-store');
 if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html>'+fragment+'<div id="component"></div><script>window.component=document.getElementById("component").attachShadow({mode:"closed"});component.innerHTML='+JSON.stringify(fragment)+';</script>');return;}
 res.setHeader('Content-Type','text/plain');res.end('resource-ok');
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
 let endpoint;for(let i=0;i<100;i++){try{endpoint=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!endpoint)throw Error(stderr.slice(-2000));
 ws=new WebSocket(`ws://127.0.0.1:${endpoint[0]}${endpoint[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const {id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);
 await until(popup.sessionId,"document.getElementById('enabled') && !document.getElementById('enabled').disabled");
 const defaults=(await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})")).settings;
 async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,...value}})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 const page=await attach(`http://normal.example.test:${port}/`),s=page.sessionId;
 await until(s,"document.readyState==='complete' && !!window.component");await sleep(1800);
 const visible=(selector,shadow=false)=>evaluate(s,`getComputedStyle(${shadow?'window.component':'document'}.querySelector(${JSON.stringify(selector)})).display!=='none'`);
 for(const shadow of [false,true]){
  for(const name of ['embed-adsense','embed-doubleclick','embed-a9','sticky','existing'])check(`${shadow?'Component':'Document'} hides ad ${name}`,await visible('#'+name,shadow),false);
  for(const name of ['safe-embed','safe-video','safe-sticky','product','product-background','article'])check(`${shadow?'Component':'Document'} preserves content ${name}`,await visible('#'+name,shadow),true);
 }
 await evaluate(s,`for(const scope of [document.body,component]){const el=document.createElement('amp-embed');el.id='late';el.setAttribute('type','doubleclick');el.textContent='Late ad';scope.append(el);}`);await sleep(300);
 for(const shadow of [false,true])check('Late ad hidden '+shadow,await visible('#late',shadow),false);
 await evaluate(s,"document.querySelector('#late').setAttribute('type','custom-content');component.querySelector('#late').setAttribute('type','custom-content')");await sleep(300);
 for(const shadow of [false,true])check('Reused content restored '+shadow,await visible('#late',shadow),true);
 const request=route=>evaluate(s,`fetch(${JSON.stringify(`http://normal.example.test:${port}`)}+${JSON.stringify(route)}).then(r=>r.text()).catch(()=>'BLOCKED')`);
 for(const route of ['/widget/ads.js','/nested/widget/ads.min.js?slot=1','/pagead.js','/ads/ads.js?slot=1']){
  const before=hits.get(route)||0;check('Blocks ad request '+route,await request(route),'BLOCKED');check('Ad origin receives no request '+route,(hits.get(route)||0)-before,0);
 }
 for(const route of ['/api/preview?file=/ads/ads.js','/api/preview?file=/widget/ads.js','/api/preview?file=/pagead.js','/ads/ads.json','/ads/ads.js.map','/widget/ads.settings.js','/normal-helper.js'])check('Preserves neighboring endpoint '+route,await request(route),'resource-ok');
 const match=await evaluate(popup.sessionId,`chrome.declarativeNetRequest.testMatchOutcome({url:'http://normal.example.test:${port}/ads/ads.js',type:'main_frame'})`);
 check('Navigation exception retains priority',match.matchedRules.some(x=>x.ruleId===10008),true);
 for(const value of [{compatSites:['normal.example.test']},{whitelist:['normal.example.test']},{enabled:false},{webFilters:{...defaults.webFilters,easylist:false}}]){
  await settings(value);await sleep(900);
  for(const shadow of [false,true])check('Exception restores new cosmetic '+JSON.stringify(value)+' '+shadow,await visible('#embed-adsense',shadow),true);
  check('Exception restores local network path '+JSON.stringify(value),await request('/widget/ads.js'),'resource-ok');
 }
 await settings({});await sleep(900);check('Resume restores ad hiding',await visible('#embed-adsense'),false);
 // Respect upstream generic-hide exceptions, including inside components.
 await send('Page.navigate',{url:`http://ondemandkorea.com:${port}/`},s);await until(s,"location.hostname==='ondemandkorea.com' && !!window.component");await sleep(1500);
 for(const shadow of [false,true])check('Upstream exception retains priority '+shadow,await visible('#embed-adsense',shadow),true);
}finally{
 await writeFile(path.join(out,'precision-results.json'),JSON.stringify({version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,baseline,checks:results.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 console.log(`${results.filter(x=>x.pass).length}/${results.length} precision checks passed.`);
 ws?.close();for(const p of pending.values())clearTimeout(p.timer);child.kill();server.closeAllConnections();server.close();
}
