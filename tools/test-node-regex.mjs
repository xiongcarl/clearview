import assert from 'node:assert/strict';
import {FilterConverter,Filter} from '@adguard/dnr-converter';
import {configureNodeRegexValidator} from './node-regex-validator.mjs';
await configureNodeRegexValidator();
const lines=[String.raw`/\/adserver\/[0-9]+\.js$/$script,third-party,domain=publisher.example`,String.raw`@@/\/adserver\/42\.js$/$script,third-party,domain=publisher.example`,String.raw`/(?<=a)b/$script`,String.raw`/(.)\1/$script`];
const [{ruleset,errors}]=await new FilterConverter().convert([new Filter(1,lines.join('\n'))],{withSourceMap:true,maxNumberOfRegexpRules:250});
const rules=await ruleset.getDeclarativeRules();let count=0;
const check=(name,actual,expected)=>{assert.deepEqual(actual,expected,name);console.log('PASS '+name);count++;};
check('Valid blocking and allowing regex both survive Node build',rules.length,2);
check('Both unsupported RE2 features remain rejected',errors.length,2);
check('No missing-browser validation error',errors.some(e=>e.reason?.includes('chrome.declarativeNetRequest')),false);
for(const action of ['block','allow']){
 const rule=rules.find(x=>x.action.type===action);check(action+' action survives',!!rule,true);
 check(action+' original source scope preserved',rule.condition.initiatorDomains,['publisher.example']);
 check(action+' resource type preserved',rule.condition.resourceTypes,['script']);
 check(action+' third-party constraint preserved',rule.condition.domainType,'thirdParty');
 check(action+' regex retained',!!rule.condition.regexFilter,true);
}
console.log(count+' Node regex build checks passed.');
