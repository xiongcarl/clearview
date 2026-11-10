/* Popup rules from the filter lists ($popup). GPL-3.0-or-later.
   Applied by the background when a page opens a new tab; see tools/build-popups.mjs. */
globalThis.AdShieldPopupFilter=(()=>{
  // Adblock pattern to RegExp: || anchors at a hostname label, | at either end, ^ is a separator, * a wildcard.
  function compile(rule){
    if(rule.re)return new RegExp(rule.r,rule.cs?'':'i');
    let text=rule.r,start='',end='';
    if(text.startsWith('||')){start='^[a-z][a-z0-9+.-]*://(?:[^/?#]*\\.)?';text=text.slice(2);}
    else if(text.startsWith('|')){start='^';text=text.slice(1);}
    if(text.endsWith('|')){end='$';text=text.slice(0,-1);}
    const body=text.replace(/[.+?${}()|[\]\\]/g,'\\$&').replace(/\*+/g,'.*').replace(/\^/g,'(?:[^\\w\\-.%]|$)');
    return new RegExp(start+body+end,rule.cs?'':'i');
  }
  const LISTS=['easylist','easyprivacy','chinese','fixes'];
  function create(rules,{isListed,getDomain,entityFor}){
    const hosts=new Map(),patterns=[];
    for(const rule of rules){if(rule.h){const list=hosts.get(rule.h) || [];list.push(rule);hosts.set(rule.h,list);}else patterns.push(rule);}
    const listed=(host,list)=>list.some(name=>name.endsWith('.*')?(()=>{const entity=entityFor(host);const want=name.slice(0,-2);return !!entity && (entity===want || entity.endsWith('.'+want));})():isListed(host,[name]));
    function applies(rule,opener,third,lists){
      if(lists && !lists[LISTS[rule.l]])return false;
      if(rule.tp===1 && !third)return false;if(rule.tp===-1 && third)return false;
      if(rule.inc && !(opener && listed(opener,rule.inc)))return false;
      if(rule.exc && opener && listed(opener,rule.exc))return false;
      return true;
    }
    // True when a blocking rule covers this popup and no exception rule does.
    function match(url,opener,lists){
      let target;try{target=new URL(url);}catch{return false;}
      if(!/^(?:https?|data):$/.test(target.protocol))return false;
      const host=target.hostname.toLowerCase().replace(/\.$/,'');
      const third=!opener || (getDomain(host) || host)!==(getDomain(opener) || opener);
      let block=false;
      const labels=host.split('.');
      for(let i=0;i<labels.length;i++)for(const rule of hosts.get(labels.slice(i).join('.')) || []){
        if(!applies(rule,opener,third,lists))continue;if(rule.x)return false;block=true;
      }
      for(const rule of patterns){
        if(!applies(rule,opener,third,lists))continue;
        if(rule.r!==''){let regex=rule.compiled;if(regex===undefined){try{regex=compile(rule);}catch{regex=null;}rule.compiled=regex;}if(!regex || !regex.test(target.href))continue;}
        if(rule.x)return false;block=true;
      }
      return block;
    }
    return {match,size:rules.length};
  }
  return {create};
})();
