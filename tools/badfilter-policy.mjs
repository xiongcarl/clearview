// Cross-list, complete-source cancellation. GPL-3.0-or-later.
// The converter's public source map supplies provenance; no broad allow rule
// is synthesized, and every contributor to a merged native rule must match.
const domainOptions=new Set(['domain','from','to','denyallow']);
export function fullRuleKey(rule){
  const modifiers=(rule.node.modifiers?.children || []).filter(x=>x.name.value!=='badfilter').map(x=>{
    const name=x.name.value==='from'?'domain':x.name.value;
    const value=x.value?.value;
    return [name,!!x.exception,domainOptions.has(name) && value!==undefined?[...new Set(value.toLowerCase().split('|'))].sort().join('|'):value ?? null];
  }).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify([rule.allowlist,rule.pattern,modifiers]);
}
export async function cancellationPolicy(sets,Rule){
  const origins={},details=[],declined=[];
  for(const origin of sets)for(const bad of origin.ruleset.getBadFilterRules()){
    const key=fullRuleKey(bad);
    for(const target of sets){
      if(origin===target)continue;
      const sources=target.ruleset.getRulesHashMap().findRules(bad.hash);
      const candidates=[...new Set((await Promise.all(sources.map(x=>target.ruleset.getDeclarativeRulesIdsBySourceRuleIndex(x)))).flat())];
      for(const nativeId of candidates){
        const id=target.idMap.get(nativeId);if(!id)continue; // Unsupported actions are not delivered.
        const raw=await target.ruleset.getRulesById(nativeId);
        const parsed=raw.flatMap(x=>Rule.createFromText(x.filterId,0,x.sourceRule));
        if(!parsed.length || !parsed.some(x=>fullRuleKey(x)===key)){
          if(parsed.some(x=>bad.negatesBadfilter(x)))declined.push({origin:origin.id,target:target.id,rule:bad.getText(),reason:'Only complete matching source cancellation is supported'});
          continue;
        }
        if(!parsed.every(x=>fullRuleKey(x)===key)){
          declined.push({origin:origin.id,target:target.id,rule:bad.getText(),reason:'Merged native rule includes another source'});continue;
        }
        const changes=origins[origin.id] ||= {};
        (changes[target.id] ||= []).push(id,...(target.headParents.get(id) || []));
        const direct=target.directParents.get(id);if(direct)(changes['direct_'+target.id] ||= []).push(direct);
        details.push({origin:origin.id,target:target.id,ruleId:id,badfilter:bad.getText(),sources:raw.map(x=>x.sourceRule)});
      }
    }
  }
  for(const changes of Object.values(origins))for(const [id,values] of Object.entries(changes))changes[id]=[...new Set(values)].sort((a,b)=>a-b);
  const union=new Map();for(const changes of Object.values(origins))for(const [id,values] of Object.entries(changes)){const ids=union.get(id) || new Set();values.forEach(x=>ids.add(x));union.set(id,ids);}
  const maximumDisabledRules=[...union.values()].reduce((n,x)=>n+x.size,0);
  if(maximumDisabledRules>5000)throw new Error('Cross-list cancellation exceeds Chrome disabled-static-rule quota');
  return {version:1,origins,maximumDisabledRules,badfilterRules:sets.reduce((n,x)=>n+x.ruleset.getBadFilterRules().length,0),details,declined};
}
