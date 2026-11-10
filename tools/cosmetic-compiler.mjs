// Cosmetic-only compilation shared by full and incremental builds. GPL-3.0-or-later.
const aliases={ghide:'generichide',ehide:'elemhide',shide:'specifichide',from:'domain'};
const hideTypes=new Set(['generichide','elemhide','specifichide']);
export function nestedHas(selector){
  const stack=[];let quote='',escaped=false;
  for(let i=0;i<selector.length;i++){
    const c=selector[i];if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}
    if(quote){if(c===quote)quote='';continue;}if(c==='"' || c==="'"){quote=c;continue;}
    if(c==='('){const has=selector.slice(Math.max(0,i-4),i).toLowerCase()===':has';if(has && stack.includes(true))return true;stack.push(has);}
    else if(c===')')stack.pop();
  }
  return false;
}
export function balancedNative(selector){
  const stack=[];let quote='',escaped=false;
  for(const c of selector){
    if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}
    if(quote){if(c===quote)quote='';continue;}if(c==='"' || c==="'"){quote=c;continue;}
    if(c==='(' || c==='[')stack.push(c);
    else if(c===')' || c===']'){if(stack.pop()!==(c===')'?'(':'['))return false;}
  }
  return !stack.length && !quote && !escaped;
}
export function hidingException(line,A){
  if(!line.startsWith('@@'))return null;
  const dollar=line.lastIndexOf('$');if(dollar<0)return null;
  const pattern=line.slice(2,dollar);
  const options=line.slice(dollar+1).split(',').map(x=>{
    const equal=x.indexOf('=');const name=equal<0?x:x.slice(0,equal);
    return (aliases[name] || name)+(equal<0?'':x.slice(equal));
  });
  const types=options.filter(x=>hideTypes.has(x));if(!types.length)return null;
  // Never widen path-, resource-, party-, or other constrained exceptions.
  if(options.some(x=>!hideTypes.has(x) && x!=='badfilter' && !x.startsWith('domain=')))return null;
  const valid=x=>A.validDomain(x) || (x.endsWith('.*') && A.validDomain(x.slice(0,-2)));
  let host;
  if(pattern!=='*'){
    const match=pattern.match(/^\|\|([a-z0-9.*-]+)\^$/);
    if(!match || !valid(match[1]))return null;
    host=match[1];
  }
  const domains=options.filter(x=>x.startsWith('domain='));if(domains.length>1)return null;
  const values=domains.length?domains[0].slice(7).split('|'):[];
  if(values.some(x=>!valid(x.replace(/^~/,''))))return null;
  const include=[...new Set(values.filter(x=>!x.startsWith('~')))].sort();
  const exclude=[...new Set(values.filter(x=>x.startsWith('~')).map(x=>x.slice(1)))].sort();
  const kinds=[...new Set(types)].sort();
  return {host,include,exclude,generic:kinds.includes('generichide') || kinds.includes('elemhide'),specific:kinds.includes('specifichide') || kinds.includes('elemhide'),badfilter:options.includes('badfilter'),key:JSON.stringify([host || '*',include,exclude,kinds])};
}
// Declarations from a list go into a stylesheet verbatim: nothing that could close the rule,
// start another one, or load a resource.
export function safeDeclarations(text){
  return typeof text==='string' && text.length<=600 && !/[{}\\<>@]|\/\*|url\s*\(|image-set|expression\s*\(|[\r\n\f]/i.test(text) && /^\s*[-a-z]+\s*:/i.test(text);
}
export function compileCosmetics(lines,A){
  const entries=[],extended=[],genericOff=[],styles=[];
  let unsupportedCosmetic=0,unsupportedExtended=0,unsupportedExceptions=0;
  for(const line of lines){
    const off=hidingException(line,A);
    if(off)genericOff.push(off);
    else if(/^@@.*\$.*(?:generichide|ghide|elemhide|ehide|specifichide|shide)/.test(line))unsupportedExceptions++;
    const match=line.match(/^(.*?)#(@?)(\??)#(.+)$/);if(!match)continue;
    const [,scope,exception,forced,selector]=match;
    if(/^(?:\+js\(|\/\/scriptlet\()/i.test(selector))continue;
    const values=scope?scope.split(','):[];
    if(values.some(x=>!A.validDomain(x.replace(/^~/,'')) && !(x.endsWith('.*') && A.validDomain(x.replace(/^~/,'').slice(0,-2))))){unsupportedCosmetic++;continue;}
    const include=values.filter(x=>!x.startsWith('~')),exclude=values.filter(x=>x.startsWith('~')).map(x=>x.slice(1));
    // selector:style(declarations) restyles instead of hiding; lists use it to undo what a
    // site does when it detects blocking (locked scrolling, blurred text, reserved gaps).
    const styled=selector.match(/^(.+?):style\((.+)\)\s*$/s);
    if(styled){
      const [,target,declarations]=styled;
      const plainTarget=!forced && !nestedHas(target) && A.safeFilterSelector(target) && balancedNative(target) && !target.startsWith('^') && !/:(?:has-text|contains|-abp-has|-abp-contains|matches-css(?:-before|-after)?|matches-attr|matches-property|xpath|upward|nth-ancestor|if-not|empty-trimmed|remove|watch-attr|not-if|style|others|properties|-abp-properties|matches-path|matches-media|remove-attr|remove-class|shadow)(?:\(|$)/i.test(target);
      if(!include.length || !plainTarget || !safeDeclarations(declarations)){unsupportedCosmetic++;continue;}
      styles.push({selector:target.trim(),style:declarations.trim().replace(/;\s*$/,''),include,exclude,exception:!!exception});continue;
    }
    const procedural=forced || nestedHas(selector) || /:(?:has-text|contains|-abp-has|-abp-contains|matches-css(?:-before|-after)?|matches-attr|matches-property|xpath|upward|nth-ancestor|if-not|empty-trimmed|remove|watch-attr)(?:\(|$)/i.test(selector);
    if(procedural){
      const value=selector.replace(/:remove\(\)\s*$/,'');
      if((!include.length && !exception) || !A.safeFilterSelector(value) || value.startsWith('^')){unsupportedExtended++;continue;}
      extended.push({selector:value,include,exclude,exception:!!exception});continue;
    }
    if(!A.safeFilterSelector(selector) || !balancedNative(selector) || /:(?:not-if|style|watch-attr|others|properties|-abp-properties|matches-path|remove-attr|remove-class|shadow)(?:\(|$)/.test(selector) || selector.startsWith('^') || ['*','html','body',':root'].includes(selector.trim().toLowerCase())){unsupportedCosmetic++;continue;}
    entries.push({selector,include,exclude,exception:!!exception});
  }
  return {ordinary:{entries,genericOff},extended:{entries:extended,styles},unsupportedCosmetic,unsupportedExtended,unsupportedExceptions};
}
