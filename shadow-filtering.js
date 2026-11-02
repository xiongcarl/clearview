/* Ad Shield component filtering. GPL-3.0-or-later. No page prototype hooks. */
globalThis.AdShieldShadows=(()=>{
  const hosts=new Set(['article','aside','blockquote','body','div','footer','h1','h2','h3','h4','h5','h6','header','main','nav','p','section','span']);
  function rootFor(element){
    if(!(element instanceof HTMLElement) || (!hosts.has(element.localName) && !element.localName.includes('-')) || element.closest('#ad-shield-picker-root'))return null;
    try{return chrome.dom?.openOrClosedShadowRoot(element) || element.shadowRoot;}catch{return element.shadowRoot;}
  }
  function escapedEnd(text,i){
    let end=i+1;
    if(/[0-9a-f]/i.test(text[end] || '')){
      let count=0;while(count<6 && /[0-9a-f]/i.test(text[end] || '')){end++;count++;}
      if(/[\t\n\f\r ]/.test(text[end] || ''))end+=text[end]==='\r' && text[end+1]==='\n'?2:1;
      return end-1;
    }
    return Math.min(end,text.length-1);
  }
  function atoms(text){
    const result=[];let start=0,depth=0,quote='';
    for(let i=0;i<text.length;i++){
      const c=text[i];if(c==='\\'){i=escapedEnd(text,i);continue;}
      if(quote){if(c===quote)quote='';continue;}if(c==='"' || c==="'"){quote=c;continue;}
      if(c==='/' && text[i+1]==='*'){const end=text.indexOf('*/',i+2);if(end<0)return [text];i=end+1;continue;}
      if(c==='[' || c==='(')depth++;else if(c===']' || c===')')depth--;
      if(!depth && c===','){result.push(text.slice(start,i).trim());start=i+1;}
    }
    const last=text.slice(start).trim();if(last)result.push(last);return result;
  }
  function selectorKey(selector){
    // Only a positive, unescaped token of the terminal compound is indexed.
    // Functional pseudos, attributes, namespaces and non-ASCII escapes fall
    // back to ordinary native matching rather than narrowing their semantics.
    if(selector.includes('/*'))return null;
    let start=0,depth=0,quote='';
    for(let i=0;i<selector.length;i++){
      const c=selector[i];if(c==='\\'){i=escapedEnd(selector,i);continue;}
      if(quote){if(c===quote)quote='';continue;}if(c==='"' || c==="'"){quote=c;continue;}
      if(c==='[' || c==='(')depth++;else if(c===']' || c===')')depth--;
      if(!depth && c==='|')return null;
      if(!depth && /[\t\n\f\r >+~]/.test(c))start=i+1;
    }
    const compound=selector.slice(start);depth=0;quote='';let candidate=null;
    for(let i=0;i<compound.length;i++){
      const c=compound[i];if(c==='\\'){i=escapedEnd(compound,i);continue;}
      if(quote){if(c===quote)quote='';continue;}if(c==='"' || c==="'"){quote=c;continue;}
      if(c==='[' || c==='('){depth++;continue;}if(c===']' || c===')'){depth--;continue;}
      if(!depth && (c==='#' || c==='.')){
        const token=compound.slice(i+1).match(/^[a-z0-9_-]+(?=$|[.#[:])/i);
        if(token){const key=c+token[0].toLowerCase();if(c==='#')return key;candidate ||= key;i+=token[0].length;}
      }
    }
    if(candidate)return candidate;
    const tag=compound.match(/^[a-z_][a-z0-9_-]*(?=$|[.#[:])/i);
    return tag?'tag:'+tag[0].toLowerCase():null;
  }
  function makeIndex(selector){
    const byKey=new Map(),fallback=[];
    for(const atom of atoms(selector)){
      const key=selectorKey(atom);if(!key){fallback.push(atom);continue;}
      const list=byKey.get(key) || [];list.push(atom);byKey.set(key,list);
    }
    return {selector,byKey,fallback};
  }
  class Filter {
    constructor(){this.roots=new Map();this.queue=[];this.css='';this.rules=[];this.running=false;this.scheduled=null;this.timer=null;this.manualTimer=null;this.shared=null;this.selectors='';this.index=makeIndex('');this.indexVersion=0;this.pendingInline=new Set();this.inlineFrame=null;this.visibility=()=>{if(!document.hidden && this.running)this.enqueue(document.documentElement);};}
    update(css,rules){
      this.rules=(rules || []).filter(x=>Array.isArray(x) && x.length>1);
      if(!css && !this.rules.length){this.stop();return;}
      const changed=css!==this.css || !this.shared;
      if(changed){this.css=css;this.shared ||= new CSSStyleSheet();this.shared.replaceSync(css);this.selectors=this.ruleSelectors(this.shared);this.index=makeIndex(this.selectors);this.indexVersion++;}
      if(!this.running){
        this.running=true;
        this.observer=new MutationObserver(records=>this.changed(records));
        this.observeDocument();document.addEventListener('visibilitychange',this.visibility);
        this.enqueue(document.documentElement || document);
        this.timer=setInterval(()=>{
          this.prune();
          for(const [root,record] of this.roots)this.adopt(root,record);
          // attachShadow on an existing host emits no document mutation. Reconcile
          // in idle batches without replacing the site's attachShadow function.
          if(!document.hidden && !this.queue.length)this.enqueue(document.documentElement);
        },1500);
      }else{this.observeDocument();for(const [root,record] of this.roots)this.observeRoot(root,record);}
      this.applyManual();for(const [root,record] of this.roots){this.adopt(root,record);if(changed)this.invalidate(root);}
    }
    observeDocument(){this.observer.disconnect();this.observer.observe(document,{childList:true,subtree:true,attributes:this.rules.length>0});}
    observeRoot(root,record){record.observer.disconnect();record.observer.observe(root,{childList:true,subtree:true,attributes:true});}
    changed(records,root){
      if(root && records.every(x=>x.type==='attributes' && x.attributeName==='style' && this.roots.get(root)?.forced.has(x.target) && this.isForced(x.target)))return;
      if(root){const record=this.roots.get(root);if(record)record.selection=null;this.scheduleInline(root);}
      for(const change of records)for(const node of change.addedNodes)if(node.nodeType===Node.ELEMENT_NODE)this.enqueue(node);
      if(this.rules.length && !this.manualTimer)this.manualTimer=setTimeout(()=>{this.manualTimer=null;if(this.running)this.applyManual();},100);
    }
    enqueue(node){
      if(!node || !this.running || node.id==='ad-shield-picker-root')return;
      const scope=node instanceof ShadowRoot?node:node.getRootNode();let shadow=scope instanceof ShadowRoot;
      const existing=this.queue.find(job=>job.node===node);if(existing){existing.shadow ||= shadow;return;}
      // A light-DOM rescan cannot reach shadow children. Retain those jobs when
      // collapsing a mutation burst, including moved subtrees inside roots.
      if(!shadow && this.queue.filter(job=>!job.shadow).length>100){
        this.queue=this.queue.filter(job=>job.shadow);node=document.documentElement;shadow=false;
      }
      if(!node || this.queue.some(job=>job.node===node))return;
      this.queue.push({node,shadow,first:true,walker:document.createTreeWalker(node,NodeFilter.SHOW_ELEMENT)});
      this.schedule();
    }
    schedule(){
      if(this.scheduled!==null || !this.running)return;
      const run=()=>{this.scheduled=null;this.walk();};
      this.scheduled=typeof requestIdleCallback==='function'?requestIdleCallback(run,{timeout:200}):setTimeout(run,16);
    }
    walk(){
      const start=performance.now();let count=0;
      while(this.queue.length && count<300 && performance.now()-start<6){
        const job=this.queue[0];const node=job.first?(job.first=false,job.node):job.walker.nextNode();
        if(!node){this.queue.shift();continue;}count++;
        if(node.nodeType!==Node.ELEMENT_NODE || !node.isConnected || node.closest('#ad-shield-picker-root'))continue;
        const root=rootFor(node);if(root){if(!this.roots.has(root))this.track(root);else this.enqueue(root);}
      }
      if(this.queue.length)this.schedule();else{this.prune();this.applyManual();}
    }
    track(root){
      const record={observer:new MutationObserver(records=>this.changed(records,root)),extra:null,extraCss:'',extraIndex:makeIndex(''),selection:null,initial:true,forced:new Map()};
      this.roots.set(root,record);this.observeRoot(root,record);this.adopt(root,record);this.enqueue(root);
      return record;
    }
    adopt(root,record){
      try{
        // A first adoption invalidates its own native styles; avoid forcing a
        // layout for each new host. Review overrides together before painting.
        const initial=record.initial;const current=root.adoptedStyleSheets;
        const next=current.filter(sheet=>sheet!==this.shared && sheet!==record.extra);
        if(this.css)next.push(this.shared);if(record.extraCss && record.extra)next.push(record.extra);
        if(current.length!==next.length || current.some((sheet,i)=>sheet!==next[i])){root.adoptedStyleSheets=next;if(!initial && (!this.css || !record.extraCss))this.invalidate(root);}
        record.initial=false;
        if(initial)this.scheduleInline(root);else this.reviewInline(root,record);
      }catch{} // An adopted or detached foreign-document root is handled on rescan.
    }
    applyManual(){
      if(!this.running)return;
      if(!this.rules.length && ![...this.roots.values()].some(record=>record.extraCss))return;
      const desired=new Map();
      for(const chain of this.rules){
        let contexts=[document];
        try{
          for(const selector of chain.slice(0,-1)){
            const next=[];
            for(const scope of contexts)for(const host of scope.querySelectorAll(selector)){
              const root=rootFor(host);if(!root)continue;
              if(!this.roots.has(root))this.track(root);next.push(root);
            }
            contexts=[...new Set(next)];if(!contexts.length)break;
          }
          for(const root of contexts)if(root instanceof ShadowRoot){const selectors=desired.get(root) || new Set();selectors.add(chain.at(-1));desired.set(root,selectors);}
        }catch{} // Invalid manually imported segments do not affect ordinary content.
      }
      for(const [root,record] of this.roots){
        const css=[...(desired.get(root) || [])].map(selector=>`${selector} { display: none !important; }`).join('\n');
        if(css!==record.extraCss){record.extraCss=css;record.selection=null;if(css){record.extra ||= new CSSStyleSheet();record.extra.replaceSync(css);}else record.extra?.replaceSync('');record.extraIndex=makeIndex(css?this.ruleSelectors(record.extra):'');this.invalidate(root);}
        this.adopt(root,record);
      }
    }
    ruleSelectors(sheet){
      return [...sheet.cssRules].filter(rule=>rule.style?.getPropertyValue('display')==='none' && !rule.selectorText.includes('::') && !/\[\s*style\b/i.test(rule.selectorText)).map(rule=>rule.selectorText).join(',');
    }
    indexFor(sheet){return makeIndex(this.ruleSelectors(sheet));}
    selectorsFor(root,record){
      if(record.selection?.version===this.indexVersion)return record.selection.selector;
      const keys=new Set();
      for(const element of root.querySelectorAll('*')){
        keys.add('tag:'+element.localName.toLowerCase());
        const id=element.getAttribute('id');if(id)keys.add('#'+id.toLowerCase());
        for(const name of (element.getAttribute('class') || '').split(/[\t\n\f\r ]+/))if(name)keys.add('.'+name.toLowerCase());
      }
      const selectors=new Set();
      for(const index of [this.css?this.index:null,record.extraCss?record.extraIndex:null]){
        if(!index)continue;for(const selector of index.fallback)selectors.add(selector);
        for(const key of keys)for(const selector of index.byKey.get(key) || [])selectors.add(selector);
      }
      const selector=[...selectors].join(',');record.selection={version:this.indexVersion,selector};return selector;
    }
    isForced(element){return element.style.getPropertyValue('display')==='none' && element.style.getPropertyPriority('display')==='important';}
    scheduleInline(root){
      this.pendingInline.add(root);if(this.inlineFrame!==null)return;
      const run=()=>{this.inlineFrame=null;const roots=[...this.pendingInline];this.pendingInline.clear();for(const root of roots){const record=this.roots.get(root);if(record && this.running)this.reviewInline(root,record);}};
      this.inlineFrame=document.hidden?setTimeout(run,100):requestAnimationFrame(run);this.inlineUsesTimeout=document.hidden;
    }
    restore(element,original){
      if(!this.isForced(element))return;
      if(original.value)element.style.setProperty('display',original.value,original.priority);else element.style.removeProperty('display');
      if(!original.hadStyle && !element.getAttribute('style'))element.removeAttribute('style');
    }
    reviewInline(root,record){
      if(!this.running)return;
      const selector=this.selectorsFor(root,record);
      let matches;try{matches=new Set(selector?root.querySelectorAll(selector):[]);}catch{return;}
      for(const [element,original] of record.forced){
        if(!matches.has(element)){this.restore(element,original);record.forced.delete(element);}
        else if(!this.isForced(element))record.forced.delete(element); // Preserve a new site-owned value.
      }
      for(const element of matches){
        if(record.forced.has(element) || getComputedStyle(element).display==='none')continue;
        record.forced.set(element,{value:element.style.getPropertyValue('display'),priority:element.style.getPropertyPriority('display'),hadStyle:element.hasAttribute('style')});
        element.style.setProperty('display','none','important');
      }
    }
    invalidate(root){
      // An inherited property also invalidates style caches inside closed roots.
      // Restore the exact prior inline value and the original empty-attribute state.
      const host=root.host,hadStyle=host.hasAttribute('style'),name='--ad-shield-style-revision';
      const value=host.style.getPropertyValue(name),priority=host.style.getPropertyPriority(name);
      host.style.setProperty(name,String(performance.now()));void host.offsetHeight;
      if(value)host.style.setProperty(name,value,priority);else host.style.removeProperty(name);
      if(!hadStyle && !host.getAttribute('style'))host.removeAttribute('style');
    }
    remove(root,record){
      record.observer.disconnect();
      for(const [element,original] of record.forced)this.restore(element,original);record.forced.clear();
      this.pendingInline.delete(root);
      try{root.adoptedStyleSheets=root.adoptedStyleSheets.filter(sheet=>sheet!==this.shared && sheet!==record.extra);}catch{}
      if(root.host.isConnected)this.invalidate(root);
      this.roots.delete(root);
    }
    prune(){for(const [root,record] of this.roots)if(!root.host.isConnected || root.host.ownerDocument!==document)this.remove(root,record);}
    stop(){
      this.running=false;this.observer?.disconnect();document.removeEventListener('visibilitychange',this.visibility);
      clearInterval(this.timer);clearTimeout(this.manualTimer);this.timer=null;this.manualTimer=null;
      if(this.inlineFrame!==null){if(this.inlineUsesTimeout)clearTimeout(this.inlineFrame);else cancelAnimationFrame(this.inlineFrame);this.inlineFrame=null;}this.pendingInline.clear();
      if(this.scheduled!==null){if(typeof cancelIdleCallback==='function')cancelIdleCallback(this.scheduled);else clearTimeout(this.scheduled);this.scheduled=null;}
      // Clear constructed rules before detaching the sheets, so paused content
      // is restored even if Chromium retains a cached adopted-sheet style.
      this.shared?.replaceSync('');
      for(const record of this.roots.values())record.extra?.replaceSync('');
      this.queue=[];for(const [root,record] of this.roots)this.remove(root,record);
      this.css='';this.rules=[];this.selectors='';this.index=makeIndex('');this.indexVersion++;
    }
  }
  return {Filter,rootFor};
})();
