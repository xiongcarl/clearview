// The stylesheet format for selectors every page gets (data/engine/generic-*.css).
// A browser parses these files in every frame of every page, and a rule per selector spends
// most of the file on repeated declarations. Selectors made only of plain tag, #id and .class
// parts are valid in any browser, so they share rules. Everything else keeps a rule of its own:
// one selector a browser rejects would otherwise take its whole group with it.
const DECLARATION='{display:none!important}';
const MARK='/* one selector per rule below */';
const GROUP=200;
const compound='(?:[a-z][a-z0-9]*)?(?:[#.]-?[_a-zA-Z][_a-zA-Z0-9-]*)+|[a-z][a-z0-9]*';
const plain=new RegExp(`^(?:${compound})(?:(?: > | \\+ | ~ | )(?:${compound}))*$`);
export function writeGenericCss(selectors){
  const list=[...selectors],shared=list.filter(x=>plain.test(x)),single=list.filter(x=>!plain.test(x)),lines=[];
  for(let i=0;i<shared.length;i+=GROUP)lines.push(shared.slice(i,i+GROUP).join(',')+DECLARATION);
  lines.push(MARK,...single.map(x=>x+DECLARATION));
  return lines.join('\n')+'\n';
}
export function readGenericCss(text){
  const result=[];let single=false;
  for(const line of text.split('\n')){
    if(!line)continue;if(line===MARK){single=true;continue;}
    const body=line.slice(0,-DECLARATION.length);
    if(single)result.push(body);else result.push(...body.split(','));
  }
  return result;
}
export const ruleCount=text=>text.split('\n').filter(line=>line && line!==MARK).length;
