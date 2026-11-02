// Public-site regression. Isolated Chrome profile; never alters page tests or scores. GPL-3.0-or-later.
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const testDirectory=fileURLToPath(new URL('../testing-output/public/',import.meta.url));await mkdir(testDirectory,{recursive:true});
const label=process.argv[2] || 'before';
if(!/^[a-z0-9-]{1,50}$/.test(label))throw new Error('Use a short lowercase test label.');
const root=path.resolve(process.argv[3] || fileURLToPath(new URL('../',import.meta.url)));
const profile=path.join(testDirectory,'coverage-profile-'+label);await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';chrome.stderr.on('data',d=>stderr+=d);let ws;let seq=0;const pending=new Map();const requests=new Map();const events=[];
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('Timeout '+method));},45000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});
async function evaluate(sessionId,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report={label,extensionVersion:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,extensionRoot:root,startedAt:new Date().toISOString(),sites:[]};
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
 for(const url of (process.argv.includes('--super-only')?['https://superadblocktest.com/']:['https://adblock.turtlecute.org/','https://adblock-tester.com/','https://superadblocktest.com/'])){
  const page=await attach('about:blank');await send('Network.enable',{},page.sessionId);await send('Network.setCacheDisabled',{cacheDisabled:true},page.sessionId);await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1800,deviceScaleFactor:1,mobile:false},page.sessionId);
  await send('Page.navigate',{url},page.sessionId);
  if(url.includes('superadblocktest')){for(let i=0;i<80;i++){if(await evaluate(page.sessionId,"document.readyState==='complete' && !!document.querySelector('#retest') && !document.querySelector('#retest').disabled"))break;await sleep(250);}await evaluate(page.sessionId,"document.querySelector('#retest').click()");}
  for(let i=0;i<240;i++){await sleep(500);const state=await evaluate(page.sessionId,"({ready:document.readyState,text:document.body?.innerText||''})");if(state.ready==='complete' && (/points out of 100/.test(state.text) || /\d+ not blocked/.test(state.text) || /Completed:.*checks/.test(state.text)))break;}
  await sleep(4000);
  const state=await evaluate(page.sessionId,"({url:location.href,title:document.title,text:document.body?.innerText,html:document.documentElement.outerHTML,sponsorVisibility:[...document.querySelectorAll('a[rel~=sponsored]')].map(x=>({label:x.getAttribute('aria-label'),display:getComputedStyle(x).display})),scripts:[...document.scripts].map(x=>x.src).filter(Boolean),resources:performance.getEntriesByType('resource').map(x=>({name:x.name,size:x.transferSize,duration:x.duration}))})");
  const site={...state,errors:events.filter(x=>x.sessionId===page.sessionId)};report.sites.push(site);
  if(url.includes('turtlecute')){site.result={total:Number(site.text.match(/Total : (\d+)/)?.[1]),blocked:Number(site.text.match(/(\d+) blocked/)?.[1]),notBlocked:Number(site.text.match(/(\d+) not blocked/)?.[1]),visibleSponsoredLinks:site.sponsorVisibility.filter(x=>x.display!=='none').length};}
  if(url.includes('adblock-tester'))site.result={score:Number(site.text.match(/(\d+) points out of 100/)?.[1]),outOf:100};
  if(url.includes('superadblocktest')){const m=site.text.match(/Completed: (\d+) blocked and (\d+) accessible from (\d+) checks/);site.result={score:Number(site.text.match(/COMPLETE\s+(\d+)/)?.[1]),blocked:Number(m?.[1]),accessible:Number(m?.[2]),total:Number(m?.[3]),rawBlockRate:m?Number(m[1])/Number(m[3]):null,accessibleTests:[...site.html.matchAll(/<div\b[^>]*data-label="([^"]*)"[^>]*data-category="([^"]*)"[^>]*data-group="([^"]*)"[^>]*data-type="([^"]*)"[^>]*data-status="accessible"[^>]*>/g)].map(x=>({label:x[1],category:x[2],group:x[3],type:x[4]}))};}
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},page.sessionId);await writeFile(path.join(testDirectory,`${label}-${new URL(url).hostname}.png`),Buffer.from(shot.data,'base64'));
  await writeFile(path.join(testDirectory,`${label}-${new URL(url).hostname}.html`),site.html);
  console.log('SITE '+url+' '+JSON.stringify(site.result));
 }
 await writeFile(path.join(testDirectory,`coverage-${label}.json`),JSON.stringify(report,null,2));
 await writeFile(path.join(testDirectory,`summary-${label}.json`),JSON.stringify({label,extensionVersion:report.extensionVersion,startedAt:report.startedAt,browser:report.browser.product,settings:report.settings.settings,results:report.sites.map(x=>({url:x.url,result:x.result}))},null,2));
}finally{ws?.close();chrome.kill('SIGTERM');}
