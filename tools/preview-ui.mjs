// Render and exercise the packaged UI in an isolated Chrome profile.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../extension/',import.meta.url));
const dir=fileURLToPath(new URL('../testing-output/ui/',import.meta.url));await mkdir(dir,{recursive:true});
const profile=path.join(dir,'profile');await rm(profile,{recursive:true,force:true});
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Reading fixture</title><p>Normal reading content</p>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://reading.example.test:${server.address().port}/`;
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--no-proxy-server','--host-resolver-rules=MAP reading.example.test 127.0.0.1','--remote-debugging-port=0','--enable-unsafe-extension-debugging',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='',ws,seq=0;child.stderr.on('data',d=>stderr+=d);const pending=new Map();const errors=[],checks=[];
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout '+method));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});
async function evaluate(s,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},s);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});await send('Runtime.enable',{},sessionId);return {targetId,sessionId};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(s,expression){for(let i=0;i<120;i++){if(await evaluate(s,expression))return;await sleep(100);}throw Error('Readiness: '+expression);}
async function click(s,selector){const point=await evaluate(s,`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);for(const type of ['mousePressed','mouseReleased'])await send('Input.dispatchMouseEvent',{type,...point,button:'left',clickCount:1},s);}
async function shot(s,name,width,height){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:2,mobile:false},s);await evaluate(s,'scrollTo(0,0)');await sleep(200);const png=await send('Page.captureScreenshot',{format:'png'},s);await writeFile(path.join(dir,name+'.png'),Buffer.from(png.data,'base64'));}
function check(name,value){assert.ok(value,name);checks.push(name);console.log('PASS '+name);}
try{
 let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!lines)throw Error(stderr.slice(-1000));
 ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
 const {id}=await send('Extensions.loadUnpacked',{path:root});const page=await attach(url);await ready(page.sessionId,"document.readyState==='complete'");
 const popup=await attach(`chrome-extension://${id}/popup.html`),s=popup.sessionId;
 await send('Emulation.setDeviceMetricsOverride',{width:380,height:600,deviceScaleFactor:2,mobile:false},s);
 await ready(s,"!!document.querySelector('#enabled') && !document.querySelector('#enabled').disabled");
 await evaluate(s,`(async()=>{activeTab=(await chrome.tabs.query({})).find(x=>x.url===${JSON.stringify(url)});host=AdShield.hostname(activeTab.url);render();})()`);
 check('Default protection state',await evaluate(s,"document.body.dataset.protection==='active' && document.querySelector('#enabled').checked"));
 const layout=await evaluate(s,'({width:document.documentElement.scrollWidth,height:document.body.scrollHeight})');console.log('LAYOUT '+JSON.stringify(layout));await shot(s,'popup',380,600);check('Popup fits 380 by 600',layout.width<=380 && layout.height<=600);
 await shot(s,'popup',380,600);
 await click(s,'#enabled');await ready(s,"!busy && document.body.dataset.protection==='paused'");check('Global pause updates visible status',await evaluate(s,"!document.querySelector('#enabled').checked && document.querySelector('#state').textContent==='攔截已暫停'"));await shot(s,'popup-paused',380,600);
 await click(s,'#enabled');await ready(s,"!busy && document.body.dataset.protection==='active'");
 await click(s,'#site');await ready(s,"!busy && document.querySelector('#state').textContent==='此網站已加入白名單'");check('Site pause disables site-only tools',await evaluate(s,"document.querySelector('#picker').disabled && document.body.dataset.protection==='paused'"));
 await click(s,'#site');await ready(s,"!busy && document.body.dataset.protection==='active'");
 await click(s,'.compatibility summary');await click(s,'#compatible');await ready(s,"!busy && document.body.dataset.protection==='compatible'");check('Compatibility control remains reachable',await evaluate(s,"document.querySelector('#compatible').textContent==='關閉此網站相容模式'"));await shot(s,'popup-compatible',380,730);
 await click(s,'#compatible');await ready(s,"!busy && document.body.dataset.protection==='active'");
 await click(s,'.list-details summary');check('List controls can be expanded',await evaluate(s,"document.querySelector('.list-details').open && !document.querySelector('#update').disabled"));
 await click(s,'#strictThirdParty');await ready(s,"!busy && settings.strictThirdParty");check('Extra third-party switch persists',await evaluate(s,"chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>r.settings.strictThirdParty)"));
 await click(s,'#strictThirdParty');await ready(s,"!busy && !settings.strictThirdParty");
 await click(s,'#options');let target;for(let i=0;i<80;i++){target=(await send('Target.getTargets')).targetInfos.find(x=>x.url===`chrome-extension://${id}/options.html`);if(target)break;await sleep(100);}check('Advanced settings opens from panel',!!target);
 const o=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true})).sessionId;await send('Runtime.enable',{},o);await ready(o,"!!document.querySelector('#save') && !document.querySelector('#save').disabled");
 await shot(o,'settings',1380,1060);check('Desktop settings has no horizontal overflow',await evaluate(o,'document.documentElement.scrollWidth<=innerWidth'));
 await click(o,'#enabled');await click(o,'#save');await ready(o,"!busy && document.querySelector('#status').textContent.startsWith('已儲存')");check('Settings save persists toggle',await evaluate(o,"chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>!r.settings.enabled)"));
 await click(o,'#enabled');await click(o,'#save');await ready(o,"!busy && settings.enabled");
 await click(o,'nav a[href="#filters"]');check('Sidebar jumps to the intended section',await evaluate(o,"location.hash==='#filters'"));
 await shot(o,'settings-mobile',390,844);check('Narrow settings has no horizontal overflow',await evaluate(o,'document.documentElement.scrollWidth<=innerWidth'));
 await evaluate(o,"document.querySelector('#whitelist').value='invalid domain';document.querySelector('#save').click()");await ready(o,"document.querySelector('#status').classList.contains('error')");check('Invalid input remains visible',await evaluate(o,"document.querySelector('#status').textContent.includes('無效網域')"));
 await evaluate(o,"document.querySelector('#whitelist').value=''");await click(o,'#strong');await ready(o,"!busy && document.querySelector('#status').textContent.startsWith('已儲存')");check('Enhanced preset preserves native navigation and optional restrictions',await evaluate(o,"chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>r.settings.popupMode==='balanced' && !r.settings.strictThirdParty && !r.settings.directBlocking && !r.settings.enhancedTracking)"));check('All 17 restricted services are disclosed',await evaluate(o,"document.querySelectorAll('#thirdPartyServices li').length===17"));
 const result={version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,browser:(await send('Browser.getVersion')).product,layout,checks,errors};assert.equal(errors.length,0);await writeFile(path.join(dir,'results.json'),JSON.stringify(result,null,2));console.log('Saved '+dir);
}finally{ws?.close();child.kill('SIGTERM');server.closeAllConnections();server.close();}
