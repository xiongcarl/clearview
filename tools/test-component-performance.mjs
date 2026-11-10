// Isolated component experience probe. Never uses the everyday Chrome profile.
import {respondComponentFixture} from './component-fixtures.mjs';
import {selectorIndexFixture} from './selector-index-fixtures.mjs';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||fileURLToPath(new URL('../extension/',import.meta.url))),label=process.argv[3]||'probe';
if(!/^[a-z0-9-]{1,50}$/.test(label))throw Error('Invalid label');
const dir=fileURLToPath(new URL('../testing-output/component-performance/',import.meta.url));await mkdir(dir,{recursive:true});const profile=path.join(dir,'profile-'+label);await rm(profile,{recursive:true,force:true});await mkdir(profile,{recursive:true});
const server=createServer((req,res)=>{if(!respondComponentFixture(req,res)){res.setHeader('Content-Type','text/plain');res.end('Probe');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port+'/components';
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0','--enable-unsafe-extension-debugging',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='',ws,seq=0;child.stderr.on('data',d=>stderr+=d);const pending=new Map(),contexts=[];
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout '+method));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,sessionId}));});
async function evaluate(sessionId,expression,contextId){const r=await send('Runtime.evaluate',{expression,contextId,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function attach(url){const {targetId}=await send('Target.createTarget',{url});return {targetId,...await send('Target.attachToTarget',{targetId,flatten:true})};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(sessionId,predicate){for(let i=0;i<160;i++){if(await evaluate(sessionId,predicate))return;await sleep(50);}throw Error('Readiness '+predicate);}
try{
 let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{}await sleep(100);}if(!lines)throw Error(stderr.slice(-1000));
 ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.executionContextCreated')contexts.push({sessionId:m.sessionId,...m.params.context});const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);};
 const browser=await send('Browser.getVersion'),{id}=await send('Extensions.loadUnpacked',{path:root});const popup=await attach(`chrome-extension://${id}/popup.html`);
 await ready(popup.sessionId,"!!document.querySelector('#enabled') && !document.querySelector('#enabled').disabled");const config=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})");if(!config.ok||config.info.initializationError)throw Error(JSON.stringify(config));
 const start=performance.now(),page=await attach(url),s=page.sessionId;await send('Runtime.enable',{},s);await ready(s,"window.fixtureReady && refs['closed-host'].root.adoptedStyleSheets.some(s=>s.cssRules.length>100) && getComputedStyle(refs['closed-host'].root.querySelector('ins')).display==='none'");
 const initialFilteringMs=performance.now()-start;
 let contextId;for(const context of contexts.filter(x=>x.sessionId===s && !x.auxData?.isDefault)){if(await evaluate(s,"typeof AdShieldShadows!=='undefined'",context.id)){contextId=context.id;break;}}if(!contextId)throw Error('Extension context unavailable');
 const parity=await evaluate(s,'('+selectorIndexFixture.toString()+')()',contextId);if(parity.mismatches?.length)throw Error('Selector parity '+JSON.stringify(parity));
 await evaluate(s,`{globalThis.probeStats={};for(const name of ['track','adopt','reviewInline','applyManual','invalidate']){const fn=AdShieldShadows.Filter.prototype[name];AdShieldShadows.Filter.prototype[name]=function(...args){const t=performance.now();try{return fn.apply(this,args);}finally{const metric=probeStats[name]||={count:0,totalMs:0,maxMs:0};const ms=performance.now()-t;metric.count++;metric.totalMs+=ms;metric.maxMs=Math.max(metric.maxMs,ms);}};}}`,contextId);
 await evaluate(s,"{window.longTasks=[];new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(x=>({start:x.startTime,ms:x.duration})))).observe({type:'longtask',buffered:false});}");
 const batches=[];
 for(let run=0;run<5;run++){
  await evaluate(s,`{window.batchStart=performance.now();window.batchPrefix='b${run}-';for(let i=0;i<150;i++)component(batchPrefix+i,i%2?'open':'closed');}`);
  await ready(s,"Array.from({length:150},(_,i)=>refs[batchPrefix+i]).every(x=>x.root.adoptedStyleSheets.some(sheet=>sheet.cssRules.length>100) && getComputedStyle(x.root.querySelector('ins')).display==='none')");
  batches.push(await evaluate(s,"({elapsedMs:performance.now()-batchStart,normalVisible:Array.from({length:150},(_,i)=>refs[batchPrefix+i]).filter(x=>getComputedStyle(x.root.querySelector('#safe')).display!=='none').length})"));
  if(run<4)await evaluate(s,"{for(let i=0;i<150;i++){refs[batchPrefix+i].host.remove();delete refs[batchPrefix+i];}} ");await sleep(1800);
 }
 const batchStats=await evaluate(s,'probeStats',contextId),batchLongTasks=await evaluate(s,'longTasks');
 await evaluate(s,"{window.idleTasksStart=performance.now();window.longTasks=[]}");await evaluate(s,'globalThis.probeStats={}',contextId);
 await sleep(5000);
 const idleStats=await evaluate(s,'probeStats',contextId),idleLongTasks=await evaluate(s,'longTasks');
 const out={label,browser:browser.product,extensionVersion:JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')).version,sourceSHA256:crypto.createHash('sha256').update(await readFile(path.join(root,'shadow-filtering.js'))).digest('hex'),settings:config.settings,parity,initialFilteringMs,batches,batchStats,batchLongTasks,idleStats,idleLongTasks};
 await writeFile(path.join(dir,label+'.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
}finally{ws?.close();child.kill('SIGTERM');server.close();}
