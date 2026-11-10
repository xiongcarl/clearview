// Rule kinds the lists carry beyond blocking and hiding, checked in a real browser:
// selector:style(...), :remove-attr()/:remove-class(), and $popup.
// Usage: node tools/test-list-rules.mjs [extension folder]
import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdtemp,readFile} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=process.argv[2] || fileURLToPath(new URL('../extension/',import.meta.url));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const json=async p=>JSON.parse(await readFile(path.join(root,p),'utf8'));
const plainHost=x=>/^[a-z0-9.-]+$/.test(x) && !x.endsWith('.*');
// Pick the cases from the shipped data so the test follows list updates.
const extended=await json('data/extended-cosmetics.json');
const style=extended.fixes.styles.find(x=>!x.exception && x.include.length && plainHost(x.include[0]) && !x.exclude.length && /^#[a-z][\w-]*$/i.test(x.selector) && /^(?:height|min-height|max-height)\s*:\s*\d+px\s*!important$/i.test(x.style));
assert.ok(style,'a simple :style() rule exists');
const popups=await json('data/engine/popups.json');
const popup=popups.find(x=>x.h && !x.inc && !x.exc && !x.tp && !x.x && !popups.some(y=>y.x && y.h===x.h));assert.ok(popup,'a host popup rule exists');
const fixData=await Promise.all(Array.from({length:32},(_,i)=>readFile(path.join(root,`fixes/data-${i}.js`),'utf8')));
let removal;for(const text of fixData){const m=text.match(/^globalThis\.__clearviewFixes\?\.\((\{.*\}),(\[.*\])\);\s*$/s);if(!m)continue;const keys=JSON.parse(m[1]),records=JSON.parse(m[2]);
  for(const [host,ids] of Object.entries(keys)){if(!plainHost(host))continue;const id=ids.find(i=>records[i][0]==='remove-class' && /^[.#][\w-]+(?:\.[\w-]+)*$/.test(records[i][2][1]) && !records[i][3].length);if(id!==undefined){removal={host,name:records[id][2][0],selector:records[id][2][1]};break;}}
  if(removal)break;}
assert.ok(removal,'a simple :remove-class() rule exists');
const profile=await mkdtemp(path.join(os.tmpdir(),'clearview-rules-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-first-run',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let failed=true;
try{
  let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{await sleep(100);}}
  const ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise(r=>ws.onopen=r);
  let seq=0;const pending=new Map(),listeners=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method)listeners.forEach(l=>l(m));const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}};
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}));});
  const extensionId=(await send('Extensions.loadUnpacked',{path:root})).id;await sleep(4000);
  const evaluate=async(session,expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true},session);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails).slice(0,400));return r.result.value;};
  // A tab whose requests to the given hosts are answered locally.
  async function page(pages){
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    await send('Page.enable',{},sessionId);await send('Fetch.enable',{patterns:[{urlPattern:'https://*'}]},sessionId);
    listeners.push(m=>{if(m.method!=='Fetch.requestPaused' || m.sessionId!==sessionId)return;const host=new URL(m.params.request.url).hostname;const body=pages[host];
      (body===undefined?send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'},sessionId):send('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'text/html'}],body:Buffer.from(body).toString('base64')},sessionId)).catch(()=>{});});
    return {targetId,sessionId,go:async url=>{await send('Page.navigate',{url},sessionId);await sleep(2500);}};
  }
  const pageTargets=async()=>(await send('Target.getTargets')).targetInfos.filter(t=>t.type==='page');
  // 1. selector:style(...)
  const styleHost=style.include[0],id=style.selector.slice(1);
  const a=await page({[styleHost]:`<!doctype html><body><div id="${id}" style="height:200px">slot</div><div id="other" style="height:200px">content</div>`});
  await a.go(`https://${styleHost}/`);
  const want=style.style.match(/(\d+)px/)[1]+'px';const property=style.style.split(':')[0].trim();
  assert.equal(await evaluate(a.sessionId,`getComputedStyle(document.getElementById(${JSON.stringify(id)})).getPropertyValue(${JSON.stringify(property)})`),want,`${styleHost}##${style.selector}:style(${style.style}) applies`);
  assert.equal(await evaluate(a.sessionId,`getComputedStyle(document.getElementById('other')).height`),'200px','other elements keep their own style');
  console.log(`PASS :style() rule applies on ${styleHost}`);
  // 2. :remove-class()
  const classes=removal.selector.split(/(?=[.#])/).filter(x=>x.startsWith('.')).map(x=>x.slice(1));const elementId=(removal.selector.match(/#([\w-]+)/) || [])[1] || 'target';
  const b=await page({[removal.host]:`<!doctype html><body><div id="${elementId}" class="${[...new Set([...classes,removal.name,'keep'])].join(' ')}">x</div>`});
  await b.go(`https://${removal.host}/`);await b.go(`https://${removal.host}/?again`);
  const left=await evaluate(b.sessionId,`document.getElementById(${JSON.stringify(elementId)}).className`);
  assert.ok(!left.split(/\s+/).includes(removal.name),`${removal.host}: class ${removal.name} removed (left "${left}")`);assert.ok(left.split(/\s+/).includes('keep'),'other classes stay');
  console.log(`PASS :remove-class() rule applies on ${removal.host}`);
  // 3. $popup
  const c=await page({'news.example.com':`<!doctype html><body style="margin:0"><a id="listed" target="_blank" href="https://${popup.h}/chosen" style="display:block;width:300px;height:50px">a link to a listed site</a><a id="hijacked" target="_blank" href="https://www.example.org/story" onclick="window.open('https://${popup.h}/under')" style="display:block;width:300px;height:50px">a link with a popunder</a>`});await c.go('https://news.example.com/');
  const open=async url=>{const before=new Set((await pageTargets()).map(t=>t.targetId));await evaluate(c.sessionId,`window.open(${JSON.stringify(url)},'_blank');true`);await sleep(2500);return (await pageTargets()).filter(t=>!before.has(t.targetId));};
  const blocked=await open(`https://${popup.h}/landing?x=1`);
  assert.equal(blocked.length,0,`popup to ${popup.h} is closed`);
  const kept=await open('https://www.example.org/article');
  assert.equal(kept.length,1,'an ordinary new tab stays open');
  console.log(`PASS $popup rule closes a tab opened to ${popup.h}; an ordinary one stays`);
  // A link the user clicks opens even when its destination is listed (EasyList lists
  // canyoublockit.com as a popup; a search result pointing there must still open).
  const click=async(x,y)=>{const before=new Set((await pageTargets()).map(t=>t.targetId));for(const type of ['mouseMoved','mousePressed','mouseReleased'])await send('Input.dispatchMouseEvent',{type,x,y,button:type==='mouseMoved'?'none':'left',clickCount:type==='mouseMoved'?0:1},c.sessionId);await sleep(2500);return (await pageTargets()).filter(t=>!before.has(t.targetId));};
  const chosen=await click(100,25);
  assert.equal(chosen.length,1,'a clicked link to a listed site stays open');assert.ok(chosen[0].url.includes(popup.h) || chosen[0].url.startsWith('chrome-error:'),'it is the tab the link asked for');
  console.log('PASS a clicked link to a listed site opens');
  const hijacked=await click(100,75);
  // Chrome spends the click on the script's window.open, so only the popunder would exist.
  assert.equal(hijacked.filter(t=>t.url.includes(popup.h)).length,0,'a popunder fired from a click on another link is closed');
  console.log('PASS a popunder fired from a click on a different link is closed');
  // Popup mode "off" leaves popups alone.
  const {sessionId:ui}=await send('Target.attachToTarget',{targetId:(await send('Target.createTarget',{url:`chrome-extension://${extensionId}/popup.html`})).targetId,flatten:true});await sleep(1000);
  // The worker may be asleep; the first message wakes it and can miss it.
  let saved=false;for(let i=0;i<5 && !saved;i++){try{saved=await evaluate(ui,`chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>chrome.runtime.sendMessage({type:'SET_SETTINGS',settings:{...r.settings,popupMode:'off'}})).then(r=>r.ok)`);}catch{await sleep(500);}}
  assert.ok(saved,'popup mode saved');await sleep(800);
  const off=await open(`https://${popup.h}/landing?x=2`);
  assert.equal(off.length,1,'popup mode off does not close tabs');
  console.log('PASS popup mode off leaves the tab open');
  console.log('List rule checks passed.');failed=false;
}finally{chrome.kill('SIGTERM');}
process.exit(failed?1:0);
