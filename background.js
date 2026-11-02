// Chrome loads the shared scripts here; Firefox lists them in manifest background.scripts.
if(typeof importScripts==='function')importScripts('vendor/publicsuffix.js','i18n.js','common.js','user-filters.js','web-filtering.js','static-rule-policy.js','popup-rescue.js');
const A=AdShield;
let cancellationData;let initializationError;let enhancedMeta,localCoverage;let seedMeta,webMeta,cosmeticData,extendedData,advancedMeta,scriptletHosts,baseSelectors;let logging=false;let logs=[];let flushTimer;let actionMap;
const isExtended=x=>/:(?:has-text|contains|matches-css(?:-before|-after)?|matches-attr|matches-property|xpath|upward|nth-ancestor|if-not|empty-trimmed)\(/i.test(x);
const WEB_IDS=['easylist','easyprivacy','chinese','annoyances','fixes'];
// Firefox packages split large files: AMO does not parse text files over 5 MB.
const ENHANCED_IDS=chrome.runtime.getManifest().declarative_net_request.rule_resources.map(x=>x.id).filter(id=>id==='enhanced' || id.startsWith('enhanced_'));
async function loadCosmeticData(){
  const json=path=>fetch(chrome.runtime.getURL(path)).then(r=>r.json());
  if(!A.IS_FIREFOX)return json('data/web-cosmetics.json');
  return Object.fromEntries(await Promise.all(WEB_IDS.map(async id=>[id,await json(`data/web-cosmetics/${id}.json`)])));
}
const DIRECT_IDS=['direct_easylist','direct_easyprivacy','direct_chinese','direct_fixes'];
async function readState(){const state=await chrome.storage.local.get(['settings','listCache','updateMeta']);return {...state,settings:A.clean(state.settings)};}
async function ensureAlarm(settings){
  if(settings.autoUpdate){if(!await chrome.alarms.get('update-list'))await chrome.alarms.create('update-list',{periodInMinutes:1440});}
  else await chrome.alarms.clear('update-list');
  if(!await chrome.alarms.get('stats-sync'))await chrome.alarms.create('stats-sync',{periodInMinutes:4});
}
// Every frame of a page asks for the same host's list selectors; computing them walks
// every list entry. Keep recent hosts until the settings change (applySettings clears it).
const cosmeticCache=new Map();
async function listCosmetics(host,settings){
  if(cosmeticCache.has(host)){const hit=cosmeticCache.get(host);cosmeticCache.delete(host);cosmeticCache.set(host,hit);return hit;}
  cosmeticData ||= await loadCosmeticData();
  extendedData ||= await fetch(chrome.runtime.getURL('data/extended-cosmetics.json')).then(r=>r.json());
  baseSelectors ||= await fetch(chrome.runtime.getURL('data/builtin-cosmetics.json')).then(r=>r.json());
  const selection=WebFiltering.policy(host,cosmeticData,settings.webFilters,extendedData);
  const selectors=WebFiltering.cosmeticSelectors(host,cosmeticData,settings.webFilters,selection);
  selectors.push(...baseSelectors.filter(selector=>WebFiltering.permits({selector,include:[]},selection)));
  if(settings.webFilters.easylist){
    localCoverage ||= await fetch(chrome.runtime.getURL('data/local-coverage.json')).then(r=>r.json());
    for(const group of localCoverage.cosmetic)if(!group.hosts.length || A.isListed(host,group.hosts))selectors.push(...group.selectors.filter(selector=>WebFiltering.permits({selector,include:group.hosts},selection)));
  }
  // Shadow roots get only rules written for this site plus the curated built-ins. The
  // generic lists target page markup; inside self-contained components they mostly hit
  // unrelated widgets (uBO does not apply them there either).
  const component=WebFiltering.cosmeticSelectors(host,cosmeticData,settings.webFilters,selection,true);
  component.push(...baseSelectors.filter(selector=>WebFiltering.permits({selector,include:[]},selection)));
  const result={selectors:Object.freeze(selectors),component:Object.freeze([...new Set(component)]),extended:Object.freeze(WebFiltering.extendedSelectors(host,extendedData,settings.webFilters,selection))};
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
  actionMap ||= fetch(chrome.runtime.getURL('data/web-actions.json')).then(r=>r.json());
  return (await actionMap)[rulesetId]?.[ruleId] || 'unknown';
}
// Blocked-request statistics. Chrome allows getMatchedRules 20 times per 10 minutes, so every
// caller shares one incremental all-tabs query: matches newer than the last sync are added to
// the tab's count (reset when the tab commits a new page) and to the lifetime totals. A periodic
// alarm keeps syncing within the 5 minutes Chrome retains matches of closed pages.
const STATS_CALLS=18,STATS_WINDOW=600000,STATS_RESERVED=4;
let statsChain=Promise.resolve();
function statsTask(task){const result=statsChain.then(task);statsChain=result.catch(error=>console.error('Stats:',error));return result;}
const dayKey=time=>new Date(time).toLocaleDateString('sv');
async function statsState(){
  const [{statsSession},{stats}]=await Promise.all([chrome.storage.session.get('statsSession'),chrome.storage.local.get('stats')]);
  return {session:statsSession || {last:0,calls:[],tabs:{}},stats:stats || {total:0,since:new Date().toISOString(),days:{},sites:{}}};
}
async function syncStats(minGap){
  const {session,stats}=await statsState();const now=Date.now();
  session.calls=session.calls.filter(time=>now-time<STATS_WINDOW);
  // UI refreshes leave a reserve for the alarm so closed pages are still counted.
  if(now-(session.calls.at(-1) || 0)<minGap || session.calls.length>=(minGap?STATS_CALLS-STATS_RESERVED:STATS_CALLS))return {session,stats};
  if(!chrome.declarativeNetRequest.getMatchedRules)return {session,stats};
  session.calls.push(now);
  const {rulesMatchedInfo}=await chrome.declarativeNetRequest.getMatchedRules({minTimeStamp:session.last+1});
  for(const match of rulesMatchedInfo){
    session.last=Math.max(session.last,match.timeStamp);
    const action=await ruleAction(match.rule);if(action!=='block' && action!=='redirect')continue;
    stats.total++;const day=dayKey(match.timeStamp);stats.days[day]=(stats.days[day] || 0)+1;
    const tab=session.tabs[match.tabId];
    if(tab && match.timeStamp>=tab.since){tab.count++;if(tab.host)stats.sites[tab.host]=(stats.sites[tab.host] || 0)+1;}
  }
  for(const [id,tab] of Object.entries(session.tabs))if(tab.removed)delete session.tabs[id];
  const days=Object.keys(stats.days).sort();for(const day of days.slice(0,-90))delete stats.days[day];
  const sites=Object.entries(stats.sites);if(sites.length>300)stats.sites=Object.fromEntries(sites.sort((a,b)=>b[1]-a[1]).slice(0,200));
  await Promise.all([chrome.storage.session.set({statsSession:session}),chrome.storage.local.set({stats})]);
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
  statsTask(async()=>{const {session}=await statsState();session.tabs[event.tabId]={host:A.hostname(event.url),since:Math.floor(event.timeStamp),count:0};await chrome.storage.session.set({statsSession:session});});
});
chrome.tabs.onRemoved.addListener(tabId=>statsTask(async()=>{const {session}=await statsState();if(session.tabs[tabId]){session.tabs[tabId].removed=true;await chrome.storage.session.set({statsSession:session});}}));
// Generic hiding CSS that content.js applies from storage at document start, before the
// service worker answers PAGE_POLICY. Selectors with any exception and every host that turns
// generic hiding off (or is whitelisted / compatible) stay on the exact per-page path.
async function prepareFastCosmetics(settings){
  if(!settings.enabled || !settings.hideAds){await chrome.storage.local.remove('fastCosmetic');return;}
  cosmeticData ||= await loadCosmeticData();
  baseSelectors ||= await fetch(chrome.runtime.getURL('data/builtin-cosmetics.json')).then(r=>r.json());
  localCoverage ||= await fetch(chrome.runtime.getURL('data/local-coverage.json')).then(r=>r.json());
  const lists=Object.entries(cosmeticData).filter(([id])=>settings.webFilters[id]).map(([,data])=>data);
  const excepted=new Set(),cancelled=new Set(),hosts=new Set([...settings.whitelist,...settings.compatSites]),entities=new Set();
  for(const data of lists){for(const entry of data.entries)if(entry.exception)excepted.add(entry.selector);for(const off of data.genericOff || [])if(off.badfilter)cancelled.add(off.key);}
  for(const data of lists)for(const off of data.genericOff || []){
    if(off.badfilter || cancelled.has(off.key) || off.generic===false)continue;
    const scope=off.host?[off.host]:off.include || [];
    if(!scope.length){await chrome.storage.local.remove('fastCosmetic');return;}
    for(const host of scope)if(host.endsWith('.*'))entities.add(host.slice(0,-2));else hosts.add(host);
  }
  const selectors=new Set();
  for(const data of lists)for(const entry of data.entries)if(!entry.exception && !entry.include.length && !entry.exclude.length)selectors.add(entry.selector);
  baseSelectors.forEach(selector=>selectors.add(selector));
  if(settings.webFilters.easylist)for(const group of localCoverage.cosmetic)if(!group.hosts.length)group.selectors.forEach(selector=>selectors.add(selector));
  const css=[...selectors].filter(selector=>!excepted.has(selector)).map(selector=>`${selector}{display:none!important}`).join('\n');
  await chrome.storage.local.set({fastCosmetic:{css,hosts:[...hosts],entities:[...entities]}});
}
let parsedFilters={text:null};
function userFilters(settings){if(parsedFilters.text!==settings.userFilters)parsedFilters={text:settings.userFilters,result:UserFilters.parse(settings.userFilters)};return parsedFilters.result;}
async function applySettings(settings,listCache){
  cosmeticCache.clear();dynamicActions=undefined;
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
  const old=await chrome.scripting.getRegisteredContentScripts();const desired=A.scripts(settings);
  const fixes=desired.find(x=>x.id==='site-fixes');if(fixes){scriptletHosts ||= await fetch(chrome.runtime.getURL('data/scriptlet-hosts.json')).then(r=>r.json());if(!scriptletHosts.some(x=>x.endsWith('.*')))fixes.matches=scriptletHosts.flatMap(A.patterns);}
  const obsolete=old.filter(x=>!desired.some(next=>next.id===x.id));
  if(obsolete.length)await chrome.scripting.unregisterContentScripts({ids:obsolete.map(x=>x.id)});
  const existing=desired.filter(x=>old.some(previous=>previous.id===x.id));const missing=desired.filter(x=>!old.some(previous=>previous.id===x.id));
  if(existing.length)await chrome.scripting.updateContentScripts(existing);
  if(missing.length)await chrome.scripting.registerContentScripts(missing);
  await prepareFastCosmetics(settings);
  await preparePopupObservers(settings);
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
let queue=Promise.resolve();
function enqueue(task){const result=queue.then(task);queue=result.catch(error=>console.error('Ad Shield:',error));return result;}
function targetDisappeared(error,target){
  // Navigation/removal can happen during any awaited injection. Match only the
  // exact target's Chrome error; permission, resource and API errors still fail.
  const text=error?.message;
  return !!(target.documentIds?.some(id=>text===`No document with id ${id} in tab with id ${target.tabId}`) ||
    text===`No tab with id: ${target.tabId}` || text===`No tab with id: ${target.tabId}.` ||
    target.frameIds?.some(id=>text===`No frame with id ${id} in tab with id ${target.tabId}`));
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
async function updateDocumentCSS(method,css,sender,target){
  if(!await documentIsCurrent(sender))return false;
  await chrome.scripting[method]({target,css,origin:'USER'});
  if(await documentIsCurrent(sender))return true;
  // CSS injection can complete against the new frame during navigation even
  // with documentIds. The serial policy queue ensures the replacement's own
  // CSS has not yet been applied. Remove this obsolete sheet before proceeding.
  if(method==='insertCSS'){
    try{await chrome.scripting.removeCSS({target:{tabId:sender.tab.id,frameIds:[sender.frameId]},css,origin:'USER'});}
    catch(error){if(!await injectionCancelled(error,{...target,frameIds:[sender.frameId]}))throw error;}
  }
  return false;
}
let popupObserversPrepared=false;
async function preparePopupObservers(settings){
  if(!settings.enabled){popupObserversPrepared=false;return;}
  if(popupObserversPrepared)return;
  popupObserversPrepared=true;
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
async function initialize(){await I18N.ready;await migrateNavigation();const state=await readState();const stored=await chrome.storage.session.get('diagnosticLogs');logs=state.settings.logging ? (stored.diagnosticLogs || []).slice(-200) : [];try{await applySettings(state.settings,state.listCache);initializationError=null;}catch(error){initializationError=error.message;console.error('Initialization:',error);}}
enqueue(initialize);
chrome.runtime.onInstalled.addListener(details=>{enqueue(initialize);setupMenus();if(details.reason==='install')chrome.tabs.create({url:chrome.runtime.getURL('welcome.html')});});
chrome.runtime.onStartup.addListener(()=>enqueue(initialize));
async function info(state){
  enhancedMeta ||= await fetch(chrome.runtime.getURL('data/enhanced-meta.json')).then(r=>r.json());
  seedMeta ||= await fetch(chrome.runtime.getURL('data/seed-meta.json')).then(r=>r.json());
  webMeta ||= await fetch(chrome.runtime.getURL('data/web-meta.json')).then(r=>r.json());
  advancedMeta ||= await fetch(chrome.runtime.getURL('data/advanced-meta.json')).then(r=>r.json());
  const enabled=await chrome.declarativeNetRequest.getEnabledRulesets();
  return {initializationError,enhanced:{...enhancedMeta,enabled:enabled.includes('enhanced')},advanced:advancedMeta,webLists:webMeta.map(x=>({...x,enabled:enabled.includes(x.id)})),domainCount:state.listCache?.domains.length || seedMeta.domainCount,sourceVersion:state.listCache?.sourceVersion || seedMeta.sourceVersion,source:A.LIST_URL,...state.updateMeta};
}
async function save(next,state){
  next=A.clean(next);
  try{await applySettings(next,state.listCache);await chrome.storage.local.set({settings:next});initializationError=null;}
  catch(error){try{await applySettings(state.settings,state.listCache);}catch(rollback){console.error('Rollback failed',rollback);}throw error;}
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
chrome.alarms.onAlarm.addListener(alarm=>{if(alarm.name==='stats-sync')statsTask(()=>syncStats(0));if(alarm.name==='update-list')enqueue(async()=>{const state=await readState();if(state.settings.autoUpdate)await updateList(state);});});
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(sender.id!==chrome.runtime.id)return false;
  const extensionPage=sender.url?.startsWith(chrome.runtime.getURL(''));
  if(!extensionPage && sender.tab && A.hostname(sender.tab.url) && ['POPUP_INTENT','POPUP_RECORDER_READY'].includes(message?.type)){if(message.type==='POPUP_INTENT')popupRescue.record(message,sender);else popupRescue.markReady(sender);respond({ok:true});return false;}
  const pageRequest=['PAGE_POLICY','ADD_SELECTOR','PICKER_STRINGS'].includes(message?.type) && !!sender.tab && !!A.hostname(sender.frameId===0?sender.url:sender.tab.url) && (message.type!=='ADD_SELECTOR' || sender.frameId===0);
  if(!extensionPage && !pageRequest)return false;
  const uiTypes=['TAB_STATS','GET_STATS','RESET_STATS','GET_SETTINGS','SET_SETTINGS','UPDATE_LIST','RESET_LIST','GET_LOGS','CLEAR_LOGS'];
  if(!pageRequest && !uiTypes.includes(message?.type))return false;
  enqueue(async()=>{
    const state=await readState();
    if(message.type==='PAGE_POLICY'){
      const topHost=A.hostname(sender.frameId===0?sender.url:sender.tab.url);const host=A.hostname(sender.url) || A.hostname(sender.origin) || topHost;
      const compatible=A.isListed(topHost,state.settings.compatSites) || A.isListed(host,state.settings.compatSites);
      const active=state.settings.enabled && !A.isListed(topHost,state.settings.whitelist) && !A.isListed(host,state.settings.whitelist);
      const custom=active ? [...state.settings.cosmeticRules.filter(x=>A.isListed(host,[x.host])).map(x=>x.selector),...UserFilters.selectorsFor(host,userFilters(state.settings))] : [];
      const shadowRules=custom.map(A.selectorChain).filter(x=>x.length>1);const ordinaryCustom=custom.filter(x=>A.selectorChain(x).length===1);let selectors=[],componentSelectors=[];let extended=ordinaryCustom.filter(isExtended);
      if(active && state.settings.hideAds && !compatible){
        const lists=await listCosmetics(host,state.settings);
        selectors=[...lists.selectors];componentSelectors=[...lists.component];
        if(state.settings.procedural)extended=[...lists.extended,...extended];
      }
      const automaticCss=componentSelectors.map(selector=>`${selector} { display: none !important; }`).join('\n');
      const documentCss=[...new Set([...selectors,...ordinaryCustom.filter(x=>!isExtended(x))])].map(selector=>`${A.scopedSelector(selector)} { display: none !important; }`).join('\n');
      const css=!documentCss ? '' : A.IS_FIREFOX ? documentCss : `@scope (:root) {\n${documentCss}\n}`;
      const shadowCss=active && state.settings.hideAds && state.settings.shadowAds && !compatible ? automaticCss : '';
      const target=sender.documentId ? {tabId:sender.tab.id,documentIds:[sender.documentId]} : {tabId:sender.tab.id,frameIds:[sender.frameId]};
      // Keep the document ID for every step; never retry on a replacement frame.
      try{
      if(message.previousCss && !await updateDocumentCSS('removeCSS',message.previousCss,sender,target))return {stale:true};
      if(css && !await updateDocumentCSS('insertCSS',css,sender,target))return {stale:true};
      let extendedLoaded=!!message.extendedLoaded;
      if(extended.length && !extendedLoaded){await chrome.scripting.executeScript({target,world:'ISOLATED',files:['vendor/extended-css.js']});extendedLoaded=true;}
      let advancedInstalled=!!message.advancedInstalled;
      if(sender.frameId>0 && active && !compatible && state.settings.scriptlets && state.settings.webFilters.fixes && !advancedInstalled){await chrome.scripting.executeScript({target,world:'MAIN',files:['vendor/publicsuffix.js','advanced-main.js']});advancedInstalled=true;}
      let guardInstalled=!!message.guardInstalled;
      const mode=A.modeFor(topHost,state.settings);
      if(sender.frameId>0 && active && mode==='strict' && !guardInstalled){await chrome.scripting.executeScript({target,world:'MAIN',files:[mode==='strict'?'guard-strict.js':'guard-standard.js']});guardInstalled=true;}
      return {policy:{active,css,shadowCss,shadowRules,guardInstalled,advancedInstalled,extendedLoaded,extended:[...new Set(extended)]}};
      }catch(error){if(await injectionCancelled(error,target))return {stale:true};throw error;}
    }
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
  try{response=await send();}catch{await chrome.scripting.executeScript({target:{tabId:tab.id,frameIds:[0]},world:'ISOLATED',files:['common.js','popup-intent.js','shadow-filtering.js','content.js']});response=await send();}
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
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local' && changes.uiLanguage)I18N.reload().then(setupMenus);});
