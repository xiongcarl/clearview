const $=id=>document.getElementById(id);const A=AdShield;const t=I18N.t;let settings,info,busy=false;
function status(text,error=false,dirty=false){$('status').textContent=text;$('status').className=error?'error':'';if(dirty)document.body.dataset.dirty='true';}
const unsaved=()=>status(t('opt_unsaved'),false,true);
async function request(type,value){const response=await chrome.runtime.sendMessage({type,settings:value});if(!response?.ok)throw new Error(response?.error || t('common_no_response'));return response;}
function lock(value){busy=value;for(const element of document.querySelectorAll('button,input,textarea,select'))element.disabled=value;}
function renderLists(){
  for(const [key,id] of [['siteModes','siteModes'],['cosmeticRules','cosmeticRules']]){
    $(id).replaceChildren();for(const entry of settings[key]){const row=document.createElement('li');const text=document.createElement('span');text.textContent=entry.host+' · '+(key==='siteModes'?t('mode_'+entry.mode):entry.selector);const remove=document.createElement('button');remove.className='secondary';remove.textContent=t('common_remove');remove.setAttribute('aria-label',t('opt_remove_aria',text.textContent));remove.addEventListener('click',()=>{settings[key]=settings[key].filter(x=>x!==entry);renderLists();unsaved();});row.append(text,remove);$(id).append(row);}
  }
}
function render(){
  for(const key of ['whitelist','compatSites','blockDomains','allowDomains'])$(key).value=settings[key].join('\n');
  $('userFilters').value=settings.userFilters;checkFilters();
  for(const key of ['enabled','hideAds','shadowAds','autoUpdate','badgeCount','logging','scriptlets','procedural','enhancedTracking','directBlocking','strictThirdParty'])$(key).checked=settings[key];
  for(const id of ['easylist','easyprivacy','chinese','annoyances','fixes'])$('wf_'+id).checked=settings.webFilters[id];
  $('thirdPartyServices').replaceChildren();for(const domain of A.RESTRICTED_THIRD_PARTY){const row=document.createElement('li');row.textContent=domain;$('thirdPartyServices').append(row);}
  $('popupMode').value=settings.popupMode;renderLists();renderInfo();
}
function renderInfo(){
  $('listInfo').textContent=t('opt_list_info',info.domainCount.toLocaleString(),info.sourceVersion,info.lastSuccess?t('opt_recent_update',new Date(info.lastSuccess).toLocaleString()):t('opt_builtin_list'));
  $('webLists').replaceChildren();for(const list of info.webLists || []){const row=document.createElement('p');row.className='muted';row.textContent=t('opt_weblist_row',list.name,list.networkRules.toLocaleString(),list.cosmeticRules.toLocaleString(),t(list.enabled?'opt_network_on':'opt_network_off'));$('webLists').append(row);}
  $('enhancedInfo').textContent=info.enhanced?t('opt_enhanced_info',info.enhanced.domainCount.toLocaleString(),info.enhanced.version,t(info.enhanced.enabled?'common_enabled':'common_disabled')):'';
  $('advancedInfo').textContent=info.advanced?t('opt_advanced_info',info.advanced.scriptletRules.toLocaleString(),info.advanced.extendedRules.toLocaleString()):'';
  $('lastError').textContent=info.lastError?t('opt_last_error',info.lastError):'';
}
function parseDomains(text,max,label){const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);const list=lines.map(line=>{const host=A.normalizeDomain(line);if(!host)throw new Error(t('opt_invalid_domain_in',label,line));return host;});const unique=[...new Set(list)];if(unique.length>max)throw new Error(t('opt_max_domains',label,max));return unique;}
function validateSelectors(value){for(const rule of value.cosmeticRules){if(!A.safeSelector(rule.selector))throw new Error(t('opt_selector_invalid'));const parts=A.selectorChain(rule.selector);for(const part of parts){try{document.querySelector(part);}catch{if(parts.length===1 && ExtendedCss.validate(part).ok)continue;throw new Error(t('opt_css_invalid',part));}}}}

// Parse "my filter rules" as the user types; the background repeats the check on save and
// also validates regular expressions with Chrome.
function filterProblems(text){
  const parsed=UserFilters.parse(text);const errors=[...parsed.errors];
  for(const entry of parsed.cosmetic){try{document.querySelector(entry.selector);}catch{if(!ExtendedCss.validate(entry.selector).ok)errors.push({line:entry.line,message:t('uf_css_invalid')});}}
  return {parsed,errors:errors.sort((a,b)=>a.line-b.line)};
}
function checkFilters(){
  const {parsed,errors}=filterProblems($('userFilters').value);
  $('filterStatus').textContent=t('opt_filter_status',parsed.network.length.toLocaleString(),parsed.cosmetic.length.toLocaleString())+(errors.length?t('opt_filter_problems',errors.length):'');
  $('filterStatus').classList.toggle('error',!!errors.length);
  $('filterErrors').replaceChildren(...errors.slice(0,20).map(error=>{const row=document.createElement('li');row.textContent=t('uf_line_error',error.line,error.message);return row;}));
  return errors;
}
let filterTimer;$('userFilters').addEventListener('input',()=>{clearTimeout(filterTimer);filterTimer=setTimeout(checkFilters,250);unsaved();});
function collect(){const next={...settings};const filterErrors=checkFilters();if(filterErrors.length)throw new Error(t('uf_myfilters_line',filterErrors[0].line,filterErrors[0].message));if($('userFilters').value.length>200000)throw new Error(t('opt_filters_too_long'));next.userFilters=$('userFilters').value;for(const [key,max,label] of [['whitelist',200,t('label_whitelist')],['compatSites',200,t('label_compat')],['blockDomains',500,t('label_block')],['allowDomains',500,t('label_allow')]])next[key]=parseDomains($(key).value,max,label);for(const key of ['enabled','hideAds','shadowAds','autoUpdate','badgeCount','logging','scriptlets','procedural','enhancedTracking','directBlocking','strictThirdParty'])next[key]=$(key).checked;next.popupMode=$('popupMode').value;next.webFilters=Object.fromEntries(['easylist','easyprivacy','chinese','annoyances','fixes'].map(id=>[id,$('wf_'+id).checked]));validateSelectors(next);return A.clean(next);}
async function saveValue(value){lock(true);try{({settings,info}=await request('SET_SETTINGS',value));render();delete document.body.dataset.dirty;status(t('opt_saved'));}catch(error){status(t('common_save_failed',error.message),true);}finally{lock(false);}}
$('strong').addEventListener('click',()=>{try{const next=collect();next.enabled=true;next.hideAds=true;next.shadowAds=true;next.scriptlets=true;next.procedural=true;next.webFilters={...next.webFilters,easylist:true,easyprivacy:true,chinese:true,fixes:true};saveValue(next);}catch(error){status(error.message,true);}});
$('refreshLogs').addEventListener('click',async()=>{try{const response=await request('GET_LOGS');$('logs').replaceChildren();for(const entry of response.logs.slice().reverse()){const row=document.createElement('li');const text=document.createElement('span');text.textContent=`${({block:t('log_block'),allow:t('log_allow'),allowAllRequests:t('log_allow'),upgradeScheme:t('log_upgrade'),redirect:t('log_redirect')}[entry.action] || entry.action)} · ${entry.type} · ${entry.rulesetId} #${entry.ruleId} · ${entry.url}`;const add=document.createElement('button');add.className='secondary';add.textContent=t('opt_add_to_block');add.addEventListener('click',()=>{const host=A.hostname(entry.url);const current=parseDomains($('blockDomains').value,500,t('label_block'));if(host && !current.includes(host)){$('blockDomains').value=[...current,host].join('\n');status(t('opt_added_block'),false,true);}});row.append(text,add);$('logs').append(row);}status(response.logging?t('opt_logs_shown',response.logs.length):t('opt_logs_off'));}catch(error){status(error.message,true);}});
$('clearLogs').addEventListener('click',async()=>{try{await request('CLEAR_LOGS');$('logs').replaceChildren();status(t('opt_logs_cleared'));}catch(error){status(error.message,true);}});
$('save').addEventListener('click',()=>{try{saveValue(collect());}catch(error){status(error.message,true);}});
$('addMode').addEventListener('click',()=>{const host=A.normalizeDomain($('modeHost').value);if(!host){status(t('opt_enter_domain'),true);return;}if(!settings.siteModes.some(x=>x.host===host) && settings.siteModes.length>=50){status(t('opt_sitemodes_max'),true);return;}settings.siteModes=settings.siteModes.filter(x=>x.host!==host);settings.siteModes.push({host,mode:$('modeValue').value});$('modeHost').value='';renderLists();status(t('opt_mode_added'),false,true);});
$('addCosmetic').addEventListener('click',()=>{try{const host=A.normalizeDomain($('cosmeticHost').value);const selector=$('selector').value.trim();if(!host)throw new Error(t('opt_enter_domain'));validateSelectors({cosmeticRules:[{host,selector}]});if(settings.cosmeticRules.length>=300)throw new Error(t('bg_rules_max'));if(!settings.cosmeticRules.some(x=>x.host===host && x.selector===selector))settings.cosmeticRules.push({host,selector});$('selector').value='';renderLists();status(t('opt_rule_added'),false,true);}catch(error){status(error.message,true);}});
$('update').addEventListener('click',async()=>{lock(true);status(t('common_updating'));try{const response=await request('UPDATE_LIST');info=response.info;renderInfo();status(t('opt_update_done'));}catch(error){status(t('common_update_failed',error.message),true);}finally{lock(false);}});
$('resetList').addEventListener('click',async()=>{lock(true);try{const response=await request('RESET_LIST');info=response.info;renderInfo();status(t('opt_list_reset'));}catch(error){status(error.message,true);}finally{lock(false);}});
$('export').addEventListener('click',()=>{try{const value=collect();const url=URL.createObjectURL(new Blob([JSON.stringify({format:'ad-shield-settings',version:4,settings:value},null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='clearview-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status(t('opt_exported'));}catch(error){status(error.message,true);}});
$('import').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async()=>{const file=$('importFile').files[0];if(!file)return;try{if(file.size>512000)throw new Error(t('opt_backup_too_big'));const parsed=JSON.parse(await file.text());if(parsed.format!=='ad-shield-settings' || ![2,3,4].includes(parsed.version) || !parsed.settings || typeof parsed.settings!=='object')throw new Error(t('opt_backup_unsupported'));const value=A.clean(parsed.settings);for(const key of ['whitelist','blockDomains','allowDomains','siteModes','cosmeticRules'])if(!Array.isArray(parsed.settings[key]) || value[key].length!==parsed.settings[key].length)throw new Error(t('opt_backup_bad_rules'));if('compatSites' in parsed.settings && (!Array.isArray(parsed.settings.compatSites) || value.compatSites.length!==parsed.settings.compatSites.length))throw new Error(t('opt_backup_bad_compat'));validateSelectors(value);await saveValue(value);}catch(error){status(t('opt_import_failed',error.message),true);}finally{$('importFile').value='';}});
(async()=>{await I18N.ready;I18N.apply();document.querySelector('[data-i18n=opt_version_foot]').textContent=t('opt_version_foot',chrome.runtime.getManifest().version);lock(true);try{({settings,info}=await request('GET_SETTINGS'));render();status(info.initializationError?t('common_init_partial',info.initializationError):t('opt_ready'),!!info.initializationError);lock(false);}catch(error){status(t('common_read_failed',error.message),true);}loadStats();loadShortcuts();})();
// Statistics, shortcuts and support entry points.
function renderStats(stats){
  const today=new Date();const key=offset=>{const day=new Date(today);day.setDate(day.getDate()-offset);return day.toLocaleDateString('sv');};
  const days=Array.from({length:14},(_,i)=>key(13-i));const values=days.map(day=>stats.days[day] || 0);
  $('statTotal').textContent=stats.total.toLocaleString();$('statToday').textContent=(stats.days[key(0)] || 0).toLocaleString();$('statWeek').textContent=values.slice(-7).reduce((a,b)=>a+b,0).toLocaleString();
  $('statsSince').textContent=t('opt_stats_since',new Date(stats.since).toLocaleDateString());
  const max=Math.max(1,...values);
  $('statChart').replaceChildren(...days.map((day,i)=>{const bar=document.createElement('div');bar.className='bar'+(i===13?' today':'')+(values[i]?'':' empty');bar.title=`${day}：${values[i].toLocaleString()}`;const fill=document.createElement('span');fill.style.height=`${Math.max(values[i]/max*100,1.5)}%`;bar.append(fill);return bar;}));
  let labels=$('statChart').nextElementSibling;if(!labels?.classList.contains('chart-labels')){labels=document.createElement('div');labels.className='chart-labels';$('statChart').after(labels);}
  labels.replaceChildren(...days.map((day,i)=>{const label=document.createElement('span');label.textContent=i%2===1 || i===13?String(Number(day.slice(8))):'';return label;}));
  const sites=Object.entries(stats.sites).sort((a,b)=>b[1]-a[1]).slice(0,8);
  $('topSites').replaceChildren(...sites.map(([host,n])=>{const row=document.createElement('li');const name=document.createElement('span');name.className='site';name.textContent=host;const count=document.createElement('span');count.className='n';count.textContent=n.toLocaleString();row.append(name,count);return row;}));
}
async function loadStats(){try{renderStats((await request('GET_STATS')).stats);}catch(error){$('statsSince').textContent=t('opt_stats_failed',error.message);}}
$('resetStats').addEventListener('click',async()=>{if(!confirm(t('opt_reset_confirm')))return;try{renderStats((await request('RESET_STATS')).stats);status(t('opt_stats_reset'));}catch(error){status(error.message,true);}});
// Firefox opens its own shortcut page (Firefox 137+); Chromium browsers use chrome://extensions/shortcuts.
if(A.IS_FIREFOX && !chrome.commands.openShortcutSettings)$('editShortcuts').hidden=true;
if(!chrome.declarativeNetRequest.setExtensionActionOptions)$('badgeCount').closest('.row').hidden=true;
$('editShortcuts').addEventListener('click',()=>A.IS_FIREFOX?chrome.commands.openShortcutSettings():chrome.tabs.create({url:'chrome://extensions/shortcuts'}));
function loadShortcuts(){chrome.commands.getAll().then(commands=>{$('shortcuts').replaceChildren(...commands.filter(x=>x.name!=='_execute_action').map(command=>{const row=document.createElement('li');const text=document.createElement('span');text.textContent=t('cmd_'+command.name.replace('-','_'));const key=document.createElement('kbd');key.textContent=command.shortcut || t('opt_not_set');row.append(text,key);return row;}));});}
if(A.SUPPORT_URL){$('supportLink').href=A.SUPPORT_URL;$('support-card').hidden=false;$('supportNav').hidden=false;}
// Any edit to a setting marks the form dirty so the save bar asks for attention.
$('settings-content').addEventListener('change',event=>{if(event.target.matches('input:not([type=file]):not(#modeHost):not(#cosmeticHost):not(#selector),select:not(#modeValue),textarea'))unsaved();});
// Interface language: applies immediately by reloading the page (not part of the settings save).
I18N.ready.then(async()=>{const {uiLanguage='auto'}=await chrome.storage.local.get('uiLanguage');$('uiLanguage').value=uiLanguage;});
$('uiLanguage').addEventListener('change',async()=>{await chrome.storage.local.set({uiLanguage:$('uiLanguage').value});location.reload();});
