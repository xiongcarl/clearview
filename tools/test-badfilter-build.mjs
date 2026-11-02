// Actual converter provenance and cancellation boundaries. GPL-3.0-or-later.
import assert from 'node:assert/strict';
import {cancellationPolicy,fullRuleKey} from './badfilter-policy.mjs';
import {protectHeadRequests} from './redirect-policy.mjs';
const {FilterConverter,Filter,Rule}=await import(process.env.AD_SHIELD_CONVERTER || '@adguard/dnr-converter');
let count=0;const check=(name,actual,expected)=>{assert.deepEqual(actual,expected,name);count++;console.log('PASS '+name);};
const targets=['||advertising.example^$script','@@||advertising.example^$script','||scoped.example^$script,domain=a.example|b.example','||value.example^$script,redirect=noopjs','||redirect.example^$script,redirect=noopjs','||ordered.example^$script,domain=a.example|b.example','||alias.example^$3p,frame'];
const cancellations=['@@||advertising.example^$script,badfilter','||scoped.example^$script,domain=a.example,badfilter','||value.example^$script,redirect=nooptext,badfilter','||redirect.example^$script,redirect=noopjs,badfilter','||ordered.example^$domain=b.example|a.example,script,badfilter','||alias.example^$subdocument,third-party,badfilter','||advertising.example^$image,badfilter'];
const sets=[];
for(const [index,id,lines] of [[1,'easylist',targets],[2,'fixes',cancellations]]){
 const [{ruleset}]=await new FilterConverter().convert([new Filter(index,lines.join('\n'))],{withSourceMap:true,resourcesPath:'/vendor/redirects'});
 const raw=await ruleset.getDeclarativeRules(),rules=raw.map((x,i)=>({...x,id:i+1}));
 const protectedSet=protectHeadRequests(rules,[...new Set(rules.map(x=>x.priority || 1))].sort((a,b)=>a-b));
 const directParents=new Map(protectedSet.rules.filter(x=>x.action.type==='redirect').map((x,i)=>[x.id,i+1]));
 sets.push({id,ruleset,idMap:new Map(raw.map((x,i)=>[x.id,i+1])),headParents:protectedSet.headParents,directParents,rules:protectedSet.rules});
}
const policy=await cancellationPolicy(sets,Rule),disabled=new Set(policy.origins.fixes.easylist),native=sets[0].rules;
const rule=(pattern,type)=>native.find(x=>x.condition.urlFilter===pattern && x.action.type===type && !x.condition.requestMethods);
check('Cross-list cancellation removes an advertising allow, retaining its blocker', [disabled.has(rule('||advertising.example^','allow').id),disabled.has(rule('||advertising.example^','block').id)],[true,false]);
check('Partial domain cancellation preserves the other domain and is reported', [disabled.has(rule('||scoped.example^','block').id),policy.declined.some(x=>x.rule.includes('scoped.example'))],[false,true]);
check('Different redirect resource is not a cancellation',disabled.has(rule('||value.example^','redirect').id),false);
const redirect=rule('||redirect.example^','redirect');
check('Exact redirect cancellation disables the native replacement',disabled.has(redirect.id),true);
check('Exact redirect cancellation disables its generated HEAD guard',sets[0].headParents.get(redirect.id).every(x=>disabled.has(x)),true);
check('Exact redirect cancellation disables its direct-denial counterpart',policy.origins.fixes.direct_easylist.includes(sets[0].directParents.get(redirect.id)),true);
check('Modifier and domain-list order do not change full cancellation',disabled.has(rule('||ordered.example^','block').id),true);
check('Recognized resource and party aliases retain cancellation',disabled.has(rule('||alias.example^','block').id),true);
check('Exception and block keys remain separate',fullRuleKey(Rule.createFromText(1,0,'@@||advertising.example^$script')[0])===fullRuleKey(Rule.createFromText(1,0,'||advertising.example^$script')[0]),false);
// A real source-map rule augmented with an unrelated contributor exercises the
// conservative merged-source boundary without changing any delivered data.
const original=sets[0].ruleset.getRulesById.bind(sets[0].ruleset);
sets[0].ruleset.getRulesById=async id=>{const raw=await original(id);return raw.some(x=>x.sourceRule==='@@||advertising.example^$script')?[...raw,{filterId:1,sourceRule:'@@||neighbor.example^$script'}]:raw;};
const merged=await cancellationPolicy(sets,Rule);
check('A merged native rule with another contributor remains enabled',merged.origins.fixes.easylist.includes(rule('||advertising.example^','allow').id),false);
check('A declined merged cancellation is inspectable',merged.declined.some(x=>x.reason.includes('Merged')),true);
console.log(count+' build cancellation checks passed.');
