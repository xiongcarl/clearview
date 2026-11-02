// HEAD requests have no response body: compatibility code cannot execute.
// Keep normal resource substitutions, but reject matching HEAD probes outright.
export function protectHeadRequests(rules,priorities){
  const mapped=rules.map(rule=>({...rule,priority:100+2*priorities.indexOf(rule.priority || 1)}));
  const guards=[];const headParents=new Map();
  for(const rule of mapped){
    const c=rule.condition;
    if(rule.action.type!=='redirect' || (c.requestMethods && !c.requestMethods.includes('head')) || c.excludedRequestMethods?.includes('head'))continue;
    const condition={...c,requestMethods:['head']};delete condition.excludedRequestMethods;
    const guardId=mapped.length+guards.length+1;headParents.set(rule.id,[guardId]);
    guards.push({id:guardId,priority:rule.priority+1,action:{type:'block'},condition});
  }
  return {rules:[...mapped,...guards],headBlockRules:guards.length,headParents};
}
