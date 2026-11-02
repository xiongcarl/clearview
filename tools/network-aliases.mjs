// uBO documents `from` as an exact alias for `domain`.
// Change only the parsed modifier name; never strip unsupported conditions.
const {RuleParser}=await import(process.env.AD_SHIELD_DEPENDENCIES
  ? new URL('@adguard/agtree/dist/index.js',process.env.AD_SHIELD_DEPENDENCIES).href
  : '@adguard/agtree');
export function normalizeNetworkAliases(text){
  if(!text.includes('from='))return text;
  try{
    const node=RuleParser.parse(text);
    if(node.category!=='Network')return text;
    const scope=(node.modifiers?.children || []).filter(x=>['from','domain'].includes(x.name.value));
    // Ambiguous duplicate scopes and malformed options stay rejected upstream.
    if(scope.length!==1)return text;
    const modifier=scope[0],{value,start,end}=modifier.name;
    if(value!=='from' || modifier.exception || !modifier.value?.value || text.slice(start,end)!=='from')return text;
    return text.slice(0,start)+'domain'+text.slice(end);
  }catch{return text;}
}
