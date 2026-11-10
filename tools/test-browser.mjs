import {respondStaticPolicyFixture,runStaticPolicyTests} from './static-policy-fixtures.mjs';
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
const profile = path.join(testDirectory,'browser-test-profile');
await rm(profile,{recursive:true,force:true});
await mkdir(profile,{recursive:true});
let originalAdHits=0;let staticAdHits=0;
const server = createServer((req,res)=>{
  if(req.headers.host?.startsWith('doubleclick.net:'))originalAdHits++;
  if(req.headers.host?.startsWith('succeedscene.com'))staticAdHits++;
  res.setHeader('Access-Control-Allow-Origin','*');
  if(respondStaticPolicyFixture(req,res))return;
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
  `--host-resolver-rules=MAP succeedscene.com 127.0.0.1:${port}, MAP doubleclick.net 127.0.0.1, MAP *.example.test 127.0.0.1, MAP timesofindia.indiatimes.com 127.0.0.1, MAP chip.de 127.0.0.1, MAP gamedev.net 127.0.0.1, MAP sport1.de 127.0.0.1, MAP googletagservices.com 127.0.0.1, MAP gplinks.co.uk 127.0.0.1, MAP app.vaia.com 127.0.0.1, MAP a.klaviyo.com 127.0.0.1`,
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
  async function settings(value){const r=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:value})})`);if(!r.ok)console.error('SETTINGS FAILURE',JSON.stringify({response:r,workerErrors}));assert.equal(r.ok,true,JSON.stringify(r));return r.settings;}
  const fresh=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})");
  check('Fresh install preserves compatibility substitutions by default',fresh.settings.directBlocking,false);
  check('Fresh install enables component advertising filtering',fresh.settings.shadowAds,true);
  check('Fresh install leaves broad extra tracking restriction optional',fresh.settings.enhancedTracking,false);
  check('Fresh install preserves native navigation by default',fresh.settings.popupMode,'balanced');
  check('Fresh install enables core lists with annoyances optional',fresh.info.webLists.length===5 && fresh.info.webLists.every(x=>x.enabled===(x.id!=='annoyances')),true);
  const defaults={enabled:true,strict:false,directBlocking:false,whitelist:[],webFilters:{easylist:false,easyprivacy:false,chinese:false,annoyances:false,fixes:false}};await settings(defaults);
  check('Balanced mode registers content filtering without a popup override',(await evaluate(popup.sessionId,'chrome.scripting.getRegisteredContentScripts().then(x=>x.map(s=>s.id).sort().join())')),'ad-style,generic-css');
  const page=await attach(url);const s=page.sessionId;
  await waitReady(s,`document.readyState==='complete' && !!document.querySelector('#open')`);
  async function navigate(){await send('Page.navigate',{url:'about:blank'},s);await waitReady(s,`location.href==='about:blank'`);await send('Page.navigate',{url},s);await waitReady(s,`document.readyState==='complete' && !!document.querySelector('#open')`);}
  const allWeb={easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true};
  const fetchExpr=u=>`fetch(${JSON.stringify(u)}).then(r=>r.text()).catch(()=> 'BLOCKED')`;
  if(!process.argv.includes('--advanced-only') && !process.argv.includes('--race-only')){
  check('Known ad request blocked',await evaluate(s,fetchExpr(ad)),'BLOCKED');
  check('Look-alike domain is not blocked',await evaluate(s,fetchExpr(similar)),'ad-response');
  check('Balanced mode leaves native window.open intact',await evaluate(s,`window.open.toString().includes('[native code]')`),true);
  check('Balanced mode leaves native form submission intact',await evaluate(s,`HTMLFormElement.prototype.submit.toString().includes('[native code]')`),true);
  await waitReady(s,"getComputedStyle(document.querySelector('ins')).display==='none'");
  check('Known ad element hidden',await evaluate(s,`getComputedStyle(document.querySelector('ins')).display`),'none');
  async function realClick(selector='#open'){const point=await evaluate(s,`(()=>{let r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1},s);await send('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1},s);}
  check('Balanced mode has no MAIN-world popup guard',await evaluate(popup.sessionId,`chrome.scripting.getRegisteredContentScripts().then(x=>x.some(s=>s.id.startsWith('popup-'))) `),false);
  await settings({...defaults,strict:true});await navigate();await realClick();
  check('Strict mode blocks click-triggered scripted popups',await evaluate(s,'[result1,result2]'),[false,false]);
  check('Strict guard resists page replacement of window.open',await evaluate(s,"window.open=()=>({fake:true});window.open('/destination','_blank')===null"),true);
  await settings({...defaults,whitelist:['127.0.0.1']});await navigate();
  check('Whitelist allows known ad request',await evaluate(s,fetchExpr(ad)),'ad-response');
  check('Whitelist preserves native window.open',await evaluate(s,`window.open.toString().includes('[native code]')`),true);
  check('Whitelist restores ad element',await evaluate(s,`getComputedStyle(document.querySelector('ins')).display`),'inline');
  await settings({...defaults,enabled:false});await navigate();
  check('Global off removes registered scripts',await evaluate(popup.sessionId,'chrome.scripting.getRegisteredContentScripts().then(x=>x.length)'),0);
  check('Global off allows ad request',await evaluate(s,fetchExpr(ad)),'ad-response');
  await settings(defaults);

  check('Large offline list bundled', (await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>r.info.domainCount)")) > 64000, true);
  await settings({...defaults,popupMode:'strict'});await navigate();await realClick('#background');
  check('Explicit strict mode blocks a background-click popup',await evaluate(s,'backgroundOpened'),false);
  await settings({...defaults,popupMode:'strict'});await navigate();
  const targetCount=async()=>(await send('Target.getTargets')).targetInfos.filter(x=>x.type==='page').length;
  const strictCount=await targetCount();await realClick('#newlink');
  await new Promise(r=>setTimeout(r,400));
  check('Strict mode preserves a trusted plain new-window link',await targetCount(),strictCount+1);
  const formCount=await targetCount();await evaluate(s,"document.querySelector('#form').requestSubmit()");
  check('Automatic requestSubmit cannot open a form window',await targetCount(),formCount);
  await settings({...defaults,popupMode:'off'});await navigate();
  check('Popup protection can be switched off independently',await evaluate(s,"window.open.toString().includes('[native code]')"),true);
  check('Popup off still blocks ads',await evaluate(s,fetchExpr(ad)),'BLOCKED');
  await settings({...defaults,siteModes:[{host:'127.0.0.1',mode:'strict'}]});await navigate();await realClick();
  check('Per-site strict mode overrides balanced default',await evaluate(s,'[result1,result2]'),[false,false]);
  await settings({...defaults,siteModes:[{host:'127.0.0.1',mode:'off'}]});await navigate();
  check('Per-site popup off retains native open',await evaluate(s,"window.open.toString().includes('[native code]')"),true);
  await settings({...defaults,hideAds:false});await navigate();
  check('Built-in cosmetic hiding can be disabled',await evaluate(s,"getComputedStyle(document.querySelector('ins')).display"),'inline');
  const custom=`http://custom-block.example.test:${port}/ad`;
  await settings({...defaults,blockDomains:['custom-block.example.test']});
  check('Custom domain block works',await evaluate(s,fetchExpr(custom)),'BLOCKED');
  await settings({...defaults,blockDomains:['custom-block.example.test'],allowDomains:['custom-block.example.test','doubleclick.net']});
  check('Custom allow overrides custom block',await evaluate(s,fetchExpr(custom)),'ad-response');
  check('Custom allow overrides bundled list',await evaluate(s,fetchExpr(ad)),'ad-response');
  await settings({...defaults,cosmeticRules:[{host:'127.0.0.1',selector:'#ad-banner'}]});await navigate();
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display==='none'");
  check('User cosmetic rule persists on reload',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'none');
  await settings(defaults);
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display!=='none'");
  check('Removing custom cosmetic rule restores element immediately',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'block');
  // Exercise picker cancel and confirm through genuine Chrome input events.
  const tabId=await evaluate(popup.sessionId,`chrome.tabs.query({url:${JSON.stringify(url)}}).then(t=>t[0].id)`);
  async function startPicker(){const r=await evaluate(popup.sessionId,`chrome.tabs.sendMessage(${tabId},{type:'START_PICKER'},{frameId:0})`);assert.equal(r.ok,true,JSON.stringify(r));await waitReady(s,"!!document.querySelector('#ad-shield-picker-root')");}
  async function key(name,code){await send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code,windowsVirtualKeyCode:code==='Escape'?27:13},s);await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code,windowsVirtualKeyCode:code==='Escape'?27:13},s);}
  await startPicker();await key('Escape','Escape');
  check('Picker cancel removes UI and saves nothing',await evaluate(s,"!document.querySelector('#ad-shield-picker-root')"),true);
  await startPicker();await realClick('#ad-banner');await key('Enter','Enter');
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display==='none'");
  check('Picker confirmation stores a site-specific selector',await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'}).then(r=>r.settings.cosmeticRules[0].selector)"),'#ad-banner');
  await navigate();await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display==='none'");
  check('Picker-hidden element stays hidden after reload',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'none');
  await settings(defaults);
  await send('Page.navigate',{url:url+'csp'},s);await waitReady(s,"document.readyState==='complete' && !!document.querySelector('#ad-banner')");
  const cspTab=await evaluate(popup.sessionId,`chrome.tabs.query({url:${JSON.stringify(url+'csp')}}).then(t=>t[0].id)`);
  const cspPicker=await evaluate(popup.sessionId,`chrome.tabs.sendMessage(${cspTab},{type:'START_PICKER'},{frameId:0})`);
  check('Picker starts on a page with restrictive style CSP',cspPicker.ok,true);
  await realClick('#ad-banner');await key('Enter','Enter');
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display==='none'");
  check('Custom hiding works despite restrictive page CSP',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'none');
  await settings(defaults);await navigate();
  await settings({...defaults,autoUpdate:true});
  check('Daily updater creates persistent alarm',await evaluate(popup.sessionId,"chrome.alarms.get('update-list').then(x=>x.periodInMinutes)"),1440);
  await settings(defaults);
  check('Turning off automatic updates clears alarm',await evaluate(popup.sessionId,"chrome.alarms.get('update-list').then(x=>!!x)"),false);
  // Mock only the list download; all blocking and UI behavior uses real Chrome APIs.
  const worker=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='service_worker' && x.url===`chrome-extension://${id}/background.js`);
  const {sessionId:workerSession}=await send('Target.attachToTarget',{targetId:worker.targetId,flatten:true});
  const listUrl='https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/light-onlydomains.txt';
  await send('Fetch.enable',{patterns:[{urlPattern:listUrl,requestStage:'Request'}]},workerSession);
  const source=await readFile(path.join(extensionRoot,'data/source-domains.txt'),'utf8');
  const downloaded=source.replace('# Number of entries: 64048','# Number of entries: 64049')+'\nremote-list-test.example.test\n';
  let payload=downloaded;let failDownload=false;
  intercept=async event=>{if(failDownload){await send('Fetch.failRequest',{requestId:event.params.requestId,errorReason:'InternetDisconnected'},event.sessionId);}else{await send('Fetch.fulfillRequest',{requestId:event.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'text/plain'}],body:Buffer.from(payload).toString('base64')},event.sessionId);}};
  await settings({...defaults,blockDomains:['custom-block.example.test']});
  let response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'UPDATE_LIST'})");
  check('Validated list update activates downloaded domains',response.ok,true);
  const remote=`http://remote-list-test.example.test:${port}/ad`;
  check('Newly downloaded domain actually blocked',await evaluate(s,fetchExpr(remote)),'BLOCKED');
  check('List update preserves custom rules',response.settings.blockDomains,['custom-block.example.test']);
  payload=source.slice(0,2000);
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'UPDATE_LIST'})");
  check('Truncated list is rejected',response.ok,false);
  check('Failed update preserves previous blocking',await evaluate(s,fetchExpr(remote)),'BLOCKED');
  failDownload=true;
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'UPDATE_LIST'})");
  check('Offline update failure reported',response.ok,false);
  check('Offline failure leaves last good list active',await evaluate(s,fetchExpr(remote)),'BLOCKED');
  failDownload=false;payload=downloaded;
  await settings({...defaults,enabled:false});
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'UPDATE_LIST'})");
  check('Updating while paused does not enable blocking',response.ok && (await evaluate(s,fetchExpr(remote)))==='ad-response',true);
  await settings(defaults);
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'RESET_LIST'})");
  check('Restore bundled list succeeds',response.ok,true);
  check('Restore removes downloaded-only block',await evaluate(s,fetchExpr(remote)),'ad-response');
  check('Restore keeps bundled ads blocked',await evaluate(s,fetchExpr(ad)),'BLOCKED');
  await send('Fetch.disable',{},workerSession);intercept=null;

  response=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...defaults,webFilters:allWeb}})})`);
  if(!response.ok)throw new Error('Full profile: '+JSON.stringify(response));
  check('All five converted web lists accepted by Chrome',response.ok && response.info.webLists.every(x=>x.enabled),true);
  check('More than 120000 compiled network rules enabled',response.info.webLists.reduce((sum,x)=>sum+x.networkRules,0)>120000,true);
  check('EasyList blocks same-origin advertising path',await evaluate(s,fetchExpr(url+'88/tag.min.js')),'BLOCKED');
  check('EasyPrivacy blocks same-origin tracking path',await evaluate(s,fetchExpr(url+'.webscale/rum?test=1')),'BLOCKED');
  check('Annoyance list blocks newsletter script path',await evaluate(s,fetchExpr(url+'1-popupally-pro-code.js')),'BLOCKED');
  await navigate(); // Global selectors are a stylesheet injected at page start.
  await evaluate(s,"{const el=document.createElement('div');el.id='web-ad';el.className='ADBAR';el.textContent='test';document.body.append(el);}");
  await waitReady(s,"getComputedStyle(document.querySelector('#web-ad')).display==='none'");
  check('Generic EasyList cosmetic filtering hides inserted ads',await evaluate(s,"getComputedStyle(document.querySelector('#web-ad')).display"),'none');
  await settings({...defaults,webFilters:allWeb,allowDomains:['127.0.0.1']});
  check('User allow still overrides mature network lists',await evaluate(s,fetchExpr(url+'88/tag.min.js')),'filter-test');
  await settings({...defaults,webFilters:allWeb,whitelist:['127.0.0.1']});
  check('Top-level site pause allows matching ad paths',await evaluate(s,fetchExpr(url+'88/tag.min.js')),'filter-test');
  await settings({...defaults,webFilters:allWeb});await navigate();
  await evaluate(s,`{const frame=document.createElement('iframe');frame.id='test-frame';frame.src=${JSON.stringify(`http://frames.example.test:${port}/frame`)};document.body.append(frame);}`);
  let frameSession;
  for(let i=0;i<80;i++){const target=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='iframe' && x.url.includes('frames.example.test'));if(target){frameSession=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true})).sessionId;break;}await new Promise(r=>setTimeout(r,50));}
  if(!frameSession)throw new Error('Cross-origin frame target unavailable');
  await waitReady(frameSession,"!!document.querySelector('ins') && getComputedStyle(document.querySelector('ins')).display==='none'");
  check('Cross-origin iframe ads receive cosmetic filtering',await evaluate(frameSession,"getComputedStyle(document.querySelector('ins')).display"),'none');
  await settings({...defaults,webFilters:allWeb,whitelist:['127.0.0.1']});
  await waitReady(frameSession,"getComputedStyle(document.querySelector('ins')).display!=='none'");
  check('Top-site whitelist restores cross-origin frame cosmetics',await evaluate(frameSession,"getComputedStyle(document.querySelector('ins')).display"),'inline');
  await settings({...defaults,logging:true});
  await evaluate(s,fetchExpr(ad));
  await waitReady(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_LOGS'}).then(r=>r.logs.some(x=>x.url.includes('doubleclick.net')))");
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_LOGS'})");
  check('Opt-in local logger records actual rule matches',response.logs.some(x=>['ads','enhanced'].includes(x.rulesetId) && x.action==='block'),true);
  await evaluate(s,fetchExpr(ad+'?private=value#secret'));
  await new Promise(r=>setTimeout(r,50));
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_LOGS'})");
  check('Diagnostic URLs omit query and fragments',response.logs.every(x=>!x.url.includes('?') && !x.url.includes('#')),true);
  await settings(defaults);
  response=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_LOGS'})");
  check('Disabling diagnostics clears session records',response.logs.length,0);
  await navigate();

  }
  // Reproduce stale-document races with actual Chrome injection APIs. Only
  // delay the operation in the test worker; Chrome produces the real rejection.
  const raceWorker=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='service_worker' && x.url===`chrome-extension://${id}/background.js`);
  const {sessionId:raceWorkerSession}=await send('Target.attachToTarget',{targetId:raceWorker.targetId,flatten:true});
  await send('Runtime.enable',{},raceWorkerSession);
  await settings({...defaults,popupMode:'strict',whitelist:['race-white.example.test']});
  const racePage=await attach(url+'?race-start');
  const rs=racePage.sessionId;
  await waitReady(rs,"document.readyState==='complete' && getComputedStyle(document.querySelector('ins')).display==='none'");
  const raceTabId=await evaluate(raceWorkerSession,`chrome.tabs.query({}).then(tabs=>tabs.find(x=>x.url===${JSON.stringify(url+'?race-start')}).id)`);
  await evaluate(raceWorkerSession,`{
    globalThis.__raceNatives={};
    for(const method of ['insertCSS','removeCSS','executeScript']){
      const native=chrome.scripting[method].bind(chrome.scripting);__raceNatives[method]=native;
      chrome.scripting[method]=async options=>{
        const race=globalThis.__race;
        if(race && !race.hit && race.method===method && options.target.tabId===race.tabId){
          race.hit=true;race.target=options.target;race.options=options;
          await new Promise(resolve=>race.release=resolve);
          try{const result=await native(options);race.completed=true;return result;}
          catch(error){race.nativeError=error.message;throw error;}
        }
        return native(options);
      };
    }
  }`);
  async function armRace(method){await evaluate(raceWorkerSession,`queue.then(()=>{globalThis.__race={method:${JSON.stringify(method)},tabId:${raceTabId},hit:false};})`);workerErrors.length=0;}
  async function releaseRace(){await evaluate(raceWorkerSession,'__race.release()');await evaluate(raceWorkerSession,'Promise.all([queue,...pageChains.values()]).then(()=>true)');console.log('RACE '+JSON.stringify(await evaluate(raceWorkerSession,"({method:__race.method,target:__race.target,nativeError:__race.nativeError,completed:__race.completed})")));}
  async function detachedFrameRace(method){
    await armRace(method);
    await evaluate(rs,`{const frame=document.createElement('iframe');frame.id='race-frame';frame.src=${JSON.stringify(url+'?race-frame')};document.body.append(frame);}`);
    await waitReady(raceWorkerSession,'!!__race.hit');
    await evaluate(rs,"document.querySelector('#race-frame').remove()");
    await releaseRace();
    check('Chrome reproduces missing document during '+method,await evaluate(raceWorkerSession,"__race.nativeError?.startsWith('No document with id ')"),true);
    check('Detached frame '+method+' does not become an extension error',workerErrors.length,0);
  }
  await detachedFrameRace('insertCSS');
  await detachedFrameRace('executeScript');
  // A live content script requests removal of previously applied CSS on refresh.
  await armRace('removeCSS');
  await settings({...defaults,whitelist:['race-white.example.test'],hideAds:false});
  await waitReady(raceWorkerSession,'!!__race.hit');
  await send('Page.navigate',{url:'about:blank'},rs);await waitReady(rs,"location.href==='about:blank'");
  await releaseRace();
  check('Chrome handles CSS removal after its document disappears',await evaluate(raceWorkerSession,"__race.completed===true || !!__race.nativeError"),true);
  check('Navigation during CSS removal does not become an extension error',workerErrors.length,0);
  await settings({...defaults,whitelist:['race-white.example.test']});
  await armRace('insertCSS');
  await send('Page.navigate',{url:url+'?race-old'},rs);
  await waitReady(raceWorkerSession,'!!__race.hit');
  const whiteUrl=`http://race-white.example.test:${port}/?race-white`;
  await send('Page.navigate',{url:whiteUrl},rs);
  await waitReady(rs,"document.readyState==='complete' && !!document.querySelector('ins') && location.hostname==='race-white.example.test'");
  await releaseRace();
  check('Stale policy is not injected into the replacement whitelisted page',await evaluate(rs,"getComputedStyle(document.querySelector('ins')).display"),'inline');
  check('Replacement whitelist retains native popup behavior',await evaluate(rs,"window.open.toString().includes('[native code]')"),true);
  check('Navigation during CSS insertion does not become an extension error',workerErrors.length,0);
  // Closing a whole tab has a distinct Chrome rejection.
  const closePage=await attach(url+'?race-close-start');
  await waitReady(closePage.sessionId,"document.readyState==='complete' && getComputedStyle(document.querySelector('ins')).display==='none'");
  const closeTabId=await evaluate(raceWorkerSession,`chrome.tabs.query({}).then(tabs=>tabs.find(x=>x.url===${JSON.stringify(url+'?race-close-start')}).id)`);
  await evaluate(raceWorkerSession,`queue.then(()=>{globalThis.__race={method:'insertCSS',tabId:${closeTabId},hit:false};})`);workerErrors.length=0;
  await send('Page.navigate',{url:url+'?race-close'},closePage.sessionId);
  await waitReady(raceWorkerSession,'!!__race.hit');
  await send('Target.closeTarget',{targetId:closePage.targetId});
  await releaseRace();
  check('Closed tab produces the real Chrome missing-target error',await evaluate(raceWorkerSession,"__race.nativeError==='No tab with id: '+__race.tabId || __race.nativeError==='No tab with id: '+__race.tabId+'.' || __race.nativeError?.startsWith('No document with id ')"),true);
  check('Closed tab does not become an extension error',workerErrors.length,0);
  // Restore the API before checking that real faults still surface.
  await evaluate(raceWorkerSession,"{for(const [method,native] of Object.entries(__raceNatives))chrome.scripting[method]=native;delete globalThis.__race;}");
  check('Permission and unrelated-target errors are not treated as navigation',await evaluate(raceWorkerSession,`[
    targetDisappeared(new Error('Cannot access contents of the page.'),{tabId:7,documentIds:['abc']}),
    targetDisappeared(new Error('No document with id OTHER in tab with id 7'),{tabId:7,documentIds:['abc']}),
    targetDisappeared(new Error('No tab with id: 8.'),{tabId:7,documentIds:['abc']})
  ]`),[false,false,false]);
  workerErrors.length=0;
  await evaluate(raceWorkerSession,`{
    globalThis.__permissionFixtureHit=false;
    chrome.scripting.insertCSS=async options=>{
      if(options.target.tabId===${raceTabId} && !__permissionFixtureHit){__permissionFixtureHit=true;throw new Error('Cannot access contents of the page. Extension manifest must request permission to access the respective host.');}
      return __raceNatives.insertCSS(options);
    };
  }`);
  await send('Page.navigate',{url:url+'?race-permission-fixture'},rs);
  await waitReady(raceWorkerSession,'__permissionFixtureHit');
  await evaluate(raceWorkerSession,'Promise.all([queue,...pageChains.values()]).then(()=>true)');
  check('Permission failure on a live document remains visible',workerErrors.some(x=>x.includes('Cannot access contents of the page.')),true);
  await evaluate(raceWorkerSession,'chrome.scripting.insertCSS=__raceNatives.insertCSS');
  await send('Page.navigate',{url:url+'?race-recovered'},rs);
  await waitReady(rs,"document.readyState==='complete' && getComputedStyle(document.querySelector('ins')).display==='none'");
  check('Next document receives filtering after the aborted jobs',await evaluate(rs,"getComputedStyle(document.querySelector('ins')).display"),'none');
  const recovered=await evaluate(popup.sessionId,"chrome.runtime.sendMessage({type:'GET_SETTINGS'})");
  check('Settings queue remains usable after stale and genuine failures',recovered.ok,true);
  await send('Target.closeTarget',{targetId:racePage.targetId});
  await settings(defaults);

  if(!process.argv.includes('--race-only')){
  // A host is learned on its first visit; a tab created at that moment can beat the registration.
  async function attachLearned(address){await evaluate(raceWorkerSession,`readSettings().then(s=>learnHost(${JSON.stringify(new URL(address).hostname)},true,s)).then(()=>queue)`);return attach(address);}
  // New engines: real upstream rules, early scriptlets, reversibility and stubs.
  const advancedProfile={...defaults,enhancedTracking:true,webFilters:allWeb,popupMode:'balanced',scriptlets:true,procedural:true};
  await settings(advancedProfile);
  const early=await attachLearned(`http://timesofindia.indiatimes.com:${port}/early`);
  await waitReady(early.sessionId,"document.readyState==='complete' && '__earlyFix' in window");
  check('Packaged scriptlet runs before the first inline site script',await evaluate(early.sessionId,'window.__earlyFix'),0);
  await settings({...advancedProfile,scriptlets:false});
  await send('Page.navigate',{url:`http://timesofindia.indiatimes.com:${port}/early?off`},early.sessionId);
  await waitReady(early.sessionId,"location.search==='?off' && document.readyState==='complete'");
  check('Scriptlet toggle restores site property on reload',await evaluate(early.sessionId,'window.__earlyFix'),99);
  await settings({...advancedProfile,whitelist:['timesofindia.indiatimes.com']});
  await send('Page.navigate',{url:`http://timesofindia.indiatimes.com:${port}/early?white`},early.sessionId);
  await waitReady(early.sessionId,"location.search==='?white' && document.readyState==='complete'");
  check('Whitelist excludes document-start site scriptlets',await evaluate(early.sessionId,'window.__earlyFix'),99);
  await settings(advancedProfile);
  const entityPage=await attachLearned(`http://gplinks.co.uk:${port}/early`);
  await waitReady(entityPage.sessionId,"document.readyState==='complete' && '__entityFix' in window");
  check('Entity-scoped scriptlet handles a multi-label public suffix',await evaluate(entityPage.sessionId,'window.__entityFix'),false);
  const entityNegative=await attachLearned(`http://gplinks.example.test:${port}/early`);
  await waitReady(entityNegative.sessionId,"document.readyState==='complete' && '__entityFix' in window");
  check('Entity rule rejects a misleading domain prefix',await evaluate(entityNegative.sessionId,'window.__entityFix'),true);
  const jsonPage=await attachLearned(`http://chip.de:${port}/early`);
  await waitReady(jsonPage.sessionId,"document.readyState==='complete' && '__parsedFix' in window");
  check('Upstream JSON-pruning scriptlet removes ad data and keeps content',await evaluate(jsonPage.sessionId,'window.__parsedFix'),{force_disabled:true,keep:1});
  const responsePage=await attachLearned(`http://app.vaia.com:${port}/early`);
  // A newly created tab can briefly report a complete about:blank document.
  // The probe captured premature XHR before document-start scripts ran; wait
  // for the actual fixture and its first inline script, then assert rewriting.
  await waitReady(responsePage.sessionId,"location.hostname==='app.vaia.com' && document.readyState==='complete' && window.__earlyFix===99");
  const xhrExpression=route=>`new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('GET',${JSON.stringify(route)});xhr.onload=()=>resolve(JSON.parse(xhr.responseText));xhr.onerror=()=>reject(new Error('XHR failed'));xhr.send();})`;
  check('Compatible upstream response scriptlet rewrites targeted ad data',await evaluate(responsePage.sessionId,xhrExpression('/payments')),{ads_disabled:true,keep:1});
  check('Response scriptlet preserves an unmatched request',await evaluate(responsePage.sessionId,xhrExpression('/ordinary')),{ads_disabled:false,keep:1});
  check('XHR-only response rule preserves ordinary fetch behavior',await evaluate(responsePage.sessionId,"fetch('/payments').then(r=>r.json())"),{ads_disabled:false,keep:1});
  const proceduralPage=await attachLearned(`http://gamedev.net:${port}/advanced`);
  await waitReady(proceduralPage.sessionId,"document.readyState==='complete' && !!document.querySelector('#advanced-ad')");
  await waitReady(proceduralPage.sessionId,"document.querySelector('#advanced-ad') && getComputedStyle(document.querySelector('#advanced-ad')).display==='none'");
  check('Upstream text rule hides the matching sponsored element',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display"),'none');
  check('Text rule preserves a neighboring normal element',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-safe')).display"),'block');
  await settings({...advancedProfile,procedural:false});
  await waitReady(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display!=='none'");
  check('Disabling procedural rules immediately restores the element',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display"),'block');
  await settings(advancedProfile);
  await waitReady(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display==='none'");
  check('Re-enabling procedural rules reapplies them without reload',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display"),'none');
  await evaluate(proceduralPage.sessionId,"{const el=document.createElement('div');el.id='late-sponsored';el.className='dark:border-gray-700';el.textContent='Advertisement';document.body.append(el);}");
  await waitReady(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#late-sponsored')).display==='none'");
  check('Procedural engine watches dynamically inserted sponsored elements',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#late-sponsored')).display"),'none');
  await settings({...advancedProfile,whitelist:['gamedev.net']});
  await waitReady(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display!=='none'");
  check('Site whitelist restores procedural styles without reload',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display"),'block');
  await settings(advancedProfile);
  const regexPage=await attachLearned(`http://sport1.de:${port}/advanced`);
  await waitReady(regexPage.sessionId,"document.querySelector('#regex-ad') && getComputedStyle(document.querySelector('#regex-ad')).display==='none'");
  check('Upstream case-insensitive text regex selects the ad label',await evaluate(regexPage.sessionId,"[getComputedStyle(document.querySelector('#regex-ad')).display,getComputedStyle(document.querySelector('#regex-safe')).display]"),['none','inline']);
  // Custom advanced rules work even when automatic hiding is off.
  await settings({...defaults,hideAds:false,cosmeticRules:[{host:'127.0.0.1',selector:'#ad-banner:has-text(Custom):upward(1)'}]});
  await navigate();
  await new Promise(r=>setTimeout(r,100));
  check('Advanced parent selection cannot hide the whole document body',await evaluate(s,"getComputedStyle(document.body).display!=='none'"),true);
  await settings({...defaults,hideAds:false,cosmeticRules:[{host:'127.0.0.1',selector:'#ad-banner:has-text(Custom)'}]});
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display==='none'");
  check('Custom text selector works independently of automatic cosmetic setting',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'none');
  await settings({...defaults,enabled:false});
  await waitReady(s,"getComputedStyle(document.querySelector('#ad-banner')).display!=='none'");
  check('Global off restores manually applied procedural style',await evaluate(s,"getComputedStyle(document.querySelector('#ad-banner')).display"),'block');
  await settings(advancedProfile);await navigate();
  await evaluate(s,`new Promise(resolve=>{const script=document.createElement('script');script.src=${JSON.stringify(url+'fuckadblock-3.2.0.js')};script.onload=()=>resolve('LOADED');script.onerror=()=>resolve('BLOCKED');document.body.append(script);})`);
  check('Ad-library redirect loads a packaged compatibility stub',await evaluate(s,"typeof window.fuckAdBlock?.onDetected==='function' && !window.__realGptLoaded"),true);
  await settings({...advancedProfile,allowDomains:['127.0.0.1']});await navigate();
  await evaluate(s,`new Promise(resolve=>{const script=document.createElement('script');script.src=${JSON.stringify(url+'fuckadblock-3.2.0.js')};script.onload=()=>resolve();script.onerror=()=>resolve();document.body.append(script);})`);
  check('User allow rule overrides packaged resource substitution',await evaluate(s,'window.__realGptLoaded'),true);
  // Synthetic render measurements, not a public-site blocking comparison.
  // Coverage controls: optional direct denial, default substitutions, and
  // enhanced third-party privacy must preserve first-party and user exceptions.
  await settings({...advancedProfile,directBlocking:true});await navigate();
  const strictStub=await evaluate(s,`new Promise(resolve=>{const script=document.createElement('script');script.src=${JSON.stringify(url+'fuckadblock-3.2.0.js')};script.onload=()=>resolve('LOADED');script.onerror=()=>resolve('BLOCKED');document.body.append(script);})`);
  check('Direct mode rejects an ad compatibility resource at the network layer',strictStub,'BLOCKED');
  await settings({...advancedProfile,directBlocking:true,allowDomains:['127.0.0.1']});
  check('Manual allow overrides direct network mode',await evaluate(s,fetchExpr(url+'fuckadblock-3.2.0.js')), 'window.__realGptLoaded=true;');
  await settings(advancedProfile);
  check('HEAD to an ad substitution is rejected even in compatibility mode',await evaluate(s,`fetch(${JSON.stringify(ad)},{method:'HEAD'}).then(()=> 'LOADED').catch(()=> 'BLOCKED')`),'BLOCKED');
  const tracker=`http://a.klaviyo.com:${port}/ad`;
  await settings({...defaults,enhancedTracking:true});
  check('Enhanced list blocks an additional third-party tracking domain',await evaluate(s,fetchExpr(tracker)),'BLOCKED');
  await settings({...defaults,enhancedTracking:false});
  check('Enhanced tracking control removes only its extra domain blocking',await evaluate(s,fetchExpr(tracker)),'ad-response');
  await settings({...defaults,enhancedTracking:true,allowDomains:['a.klaviyo.com']});
  check('Manual allow overrides enhanced tracking protection',await evaluate(s,fetchExpr(tracker)),'ad-response');
  await settings({...defaults,enhancedTracking:true,whitelist:['127.0.0.1']});
  check('Site pause overrides enhanced tracking protection',await evaluate(s,fetchExpr(tracker)),'ad-response');
  await settings({...defaults,enhancedTracking:true});
  const firstParty=await attachLearned(`http://a.klaviyo.com:${port}/first-party-page`);
  await waitReady(firstParty.sessionId,"document.readyState==='complete' && !!document.querySelector('ins')");
  check('Enhanced list preserves a first-party request on the same service',await evaluate(firstParty.sessionId,fetchExpr(tracker)),'ad-response');
  await send('Target.closeTarget',{targetId:firstParty.targetId});
  await settings(advancedProfile);await navigate();
  for(const route of ['widget/ads.js','pagead.js','ads/ads.js'])check('Explicit advertisement path '+route+' is blocked',await evaluate(s,fetchExpr(url+route)),'BLOCKED');
  check('Non-advertising script path remains accessible',await evaluate(s,fetchExpr(url+'normal-helper.js')).then(x=>x.includes('Open one window')),true);
  await evaluate(s,`{const ad=document.createElement('div');ad.id='dynamic-textad';ad.className='textads';ad.textContent='Sponsored';const safe=document.createElement('div');safe.id='dynamic-article';safe.textContent='Ordinary article';const sponsor=document.createElement('a');sponsor.rel='sponsored';sponsor.id='sponsor-image';sponsor.append(document.createElement('img'));document.body.append(ad,safe,sponsor);}`);
  await evaluate(s,`{for(const [id,sponsored,image] of [['sponsor-background',true,false],['ordinary-background',false,false],['sponsor-wrapped-image',true,true],['sponsor-text',true,false]]){const a=document.createElement('a');a.id=id;a.textContent='Link';if(sponsored)a.rel='sponsored';if(image){const span=document.createElement('span');span.append(document.createElement('img'));a.append(span);}else if(id!=='sponsor-text')a.style.backgroundImage='url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E")';document.body.append(a);}}`);
  await waitReady(s,"getComputedStyle(document.querySelector('#dynamic-textad')).display==='none'");
  check('New dynamic advertising label is hidden by CSS',await evaluate(s,"getComputedStyle(document.querySelector('#dynamic-textad')).display"),'none');
  check('Sponsored product image stays visible',await evaluate(s,"getComputedStyle(document.querySelector('#sponsor-image')).display"),'inline');
  check('Sponsored product background stays visible',await evaluate(s,"getComputedStyle(document.querySelector('#sponsor-background')).display"),'inline');
  check('Wrapped sponsored product image stays visible',await evaluate(s,"getComputedStyle(document.querySelector('#sponsor-wrapped-image')).display"),'inline');
  check('Ordinary background image link is retained',await evaluate(s,"getComputedStyle(document.querySelector('#ordinary-background')).display"),'inline');
  check('Plain sponsored text link remains available',await evaluate(s,"getComputedStyle(document.querySelector('#sponsor-text')).display"),'inline');
  check('Neighboring ordinary content remains visible',await evaluate(s,"getComputedStyle(document.querySelector('#dynamic-article')).display"),'block');
  await settings({...advancedProfile,whitelist:['127.0.0.1']});
  await navigate(); // The popup reloads the tab for this; global selectors are injected at page start.
  check('Site pause restores cosmetic coverage',await evaluate(s,"getComputedStyle(document.querySelector('ins')).display"),'inline');
  await settings(advancedProfile);
  // A site repair must retain advertising protection and leave other sites alone.
  await settings({...advancedProfile,compatSites:['127.0.0.1']});await navigate();
  check('Site compatibility restores an extra third-party service',await evaluate(s,fetchExpr(tracker)),'ad-response');
  const adHitsBeforeRepair=originalAdHits;
  check('Site compatibility retains a local advertising replacement',await evaluate(s,fetchExpr(ad)),'');
  check('Compatibility never sends the original ad request',originalAdHits,adHitsBeforeRepair);
  check('Site compatibility restores first-party paths',await evaluate(s,fetchExpr(url+'ads/ads.js')),'ad-response');
  await waitReady(s,"getComputedStyle(document.querySelector('ins')).display!=='none'");
  check('Site compatibility removes automatic hiding',await evaluate(s,"getComputedStyle(document.querySelector('ins')).display"),'inline');
  check('Site compatibility preserves native navigation',await evaluate(s,"window.open.toString().includes('[native code]')"),true);
  await evaluate(s,`new Promise(resolve=>{const frame=document.createElement('iframe');frame.id='compat-frame';frame.src='http://child.example.test:${port}/first-party-page';frame.onload=resolve;document.body.append(frame);})`);
  let compatFrameSession;
  for(let i=0;i<80;i++){const frameTarget=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='iframe' && x.url.includes('child.example.test'));if(frameTarget){compatFrameSession=(await send('Target.attachToTarget',{targetId:frameTarget.targetId,flatten:true})).sessionId;break;}await new Promise(r=>setTimeout(r,50));}
  if(!compatFrameSession)throw new Error('Compatibility cross-origin frame target unavailable');
  await waitReady(compatFrameSession,"document.readyState==='complete' && !!document.body");
  const evalFrame=expression=>evaluate(compatFrameSession,expression);
  check('Compatibility includes a cross-origin embedded service',await evalFrame(fetchExpr(tracker)),'ad-response');
  const adHitsBeforeFrame=originalAdHits;
  check('Embedded content retains a local advertising replacement',await evalFrame(fetchExpr(ad)),'');
  check('Embedded content never sends the original ad request',originalAdHits,adHitsBeforeFrame);
  await settings({...advancedProfile,compatSites:['gamedev.net']});
  await waitReady(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display!=='none'");
  check('Site compatibility removes automatic advanced hiding without reload',await evaluate(proceduralPage.sessionId,"getComputedStyle(document.querySelector('#advanced-ad')).display"),'block');
  await settings({...advancedProfile,compatSites:['timesofindia.indiatimes.com']});
  await send('Page.navigate',{url:`http://timesofindia.indiatimes.com:${port}/early?compatible`},early.sessionId);
  await waitReady(early.sessionId,"location.search==='?compatible' && document.readyState==='complete'");
  check('Site compatibility restores the original site script on reload',await evaluate(early.sessionId,'window.__earlyFix'),99);
  check('Repairing one site does not release tracking on another site',await evaluate(s,fetchExpr(tracker)),'BLOCKED');
  await settings(advancedProfile);await navigate();
  check('Leaving compatibility restores enhanced protection',await evaluate(s,fetchExpr(tracker)),'BLOCKED');
  await runComponentTests({settings,defaults,advancedProfile,attach,url,port,evaluate,popup,waitReady,check,send,testDirectory});
  const benchmark=await attach(url+'benchmark');const measurements={off:[],full:[]};
  for(const mode of ['off','full']){await settings(mode==='off'?{...defaults,enabled:false}:{...advancedProfile,directBlocking:true});for(let i=0;i<9;i++){await send('Page.navigate',{url:url+'benchmark?'+mode+i},benchmark.sessionId);await waitReady(benchmark.sessionId,"document.readyState==='complete' && document.querySelectorAll('article').length===3000 && performance.getEntriesByType('navigation')[0].loadEventEnd>0");const metric=await evaluate(benchmark.sessionId,"performance.getEntriesByType('navigation')[0].loadEventEnd");if(i)measurements[mode].push(metric);}}
  const median=a=>{const sorted=a.slice().sort((x,y)=>x-y);const middle=Math.floor(sorted.length/2);return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;};
  const perf={fullMode:{directBlocking:true,enhancedTracking:true,webLists:'all five',scriptlets:true,procedural:true},fixture:'3000 articles / about 9000 DOM elements, local HTTP',runs:8,offMedianMs:median(measurements.off),fullMedianMs:median(measurements.full),raw:measurements};
  await writeFile(path.join(testDirectory,'benchmark-v4.json'),JSON.stringify(perf,null,2));console.log('BENCHMARK '+JSON.stringify(perf));
  check('Full profile preserves every article in the performance fixture',await evaluate(benchmark.sessionId,"document.querySelectorAll('article').length"),3000);
  await settings({...defaults,enhancedTracking:true});await navigate();

  // Options UI: invalid selectors, domain save, and backup import.
  const options=await attach(`chrome-extension://${id}/options.html`);
  await waitReady(options.sessionId,"!!document.querySelector('#save') && !document.querySelector('#save').disabled");
  await evaluate(options.sessionId,"document.querySelector('#cosmeticHost').value='example.com';document.querySelector('#selector').value='[';document.querySelector('#addCosmetic').click()");
  check('Invalid CSS selector rejected by settings UI',await evaluate(options.sessionId,"document.querySelector('#status').classList.contains('error')"),true);
  await evaluate(options.sessionId,"document.querySelector('#blockDomains').value='options-block.example.test';document.querySelector('#save').click()");
  await waitReady(options.sessionId,"!document.querySelector('#save').disabled");
  check('Options save adds a working network rule',await evaluate(s,fetchExpr(`http://options-block.example.test:${port}/ad`)),'BLOCKED');
  await evaluate(options.sessionId,"document.querySelector('#compatSites').value='127.0.0.1';document.querySelector('#save').click()");
  await waitReady(options.sessionId,"!document.querySelector('#save').disabled");
  check('Options site compatibility saves a working repair',await evaluate(s,fetchExpr(tracker)),'ad-response');
  const backup={format:'ad-shield-settings',version:2,settings:{enabled:true,popupMode:'balanced',hideAds:true,autoUpdate:false,whitelist:[],blockDomains:['imported-block.example.test'],allowDomains:[],siteModes:[],cosmeticRules:[]}};
  await writeFile(path.join(testDirectory,'test-backup.json'),JSON.stringify(backup));
  const {root:dom}=await send('DOM.getDocument',{},options.sessionId);
  const {nodeId}=await send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#importFile'},options.sessionId);
  await send('DOM.setFileInputFiles',{nodeId,files:[path.join(testDirectory,'test-backup.json')]},options.sessionId);
  await waitReady(options.sessionId,"document.querySelector('#blockDomains').value==='imported-block.example.test' && !document.querySelector('#save').disabled");
  check('Backup import restores working settings',await evaluate(s,fetchExpr(`http://imported-block.example.test:${port}/ad`)),'BLOCKED');
  await settings({...defaults,enhancedTracking:true});
  // A headless popup opened as a test tab lacks the native action-popup context.
  // Bind its existing controller to the real fixture tab, then exercise the UI.
  await evaluate(popup.sessionId,`(async()=>{activeTab=(await chrome.tabs.query({})).find(x=>x.url===${JSON.stringify(url)});host=AdShield.hostname(activeTab.url);({settings,info}=await request('GET_SETTINGS'));render();})()`);
  await evaluate(popup.sessionId,"document.querySelector('#compatible').click()");
  await waitReady(popup.sessionId,"!document.querySelector('#compatible').disabled && document.querySelector('#compatible').textContent==='關閉此網站相容模式'");
  check('Popup one-click compatibility actually restores the service',await evaluate(s,fetchExpr(tracker)),'ad-response');
  check('Popup one-click compatibility retains basic advertisement blocking',await evaluate(s,fetchExpr(ad)),'BLOCKED');
  await evaluate(popup.sessionId,"document.querySelector('#compatible').click()");
  await waitReady(popup.sessionId,"!document.querySelector('#compatible').disabled && document.querySelector('#compatible').textContent==='此網站使用相容模式'");
  check('Popup one-click exit restores enhanced blocking',await evaluate(s,fetchExpr(tracker)),'BLOCKED');
  await send('Emulation.setDeviceMetricsOverride',{width:1000,height:1500,deviceScaleFactor:1,mobile:false},options.sessionId);
  const optionShot=await send('Page.captureScreenshot',{format:'png'},options.sessionId);
  await writeFile(path.join(testDirectory,'options-preview.png'),Buffer.from(optionShot.data,'base64'));

  // Capture the real popup for visual inspection.
  await send('Page.navigate',{url:`chrome-extension://${id}/popup.html`},popup.sessionId);
  await waitReady(popup.sessionId,`!!document.getElementById('enabled') && !document.getElementById('enabled').disabled`);
  await settings({});
  await evaluate(popup.sessionId,`(async()=>{activeTab=(await chrome.tabs.query({})).find(x=>x.url===${JSON.stringify(url)});host=AdShield.hostname(activeTab.url);({settings,info}=await request('GET_SETTINGS'));render();})()`);
  await send('Emulation.setDeviceMetricsOverride',{width:350,height:920,deviceScaleFactor:1,mobile:false},popup.sessionId);
  const shot=await send('Page.captureScreenshot',{format:'png'},popup.sessionId);
  await writeFile(path.join(testDirectory,'popup-preview.png'),Buffer.from(shot.data,'base64'));
  }
  await runStaticPolicyTests({settings,attach,url,port,evaluate,popup,waitReady,check,send,getAdHits:()=>staticAdHits});
  console.log(`${completed} browser checks passed; real Chrome loaded the extension successfully.`);
  await writeFile(path.join(testDirectory,'browser-test-result.txt'),`${completed} browser checks passed\n${new Date().toISOString()}\n`);
}finally{ws?.close();child.kill('SIGTERM');server.close();}
