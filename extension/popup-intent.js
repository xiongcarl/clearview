/* Trusted link gestures in an isolated world. GPL-3.0-or-later. No page hooks. */
(()=>{
  const key='__adShieldPopupIntent';if(globalThis[key]){globalThis[key].scan();return;}
  const documents=new WeakMap();let scheduled=false;
  const send=message=>{try{chrome.runtime.sendMessage(message).catch(()=>{});}catch{}};
  const linkHref=element=>element.getAttribute('href') ?? element.getAttributeNS('http://www.w3.org/1999/xlink','href');
  // Only the observed Google safety wrapper for this exact link is an alias.
  // A data attribute alone never grants a different destination or extra popup.
  function safeRedirect(anchor, href) {
    try {
      const raw=anchor?.getAttribute('data-saferedirecturl');if(!raw)return null;
      const url=new URL(raw),destination=new URL(href);
      if(url.protocol!=='https:' || !['www.google.com','google.com'].includes(url.hostname) || url.port || url.username || url.password || url.pathname!=='/url')return null;
      if(!['http:','https:'].includes(destination.protocol) || url.searchParams.get('source')!=='gmail' || url.searchParams.getAll('q').length!==1 || url.searchParams.has('url'))return null;
      return new URL(url.searchParams.get('q')).href===destination.href ? url.href : null;
    }catch{return null;}
  }
  function rootFor(element){try{return chrome.dom.openOrClosedShadowRoot(element);}catch{return element.shadowRoot;}}
  function linkAt(event,doc){
    let target=event.composedPath().find(x=>x?.nodeType===1);
    if(event.type==='keydown'){
      target=doc.activeElement;
      for(let n=0;target && n<16;n++){const root=rootFor(target);if(!root?.activeElement)break;target=root.activeElement;}
    }else{
      for(let n=0;target && n<16;n++){const root=rootFor(target);if(!root)break;const inner=root.elementFromPoint(event.clientX,event.clientY);if(!inner || inner===target)break;target=inner;}
    }
    // SVG href is an animated object; namespaced xlink attributes also cannot
    // reliably be selected as a literal CSS attribute named "xlink:href".
    for(let element=target;element;element=element.parentElement)if(element.localName==='a' && ['http://www.w3.org/1999/xhtml','http://www.w3.org/2000/svg'].includes(element.namespaceURI) && linkHref(element)!==null)return element;
    return null;
  }
  function listen(doc){
    let record=documents.get(doc);
    if(!record){
      const handler=event=>{
        if(!event.isTrusted)return;
        const menu=event.type==='contextmenu';
        if(event.type==='keydown'){if(event.key!=='Enter' || event.repeat)return;}
        else if(!menu && !(event.button===1 || event.button===0))return;
        const link=linkAt(event,doc);if(!link)return;
        const destination=()=>{const href=linkHref(link);return href===null?null:new URL(href,link.baseURI).href;};
        let url;try{url=destination();}catch{return;}if(!url)return;
        // Native event timestamp identifies duplicates across own/parent
        // observers; it is not compared to browser navigation timestamps.
        const message={type:'POPUP_INTENT',url,kind:event.type,stamp:event.timeStamp,origin:doc.defaultView.performance.timeOrigin,pointer:event.pointerId ?? -1,button:event.button ?? -1,detail:event.detail ?? -1};
        send(message);
        const redirect=safeRedirect(link,url);
        // Same stamp and gesture key: the wrapper and target share one budget.
        if(redirect)send({...message,url:redirect});
        // Sites may replace the href in a later click listener (e.g. an
        // outbound redirect). Read it after dispatch, retaining the SAME
        // gesture identity and one-window budget, rather than granting a new one.
        if(['click','auxclick','keydown'].includes(event.type))setTimeout(()=>{
          try{const finalURL=destination();if(finalURL && finalURL!==url)send({...message,url:finalURL});
            const finalRedirect=safeRedirect(link,finalURL);if(finalRedirect && finalRedirect!==redirect)send({...message,url:finalRedirect});}catch{}
        },0);
      };
      let frames=0;
      const observer=new MutationObserver(records=>{
        // document.open() can clear listeners; restore them for this document.
        // Ordinary feeds, counters and ad removal do not change the frame tree.
        relisten();
        if(scheduled)return;
        // window.length counts child frames without searching the added subtrees (the parser
        // reports every element of a page here). A frame swapped for another in one batch
        // keeps the count, so directly added frames are checked by name; anything deeper
        // waits for the periodic scan.
        const count=doc.defaultView?doc.defaultView.length:0;
        if(count!==frames){frames=count;schedule();return;}
        for(let i=0;i<records.length;i++){const added=records[i].addedNodes;for(let j=0;j<added.length;j++){const name=added[j].localName;if(name==='iframe' || name==='frame'){schedule();return;}}}
      });
      const relisten=()=>{for(const type of ['pointerdown','click','auxclick','keydown','contextmenu'])doc.addEventListener(type,handler,{capture:true,passive:true});};
      record={relisten,observer};documents.set(doc,record);observer.observe(doc,{subtree:true,childList:true});
      doc.addEventListener('load',event=>{if(event.target===doc || ['iframe','frame'].includes(event.target?.localName))schedule();},true);
    }
    record.relisten();
  }
  function scan(){
    scheduled=false;const queue=[window],seen=new Set();
    while(queue.length){const view=queue.shift();if(seen.has(view))continue;seen.add(view);try{listen(view.document);for(let i=0;i<view.frames.length;i++)queue.push(view.frames[i]);}catch{} /* Cross-origin frames use their own registered observer. */}
    // The worker only tracks the top document (popup-rescue.js markReady).
    if(window===top)send({type:'POPUP_RECORDER_READY'});
  }
  function schedule(){if(!scheduled){scheduled=true;setTimeout(scan,0);}}
  globalThis[key]={scan};scan();setInterval(scan,1500);
})();
