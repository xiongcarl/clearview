import {createHash} from 'node:crypto';
// Public reading smoke check. Isolated profile, no accounts; preserves page content. GPL-3.0-or-later.
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const testDirectory=fileURLToPath(new URL('../testing-output/reading/',import.meta.url));await mkdir(testDirectory,{recursive:true});
const label=process.argv[2] || 'before';
if(!/^[a-z0-9-]{1,50}$/.test(label))throw new Error('Use a short lowercase test label.');
const root=path.resolve(process.argv[3] || fileURLToPath(new URL('../extension/',import.meta.url)));
const profile=path.join(testDirectory,'coverage-profile-'+label);await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';chrome.stderr.on('data',d=>stderr+=d);let ws;let seq=0;const pending=new Map();const requests=new Map();const events=[];
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('Timeout '+method));},45000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});
async function evaluate(sessionId,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report={label,extensionVersion:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,shadowFilteringSHA256:createHash('sha256').update(await readFile(path.join(root,'shadow-filtering.js'))).digest('hex'),extensionRoot:root,startedAt:new Date().toISOString(),sites:[]};
try{
 let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!lines)throw new Error(stderr.slice(-1000));
 ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 ws.onmessage=e=>{const m=JSON.parse(e.data);const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);return;}if(m.method==='Network.requestWillBeSent')requests.set(m.sessionId+':'+m.params.requestId,{url:m.params.request.url,type:m.params.type});if(m.method==='Network.loadingFailed')events.push({...requests.get(m.sessionId+':'+m.params.requestId),error:m.params.errorText,blockedReason:m.params.blockedReason,sessionId:m.sessionId});};
 report.browser=await send('Browser.getVersion');
 const {id}=await send('Extensions.loadUnpacked',{path:root});report.extensionId=id;
 const popup=await attach(`chrome-extension://${id}/popup.html`);
 for(let i=0;i<100;i++){if(await evaluate(popup.sessionId,"!!document.querySelector('#enabled') && !document.querySelector('#enabled').disabled"))break;await sleep(100);}
 report.settings=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})");
 if(!report.settings.ok || report.settings.info.initializationError)throw new Error(JSON.stringify(report.settings));
 console.log('BROWSER '+report.browser.product+' EXTENSION '+JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version);
 for(const mode of ['off','default']){
  const saved=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...report.settings.settings,enabled:mode!=='off'}})})`);if(!saved.ok)throw new Error(saved.error);
  for(const url of ['https://www.theguardian.com/international','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference']){
   const page=await attach('about:blank');await send('Network.enable',{},page.sessionId);await send('Network.setCacheDisabled',{cacheDisabled:true},page.sessionId);await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},page.sessionId);await send('Page.navigate',{url},page.sessionId);
   for(let i=0;i<100;i++){if(await evaluate(page.sessionId,"document.readyState==='complete' && !!document.body"))break;await sleep(200);}await sleep(2500);
   const state=await evaluate(page.sessionId,`(()=>{const main=document.querySelector('main')||document.body;const visible=x=>{const s=getComputedStyle(x);return s.display!=='none'&&s.visibility!=='hidden'&&x.getBoundingClientRect().height>0};const links=[...main.querySelectorAll('a[href]')].filter(x=>visible(x)&&x.innerText.trim().length>18);const article=links.find(x=>{try{return new URL(x.href).hostname===location.hostname&&/\\/20\\d\\d\\/|\\/docs\\//.test(new URL(x.href).pathname)&&new URL(x.href).pathname!==location.pathname}catch{return false}});return {url:location.href,title:document.title,mainVisible:visible(main)||[...main.children].some(visible),readableCharacters:main.innerText.length,visibleHeadings:[...main.querySelectorAll('h1,h2,h3')].filter(visible).length,visibleLinks:links.length,canScroll:document.documentElement.scrollHeight>innerHeight,articleLink:article?.href||null,articleLabel:article?.innerText.trim()||null}})()`);
   if(state.articleLink){await send('Page.navigate',{url:state.articleLink},page.sessionId);for(let i=0;i<100;i++){if(await evaluate(page.sessionId,"document.readyState==='complete' && !!document.querySelector('h1')"))break;await sleep(200);}await sleep(1500);state.article=await evaluate(page.sessionId,"({url:location.href,title:document.title,heading:document.querySelector('h1')?.innerText,mainTextCharacters:(document.querySelector('main')||document.body).innerText.length,mainVisible:getComputedStyle(document.querySelector('main')||document.body).display!=='none'})");}
   const failures=events.filter(x=>x.sessionId===page.sessionId);state.blockedRequests=failures.filter(x=>x.error==='net::ERR_BLOCKED_BY_CLIENT').length;
   state.mode=mode;report.sites.push(state);
   const shot=await send('Page.captureScreenshot',{format:'png'},page.sessionId);await writeFile(path.join(testDirectory,`${label}-${mode}-${new URL(url).hostname}.png`),Buffer.from(shot.data,'base64'));
   console.log('READING '+JSON.stringify(state));await send('Target.closeTarget',{targetId:page.targetId});
  }
 }
 await writeFile(path.join(testDirectory,`reading-${label}.json`),JSON.stringify({label,extensionVersion:report.extensionVersion,shadowFilteringSHA256:report.shadowFilteringSHA256,startedAt:report.startedAt,browser:report.browser.product,defaultSettings:report.settings.settings,results:report.sites,note:'Anonymous public reading smoke checks; request failures are not counts of ads. No account, login, payments or video playback were tested.'},null,2));
}finally{ws?.close();chrome.kill('SIGTERM');}
