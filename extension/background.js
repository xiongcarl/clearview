// Chrome loads the shared scripts here; Firefox lists them in manifest background.scripts.
if(typeof importScripts==='function')importScripts('vendor/publicsuffix.js','i18n.js','common.js','user-filters.js','cosmetic-engine.js','static-rule-policy.js','popup-rescue.js','popup-filter.js');
const A=AdShield;
let cancellationData;let initializationError;let enhancedMeta,localCoverage;let seedMeta,webMeta,extendedData,advancedMeta,baseSelectors;let logging=false;let logs=[];let flushTimer;let actionMap;
const isExtended=x=>/:(?:has-text|contains|matches-css(?:-before|-after)?|matches-attr|matches-property|xpath|upward|nth-ancestor|if-not|empty-trimmed)\(/i.test(x);
const WEB_IDS=['easylist','easyprivacy','chinese','annoyances','fixes'];
// Firefox packages split large files: AMO does not parse text files over 5 MB.
const ENHANCED_IDS=chrome.runtime.getManifest().declarative_net_request.rule_resources.map(x=>x.id).filter(id=>id==='enhanced' || id.startsWith('enhanced_'));
const DIRECT_IDS=['direct_easylist','direct_easyprivacy','direct_chinese','direct_fixes'];
async function readState(){const state=await chrome.storage.local.get(['settings','listCache','updateMeta']);return {...state,settings:A.clean(state.settings)};}
// Pages ask for their policy constantly; the settings stay cached until they change.
let settingsCache;
const readSettings=()=>settingsCache ||= chrome.storage.local.get('settings').then(({settings})=>A.clean(settings));
async function ensureAlarm(settings){
  if(settings.autoUpdate){if(!await chrome.alarms.get('update-list'))await chrome.alarms.create('update-list',{periodInMinutes:1440});}
  else await chrome.alarms.clear('update-list');
  if(!await chrome.alarms.get('stats-sync'))await chrome.alarms.create('stats-sync',{periodInMinutes:4});
}
// Every frame of a page asks for the same host's selectors. Keep recent hosts until the
// settings change (applySettings clears it).
const cosmeticCache=new Map();
async function listCosmetics(host,settings){
  if(cosmeticCache.has(host)){const hit=cosmeticCache.get(host);cosmeticCache.delete(host);cosmeticCache.set(host,hit);return hit;}
  extendedData ||= await fetch(chrome.runtime.getURL('data/extended-cosmetics.json')).then(r=>r.json());
  baseSelectors ||= await fetch(chrome.runtime.getURL('data/builtin-cosmetics.json')).then(r=>r.json());
  const selection=await CosmeticEngine.resolve(host,settings.webFilters,extendedData);
  const permitted=(selector,scoped)=>!(scoped?selection.specific:selection.generic) && !selection.exceptions.has(selector);
  const selectors=[...selection.selectors];
  if(settings.webFilters.easylist){
    localCoverage ||= await fetch(chrome.runtime.getURL('data/local-coverage.json')).then(r=>r.json());
    for(const group of localCoverage.cosmetic)if(group.hosts.length && A.isListed(host,group.hosts))selectors.push(...group.selectors.filter(selector=>permitted(selector,true)));
  }
  // Shadow roots get only rules written for this site plus the curated built-ins. The
  // generic lists target page markup; inside self-contained components they mostly hit
  // unrelated widgets (uBO does not apply them there either).
  const component=[...selection.scoped,...baseSelectors.filter(selector=>permitted(selector,false))];
  const result={genericOff:selection.generic,styles:CosmeticEngine.styleRules(host,extendedData,settings.webFilters,selection),selectors:Object.freeze(selectors),component:Object.freeze([...new Set(component)]),extended:Object.freeze(CosmeticEngine.extendedSelectors(host,extendedData,settings.webFilters,selection))};
  cosmeticCache.set(host,result);if(cosmeticCache.size>64)cosmeticCache.delete(cosmeticCache.keys().next().value);
  return result;
}
// Actions of the installed dynamic rules (settings, domain list and the user's filters).
let dynamicActions;
async function ruleAction({ruleId,rulesetId}){
  if(rulesetId==='_dynamic' || rulesetId==='_session'){
    dynamicActions ||= chrome.declarativeNetRequest.getDynamicRules().then(rules=>new Map(rules.map(rule=>[rule.id,rule.action.type])));
    const type=(await dynamicActions).get(ruleId);return type==='allow' || type==='allowAllRequests'?'allow':type || 'block';
  }
  if(rulesetId==='ads' || ENHANCED_IDS.includes(rulesetId) || rulesetId==='local_ads' || DIRECT_IDS.includes(rulesetId))return 'block';
  actionMap ||= fetch(chrome.runtime.getURL('data/engine/rule-actions.json')).then(r=>r.json());
  return (await actionMap)[rulesetId]?.[ruleId] || 'block';
}
// Blocked-request statistics. Chrome allows getMatchedRules 20 times per 10 minutes, so every
// caller shares one incremental all-tabs query: matches newer than the last sync are added to
// the tab's count (reset when the tab commits a new page) and to the lifetime totals. A periodic
// alarm keeps syncing within the 5 minutes Chrome retains matches of closed pages.
const STATS_CALLS=18,STATS_WINDOW=600000,STATS_RESERVED=4;
let statsChain=Promise.resolve();
function statsTask(task){const result=statsChain.then(task);statsChain=result.catch(error=>console.error('Stats:',error));return result;}
const dayKey=time=>new Date(time).toLocaleDateString('sv');
async function statsSession(){return (await chrome.storage.session.get('statsSession')).statsSession || {last:0,calls:[],tabs:{}};}
async function statsState(){
  const [session,{stats}]=await Promise.all([statsSession(),chrome.storage.local.get('stats')]);
  return {session,stats:stats || {total:0,since:new Date().toISOString(),days:{},sites:{}}};
}
async function syncStats(minGap){
  const {session,stats}=await statsState();const now=Date.now();
  session.calls=session.calls.filter(time=>now-time<STATS_WINDOW);
  // UI refreshes leave a reserve for the alarm so closed pages are still counted.
  if(now-(session.calls.at(-1) || 0)<minGap || session.calls.length>=(minGap?STATS_CALLS-STATS_RESERVED:STATS_CALLS))return {session,stats};
  if(!chrome.declarativeNetRequest.getMatchedRules)return {session,stats};
  session.calls.push(now);
  let rulesMatchedInfo;
  try{({rulesMatchedInfo}=await chrome.declarativeNetRequest.getMatchedRules({minTimeStamp:session.last+1}));}
  catch(error){
    // Chrome counts these calls across extension reloads; our own log starts empty after one.
    // Treat the window as used up and show the numbers already stored until it passes.
    if(!/MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL|quota/i.test(error?.message || ''))throw error;
    session.calls=Array(STATS_CALLS).fill(now);await chrome.storage.session.set({statsSession:session});
    return {session,stats};
  }
  let counted=false;
  for(const match of rulesMatchedInfo){
    session.last=Math.max(session.last,match.timeStamp);
    const action=await ruleAction(match.rule);if(action!=='block' && action!=='redirect')continue;
    counted=true;stats.total++;const day=dayKey(match.timeStamp);stats.days[day]=(stats.days[day] || 0)+1;
    const tab=session.tabs[match.tabId];
    if(tab && match.timeStamp>=tab.since){tab.count++;if(tab.host)stats.sites[tab.host]=(stats.sites[tab.host] || 0)+1;}
  }
  for(const [id,tab] of Object.entries(session.tabs))if(tab.removed)delete session.tabs[id];
  const days=Object.keys(stats.days).sort();for(const day of days.slice(0,-90))delete stats.days[day];
  const sites=Object.entries(stats.sites);if(sites.length>300)stats.sites=Object.fromEntries(sites.sort((a,b)=>b[1]-a[1]).slice(0,200));
  // The periodic sync usually finds nothing new; leave the stored totals alone then.
  await Promise.all([chrome.storage.session.set({statsSession:session}),...(counted?[chrome.storage.local.set({stats})]:[])]);
  return {session,stats};
}
async function tabStats(tabId){
  const {session,stats}=await statsTask(()=>syncStats(3000));
  return {blocked:session.tabs[tabId]?.count || 0,replaced:0,total:stats.total,today:stats.days[dayKey(Date.now())] || 0};
}
// Firefox has no getMatchedRules. Count the requests its rule engine cancelled (NS_ERROR_ABORT;
// a page that navigates away aborts with NS_BINDING_ABORTED instead) or redirected to a bundled
// stand-in.
if(!chrome.declarativeNetRequest.getMatchedRules && chrome.webRequest){
  const seen=new Map();let batch=[],flushTimer;
  const flush=()=>statsTask(async()=>{
    const items=batch;batch=[];if(!items.length)return;
    const {session,stats}=await statsState();
    for(const {tabId,time} of items){
      stats.total++;const day=dayKey(time);stats.days[day]=(stats.days[day] || 0)+1;
      const tab=session.tabs[tabId];if(tab && time>=tab.since){tab.count++;if(tab.host)stats.sites[tab.host]=(stats.sites[tab.host] || 0)+1;}
    }
    await Promise.all([chrome.storage.session.set({statsSession:session}),chrome.storage.local.set({stats})]);
  });
  const record=details=>{
    // Speculative preloads repeat the same URL under a new request ID.
    const key=details.tabId+' '+details.url;if(details.timeStamp-(seen.get(key) || 0)<3000)return;seen.set(key,details.timeStamp);if(seen.size>5000)seen.clear();
    batch.push({tabId:details.tabId,time:details.timeStamp});clearTimeout(flushTimer);flushTimer=setTimeout(flush,800);
  };
  const standIn=chrome.runtime.getURL('vendor/redirects/');
  chrome.webRequest.onErrorOccurred.addListener(details=>{if(details.error==='NS_ERROR_ABORT')record(details);},{urls:['<all_urls>']});
  chrome.webRequest.onBeforeRedirect.addListener(details=>{if(details.redirectUrl.startsWith(standIn))record(details);},{urls:['<all_urls>']});
}
chrome.webNavigation.onCommitted.addListener(event=>{
  if(event.frameId!==0 || event.tabId<0 || event.documentLifecycle==='prerender')return;
  statsTask(async()=>{const session=await statsSession();session.tabs[event.tabId]={host:A.hostname(event.url),since:Math.floor(event.timeStamp),count:0};await chrome.storage.session.set({statsSession:session});});
});
chrome.tabs.onRemoved.addListener(tabId=>openedTabs.delete(tabId));
chrome.tabs.onRemoved.addListener(tabId=>statsTask(async()=>{const session=await statsSession();if(session.tabs[tabId]){session.tabs[tabId].removed=true;await chrome.storage.session.set({statsSession:session});}}));
// Hosts that need per-site treatment are learned as the user reaches them. Registering every
// listed host up front would make the browser test ~25,000 patterns on each frame of each page.
// Learned hosts stay registered, so only the first visit can race the page's own scripts; that
// visit also gets the fixes injected at commit. Scriptlets guard against running twice.
const HOT_LIMIT=400;
let fixIndex,hotCache;
const readHot=()=>hotCache ||= chrome.storage.local.get('hot').then(({hot})=>hot || {fixes:{},genericOff:{}});
const trim=(record,size)=>{const keys=Object.keys(record);if(keys.length>size){const stamp=value=>Array.isArray(value)?value[1]:value;for(const key of keys.sort((a,b)=>stamp(record[a])-stamp(record[b])).slice(0,keys.length-size))delete record[key];}};
async function registerScripts(settings,hot,ids){
  const desired=A.scripts(settings,hot).filter(script=>!ids || ids.includes(script.id));
  const old=await chrome.scripting.getRegisteredContentScripts(ids?{ids}:undefined);
  const obsolete=old.filter(x=>!desired.some(next=>next.id===x.id));
  if(obsolete.length)await chrome.scripting.unregisterContentScripts({ids:obsolete.map(x=>x.id)});
  const existing=desired.filter(x=>old.some(previous=>previous.id===x.id));const missing=desired.filter(x=>!old.some(previous=>previous.id===x.id));
  if(existing.length)await chrome.scripting.updateContentScripts(existing);
  if(missing.length)await chrome.scripting.registerContentScripts(missing);
}
// Sites where missing the fixes even once has a visible cost: YouTube answers a single failed ad
// with its ad blocker warning. They are known from the start instead of learned on first visit.
const KNOWN_HOSTS=['www.youtube.com','m.youtube.com','music.youtube.com','tv.youtube.com','www.youtube-nocookie.com','www.youtubekids.com','www.twitch.tv'];
async function seedHot(settings,hot){
  if(!settings.enabled)return;
  const fixes=settings.scriptlets && settings.webFilters.fixes;
  if(fixes)fixIndex ||= await fetch(chrome.runtime.getURL('data/engine/fix-keys.json')).then(r=>r.json());
  for(const host of KNOWN_HOSTS){
    if(fixes)for(const key of CosmeticEngine.hostKeys(host))if(fixIndex[key]!==undefined)hot.fixes[`*://*.${key}/*`] ||= [fixIndex[key],Date.now()];
    if(settings.hideAds && (await listCosmetics(host,settings)).genericOff)hot.genericOff[`*://${host}/*`] ||= Date.now();
  }
}
// Returns the fix buckets this host needed for the first time.
async function learnHost(host,topFrame,settings){
  if(!settings.enabled || !host || A.isListed(host,settings.whitelist) || A.isListed(host,settings.compatSites))return [];
  const keys=CosmeticEngine.hostKeys(host);const {offKeys}=await CosmeticEngine.meta();
  const fixes=settings.scriptlets && settings.webFilters.fixes;
  if(fixes)fixIndex ||= await fetch(chrome.runtime.getURL('data/engine/fix-keys.json')).then(r=>r.json());
  offSet ||= new Set(offKeys);
  const hits=fixes?keys.filter(key=>fixIndex[key]!==undefined):[];
  const offHit=topFrame && settings.hideAds && keys.some(key=>offSet.has(key)) && (await listCosmetics(host,settings)).genericOff;
  if(!hits.length && !offHit)return [];
  return enqueue(async()=>{
    const hot=await readHot();const now=Date.now();const changed=new Set(),fresh=new Set();
    for(const key of hits){
      // An entity key such as example.* is registered for the exact domain being visited.
      const domain=key.endsWith('.*')?key.slice(0,-1)+AdShieldDomainUtils.getPublicSuffix(host,{allowPrivateDomains:false}):key;
      const pattern=`*://*.${domain}/*`;const shard=fixIndex[key];
      if(hot.fixes[pattern]){hot.fixes[pattern][1]=now;continue;}
      hot.fixes[pattern]=[shard,now];changed.add('fix-'+shard);fresh.add(shard);
    }
    if(offHit){const pattern=`*://${host}/*`;if(!hot.genericOff[pattern]){hot.genericOff[pattern]=now;changed.add('generic-css');}}
    if(!changed.size)return [];
    trim(hot.fixes,HOT_LIMIT);trim(hot.genericOff,HOT_LIMIT);
    await chrome.storage.local.set({hot});
    await registerScripts(await readSettings(),hot,[...changed]);
    return [...fresh];
  });
}
let offSet;
const firstVisits=new Map();
const WEB_ONLY={url:[{schemes:['http','https']}]};
chrome.webNavigation.onBeforeNavigate.addListener(event=>{
  const task=readSettings().then(settings=>learnHost(A.hostname(event.url),event.frameId===0,settings)).catch(error=>{console.debug('Learn host:',error.message);return [];});
  firstVisits.set(event.tabId+':'+event.frameId,task);
},WEB_ONLY);
chrome.webNavigation.onCommitted.addListener(async event=>{
  const key=event.tabId+':'+event.frameId;const pending=firstVisits.get(key);firstVisits.delete(key);if(!pending)return;
  const shards=await pending;
  for(const shard of shards){
    const target=event.documentId?{tabId:event.tabId,documentIds:[event.documentId]}:{tabId:event.tabId,frameIds:[event.frameId]};
    try{await chrome.scripting.executeScript({target,world:'MAIN',injectImmediately:true,files:A.fixFiles(shard)});}
    catch(error){if(!await injectionCancelled(error,target))console.debug('Site fixes:',error.message);}
  }
},WEB_ONLY);
let parsedFilters={text:null};
function userFilters(settings){if(parsedFilters.text!==settings.userFilters)parsedFilters={text:settings.userFilters,result:UserFilters.parse(settings.userFilters)};return parsedFilters.result;}
async function applySettings(settings,listCache){
  cosmeticCache.clear();dynamicActions=undefined;settingsCache=Promise.resolve(settings);
  const dynamic=A.dynamicRules(settings,listCache?.domains);
  if(settings.enabled){
    const parsed=userFilters(settings);
    if(parsed.errors.length)throw new Error(I18N.t('uf_myfilters_line',parsed.errors[0].line,parsed.errors[0].message));
    for(const entry of parsed.network)if(entry.condition.regexFilter){
      const check=await chrome.declarativeNetRequest.isRegexSupported({regex:entry.condition.regexFilter,isCaseSensitive:!!entry.condition.isUrlFilterCaseSensitive});
      if(!check.isSupported)throw new Error(I18N.t('uf_myfilters_line',entry.line,I18N.t('bg_regex_unsupported')));
    }
    dynamic.push(...UserFilters.rules(parsed));
  }
  const oldRules=await chrome.declarativeNetRequest.getDynamicRules();
  // The dynamic replacement is atomic; a bad update never deletes the old list.
  try{await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:oldRules.map(x=>x.id),addRules:dynamic});}
  catch(error){if(/MAX_NUMBER_OF_(DYNAMIC|REGEX)/.test(error.message))throw new Error(I18N.t('bg_dynamic_quota'));throw error;}
  dynamicActions=undefined;
  const useStatic=settings.enabled && !listCache;
  const enable=[...(useStatic?['ads']:[]),...(settings.enabled && settings.webFilters.easylist?['local_ads']:[]),...DIRECT_IDS.filter(id=>settings.enabled && settings.directBlocking && settings.webFilters[id.slice(7)]),...(settings.enabled && settings.enhancedTracking?ENHANCED_IDS:[]),...WEB_IDS.filter(id=>settings.enabled && settings.webFilters[id])];
  cancellationData ||= await fetch(chrome.runtime.getURL('data/badfilter-policy.json')).then(r=>{if(!r.ok)throw new Error('Missing bundled cancellation policy');return r.json();});
  await AdShieldStaticPolicy.apply(cancellationData,settings,chrome.declarativeNetRequest);
  try{await chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds:enable,disableRulesetIds:['ads',...ENHANCED_IDS,'local_ads',...DIRECT_IDS,...WEB_IDS].filter(id=>!enable.includes(id))});}
  catch(error){if(/GUARANTEED_MINIMUM_STATIC_RULES|static rules/i.test(error.message))throw new Error(I18N.t('bg_rule_quota'));throw error;}
  logging=settings.logging;
  if(!logging){clearTimeout(flushTimer);logs=[];await chrome.storage.session.remove('diagnosticLogs');}
  const hot=await readHot();const before=JSON.stringify(hot);await seedHot(settings,hot);
  if(JSON.stringify(hot)!==before)await chrome.storage.local.set({hot});
  const hadRecorder=!!(await chrome.scripting.getRegisteredContentScripts({ids:['ad-style']}))[0]?.js?.some(file=>file.endsWith('popup-intent.js'));
  await registerScripts(settings,hot);
  // Pages already open predate a newly chosen strict mode; give them the recorder now.
  if(!hadRecorder && A.usesStrict(settings))preparePopupObservers(settings).catch(error=>console.error('Popup observer:',error));
  await ensureAlarm(settings);
  // Per-tab count of blocked/replaced requests on the toolbar icon is opt-in (settings);
  // the popup always shows it. Chrome resets the count on navigation.
  // Firefox has no action-count badge; the popup and statistics still show the counts.
  await chrome.declarativeNetRequest.setExtensionActionOptions?.({displayActionCountAsBadgeText:settings.enabled && settings.badgeCount});
  await chrome.action.setBadgeText({text:settings.enabled?'':'OFF'});
  await chrome.action.setBadgeBackgroundColor({color:'#6b6963'});
  await chrome.action.setBadgeTextColor?.({color:'#ffffff'});
}
const popupRescue=AdShieldPopupRescue.create({api:chrome,A,readState});
chrome.webNavigation.onCreatedNavigationTarget.addListener(event=>popupRescue.handle(event).catch(error=>console.error('Popup rescue:',error)));
chrome.tabs.onRemoved.addListener(tabId=>popupRescue.forget(tabId));
// The lists' $popup rules. declarativeNetRequest cannot tell a popup from a navigation the
// user asked for, so a tab a page opens is checked here and closed when a rule names it.
// It is watched for a few seconds: popunders often open blank and navigate afterwards.
let popupFilter;const openedTabs=new Map();
const loadPopupFilter=()=>popupFilter ||= fetch(chrome.runtime.getURL('data/engine/popups.json')).then(r=>r.json()).then(rules=>AdShieldPopupFilter.create(rules,{isListed:A.isListed,entityFor:A.entityFor,getDomain:host=>AdShieldDomainUtils.getDomain(host,{allowPrivateDomains:false})}));
async function checkOpenedTab(tabId,url){
  const record=openedTabs.get(tabId);if(!record)return;
  if(Date.now()>record.until){openedTabs.delete(tabId);return;}
  // Still finding out whether the user clicked a link; remember the newest address for then.
  if(record.pending){record.latest=url;return;}
  const [settings,filter]=await Promise.all([readSettings(),loadPopupFilter()]);
  if(!settings.enabled || !filter.match(url,record.opener,settings.webFilters) || !openedTabs.delete(tabId))return;
  try{await chrome.tabs.remove(tabId);}catch{} // Already closed.
}
// A link the user clicked is never a popup, whatever the lists say about its destination: the
// address was there to read before the click. The link under the pointer (or the focused one,
// for the keyboard) is read from the opening frame right away; a tab opened to that same
// address is left alone, and so is wherever it redirects. If the frame cannot be asked, the
// tab stays open: closing something the user chose is worse than missing a popup.
function linksAtPointer(){
  const found=[];
  const add=element=>{
    for(let node=element;node;node=node.parentElement || node.getRootNode()?.host){
      if(node.localName!=='a')continue;
      const raw=node.getAttribute('href') ?? node.getAttributeNS('http://www.w3.org/1999/xlink','href');
      if(raw!==null){try{found.push(new URL(raw,node.baseURI).href);}catch{}}
      return;
    }
  };
  let active=document.activeElement;while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;
  add(active);for(const element of document.querySelectorAll('a:hover'))add(element);
  return found;
}
const sameAddress=(a,b)=>{try{const x=new URL(a),y=new URL(b);x.hash='';y.hash='';return x.href===y.href;}catch{return false;}};
async function openedByClickedLink(event){
  try{
    const results=await chrome.scripting.executeScript({target:{tabId:event.sourceTabId,frameIds:[event.sourceFrameId || 0]},world:'ISOLATED',func:linksAtPointer});
    return (results?.[0]?.result || []).some(href=>sameAddress(href,event.url));
  }catch{return true;}
}
chrome.webNavigation.onCreatedNavigationTarget.addListener(async event=>{
  try{
    if(!Number.isInteger(event.sourceTabId) || !Number.isInteger(event.tabId) || event.sourceTabId===event.tabId)return;
    const settings=await readSettings();if(!settings.enabled)return;
    const opener=A.hostname((await chrome.tabs.get(event.sourceTabId)).url);
    if(!opener || A.isListed(opener,settings.whitelist) || A.isListed(opener,settings.compatSites) || A.modeFor(opener,settings)==='off')return;
    // Watch from now so a quick redirect is not missed while the opening frame is asked.
    openedTabs.set(event.tabId,{opener,until:Date.now()+5000,pending:true});
    if(await openedByClickedLink(event)){openedTabs.delete(event.tabId);return;}
    const latest=openedTabs.get(event.tabId)?.latest;
    if(!openedTabs.has(event.tabId))return;
    openedTabs.set(event.tabId,{opener,until:Date.now()+5000});
    if(openedTabs.size>64)openedTabs.delete(openedTabs.keys().next().value);
    await checkOpenedTab(event.tabId,event.url);
    if(latest && latest!==event.url)await checkOpenedTab(event.tabId,latest);
  }catch(error){console.debug('Popup filter:',error.message);}
});
for(const name of ['onBeforeNavigate','onCommitted'])chrome.webNavigation[name].addListener(event=>{
  if(event.frameId===0 && openedTabs.has(event.tabId))checkOpenedTab(event.tabId,event.url).catch(error=>console.debug('Popup filter:',error.message));
},WEB_ONLY);
let queue=Promise.resolve();
function enqueue(task){const result=queue.then(task);queue=result.catch(error=>console.error('Ad Shield:',error));return result;}
function targetDisappeared(error,target){
  // Navigation/removal can happen during any awaited injection. Match only the
  // exact target's Chrome error; permission, resource and API errors still fail.
  const text=error?.message;
  return !!(target.documentIds?.some(id=>text===`No document with id ${id} in tab with id ${target.tabId}`) ||
    text===`No tab with id: ${target.tabId}` || text===`No tab with id: ${target.tabId}.` ||
    target.frameIds?.some(id=>text===`No frame with id ${id} in tab with id ${target.tabId}`) ||
    /^Frame with ID \d+ was removed\.$/.test(text));
}
async function injectionCancelled(error,target){
  if(targetDisappeared(error,target))return true;
  // Chrome can check the replacement URL's permissions before looking up the
  // old document (e.g. navigation to about:blank). Do not hide a real permission
  // failure: independently confirm that this exact document has disappeared.
  if(error?.message!=='Cannot access contents of the page. Extension manifest must request permission to access the respective host.' || !target.documentIds)return false;
  const frame=await chrome.webNavigation.getFrame({tabId:target.tabId,documentId:target.documentIds[0]});
  return !frame;
}
async function documentIsCurrent(sender){
  const frame=await chrome.webNavigation.getFrame({tabId:sender.tab.id,frameId:sender.frameId});
  return !!frame && frame.documentId===sender.documentId;
}
async function updateDocumentCSS(method,source,sender,target,verified){
  // `verified`: an earlier step of the same request just confirmed this document.
  if(!verified && !await documentIsCurrent(sender))return false;
  await chrome.scripting[method]({target,...source,origin:'USER'});
  if(await documentIsCurrent(sender))return true;
  // CSS injection can complete against the new frame during navigation even
  // with documentIds. The per-tab policy chain ensures the replacement's own
  // CSS has not yet been applied. Remove this obsolete sheet before proceeding.
  if(method==='insertCSS'){
    try{await chrome.scripting.removeCSS({target:{tabId:sender.tab.id,frameIds:[sender.frameId]},...source,origin:'USER'});}
    catch(error){if(!await injectionCancelled(error,{...target,frameIds:[sender.frameId]}))throw error;}
  }
  return false;
}
// Tabs opened before the extension was installed or re-enabled have no popup observer yet.
async function preparePopupObservers(settings){
  if(!settings.enabled || !A.usesStrict(settings))return;
  const tabs=await chrome.tabs.query({url:['http://*/*','https://*/*']});
  for(const tab of tabs){
    if(A.isListed(A.hostname(tab.url),settings.whitelist))continue;
    let frames;try{frames=await chrome.webNavigation.getAllFrames({tabId:tab.id});}catch(error){if(targetDisappeared(error,{tabId:tab.id}))continue;throw error;}
    for(const frame of frames || []){
      if(!A.hostname(frame.url) || !frame.documentId)continue;
      // Chrome deliberately disallows extensions on its Web Store.
      const url=new URL(frame.url);
      if(url.hostname==='chromewebstore.google.com' || (url.hostname==='chrome.google.com' && url.pathname.startsWith('/webstore')))continue;
      const target={tabId:tab.id,documentIds:[frame.documentId]};
      try{await chrome.scripting.executeScript({target,world:'ISOLATED',injectImmediately:true,files:['popup-intent.js']});}
      catch(error){if(!await injectionCancelled(error,target))console.error('Popup observer:',error);}
    }
  }
}
async function migrateNavigation(){
  const stored=await chrome.storage.local.get(['settings','navigationCompatibilityVersion']);
  if(stored.navigationCompatibilityVersion===2)return;
  const previous=A.clean(stored.settings);
  const next=A.clean({...previous,popupMode:'balanced',siteModes:previous.siteModes.map(x=>x.mode==='strict'?{...x,mode:'balanced'}:x),enhancedTracking:false,directBlocking:false,strictThirdParty:false,webFilters:{...previous.webFilters,annoyances:false}});
  // One-time compatibility migration. Keep an exact local backup; preserve
  // whitelist, manual rules and enabled state. Later explicit choices persist.
  await chrome.storage.local.set({settings:next,navigationCompatibilityVersion:2,...(stored.settings?{navigationSettingsBackup:stored.settings}:{})});
}
// The browser keeps rules and registered scripts across service worker restarts, so waking up
// (for every page load after idle, and for the stats alarm) only has to redo them when something
// changed. The session marker is cleared with the browser, which re-applies once per session.
function appliedKey(state){return JSON.stringify([chrome.runtime.getManifest().version,state.settings,state.listCache?.sourceVersion || '',state.listCache?.domains?.length || 0]);}
async function initialize(force){
  await I18N.ready;await migrateNavigation();const state=await readState();
  logging=state.settings.logging;
  if(logging){const stored=await chrome.storage.session.get('diagnosticLogs');logs=(stored.diagnosticLogs || []).slice(-200);}
  const {appliedSettings}=await chrome.storage.session.get('appliedSettings');const key=appliedKey(state);
  if(!force && appliedSettings===key)return;
  try{await applySettings(state.settings,state.listCache);initializationError=null;await chrome.storage.session.set({appliedSettings:key});}
  catch(error){initializationError=error.message;console.error('Initialization:',error);}
}
enqueue(()=>initialize());
chrome.runtime.onInstalled.addListener(details=>{enqueue(async()=>{await chrome.storage.local.remove('fastCosmetic');await initialize(true);await preparePopupObservers((await readState()).settings);});setupMenus();if(details.reason==='install')chrome.tabs.create({url:chrome.runtime.getURL('welcome.html')});});
async function info(state){
  enhancedMeta ||= await fetch(chrome.runtime.getURL('data/enhanced-meta.json')).then(r=>r.json());
  seedMeta ||= await fetch(chrome.runtime.getURL('data/seed-meta.json')).then(r=>r.json());
  webMeta ||= await fetch(chrome.runtime.getURL('data/web-meta.json')).then(r=>r.json());
  advancedMeta ||= await fetch(chrome.runtime.getURL('data/advanced-meta.json')).then(r=>r.json());
  const enabled=await chrome.declarativeNetRequest.getEnabledRulesets();
  return {initializationError,enhanced:{...enhancedMeta,enabled:enabled.includes('enhanced')},advanced:advancedMeta,webLists:webMeta.map(x=>({...x,enabled:enabled.includes(x.id)})),domainCount:state.listCache?.domains.length || seedMeta.domainCount,sourceVersion:state.listCache?.sourceVersion || seedMeta.sourceVersion,source:A.LIST_URL,...state.updateMeta};
}
// Open pages re-read their policy when the settings change. They are told directly: a storage
// listener in every frame would also be handed every statistics and learned-host write.
async function notifyPages(){
  for(const tab of await chrome.tabs.query({}))if(/^https?:/.test(tab.url || ''))chrome.tabs.sendMessage(tab.id,{type:'POLICY_CHANGED'}).catch(()=>{});
}
async function save(next,state){
  next=A.clean(next);
  if(JSON.stringify(next.webFilters)!==JSON.stringify(state.settings.webFilters)){const hot=await readHot();hot.genericOff={};await chrome.storage.local.set({hot});}
  try{await applySettings(next,state.listCache);await chrome.storage.local.set({settings:next});notifyPages().catch(()=>{});initializationError=null;await chrome.storage.session.set({appliedSettings:appliedKey({...state,settings:next})});if(next.enabled && !state.settings.enabled)await preparePopupObservers(next);}
  catch(error){settingsCache=undefined;try{await applySettings(state.settings,state.listCache);}catch(rollback){console.error('Rollback failed',rollback);}throw error;}
  return next;
}
async function updateList(state){
  try{
    const response=await fetch(A.LIST_URL,{credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error(I18N.t('bg_list_server',response.status));
    const reader=response.body.getReader();const decoder=new TextDecoder();let text='',bytes=0;
    while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>6000000){await reader.cancel();throw new Error(I18N.t('bg_list_too_big'));}text+=decoder.decode(value,{stream:true});}
    text+=decoder.decode();
    const parsed=A.parseList(text);
    if(state.listCache && parsed.sourceCount<state.listCache.sourceCount*0.5)throw new Error(I18N.t('bg_list_shrunk'));
    const next={...parsed,downloadedAt:new Date().toISOString()};
    try{
      await applySettings(state.settings,next);
      await chrome.storage.local.set({listCache:next,updateMeta:{lastSuccess:next.downloadedAt,lastError:null}});
    }catch(error){try{await applySettings(state.settings,state.listCache);}catch(rollback){console.error('Update rollback failed',rollback);}throw error;}
    return {settings:state.settings,info:await info({...state,listCache:next,updateMeta:{lastSuccess:next.downloadedAt,lastError:null}})};
  }catch(error){await chrome.storage.local.set({updateMeta:{...state.updateMeta,lastAttempt:new Date().toISOString(),lastError:error.message}});throw error;}
}
// Policy requests never touch the settings queue except to wait out a change in progress.
// They run in order per tab, so a replaced document's CSS cannot overlap its successor's.
const pageChains=new Map();
function pagePolicy(message,sender){
  const tabId=sender.tab.id;const task=(pageChains.get(tabId) || Promise.resolve()).then(()=>queue).then(()=>resolvePolicy(message,sender));
  const tail=task.catch(error=>console.error('Ad Shield:',error));pageChains.set(tabId,tail);tail.then(()=>{if(pageChains.get(tabId)===tail)pageChains.delete(tabId);});
  return task;
}
async function resolvePolicy(message,sender){
  const settings=await readSettings();
  const topHost=A.hostname(sender.frameId===0?sender.url:sender.tab.url);const host=A.hostname(sender.url) || A.hostname(sender.origin) || topHost;
  const compatible=A.isListed(topHost,settings.compatSites) || A.isListed(host,settings.compatSites);
  const active=settings.enabled && !A.isListed(topHost,settings.whitelist) && !A.isListed(host,settings.whitelist);
  const custom=active ? [...settings.cosmeticRules.filter(x=>A.isListed(host,[x.host])).map(x=>x.selector),...UserFilters.selectorsFor(host,userFilters(settings))] : [];
  const shadowRules=custom.map(A.selectorChain).filter(x=>x.length>1);const ordinaryCustom=custom.filter(x=>A.selectorChain(x).length===1);let selectors=[],componentSelectors=[];let extended=ordinaryCustom.filter(isExtended);
  // Top documents get the global selectors from the registered stylesheet; subframes ask for them here.
  let frameCss=[],lists;
  if(active && settings.hideAds && !compatible){
    lists=await listCosmetics(host,settings);
    selectors=[...lists.selectors];componentSelectors=[...lists.component];
    if(settings.procedural)extended=[...lists.extended,...extended];
    if(sender.frameId>0 && !lists.genericOff)frameCss=A.genericFiles(settings);
  }
  // Every frame of a site gets the same text; build it once per cached host.
  const automaticCss=lists?(lists.shadowCss ??= componentSelectors.map(selector=>`${selector} { display: none !important; }`).join('\n')):'';
  const plainCustom=ordinaryCustom.filter(x=>!isExtended(x));
  // Restyling rules from the lists (selector:style(...)) follow the hiding rules.
  const restyle=lists?lists.styles.map(([selector,style])=>`${A.scopedSelector(selector)} { ${style} }`):[];
  const hideAll=list=>[...[...new Set(list)].map(selector=>`${A.scopedSelector(selector)} { display: none !important; }`),...restyle].join('\n');
  const documentCss=lists && !plainCustom.length?(lists.documentCss ??= hideAll(selectors)):hideAll([...selectors,...plainCustom]);
  const css=!documentCss ? '' : A.IS_FIREFOX ? documentCss : `@scope (:root) {\n${documentCss}\n}`;
  const shadowCss=active && settings.hideAds && settings.shadowAds && !compatible ? automaticCss : '';
  const target=sender.documentId ? {tabId:sender.tab.id,documentIds:[sender.documentId]} : {tabId:sender.tab.id,frameIds:[sender.frameId]};
  // Keep the document ID for every step; never retry on a replacement frame.
  try{
    let verified=false;
    const change=async(method,source)=>{if(!await updateDocumentCSS(method,source,sender,target,verified))return false;verified=true;return true;};
    if(message.previousCss && !await change('removeCSS',{css:message.previousCss}))return {stale:true};
    const previousFiles=message.frameCss || [];const sameFiles=previousFiles.join()===frameCss.join();
    if(previousFiles.length && !sameFiles && !await change('removeCSS',{files:previousFiles}))return {stale:true};
    if(frameCss.length && !sameFiles && !await change('insertCSS',{files:frameCss}))return {stale:true};
    if(css && !await change('insertCSS',{css}))return {stale:true};
    let extendedLoaded=!!message.extendedLoaded;
    if(extended.length && !extendedLoaded){await chrome.scripting.executeScript({target,world:'ISOLATED',files:['vendor/extended-css.js']});extendedLoaded=true;}
    let guardInstalled=!!message.guardInstalled;
    const mode=A.modeFor(topHost,settings);
    if(sender.frameId>0 && active && mode==='strict' && !guardInstalled){await chrome.scripting.executeScript({target,world:'MAIN',files:['guard-strict.js']});guardInstalled=true;}
    return {policy:{active,css,frameCss,shadowCss,shadowRules,guardInstalled,extendedLoaded,extended:[...new Set(extended)]}};
  }catch(error){if(await injectionCancelled(error,target))return {stale:true};throw error;}
}
chrome.alarms.onAlarm.addListener(alarm=>{if(alarm.name==='stats-sync')statsTask(()=>syncStats(0));if(alarm.name==='update-list')enqueue(async()=>{const state=await readState();if(state.settings.autoUpdate)await updateList(state);});});
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(sender.id!==chrome.runtime.id)return false;
  const extensionPage=sender.url?.startsWith(chrome.runtime.getURL(''));
  if(!extensionPage && sender.tab && A.hostname(sender.tab.url) && ['POPUP_INTENT','POPUP_RECORDER_READY'].includes(message?.type)){if(message.type==='POPUP_INTENT')popupRescue.record(message,sender);else popupRescue.markReady(sender);respond({ok:true});return false;}
  const pageRequest=['PAGE_POLICY','ADD_SELECTOR','PICKER_STRINGS','LOAD_PICKER'].includes(message?.type) && !!sender.tab && !!A.hostname(sender.frameId===0?sender.url:sender.tab.url) && (!['ADD_SELECTOR','LOAD_PICKER'].includes(message.type) || sender.frameId===0);
  if(!extensionPage && !pageRequest)return false;
  const uiTypes=['TAB_STATS','GET_STATS','RESET_STATS','GET_SETTINGS','SET_SETTINGS','UPDATE_LIST','RESET_LIST','GET_LOGS','CLEAR_LOGS'];
  if(!pageRequest && !uiTypes.includes(message?.type))return false;
  if(message.type==='PAGE_POLICY'){pagePolicy(message,sender).then(result=>respond({ok:true,...result}),error=>respond({ok:false,error:error.message}));return true;}
  enqueue(async()=>{
    const state=await readState();
    if(message.type==='LOAD_PICKER'){await chrome.scripting.executeScript({target:{tabId:sender.tab.id,frameIds:[0]},world:'ISOLATED',files:['common.js','picker.js']});return {};}
    if(message.type==='PICKER_STRINGS'){const keys=['picker_title','picker_hint','picker_selected','picker_selected_many','picker_repick','picker_widen','picker_widen_title','picker_cancel','picker_confirm','picker_save_failed','picker_not_unique','picker_too_deep','picker_too_broad','bg_site_paused'];return {strings:Object.fromEntries(keys.map(key=>[key,I18N.t(key)]))};}
    if(message.type==='ADD_SELECTOR'){
      if(!state.settings.enabled || A.isListed(A.hostname(sender.url),state.settings.whitelist))throw new Error(I18N.t('bg_site_paused'));
      if(!A.safeSelector(message.selector))throw new Error(I18N.t('bg_rule_invalid'));
      if(state.settings.cosmeticRules.length>=300)throw new Error(I18N.t('bg_rules_max'));
      const next=await save({...state.settings,cosmeticRules:[...state.settings.cosmeticRules,{host:A.hostname(sender.url),selector:message.selector}]},state);
      return {settings:next};
    }
    if(message.type==='TAB_STATS'){if(!Number.isInteger(message.tabId) || message.tabId<0)throw new Error(I18N.t('bg_invalid_tab'));return {stats:await tabStats(message.tabId)};}
    if(message.type==='GET_STATS')return {stats:(await statsTask(()=>syncStats(3000))).stats};
    if(message.type==='RESET_STATS'){const stats={total:0,since:new Date().toISOString(),days:{},sites:{}};await chrome.storage.local.set({stats});return {stats};}
    if(message.type==='GET_LOGS')return {logs:logs.filter(x=>!Number.isInteger(message.tabId) || x.tabId===message.tabId),logging:state.settings.logging};
    if(message.type==='CLEAR_LOGS'){logs=[];clearTimeout(flushTimer);await chrome.storage.session.remove('diagnosticLogs');return {logs:[]};}
    if(message.type==='GET_SETTINGS'){return {settings:state.settings,info:await info(state)};}
    if(message.type==='SET_SETTINGS'){const settings=await save(message.settings,state);return {settings,info:await info(state)};}
    if(message.type==='UPDATE_LIST')return await updateList(state);
    if(message.type==='RESET_LIST'){
      try{await applySettings(state.settings,null);await chrome.storage.local.remove(['listCache','updateMeta']);}
      catch(error){await applySettings(state.settings,state.listCache);throw error;}
      return {settings:state.settings,info:await info({...state,listCache:null,updateMeta:{}})};
    }
  }).then(result=>respond({ok:true,...result}),error=>respond({ok:false,error:error.message}));
  return true;
});

chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(async event=>{
  if(!logging || event.request.tabId<0)return;
  const {ruleId,rulesetId}=event.rule;
  const action=await ruleAction({ruleId,rulesetId});
  if(!logging)return;
  let url;try{const parsed=new URL(event.request.url);parsed.search='';parsed.hash='';parsed.username='';parsed.password='';url=parsed.href;}catch{return;}
  logs.push({time:new Date().toISOString(),tabId:event.request.tabId,type:event.request.type,action,ruleId,rulesetId,url});logs=logs.slice(-200);
  clearTimeout(flushTimer);flushTimer=setTimeout(()=>{chrome.storage.session.set({diagnosticLogs:logs}).catch(()=>{});},250);
});

// Right-click menu and keyboard shortcuts.
async function setupMenus(){
  await I18N.ready;
  chrome.contextMenus.removeAll(()=>{
    const documentUrlPatterns=['http://*/*','https://*/*'];
    chrome.contextMenus.create({id:'hide-element',title:I18N.t('menu_hide_element'),contexts:['page','image','link','video','audio','frame','selection'],documentUrlPatterns});
    chrome.contextMenus.create({id:'toggle-site',title:I18N.t('menu_toggle_site'),contexts:['page','frame','selection','link','image'],documentUrlPatterns});
  });
}
async function startPicker(tab,fromContext){
  const send=()=>chrome.tabs.sendMessage(tab.id,{type:'START_PICKER',fromContext},{frameId:0});
  let response;
  // Pages opened before the extension was installed or updated have no content script yet.
  try{response=await send();}catch{await chrome.scripting.executeScript({target:{tabId:tab.id,frameIds:[0]},world:'ISOLATED',files:A.pageFiles((await readState()).settings)});response=await send();}
  if(!response?.ok)throw new Error(response?.error || I18N.t('bg_picker_failed'));
}
async function toggleSite(tab){
  const host=A.hostname(tab?.url);if(!host)return;
  await enqueue(async()=>{
    const state=await readState();const listed=A.isListed(host,state.settings.whitelist);
    if(!listed && state.settings.whitelist.length>=200)throw new Error(I18N.t('popup_whitelist_full'));
    await save({...state.settings,whitelist:listed?state.settings.whitelist.filter(x=>!A.isListed(host,[x])):[...state.settings.whitelist,host]},state);
  });
  await chrome.tabs.reload(tab.id);
}
chrome.contextMenus.onClicked.addListener((info,tab)=>{
  if(!tab?.id)return;
  if(info.menuItemId==='hide-element')startPicker(tab,info.frameId===0 || info.frameId===undefined).catch(error=>console.debug('Picker:',error.message));
  if(info.menuItemId==='toggle-site')toggleSite(tab).catch(error=>console.error('Toggle site:',error));
});
chrome.commands.onCommand.addListener((command,tab)=>{
  if(!tab?.id || !A.hostname(tab.url))return;
  if(command==='start-picker')startPicker(tab,false).catch(error=>console.debug('Picker:',error.message));
  if(command==='toggle-site')toggleSite(tab).catch(error=>console.error('Toggle site:',error));
});
chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;if(changes.uiLanguage)I18N.reload().then(setupMenus);if(changes.settings){settingsCache=undefined;cosmeticCache.clear();}if(changes.hot)hotCache=undefined;});
