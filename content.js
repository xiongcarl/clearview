// Isolated-world element picker and user cosmetic rules. GPL-3.0-or-later.
(() => {
  if(globalThis.__adShieldContent)return;
  globalThis.__adShieldContent=true;
  const componentFilter=new AdShieldShadows.Filter();
  let extendedEngine;let extendedLoaded=false;let advancedInstalled=false;let previousExtended='';
  let previousCss='';let guardInstalled=false;let policyActive=false;let refreshQueue=Promise.resolve();let cancelPicker;
  // Early generic hiding from storage (see prepareFastCosmetics). Removed once the exact
  // per-page CSS from the background has been inserted.
  let fastStyle=null,policyReceived=false;
  function fastSkipped(data){
    const hosts=[location.hostname];
    try{const top=location.ancestorOrigins?.[location.ancestorOrigins.length-1];if(top)hosts.push(new URL(top).hostname);}catch{}
    if(!hosts[0] && hosts.length<2)return true;
    return hosts.filter(Boolean).some(host=>data.hosts.some(domain=>host===domain || host.endsWith('.'+domain)) || data.entities.some(name=>('.'+host).includes('.'+name+'.')));
  }
  // Top-level documents only: subframes are mostly ad slots that the network rules
  // already stop, and re-reading the full sheet in each one costs style time.
  if(window===window.top)chrome.storage.local.get('fastCosmetic').then(({fastCosmetic})=>{
    if(policyReceived || !fastCosmetic?.css || !document.documentElement || fastSkipped(fastCosmetic))return;
    fastStyle=document.createElement('style');fastStyle.textContent=fastCosmetic.css;(document.head || document.documentElement).append(fastStyle);
  }).catch(()=>{});
  function refresh(){
    refreshQueue=refreshQueue.then(async()=>{
      const response=await chrome.runtime.sendMessage({type:'PAGE_POLICY',previousCss,guardInstalled,extendedLoaded,advancedInstalled});
      if(response?.ok && !response.stale && response.policy){policyReceived=true;fastStyle?.remove();fastStyle=null;previousCss=response.policy.css;guardInstalled=response.policy.guardInstalled;policyActive=response.policy.active;extendedLoaded=response.policy.extendedLoaded;advancedInstalled=response.policy.advancedInstalled;
        componentFilter.update(response.policy.shadowCss || '',response.policy.shadowRules || []);
        const extendedKey=JSON.stringify(response.policy.extended || []);
        if(extendedKey!==previousExtended){extendedEngine?.dispose();extendedEngine=undefined;previousExtended=extendedKey;
          if(response.policy.extended?.length && typeof ExtendedCss!=='undefined'){
            const selectors=response.policy.extended.filter(selector=>ExtendedCss.validate(selector).ok);
            if(selectors.length){extendedEngine=new ExtendedCss({cssRules:selectors.map(selector=>selector+' { display: none !important; }'),beforeStyleApplied:affected=>{if(affected.node===document.documentElement || affected.node===document.body)affected.rules=[];return affected;}});extendedEngine.init();extendedEngine.apply();}
          }
        }
        if(!policyActive)cancelPicker?.();}
    }).catch(error=>console.debug('Ad Shield page refresh:',error.message));
    return refreshQueue;
  }
  refresh();
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local' && changes.settings)refresh();});
  function segmentFor(element,scope){
    if(element.id){const selector='#'+CSS.escape(element.id);if(scope.querySelectorAll(selector).length===1)return selector;}
    const parts=[];let current=element;
    for(let depth=0;current && !['HTML','BODY'].includes(current.tagName) && depth<8;depth++){
      let part=current.tagName.toLowerCase();
      const classes=[...current.classList].filter(x=>x && x.length<80).slice(0,3);
      if(classes.length)part+='.'+classes.map(x=>CSS.escape(x)).join('.');
      if(current.parentElement){const siblings=[...current.parentElement.children].filter(x=>x.tagName===current.tagName);if(siblings.length>1)part+=`:nth-of-type(${siblings.indexOf(current)+1})`;}
      parts.unshift(part);const selector=parts.join(' > ');
      if(scope.querySelectorAll(selector).length===1)return selector;
      current=current.parentElement;
    }
    const selector=parts.join(' > ');
    if(!selector || scope.querySelectorAll(selector).length!==1)throw new Error(L('picker_not_unique'));
    return selector;
  }
  function selectorFor(element){
    let scope=element.getRootNode();const parts=[segmentFor(element,scope)];
    while(scope instanceof ShadowRoot){element=scope.host;scope=element.getRootNode();parts.unshift(segmentFor(element,scope));if(parts.length>8)throw new Error(L('picker_too_deep'));}
    const selector=parts.join(' >>> ');if(!AdShield.safeSelector(selector))throw new Error(L('picker_too_broad'));return selector;
  }
  function targetAt(event){
    let element=event.composedPath().find(x=>x instanceof Element);
    for(let depth=0;element && depth<8;depth++){const root=AdShieldShadows.rootFor(element);if(!root)break;const inner=root.elementFromPoint(event.clientX,event.clientY);if(!inner || inner===element)break;element=inner;}
    return element;
  }
  // Picker strings come from the background in the interface language.
  let strings={};
  const L=(key,...subs)=>(strings[key] || key).replace(/\$(\d)/g,(_,n)=>subs[n-1]==null?'':String(subs[n-1]));
  // Right-click target for the "hide this element" menu item (top frame only).
  let contextTarget,contextTime=0;
  addEventListener('contextmenu',event=>{contextTarget=targetAt(event);contextTime=Date.now();},true);
  async function startPicker(fromContext){
    try{strings=(await chrome.runtime.sendMessage({type:'PICKER_STRINGS'}))?.strings || strings;}catch{}
    await refresh();if(!policyActive)throw new Error(L('bg_site_paused'));
    cancelPicker?.();
    const host=document.createElement('div');host.id='ad-shield-picker-root';
    host.style.cssText='position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;display:block!important;';
    const shadow=host.attachShadow({mode:'closed'});
    const style=document.createElement('style');style.textContent=`:host{all:initial}
.box{position:fixed;border:2px solid #c96442;background:#c9644222;border-radius:4px;pointer-events:none;box-sizing:border-box;transition:all .06s}
.box.locked{border-width:3px;background:#c964422e;box-shadow:0 0 0 4000px #14141326}
.panel{position:fixed;right:20px;bottom:20px;width:min(440px,calc(100vw - 40px));box-sizing:border-box;padding:16px 16px 14px;border-radius:14px;background:#faf9f5;color:#141413;border:1px solid #e8e6dc;font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"PingFang TC","Microsoft JhengHei",sans-serif;pointer-events:auto;box-shadow:0 10px 40px #1414132e}
.title{font:500 17px/1.3 ui-serif,"Songti TC",Georgia,serif;display:flex;align-items:center;gap:8px}
.title::before{content:"";width:18px;height:18px;border-radius:5px;background:linear-gradient(135deg,#da7c58,#b9573a);flex:none}
p{margin:6px 0 0;color:#66645d;overflow-wrap:anywhere}
.selector{margin-top:10px;padding:8px 10px;border-radius:8px;background:#f0eee6;color:#141413;font:12px/1.5 ui-monospace,Menlo,monospace;max-height:4.5em;overflow:auto}
.selector:empty{display:none}
.row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
button{font:inherit;font-weight:500;padding:7px 12px;border-radius:9px;cursor:pointer;border:1px solid #d6d3c6;background:#fff;color:#141413}
button.primary{background:#141413;color:#faf9f5;border-color:#141413;margin-left:auto}
button:disabled{opacity:.4;cursor:default}
@media (prefers-color-scheme:dark){.panel{background:#262624;color:#f2f0e8;border-color:#3a3936}p{color:#aaa69c}.selector{background:#30302e;color:#f2f0e8}button{background:#30302e;color:#f2f0e8;border-color:#4a4844}button.primary{background:#f2f0e8;color:#1f1e1d;border-color:#f2f0e8}}`;
    const box=document.createElement('div');box.className='box';box.hidden=true;
    const panel=document.createElement('div');panel.className='panel';
    const title=document.createElement('div');title.className='title';title.textContent=L('picker_title');
    const description=document.createElement('p');description.textContent=L('picker_hint');
    const preview=document.createElement('div');preview.className='selector';
    const repick=document.createElement('button');repick.textContent=L('picker_repick');repick.disabled=true;
    const cancel=document.createElement('button');cancel.textContent=L('picker_cancel');
    const confirm=document.createElement('button');confirm.className='primary';confirm.textContent=L('picker_confirm');confirm.disabled=true;
    const widen=document.createElement('button');widen.textContent=L('picker_widen');widen.disabled=true;widen.title=L('picker_widen_title');
    const row=document.createElement('div');row.className='row';row.append(repick,widen,cancel,confirm);
    panel.append(title,description,preview,row);try{const sheet=new CSSStyleSheet();sheet.replaceSync(style.textContent);shadow.adoptedStyleSheets=[sheet];}catch{shadow.append(style);}shadow.append(box,panel);(document.documentElement || document.body).append(host);
    let selected,selector='',locked=false;
    const ours=event=>event.composedPath().includes(host);
    function show(element){const rect=element.getBoundingClientRect();box.hidden=false;box.style.cssText=`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;}
    function move(event){if(locked || ours(event))return;const target=targetAt(event);if(!target || ['HTML','BODY'].includes(target.tagName))return;selected=target;show(target);}
    function stopPointer(event){if(!ours(event)){event.preventDefault();event.stopImmediatePropagation();}}
    function lockOn(element){try{selected=element;selector=selectorFor(element);locked=true;show(element);box.classList.add('locked');const count=document.querySelectorAll(selector.includes('>>>')?'#__none':selector).length;preview.textContent=selector;description.textContent=count>1?L('picker_selected_many',count):L('picker_selected');confirm.disabled=false;repick.disabled=false;widen.disabled=!outer(element);}catch(error){preview.textContent=error.message;}}
    function outer(element){const parent=element.parentElement || (element.getRootNode() instanceof ShadowRoot?element.getRootNode().host:null);return parent && !['HTML','BODY'].includes(parent.tagName)?parent:null;}
    function pick(event){if(ours(event))return;event.preventDefault();event.stopImmediatePropagation();const element=targetAt(event);if(!element || ['HTML','BODY'].includes(element.tagName))return;lockOn(element);}
    function stop(){window.removeEventListener('mousemove',move,true);window.removeEventListener('click',pick,true);window.removeEventListener('pointerdown',stopPointer,true);window.removeEventListener('mousedown',stopPointer,true);window.removeEventListener('keydown',key,true);host.remove();cancelPicker=undefined;}
    function key(event){if(event.key==='Enter' && locked){event.preventDefault();event.stopImmediatePropagation();if(!confirm.disabled)confirm.click();return;}if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();stop();}}
    confirm.addEventListener('click',async()=>{confirm.disabled=true;try{const response=await chrome.runtime.sendMessage({type:'ADD_SELECTOR',selector});if(!response?.ok)throw new Error(response?.error || L('picker_save_failed'));stop();await refresh();}catch(error){preview.textContent=error.message;confirm.disabled=false;}});
    cancel.addEventListener('click',stop);
    widen.addEventListener('click',()=>{const parent=selected && outer(selected);if(parent)lockOn(parent);});
    repick.addEventListener('click',()=>{locked=false;selector='';confirm.disabled=true;repick.disabled=true;widen.disabled=true;box.classList.remove('locked');box.hidden=true;preview.textContent='';description.textContent=L('picker_hint');});
    window.addEventListener('mousemove',move,true);window.addEventListener('click',pick,true);window.addEventListener('pointerdown',stopPointer,true);window.addEventListener('mousedown',stopPointer,true);window.addEventListener('keydown',key,true);
    cancelPicker=stop;
    if(fromContext && contextTarget?.isConnected && Date.now()-contextTime<15000 && !['HTML','BODY'].includes(contextTarget.tagName)){
      const rect=contextTarget.getBoundingClientRect();
      pick({composedPath:()=>[contextTarget],clientX:rect.left+rect.width/2,clientY:rect.top+rect.height/2,preventDefault(){},stopImmediatePropagation(){}});
    }
  }
  chrome.runtime.onMessage.addListener((message,sender,respond)=>{
    if(sender.id!==chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('')) || message?.type!=='START_PICKER')return false;
    startPicker(!!message.fromContext).then(()=>respond({ok:true}),error=>respond({ok:false,error:error.message}));return true;
  });
})();
