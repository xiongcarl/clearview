import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const ctx=vm.createContext({URL,performance});
for(const file of ['common.js','popup-rescue.js'])vm.runInContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),ctx);
let checks=0;
const check=(name,actual,expected)=>{assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected,name);console.log('PASS '+name);checks++;};
const destination='https://site.example.test/article';
function setup(){
 let time=0;const removed=[],targets=new Map(),sender={tab:{id:1},frameId:0,documentId:'doc'};
 const state={settings:ctx.AdShield.clean({popupMode:'strict'})};let duringWait=()=>{};
 const api={tabs:{get:async id=>id===1?{id:1,url:'https://site.example.test/'}:targets.get(id),remove:async id=>removed.push(id)},webNavigation:{getFrame:async()=>({documentId:'doc',url:'https://site.example.test/'})}};
 const rescue=ctx.AdShieldPopupRescue.create({api,A:ctx.AdShield,readState:async()=>state,now:()=>time,wait:async()=>{time+=250;await duringWait();}});rescue.markReady(sender);
 function record(overrides={}){rescue.record({url:destination,kind:'click',stamp:1,origin:100,pointer:1,button:0,detail:1,...overrides},sender);}
 async function open(id,url=destination,actual=url){targets.set(id,{id,url:actual});await rescue.handle({tabId:id,sourceTabId:1,sourceFrameId:0,url});}
 return {record,open,removed,rescue,state,advance:ms=>time+=ms,waitWith:fn=>duringWait=fn};
}
let f=setup();f.record();await f.open(2);check('Exact trusted link kept',f.removed,[]);await f.open(3);check('Duplicate destination closed',f.removed,[3]);
f=setup();f.record();f.record({url:destination+'?redirect=1'});await f.open(2,destination+'?redirect=1');check('Rewritten destination kept',f.removed,[]);await f.open(3);check('Rewrite shares original one-window budget',f.removed,[3]);
f=setup();f.record();await f.open(2);f.record({url:destination+'?later'});await f.open(3,destination+'?later');check('Deferred update cannot revive spent permission',f.removed,[3]);
f=setup();f.record();f.advance(2600);f.record({url:destination+'?later'});await f.open(2,destination+'?later');check('Replay cannot revive expired permission',f.removed,[2]);
f=setup();f.record({kind:'pointerdown'});f.record({stamp:2});await f.open(2);await f.open(3);check('Pointerdown and click are one gesture',f.removed,[3]);
f=setup();f.record({kind:'pointerdown'});await f.open(2,'about:blank');check('Pointerdown alone cannot reserve blank window',f.removed,[2]);
f=setup();await f.open(2,'about:blank');check('Unsolicited blank window closed',f.removed,[2]);
f=setup();f.record();await f.open(2,'about:blank');check('Completed link click permits blank handoff',f.removed,[]);await f.open(3,'about:blank');check('Second blank window closed',f.removed,[3]);await f.open(4);check('Blank handoff also spends destination permission',f.removed,[3,4]);
f=setup();f.record();await f.open(2,'about:blank',destination);check('Already navigated handoff uses current URL',f.removed,[]);
f=setup();f.record();await f.open(2,'about:blank','https://unrelated.example.test/');check('Unrelated resolved popup is not a blank handoff',f.removed,[2]);
f=setup();f.record();await f.open(2,'https://unrelated.example.test/');check('Unrelated URL not automatically whitelisted',f.removed,[2]);await f.open(3);check('Intended destination remains available after unrelated popup',f.removed,[2]);
f=setup();f.waitWith(()=>f.record());await f.open(2);check('Navigation before intent message is tolerated',f.removed,[]);
f=setup();f.record();f.rescue.forget(1);f.rescue.markReady({tab:{id:1},frameId:0,documentId:'doc'});await f.open(2);check('Document cleanup clears old permission',f.removed,[2]);
f=setup();f.record();f.advance(2600);await f.open(2);check('Expired gesture cannot authorize popup',f.removed,[2]);
f=setup();f.record({kind:'contextmenu'});await f.open(2);await f.open(3);check('Context menu permission is single-use',f.removed,[3]);
f=setup();f.state.settings.enabled=false;await f.open(2);check('Global pause retains normal browser behavior',f.removed,[]);
f=setup();f.waitWith(()=>{f.state.settings.enabled=false;});await f.open(2);check('Pause during cleanup prevents closing',f.removed,[]);
console.log(checks+' popup-intent lifecycle checks passed.');
