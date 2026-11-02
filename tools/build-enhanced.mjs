// Packaged optional third-party privacy coverage. GPL-3.0-or-later.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const text=await readFile(new URL('data/ultimate-domains.txt',root),'utf8');
const domains=text.split(/\r?\n/).map(x=>x.trim()).filter(x=>x && !x.startsWith('#'));
const declared=Number(text.match(/^# Number of entries:\s*(\d+)\s*$/m)?.[1]);
if(!text.startsWith("# Title: HaGeZi's Multi ULTIMATE") || declared!==domains.length || domains.length<100000 || domains.length>500000 || domains.some(x=>!x.includes('.') || x.length>253 || !x.split('.').every(v=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(v))))throw new Error('Invalid/truncated ULTIMATE snapshot');
const sorted=[...new Set(domains)].sort();const rules=[];
for(let i=0;i<sorted.length;i+=250)rules.push({id:rules.length+1,priority:1,action:{type:'block'},condition:{requestDomains:sorted.slice(i,i+250),domainType:'thirdParty'}});
await writeFile(new URL('data/enhanced-rules.json',root),JSON.stringify(rules)+'\n');
await writeFile(new URL('data/enhanced-meta.json',root),JSON.stringify({name:'HaGeZi Multi ULTIMATE (third-party)',source:'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/ultimate-onlydomains.txt',version:text.match(/^# Version:\s*(.+)$/m)[1],domainCount:sorted.length,networkRules:rules.length,sha256:createHash('sha256').update(text).digest('hex')})+'\n');
console.log(`Enhanced coverage: ${sorted.length} domains, ${rules.length} third-party rules.`);
