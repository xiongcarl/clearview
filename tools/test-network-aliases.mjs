// Verify scope aliases against the real pinned converter, not a mock matcher.
import assert from 'node:assert/strict';
import {normalizeNetworkAliases as normalize} from './network-aliases.mjs';
import {configureNodeRegexValidator} from './node-regex-validator.mjs';
import {cancellationPolicy} from './badfilter-policy.mjs';
import {FilterConverter,Filter,Rule} from '@adguard/dnr-converter';
await configureNodeRegexValidator();
let count=0;
const check=(name,actual,expected)=>{assert.deepEqual(actual,expected,name);count++;console.log('PASS '+name);};
for(const text of ['! from=example.com','example.com##[data-from=example.com]','||cdn.example/from=literal^$script','||cdn.example^$script,domain=a.example','||cdn.example^$from=a.example,domain=b.example','||cdn.example^$from=a.example,from=b.example','||cdn.example^$from=','||cdn.example^$~from=a.example'])check('Untouched: '+text,normalize(text),text);
check('Only the modifier name changes',normalize('/from=literal/$script,from=a.example|~safe.a.example,to=cdn.example,denyallow=good.example'),'/from=literal/$script,domain=a.example|~safe.a.example,to=cdn.example,denyallow=good.example');
check('Normalization is idempotent',normalize(normalize('||cdn.example^$script,from=a.example')),'||cdn.example^$script,domain=a.example');
const convert=async lines=>{
 const [{ruleset,errors}]=await new FilterConverter().convert([new Filter(1,lines.join('\n'))],{withSourceMap:true,resourcesPath:'/vendor/redirects'});
 return {rules:await ruleset.getDeclarativeRules(),ruleset,errors};
};
for(const text of [
 '||cdn.example^$script,3p,from=a.example|~safe.a.example,to=cdn.example',
 '*$script,3p,from=a.example,denyallow=good.example|captcha.example',
 '@@||cdn.example^$xhr,from=a.example',
 '/ad[0-9]+/$script,3p,from=~edu|~gov,header=x-powered-by=Express',
 '||cdn.example^$script,from=a.example,redirect=noopjs',
 '||cdn.example^$script,from=a.example,method=get',
 '||cdn.example^$script,from=a.*'
]){
 const result=await convert([normalize(text)]),reference=await convert([text.replace('from=','domain=')]);
 check('No conversion error: '+text,result.errors.length,0);
 check('Exact domain semantics: '+text,result.rules,reference.rules);
}
for(const modifier of ['popup','popunder','strict1p','redirect-rule=noopjs']){
 const result=await convert([normalize('||cdn.example^$script,from=a.example,'+modifier)]);
 check('Unsupported constraint still rejects: '+modifier,[result.rules.length,result.errors.length],[0,1]);
}
const canceled=await convert(['||cdn.example^$script,from=a.example','||cdn.example^$script,domain=a.example,badfilter'].map(normalize));
check('Same-list alias cancellation survives',canceled.rules.length,0);
const sets=[];
for(const [id,lines] of [['base',['||cdn.example^$script,from=a.example']],['fixes',['||cdn.example^$script,domain=a.example,badfilter']]]){
 const result=await convert(lines.map(normalize));sets.push({id,ruleset:result.ruleset,idMap:new Map(result.rules.map((r,i)=>[r.id,i+1])),headParents:new Map(),directParents:new Map()});
}
check('Cross-list alias cancellation survives',(await cancellationPolicy(sets,Rule)).origins,{fixes:{base:[1]}});
console.log(count+' network alias build checks passed.');
