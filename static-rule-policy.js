/* Exact native-rule cancellation, without broad network exemptions. GPL-3.0-or-later. */
globalThis.AdShieldStaticPolicy=(()=>{
  const ids=['easylist','easyprivacy','chinese','annoyances','fixes','direct_easylist','direct_easyprivacy','direct_chinese','direct_fixes'];
  function desired(policy,settings){
    if(policy.version!==1 || !policy.origins || Array.isArray(policy.origins))throw new Error('Invalid bundled cancellation policy');
    const result=new Map(ids.map(id=>[id,new Set()]));
    for(const [origin,changes] of Object.entries(policy.origins)){
      if(!ids.includes(origin) || origin.startsWith('direct_') || !changes || typeof changes!=='object')throw new Error('Invalid cancellation source');
      for(const [target,rules] of Object.entries(changes)){
        if(!result.has(target) || !Array.isArray(rules) || rules.some(x=>!Number.isSafeInteger(x) || x<1))throw new Error('Invalid cancellation target');
        if(settings.enabled && settings.webFilters[origin])rules.forEach(x=>result.get(target).add(x));
      }
    }
    if([...result.values()].reduce((n,x)=>n+x.size,0)>5000)throw new Error('Too many disabled static rules');
    return result;
  }
  async function apply(policy,settings,dnr){
    const next=desired(policy,settings);
    const current=await Promise.all(ids.map(async rulesetId=>[rulesetId,await dnr.getDisabledRuleIds({rulesetId})]));
    // Release old quota before disabling new IDs. Each native update is atomic;
    // the caller restores the previous settings if a later operation fails.
    for(const [rulesetId,rules] of current){const enableRuleIds=rules.filter(id=>!next.get(rulesetId).has(id));if(enableRuleIds.length)await dnr.updateStaticRules({rulesetId,enableRuleIds});}
    for(const [rulesetId,rules] of current){const old=new Set(rules);const disableRuleIds=[...next.get(rulesetId)].filter(id=>!old.has(id));if(disableRuleIds.length)await dnr.updateStaticRules({rulesetId,disableRuleIds});}
  }
  return {desired,apply};
})();
