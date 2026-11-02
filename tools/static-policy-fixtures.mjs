// Native requests to a local server mapped to the real filter host. GPL-3.0-or-later.
export function respondStaticPolicyFixture(req,res){
 if(!req.url.startsWith('/openads/policy-fixture.js') && !req.url.startsWith('/ordinary-policy.js'))return false;
 res.setHeader('Content-Type','application/javascript');res.setHeader('Cache-Control','no-store');
 res.end('window.__policyFixtureLoads=(window.__policyFixtureLoads||0)+1;');return true;
}
export async function runStaticPolicyTests({settings,attach,url,port,evaluate,popup,waitReady,check,send,getAdHits}){
 const allWeb={easylist:true,easyprivacy:true,chinese:true,annoyances:true,fixes:true};
 const profile={enabled:true,strict:false,directBlocking:false,enhancedTracking:true,whitelist:[],allowDomains:[],compatSites:[],webFilters:allWeb};
 const policy=await evaluate(popup.sessionId,"fetch(chrome.runtime.getURL('data/badfilter-policy.json')).then(r=>r.json())");
 const expected=policy.origins.fixes.easylist;
 const disabled=()=>evaluate(popup.sessionId,"chrome.declarativeNetRequest.getDisabledRuleIds({rulesetId:'easylist'}).then(x=>x.sort((a,b)=>a-b))");
 const page=await attach(url);await waitReady(page.sessionId,"location.hostname==='127.0.0.1' && document.readyState==='complete' && !!document.body");
 let token=0;
 const script=ordinary=>evaluate(page.sessionId,`new Promise(resolve=>{const script=document.createElement('script');script.src=${JSON.stringify(ordinary?url+'ordinary-policy.js?token='+(++token):'http://succeedscene.com/openads/policy-fixture.js?token='+(++token))};script.onload=()=>{script.remove();resolve('LOADED')};script.onerror=()=>{script.remove();resolve('BLOCKED')};document.body.append(script);})`);
 await settings(profile);
 check('Cross-list policy disables exactly the two bundled canceled exceptions',await disabled(),expected);
 const before=getAdHits();
 check('Canceled advertising exception no longer bypasses the blocker',await script(false),'BLOCKED');
 check('Canceled advertising request never reaches its original local server',getAdHits(),before);
 check('Ordinary neighboring script still executes',await script(true),'LOADED');
 await settings({...profile,webFilters:{...allWeb,fixes:false}});
 check('Disabling source list restores its canceled native exceptions',await disabled(),[]);
 check('Restored advertising exception has its original script behavior',await script(false),'LOADED');
 const type=await evaluate(popup.sessionId,"chrome.declarativeNetRequest.testMatchOutcome({url:'https://succeedscene.com/openads/policy-fixture.js',type:'image',initiator:'https://normal.example/'})");
 check('An unrelated resource type remains blocked with the exception restored',type.matchedRules.some(x=>x.rulesetId==='easylist'),true);
 const restoredHits=getAdHits();
 await settings(profile);
 check('Reenabling source list reapplies exact cancellation',await disabled(),expected);
 check('Reenabled cancellation blocks actual script loading again',await script(false),'BLOCKED');
 check('Reenabled cancellation sends no original advertising request',getAdHits(),restoredHits);
 await settings({...profile,allowDomains:['succeedscene.com']});
 check('Manual domain allow retains precedence over canceled exceptions',await script(false),'LOADED');
 await settings({...profile,whitelist:['127.0.0.1']});
 check('Site pause still restores the advertising request',await script(false),'LOADED');
 const compatible=await settings({...profile,compatSites:['127.0.0.1']});
 check('Compatibility fixture saves a real site exception',compatible.compatSites,['127.0.0.1']);
 check('Site compatibility retains ordinary advertising rule cancellation',await script(false),'BLOCKED');
 await settings({...profile,enabled:false});
 check('Global pause clears cancellation bookkeeping',await disabled(),[]);
 check('Global pause restores normal native script loading',await script(false),'LOADED');
 await settings({...profile,directBlocking:true});
 check('Direct mode retains exact canceled exception IDs',await disabled(),expected);
 check('Direct mode still blocks the actual canceled advertising path',await script(false),'BLOCKED');
 await settings({...profile,webFilters:{...allWeb,easylist:false}});
 await settings(profile);
 check('Reenabling a target ruleset retains source cancellation',await disabled(),expected);
 // Inject one native API failure in the extension's own isolated worker. This
 // exercises the real settings transaction and subsequent recovery.
 await settings({...profile,webFilters:{...allWeb,fixes:false}});
 const workerUrl=new URL('background.js',await evaluate(popup.sessionId,'location.href')).href;
 const worker=(await send('Target.getTargets')).targetInfos.find(x=>x.type==='service_worker' && x.url===workerUrl);
 if(!worker)throw new Error('No extension worker for rollback fixture');
 const oldDynamic=await evaluate(popup.sessionId,'chrome.declarativeNetRequest.getDynamicRules()');
 const session=(await send('Target.attachToTarget',{targetId:worker.targetId,flatten:true})).sessionId;
 await evaluate(session,"globalThis.__staticNative=chrome.declarativeNetRequest.updateStaticRules.bind(chrome.declarativeNetRequest);globalThis.__staticPolicy=cancellationData;cancellationData={version:1,origins:{fixes:{easylist:[__staticPolicy.origins.fixes.easylist[0]],easyprivacy:[1]}}};globalThis.__staticFail=true;globalThis.__staticCalls=[];chrome.declarativeNetRequest.updateStaticRules=async options=>{__staticCalls.push(options);if(__staticFail && options.rulesetId==='easyprivacy' && options.disableRuleIds?.length){__staticFail=false;globalThis.__staticDuringFailure=await chrome.declarativeNetRequest.getDynamicRules();throw new Error('Fixture cancellation API failure')}return __staticNative(options)};");
 try{
  const failed=await evaluate(popup.sessionId,`chrome.runtime.sendMessage(${JSON.stringify({type:'SET_SETTINGS',settings:{...profile,blockDomains:['normal-policy.example']}})})`);
  check('A native cancellation failure remains visible',failed.ok===false && failed.error.includes('Fixture cancellation API failure'),true);
  check('Native failure occurs after another ruleset was changed',await evaluate(session,"__staticCalls.some(x=>x.rulesetId==='easylist' && x.disableRuleIds?.length>0)"),true);
  check('Native failure occurs after the new dynamic block was applied',await evaluate(session,"__staticDuringFailure.some(x=>x.condition.requestDomains?.includes('normal-policy.example'))"),true);
  check('Failed cancellation restores the previous dynamic rules',await evaluate(popup.sessionId,'chrome.declarativeNetRequest.getDynamicRules()'),oldDynamic);
  check('Failed cancellation saves no new settings',await evaluate(popup.sessionId,"chrome.storage.local.get('settings').then(x=>x.settings.webFilters.fixes)"),false);
  check('Failed cancellation restores prior disabled IDs',await disabled(),[]);
  check('Failed cancellation preserves the prior actual request behavior',await script(false),'LOADED');
 }finally{await evaluate(session,'chrome.declarativeNetRequest.updateStaticRules=__staticNative;delete globalThis.__staticNative;cancellationData=__staticPolicy;delete globalThis.__staticPolicy;delete globalThis.__staticFail;delete globalThis.__staticCalls;delete globalThis.__staticDuringFailure;');}
 await settings(profile);
 check('Settings queue recovers after a cancellation failure',await script(false),'BLOCKED');
 await send('Target.closeTarget',{targetId:page.targetId});
}
