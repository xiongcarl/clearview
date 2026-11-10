/* Ad Shield v4. Source is distributed under GPL-3.0-or-later; see LICENSE. */
globalThis.AdShield = (() => {
  const LIST_URL = 'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/light-onlydomains.txt';
  const MODES = ['balanced', 'strict', 'off'];
  // Mixed-use services: opt-in only. Keep top-level navigation, first-party
  // use, compatibility mode and explicit allow rules outside this restriction.
  const RESTRICTED_THIRD_PARTY = Object.freeze(['s.youtube.com','redirector.googlevideo.com','quantcast.com','bnc.lt','i.instagram.com','ngfts.lge.com','cdn.cookielaw.org','consent.trustarc.com','cdn.privacy-mgmt.com','go.skimresources.com','cdn.dynamicyield.com','clientstream.launchdarkly.com','click.mailchimp.com','widget.intercom.io','static.klaviyo.com','dai.google.com','ssl.p.jwpcdn.com']);
  // Donation page shown in the popup, options and welcome page. Empty hides every entry point.
  const SUPPORT_URL='https://ko-fi.com/clearview';
  // Firefox lacks a few Chromium-only options (about:blank fallback matching, CSS @scope in user sheets).
  const IS_FIREFOX=typeof navigator!=='undefined' && /\bFirefox\//.test(navigator.userAgent);
  const CORE_DOMAINS = ['doubleclick.net','googlesyndication.com','googleadservices.com','adnxs.com','adsrvr.org','advertising.com','adform.net','criteo.com','criteo.net','rubiconproject.com','pubmatic.com','openx.net','casalemedia.com','bidswitch.net','smartadserver.com','taboola.com','outbrain.com','revcontent.com','mgid.com','popads.net','popcash.net','propellerads.com','clickadu.com','exoclick.com','juicyads.com','trafficjunky.net','adsterra.com','a-ads.com','hilltopads.net','ad-maven.com'];
  function validDomain(x) {
    return typeof x === 'string' && x.length <= 253 && x === x.toLowerCase() &&
      x.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
  }
  function hostname(url) {
    try {const parsed = new URL(url); const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
      return ['http:', 'https:'].includes(parsed.protocol) && validDomain(host) ? host : null;
    } catch {return null;}
  }
  function normalizeDomain(input) {
    const value = String(input).trim();
    return hostname(value.includes('://') ? value : 'https://' + value);
  }
  function domains(list, limit=500) {return [...new Set((Array.isArray(list) ? list : []).filter(validDomain))].slice(0, limit);}
  function selectorChain(selector){
    const parts=[];let start=0,quote='',escaped=false,depth=0;
    for(let i=0;i<selector.length;i++){
      const char=selector[i];if(escaped){escaped=false;continue;}if(char==='\\'){escaped=true;continue;}
      if(quote){if(char===quote)quote='';continue;}if(char==='"' || char==="'"){quote=char;continue;}
      if(char==='[' || char==='(')depth++;else if(char===']' || char===')')depth--;
      if(depth===0 && selector.slice(i,i+3)==='>>>'){parts.push(selector.slice(start,i).trim());i+=2;start=i+1;}
    }
    parts.push(selector.slice(start).trim());return parts;
  }
  function scopedSelector(selector){
    let result='',quote='',escaped=false,brackets=0;
    for(let i=0;i<selector.length;i++){
      const char=selector[i];
      if(escaped){result+=char;escaped=false;continue;}if(char==='\\'){result+=char;escaped=true;continue;}
      if(quote){result+=char;if(char===quote)quote='';continue;}if(char==='"' || char==="'"){result+=char;quote=char;continue;}
      if(char==='[')brackets++;else if(char===']')brackets--;
      if(!brackets && (i===0 || /[\s,(>+~]/.test(selector[i-1]))){
        const token=selector.slice(i).match(/^(html|:root)(?=$|[\s.#[:>+~,)])/i);
        if(token){result+=':scope';i+=token[0].length-1;continue;}
      }
      result+=char;
    }
    return result;
  }
  function safeFilterSelector(selector,limit=2000) {
    if(typeof selector!=='string' || !selector.trim() || selector.length>limit || /[\r\n\f]/.test(selector))return false;
    let quote='',escaped=false;
    for(let i=0;i<selector.length;i++){
      const c=selector[i];
      if(escaped){escaped=false;continue;}
      if(c==='\\'){escaped=true;continue;}
      if(quote){if(c===quote)quote='';continue;}
      if(c==='"' || c==="'"){quote=c;continue;}
      // Quoted attribute values are data, not CSS declarations. Keep blocking
      // unquoted rule/declaration delimiters and comments before interpolation.
      if(/[{};@]/.test(c) || (c==='/' && selector[i+1]==='*'))return false;
    }
    return !quote && !escaped;
  }
  function safeSelector(selector) {return safeFilterSelector(selector,500) && selectorChain(selector).length<=8 && selectorChain(selector).every(x=>x && !['*','html','body',':root'].includes(x.toLowerCase()));}
  function clean(value={}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) value = {};
    const bool = (key, fallback) => typeof value[key] === 'boolean' ? value[key] : fallback;
    const popupMode = MODES.includes(value.popupMode) ? value.popupMode : value.strict === true ? 'strict' : 'balanced';
    const siteModes = (Array.isArray(value.siteModes) ? value.siteModes : []).filter(x => x && validDomain(x.host) && MODES.includes(x.mode));
    const cosmeticRules = (Array.isArray(value.cosmeticRules) ? value.cosmeticRules : []).filter(x => x && validDomain(x.host) && safeSelector(x.selector));
    return {enabled: bool('enabled',true), enhancedTracking:bool('enhancedTracking',false),directBlocking:bool('directBlocking',false),strictThirdParty:bool('strictThirdParty',false), popupMode, hideAds: bool('hideAds',true),shadowAds:bool('shadowAds',true), autoUpdate: bool('autoUpdate',false), badgeCount:bool('badgeCount',false), logging:bool('logging',false),userFilters:typeof value.userFilters==='string'?value.userFilters.slice(0,200000):'',scriptlets:bool('scriptlets',true),procedural:bool('procedural',true), webFilters:Object.fromEntries(['easylist','easyprivacy','chinese','annoyances','fixes'].map(id=>[id,typeof value.webFilters?.[id]==='boolean'?value.webFilters[id]:id!=='annoyances'])),
      compatSites:domains(value.compatSites,200),whitelist: domains(value.whitelist,200), blockDomains: domains(value.blockDomains), allowDomains: domains(value.allowDomains),
      siteModes: [...new Map(siteModes.map(x => [x.host,{host:x.host,mode:x.mode}])).values()].slice(0,50),
      cosmeticRules: [...new Map(cosmeticRules.map(x => [x.host+'\n'+x.selector,{host:x.host,selector:x.selector.trim()}])).values()].slice(0,300)};
  }
  const entities=new Map();
  function entityFor(host){if(entities.has(host))return entities.get(host);const suffix=globalThis.AdShieldDomainUtils?.getPublicSuffix(host,{allowPrivateDomains:false});const value=suffix && host.length>suffix.length?host.slice(0,-suffix.length-1):'';if(entities.size>=256)entities.delete(entities.keys().next().value);entities.set(host,value);return value;}
  function isListed(host,list){return !!host && list.some(domain=>{if(domain.endsWith('.*')){const entity=entityFor(host);const name=domain.slice(0,-2);return entity===name || entity.endsWith('.'+name);}return host===domain || host.endsWith('.'+domain);});}
  function modeFor(host, settings) {
    return settings.siteModes.filter(x => isListed(host,[x.host])).sort((a,b)=>b.host.length-a.host.length)[0]?.mode || settings.popupMode;
  }
  function patterns(host) {return /^\d+\.\d+\.\d+\.\d+$/.test(host) ? [`*://${host}/*`] : [`*://${host}/*`,`*://*.${host}/*`];}
  function excludes(list) {return list.flatMap(patterns);}
  // hot lists the hosts the background has seen need per-site treatment; see background.js.
  function scripts(settings,hot={fixes:{},genericOff:{}}) {
    if (!settings.enabled) return [];
    const shared={matches:['http://*/*','https://*/*'],excludeMatches:excludes(settings.whitelist),runAt:'document_start',allFrames:false,persistAcrossSessions:true};
    const everyFrame={allFrames:true, ...(IS_FIREFOX?{}:{matchOriginAsFallback:true})};
    const result=[{...shared,id:'ad-style',world:'ISOLATED',js:pageFiles(settings), ...everyFrame, css:[]}];
    // Selectors every site gets. The browser injects these at document start without any script running.
    if(settings.hideAds)result.push({...shared,id:'generic-css',css:genericFiles(settings),excludeMatches:excludes([...settings.whitelist,...settings.compatSites]).concat(Object.keys(hot.genericOff || {}))});
    const guard = mode => mode === 'strict' ? 'guard-strict.js' : 'guard-standard.js';
    if (settings.popupMode === 'strict') result.push({...shared,id:'popup-guard',world:'MAIN',js:[guard(settings.popupMode)],excludeMatches:excludes([...settings.whitelist,...settings.siteModes.map(x=>x.host)])});
    if(settings.scriptlets && settings.webFilters.fixes){
      const shards=new Map();
      for(const [pattern,[shard]] of Object.entries(hot.fixes || {})){if(!shards.has(shard))shards.set(shard,[]);shards.get(shard).push(pattern);}
      for(const [shard,matches] of shards)result.push({...shared,id:'fix-'+shard,world:'MAIN',allFrames:true,js:fixFiles(shard),matches,excludeMatches:excludes([...settings.whitelist,...settings.compatSites])});
    }
    settings.siteModes.forEach((entry,i)=>{
      if (entry.mode !== 'strict') return;
      const children=settings.siteModes.filter(x=>x.host!==entry.host && isListed(x.host,[entry.host])).map(x=>x.host);
      result.push({...shared,id:'popup-site-'+i,world:'MAIN',js:[guard(entry.mode)],matches:patterns(entry.host),excludeMatches:excludes([...settings.whitelist,...children])});
    });
    return result;
  }
  // The link-gesture recorder only serves strict popup blocking; nobody else pays for it.
  function usesStrict(settings){return settings.popupMode==='strict' || settings.siteModes.some(x=>x.mode==='strict');}
  function pageFiles(settings){return [...(usesStrict(settings)?['popup-intent.js']:[]),'shadow-filtering.js','content.js'];}
  function genericFiles(settings){return ['base',...['easylist','easyprivacy','chinese','annoyances','fixes'].filter(id=>settings.webFilters[id])].map(id=>`data/engine/generic-${id}.css`);}
  function fixFiles(shard){return ['vendor/publicsuffix.js','fixes/lib.js',`fixes/data-${shard}.js`];}
  function domainRules(list, firstId=20000, priority=20) {
    const rules=[];
    for(let i=0;i<list.length;i+=250) rules.push({id:firstId+rules.length,priority,action:{type:'block'},condition:{requestDomains:list.slice(i,i+250)}});
    return rules;
  }
  function dynamicRules(settings, cachedDomains) {
    if (!settings.enabled) return [];
    const result=cachedDomains ? domainRules(cachedDomains) : [];
    // Navigation is a user workflow, not an advertising subresource. Explicit
    // manual blocks (5000) still win; this does not allow the new page's assets.
    result.push({id:10008,priority:1000,action:{type:'allow'},condition:{resourceTypes:['main_frame']}});
    // Google Identity/OAuth endpoints are shared by legitimate sign-in flows.
    result.push({id:10009,priority:1000,action:{type:'allow'},condition:{requestDomains:['accounts.google.com','oauth2.googleapis.com'],excludedResourceTypes:['ping']}});
    if(settings.compatSites.length)result.push({id:10010,priority:1000,action:{type:'allow'},condition:{initiatorDomains:settings.compatSites,domainType:'firstParty'}});

    if(settings.whitelist.length) result.push(
      {id:10001,priority:10000,action:{type:'allowAllRequests'},condition:{requestDomains:settings.whitelist,resourceTypes:['main_frame']}},
      {id:10002,priority:10000,action:{type:'allow'},condition:{initiatorDomains:settings.whitelist}});
    if(settings.compatSites.length)result.push({id:10005,priority:10,action:{type:'allowAllRequests'},condition:{requestDomains:settings.compatSites,resourceTypes:['main_frame']}},{id:10006,priority:10,action:{type:'allow'},condition:{initiatorDomains:settings.compatSites}});
    if(settings.blockDomains.length) result.push({id:10003,priority:5000,action:{type:'block'},condition:{requestDomains:settings.blockDomains}});
    if(settings.blockDomains.length) result.push({id:10011,priority:5000,action:{type:'block'},condition:{requestDomains:settings.blockDomains,resourceTypes:['main_frame']}});
    if(settings.allowDomains.length) result.push({id:10012,priority:6000,action:{type:'allow'},condition:{requestDomains:settings.allowDomains,resourceTypes:['main_frame']}});
    if(settings.allowDomains.length) result.push({id:10004,priority:6000,action:{type:'allow'},condition:{requestDomains:settings.allowDomains}});
    if(settings.strictThirdParty) result.push({id:10007,priority:5,action:{type:'block'},condition:{requestDomains:[...RESTRICTED_THIRD_PARTY],domainType:'thirdParty',excludedResourceTypes:['main_frame']}});
    return result;
  }
  function parseList(text) {
    if (typeof text !== 'string' || text.length > 6000000 || !text.includes("# Title: HaGeZi's Multi LIGHT")) throw new Error(globalThis.I18N?I18N.t('bg_list_format'):'List format mismatch');
    const declared=Number(text.match(/^# Number of entries:\s*(\d+)\s*$/m)?.[1]);
    const entries=text.split(/\r?\n/).map(x=>x.trim()).filter(x=>x && !x.startsWith('#'));
    if(!Number.isInteger(declared) || declared<5000 || declared>150000 || entries.length!==declared || entries.some(x=>!validDomain(x) || !x.includes('.'))) throw new Error(globalThis.I18N?I18N.t('bg_list_invalid'):'Invalid list');
    return {domains:[...new Set([...entries,...CORE_DOMAINS])].sort(), sourceVersion:text.match(/^# Version:\s*(.+)$/m)?.[1] || '',sourceCount:declared};
  }
  return {entityFor,usesStrict,pageFiles,genericFiles,fixFiles,LIST_URL,SUPPORT_URL,IS_FIREFOX,MODES,CORE_DOMAINS,RESTRICTED_THIRD_PARTY,validDomain,hostname,normalizeDomain,safeFilterSelector,safeSelector,selectorChain,scopedSelector,clean,isListed,modeFor,patterns,scripts,domainRules,dynamicRules,parseList};
})();
