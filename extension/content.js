// Isolated-world page policy: per-site hiding, shadow components, procedural rules. GPL-3.0-or-later.
(() => {
  if(globalThis.__adShieldContent)return;
  globalThis.__adShieldContent=true;
  const componentFilter=new AdShieldShadows.Filter();
  let extendedEngine;let extendedLoaded=false;let previousExtended='';
  let previousCss='';let frameCss=[];let guardInstalled=false;let policyActive=false;let refreshQueue=Promise.resolve();
  function refresh(){
    refreshQueue=refreshQueue.then(async()=>{
      const response=await chrome.runtime.sendMessage({type:'PAGE_POLICY',previousCss,frameCss,guardInstalled,extendedLoaded});
      if(response?.ok && !response.stale && response.policy){previousCss=response.policy.css;frameCss=response.policy.frameCss;guardInstalled=response.policy.guardInstalled;policyActive=response.policy.active;extendedLoaded=response.policy.extendedLoaded;
        componentFilter.update(response.policy.shadowCss || '',response.policy.shadowRules || []);
        const extendedKey=JSON.stringify(response.policy.extended || []);
        if(extendedKey!==previousExtended){extendedEngine?.dispose();extendedEngine=undefined;previousExtended=extendedKey;
          if(response.policy.extended?.length && typeof ExtendedCss!=='undefined'){
            const selectors=response.policy.extended.filter(selector=>ExtendedCss.validate(selector).ok);
            if(selectors.length){extendedEngine=new ExtendedCss({cssRules:selectors.map(selector=>selector+' { display: none !important; }'),beforeStyleApplied:affected=>{if(affected.node===document.documentElement || affected.node===document.body)affected.rules=[];return affected;}});extendedEngine.init();extendedEngine.apply();}
          }
        }
        if(!policyActive)page.onInactive?.();}
    }).catch(error=>console.debug('Ad Shield page refresh:',error.message));
    return refreshQueue;
  }
  refresh();
  // A page restored from the back/forward cache may have missed a settings change.
  addEventListener('pageshow',event=>{if(event.persisted)refresh();});
  function targetAt(event){
    let element=event.composedPath().find(x=>x instanceof Element);
    for(let depth=0;element && depth<8;depth++){const root=AdShieldShadows.rootFor(element);if(!root)break;const inner=root.elementFromPoint(event.clientX,event.clientY);if(!inner || inner===element)break;element=inner;}
    return element;
  }
  // Right-click target for the "hide this element" menu item (top frame only).
  let contextTarget,contextTime=0;
  addEventListener('contextmenu',event=>{contextTarget=targetAt(event);contextTime=Date.now();},true);
  // What the on-demand element picker (picker.js) needs from this page's state.
  const page=globalThis.__adShieldPage={refresh,targetAt,active:()=>policyActive,contextTarget:()=>Date.now()-contextTime<15000?contextTarget:null,onInactive:null,start:null};
  chrome.runtime.onMessage.addListener((message,sender,respond)=>{
    if(sender.id!==chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('')))return false;
    // The background says when the settings changed (see notifyPages there).
    if(message?.type==='POLICY_CHANGED'){refresh();return false;}
    if(message?.type!=='START_PICKER')return false;
    (async()=>{
      if(!page.start){const loaded=await chrome.runtime.sendMessage({type:'LOAD_PICKER'});if(!loaded?.ok)throw new Error(loaded?.error || 'Picker unavailable');}
      await page.start(!!message.fromContext);
    })().then(()=>respond({ok:true}),error=>respond({ok:false,error:error.message}));return true;
  });
})();
