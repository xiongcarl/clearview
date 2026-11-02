const $=id=>document.getElementById(id);const t=I18N.t;
let settings,info,activeTab,host;let busy=false;
async function request(type,value){const response=await chrome.runtime.sendMessage({type,settings:value});if(!response?.ok)throw new Error(response?.error || t('common_no_response'));return response;}
function message(text,error=false){$('message').textContent=text;$('message').className=error?'error':'';}
// Live count of requests blocked or replaced on the active tab (Chrome resets it per navigation).
async function refreshStats(){
  if(!activeTab)return;
  try{const response=await chrome.runtime.sendMessage({type:'TAB_STATS',tabId:activeTab.id});if(response?.ok){const {blocked,replaced,total,today}=response.stats;$('blocked').textContent=(blocked+replaced).toLocaleString();showLifetime(total,today);}}catch{}
}
// Lifetime totals, plus a one-time thank-you note at each milestone when a support page is set.
const MILESTONES=[1000,10000,50000,100000,500000,1000000];
async function showLifetime(total,today){
  if(!total)return;
  $('lifetime').hidden=false;$('todayCount').textContent=today.toLocaleString();$('totalCount').textContent=total.toLocaleString();
  if(!AdShield.SUPPORT_URL)return;
  const reached=MILESTONES.filter(x=>total>=x).at(-1);if(!reached)return;
  const {milestoneSeen=0}=await chrome.storage.local.get('milestoneSeen');if(milestoneSeen>=reached)return;
  $('milestoneText').textContent=t('popup_milestone',reached.toLocaleString());
  $('milestone').hidden=false;
  const seen=()=>{chrome.storage.local.set({milestoneSeen:reached});$('milestone').hidden=true;};
  $('milestoneClose').onclick=seen;$('milestoneSupport').onclick=seen;
}
function render(){
  const listed=settings && AdShield.isListed(host,settings.whitelist);
  $('state').textContent=t(!settings?'state_unreadable':!settings.enabled?'state_all_paused':!host?'state_na':listed?'state_site_paused':AdShield.isListed(host,settings.compatSites)?'state_compat':'state_active');
  document.body.dataset.protection=!settings?'unavailable':!host?'na':!settings.enabled || listed?'paused':AdShield.isListed(host,settings.compatSites)?'compatible':'active';
  $('enabled').checked=!!settings?.enabled;$('enabled').disabled=busy || !settings;
  $('mode').value=settings?.popupMode || 'balanced';$('mode').disabled=busy || !settings;
  $('host').textContent=host || '';$('site').querySelector('.row-label').textContent=t(listed?'popup_resume_site':'popup_pause_site');document.body.dataset.listed=String(!!listed);
  $('site').disabled=busy || !settings?.enabled || !host;
  $('siteMode').value=settings?.siteModes.find(x=>x.host===host)?.mode || 'inherit';$('siteMode').disabled=busy || !settings?.enabled || !host || listed;
  $('compatible').textContent=t(settings && AdShield.isListed(host,settings.compatSites)?'popup_compat_off':'popup_compat_on');$('compatible').disabled=busy || !settings?.enabled || !host || listed;
  $('picker').disabled=busy || !settings?.enabled || !host || listed;
  $('reload').disabled=busy || !activeTab || !/^https?:/.test(activeTab.url || '');$('update').disabled=busy || !settings;$('strong').disabled=busy || !settings;
  $('strictThirdParty').checked=!!settings?.strictThirdParty;$('strictThirdParty').disabled=busy || !settings;
  const enabledWeb=(info?.webLists || []).filter(x=>x.enabled);
  $('listInfo').textContent=info?t('popup_list_info',info.domainCount.toLocaleString(),enabledWeb.reduce((sum,x)=>sum+x.networkRules,0).toLocaleString(),info.lastSuccess?t('popup_updated_on',new Date(info.lastSuccess).toLocaleDateString()):t('popup_builtin_list')):t('popup_lists_loading');
}
async function save(next){if(busy)return;busy=true;render();try{({settings,info}=await request('SET_SETTINGS',next));message(t('popup_saved'));}catch(error){message(t('common_save_failed',error.message),true);}finally{busy=false;render();}}
$('strong').addEventListener('click',()=>save({...settings,enabled:true,hideAds:true,shadowAds:true,scriptlets:true,procedural:true,webFilters:{...settings.webFilters,easylist:true,easyprivacy:true,chinese:true,fixes:true}}));
$('compatible').addEventListener('click',()=>{if(!host || busy || !settings)return;const listed=AdShield.isListed(host,settings.compatSites);if(!listed && settings.compatSites.length>=200){message(t('popup_compat_full'),true);return;}save({...settings,compatSites:listed?settings.compatSites.filter(x=>!AdShield.isListed(host,[x])):[...settings.compatSites,host]});});
$('strictThirdParty').addEventListener('change',()=>save({...settings,strictThirdParty:$('strictThirdParty').checked}));
$('enabled').addEventListener('change',()=>save({...settings,enabled:$('enabled').checked}));
$('mode').addEventListener('change',()=>save({...settings,popupMode:$('mode').value}));
$('site').addEventListener('click',()=>{
  if(!host || busy || !settings)return;
  const listed=AdShield.isListed(host,settings.whitelist);
  if(!listed && settings.whitelist.length>=200){message(t('popup_whitelist_full'),true);return;}
  save({...settings,whitelist:listed?settings.whitelist.filter(x=>!AdShield.isListed(host,[x])):[...settings.whitelist,host]});
});
$('siteMode').addEventListener('change',()=>{
  const mode=$('siteMode').value;const existing=settings.siteModes.filter(x=>x.host!==host);
  if(mode!=='inherit' && existing.length>=50){message(t('popup_sitemodes_full'),true);render();return;}
  save({...settings,siteModes:mode==='inherit'?existing:[...existing,{host,mode}]});
});
$('picker').addEventListener('click',async()=>{try{const response=await chrome.tabs.sendMessage(activeTab.id,{type:'START_PICKER'},{frameId:0});if(!response?.ok)throw new Error(response?.error || t('popup_picker_failed'));window.close();}catch(error){message(t('popup_reload_first',error.message),true);}});
$('reload').addEventListener('click',async()=>{try{await chrome.tabs.reload(activeTab.id);window.close();}catch(error){message(error.message,true);}});
$('options').addEventListener('click',()=>chrome.runtime.openOptionsPage());
if(AdShield.SUPPORT_URL){$('support').href=AdShield.SUPPORT_URL;$('support').hidden=false;$('milestoneSupport').href=AdShield.SUPPORT_URL;}
chrome.commands?.getAll().then(commands=>{for(const [command,id] of [['start-picker','pickerKey'],['toggle-site','siteKey']]){const shortcut=commands.find(x=>x.name===command)?.shortcut;if(shortcut){$(id).textContent=shortcut;$(id).hidden=false;}}}).catch(()=>{});
$('update').addEventListener('click',async()=>{busy=true;render();message(t('common_updating'));try{({settings,info}=await request('UPDATE_LIST'));message(t('popup_update_done'));}catch(error){message(t('common_update_failed',error.message),true);}finally{busy=false;render();}});
(async()=>{await I18N.ready;I18N.apply();try{const [response,tabs]=await Promise.all([request('GET_SETTINGS'),chrome.tabs.query({active:true,currentWindow:true})]);({settings,info}=response);activeTab=tabs[0];host=AdShield.hostname(activeTab?.url);message(info.initializationError?t('common_init_partial',info.initializationError):info.lastError?t('common_last_update_failed',info.lastError):'');}catch(error){message(t('common_read_failed',error.message),true);}render();if(activeTab){refreshStats();if(host)setInterval(refreshStats,4000);}if(!host)$('blocked').textContent='0';})();
