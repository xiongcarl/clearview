import {respondComponentFixture,runComponentTests} from './component-fixtures.mjs';
// Mac Chrome integration fixtures. GPL-3.0-or-later. Never uses your browser profile.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile, writeFile, mkdir, rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const extensionRoot=fileURLToPath(new URL('../extension/',import.meta.url));
const testDirectory=path.join(extensionRoot,'testing-output');
await mkdir(testDirectory,{recursive:true});
const profile = path.join(testDirectory,'component-test-profile');
await rm(profile,{recursive:true,force:true});
await mkdir(profile,{recursive:true});
let originalAdHits=0;
const server = createServer((req,res)=>{
  if(req.headers.host?.startsWith('doubleclick.net:'))originalAdHits++;
  res.setHeader('Access-Control-Allow-Origin','*');
  if(respondComponentFixture(req,res))return;
  if(req.url.startsWith('/payments') || req.url.startsWith('/ordinary')){res.setHeader('Content-Type','application/json');res.end('{"ads_disabled":false,"keep":1}');return;}
  if(req.url.startsWith('/tag/js/gpt.js') || req.url.startsWith('/fuckadblock-')){res.setHeader('Content-Type','application/javascript');res.end('window.__realGptLoaded=true;');return;}
  if(req.url.startsWith('/early')){res.setHeader('Content-Type','text/html');res.end('<!doctype html><script>window.blurred=true;window.__entityFix=window.blurred;window.nsShowMaxCount=99;window.__earlyFix=window.nsShowMaxCount;window.__parsedFix=JSON.parse(\'{"enabled":true,"force_disabled":true,"keep":1}\');</script><p>Fixture</p>');return;}
  if(req.url.startsWith('/advanced')){res.setHeader('Content-Type','text/html');res.end('<!doctype html><div id=advanced-ad class="dark:border-gray-700">Advertisement</div><div id=advanced-safe class="dark:border-gray-700">Normal content</div><strong id=regex-ad>ANZEIGE</strong><strong id=regex-safe>News</strong>');return;}
  if(req.url.startsWith('/benchmark')){res.setHeader('Content-Type','text/html');res.end('<!doctype html><main>'+Array.from({length:3000},(_,i)=>'<article class=card><h2>Story '+i+'</h2><p>Normal content</p></article>').join('')+'</main>');return;}
  if(req.url.startsWith('/88/') || req.url.startsWith('/.webscale/') || req.url.startsWith('/1-popupally-')){res.setHeader('Content-Type','text/plain');res.end('filter-test');return;}
  if(req.url.startsWith('/ad')){res.setHeader('Content-Type','text/plain');res.end('ad-response');return;}
  if(req.url.startsWith('/csp'))res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'none'; connect-src *");
  res.setHeader('Content-Type','text/html');
  res.end(`<!doctype html><meta charset="utf-8"><button id="open">Open one window</button><ins class="adsbygoogle">Ad placeholder</ins><p id="result"></p><div id="ad-banner" style="height:48px;background:#eee">Custom banner</div><div id="background" style="height:48px">Page background</div><a id="newlink" target="_blank" href="/destination">New window link</a><form id="form" target="_blank" action="/destination"><button id="submit">Submit form</button></form><script>
  document.querySelector('#open').onclick=()=>{window.result1=window.open('/destination','_blank')!==null; window.result2=window.open('/destination','_blank')!==null;};
  document.querySelector('#background').onclick=()=>{window.backgroundOpened=window.open('/destination','_blank')!==null;};
  </script>`);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
const url=`http://127.0.0.1:${port}/`;
const ad=`http://doubleclick.net:${port}/ad`;
const similar=`http://doubleclick.net.example.test:${port}/ad`;
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',[
  '--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking',
  '--remote-debugging-port=0','--enable-unsafe-extension-debugging','--no-proxy-server',
  '--host-resolver-rules=MAP doubleclick.net 127.0.0.1, MAP *.example.test 127.0.0.1, MAP timesofindia.indiatimes.com 127.0.0.1, MAP chip.de 127.0.0.1, MAP gamedev.net 127.0.0.1, MAP sport1.de 127.0.0.1, MAP googletagservices.com 127.0.0.1, MAP gplinks.co.uk 127.0.0.1, MAP app.vaia.com 127.0.0.1, MAP a.klaviyo.com 127.0.0.1',
  `--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let logs='';child.stderr.on('data',d=>logs+=d);
const workerErrors=[];let intercept; let ws; const pending=new Map();let seq=0;let completed=0;
async function send(method,params={},sessionId){
  const id=++seq;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error('Timed out: '+method));},30000);
    pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));
  });
}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});return {targetId,sessionId};}
async function evaluate(sessionId,expression){
  const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId).catch(error=>{throw new Error(error.message+' evaluating '+expression.slice(0,100));});
  if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function waitReady(s,predicate){for(let i=0;i<80;i++){if(await evaluate(s,predicate))return;await new Promise(r=>setTimeout(r,50));}throw new Error('Page readiness timeout: '+await evaluate(s, 'document.body?.innerText')); }
function check(name,actual,expected){assert.deepEqual(actual,expected,name);completed++;console.log('PASS '+name);}
try{
  let lines;
  for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await new Promise(r=>setTimeout(r,100));}
  if(!lines)throw new Error('Chrome failed: '+logs.slice(-1000));
  ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.consoleAPICalled' && m.params.type==='error')workerErrors.push(m.params.args.map(x=>x.value || x.description || '').join(' '));if(m.method==='Fetch.requestPaused' && intercept){intercept(m).catch(error=>console.error(error));return;}const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);};
  const {id}=await send('Extensions.loadUnpacked',{path:extensionRoot});
  const popup=await attach(`chrome-extension://${id}/popup.html`);
  await waitReady(popup.sessionId,`typeof chrome?.runtime?.sendMessage==='function' && document.getElementById('enabled') && !document.getElementById('enabled').disabled`);
  async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:value})})`);assert.equal(r.ok,true,JSON.stringify(r));return r.settings;}
  const defaults={enabled:true,strict:false,directBlocking:false,whitelist:[],webFilters:{easylist:false,easyprivacy:false,chinese:false,annoyances:false,fixes:false}};
  const advancedProfile={...defaults,webFilters:{easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true}};
  await runComponentTests({settings,defaults,advancedProfile,attach,url,port,evaluate,popup,waitReady,check,send,testDirectory});
  console.log(`${completed} focused component browser checks passed.`);
  await writeFile(path.join(testDirectory,'component-test-result.txt'),`${completed} browser component checks passed\n${new Date().toISOString()}\n`);
}finally{ws?.close();child.kill('SIGTERM');server.close();}
