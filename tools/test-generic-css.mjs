// Every rule of the shared stylesheets must survive a real browser's CSS parser: a group with
// one rejected selector would silently drop up to 200 of them.
// Usage: node tools/test-generic-css.mjs [extension folder]
import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdtemp,readFile,readdir} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {readGenericCss,ruleCount} from './generic-css.mjs';
const root=process.argv[2] || fileURLToPath(new URL('../extension/',import.meta.url));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const profile=await mkdtemp(path.join(os.tmpdir(),'clearview-css-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=0','--no-first-run',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
try{
  let lines;for(let i=0;i<100;i++){try{lines=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).trim().split('\n');break;}catch{await sleep(100);}}
  const ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise(r=>ws.onopen=r);
  let seq=0;const pending=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data);const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}};
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}));});
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const dir=path.join(root,'data/engine');let files=0,total=0;
  for(const file of (await readdir(dir)).filter(x=>/^generic-.+\.css$/.test(x)).sort()){
    const text=await readFile(path.join(dir,file),'utf8');const expected=readGenericCss(text);
    const r=await send('Runtime.evaluate',{returnByValue:true,expression:`(()=>{const s=new CSSStyleSheet();s.replaceSync(${JSON.stringify(text)});let n=0;for(const rule of s.cssRules){if(rule.style.getPropertyValue('display')!=='none' || rule.style.getPropertyPriority('display')!=='important')return {bad:rule.cssText.slice(0,80)};n+=rule.selectorText.split(',').length;}return {rules:s.cssRules.length};})()`},sessionId);
    const got=r.result.value;assert.ok(!got.bad,`${file}: unexpected rule ${got.bad}`);
    // Single-selector rules a browser rejects were already dropped one at a time before grouping;
    // what matters is that no shared rule disappears.
    const shared=text.split('\n').filter(Boolean);const mark=shared.indexOf('/* one selector per rule below */');assert.ok(mark>=0,`${file}: missing section mark`);
    const groups=shared.slice(0,mark);
    const check=await send('Runtime.evaluate',{returnByValue:true,expression:`(()=>{const lost=[];for(const line of ${JSON.stringify(groups)}){const s=new CSSStyleSheet();s.replaceSync(line);if(s.cssRules.length!==1)lost.push(line.slice(0,60));}return lost;})()`},sessionId);
    assert.deepEqual(check.result.value,[],`${file}: a shared rule was rejected`);
    files++;total+=expected.length;console.log(`PASS ${file}: ${groups.length} shared rules kept, ${got.rules}/${ruleCount(text)} rules parsed, ${expected.length} selectors`);
  }
  assert.ok(files>=5);console.log(`Generic stylesheet checks passed (${total} selectors).`);
}finally{chrome.kill('SIGTERM');}
process.exit(0);
