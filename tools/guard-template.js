// Popup defense in the top-level page MAIN world. GPL-3.0-or-later.
(() => {
  'use strict';
  const strict = STRICT_MODE;
  const nativeOpen = window.open;
  const nativeSubmit = HTMLFormElement.prototype.submit;
  const nativeApply = Reflect.apply;
  const now = performance.now.bind(performance);
  let lastGesture = -Infinity;
  let spent = true;
  let linkIntent;
  const currentTargets = new Set(['_self', '_parent', '_top']);
  const linkHref = anchor => anchor?.getAttribute('href') ?? anchor?.getAttributeNS('http://www.w3.org/1999/xlink','href') ?? null;
  function linkFrom(event) {
    return event.composedPath().find(x => x instanceof Element && x.localName==='a' && ['http://www.w3.org/1999/xhtml','http://www.w3.org/2000/svg'].includes(x.namespaceURI) && linkHref(x)!==null);
  }
  function rememberGesture(event) {
    if (!event.isTrusted) return;
    if (event.type === 'keydown' && (!['Enter', ' '].includes(event.key) || event.repeat)) return;
    if (event.type === 'click' && event.button !== 0) return;
    // A random page/background click is not permission to open an ad.
    const target = event.composedPath().find(x => x instanceof Element);
    const anchor=linkFrom(event);
    if (!anchor && !target?.closest('button,input,select,textarea,[role="button"],[role="link"]')) {
      lastGesture = -Infinity; spent = true; linkIntent=undefined; return;
    }
    if(event.type==='click' && event.detail===0 && linkIntent?.anchor===anchor && linkIntent.key && now()-lastGesture<1500){linkIntent.event=event;return;}
    lastGesture = now(); spent = false;linkIntent=undefined;
    if(anchor){try{const url=new URL(linkHref(anchor),anchor.baseURI);if(['http:','https:'].includes(url.protocol))linkIntent={url:url.href,anchor,event,key:event.type==='keydown'};}catch{}}
  }
  window.addEventListener('click', rememberGesture, true);
  window.addEventListener('keydown', rememberGesture, true);
  function permit(destination) {
    if (strict){let url;try{url=new URL(destination,document.baseURI).href;}catch{return false;}
      let current;try{const href=linkHref(linkIntent?.anchor);if(href!==null)current=new URL(href,linkIntent.anchor.baseURI).href;}catch{}
      const handoff=destination===undefined || destination===null || destination==='' || /^about:blank(?:[?#]|$)/.test(url);
      if(!handoff && !/^https?:/.test(url))return false;
      if(!linkIntent || (!handoff && linkIntent.url!==url && current!==url) || spent || navigator.userActivation?.isActive!==true || now()-lastGesture>1500)return false;
      spent=true;linkIntent.event.preventDefault();return true;
    }
    if (spent || navigator.userActivation?.isActive !== true || now()-lastGesture > 1500) return false;
    spent = true; return true;
  }
  const guardedOpen = function (...args) {
    const target = typeof args[1] === 'string' ? args[1].toLowerCase() : '';
    if (currentTargets.has(target)) return nativeApply(nativeOpen,window,args);
    if (!permit(args[0])) return null;
    return nativeApply(nativeOpen,window,args);
  };
  if(strict){
    // Ignore page attempts to replace the guard; assigning still does not throw.
    try{Object.defineProperty(window,'open',{configurable:false,enumerable:true,get:()=>guardedOpen,set:()=>{}});}catch{window.open=guardedOpen;}
  }else window.open=guardedOpen;
  function opensWindow(target) {return !!target && !currentTargets.has(target.toLowerCase());}
  function linkClick(event) {
    const anchor = linkFrom(event);
    if (!anchor || !opensWindow(anchor.getAttribute('target') || document.querySelector('base[target]')?.target || '')) return;
    // An explicit Cmd/Ctrl/Shift gesture keeps the browser's intentional tab action.
    if (event.isTrusted && (event.metaKey || event.ctrlKey || event.shiftKey)) return;
    if (!event.isTrusted) {event.preventDefault();event.stopImmediatePropagation();}
  }
  window.addEventListener('click',linkClick,true);
  window.addEventListener('submit',event=>{
    const target=event.submitter?.formTarget || event.target.target || document.querySelector('base[target]')?.target || '';
    if(opensWindow(target) && (strict || !event.isTrusted || navigator.userActivation?.isActive !== true || now()-lastGesture > 1500)) {event.preventDefault();event.stopImmediatePropagation();}
  },true);
  HTMLFormElement.prototype.submit = function(...args) {
    const target=this.target || document.querySelector('base[target]')?.target || '';
    if(opensWindow(target) && !permit())return;
    return nativeApply(nativeSubmit,this,args);
  };
})();
