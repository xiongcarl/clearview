// Real Chrome selector-equivalence fixtures. GPL-3.0-or-later.
export const selectorIndexFixture=()=>{
 const F=AdShieldShadows.Filter;if(!F.prototype.indexFor)return {baseline:true};
 const host=document.createElement('div');host.id='parity-host';const root=host.attachShadow({mode:'closed'});
 root.innerHTML='<div class="parent"><span id="target" class="ad AD" data-ad="yes" data-label=".ad, fake"></span><div id="AdID" class="ad1x safe a+b 1digit foo,bar foo&gt;bar 廣告"><b class="child"></b></div></div><p id="ordinary" data-x="a&gt;&gt;&gt;b"></p><div id="ad1x" class="ad-next" data-quote="say &quot;hi&quot;"></div><svg><rect class="ad"></rect><circle></circle></svg>';
 document.body.append(host);
 const cases=['.ad','#target','section > .ad','.parent .ad','[data-ad="yes"]','[data-label=".ad, fake"]','.ad:not(.safe)',':is(.ad, #AdID)',':where(.parent, .missing) .child','div:has(> .child)',':not(.safe)','div:nth-child(2)',':nth-child(2 of .ad, .safe)','*[data-ad]','[class~="ad" i]',':is(.parent, .else) .child','.parent > :is(.ad, .child)','div:not(:has(.safe)) > .child','.a\\+b','.\\31 digit','.ad\\31 x','.foo\\,bar','.foo\\>bar','.foo\\20 bar','div#ad\\31 x','.廣告','#AdID','.AD','div /* , */ .ad','[data-x="a>>>b"]','[data-quote="say \\"hi\\""]','div:is(:has(.child), .safe)','div[class^="ad"]:not(.safe)','svg rect.ad','rect:has(+ circle)','.ad, #AdID, :has(.child)'];
 const f=new F(),mismatches=[],results=[];
 for(const selector of cases){
  const sheet=new CSSStyleSheet();sheet.replaceSync(selector+' { display: none !important; }');
  const eligible=f.ruleSelectors(sheet);if(!eligible){mismatches.push({selector,error:'No parsed eligible selector'});continue;}
  f.css=eligible;f.index=f.indexFor(sheet);f.indexVersion++;
  const subset=f.selectorsFor(root,{extraCss:'',selection:null});
  const all=[...root.querySelectorAll(eligible)],selected=subset?[...root.querySelectorAll(subset)]:[];
  if(all.length!==selected.length || all.some(x=>!selected.includes(x)))mismatches.push({selector,eligible,subset,all:all.map(x=>x.id || x.localName),selected:selected.map(x=>x.id || x.localName)});
  results.push({selector,matches:all.length,indexed:f.index.byKey.size>0});
 }
 host.remove();return {cases:cases.length,positiveCases:results.filter(x=>x.matches>0).length,results,mismatches};
};
