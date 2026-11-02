// Install welcome page: shows the configured shortcuts and, when set, the support link.
I18N.ready.then(()=>{
  I18N.apply();
  chrome.commands.getAll().then(commands=>{for(const key of document.querySelectorAll('kbd[data-command]'))key.textContent=commands.find(x=>x.name===key.dataset.command)?.shortcut || I18N.t('opt_not_set');});
});
if(AdShield.SUPPORT_URL){document.getElementById('supportLink').href=AdShield.SUPPORT_URL;document.getElementById('support').hidden=false;}
document.getElementById('done').addEventListener('click',()=>window.close());
