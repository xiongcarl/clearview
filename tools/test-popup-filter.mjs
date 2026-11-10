// The $popup rules built from the lists: matching, scoping and exceptions.
import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';
const root=new URL('../extension/',import.meta.url);const read=p=>readFile(new URL(p,root),'utf8');
const context=vm.createContext({URL,console});context.globalThis=context;
for(const file of ['vendor/publicsuffix.js','common.js','popup-filter.js'])vm.runInContext(await read(file),context);
const {AdShield:A,AdShieldPopupFilter:P,AdShieldDomainUtils:D}=context;
const tools={isListed:A.isListed,entityFor:A.entityFor,getDomain:host=>D.getDomain(host,{allowPrivateDomains:false})};
let checks=0;const check=(name,actual,expected)=>{assert.equal(actual,expected,name);checks++;};
// Semantics on a hand-written set.
const f=P.create([
  {l:0,h:'popads.example'},{l:0,h:'scoped.example',inc:['news.example']},{l:0,h:'third.example',tp:1},
  {l:0,r:'&popunder='},{l:0,r:'||track.example/go/',exc:['friend.example']},{l:0,r:'|https://exact.example/|'},
  {l:0,r:'^https?:\\/\\/[a-z]{5}\\.click\\/',re:1},{l:0,r:'',inc:['shady.example']},{l:0,r:'',inc:['entity.*'],tp:1},
  {l:0,h:'allowed.example'},{l:0,h:'allowed.example',x:1,inc:['partner.example']},{l:2,h:'chinese-only.example'},
  {l:0,r:'/Banner^',cs:1},
],tools);
check('host rule',f.match('https://popads.example/x','site.example'),true);
check('host rule covers subdomains',f.match('https://a.b.popads.example/','site.example'),true);
check('host rule does not match a longer name',f.match('https://notpopads.example/','site.example'),false);
check('unlisted destination',f.match('https://www.wikipedia.org/','site.example'),false);
check('domain= needs the opener',f.match('https://scoped.example/','other.example'),false);
check('domain= on the opener',f.match('https://scoped.example/','www.news.example'),true);
check('third-party only',f.match('https://third.example/','www.third.example'),false);
check('third-party from elsewhere',f.match('https://third.example/','site.example'),true);
check('substring pattern',f.match('https://x.example/a?z=1&popunder=1','site.example'),true);
check('|| pattern with path',f.match('https://cdn.track.example/go/1','site.example'),true);
check('|| pattern needs the label boundary',f.match('https://nottrack.example/go/1','site.example'),false);
check('~domain excludes the opener',f.match('https://track.example/go/1','friend.example'),false);
check('anchored both ends',f.match('https://exact.example/','site.example'),true);
check('anchored both ends rejects a path',f.match('https://exact.example/more','site.example'),false);
check('regex rule',f.match('https://abcde.click/x','site.example'),true);
check('regex rule miss',f.match('https://abcdef.click/x','site.example'),false);
check('all popups of a listed site',f.match('https://anything.example/','shady.example'),true);
check('all popups: same-site kept when third-party only',f.match('https://www.entity.co.uk/x','entity.co.uk'),false);
check('all popups: entity scope',f.match('https://ads.example/','www.entity.co.uk'),true);
check('exception wins',f.match('https://allowed.example/','partner.example'),false);
check('exception scoped to its site',f.match('https://allowed.example/','site.example'),true);
check('disabled list is ignored',f.match('https://chinese-only.example/','site.example',{easylist:true,chinese:false}),false);
check('enabled list applies',f.match('https://chinese-only.example/','site.example',{easylist:true,chinese:true}),true);
check('match-case',f.match('https://x.example/banner?','site.example'),false);
check('match-case hit',f.match('https://x.example/Banner?','site.example'),true);
check('non-web address',f.match('chrome://settings/','site.example'),false);
check('invalid address',f.match('not a url','site.example'),false);
// The shipped data.
const rules=JSON.parse(await read('data/engine/popups.json'));const real=P.create(rules,tools);
assert.ok(rules.filter(x=>!x.x).length>2000,'popup rules present');checks++;
for(const rule of rules)if(rule.r && rule.re)new RegExp(rule.r);
const sample=rules.find(x=>x.h && !x.inc && !x.tp && !x.x && !rules.some(y=>y.x && y.h===x.h));
check('a shipped host rule matches',real.match(`https://${sample.h}/landing`,'news.example.com'),true);
for(const url of ['https://www.google.com/search?q=x','https://accounts.google.com/o/oauth2/auth','https://www.youtube.com/watch?v=1','https://github.com/login','https://www.paypal.com/checkoutnow','https://www.facebook.com/sharer/sharer.php?u=x','https://twitter.com/intent/tweet','https://www.amazon.com/dp/B000','https://mail.google.com/mail/','https://zh.wikipedia.org/wiki/X','https://www.ltn.com.tw/','https://www.bilibili.com/video/x','https://line.me/R/msg/text/','https://t.me/share/url?url=x','https://www.linkedin.com/shareArticle?url=x','https://login.microsoftonline.com/common/oauth2/authorize','https://appleid.apple.com/auth/authorize','https://docs.google.com/document/d/1','https://www.dropbox.com/s/x','https://stripe.com/'])
  check('ordinary destination stays open: '+url,real.match(url,'news.example.com'),false);
console.log(checks+' popup filter checks passed.');
