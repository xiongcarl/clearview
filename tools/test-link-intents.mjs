// Real Mac Chrome popup experience checks, isolated profile only. GPL-3.0-or-later.
// Right-menu cases use a trusted right-click followed by native opening of its
// exact candidate; they do not automate selection of the native menu item.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(process.argv.slice(2).find(x=>!x.startsWith('--')) || fileURLToPath(new URL('../',import.meta.url)));
const dir=path.join(root,'testing-output','link-intents-'+Date.now());await mkdir(dir,{recursive:true});
const profile=path.join(dir,'profile');let hits=0;const held=new Set();
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');if(req.url.startsWith('/hang.js')){held.add(res);return;}if(req.url.startsWith('/slow')){res.end('<body><a id=link href="/destination?kind=slow">Still loading link</a><script src="/hang.js"></script>');return;}if(req.url.startsWith('/foreign')){res.end(`<a target=_blank id=child href="http://127.0.0.1:${server.address().port}/destination?kind=foreign">Frame link</a><iframe hidden id=native></iframe><button id=attack style="position:absolute;left:8px;top:36px">Widget action</button><script>document.addEventListener('click',e=>parent.postMessage({fixtureClick:true,trusted:e.isTrusted,prevented:e.defaultPrevented,meta:e.metaKey,target:e.target.tagName,href:e.target.href,x:e.clientX,y:e.clientY},'*'),true);const fn=document.getElementById('native').contentWindow.open;document.getElementById('attack').onclick=()=>Reflect.apply(fn,window,['http://127.0.0.1:${server.address().port}/destination?kind=widget','_blank']);</script>`);return;}if(req.url.startsWith('/destination')){hits++;res.end('<p>Destination</p>');return;}res.end(`<!doctype html><meta charset=utf-8><iframe id=borrow></iframe><script>window.borrowed=document.getElementById('borrow').contentWindow.open;</script><button id=attack>Continue reading</button><a id=link href="/destination?kind=normal">Normal link</a><div id=closed style="display:inline-block"></div><p id=normal>Normal article</p><script>
window.frameClickLogs=[];window.addEventListener('message',e=>{if(e.data?.fixtureClick)frameClickLogs.push(e.data)});attack.onclick=()=>Reflect.apply(borrowed,window,['/destination?kind=attack','_blank']);
const root=document.getElementById('closed').attachShadow({mode:'closed'});root.innerHTML='<a href="/destination?kind=closed">Component link</a>';
</script>`);});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--disable-background-networking','--no-default-browser-check','--no-proxy-server','--remote-debugging-port=0','--enable-unsafe-extension-debugging',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});let logs='';child.stderr.on('data',d=>logs+=d);
let ws;let seq=0;const pending=new Map();let worker;const errors=[];
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(method+' timeout'));},20000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});}
async function evaluate(s,expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},s);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(s){for(let i=0;i<80;i++){if(await evaluate(s,"document.readyState==='complete' && !!document.body"))return;await sleep(100);}throw new Error('not ready');}
async function click(s,selector,button='left',modifiers=0){const p=await evaluate(s,`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...p,button,buttons:button==='middle'?4:button==='right'?2:1,clickCount:1,modifiers},s);await send('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button,buttons:0,clickCount:1,modifiers},s);}
const observations=[];
try{
 let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!lines)throw new Error(logs.slice(-1000));ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.consoleAPICalled' && m.params.type==='error')errors.push(m.params.args.map(x=>x.value||x.description).join(' '));const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const preexisting=await attach(url);await ready(preexisting.sessionId);
 const slow=await attach(url+'slow');for(let i=0;i<50;i++){if(await evaluate(slow.sessionId,"!!document.querySelector('#link')"))break;await sleep(50);}
 const {id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);await ready(popup.sessionId);for(let i=0;i<80;i++){if(await evaluate(popup.sessionId,"document.getElementById('enabled') && !document.getElementById('enabled').disabled"))break;await sleep(100);}
 const all=await send('Target.getTargets');const w=all.targetInfos.find(x=>x.type==='service_worker' && x.url.startsWith(`chrome-extension://${id}/`));worker=(await send('Target.attachToTarget',{targetId:w.targetId,flatten:true})).sessionId;await send('Runtime.enable',{},worker);await evaluate(worker,"globalThis.events=[];chrome.webNavigation.onCreatedNavigationTarget.addListener(x=>events.push(x));true");
 async function setting(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:value})})`);assert.equal(r.ok,true,JSON.stringify(r));}
 await setting({enabled:!process.argv.includes('--off'),popupMode:'strict',scriptlets:false,enhancedTracking:false,webFilters:{easylist:false,easyprivacy:false,chinese:false,annoyances:false,fixes:false}});
 const page=await attach(url);await ready(page.sessionId);await sleep(1000);
 async function measure(name,action){const before=new Set((await send('Target.getTargets')).targetInfos.map(t=>t.targetId));const h=hits;await action();await sleep(900);const created=(await send('Target.getTargets')).targetInfos.filter(t=>!before.has(t.targetId)&&t.type==='page');const events=await evaluate(worker,'events.splice(0)');const rescue=await evaluate(worker,"typeof popupRescue==='undefined'?null:popupRescue.inspect()");const entry={name,surviving:created.map(t=>({url:t.url,openerId:t.openerId})),events,requests:hits-h,rescue,frameClicks:await evaluate(page.sessionId,'frameClickLogs.splice(0)'),guardReturns:await evaluate(page.sessionId,'[window.correct,window.extra,window.duplicate]')};observations.push(entry);console.log(JSON.stringify(entry));if(!process.argv.includes('--observe')){const blocked=/strict-foreign-borrowed-popup|worker-restart-borrowed-popup|borrowed-blob-popup|borrowed-native-popup|preexisting-borrowed-popup|one-keyboard-gesture-no-second-popup|synthetic-modifier-no-intent|contextmenu-one-candidate-only|compatibility-retains-strict-popup/.test(name);assert.equal(created.length,(blocked || name==='synthetic-svg-navigation')?0:1,name);assert.equal(events.length,name==='synthetic-svg-navigation'?0:1,name+' creates a browser navigation');}for(const t of created)await send('Target.closeTarget',{targetId:t.targetId});}
 await measure('still-loading-preexisting-cmd-link',()=>click(slow.sessionId,'#link','left',4));for(const response of held)response.end('');held.clear();
 await measure('preexisting-cmd-link',()=>click(preexisting.sessionId,'#link','left',4));
 await measure('preexisting-borrowed-popup',()=>click(preexisting.sessionId,'#attack'));
 await measure('borrowed-native-popup',()=>click(page.sessionId,'#attack'));
 await measure('borrowed-blob-popup',()=>send('Runtime.evaluate',{expression:"window.blobURL=URL.createObjectURL(new Blob(['<p>Unwanted window</p>'],{type:'text/html'}));Reflect.apply(borrowed,window,[blobURL,'_blank']);true",userGesture:true,returnByValue:true},page.sessionId));
 await evaluate(page.sessionId,"document.getElementById('link').target='_blank';document.getElementById('link').rel='noopener noreferrer';document.getElementById('link').setAttribute('data-saferedirecturl','https://www.google.com/url?q=destination');");
 await measure('plain-mail-style-link',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').onclick=function(){this.href='/destination?kind=rewritten-click';}");
 await measure('left-click-rewritten-destination',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').onclick=null;document.getElementById('link').setAttribute('href','');");
 await measure('left-click-empty-href',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').href='/destination?kind=handoff';document.getElementById('link').onclick=function(e){e.preventDefault();const tab=Reflect.apply(borrowed,window,['about:blank','_blank']);setTimeout(()=>{if(tab&&!tab.closed)tab.location=this.href;},350);}");
 await measure('left-click-blank-handoff',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').onclick=function(e){e.preventDefault();const tab=window.open('','_blank');setTimeout(()=>{if(tab&&!tab.closed)tab.location=this.href;},350);}");
 await measure('left-click-guarded-blank-handoff',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').onclick=function(e){this.href='/destination?kind=rewritten-script';window.open(this.href,'_blank');}");
 await measure('left-click-rewritten-script-destination',()=>click(page.sessionId,'#link'));
 await evaluate(page.sessionId,"document.getElementById('link').href='/destination?kind=normal';document.getElementById('link').onclick=null;");
 await evaluate(page.sessionId,`{
 const holder=document.createElement('div');holder.id='svg-fixture';
 holder.innerHTML='<svg width="220" height="50"><a id="svg-link" href="/destination?kind=svg" target="_blank"><rect width="220" height="50" fill="green"/><text y="25">SVG link</text></a></svg>';
 document.body.append(holder);
 }`);
 await measure('svg-native-link',()=>click(page.sessionId,'#svg-link'));
 await evaluate(page.sessionId,"document.getElementById('svg-link').onclick=function(e){e.preventDefault();window.open(this.getAttribute('href'),'_blank');}");
 await measure('svg-script-link',()=>click(page.sessionId,'#svg-link'));
 await evaluate(page.sessionId,"{const a=document.getElementById('svg-link');a.removeAttribute('href');a.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','/destination?kind=xlink');a.onclick=function(e){e.preventDefault();window.open(this.getAttributeNS('http://www.w3.org/1999/xlink','href'),'_blank');}}");
 await measure('svg-xlink-script-link',()=>click(page.sessionId,'#svg-link'));
 await evaluate(page.sessionId,"document.getElementById('svg-link').onclick=null");
 await measure('svg-xlink-native-link',()=>click(page.sessionId,'#svg-link'));
 await evaluate(page.sessionId,"{const a=document.getElementById('svg-link');a.onclick=function(e){e.preventDefault();const url=this.getAttributeNS('http://www.w3.org/1999/xlink','href');window.correct=window.open(url,'_blank')!==null;window.extra=window.open('/destination?kind=extra','_blank')!==null;window.duplicate=window.open(url,'_blank')!==null;}}");
 await measure('svg-one-gesture-budget',()=>click(page.sessionId,'#svg-link'));
 if(!process.argv.includes('--observe'))assert.deepEqual(await evaluate(page.sessionId,'[correct,extra,duplicate]'),[true,false,false],'SVG gesture preserves one destination only');
 await evaluate(page.sessionId,"document.getElementById('svg-link').onclick=null");
 await measure('synthetic-svg-navigation',()=>send('Runtime.evaluate',{expression:"document.getElementById('svg-link').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));true",userGesture:true,returnByValue:true},page.sessionId));
 await evaluate(page.sessionId,"document.getElementById('svg-fixture').remove()");
 await measure('enter-mail-style-link',async()=>{await evaluate(page.sessionId,"document.getElementById('link').focus()");for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Enter',code:'Enter',windowsVirtualKeyCode:13},page.sessionId);});
 await evaluate(page.sessionId,"document.getElementById('link').onclick=function(){window.correct=window.open(this.href,'_blank')!==null;window.extra=window.open('/destination?kind=extra','_blank')!==null;window.duplicate=window.open(this.href,'_blank')!==null;}");
 await measure('script-mail-style-link',()=>click(page.sessionId,'#link'));
 if(!process.argv.includes('--observe'))assert.deepEqual(await evaluate(page.sessionId,'[correct,extra,duplicate]'),[true,false,false],'explicit destination preserved; unrelated and duplicate popups refused');
 await evaluate(page.sessionId,"document.getElementById('link').onclick=null;document.getElementById('link').removeAttribute('target');");
 await measure('cmd-normal-link',()=>click(page.sessionId,'#link','left',4));
 await measure('middle-normal-link',()=>click(page.sessionId,'#link','middle'));
 await measure('cmd-closed-component-link',()=>click(page.sessionId,'#closed','left',4));
 await evaluate(page.sessionId,`(()=>{const d=document.getElementById('borrow').contentDocument;d.open();d.write('<a target=_blank id=child href="/destination?kind=rewritten">Rewritten frame link</a>');d.close();const f=document.createElement('iframe');f.id='foreign';f.src='http://localhost:${server.address().port}/foreign';document.body.append(f);return true;})()`);await sleep(1800);
 async function frameClick(id,y=17,modifiers=4){await send('Target.activateTarget',{targetId:page.targetId});const rect=await evaluate(page.sessionId,`(()=>{const f=document.getElementById('${id}');const r=f.getBoundingClientRect();return {x:r.x+35,y:r.y+${y}};})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',...rect},page.sessionId);await sleep(100);for(const type of ['mousePressed','mouseReleased'])await send('Input.dispatchMouseEvent',{type,...rect,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,modifiers},page.sessionId);}
 await evaluate(page.sessionId,"root.querySelector('a').target='_blank'");await measure('closed-component-plain-link',()=>click(page.sessionId,'#closed'));
 await evaluate(page.sessionId,"document.getElementById('borrow').contentDocument.getElementById('child').target='_blank'");
 await measure('plain-rewritten-blank-frame-link',()=>frameClick('borrow',17,0));
 await measure('cmd-rewritten-blank-frame-link',()=>frameClick('borrow'));
 await measure('plain-cross-origin-frame-link',()=>frameClick('foreign',17,0));
 await measure('cmd-cross-origin-frame-link',()=>frameClick('foreign'));
 await measure('strict-foreign-borrowed-popup',()=>frameClick('foreign',47,0));
 await setting({whitelist:['localhost']});await measure('whitelisted-foreign-borrowed-popup',()=>frameClick('foreign',47,0));await setting({whitelist:[]});
 await measure('shift-normal-link',()=>click(page.sessionId,'#link','left',8));
 await measure('cmd-enter-normal-link',async()=>{await evaluate(page.sessionId,"document.getElementById('link').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,modifiers:4},page.sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,modifiers:4},page.sessionId);});
 await measure('one-keyboard-gesture-no-second-popup',async()=>{await send('Runtime.evaluate',{expression:"Reflect.apply(borrowed,window,['/destination?kind=normal','_blank']);true",userGesture:true,returnByValue:true},page.sessionId);});
 await measure('synthetic-modifier-no-intent',async()=>{await evaluate(page.sessionId,"document.getElementById('link').dispatchEvent(new MouseEvent('click',{bubbles:true,metaKey:true}));true");await send('Runtime.evaluate',{expression:"Reflect.apply(borrowed,window,['/destination?kind=normal','_blank']);true",userGesture:true,returnByValue:true},page.sessionId);});
 async function menuOpen(){await click(page.sessionId,'#link','right');await sleep(100);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},page.sessionId);await send('Runtime.evaluate',{expression:"Reflect.apply(borrowed,window,['/destination?kind=normal','_blank']);true",userGesture:true,returnByValue:true},page.sessionId);}
 await measure('trusted-contextmenu-destination',menuOpen);
 await measure('contextmenu-one-candidate-only',()=>send('Runtime.evaluate',{expression:"Reflect.apply(borrowed,window,['/destination?kind=normal','_blank']);true",userGesture:true,returnByValue:true},page.sessionId));
 await measure('second-contextmenu-new-gesture',menuOpen);
 await setting({siteModes:[{host:'127.0.0.1',mode:'off'}]});await measure('per-site-off-borrowed-popup',()=>click(page.sessionId,'#attack'));await setting({siteModes:[]});
 await setting({whitelist:['127.0.0.1']});await measure('whitelist-borrowed-popup',()=>click(page.sessionId,'#attack'));await setting({whitelist:[],enabled:false});await measure('paused-borrowed-popup',()=>click(page.sessionId,'#attack'));await setting({enabled:true,compatSites:['127.0.0.1']});await measure('compatibility-retains-strict-popup',()=>click(page.sessionId,'#attack'));await setting({compatSites:[]});

 await evaluate(page.sessionId,"document.title='Ad Shield recorder probe'");
 await evaluate(worker,`(async()=>{const tab=(await chrome.tabs.query({})).find(x=>x.title==='Ad Shield recorder probe');globalThis.recorderProbeTab=tab.id;await chrome.scripting.executeScript({target:{tabId:tab.id},world:'ISOLATED',func:()=>{globalThis.recorderReadyCount=0;const original=chrome.runtime.sendMessage;chrome.runtime.sendMessage=function(...args){if(args[0]?.type==='POPUP_RECORDER_READY')recorderReadyCount++;return Reflect.apply(original,this,args);};}});})()`);
 await evaluate(page.sessionId,"(async()=>{const host=document.createElement('div');document.body.append(host);for(let i=0;i<50;i++){host.replaceChildren(document.createElement('span'));await new Promise(r=>setTimeout(r,10));}host.remove();await new Promise(r=>setTimeout(r,100));})()");
 const recorderProbe=await evaluate(worker,"(async()=>{const [out]=await chrome.scripting.executeScript({target:{tabId:recorderProbeTab},world:'ISOLATED',func:()=>recorderReadyCount});return {ordinaryMutationBatches:50,readyMessages:out.result};})()");
 console.log('Recorder probe '+JSON.stringify(recorderProbe));
 if(!process.argv.includes('--observe'))assert.ok(recorderProbe.readyMessages<=5,'ordinary DOM changes do not trigger whole frame rescans');
 const previousWorker=w.targetId;const internal=await attach('chrome://serviceworker-internals/');await ready(internal.sessionId);await sleep(300);await send('Target.detachFromTarget',{sessionId:worker});
 await evaluate(internal.sessionId,`(()=>{const row=Array.from(document.querySelectorAll('.serviceworker-registration')).find(x=>x.textContent.includes('chrome-extension://${id}/'));if(!row)throw Error('worker row missing');row.querySelector('[data-command=stop]').click();return true;})()`);await sleep(100);
await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})");
 let nextWorker;for(let i=0;i<80;i++){nextWorker=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='service_worker' && x.url.startsWith(`chrome-extension://${id}/`) && x.targetId!==previousWorker);if(nextWorker)break;await sleep(50);}assert.ok(nextWorker,'service worker really restarted');worker=(await send('Target.attachToTarget',{targetId:nextWorker.targetId,flatten:true})).sessionId;await send('Runtime.enable',{},worker);await evaluate(worker,"globalThis.events=[];chrome.webNavigation.onCreatedNavigationTarget.addListener(x=>events.push(x));true");await sleep(300);
 await send('Target.closeTarget',{targetId:internal.targetId});
 await measure('worker-restart-cmd-link',()=>click(page.sessionId,'#link','left',4));
 await measure('worker-restart-borrowed-popup',()=>click(page.sessionId,'#attack'));
 await setting({popupMode:'balanced'});await measure('balanced-borrowed-popup',()=>click(page.sessionId,'#attack'));
 await setting({popupMode:'off'});await measure('off-borrowed-popup',()=>click(page.sessionId,'#attack'));
 const result={recorderProbe,version:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,browser:(await send('Browser.getVersion')).product,observations,errors,observedAt:new Date().toISOString()};await writeFile(path.join(dir,'observation.json'),JSON.stringify(result,null,2));console.log('Saved '+path.join(dir,'observation.json'));
}finally{ws?.close();child.kill('SIGTERM');for(const response of held)response.destroy();server.closeAllConnections();server.close();}
