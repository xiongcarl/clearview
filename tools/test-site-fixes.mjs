// A host's fixes can sit in several data files; all of them must run on every visit,
// including a fresh tab on the very first visit for known hosts.
// Usage: node tools/test-site-fixes.mjs [extension folder]
import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdtemp,readFile} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=process.argv[2] || fileURLToPath(new URL('../extension/',import.meta.url));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const profile=await mkdtemp(path.join(os.tmpdir(),'clearview-fixes-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-first-run',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{await sleep(100);}}
const ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map(),listeners=[];
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}));});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method)listeners.forEach(l=>l(m));const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const html=`<!doctype html><title>t</title><script>var ytInitialPlayerResponse={adPlacements:[1],playerAds:[2],adSlots:[3],x:1};window.__seen=JSON.stringify(ytInitialPlayerResponse);</script>`;
try{
  await send('Extensions.loadUnpacked',{path:root});await sleep(4000);
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId:s}=await send('Target.attachToTarget',{targetId,flatten:true});
  await send('Runtime.enable',{},s);await send('Page.enable',{},s);await send('Fetch.enable',{patterns:[{urlPattern:'https://www.youtube.com/clearview-test*'}]},s);
  listeners.push(m=>{if(m.method==='Fetch.requestPaused')send('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'text/html'}],body:Buffer.from(html).toString('base64')},s).catch(()=>{});});
  for(const visit of ['first','second','third']){
    await send('Page.navigate',{url:'https://www.youtube.com/clearview-test?'+visit},s);await sleep(1500);
    const {result}=await send('Runtime.evaluate',{expression:'window.__seen',returnByValue:true},s);
    assert.equal(result.value,'{"x":1}',`Fixes from every data file apply on the ${visit} visit`);
    console.log(`PASS ${visit} visit: ad fields removed before the page reads them`);
  }
  console.log('Site fixes checks passed.');
}finally{ws.close();chrome.kill('SIGTERM');}
