/* The user's own filter rules: a practical subset of Adblock Plus / uBlock Origin syntax,
   compiled to declarativeNetRequest rules and cosmetic selectors. GPL-3.0-or-later. */
globalThis.UserFilters=(()=>{
  const t=(key,...subs)=>globalThis.I18N?I18N.t(key,...subs):key;
  // Firefox allows 5,000 dynamic rules in total, shared with the domain list and site settings.
  const MAX_LINES=5000,MAX_NETWORK=globalThis.AdShield?.IS_FIREFOX?4000:5000,FIRST_ID=30000;
  const PRIORITY={block:5000,allow:6000,important:7000};
  const TYPES={script:'script',image:'image',stylesheet:'stylesheet',css:'stylesheet',xmlhttprequest:'xmlhttprequest',xhr:'xmlhttprequest',subdocument:'sub_frame',frame:'sub_frame',media:'media',font:'font',websocket:'websocket',ping:'ping',beacon:'ping',object:'object',other:'other',document:'main_frame',doc:'main_frame',popup:'main_frame'};
  const ALL_TYPES=['main_frame','sub_frame','stylesheet','script','image','font','object','xmlhttprequest','ping','media','websocket','webtransport','webbundle','other'];
  const domainOf=value=>AdShield.normalizeDomain(value) && !value.includes('/') ? AdShield.normalizeDomain(value) : null;
  function domainList(text,separator,line){
    const include=[],exclude=[];
    for(const raw of text.split(separator).map(x=>x.trim()).filter(Boolean)){
      const negated=raw.startsWith('~');const host=domainOf(negated?raw.slice(1):raw);
      if(!host)throw new Error(t('uf_bad_domain',raw));
      (negated?exclude:include).push(host);
    }
    return {include,exclude};
  }
  function cosmetic(line){
    const match=line.match(/^([^#]*?)(##\+js|#@?#|#\?#|#\$#|#%#|#@\?#)(.*)$/);
    if(!match)return null;
    const [,scope,separator,selector]=match;
    if(separator!=='##')throw new Error(t(separator==='#@#'?'uf_no_exceptions':'uf_bad_cosmetic'));
    if(!AdShield.safeFilterSelector(selector.trim(),500))throw new Error(t('uf_selector_invalid'));
    const {include,exclude}=domainList(scope,',',line);
    if(!include.length && !AdShield.safeSelector(selector.trim()))throw new Error(t('uf_generic_too_broad'));
    return {include,exclude,selector:selector.trim()};
  }
  function network(line){
    let body=line,allow=false;
    // hosts-file lines and bare domains block the whole domain.
    const hosts=body.match(/^(?:0\.0\.0\.0|127\.0\.0\.1|::1?)\s+(\S+)$/);
    if(hosts)body='||'+hosts[1]+'^';
    else if(/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(body))body='||'+body.toLowerCase()+'^';
    if(body.startsWith('@@')){allow=true;body=body.slice(2);}
    let pattern=body,optionText='';
    const regex=body.match(/^(\/.+\/)(?:\$([^/]*))?$/);
    if(regex){pattern=regex[1];optionText=regex[2] || '';}
    else{const dollar=body.lastIndexOf('$');if(dollar>=0){pattern=body.slice(0,dollar);optionText=body.slice(dollar+1);}}
    const condition={};let important=false,documentAllow=false;const types=[],excludedTypes=[];
    for(const raw of optionText.split(',').map(x=>x.trim()).filter(Boolean)){
      const [name,value]=raw.includes('=')?[raw.slice(0,raw.indexOf('=')).toLowerCase(),raw.slice(raw.indexOf('=')+1)]:[raw.toLowerCase(),''];
      const negated=name.startsWith('~');const key=negated?name.slice(1):name;
      if(['third-party','3p'].includes(key))condition.domainType=negated?'firstParty':'thirdParty';
      else if(['first-party','1p'].includes(key))condition.domainType=negated?'thirdParty':'firstParty';
      else if(key==='important' && !negated)important=true;
      else if(key==='match-case' && !negated)condition.isUrlFilterCaseSensitive=true;
      else if(key==='all' && !negated)types.push(...ALL_TYPES);
      else if((key==='domain' || key==='from') && value && !negated){const {include,exclude}=domainList(value,'|');if(include.length)condition.initiatorDomains=include;if(exclude.length)condition.excludedInitiatorDomains=exclude;}
      else if(TYPES[key]){if(allow && key==='document' && !negated)documentAllow=true;(negated?excludedTypes:types).push(TYPES[key]);}
      else throw new Error(t('uf_bad_option',raw));
    }
    if(regex){
      condition.regexFilter=pattern.slice(1,-1);
      if(!/^[\x20-\x7e]+$/.test(condition.regexFilter))throw new Error(t('uf_regex_ascii'));
    }else{
      const domain=pattern.match(/^\|\|([a-z0-9.-]+)\^?\|?$/i);
      if(domain && AdShield.validDomain(domain[1].toLowerCase()))condition.requestDomains=[domain[1].toLowerCase()];
      else{
        if(!pattern || /^[*|^]*$/.test(pattern))throw new Error(t('uf_too_broad'));
        if(!/^[\x21-\x7e]+$/.test(pattern))throw new Error(t('uf_url_ascii'));
        if(pattern.startsWith('||*'))pattern=pattern.slice(2);
        condition.urlFilter=pattern;
      }
    }
    if(condition.isUrlFilterCaseSensitive && !condition.urlFilter && !condition.regexFilter)delete condition.isUrlFilterCaseSensitive;
    if(types.length)condition.resourceTypes=[...new Set(types)];
    if(excludedTypes.length && !types.length)condition.excludedResourceTypes=[...new Set(excludedTypes)];
    const type=documentAllow?'allowAllRequests':allow?'allow':'block';
    if(type==='allowAllRequests')condition.resourceTypes=['main_frame','sub_frame'];
    return {action:{type},priority:allow?PRIORITY.allow:important?PRIORITY.important:PRIORITY.block,condition};
  }
  function parse(text){
    const result={network:[],cosmetic:[],errors:[]};
    const lines=String(text || '').split(/\r?\n/);
    if(lines.length>MAX_LINES)result.errors.push({line:MAX_LINES+1,message:t('uf_max_lines',MAX_LINES)});
    lines.slice(0,MAX_LINES).forEach((raw,index)=>{
      const line=raw.trim();
      if(!line || line.startsWith('!') || /^\[.*\]$/.test(line) || /^#(?!@?[#?$%])/.test(line))return;
      try{
        const element=cosmetic(line);
        if(element){result.cosmetic.push({...element,line:index+1});return;}
        if(result.network.length>=MAX_NETWORK)throw new Error(t('uf_max_network',MAX_NETWORK));
        result.network.push({...network(line),line:index+1});
      }catch(error){result.errors.push({line:index+1,message:error.message});}
    });
    return result;
  }
  // Dynamic rules for the network part; line numbers stay outside the rule objects.
  function rules(parsed){return parsed.network.map(({line,...rule},index)=>({id:FIRST_ID+index,...rule}));}
  function selectorsFor(host,parsed){return parsed.cosmetic.filter(x=>(!x.include.length || AdShield.isListed(host,x.include)) && !AdShield.isListed(host,x.exclude)).map(x=>x.selector);}
  return {FIRST_ID,MAX_LINES,parse,rules,selectorsFor};
})();
