/* Browser-created popup cleanup for strict mode. GPL-3.0-or-later. */
globalThis.AdShieldPopupRescue=(()=>{
  function create({api,A,readState,now=()=>performance.now(),wait=ms=>new Promise(r=>setTimeout(r,ms))}){
    const intents=new Map(),pointers=new Map(),signals=new Map(),ready=new Map(),seen=new Map();let closed=0;
    const normalize=value=>{try{const u=new URL(value);return ['http:','https:','blob:','data:','about:'].includes(u.protocol)?u.href:null;}catch{return null;}};
    const missing=(error,id)=>error?.message===`No tab with id: ${id}` || error?.message===`No tab with id: ${id}.`;
    function prune(){const time=now();for(const map of [intents,pointers,signals])for(const [key,x] of map)if(x.until<time)map.delete(key);for(const [key,time] of seen)if(now()-time>30000)seen.delete(key);}
    function markReady(sender){if(sender.frameId===0 && sender.documentId){const previous=ready.get(sender.tab.id);if(previous && previous!==sender.documentId)forget(sender.tab.id);ready.set(sender.tab.id,sender.documentId);}}
    function record(message,sender){
      prune();const url=normalize(message.url);if(!url || !sender.documentId || !Number.isFinite(message.stamp) || !Number.isFinite(message.origin) || !['pointerdown','click','auxclick','keydown','contextmenu'].includes(message.kind))return;
      const scope=sender.tab.id+':'+message.origin,point=scope+':'+message.pointer+':'+message.button;
      const signal=scope+':'+message.kind+':'+message.stamp+':'+message.pointer+':'+message.button;
      const replay=signals.has(signal);let key;
      if(replay){key=signals.get(signal).key;if(!intents.has(key))return;}
      else if(message.kind==='contextmenu'){key=scope+':menu:'+message.stamp;for(const [oldKey,x] of intents)if(x.tabId===sender.tab.id && x.menu && oldKey!==key)intents.delete(oldKey);}
      else if(message.kind==='click' && message.detail===0 && pointers.has(scope+':key'))key=pointers.get(scope+':key').key;
      else if(['click','auxclick'].includes(message.kind) && pointers.has(point))key=pointers.get(point).key;
      else key=scope+':'+message.kind+':'+message.stamp+':'+message.pointer+':'+message.button;
      if(message.kind==='keydown')pointers.set(scope+':key',{key,until:now()+1500});
      if(message.kind==='pointerdown')pointers.set(point,{key,until:now()+5000});
      const old=intents.get(key),time=now(),urls=[...new Set([...(old?.urls || []),url])].slice(-8);
      signals.set(signal,{key,until:time+30000});
      intents.set(key,{tabId:sender.tab.id,urls,kind:message.kind,used:!!old?.used,menu:message.kind==='contextmenu',until:replay?old.until:time+(message.kind==='contextmenu'?30000:2500)});
      while(intents.size>128)intents.delete(intents.keys().next().value);while(pointers.size>256)pointers.delete(pointers.keys().next().value);while(signals.size>512)signals.delete(signals.keys().next().value);
    }
    function consume(tabId,url){prune();const normalized=normalize(url);for(const value of intents.values())if(value.tabId===tabId && value.urls.includes(normalized) && !value.used){value.used=true;return true;}return false;}
    function consumeBlank(tabId){
      prune();
      // A genuine completed link click can reserve one empty handoff window.
      // It spends the same budget as the eventual destination. Background
      // clicks, pointer-down alone, synthetic events and extra windows do not.
      for(const value of [...intents.values()].reverse())if(value.tabId===tabId && !value.used && ['click','auxclick','keydown'].includes(value.kind)){
        value.used=true;return true;
      }
      return false;
    }
    function active(state,source){const host=A.hostname(source.url);return host && state.settings.enabled && !A.isListed(host,state.settings.whitelist) && A.modeFor(host,state.settings)==='strict';}
    async function excludedFrame(event,state){if(event.sourceFrameId===0 || !state.settings.whitelist.length)return false;const frame=await api.webNavigation.getFrame({tabId:event.sourceTabId,frameId:event.sourceFrameId});return !!frame && A.isListed(A.hostname(frame.url),state.settings.whitelist);}
    async function handle(event){
      if(!Number.isInteger(event.sourceTabId) || !Number.isInteger(event.tabId) || event.sourceTabId===event.tabId || !normalize(event.url))return;
      prune();if(seen.has(event.tabId))return;seen.set(event.tabId,now());while(seen.size>128)seen.delete(seen.keys().next().value);
      let state,source;
      try{[state,source]=await Promise.all([readState(),api.tabs.get(event.sourceTabId)]);}catch(error){if(missing(error,event.sourceTabId))return;throw error;}
      if(!active(state,source))return;try{if(await excludedFrame(event,state))return;}catch(error){if(missing(error,event.sourceTabId))return;throw error;}
      if(consume(event.sourceTabId,event.url))return;
      // Extension messaging and browser navigation have independent arrival
      // order. Use worker-local monotonic expiry, never compare browser and
      // renderer wall-clock timestamps (Chrome documents possible skew).
      await wait(250);
      if(consume(event.sourceTabId,event.url))return;
      try{[state,source]=await Promise.all([readState(),api.tabs.get(event.sourceTabId)]);}catch(error){if(missing(error,event.sourceTabId))return;throw error;}
      if(!active(state,source))return;try{if(await excludedFrame(event,state))return;}catch(error){if(missing(error,event.sourceTabId))return;throw error;}
      let frame;try{frame=await api.webNavigation.getFrame({tabId:event.sourceTabId,frameId:0});}catch(error){if(missing(error,event.sourceTabId))return;throw error;}
      if(!frame || ready.get(event.sourceTabId)!==frame.documentId)return; // Unobserved documents retain native user gestures.
      let target;try{target=await api.tabs.get(event.tabId);}catch(error){if(missing(error,event.tabId))return;throw error;}
      const destination=target.pendingUrl || target.url || event.url;
      if(consume(event.sourceTabId,destination))return;
      if(/^about:blank(?:[?#]|$)/.test(event.url) && /^about:blank(?:[?#]|$)/.test(destination) && consumeBlank(event.sourceTabId))return;
      if(!/^(?:https?:|blob:|data:)|^about:blank(?:[?#]|$)/.test(destination))return;
      try{await api.tabs.remove(event.tabId);closed++;}catch(error){if(!missing(error,event.tabId))throw error;}
    }
    function forget(tabId){ready.delete(tabId);for(const [key,x] of intents)if(x.tabId===tabId)intents.delete(key);for(const map of [pointers,signals])for(const key of map.keys())if(key.startsWith(tabId+':'))map.delete(key);}
    return {record,markReady,handle,forget,inspect:()=>({closed,intents:intents.size,observedTabs:ready.size})};
  }
  return {create};
})();
