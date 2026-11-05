/* AdGuard Scriptlets 2.5.1 and Clearview. GPL v3; sources in vendor/source/. */
(()=>{
'use strict';
const exceptions=[{"include":["uii.io"],"exclude":[],"exception":true,"name":"ubo-noeval","implementation":"noeval","args":[]},{"include":["vr.pornhat.*"],"exclude":[],"exception":true,"name":"ubo-aopr","implementation":"abortOnPropertyRead","args":["document.dispatchEvent"]},{"include":["vidsrc.*"],"exclude":[],"exception":true,"name":"ubo-acs","implementation":"abortCurrentInlineScript","args":["EventTarget.prototype.addEventListener","delete window"]},{"include":["titulky.com"],"exclude":[],"exception":true,"name":"ubo-set-constant","implementation":"setConstant","args":["xmxalr",""]},{"include":["idnes.cz"],"exclude":[],"exception":true,"name":"ubo-acis","implementation":"abortCurrentInlineScript","args":["HTMLIFrameElement.prototype.contentWindow"]},{"include":["money.pl","kobieta.wp.pl","gadzetomania.pl","fotoblogia.pl","komorkomania.pl","wiadomosci.wp.pl","tech.wp.pl","dom.wp.pl","facet.wp.pl","film.wp.pl","finanse.wp.pl","gry.wp.pl","gwiazdy.wp.pl","kobieta.wp.pl","ksiazki.wp.pl","kuchnia.wp.pl","moto.wp.pl","opinie.wp.pl","pogoda.wp.pl","teleshow.wp.pl","turystyka.wp.pl","wideo.wp.pl","wawalove.wp.pl","autokult.pl"],"exclude":[],"exception":true,"name":"ubo-nostif","implementation":"preventSetTimeout","args":["detected","300"]},{"include":["money.pl","kobieta.wp.pl","gadzetomania.pl","fotoblogia.pl","komorkomania.pl","film.wp.pl","gry.wp.pl","horoskop.wp.pl","kobieta.wp.pl","pogoda.wp.pl","tech.wp.pl","tv.wp.pl","twojeip.wp.pl","wiadomosci.wp.pl","wideo.wp.pl","sportowefakty.wp.pl","fitness.wp.pl","wawalove.wp.pl","gwiazdy.wp.pl","teleshow.wp.pl","wp.pl","autokult.pl"],"exclude":[],"exception":true,"name":"ubo-aost","implementation":"abortOnStackTrace","args":["WP.prebid","onLoad"]},{"include":["money.pl"],"exclude":[],"exception":true,"name":"ubo-set","implementation":"setConstant","args":["Object.prototype.rekids","undefined"]},{"include":["money.pl"],"exclude":[],"exception":true,"name":"ubo-set","implementation":"setConstant","args":["Object.prototype.gafSlot","undefined"]},{"include":["money.pl"],"exclude":[],"exception":true,"name":"ubo-set","implementation":"setConstant","args":["Object.prototype.advViewability","undefined"]},{"include":["wp.pl"],"exclude":[],"exception":true,"name":"ubo-aopr","implementation":"abortOnPropertyRead","args":["WP.inline"]},{"include":["wp.pl"],"exclude":[],"exception":true,"name":"ubo-nostif","implementation":"preventSetTimeout","args":["/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"]},{"include":["www.wp.pl"],"exclude":[],"exception":true,"name":"ubo-aopr","implementation":"abortOnPropertyRead","args":["__headpayload"]},{"include":["www.wp.pl"],"exclude":[],"exception":true,"name":"ubo-aost","implementation":"abortOnStackTrace","args":["WP","r https"]},{"include":["www.wp.pl"],"exclude":[],"exception":true,"name":"ubo-set","implementation":"setConstant","args":["WP.gaf.loadBunch","noopFunc"]},{"include":["sportowefakty.wp.pl"],"exclude":[],"exception":true,"name":"ubo-set","implementation":"setConstant","args":["Object.prototype.loadBunch","noopFunc"]},{"include":["sportowefakty.wp.pl"],"exclude":[],"exception":true,"name":"ubo-aopr","implementation":"abortOnPropertyRead","args":["Object.prototype.bodyCode"]},{"include":["filmweb.pl"],"exclude":[],"exception":true,"name":"ubo-acs","implementation":"abortCurrentInlineScript","args":["decodeURIComponent","newAdblockBoardDisplayed"]},{"include":["linkneverdie.net"],"exclude":[],"exception":true,"name":"ubo-nostif","implementation":"preventSetTimeout","args":["t"]},{"include":["dziennik.pl"],"exclude":[],"exception":true,"name":"ubo-abort-current-script","implementation":"abortCurrentInlineScript","args":["parseInt","adblock"]},{"include":["gunauc.net"],"exclude":[],"exception":true,"name":"ubo-prevent-fetch","implementation":"preventFetch","args":["pagead2.googlesyndication.com"]},{"include":["daddylive.link"],"exclude":[],"exception":true,"name":"ubo-aopr","implementation":"abortOnPropertyRead","args":["require"]},{"include":["player.pl"],"exclude":[],"exception":true,"name":"ubo-json-prune","implementation":"jsonPrune","args":["movie.advertising.ad_server"]},{"include":["jobzhub.store","fitdynamos.com","labgame.io"],"exclude":[],"exception":true,"name":"trusted-replace-node-text","implementation":"trustedReplaceNodeText","args":["script","/initialTimeSeconds = \\d+/","/initialTimeSeconds = \\d+/","initialTimeSeconds = 7"]},{"include":["jobzhub.store","fitdynamos.com","labgame.io"],"exclude":[],"exception":true,"name":"ubo-nano-sib","implementation":"adjustSetInterval","args":["tid","*","0.02"]},{"include":["sayphotobooth.com"],"exclude":[],"exception":true,"name":"ubo-adjust-setInterval","implementation":"adjustSetInterval","args":["tp-time","*","0.001"]},{"include":["intercelestial.com"],"exclude":[],"exception":true,"name":"ubo-adjust-setTimeout","implementation":"adjustSetTimeout","args":["","*","0.1"]},{"include":["dziennikbaltycki.pl","dzienniklodzki.pl","dziennikpolski24.pl","dziennikzachodni.pl","echodnia.eu","expressbydgoski.pl","expressilustrowany.pl","gazetakrakowska.pl","gazetalubuska.pl","gazetawroclawska.pl","gk24.pl","gloswielkopolski.pl","gol24.pl","gp24.pl","gra.pl","gs24.pl","kurierlubelski.pl","motofakty.pl","naszemiasto.pl","nowiny24.pl","nowosci.com.pl","nto.pl","polskatimes.pl","pomorska.pl","poranny.pl","sportowy24.pl","strefaagro.pl","strefabiznesu.pl","stronakobiet.pl","telemagazyn.pl","to.com.pl","wspolczesna.pl"],"exclude":[],"exception":true,"name":"ubo-set-constant","implementation":"setConstant","args":["pp_adblock_is_off","trueFunc"]},{"include":["abczdrowie.pl"],"exclude":[],"exception":true,"name":"ubo-aost","implementation":"abortOnStackTrace","args":["WP.prebid","onLoad"]},{"include":["job.mt.de","job.nw.de"],"exclude":[],"exception":true,"name":"ubo-nostif","implementation":"preventSetTimeout","args":[".call(null)","10"]},{"include":["uqload.co"],"exclude":[],"exception":true,"name":"ubo-abort-current-script","implementation":"abortCurrentInlineScript","args":["document.createElement","break;case $."]}];
const implementations={"preventSetTimeout":function preventSetTimeout(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventSetTimeout(source, matchCallback, matchDelay) {
    var shouldLog = typeof matchCallback === "undefined" && typeof matchDelay === "undefined";
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      var callback = args[0];
      var delay = args[1];
      var shouldPrevent = false;
      if (shouldLog) {
        hit(source);
        logMessage(source, `setTimeout(${callbackToString(callback)}, ${delay})`, true);
      } else {
        shouldPrevent = isPreventionNeeded({
          callback: callback,
          delay: delay,
          matchCallback: matchCallback,
          matchDelay: matchDelay
        });
      }
      if (shouldPrevent) {
        hit(source);
        args[0] = noopFunc;
      }
      return target.apply(thisArg, args);
    };
    var setTimeoutHandler = {
      apply: handlerWrapper
    };
    window.setTimeout = new Proxy(window.setTimeout, setTimeoutHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function isPreventionNeeded(a) {
    var {callback: e, delay: t, matchCallback: l, matchDelay: r} = a;
    if (!isValidCallback(e)) return false;
    if (!isValidMatchStr(l) || r && !isValidMatchNumber(r)) return false;
    var {isInvertedMatch: c, matchRegexp: i} = parseMatchArg(l), {isInvertedDelayMatch: n, delayMatch: s, delayMinMatch: d, delayMaxMatch: h, isDelayRange: M} = parseDelayArg(r), y = parseRawDelay(t), v = callbackToString(e);
    return M || null !== s ? l ? i.test(v) !== c && isPreventDelayMatched(M, d, h, s, n, y) : isPreventDelayMatched(M, d, h, s, n, y) : i.test(v) !== c;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function parseDelayArg(a) {
    var l = null == a ? void 0 : a.startsWith("!"), e = l ? a.slice(1) : a, n = e ? e.indexOf("-") : -1;
    if (-1 !== n) {
      var t = e.slice(0, n), i = e.slice(n + 1), s = "" === t ? null : parseFloat(t), M = "" === i ? null : parseFloat(i), u = "" === t || null !== s && !nativeIsNaN(s), c = "" === i || null !== M && !nativeIsNaN(M);
      return u && c && (null !== s || null !== M) ? {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: s,
        delayMaxMatch: M,
        isDelayRange: true
      } : {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: null,
        delayMaxMatch: null,
        isDelayRange: true
      };
    }
    var r = parseInt(e, 10);
    return {
      isInvertedDelayMatch: l,
      delayMatch: nativeIsNaN(r) ? null : r,
      delayMinMatch: null,
      delayMaxMatch: null,
      isDelayRange: false
    };
  }
  function isPreventDelayMatched(l, n, u, e, t, r) {
    return l ? (null !== n || null !== u) && "number" == typeof r && ((null === n || r >= n) && (null === u || r <= u)) !== t : null === e || r === e !== t;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function isValidMatchNumber(a) {
    var e = a;
    null != a && a.startsWith("!") && (e = a.slice(1));
    var i = e.indexOf("-");
    if (-1 !== i) {
      var t = e.slice(0, i), s = e.slice(i + 1), n = "" === t || !nativeIsNaN(parseFloat(t)) && nativeIsFinite(parseFloat(t)), r = "" === s || !nativeIsNaN(parseFloat(s)) && nativeIsFinite(parseFloat(s));
      return !(!n || !r || "" === t && "" === s);
    }
    var l = parseFloat(e);
    return !nativeIsNaN(l) && nativeIsFinite(l);
  }
  function parseRawDelay(a) {
    var e = Math.floor(parseInt(a, 10));
    return "number" != typeof e || nativeIsNaN(e) ? a : e;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventSetTimeout.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventAddEventListener":function preventAddEventListener(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventAddEventListener(source, typeSearch, listenerSearch, additionalArgName, additionalArgValue, noProtect) {
    var typeSearchRegexp = toRegExp(typeSearch);
    var listenerSearchRegexp = toRegExp(listenerSearch);
    var elementToMatch;
    if (additionalArgName) {
      if (additionalArgName !== "elements") {
        logMessage(source, `Invalid "additionalArgName": ${additionalArgName}\nOnly "elements" is supported.`);
        return;
      }
      if (!additionalArgValue) {
        logMessage(source, '"additionalArgValue" is required.');
        return;
      }
      elementToMatch = additionalArgValue;
    }
    var elementMatches = function elementMatches(element) {
      if (elementToMatch === undefined) {
        return true;
      }
      if (elementToMatch === "window") {
        return element === window;
      }
      if (elementToMatch === "document") {
        return element === document;
      }
      if (element && element.matches && element.matches(elementToMatch)) {
        return true;
      }
      return false;
    };
    var nativeAddEventListener = window.EventTarget.prototype.addEventListener;
    var nativeToString = Function.prototype.toString;
    function addEventListenerWrapper(type, listener) {
      var _this$constructor;
      var shouldPrevent = false;
      if (validateType(type) && validateListener(listener)) {
        shouldPrevent = typeSearchRegexp.test(type.toString()) && listenerSearchRegexp.test(listenerToString(listener, nativeToString)) && elementMatches(this);
      }
      if (shouldPrevent) {
        hit(source);
        return undefined;
      }
      var context = this;
      if (this && ((_this$constructor = this.constructor) === null || _this$constructor === void 0 ? void 0 : _this$constructor.name) === "Window" && this !== window) {
        context = window;
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return nativeAddEventListener.apply(context, [ type, listener, ...args ]);
    }
    if (noProtect === "true") {
      window.EventTarget.prototype.addEventListener = addEventListenerWrapper;
    } else {
      var descriptor = {
        configurable: true,
        set: function set() {},
        get: function get() {
          return addEventListenerWrapper;
        }
      };
      Object.defineProperty(window.EventTarget.prototype, "addEventListener", descriptor);
      Object.defineProperty(window, "addEventListener", descriptor);
      Object.defineProperty(document, "addEventListener", descriptor);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function validateType(n) {
    return null != n;
  }
  function validateListener(n) {
    return void 0 !== n && ("function" == typeof n || "object" == typeof n && null !== n && "handleEvent" in n && "function" == typeof n.handleEvent);
  }
  function listenerToString(n, t) {
    return "function" == typeof n ? t.call(n) : t.call(n.handleEvent);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventAddEventListener.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"abortOnPropertyRead":function abortOnPropertyRead(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnPropertyRead(source, property) {
    if (!property) {
      return;
    }
    var rid = randomId();
    var abort = function abort() {
      hit(source);
      throw new ReferenceError(rid);
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      setPropertyAccess(base, prop, {
        get: abort,
        set: function set() {}
      });
    };
    _setChainPropAccess(window, property);
    window.onerror = createOnErrorHandler(rid).bind();
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function setPropertyAccess(e, r, t) {
    var c = Object.getOwnPropertyDescriptor(e, r);
    return !(c && !c.configurable) && (Object.defineProperty(e, r, t), true);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function interceptChainProp(t, n, e, c) {
    var i;
    try {
      i = t[n];
    } catch (t) {
      i = void 0;
    }
    Object.defineProperty(t, n, {
      get: function get() {
        return i;
      },
      set: function set(t) {
        i = t, t instanceof Object && c(t, e);
      }
    });
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    abortOnPropertyRead.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setConstant":function setConstant(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setConstant(source, property, value) {
    var stack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var valueWrapper = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var setProxyTrap = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var uboAliases = [ "set-constant.js", "ubo-set-constant.js", "set.js", "ubo-set.js", "ubo-set-constant", "ubo-set" ];
    if (uboAliases.includes(source.name)) {
      if (stack.length !== 1 && !getNumberFromString(stack)) {
        valueWrapper = stack;
      }
      stack = undefined;
    }
    if (!property) {
      return;
    }
    var isProxyTrapSet = false;
    var emptyArr = noopArray();
    var emptyObj = noopObject();
    var constantValue;
    if (value === "undefined") {
      constantValue = undefined;
    } else if (value === "false") {
      constantValue = false;
    } else if (value === "true") {
      constantValue = true;
    } else if (value === "null") {
      constantValue = null;
    } else if (value === "emptyArr") {
      constantValue = emptyArr;
    } else if (value === "emptyObj") {
      constantValue = emptyObj;
    } else if (value === "noopFunc") {
      constantValue = noopFunc;
    } else if (value === "noopCallbackFunc") {
      constantValue = noopCallbackFunc;
    } else if (value === "trueFunc") {
      constantValue = trueFunc;
    } else if (value === "falseFunc") {
      constantValue = falseFunc;
    } else if (value === "throwFunc") {
      constantValue = throwFunc;
    } else if (value === "noopPromiseResolve") {
      constantValue = noopPromiseResolve;
    } else if (value === "noopPromiseReject") {
      constantValue = noopPromiseReject;
    } else if (/^\d+$/.test(value)) {
      constantValue = parseFloat(value);
      if (nativeIsNaN(constantValue)) {
        return;
      }
      if (Math.abs(constantValue) > 32767) {
        return;
      }
    } else if (value === "-1") {
      constantValue = -1;
    } else if (value === "") {
      constantValue = "";
    } else if (value === "yes") {
      constantValue = "yes";
    } else if (value === "no") {
      constantValue = "no";
    } else {
      return;
    }
    var valueWrapperNames = [ "asFunction", "asCallback", "asResolved", "asRejected" ];
    if (valueWrapperNames.includes(valueWrapper)) {
      var valueWrappersMap = {
        asFunction(v) {
          return function() {
            return v;
          };
        },
        asCallback(v) {
          return function() {
            return function() {
              return v;
            };
          };
        },
        asResolved(v) {
          return Promise.resolve(v);
        },
        asRejected(v) {
          return Promise.reject(v);
        }
      };
      constantValue = valueWrappersMap[valueWrapper](constantValue);
    }
    var canceled = false;
    var mustCancel = function mustCancel(value) {
      if (canceled) {
        return canceled;
      }
      canceled = value !== undefined && constantValue !== undefined && typeof value !== typeof constantValue && value !== null;
      return canceled;
    };
    var trapProp = function trapProp(base, prop, configurable, handler) {
      if (!handler.init(base[prop])) {
        return false;
      }
      var origDescriptor = Object.getOwnPropertyDescriptor(base, prop);
      var prevSetter;
      if (origDescriptor instanceof Object) {
        if (!origDescriptor.configurable) {
          var message = `Property '${prop}' is not configurable`;
          logMessage(source, message);
          return false;
        }
        if (base[prop]) {
          base[prop] = constantValue;
        }
        if (origDescriptor.set instanceof Function) {
          prevSetter = origDescriptor.set;
        }
      }
      Object.defineProperty(base, prop, {
        configurable: configurable,
        get() {
          return handler.get();
        },
        set(a) {
          if (prevSetter !== undefined) {
            prevSetter(a);
          }
          if (a instanceof Object) {
            var propertiesToCheck = property.split(".").slice(1);
            if (setProxyTrap && !isProxyTrapSet) {
              isProxyTrapSet = true;
              a = new Proxy(a, {
                get: function get(target, propertyKey, val) {
                  propertiesToCheck.reduce((function(object, currentProp, index, array) {
                    var currentObj = object === null || object === void 0 ? void 0 : object[currentProp];
                    if (index === array.length - 1 && currentObj !== constantValue) {
                      object[currentProp] = constantValue;
                    }
                    return currentObj || object;
                  }), target);
                  return Reflect.get(target, propertyKey, val);
                }
              });
            }
          }
          handler.set(a);
        }
      });
      return true;
    };
    var setChainPropAccess = createSetChainPropAccessor({
      source: source,
      stack: stack,
      mustCancel: mustCancel,
      trapProp: trapProp,
      getConstantValue: function getConstantValue() {
        return constantValue;
      },
      setConstantValue: function setConstantValue(v) {
        constantValue = v;
      }
    });
    setChainPropAccess(window, property);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function createSetChainPropAccessor(t) {
    var {source: e, stack: r, mustCancel: i, trapProp: n, getConstantValue: a, setConstantValue: s} = t, _setChainPropAccess2 = function _setChainPropAccess(t, c) {
      var o = getPropertyInChain(t, c), {base: u, prop: d, chain: f} = o, h = {
        factValue: void 0,
        init(t) {
          return this.factValue = t, true;
        },
        get() {
          return this.factValue;
        },
        set(t) {
          this.factValue !== t && (this.factValue = t, t instanceof Object && _setChainPropAccess2(t, f));
        }
      }, l = {
        factValue: void 0,
        descriptorAddon: getDescriptorAddon(),
        init(t) {
          return !i(t) && (this.factValue = t, true);
        },
        get() {
          if (!r) return hit(e), a();
          if (!this.descriptorAddon.isAbortingSuspended) {
            this.descriptorAddon.isAbortingSuspended = true;
            var t = false;
            try {
              t = matchStackTrace(r, (new Error).stack || "");
            } catch (t) {
              return this.descriptorAddon.isAbortingSuspended = false, this.factValue;
            }
            if (this.descriptorAddon.isAbortingSuspended = false, t) return hit(e), a();
          }
          return this.factValue;
        },
        set(t) {
          i(t) ? s(t) : this.factValue = t;
        }
      };
      if (f) {
        if (void 0 === u || null !== u[d]) {
          (u instanceof Object || "object" == typeof u) && isEmptyObject(u) && n(u, d, true, h);
          var p = t[d];
          (p instanceof Object || "object" == typeof p && null !== p) && _setChainPropAccess2(p, f), 
          n(u, d, true, h);
        } else n(u, d, true, h);
      } else n(u, d, false, l);
    };
    return _setChainPropAccess2;
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopFunc() {}
  function noopCallbackFunc() {
    return noopFunc;
  }
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getDescriptorAddon() {
    return {
      isAbortingSuspended: false,
      isolateCallback(r) {
        this.isAbortingSuspended = true;
        try {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), t = 1; t < e; t++) n[t - 1] = arguments[t];
          var i = r(...n);
          return this.isAbortingSuspended = !1, i;
        } catch (r) {
          var s = randomId();
          throw this.isAbortingSuspended = false, new ReferenceError(s);
        }
      }
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setConstant.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedReplaceArgument":function trustedReplaceArgument(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceArgument(source, methodPath, argumentIndex, argumentValue, pattern) {
    var stack = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    var verbose = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "false";
    if ((!methodPath || !argumentIndex || !argumentValue) && verbose === "false" || !methodPath && verbose === "true") {
      return;
    }
    var SHOULD_LOG_ONLY = verbose === "true" && !argumentIndex && !argumentValue && !pattern && !stack;
    var MARKERS = {
      JSON: "json:",
      REPLACE: "replace:"
    };
    var constantValue;
    var replaceRegexValue = "";
    var shouldReplaceArgument = false;
    if (argumentValue.startsWith(MARKERS.REPLACE)) {
      var replacementRegexPair = extractRegexAndReplacement(argumentValue);
      if (!replacementRegexPair) {
        logMessage(source, `Invalid argument value format: ${argumentValue}`);
        return;
      }
      replaceRegexValue = replacementRegexPair.regexPart;
      constantValue = replacementRegexPair.replacementPart;
      shouldReplaceArgument = true;
    } else if (argumentValue.startsWith(MARKERS.JSON)) {
      try {
        constantValue = JSON.parse(argumentValue.slice(MARKERS.JSON.length));
      } catch (error) {
        logMessage(source, `Invalid JSON argument value: ${argumentValue}`);
        return;
      }
    } else {
      var emptyArr = noopArray();
      var emptyObj = noopObject();
      if (argumentValue === "undefined") {
        constantValue = undefined;
      } else if (argumentValue === "false") {
        constantValue = false;
      } else if (argumentValue === "true") {
        constantValue = true;
      } else if (argumentValue === "null") {
        constantValue = null;
      } else if (argumentValue === "emptyArr") {
        constantValue = emptyArr;
      } else if (argumentValue === "emptyObj") {
        constantValue = emptyObj;
      } else if (argumentValue === "noopFunc") {
        constantValue = noopFunc;
      } else if (argumentValue === "noopCallbackFunc") {
        constantValue = noopCallbackFunc;
      } else if (argumentValue === "trueFunc") {
        constantValue = trueFunc;
      } else if (argumentValue === "falseFunc") {
        constantValue = falseFunc;
      } else if (argumentValue === "throwFunc") {
        constantValue = throwFunc;
      } else if (argumentValue === "noopPromiseResolve") {
        constantValue = noopPromiseResolve;
      } else if (argumentValue === "noopPromiseReject") {
        constantValue = noopPromiseReject;
      } else if (/^-?\d+$/.test(argumentValue)) {
        constantValue = parseFloat(argumentValue);
        if (nativeIsNaN(constantValue)) {
          return;
        }
      } else {
        constantValue = argumentValue;
      }
    }
    var getPathParts = getPropertyInChain;
    var {base: base, chain: chain, prop: prop} = getPathParts(window, methodPath);
    if (typeof chain !== "undefined") {
      logMessage(source, `Could not reach the end of the prop chain: ${methodPath}`);
      return;
    }
    var nativeMethod = base[prop];
    if (!nativeMethod || typeof nativeMethod !== "function") {
      logMessage(source, `Could not retrieve the method: ${methodPath}`);
      return;
    }
    var stringifyObject = function stringifyObject(obj) {
      return JSON.stringify(obj, (function(key, value) {
        return typeof value === "function" ? value.toString() : value;
      }));
    };
    var createFormattedMessage = function createFormattedMessage(args) {
      var when = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "original";
      var formattedArgs = args.map((function(arg, index) {
        if (typeof arg === "object" && arg !== null) {
          try {
            return `${index}: ${stringifyObject(arg)} // Object converted to string`;
          } catch (e) {
            return `${index}: ${String(arg)} // Object conversion failed`;
          }
        }
        return `${index}: ${String(arg)}`;
      }));
      var modifiedOrOriginal = when === "modified" ? "modified" : when;
      var message = `${methodPath} ${modifiedOrOriginal} arguments:\n${formattedArgs.join(",\n")}`;
      return message;
    };
    var checkArgument = function checkArgument(arg) {
      if (stack && !matchStackTrace(stack, (new Error).stack || "")) {
        return false;
      }
      if (pattern) {
        if (typeof arg === "object" && arg !== null) {
          try {
            var argString = stringifyObject(arg);
            return !!argString && toRegExp(pattern).test(argString);
          } catch (error) {
            logMessage(source, `Failed to stringify argument: ${arg}\nError: ${error}`);
          }
        }
        var argumentContent = String(arg);
        return !!argumentContent && toRegExp(pattern).test(argumentContent);
      }
      return true;
    };
    var replaceTargetArgument = function replaceTargetArgument(argumentsList) {
      var argumentToReplace = argumentsList[Number(argumentIndex)];
      if (shouldReplaceArgument) {
        var argumentString = String(argumentToReplace);
        var replacedArgument = argumentString.replace(replaceRegexValue, constantValue);
        if (replacedArgument !== argumentString) {
          argumentsList[Number(argumentIndex)] = replacedArgument;
        }
      } else {
        argumentsList[Number(argumentIndex)] = constantValue;
      }
    };
    var isMatchingSuspended = false;
    var applyWrapper = function applyWrapper(target, thisArg, argumentsList) {
      try {
        if (isMatchingSuspended) {
          return Reflect.apply(target, thisArg, argumentsList);
        }
        isMatchingSuspended = true;
        if (verbose === "true") {
          var formattedMessage = createFormattedMessage(argumentsList);
          logMessage(source, formattedMessage);
        }
        if (SHOULD_LOG_ONLY) {
          isMatchingSuspended = false;
          return Reflect.apply(target, thisArg, argumentsList);
        }
        var argumentToReplace = argumentsList[Number(argumentIndex)];
        var shouldSetArgument = checkArgument(argumentToReplace);
        if (!shouldSetArgument) {
          isMatchingSuspended = false;
          return Reflect.apply(target, thisArg, argumentsList);
        }
        replaceTargetArgument(argumentsList);
        if (verbose === "true") {
          var _formattedMessage = createFormattedMessage(argumentsList, "modified");
          logMessage(source, _formattedMessage);
        }
        hit(source);
        isMatchingSuspended = false;
        return Reflect.apply(target, thisArg, argumentsList);
      } catch (error) {
        isMatchingSuspended = false;
        logMessage(source, `Unexpected error during argument replacement: ${error.message}`);
        return Reflect.apply(target, thisArg, argumentsList);
      }
    };
    var constructWrapper = function constructWrapper(target, argumentsList, newTarget) {
      try {
        if (isMatchingSuspended) {
          return Reflect.construct(target, argumentsList, newTarget);
        }
        isMatchingSuspended = true;
        if (verbose === "true") {
          var formattedMessage = createFormattedMessage(argumentsList);
          logMessage(source, formattedMessage);
        }
        if (SHOULD_LOG_ONLY) {
          isMatchingSuspended = false;
          return Reflect.construct(target, argumentsList, newTarget);
        }
        var argumentToReplace = argumentsList[Number(argumentIndex)];
        var shouldSetArgument = checkArgument(argumentToReplace);
        if (!shouldSetArgument) {
          isMatchingSuspended = false;
          return Reflect.construct(target, argumentsList, newTarget);
        }
        replaceTargetArgument(argumentsList);
        if (verbose === "true") {
          var _formattedMessage2 = createFormattedMessage(argumentsList, "modified");
          logMessage(source, _formattedMessage2);
        }
        hit(source);
        isMatchingSuspended = false;
        return Reflect.construct(target, argumentsList, newTarget);
      } catch (error) {
        isMatchingSuspended = false;
        logMessage(source, `Unexpected error during argument replacement: ${error.message}`);
        return Reflect.construct(target, argumentsList, newTarget);
      }
    };
    var getWrapper = function getWrapper(target, propName, receiver) {
      if (propName === "toString") {
        return target.toString.bind(target);
      }
      return Reflect.get(target, propName, receiver);
    };
    var objectHandler = {
      apply: applyWrapper,
      construct: constructWrapper,
      get: getWrapper
    };
    base[prop] = new Proxy(nativeMethod, objectHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopCallbackFunc() {
    return noopFunc;
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function extractRegexAndReplacement(e) {
    if (e) {
      var r = e.slice(8), t = "";
      if (r.endsWith("/g") && (r = r.slice(0, -1), t = "g"), r.startsWith("/") && r.endsWith("/")) {
        for (var i = r.slice(1, -1), a = -1, c = 0; c < i.length; c += 1) if ("/" === i[c]) {
          for (var f = false, n = c - 1; n >= 0 && "\\" === i[n]; ) f = !f, n -= 1;
          if (!f) {
            a = c;
            break;
          }
        }
        if (-1 !== a) {
          var s = `/${i.slice(0, a)}/${t}`, l = i.slice(a + 1);
          if (s && "//" !== s) {
            var g;
            try {
              g = toRegExp(s);
            } catch (e) {
              return;
            }
            if (g) return {
              regexPart: g,
              replacementPart: l
            };
          }
        }
      }
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceArgument.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"abortOnStackTrace":function abortOnStackTrace(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnStackTrace(source, property, stack) {
    if (!property || !stack) {
      return;
    }
    var rid = randomId();
    var abort = function abort() {
      hit(source);
      throw new ReferenceError(rid);
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      if (!stack.match(/^(inlineScript|injectedScript)$/) && !isValidStrPattern(stack)) {
        logMessage(source, `Invalid parameter: ${stack}`);
        return;
      }
      var descriptorWrapper = Object.assign(getDescriptorAddon(), {
        value: base[prop],
        get() {
          if (!this.isAbortingSuspended && this.isolateCallback(matchStackTrace, stack, (new Error).stack)) {
            abort();
          }
          return this.value;
        },
        set(newValue) {
          if (!this.isAbortingSuspended && this.isolateCallback(matchStackTrace, stack, (new Error).stack)) {
            abort();
          }
          this.value = newValue;
        }
      });
      setPropertyAccess(base, prop, {
        get() {
          return descriptorWrapper.get.call(descriptorWrapper);
        },
        set(newValue) {
          descriptorWrapper.set.call(descriptorWrapper, newValue);
        }
      });
    };
    _setChainPropAccess(window, property);
    window.onerror = createOnErrorHandler(rid).bind();
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function setPropertyAccess(e, r, t) {
    var c = Object.getOwnPropertyDescriptor(e, r);
    return !(c && !c.configurable) && (Object.defineProperty(e, r, t), true);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getDescriptorAddon() {
    return {
      isAbortingSuspended: false,
      isolateCallback(r) {
        this.isAbortingSuspended = true;
        try {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), t = 1; t < e; t++) n[t - 1] = arguments[t];
          var i = r(...n);
          return this.isAbortingSuspended = !1, i;
        } catch (r) {
          var s = randomId();
          throw this.isAbortingSuspended = false, new ReferenceError(s);
        }
      }
    };
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function interceptChainProp(t, n, e, c) {
    var i;
    try {
      i = t[n];
    } catch (t) {
      i = void 0;
    }
    Object.defineProperty(t, n, {
      get: function get() {
        return i;
      },
      set: function set(t) {
        i = t, t instanceof Object && c(t, e);
      }
    });
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    abortOnStackTrace.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"abortCurrentInlineScript":function abortCurrentInlineScript(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortCurrentInlineScript(source, property, search) {
    var searchRegexp = toRegExp(search);
    var rid = randomId();
    var SRC_DATA_MARKER = "data:text/javascript;base64,";
    var getCurrentScript = function getCurrentScript() {
      if ("currentScript" in document) {
        return document.currentScript;
      }
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    };
    var ourScript = getCurrentScript();
    var abort = function abort() {
      var _scriptEl$src;
      var scriptEl = getCurrentScript();
      if (!scriptEl) {
        return;
      }
      var content = scriptEl.textContent;
      try {
        var textContentGetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").get;
        content = textContentGetter.call(scriptEl);
      } catch (e) {}
      if (content.length === 0 && typeof scriptEl.src !== "undefined" && (_scriptEl$src = scriptEl.src) !== null && _scriptEl$src !== void 0 && _scriptEl$src.startsWith(SRC_DATA_MARKER)) {
        var encodedContent = scriptEl.src.slice(SRC_DATA_MARKER.length);
        content = window.atob(encodedContent);
      }
      if (scriptEl instanceof HTMLScriptElement && content.length > 0 && scriptEl !== ourScript && searchRegexp.test(content)) {
        hit(source);
        throw new ReferenceError(rid);
      }
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (base instanceof Object === false && base === null) {
        var props = property.split(".");
        var propIndex = props.indexOf(prop);
        var baseName = props[propIndex - 1];
        var message = `The scriptlet had been executed before the ${baseName} was loaded.`;
        logMessage(source, message);
        return;
      }
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      var currentValue = base[prop];
      var origDescriptor = Object.getOwnPropertyDescriptor(base, prop);
      if (origDescriptor instanceof Object === false || origDescriptor.get instanceof Function === false) {
        currentValue = base[prop];
        origDescriptor = undefined;
      }
      var descriptorWrapper = Object.assign(getDescriptorAddon(), {
        currentValue: currentValue,
        get() {
          if (!this.isAbortingSuspended) {
            this.isolateCallback(abort);
          }
          if (origDescriptor instanceof Object) {
            return origDescriptor.get.call(base);
          }
          return this.currentValue;
        },
        set(newValue) {
          if (!this.isAbortingSuspended) {
            this.isolateCallback(abort);
          }
          if (origDescriptor instanceof Object) {
            origDescriptor.set.call(base, newValue);
          } else {
            this.currentValue = newValue;
          }
        }
      });
      setPropertyAccess(base, prop, {
        get() {
          return descriptorWrapper.get.call(descriptorWrapper);
        },
        set(newValue) {
          descriptorWrapper.set.call(descriptorWrapper, newValue);
        }
      });
    };
    _setChainPropAccess(window, property);
    window.onerror = createOnErrorHandler(rid).bind();
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function setPropertyAccess(e, r, t) {
    var c = Object.getOwnPropertyDescriptor(e, r);
    return !(c && !c.configurable) && (Object.defineProperty(e, r, t), true);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getDescriptorAddon() {
    return {
      isAbortingSuspended: false,
      isolateCallback(r) {
        this.isAbortingSuspended = true;
        try {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), t = 1; t < e; t++) n[t - 1] = arguments[t];
          var i = r(...n);
          return this.isAbortingSuspended = !1, i;
        } catch (r) {
          var s = randomId();
          throw this.isAbortingSuspended = false, new ReferenceError(s);
        }
      }
    };
  }
  function interceptChainProp(t, n, e, c) {
    var i;
    try {
      i = t[n];
    } catch (t) {
      i = void 0;
    }
    Object.defineProperty(t, n, {
      get: function get() {
        return i;
      },
      set: function set(t) {
        i = t, t instanceof Object && c(t, e);
      }
    });
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    abortCurrentInlineScript.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventFetch":function preventFetch(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventFetch(source, propsToMatch) {
    var responseBody = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "emptyObj";
    var responseConfig = arguments.length > 3 ? arguments[3] : undefined;
    if (typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var INVALID_RESPONSE_VALUE_MARKER = null;
    var getInvalidResponseConfigMessage = function getInvalidResponseConfigMessage(value) {
      return `Invalid responseConfig parameter: '${value}'`;
    };
    var nativeRequestClone = Request.prototype.clone;
    var strResponseBody;
    if (responseBody === "" || responseBody === "emptyObj") {
      strResponseBody = "{}";
    } else if (responseBody === "emptyArr") {
      strResponseBody = "[]";
    } else if (responseBody === "emptyStr") {
      strResponseBody = "";
    } else if (responseBody === "true" || responseBody.match(/^length:\d+(?:-\d+)?$/)) {
      strResponseBody = generateRandomResponse(responseBody);
    } else {
      logMessage(source, `Invalid responseBody parameter: '${responseBody}'`);
      return;
    }
    var parsedResponseConfig = parseResponseConfig(responseConfig, (function(invalidValue) {
      return logMessage(source, getInvalidResponseConfigMessage(invalidValue));
    }));
    if (parsedResponseConfig === INVALID_RESPONSE_VALUE_MARKER) {
      return;
    }
    var EXTENSION_SCHEMES = [ "chrome-extension:", "moz-extension:", "ms-browser-extension:", "safari-web-extension:" ];
    var isExtensionScheme = function isExtensionScheme(url) {
      return EXTENSION_SCHEMES.some((function(scheme) {
        return url.startsWith(scheme);
      }));
    };
    var getResponseType = function getResponseType(request) {
      try {
        var {mode: mode} = request;
        if (mode === undefined || mode === "cors" || mode === "no-cors") {
          var fetchURL = new URL(request.url);
          if (fetchURL.origin === document.location.origin) {
            return "basic";
          }
          return mode === "no-cors" ? "opaque" : "cors";
        }
      } catch (error) {
        logMessage(source, `Could not determine response type: ${error}`);
      }
      return undefined;
    };
    var handlerWrapper = async function handlerWrapper(target, thisArg, args) {
      var shouldPrevent = false;
      var fetchData = getFetchData(args, nativeRequestClone);
      if (typeof propsToMatch === "undefined") {
        logMessage(source, `fetch( ${objectToString(fetchData)} )`, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      shouldPrevent = matchRequestProps(source, propsToMatch, fetchData);
      if (shouldPrevent) {
        hit(source);
        var resolvedResponseConfig = {};
        try {
          resolvedResponseConfig = getResolvedResponseConfig(parsedResponseConfig, getResponseType(fetchData));
          var origResponse = await Reflect.apply(target, thisArg, args);
          if (!origResponse.ok || isExtensionScheme(origResponse.url)) {
            return createResponse({
              body: strResponseBody,
              ok: resolvedResponseConfig.ok,
              redirected: resolvedResponseConfig.redirected,
              requestUrl: fetchData.url,
              status: resolvedResponseConfig.status,
              statusText: resolvedResponseConfig.statusText,
              type: resolvedResponseConfig.type
            });
          }
          return modifyResponse(origResponse, {
            body: strResponseBody,
            ok: resolvedResponseConfig.ok,
            redirected: resolvedResponseConfig.redirected,
            status: resolvedResponseConfig.status,
            statusText: resolvedResponseConfig.statusText,
            type: resolvedResponseConfig.type
          });
        } catch (ex) {
          return createResponse({
            body: strResponseBody,
            ok: resolvedResponseConfig.ok,
            redirected: resolvedResponseConfig.redirected,
            requestUrl: fetchData.url,
            status: resolvedResponseConfig.status,
            statusText: resolvedResponseConfig.statusText,
            type: resolvedResponseConfig.type
          });
        }
      }
      return Reflect.apply(target, thisArg, args);
    };
    var fetchHandler = {
      apply: handlerWrapper
    };
    fetch = new Proxy(fetch, fetchHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function getFetchData(e, t) {
    var a, c, n = {}, r = e[0];
    if (r instanceof Request) {
      var u = t.call(r), f = getRequestData(u);
      a = f.url, c = f;
    } else a = r, c = e[1];
    (n.url = a, c instanceof Object) && Object.keys(c).forEach((function(e) {
      n[e] = c[e];
    }));
    return n;
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function createResponse() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
      body: "{}"
    }, t = void 0 === e.body ? "{}" : e.body, s = getFilteredResponseDefaults(e.type), o = void 0 === s.body ? t : s.body, d = e.status;
    void 0 === d && (d = void 0 === s.status ? 200 : s.status);
    var r = e.statusText;
    void 0 === r && (r = void 0 === s.statusText ? "OK" : s.statusText);
    var a = e.ok;
    void 0 === a && (a = void 0 === e.status && void 0 === s.ok || isSuccessResponseStatus(d));
    var i = void 0 !== e.redirected && e.redirected, n = void 0 === e.type ? "basic" : e.type, u = s.url;
    void 0 === u && (u = void 0 === e.requestUrl ? "" : e.requestUrl);
    var v = void 0 !== s.body, y = e.headers;
    v ? y = {} : void 0 === y && (y = {
      "Content-Length": null === t ? "0" : String((new TextEncoder).encode(t).length)
    });
    var l = getSafeResponseStatus(d), p = new Response(o, {
      headers: y,
      status: l < 200 ? 200 : l,
      statusText: r
    });
    return defineReadonlyResponseProps(p, {
      body: o,
      ok: a,
      redirected: i,
      status: d,
      statusText: r,
      type: n,
      url: u
    }), p;
  }
  function copyResponseHeaders(n) {
    var e = {};
    return null == n || n.forEach((function(n, o) {
      e[o] = n;
    })), e;
  }
  function defineReadonlyResponseProps(e, t) {
    var u = {};
    void 0 !== t.body && null === t.body && null !== e.body && (u.body = {
      value: null
    }), void 0 !== t.status && e.status !== t.status && (u.status = {
      value: t.status
    }), void 0 !== t.statusText && e.statusText !== t.statusText && (u.statusText = {
      value: t.statusText
    }), void 0 !== t.url && e.url !== t.url && (u.url = {
      value: t.url
    }), void 0 !== t.type && e.type !== t.type && (u.type = {
      value: t.type
    }), void 0 !== t.ok && e.ok !== t.ok && (u.ok = {
      value: t.ok
    }), void 0 !== t.redirected && e.redirected !== t.redirected && (u.redirected = {
      value: t.redirected
    }), Object.keys(u).length > 0 && Object.defineProperties(e, u);
  }
  function getFilteredResponseDefaults(e) {
    return "opaque" !== e && "error" !== e && "opaqueredirect" !== e ? {} : {
      body: null,
      ok: false,
      status: 0,
      statusText: "",
      url: ""
    };
  }
  function getResolvedResponseConfig(e, n) {
    var o = {};
    return void 0 !== n && (o.type = n), null == e ? o : Object.assign(o, e);
  }
  function getSafeResponseStatus(e) {
    return "number" == typeof e && e >= 0 && e <= 599 ? e : 200;
  }
  function isSuccessResponseStatus(s) {
    return s >= 200 && s <= 299;
  }
  function isValidResponseStatus(e) {
    return "number" == typeof e && Number.isFinite(e) && Math.floor(e) === e && e >= 0 && e <= 599;
  }
  function modifyResponse(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
      body: "{}"
    }, s = void 0 === t.body ? "{}" : t.body, o = void 0 === t.type ? e.type : t.type, d = getFilteredResponseDefaults(o), a = void 0 === d.body ? s : d.body, i = t.status;
    void 0 === i && (i = void 0 === d.status ? e.status : d.status);
    var r = t.statusText;
    void 0 === r && (r = void 0 === d.statusText ? e.statusText : d.statusText);
    var u = t.ok;
    void 0 === u && (u = void 0 === t.status && void 0 === d.ok ? e.ok : isSuccessResponseStatus(i));
    var v = void 0 === t.redirected ? e.redirected : t.redirected, n = d.url;
    void 0 === n && (n = e.url);
    var y = void 0 !== d.body ? {} : copyResponseHeaders(null == e ? void 0 : e.headers), p = getSafeResponseStatus(i), l = new Response(a, {
      status: p < 200 ? 200 : p,
      statusText: r,
      headers: y
    });
    return defineReadonlyResponseProps(l, {
      body: a,
      ok: u,
      redirected: v,
      status: i,
      statusText: r,
      type: o,
      url: n
    }), l;
  }
  function parseResponseConfig(e, t) {
    var reportInvalid = function reportInvalid() {
      return "function" == typeof t && t(e), null;
    }, r = new Set([ "basic", "cors", "error", "opaque", "opaqueredirect" ]), n = new Set([ "", "OK", "Continue", "Not Found" ]);
    if (void 0 !== e) {
      if (r.has(e)) return {
        type: e
      };
      var s, i = e.trim();
      if (!i.startsWith("{") || !i.endsWith("}")) return reportInvalid();
      try {
        s = JSON.parse(i);
      } catch (e) {
        return reportInvalid();
      }
      if (!s || Array.isArray(s) || "object" != typeof s) return reportInvalid();
      for (var o = {}, a = Object.keys(s), f = 0; f < a.length; f += 1) {
        var u = a[f], p = s[u];
        if ("ok" !== u && "redirected" !== u || "boolean" != typeof p) {
          if ("status" === u && isValidResponseStatus(p)) o[u] = p; else if ("statusText" === u && "string" == typeof p && n.has(p)) o[u] = p; else {
            if ("type" !== u || "string" != typeof p || !r.has(p)) return reportInvalid();
            o[u] = p;
          }
        } else o[u] = p;
      }
      return o;
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getRequestData(t) {
    var e = getRequestProps().map((function(e) {
      return [ e, t[e] ];
    }));
    return Object.fromEntries(e);
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function generateRandomResponse(e) {
    return generateResponseContent(e, false);
  }
  function generateResponseContent(r, t) {
    if (!r) return "";
    if ("true" === r) return Math.random().toString(36).slice(2).padEnd(10, "0").slice(0, 10);
    if ("emptyObj" === r) return "{}";
    if ("emptyArr" === r) return "[]";
    if ("emptyStr" === r) return "";
    if (r.startsWith("war:") || r.startsWith("join:")) return "";
    for (var e, n = /length:(\d+)(?:-(\d+))?/g, i = null; null !== (e = n.exec(r)); ) i = e;
    if (i) {
      var u = getNumberFromString(i[1]), l = i[2] ? getNumberFromString(i[2]) : u;
      if (null === u || null === l || !nativeIsFinite(u) || !nativeIsFinite(l)) return null;
      var a = u, f = l;
      if (a > f) {
        var g = a;
        a = f, f = g;
      }
      if (f > 5e5) return null;
      var o = getRandomIntInclusive(a, f), s = r.replace(/length:\d+(?:-\d+)?/g, "").trim();
      if (s) {
        return "";
      }
      return getRandomStrByLength(o);
    }
    return t ? r : "";
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function getRandomIntInclusive(t, n) {
    return t = Math.ceil(t), n = Math.floor(n), Math.floor(Math.random() * (n - t + 1) + t);
  }
  function getRandomStrByLength(r) {
    for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=~", n = [], o = 0; o < r; o += 1) n.push(t.charAt(Math.floor(76 * Math.random())));
    return n.join("");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventFetch.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventElementSrcLoading":function preventElementSrcLoading(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventElementSrcLoading(source, tagName, match) {
    if (typeof Proxy === "undefined" || typeof Reflect === "undefined") {
      return;
    }
    var srcMockData = {
      script: "data:text/javascript;base64,KCk9Pnt9",
      img: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
      iframe: "data:text/html;base64, PGRpdj48L2Rpdj4=",
      link: "data:text/plain;base64,"
    };
    var instance;
    if (tagName === "script") {
      instance = HTMLScriptElement;
    } else if (tagName === "img") {
      instance = HTMLImageElement;
    } else if (tagName === "iframe") {
      instance = HTMLIFrameElement;
    } else if (tagName === "link") {
      instance = HTMLLinkElement;
    } else {
      return;
    }
    var policy = getTrustedTypesApi(source);
    var SOURCE_PROPERTY_NAME = tagName === "link" ? "href" : "src";
    var ONERROR_PROPERTY_NAME = "onerror";
    var searchRegexp = toRegExp(match);
    var setMatchedAttribute = function setMatchedAttribute(elem) {
      return elem.setAttribute(source.name, "matched");
    };
    var setAttributeWrapper = function setAttributeWrapper(target, thisArg, args) {
      if (!args[0] || !args[1]) {
        return Reflect.apply(target, thisArg, args);
      }
      var nodeName = thisArg.nodeName.toLowerCase();
      var attrName = args[0].toLowerCase();
      var attrValue = args[1];
      var isMatched = attrName === SOURCE_PROPERTY_NAME && tagName.toLowerCase() === nodeName && srcMockData[nodeName] && searchRegexp.test(attrValue);
      if (!isMatched) {
        return Reflect.apply(target, thisArg, args);
      }
      hit(source);
      setMatchedAttribute(thisArg);
      return Reflect.apply(target, thisArg, [ attrName, srcMockData[nodeName] ]);
    };
    var setAttributeHandler = {
      apply: setAttributeWrapper
    };
    instance.prototype.setAttribute = new Proxy(Element.prototype.setAttribute, setAttributeHandler);
    var origSrcDescriptor = safeGetDescriptor(instance.prototype, SOURCE_PROPERTY_NAME);
    if (!origSrcDescriptor) {
      return;
    }
    Object.defineProperty(instance.prototype, SOURCE_PROPERTY_NAME, {
      enumerable: true,
      configurable: true,
      get() {
        return origSrcDescriptor.get.call(this);
      },
      set(urlValue) {
        var nodeName = this.nodeName.toLowerCase();
        var isMatched = tagName.toLowerCase() === nodeName && srcMockData[nodeName] && searchRegexp.test(urlValue);
        if (!isMatched) {
          origSrcDescriptor.set.call(this, urlValue);
          return true;
        }
        var mockData = srcMockData[nodeName];
        if (typeof TrustedScriptURL !== "undefined" && policy !== null && policy !== void 0 && policy.isSupported && urlValue instanceof TrustedScriptURL) {
          mockData = policy.createScriptURL(mockData);
        }
        setMatchedAttribute(this);
        origSrcDescriptor.set.call(this, mockData);
        hit(source);
      }
    });
    var origOnerrorDescriptor = safeGetDescriptor(HTMLElement.prototype, ONERROR_PROPERTY_NAME);
    if (!origOnerrorDescriptor) {
      return;
    }
    Object.defineProperty(HTMLElement.prototype, ONERROR_PROPERTY_NAME, {
      enumerable: true,
      configurable: true,
      get() {
        return origOnerrorDescriptor.get.call(this);
      },
      set(cb) {
        var isMatched = this.getAttribute(source.name) === "matched";
        if (!isMatched) {
          origOnerrorDescriptor.set.call(this, cb);
          return true;
        }
        origOnerrorDescriptor.set.call(this, noopFunc);
        return true;
      }
    });
    var addEventListenerWrapper = function addEventListenerWrapper(target, thisArg, args) {
      if (!args[0] || !args[1] || !thisArg) {
        return Reflect.apply(target, thisArg, args);
      }
      var eventName = args[0];
      var isMatched = typeof thisArg.getAttribute === "function" && thisArg.getAttribute(source.name) === "matched" && eventName === "error";
      if (isMatched) {
        return Reflect.apply(target, thisArg, [ eventName, noopFunc ]);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var addEventListenerHandler = {
      apply: addEventListenerWrapper
    };
    EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, addEventListenerHandler);
    var preventInlineOnerror = function preventInlineOnerror(tagName, src) {
      window.addEventListener("error", (function(event) {
        if (!event.target || !event.target.nodeName || event.target.nodeName.toLowerCase() !== tagName || !event.target.src || !src.test(event.target.src)) {
          return;
        }
        hit(source);
        if (typeof event.target.onload === "function") {
          event.target.onerror = event.target.onload;
          return;
        }
        event.target.onerror = noopFunc;
      }), true);
    };
    preventInlineOnerror(tagName, searchRegexp);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function safeGetDescriptor(r, e) {
    var t = Object.getOwnPropertyDescriptor(r, e);
    return t && t.configurable ? t : null;
  }
  function noopFunc() {}
  function getTrustedTypesApi(t) {
    var r, e = null == t || null === (r = t.api) || void 0 === r ? void 0 : r.policy;
    if (e) return e;
    var n = "AGPolicy", i = window.trustedTypes, u = !!i, c = {
      HTML: "TrustedHTML",
      Script: "TrustedScript",
      ScriptURL: "TrustedScriptURL"
    };
    if (!u) return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      },
      create: function create(t, r) {
        return r;
      },
      getAttributeType: function getAttributeType() {
        return null;
      },
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e) {
        return e;
      },
      getPropertyType: function getPropertyType() {
        return null;
      },
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e) {
        return e;
      },
      isHTML: function isHTML() {
        return false;
      },
      isScript: function isScript() {
        return false;
      },
      isScriptURL: function isScriptURL() {
        return false;
      }
    };
    var o = i.createPolicy(n, {
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      }
    }), createHTML = function createHTML(t) {
      return o.createHTML(t);
    }, createScript = function createScript(t) {
      return o.createScript(t);
    }, createScriptURL = function createScriptURL(t) {
      return o.createScriptURL(t);
    }, create = function create(t, r) {
      switch (t) {
       case c.HTML:
        return createHTML(r);

       case c.Script:
        return createScript(r);

       case c.ScriptURL:
        return createScriptURL(r);

       default:
        return r;
      }
    }, p = i.getAttributeType.bind(i), T = i.getPropertyType.bind(i), s = i.isHTML.bind(i), a = i.isScript.bind(i), f = i.isScriptURL.bind(i);
    return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: createHTML,
      createScript: createScript,
      createScriptURL: createScriptURL,
      create: create,
      getAttributeType: p,
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e, n, i) {
        var u = p(t, r, n, i);
        return u ? create(u, e) : e;
      },
      getPropertyType: T,
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e, n) {
        var i = T(t, r, n);
        return i ? create(i, e) : e;
      },
      isHTML: s,
      isScript: a,
      isScriptURL: f
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventElementSrcLoading.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"spoofCSS":function spoofCSS(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function spoofCSS(source, selectors, cssPropertyName, cssPropertyValue) {
    if (!selectors) {
      return;
    }
    var uboAliases = [ "spoof-css.js", "ubo-spoof-css.js", "ubo-spoof-css" ];
    function convertToCamelCase(cssProperty) {
      if (!cssProperty.includes("-")) {
        return cssProperty;
      }
      var splittedProperty = cssProperty.split("-");
      var firstPart = splittedProperty[0];
      var secondPart = splittedProperty[1];
      return `${firstPart}${secondPart[0].toUpperCase()}${secondPart.slice(1)}`;
    }
    var shouldDebug = !!(cssPropertyName === "debug" && cssPropertyValue);
    var propToValueMap = new Map;
    if (uboAliases.includes(source.name)) {
      var {args: args} = source;
      var arrayOfProperties = [];
      var isDebug = args.at(-2);
      if (isDebug === "debug") {
        arrayOfProperties = args.slice(1, -2);
      } else {
        arrayOfProperties = args.slice(1);
      }
      for (var i = 0; i < arrayOfProperties.length; i += 2) {
        if (arrayOfProperties[i] === "") {
          break;
        }
        propToValueMap.set(convertToCamelCase(arrayOfProperties[i]), arrayOfProperties[i + 1]);
      }
    } else if (cssPropertyName && cssPropertyValue && !shouldDebug) {
      propToValueMap.set(convertToCamelCase(cssPropertyName), cssPropertyValue);
    }
    var spoofStyle = function spoofStyle(cssProperty, realCssValue) {
      return propToValueMap.has(cssProperty) ? propToValueMap.get(cssProperty) : realCssValue;
    };
    var cloakFunc = function cloakFunc(fn, thisArg, fnName) {
      var cloakedToString = function cloakedToString() {
        return `function ${fnName}() { [native code] }`;
      };
      var toStringOfToString = function toStringOfToString() {
        return "function toString() { [native code] }";
      };
      toStringOfToString.toString = toStringOfToString;
      cloakedToString.toString = toStringOfToString;
      var bound = fn.bind(thisArg);
      Object.defineProperty(bound, "name", {
        value: fnName
      });
      Object.defineProperty(bound, "toString", {
        value: cloakedToString
      });
      return bound;
    };
    var setRectValue = function setRectValue(rect, prop, value) {
      Object.defineProperty(rect, prop, {
        value: parseFloat(value)
      });
    };
    var cloakedToStringFactory = function cloakedToStringFactory(fnName) {
      var toString = function toString() {
        return `function ${fnName}() { [native code] }`;
      };
      var toStringOfToString = function toString() {
        return "function toString() { [native code] }";
      };
      toStringOfToString.toString = toStringOfToString;
      toString.toString = toStringOfToString;
      return toString;
    };
    var propsToBindSet = new Set([ "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__" ]);
    var getter = function getter(target, prop, receiver) {
      hit(source);
      if (prop === "toString") {
        return cloakedToStringFactory(target.name || "getComputedStyle");
      }
      if (propsToBindSet.has(prop)) {
        var nativeFn = target[prop];
        if (typeof nativeFn === "function") {
          return nativeFn.bind(target);
        }
      }
      return Reflect.get(target, prop, receiver);
    };
    var getComputedStyleWrapper = function getComputedStyleWrapper(target, thisArg, args) {
      if (shouldDebug) {
        debugger;
      }
      var style = Reflect.apply(target, thisArg, args);
      if (!args[0].matches(selectors)) {
        return style;
      }
      var proxiedStyle = new Proxy(style, {
        get(target, prop) {
          var CSSStyleProp = target[prop];
          if (typeof CSSStyleProp !== "function") {
            return spoofStyle(prop, CSSStyleProp || "");
          }
          if (prop !== "getPropertyValue") {
            return cloakFunc(CSSStyleProp, target, prop);
          }
          var getPropertyValueWrapper = function getPropertyValue(cssPropName) {
            var cssValue = target[cssPropName] || "";
            return spoofStyle(cssPropName, cssValue);
          };
          return cloakFunc(getPropertyValueWrapper, target, "getPropertyValue");
        },
        getOwnPropertyDescriptor(target, prop) {
          if (propToValueMap.has(prop)) {
            return {
              configurable: true,
              enumerable: true,
              value: propToValueMap.get(prop),
              writable: true
            };
          }
          return Reflect.getOwnPropertyDescriptor(target, prop);
        }
      });
      hit(source);
      return proxiedStyle;
    };
    var getComputedStyleHandler = {
      apply: getComputedStyleWrapper,
      get: getter
    };
    window.getComputedStyle = new Proxy(window.getComputedStyle, getComputedStyleHandler);
    var getBoundingClientRectWrapper = function getBoundingClientRectWrapper(target, thisArg, args) {
      if (shouldDebug) {
        debugger;
      }
      var rect = Reflect.apply(target, thisArg, args);
      if (!thisArg.matches(selectors)) {
        return rect;
      }
      var {x: x, y: y, height: height, width: width} = rect;
      var newDOMRect = new window.DOMRect(x, y, width, height);
      if (propToValueMap.has("top")) {
        setRectValue(newDOMRect, "top", propToValueMap.get("top"));
      }
      if (propToValueMap.has("bottom")) {
        setRectValue(newDOMRect, "bottom", propToValueMap.get("bottom"));
      }
      if (propToValueMap.has("left")) {
        setRectValue(newDOMRect, "left", propToValueMap.get("left"));
      }
      if (propToValueMap.has("right")) {
        setRectValue(newDOMRect, "right", propToValueMap.get("right"));
      }
      if (propToValueMap.has("height")) {
        setRectValue(newDOMRect, "height", propToValueMap.get("height"));
      }
      if (propToValueMap.has("width")) {
        setRectValue(newDOMRect, "width", propToValueMap.get("width"));
      }
      hit(source);
      return newDOMRect;
    };
    var getBoundingClientRectHandler = {
      apply: getBoundingClientRectWrapper,
      get: getter
    };
    window.Element.prototype.getBoundingClientRect = new Proxy(window.Element.prototype.getBoundingClientRect, getBoundingClientRectHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    spoofCSS.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"GoogleTagServicesGpt":function GoogleTagServicesGpt(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function GoogleTagServicesGpt(source) {
    var slots = new Map;
    var slotsById = new Map;
    var slotsPerPath = new Map;
    var slotCreatives = new Map;
    var eventCallbacks = new Map;
    var gTargeting = new Map;
    var addEventListener = function addEventListener(name, listener) {
      if (!eventCallbacks.has(name)) {
        eventCallbacks.set(name, new Set);
      }
      eventCallbacks.get(name).add(listener);
      return this;
    };
    var removeEventListener = function removeEventListener(name, listener) {
      if (eventCallbacks.has(name)) {
        return eventCallbacks.get(name).delete(listener);
      }
      return false;
    };
    var fireSlotEvent = function fireSlotEvent(name, slot) {
      return new Promise((function(resolve) {
        requestAnimationFrame((function() {
          var size = [ 0, 0 ];
          var callbacksSet = eventCallbacks.get(name) || [];
          var callbackArray = Array.from(callbacksSet);
          for (var i = 0; i < callbackArray.length; i += 1) {
            callbackArray[i]({
              isEmpty: true,
              size: size,
              slot: slot
            });
          }
          resolve();
        }));
      }));
    };
    var emptySlotElement = function emptySlotElement(slot) {
      var node = document.getElementById(slot.getSlotElementId());
      while (node !== null && node !== void 0 && node.lastChild) {
        node.lastChild.remove();
      }
    };
    var recreateIframeForSlot = function recreateIframeForSlot(slot) {
      var _document$getElementB;
      var eid = `google_ads_iframe_${slot.getId()}`;
      (_document$getElementB = document.getElementById(eid)) === null || _document$getElementB === void 0 || _document$getElementB.remove();
      var node = document.getElementById(slot.getSlotElementId());
      if (node) {
        var f = document.createElement("iframe");
        f.id = eid;
        f.srcdoc = "<body></body>";
        f.style = "position:absolute; width:0; height:0; left:0; right:0; z-index:-1; border:0";
        f.setAttribute("width", 0);
        f.setAttribute("height", 0);
        f.setAttribute("data-load-complete", true);
        f.setAttribute("data-google-container-id", true);
        f.setAttribute("sandbox", "");
        node.appendChild(f);
      }
    };
    var displaySlot = function displaySlot(slot) {
      if (!slot) {
        return;
      }
      var id = slot.getSlotElementId();
      if (!document.getElementById(id)) {
        return;
      }
      var parent = document.getElementById(id);
      if (parent) {
        parent.appendChild(document.createElement("div"));
      }
      emptySlotElement(slot);
      recreateIframeForSlot(slot);
      fireSlotEvent("slotRenderEnded", slot);
      fireSlotEvent("slotRequested", slot);
      fireSlotEvent("slotResponseReceived", slot);
      fireSlotEvent("slotOnload", slot);
      fireSlotEvent("impressionViewable", slot);
    };
    var companionAdsService = {
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      enableSyncLoading: noopFunc,
      setRefreshUnfilledSlots: noopFunc,
      getSlots: noopArray
    };
    var contentService = {
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      setContent: noopFunc
    };
    function PassbackSlot() {}
    PassbackSlot.prototype.display = noopFunc;
    PassbackSlot.prototype.get = noopNull;
    PassbackSlot.prototype.set = noopThis;
    PassbackSlot.prototype.setClickUrl = noopThis;
    PassbackSlot.prototype.setTagForChildDirectedTreatment = noopThis;
    PassbackSlot.prototype.setTargeting = noopThis;
    PassbackSlot.prototype.updateTargetingFromMap = noopThis;
    function SizeMappingBuilder() {}
    SizeMappingBuilder.prototype.addSize = noopThis;
    SizeMappingBuilder.prototype.build = noopNull;
    var getTargetingValue = function getTargetingValue(v) {
      if (typeof v === "string") {
        return [ v ];
      }
      try {
        return Array.prototype.flat.call(v);
      } catch (_unused) {}
      return [];
    };
    var updateTargeting = function updateTargeting(targeting, map) {
      if (typeof map === "object") {
        for (var key in map) {
          if (Object.prototype.hasOwnProperty.call(map, key)) {
            targeting.set(key, getTargetingValue(map[key]));
          }
        }
      }
    };
    var defineSlot = function defineSlot(adUnitPath, creatives, optDiv) {
      if (slotsById.has(optDiv)) {
        var _document$getElementB2;
        (_document$getElementB2 = document.getElementById(optDiv)) === null || _document$getElementB2 === void 0 || _document$getElementB2.remove();
        return slotsById.get(optDiv);
      }
      var attributes = new Map;
      var targeting = new Map;
      var exclusions = new Set;
      var response = {
        advertiserId: undefined,
        campaignId: undefined,
        creativeId: undefined,
        creativeTemplateId: undefined,
        lineItemId: undefined
      };
      var sizes = [ {
        getHeight: function getHeight() {
          return 2;
        },
        getWidth: function getWidth() {
          return 2;
        }
      } ];
      var num = (slotsPerPath.get(adUnitPath) || 0) + 1;
      slotsPerPath.set(adUnitPath, num);
      var id = `${adUnitPath}_${num}`;
      var clickUrl = "";
      var collapseEmptyDiv = null;
      var services = new Set;
      var config = {};
      var slot = {
        addService(e) {
          services.add(e);
          return slot;
        },
        clearCategoryExclusions: noopThis,
        clearTargeting(k) {
          if (k === undefined) {
            targeting.clear();
          } else {
            targeting.delete(k);
          }
        },
        defineSizeMapping(mapping) {
          slotCreatives.set(optDiv, mapping);
          return this;
        },
        get: function get(k) {
          return attributes.get(k);
        },
        getAdUnitPath: function getAdUnitPath() {
          return adUnitPath;
        },
        getAttributeKeys: function getAttributeKeys() {
          return Array.from(attributes.keys());
        },
        getCategoryExclusions: function getCategoryExclusions() {
          return Array.from(exclusions);
        },
        getClickUrl: function getClickUrl() {
          return clickUrl;
        },
        getCollapseEmptyDiv: function getCollapseEmptyDiv() {
          return collapseEmptyDiv;
        },
        getConfig: function getConfig(keys) {
          var configKeys = Array.isArray(keys) ? keys : [ keys ];
          var googleTagServicesConfig = {};
          for (var i = 0; i < configKeys.length; i += 1) {
            var key = configKeys[i];
            if (key === "clickUrl") {
              googleTagServicesConfig[key] = clickUrl;
            } else if (key === "targeting") {
              googleTagServicesConfig[key] = targeting;
            } else {
              googleTagServicesConfig[key] = config[key];
            }
          }
          return Object.freeze(googleTagServicesConfig);
        },
        getContentUrl: function getContentUrl() {
          return "";
        },
        getDivStartsCollapsed: function getDivStartsCollapsed() {
          return null;
        },
        getDomId: function getDomId() {
          return optDiv;
        },
        getEscapedQemQueryId: function getEscapedQemQueryId() {
          return "";
        },
        getFirstLook: function getFirstLook() {
          return 0;
        },
        getId: function getId() {
          return id;
        },
        getHtml: function getHtml() {
          return "";
        },
        getName: function getName() {
          return id;
        },
        getOutOfPage: function getOutOfPage() {
          return false;
        },
        getResponseInformation: function getResponseInformation() {
          return response;
        },
        getServices: function getServices() {
          return Array.from(services);
        },
        getSizes: function getSizes() {
          return sizes;
        },
        getSlotElementId: function getSlotElementId() {
          return optDiv;
        },
        getSlotId: function getSlotId() {
          return slot;
        },
        getTargeting: function getTargeting(k) {
          return targeting.get(k) || gTargeting.get(k) || [];
        },
        getTargetingKeys: function getTargetingKeys() {
          return Array.from(new Set(Array.of(...gTargeting.keys(), ...targeting.keys())));
        },
        getTargetingMap: function getTargetingMap() {
          return Object.assign(Object.fromEntries(gTargeting.entries()), Object.fromEntries(targeting.entries()));
        },
        set(k, v) {
          attributes.set(k, v);
          return slot;
        },
        setCategoryExclusion(e) {
          exclusions.add(e);
          return slot;
        },
        setClickUrl(u) {
          clickUrl = u;
          return slot;
        },
        setCollapseEmptyDiv(v) {
          collapseEmptyDiv = !!v;
          return slot;
        },
        setConfig(obj) {
          try {
            var entries = Object.entries(obj);
            for (var i = 0; i < entries.length; i += 1) {
              var entry = entries[i];
              var key = entry[0];
              var value = entry[1];
              if (key === "clickUrl") {
                clickUrl = value;
              } else if (key === "targeting") {
                updateTargeting(targeting, value);
              } else {
                config[key] = value;
              }
            }
          } catch (ex) {}
        },
        setSafeFrameConfig: noopThis,
        setTagForChildDirectedTreatment: noopThis,
        setTargeting(k, v) {
          targeting.set(k, getTargetingValue(v));
          return slot;
        },
        toString: function toString() {
          return id;
        },
        updateTargetingFromMap(map) {
          updateTargeting(targeting, map);
          return slot;
        }
      };
      slots.set(adUnitPath, slot);
      slotsById.set(optDiv, slot);
      slotCreatives.set(optDiv, creatives);
      return slot;
    };
    var initialLoadDisabled = false;
    var pubAdsService = {
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      clear: noopFunc,
      clearCategoryExclusions: noopThis,
      clearTagForChildDirectedTreatment: noopThis,
      clearTargeting(k) {
        if (k === undefined) {
          gTargeting.clear();
        } else {
          gTargeting.delete(k);
        }
      },
      collapseEmptyDivs: noopFunc,
      defineOutOfPagePassback() {
        return new PassbackSlot;
      },
      definePassback() {
        return new PassbackSlot;
      },
      disableInitialLoad() {
        initialLoadDisabled = true;
      },
      display: noopFunc,
      enableAsyncRendering: noopFunc,
      enableLazyLoad: noopFunc,
      enableSingleRequest: noopFunc,
      enableSyncRendering: noopFunc,
      enableVideoAds: noopFunc,
      get: noopNull,
      getAttributeKeys: noopArray,
      getTargeting: noopArray,
      getTargetingKeys: noopArray,
      getSlots: noopArray,
      isInitialLoadDisabled: function isInitialLoadDisabled() {
        return initialLoadDisabled;
      },
      refresh: noopFunc,
      set: noopThis,
      setCategoryExclusion: noopThis,
      setCentering: noopFunc,
      setCookieOptions: noopThis,
      setForceSafeFrame: noopThis,
      setLocation: noopThis,
      setPrivacySettings: noopThis,
      setPublisherProvidedId: noopThis,
      setRequestNonPersonalizedAds: noopThis,
      setSafeFrameConfig: noopThis,
      setTagForChildDirectedTreatment: noopThis,
      setTargeting: noopThis,
      setVideoContent: noopThis,
      updateCorrelator: noopFunc
    };
    var config = {};
    var {googletag: googletag = {}} = window;
    var {cmd: cmd = []} = googletag;
    googletag.apiReady = true;
    googletag.cmd = [];
    googletag.cmd.push = function(a) {
      try {
        a();
      } catch (ex) {}
      return 1;
    };
    googletag.companionAds = function() {
      return companionAdsService;
    };
    googletag.content = function() {
      return contentService;
    };
    googletag.defineOutOfPageSlot = defineSlot;
    googletag.defineSlot = defineSlot;
    googletag.destroySlots = function() {
      slots.clear();
      slotsById.clear();
    };
    googletag.disablePublisherConsole = noopFunc;
    googletag.display = function(arg) {
      var id;
      if (arg !== null && arg !== void 0 && arg.getSlotElementId) {
        id = arg.getSlotElementId();
      } else if (arg !== null && arg !== void 0 && arg.nodeType) {
        id = arg.id;
      } else {
        id = String(arg);
      }
      displaySlot(slotsById.get(id));
    };
    googletag.enableServices = noopFunc;
    googletag.getConfig = function(keys) {
      var configKeys = Array.isArray(keys) ? keys : [ keys ];
      var googleTagServicesConfig = {};
      for (var i = 0; i < configKeys.length; i += 1) {
        var key = configKeys[i];
        if (key === "disableInitialLoad") {
          googleTagServicesConfig[key] = initialLoadDisabled;
        } else if (key === "targeting") {
          googleTagServicesConfig[key] = gTargeting;
        } else {
          googleTagServicesConfig[key] = config[key];
        }
      }
      return Object.freeze(googleTagServicesConfig);
    };
    googletag.getVersion = noopStr;
    googletag.pubads = function() {
      return pubAdsService;
    };
    googletag.pubadsReady = true;
    googletag.setAdIframeTitle = noopFunc;
    googletag.setConfig = function(obj) {
      try {
        var entries = Object.entries(obj);
        for (var i = 0; i < entries.length; i += 1) {
          var entry = entries[i];
          var key = entry[0];
          var value = entry[1];
          if (key === "disableInitialLoad") {
            initialLoadDisabled = !!value;
          } else if (key === "targeting") {
            updateTargeting(gTargeting, value);
          } else {
            config[key] = value;
          }
        }
      } catch (ex) {}
    };
    googletag.sizeMapping = function() {
      return new SizeMappingBuilder;
    };
    window.googletag = googletag;
    while (cmd.length !== 0) {
      googletag.cmd.push(cmd.shift());
    }
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function noopThis() {
    return this;
  }
  function noopNull() {
    return null;
  }
  function noopArray() {
    return [];
  }
  function noopStr() {
    return "";
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    GoogleTagServicesGpt.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"abortOnPropertyWrite":function abortOnPropertyWrite(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnPropertyWrite(source, property) {
    if (!property) {
      return;
    }
    var rid = randomId();
    var abort = function abort() {
      hit(source);
      throw new ReferenceError(rid);
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      setPropertyAccess(base, prop, {
        set: abort
      });
    };
    _setChainPropAccess(window, property);
    window.onerror = createOnErrorHandler(rid).bind();
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function setPropertyAccess(e, r, t) {
    var c = Object.getOwnPropertyDescriptor(e, r);
    return !(c && !c.configurable) && (Object.defineProperty(e, r, t), true);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function interceptChainProp(t, n, e, c) {
    var i;
    try {
      i = t[n];
    } catch (t) {
      i = void 0;
    }
    Object.defineProperty(t, n, {
      get: function get() {
        return i;
      },
      set: function set(t) {
        i = t, t instanceof Object && c(t, e);
      }
    });
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    abortOnPropertyWrite.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetConstant":function trustedSetConstant(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetConstant(source, property, value, stack) {
    if (!property) {
      return;
    }
    var constantValue;
    try {
      constantValue = inferValue(value);
    } catch (e) {
      logMessage(source, e);
      return;
    }
    var canceled = false;
    var mustCancel = function mustCancel(value) {
      if (canceled) {
        return canceled;
      }
      canceled = value !== undefined && constantValue !== undefined && typeof value !== typeof constantValue && value !== null;
      return canceled;
    };
    var trapProp = function trapProp(base, prop, configurable, handler) {
      if (!handler.init(base[prop])) {
        return false;
      }
      var origDescriptor = Object.getOwnPropertyDescriptor(base, prop);
      var prevSetter;
      if (origDescriptor instanceof Object) {
        if (!origDescriptor.configurable) {
          var message = `Property '${prop}' is not configurable`;
          logMessage(source, message);
          return false;
        }
        base[prop] = constantValue;
        if (origDescriptor.set instanceof Function) {
          prevSetter = origDescriptor.set;
        }
      }
      Object.defineProperty(base, prop, {
        configurable: configurable,
        get() {
          return handler.get();
        },
        set(a) {
          if (prevSetter !== undefined) {
            prevSetter(a);
          }
          handler.set(a);
        }
      });
      return true;
    };
    var setChainPropAccess = createSetChainPropAccessor({
      source: source,
      stack: stack,
      mustCancel: mustCancel,
      trapProp: trapProp,
      getConstantValue: function getConstantValue() {
        return constantValue;
      },
      setConstantValue: function setConstantValue(v) {
        constantValue = v;
      }
    });
    setChainPropAccess(window, property);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function inferValue(r) {
    if ("undefined" !== r) {
      if ("false" === r) return false;
      if ("true" === r) return true;
      if ("null" === r) return null;
      if ("NaN" === r) return NaN;
      if (r.startsWith("/") && r.endsWith("/")) return toRegExp(r);
      var e = Number(r);
      if (!nativeIsNaN(e)) {
        if (Math.abs(e) > 32767) throw new Error("number values bigger than 32767 are not allowed");
        return e;
      }
      try {
        var t = JSON.parse(r);
        if (t instanceof Object || "string" == typeof t) return t;
      } catch (e) {
        return r;
      }
      return r;
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function createSetChainPropAccessor(t) {
    var {source: e, stack: r, mustCancel: i, trapProp: n, getConstantValue: a, setConstantValue: s} = t, _setChainPropAccess3 = function _setChainPropAccess(t, c) {
      var o = getPropertyInChain(t, c), {base: u, prop: d, chain: f} = o, h = {
        factValue: void 0,
        init(t) {
          return this.factValue = t, true;
        },
        get() {
          return this.factValue;
        },
        set(t) {
          this.factValue !== t && (this.factValue = t, t instanceof Object && _setChainPropAccess3(t, f));
        }
      }, l = {
        factValue: void 0,
        descriptorAddon: getDescriptorAddon(),
        init(t) {
          return !i(t) && (this.factValue = t, true);
        },
        get() {
          if (!r) return hit(e), a();
          if (!this.descriptorAddon.isAbortingSuspended) {
            this.descriptorAddon.isAbortingSuspended = true;
            var t = false;
            try {
              t = matchStackTrace(r, (new Error).stack || "");
            } catch (t) {
              return this.descriptorAddon.isAbortingSuspended = false, this.factValue;
            }
            if (this.descriptorAddon.isAbortingSuspended = false, t) return hit(e), a();
          }
          return this.factValue;
        },
        set(t) {
          i(t) ? s(t) : this.factValue = t;
        }
      };
      if (f) {
        if (void 0 === u || null !== u[d]) {
          (u instanceof Object || "object" == typeof u) && isEmptyObject(u) && n(u, d, true, h);
          var p = t[d];
          (p instanceof Object || "object" == typeof p && null !== p) && _setChainPropAccess3(p, f), 
          n(u, d, true, h);
        } else n(u, d, true, h);
      } else n(u, d, false, l);
    };
    return _setChainPropAccess3;
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function getDescriptorAddon() {
    return {
      isAbortingSuspended: false,
      isolateCallback(r) {
        this.isAbortingSuspended = true;
        try {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), t = 1; t < e; t++) n[t - 1] = arguments[t];
          var i = r(...n);
          return this.isAbortingSuspended = !1, i;
        } catch (r) {
          var s = randomId();
          throw this.isAbortingSuspended = false, new ReferenceError(s);
        }
      }
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetConstant.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventXHR":function preventXHR(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventXHR(source, propsToMatch, directive) {
    createPreventXhrCore(source, propsToMatch, false, directive);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function createPreventXhrCore(e, t, r, n) {
    if ("undefined" != typeof Proxy) {
      var a = window.XMLHttpRequest.prototype.open, s = window.XMLHttpRequest.prototype.getResponseHeader, o = window.XMLHttpRequest.prototype.getAllResponseHeaders, p = new Map, l = new Map, i = {
        apply: function apply(r, n, a) {
          var s = getXhrData.apply(null, a);
          if (void 0 === t ? (logMessage(e, `xhr( ${objectToString(s)} )`, true), hit(e)) : matchRequestProps(e, t, s) && ("function" == typeof n.onreadystatechange && (s.shouldFireFirstStage = true), 
          p.set(n, s)), p.has(n) && !l.has(n)) {
            l.set(n, []);
            var o = {
              apply: function apply(e, t, r) {
                var n = l.get(t);
                return n && n.push(r), Reflect.apply(e, t, r);
              }
            };
            n.setRequestHeader = new Proxy(n.setRequestHeader, o);
          }
          return Reflect.apply(r, n, a);
        }
      }, u = {
        apply: function apply(t, s, o) {
          if (!p.has(s)) return Reflect.apply(t, s, o);
          var i, u = p.get(s), d = s.responseType, v = "", f = "", y = true;
          if ("blob" === d) v = new Blob, y = false; else if ("arraybuffer" === d) v = new ArrayBuffer(0), 
          y = false; else if ("document" === d) v = (new DOMParser).parseFromString("", "text/html"), 
          i = v, y = false; else if ("json" === d) {
            var c = "{}";
            if (n) {
              var g = generateResponseContent(n);
              null !== g ? c = g : logMessage(e, `Invalid randomize parameter: '${n}'`);
            }
            y = false;
            try {
              v = JSON.parse(c);
            } catch (e) {
              v = null;
            }
          } else if (n) {
            var w = generateResponseContent(n);
            null !== w ? (v = w, f = w) : logMessage(e, `Invalid randomize parameter: '${n}'`);
          }
          var R = new XMLHttpRequest, transitionReadyState = function transitionReadyState(t) {
            if (2 === t) {
              var {responseURL: r} = R;
              Object.defineProperties(s, {
                responseURL: {
                  value: r || u.url,
                  writable: false
                }
              });
            }
            if (4 === t) {
              var {responseXML: n} = R, a = {
                readyState: {
                  value: 4,
                  writable: false
                },
                statusText: {
                  value: "OK",
                  writable: false
                },
                responseXML: {
                  value: void 0 !== i ? i : n,
                  writable: false
                },
                status: {
                  value: 200,
                  writable: false
                },
                response: {
                  value: v,
                  writable: false
                }
              };
              y && (a.responseText = {
                value: f,
                writable: false
              }), Object.defineProperties(s, a), hit(e);
            } else Object.defineProperty(s, "readyState", {
              value: t,
              writable: true,
              configurable: true
            });
            var o = new Event("readystatechange");
            s.dispatchEvent(o);
          };
          R.addEventListener("readystatechange", (function() {
            p.get(s).shouldFireFirstStage && transitionReadyState(1);
            var e = new ProgressEvent("loadstart");
            s.dispatchEvent(e), transitionReadyState(2), transitionReadyState(3);
            var t = new ProgressEvent("progress");
            s.dispatchEvent(t), transitionReadyState(4);
          })), setTimeout((function() {
            var e = new ProgressEvent("load");
            s.dispatchEvent(e);
            var t = new ProgressEvent("loadend");
            s.dispatchEvent(t);
          }), 1), a.apply(R, [ u.method, u.url ]), (l.get(s) || []).forEach((function(e) {
            var t = e[0], r = e[1];
            R.setRequestHeader(t, r);
          }));
        }
      }, d = {
        apply: function apply(e, t, r) {
          var n = l.get(t);
          if (!n) return s.apply(t, r);
          if (!n.length) return null;
          var a = r[0].toLowerCase(), o = n.find((function(e) {
            return e[0].toLowerCase() === a;
          }));
          return o ? o[1] : null;
        }
      }, v = {
        apply: function apply(e, t) {
          var r = l.get(t);
          return r ? r.length ? r.map((function(e) {
            var t = e[0], r = e[1];
            return `${t.toLowerCase()}: ${r}`;
          })).join("\r\n") : "" : o.call(t);
        }
      };
      XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, i), XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, u), 
      XMLHttpRequest.prototype.getResponseHeader = new Proxy(XMLHttpRequest.prototype.getResponseHeader, d), 
      XMLHttpRequest.prototype.getAllResponseHeaders = new Proxy(XMLHttpRequest.prototype.getAllResponseHeaders, v);
    }
  }
  function generateResponseContent(r, t) {
    if (!r) return "";
    if ("true" === r) return Math.random().toString(36).slice(2).padEnd(10, "0").slice(0, 10);
    if ("emptyObj" === r) return "{}";
    if ("emptyArr" === r) return "[]";
    if ("emptyStr" === r) return "";
    if (r.startsWith("war:") || r.startsWith("join:")) return "";
    for (var e, n = /length:(\d+)(?:-(\d+))?/g, i = null; null !== (e = n.exec(r)); ) i = e;
    if (i) {
      var u = getNumberFromString(i[1]), l = i[2] ? getNumberFromString(i[2]) : u;
      if (null === u || null === l || !nativeIsFinite(u) || !nativeIsFinite(l)) return null;
      var a = u, f = l;
      if (a > f) {
        var g = a;
        a = f, f = g;
      }
      if (f > 5e5) return null;
      var o = getRandomIntInclusive(a, f), s = r.replace(/length:\d+(?:-\d+)?/g, "").trim();
      if (s) {
        return "";
      }
      return getRandomStrByLength(o);
    }
    return "";
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function getRandomIntInclusive(t, n) {
    return t = Math.ceil(t), n = Math.floor(n), Math.floor(Math.random() * (n - t + 1) + t);
  }
  function getRandomStrByLength(r) {
    for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=~", n = [], o = 0; o < r; o += 1) n.push(t.charAt(Math.floor(76 * Math.random())));
    return n.join("");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventXHR.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventSetInterval":function preventSetInterval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventSetInterval(source, matchCallback, matchDelay) {
    var shouldLog = typeof matchCallback === "undefined" && typeof matchDelay === "undefined";
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      var callback = args[0];
      var delay = args[1];
      var shouldPrevent = false;
      if (shouldLog) {
        hit(source);
        logMessage(source, `setInterval(${callbackToString(callback)}, ${delay})`, true);
      } else {
        shouldPrevent = isPreventionNeeded({
          callback: callback,
          delay: delay,
          matchCallback: matchCallback,
          matchDelay: matchDelay
        });
      }
      if (shouldPrevent) {
        hit(source);
        args[0] = noopFunc;
      }
      return target.apply(thisArg, args);
    };
    var setIntervalHandler = {
      apply: handlerWrapper
    };
    window.setInterval = new Proxy(window.setInterval, setIntervalHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function isPreventionNeeded(a) {
    var {callback: e, delay: t, matchCallback: l, matchDelay: r} = a;
    if (!isValidCallback(e)) return false;
    if (!isValidMatchStr(l) || r && !isValidMatchNumber(r)) return false;
    var {isInvertedMatch: c, matchRegexp: i} = parseMatchArg(l), {isInvertedDelayMatch: n, delayMatch: s, delayMinMatch: d, delayMaxMatch: h, isDelayRange: M} = parseDelayArg(r), y = parseRawDelay(t), v = callbackToString(e);
    return M || null !== s ? l ? i.test(v) !== c && isPreventDelayMatched(M, d, h, s, n, y) : isPreventDelayMatched(M, d, h, s, n, y) : i.test(v) !== c;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function parseDelayArg(a) {
    var l = null == a ? void 0 : a.startsWith("!"), e = l ? a.slice(1) : a, n = e ? e.indexOf("-") : -1;
    if (-1 !== n) {
      var t = e.slice(0, n), i = e.slice(n + 1), s = "" === t ? null : parseFloat(t), M = "" === i ? null : parseFloat(i), u = "" === t || null !== s && !nativeIsNaN(s), c = "" === i || null !== M && !nativeIsNaN(M);
      return u && c && (null !== s || null !== M) ? {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: s,
        delayMaxMatch: M,
        isDelayRange: true
      } : {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: null,
        delayMaxMatch: null,
        isDelayRange: true
      };
    }
    var r = parseInt(e, 10);
    return {
      isInvertedDelayMatch: l,
      delayMatch: nativeIsNaN(r) ? null : r,
      delayMinMatch: null,
      delayMaxMatch: null,
      isDelayRange: false
    };
  }
  function isPreventDelayMatched(l, n, u, e, t, r) {
    return l ? (null !== n || null !== u) && "number" == typeof r && ((null === n || r >= n) && (null === u || r <= u)) !== t : null === e || r === e !== t;
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function isValidMatchNumber(a) {
    var e = a;
    null != a && a.startsWith("!") && (e = a.slice(1));
    var i = e.indexOf("-");
    if (-1 !== i) {
      var t = e.slice(0, i), s = e.slice(i + 1), n = "" === t || !nativeIsNaN(parseFloat(t)) && nativeIsFinite(parseFloat(t)), r = "" === s || !nativeIsNaN(parseFloat(s)) && nativeIsFinite(parseFloat(s));
      return !(!n || !r || "" === t && "" === s);
    }
    var l = parseFloat(e);
    return !nativeIsNaN(l) && nativeIsFinite(l);
  }
  function parseRawDelay(a) {
    var e = Math.floor(parseInt(a, 10));
    return "number" != typeof e || nativeIsNaN(e) ? a : e;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventSetInterval.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventEvalIf":function preventEvalIf(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventEvalIf(source, search) {
    var searchRegexp = toRegExp(search);
    var nativeEval = window.eval;
    window.eval = function(payload) {
      if (!searchRegexp.test(payload.toString())) {
        return nativeEval.call(window, payload);
      }
      hit(source);
      return undefined;
    }.bind(window);
    window.eval.toString = nativeEval.toString.bind(nativeEval);
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventEvalIf.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetCookie":function trustedSetCookie(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetCookie(source, name, value) {
    var offsetExpiresSec = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
    var domain = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    if (typeof name === "undefined") {
      logMessage(source, "Cookie name should be specified");
      return;
    }
    if (typeof value === "undefined") {
      logMessage(source, "Cookie value should be specified");
      return;
    }
    var parsedValue = parseKeywordValue(value);
    if (!isValidCookiePath(path)) {
      logMessage(source, `Invalid cookie path: '${path}'`);
      return;
    }
    if (!document.location.origin.includes(domain)) {
      logMessage(source, `Cookie domain not matched by origin: '${domain}'`);
      return;
    }
    var cookieToSet = serializeCookie(name, parsedValue, path, domain, false);
    if (!cookieToSet) {
      logMessage(source, "Invalid cookie name or value");
      return;
    }
    if (offsetExpiresSec) {
      var parsedOffsetMs = getTrustedCookieOffsetMs(offsetExpiresSec);
      if (!parsedOffsetMs) {
        logMessage(source, `Invalid offsetExpiresSec value: ${offsetExpiresSec}`);
        return;
      }
      var expires = Date.now() + parsedOffsetMs;
      cookieToSet += `; expires=${new Date(expires).toUTCString()}`;
    }
    document.cookie = cookieToSet;
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function serializeCookie(e, o, i) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", t = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
    if (!t && `${o}`.includes(";") || e.includes(";")) return null;
    var r = `${e}=${t ? encodeURIComponent(o) : o}`;
    if (e.startsWith("__Host-")) return r += "; path=/; secure", n && console.debug(`Domain value: "${n}" has been ignored, because is not allowed for __Host- prefixed cookies`), 
    r;
    var s = getCookiePath(i);
    return s && (r += `; ${s}`), e.startsWith("__Secure-") && (r += "; secure"), n && (r += `; domain=${n}`), 
    r;
  }
  function isValidCookiePath(n) {
    return "/" === n || "none" === n;
  }
  function getTrustedCookieOffsetMs(e) {
    var r;
    if ("1year" === e) r = 31536e3; else if ("1day" === e) r = 86400; else if (r = Number.parseInt(e, 10), 
    Number.isNaN(r)) return null;
    return 1e3 * r;
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function getCookiePath(t) {
    return "/" === t ? "path=/" : "";
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetCookie.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedReplaceFetchResponse":function trustedReplaceFetchResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceFetchResponse(source) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    if (pattern === "" && replacement !== "") {
      logMessage(source, "Pattern argument should not be empty string");
      return;
    }
    var shouldLog = pattern === "" && replacement === "";
    var shouldLogContent = verbose === "true";
    var nativeRequestClone = Request.prototype.clone;
    var nativeFetch = fetch;
    var shouldReplace = false;
    var fetchData;
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      fetchData = getFetchData(args, nativeRequestClone);
      if (shouldLog) {
        logMessage(source, `fetch( ${objectToString(fetchData)} )`, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      shouldReplace = matchRequestProps(source, propsToMatch, fetchData);
      if (!shouldReplace) {
        return Reflect.apply(target, thisArg, args);
      }
      return nativeFetch.apply(null, args).then((function(response) {
        return response.clone().text().then((function(bodyText) {
          var patternRegexp = pattern === "*" ? /(\n|.)*/ : toRegExp(pattern);
          var isPatternFound = pattern === "*" || patternRegexp.test(bodyText);
          if (!isPatternFound) {
            return response;
          }
          if (shouldLogContent) {
            logMessage(source, `Original text content: ${bodyText}`);
          }
          var modifiedTextContent = bodyText.replace(patternRegexp, replacement);
          if (shouldLogContent) {
            logMessage(source, `Modified text content: ${modifiedTextContent}`);
          }
          var forgedResponse = forgeResponse(response, modifiedTextContent);
          hit(source);
          return forgedResponse;
        })).catch((function() {
          var fetchDataStr = objectToString(fetchData);
          var message = `Response body can't be converted to text: ${fetchDataStr}`;
          logMessage(source, message);
          return response;
        }));
      })).catch((function() {
        return Reflect.apply(target, thisArg, args);
      }));
    };
    var fetchHandler = {
      apply: handlerWrapper
    };
    fetch = new Proxy(fetch, fetchHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function getFetchData(e, t) {
    var a, c, n = {}, r = e[0];
    if (r instanceof Request) {
      var u = t.call(r), f = getRequestData(u);
      a = f.url, c = f;
    } else a = r, c = e[1];
    (n.url = a, c instanceof Object) && Object.keys(c).forEach((function(e) {
      n[e] = c[e];
    }));
    return n;
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function forgeResponse(e, t) {
    var {bodyUsed: s, headers: r, ok: u, redirected: a, status: d, statusText: o, type: l, url: n} = e, v = new Response(t, {
      status: d,
      statusText: o,
      headers: r
    });
    return Object.defineProperties(v, {
      url: {
        value: n
      },
      type: {
        value: l
      },
      ok: {
        value: u
      },
      bodyUsed: {
        value: s
      },
      redirected: {
        value: a
      }
    }), v;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getRequestData(t) {
    var e = getRequestProps().map((function(e) {
      return [ e, t[e] ];
    }));
    return Object.fromEntries(e);
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceFetchResponse.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"removeNodeText":function removeNodeText(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeNodeText(source, nodeName, textMatch, parentSelector) {
    var {selector: selector, nodeNameMatch: nodeNameMatch, textContentMatch: textContentMatch} = parseNodeTextParams(nodeName, textMatch);
    var handleNodes = function handleNodes(nodes) {
      return nodes.forEach((function(node) {
        var shouldReplace = isTargetNode(node, nodeNameMatch, textContentMatch);
        if (shouldReplace) {
          var ALL_TEXT_PATTERN = /^[^]*$/;
          var REPLACEMENT = "";
          replaceNodeText(source, node, ALL_TEXT_PATTERN, REPLACEMENT);
        }
      }));
    };
    if (document.documentElement) {
      handleExistingNodes(selector, handleNodes, parentSelector);
    }
    observeDocumentWithTimeout((function(mutations) {
      return handleMutations(mutations, handleNodes, selector, parentSelector);
    }));
  }
  function observeDocumentWithTimeout(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
      subtree: true,
      childList: true
    }, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e4, o = new MutationObserver((function(n, o) {
      o.disconnect(), e(n, o), o.observe(document.documentElement, t);
    }));
    o.observe(document.documentElement, t), "number" == typeof n && setTimeout((function() {
      return o.disconnect();
    }), n);
  }
  function handleExistingNodes(e, n, o) {
    (o ? document.querySelectorAll(o) : [ document ]).forEach((function(o) {
      return function(o) {
        if ("#text" === e) {
          var r = nodeListToArray(o.childNodes).filter((function(e) {
            return e.nodeType === Node.TEXT_NODE;
          }));
          n(r);
        } else {
          var t = nodeListToArray(o.querySelectorAll(e));
          n(t);
        }
      }(o);
    }));
  }
  function handleMutations(n, d, e, o) {
    var t = getAddedNodes(n);
    e && o ? t.forEach((function() {
      handleExistingNodes(e, d, o);
    })) : d(t);
  }
  function replaceNodeText(e, t, n, r) {
    var {textContent: a} = t;
    if (a) {
      var i = a.replace(n, r);
      if ("SCRIPT" === t.nodeName) i = getTrustedTypesApi(e).createScript(i);
      t.textContent = i, hit(e);
    }
  }
  function isTargetNode(e, t, n) {
    var {nodeName: o, textContent: s} = e, a = o.toLowerCase();
    return null !== s && "" !== s && (t instanceof RegExp ? t.test(a) : t === a) && (n instanceof RegExp ? n.test(s) : s.includes(n));
  }
  function parseNodeTextParams(t, e) {
    var a, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, r = "/", s = !(t.startsWith(r) && t.endsWith(r)), o = s ? t : "*", h = s ? t : toRegExp(t), i = e.startsWith(r) ? toRegExp(e) : e;
    return n && (a = n.startsWith(r) ? toRegExp(n) : n), {
      selector: o,
      nodeNameMatch: h,
      textContentMatch: i,
      patternMatch: a
    };
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function nodeListToArray(r) {
    for (var n = [], o = 0; o < r.length; o += 1) n.push(r[o]);
    return n;
  }
  function getAddedNodes(d) {
    for (var e = [], r = 0; r < d.length; r += 1) for (var {addedNodes: n} = d[r], o = 0; o < n.length; o += 1) e.push(n[o]);
    return e;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getTrustedTypesApi(t) {
    var r, e = null == t || null === (r = t.api) || void 0 === r ? void 0 : r.policy;
    if (e) return e;
    var n = "AGPolicy", i = window.trustedTypes, u = !!i, c = {
      HTML: "TrustedHTML",
      Script: "TrustedScript",
      ScriptURL: "TrustedScriptURL"
    };
    if (!u) return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      },
      create: function create(t, r) {
        return r;
      },
      getAttributeType: function getAttributeType() {
        return null;
      },
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e) {
        return e;
      },
      getPropertyType: function getPropertyType() {
        return null;
      },
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e) {
        return e;
      },
      isHTML: function isHTML() {
        return false;
      },
      isScript: function isScript() {
        return false;
      },
      isScriptURL: function isScriptURL() {
        return false;
      }
    };
    var o = i.createPolicy(n, {
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      }
    }), createHTML = function createHTML(t) {
      return o.createHTML(t);
    }, createScript = function createScript(t) {
      return o.createScript(t);
    }, createScriptURL = function createScriptURL(t) {
      return o.createScriptURL(t);
    }, create = function create(t, r) {
      switch (t) {
       case c.HTML:
        return createHTML(r);

       case c.Script:
        return createScript(r);

       case c.ScriptURL:
        return createScriptURL(r);

       default:
        return r;
      }
    }, p = i.getAttributeType.bind(i), T = i.getPropertyType.bind(i), s = i.isHTML.bind(i), a = i.isScript.bind(i), f = i.isScriptURL.bind(i);
    return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: createHTML,
      createScript: createScript,
      createScriptURL: createScriptURL,
      create: create,
      getAttributeType: p,
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e, n, i) {
        var u = p(t, r, n, i);
        return u ? create(u, e) : e;
      },
      getPropertyType: T,
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e, n) {
        var i = T(t, r, n);
        return i ? create(i, e) : e;
      },
      isHTML: s,
      isScript: a,
      isScriptURL: f
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeNodeText.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventWindowOpen":function preventWindowOpen(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventWindowOpen(source) {
    var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "*";
    var delay = arguments.length > 2 ? arguments[2] : undefined;
    var replacement = arguments.length > 3 ? arguments[3] : undefined;
    var nativeOpen = window.open;
    var isNewSyntax = match !== "0" && match !== "1";
    var combineArgs = function combineArgs(url, args) {
      if (args && args.length > 0) {
        return `${url} ${args.join(" ")}`;
      }
      return url;
    };
    var oldOpenWrapper = function oldOpenWrapper(str) {
      match = Number(match) > 0;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (!isValidStrPattern(delay)) {
        logMessage(source, `Invalid parameter: ${delay}`);
        return nativeOpen.apply(window, [ str, ...args ]);
      }
      var searchRegexp = toRegExp(delay);
      var argsToCheck = combineArgs(str, args);
      if (match !== searchRegexp.test(argsToCheck)) {
        return nativeOpen.apply(window, [ str, ...args ]);
      }
      hit(source);
      return handleOldReplacement(replacement);
    };
    var newOpenWrapper = function newOpenWrapper(url) {
      var shouldLog = replacement && replacement.includes("log");
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      if (shouldLog) {
        var argsStr = args && args.length > 0 ? `, ${args.join(", ")}` : "";
        var message = `${url}${argsStr}`;
        logMessage(source, message, true);
        hit(source);
      }
      var shouldPrevent = false;
      if (match === "*") {
        shouldPrevent = true;
      } else if (isValidMatchStr(match)) {
        var {isInvertedMatch: isInvertedMatch, matchRegexp: matchRegexp} = parseMatchArg(match);
        var argsToCheck = combineArgs(url, args);
        shouldPrevent = matchRegexp.test(argsToCheck) !== isInvertedMatch;
      } else {
        logMessage(source, `Invalid parameter: ${match}`);
        shouldPrevent = false;
      }
      if (shouldPrevent) {
        var parsedDelay = parseInt(delay, 10);
        var result;
        if (nativeIsNaN(parsedDelay)) {
          result = noopNull();
        } else {
          var decoyArgs = {
            replacement: replacement,
            url: url,
            delay: parsedDelay
          };
          var decoy = createDecoy(decoyArgs);
          var popup = decoy.contentWindow;
          if (typeof popup === "object" && popup !== null) {
            Object.defineProperty(popup, "closed", {
              value: false
            });
            Object.defineProperty(popup, "opener", {
              value: window
            });
            Object.defineProperty(popup, "frameElement", {
              value: null
            });
          } else {
            var nativeGetter = decoy.contentWindow && decoy.contentWindow.get;
            Object.defineProperty(decoy, "contentWindow", {
              get: getPreventGetter(nativeGetter)
            });
            popup = decoy.contentWindow;
          }
          result = popup;
        }
        hit(source);
        return result;
      }
      return nativeOpen.apply(window, [ url, ...args ]);
    };
    window.open = isNewSyntax ? newOpenWrapper : oldOpenWrapper;
    window.open.toString = nativeOpen.toString.bind(nativeOpen);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function handleOldReplacement(e) {
    var n;
    if (e) {
      if ("trueFunc" === e) n = trueFunc; else if (e.includes("=")) {
        if (e.startsWith("{") && e.endsWith("}")) {
          var t = e.slice(1, -1), u = substringBefore(t, "=");
          "noopFunc" === substringAfter(t, "=") && ((n = {})[u] = noopFunc);
        }
      }
    } else n = noopFunc;
    return n;
  }
  function createDecoy(e) {
    var t, r = function(e) {
      return e.Object = "data", e.Iframe = "src", e;
    }({}), {replacement: n, url: o, delay: a} = e;
    t = "obj" === n ? "object" : "iframe";
    var i = document.createElement(t);
    return i instanceof HTMLObjectElement ? i[r.Object] = o : i instanceof HTMLIFrameElement && (i[r.Iframe] = o), 
    i.style.setProperty("height", "1px", "important"), i.style.setProperty("position", "fixed", "important"), 
    i.style.setProperty("top", "-1px", "important"), i.style.setProperty("width", "1px", "important"), 
    document.body.appendChild(i), setTimeout((function() {
      return i.remove();
    }), 1e3 * a), i;
  }
  function getPreventGetter(n) {
    return function(t, e) {
      return (!e || "closed" !== e) && ("function" == typeof n ? noopFunc : e && t[e]);
    };
  }
  function noopNull() {
    return null;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function substringBefore(r, n) {
    if (!r || false) return r;
    var e = r.indexOf(n);
    return e < 0 ? r : r.substring(0, e);
  }
  function substringAfter(n, r) {
    if (!n) return n;
    var t = n.indexOf(r);
    return t < 0 ? "" : n.substring(t + r.length);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventWindowOpen.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"removeClass":function removeClass(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeClass(source, classNames, selector) {
    var applying = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "asap stay";
    if (!classNames) {
      return;
    }
    classNames = classNames.split(/\s*\|\s*/);
    var selectors = [];
    if (!selector) {
      selectors = classNames.map((function(className) {
        return `.${className}`;
      }));
    }
    var removeClassHandler = function removeClassHandler() {
      var nodes = new Set;
      if (selector) {
        var foundNodes = [];
        try {
          foundNodes = [].slice.call(document.querySelectorAll(selector));
        } catch (e) {
          logMessage(source, `Invalid selector arg: '${selector}'`);
        }
        foundNodes.forEach((function(n) {
          return nodes.add(n);
        }));
      } else if (selectors.length > 0) {
        selectors.forEach((function(s) {
          var elements = document.querySelectorAll(s);
          for (var i = 0; i < elements.length; i += 1) {
            var element = elements[i];
            nodes.add(element);
          }
        }));
      }
      var removed = false;
      nodes.forEach((function(node) {
        classNames.forEach((function(className) {
          if (node.classList.contains(className)) {
            node.classList.remove(className);
            removed = true;
          }
        }));
      }));
      if (removed) {
        hit(source);
      }
    };
    var CLASS_ATTR_NAME = [ "class" ];
    var flags = parseFlags(applying);
    var run = function run() {
      removeClassHandler();
      if (!flags.hasFlag(flags.STAY)) {
        return;
      }
      observeDOMChanges(removeClassHandler, true, CLASS_ATTR_NAME);
    };
    if (flags.hasFlag(flags.ASAP)) {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", removeClassHandler, {
          once: true
        });
      } else {
        removeClassHandler();
      }
    }
    if (document.readyState !== "complete" && flags.hasFlag(flags.COMPLETE)) {
      window.addEventListener("load", run, {
        once: true
      });
    } else if (flags.hasFlag(flags.STAY)) {
      if (!applying.includes(" ")) {
        removeClassHandler();
      }
      observeDOMChanges(removeClassHandler, true, CLASS_ATTR_NAME);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function parseFlags(t) {
    var e = "asap", n = "complete", a = "stay", r = new Set([ e, n, a ]), s = new Set(t.trim().split(" ").filter((function(t) {
      return r.has(t);
    })));
    return {
      ASAP: e,
      COMPLETE: n,
      STAY: a,
      hasFlag: function hasFlag(t) {
        return s.has(t);
      }
    };
  }
  function throttle(n, t) {
    var r, e = false, _wrapper5 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper5(...r), r = null);
      }), t));
    };
    return _wrapper5;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeClass.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"adjustSetTimeout":function adjustSetTimeout(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function adjustSetTimeout(source, matchCallback, matchDelay, boost) {
    var nativeSetTimeout = window.setTimeout;
    var matchRegexp = toRegExp(matchCallback);
    var timeoutWrapper = function timeoutWrapper(callback, delay) {
      if (!isValidCallback(callback)) {
        var message = `Scriptlet can't be applied because of invalid callback: '${callbackToString(callback)}'`;
        logMessage(source, message);
      } else if (matchRegexp.test(callbackToString(callback)) && isDelayMatched(matchDelay, delay)) {
        delay *= getBoostMultiplier(boost);
        hit(source);
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return nativeSetTimeout.apply(window, [ callback, delay, ...args ]);
    };
    window.setTimeout = timeoutWrapper;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getBoostMultiplier(t) {
    var e = parseFloat(t), i = nativeIsNaN(e) || !nativeIsFinite(e) ? .05 : e;
    return i < .001 && (i = .001), i > 50 && (i = 50), i;
  }
  function isDelayMatched(a, e) {
    return shouldMatchAnyDelay(a) || e === getMatchDelay(a);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function getMatchDelay(a) {
    var e = parseInt(a, 10);
    return nativeIsNaN(e) ? 1e3 : e;
  }
  function shouldMatchAnyDelay(n) {
    return "*" === n;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    adjustSetTimeout.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"adjustSetInterval":function adjustSetInterval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function adjustSetInterval(source, matchCallback, matchDelay, boost) {
    var nativeSetInterval = window.setInterval;
    var matchRegexp = toRegExp(matchCallback);
    var intervalWrapper = function intervalWrapper(callback, delay) {
      if (!isValidCallback(callback)) {
        var message = `Scriptlet can't be applied because of invalid callback: '${callbackToString(callback)}'`;
        logMessage(source, message);
      } else if (matchRegexp.test(callbackToString(callback)) && isDelayMatched(matchDelay, delay)) {
        delay *= getBoostMultiplier(boost);
        hit(source);
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return nativeSetInterval.apply(window, [ callback, delay, ...args ]);
    };
    window.setInterval = intervalWrapper;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getBoostMultiplier(t) {
    var e = parseFloat(t), i = nativeIsNaN(e) || !nativeIsFinite(e) ? .05 : e;
    return i < .001 && (i = .001), i > 50 && (i = 50), i;
  }
  function isDelayMatched(a, e) {
    return shouldMatchAnyDelay(a) || e === getMatchDelay(a);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function getMatchDelay(a) {
    var e = parseInt(a, 10);
    return nativeIsNaN(e) ? 1e3 : e;
  }
  function shouldMatchAnyDelay(n) {
    return "*" === n;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    adjustSetInterval.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"injectCssInShadowDom":function injectCssInShadowDom(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function injectCssInShadowDom(source, cssRule) {
    var hostSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var cssInjectionMethod = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "adoptedStyleSheets";
    if (!Element.prototype.attachShadow || typeof Proxy === "undefined" || typeof Reflect === "undefined") {
      return;
    }
    if (cssInjectionMethod !== "adoptedStyleSheets" && cssInjectionMethod !== "styleTag") {
      logMessage(source, `Unknown cssInjectionMethod: ${cssInjectionMethod}`);
      return;
    }
    if (cssRule.match(/(url|image-set)\(.*\)/i)) {
      logMessage(source, '"url()" function is not allowed for css rules');
      return;
    }
    var injectStyleTag = function injectStyleTag(shadowRoot) {
      try {
        var styleTag = document.createElement("style");
        styleTag.innerText = cssRule;
        shadowRoot.appendChild(styleTag);
        hit(source);
      } catch (error) {
        logMessage(source, `Unable to inject style tag due to: \n'${error.message}'`);
      }
    };
    var injectAdoptedStyleSheets = function injectAdoptedStyleSheets(shadowRoot) {
      try {
        var stylesheet = new CSSStyleSheet;
        try {
          stylesheet.insertRule(cssRule);
        } catch (e) {
          logMessage(source, `Unable to apply the rule '${cssRule}' due to: \n'${e.message}'`);
          return;
        }
        shadowRoot.adoptedStyleSheets = [ ...shadowRoot.adoptedStyleSheets, stylesheet ];
        hit(source);
      } catch (error) {
        logMessage(source, `Unable to inject adopted style sheet due to: \n'${error.message}'`);
        injectStyleTag(shadowRoot);
      }
    };
    var callback = function callback(shadowRoot) {
      if (cssInjectionMethod === "adoptedStyleSheets") {
        injectAdoptedStyleSheets(shadowRoot);
      } else if (cssInjectionMethod === "styleTag") {
        injectStyleTag(shadowRoot);
      }
    };
    hijackAttachShadow(window, hostSelector, callback);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function hijackAttachShadow(t, a, e) {
    var o = {
      apply: function apply(t, o, c) {
        var h = Reflect.apply(t, o, c);
        return o && o.matches(a || "*") && e(h), h;
      }
    };
    t.Element.prototype.attachShadow = new Proxy(t.Element.prototype.attachShadow, o);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    injectCssInShadowDom.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"jsonPrune":function jsonPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function jsonPrune(source, propsToRemove, requiredInitialProps) {
    var stack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var syntaxModeDetails = resolveJsonSyntaxMode(propsToRemove, mode);
    var prunePaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(propsToRemove) : [];
    var requiredPaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(requiredInitialProps) : [];
    var nativeObjects = {
      nativeParse: window.JSON.parse,
      nativeStringify: window.JSON.stringify
    };
    var pruneJsonValue = function pruneJsonValue(root) {
      if (syntaxModeDetails.mode === "jsonpath") {
        return jsonPath(source, root, propsToRemove, nativeObjects, (function() {
          return hit(source);
        }), stack);
      }
      return jsonPruner(source, root, prunePaths, requiredPaths, stack, nativeObjects);
    };
    var jsonParseWrapper = function jsonParseWrapper() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var root = nativeObjects.nativeParse.apply(JSON, args);
      return pruneJsonValue(root);
    };
    jsonParseWrapper.toString = nativeObjects.nativeParse.toString.bind(nativeObjects.nativeParse);
    JSON.parse = jsonParseWrapper;
    var nativeResponseJson = Response.prototype.json;
    var responseJsonWrapper = function responseJsonWrapper() {
      var promise = nativeResponseJson.apply(this);
      return promise.then((function(obj) {
        return pruneJsonValue(obj);
      }));
    };
    if (typeof Response === "undefined") {
      return;
    }
    Response.prototype.json = responseJsonWrapper;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getWildcardPropertyInChain(r, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [], t = arguments.length > 4 ? arguments[4] : void 0, o = e.indexOf(".");
    if (-1 === o) {
      if ("*" === e || "[]" === e) {
        for (var n in r) if (Object.prototype.hasOwnProperty.call(r, n)) if (void 0 !== t) {
          var s = r[n];
          "string" == typeof s && t instanceof RegExp ? t.test(s) && i.push({
            base: r,
            prop: n
          }) : s === t && i.push({
            base: r,
            prop: n
          });
        } else i.push({
          base: r,
          prop: n
        });
      } else if (void 0 !== t) {
        var p = r[e];
        "string" == typeof p && t instanceof RegExp ? t.test(p) && i.push({
          base: r,
          prop: e
        }) : r[e] === t && i.push({
          base: r,
          prop: e
        });
      } else i.push({
        base: r,
        prop: e
      });
      return i;
    }
    var c = e.slice(0, o);
    if ("[]" === c && Array.isArray(r) || "*" === c && r instanceof Object || "[-]" === c && Array.isArray(r) || "{-}" === c && r instanceof Object) {
      var f = e.slice(o + 1), y = Object.keys(r);
      if ("{-}" === c || "[-]" === c) {
        var h = Array.isArray(r) ? "array" : "object";
        return ("{-}" !== c || "object" !== h) && ("[-]" !== c || "array" !== h) || y.forEach((function(e) {
          var a = r[e];
          isKeyInObject(a, f, t) && i.push({
            base: r,
            prop: e
          });
        })), i;
      }
      y.forEach((function(e) {
        getWildcardPropertyInChain(r[e], f, a, i, t);
      }));
    }
    Array.isArray(r) && r.forEach((function(r) {
      void 0 !== r && getWildcardPropertyInChain(r, e, a, i, t);
    }));
    var d = r[c];
    return e = e.slice(o + 1), void 0 !== d && getWildcardPropertyInChain(d, e, a, i, t), 
    i;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function isPruningNeeded(n, t, r, e, a, i) {
    if (!t) return false;
    var o, {nativeStringify: u} = i, c = r.map((function(n) {
      return n.path;
    })), f = e.map((function(n) {
      return n.path;
    }));
    if (0 === c.length && f.length > 0) {
      var g = u(t);
      if (toRegExp(f.join("")).test(g)) return logMessage(n, `${window.location.hostname}\n${u(t, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
      t && "object" == typeof t && logMessage(n, t, true, false), o = false;
    }
    if (a && !matchStackTrace(a, (new Error).stack || "")) return o = false;
    for (var s, l = [ ".*.", "*.", ".*", ".[].", "[].", ".[]" ], _loop = function _loop() {
      var n = f[p], r = n.split(".").pop(), e = l.some((function(t) {
        return n.includes(t);
      })), a = getWildcardPropertyInChain(t, n, e);
      if (!a.length) return {
        v: o = false
      };
      o = !e;
      for (var i = 0; i < a.length; i += 1) {
        var u = "string" == typeof r && void 0 !== a[i].base[r];
        o = e ? u || o : u && o;
      }
    }, p = 0; p < f.length; p += 1) if (s = _loop()) return s.v;
    return o;
  }
  function jsonPruner(e, r, n, a, t, i) {
    var {nativeStringify: o} = i;
    if (0 === n.length && 0 === a.length) return logMessage(e, `${window.location.hostname}\n${o(r, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
    r && "object" == typeof r && logMessage(e, r, true, false), r;
    try {
      if (!1 === isPruningNeeded(e, r, n, a, t, i)) return r;
      n.forEach((function(n) {
        for (var a = n.path, t = n.value, i = getWildcardPropertyInChain(r, a, !0, [], t), o = i.length - 1; o >= 0; o -= 1) {
          var s = i[o];
          if (void 0 !== s && s.base) if (hit(e), Array.isArray(s.base)) try {
            var l = Number(s.prop);
            if (Number.isNaN(l)) continue;
            s.base.splice(l, 1);
          } catch (e) {
            console.error("Error while deleting array element", e);
          } else delete s.base[s.prop];
        }
      }));
    } catch (r) {
      logMessage(e, r);
    }
    return r;
  }
  function getPrunePath(t) {
    var r = ".[=].";
    if ("string" == typeof t && void 0 !== t && "" !== t) {
      var e = function(t) {
        for (var e = [], n = "", i = 0, a = false, s = false; i < t.length; ) {
          var u = t[i];
          if (a) n += u, "\\" === u ? s = !s : ("/" !== u || s || (a = false), s = false), 
          i += 1; else {
            if (" " === u || "\n" === u || "\t" === u || "\r" === u || "\f" === u || "\v" === u) {
              for (;i < t.length && /\s/.test(t[i]); ) i += 1;
              "" !== n && (e.push(n), n = "");
              continue;
            }
            if (t.startsWith(r, i)) {
              if (n += r, "/" === t[i += 5]) {
                a = true, s = false, n += "/", i += 1;
                continue;
              }
              continue;
            }
            n += u, i += 1;
          }
        }
        return "" !== n && e.push(n), e;
      }(t);
      return e.map((function(t) {
        var e = t.split(r), n = e[0], i = e[1];
        return void 0 !== i ? ("true" === i ? i = true : "false" === i ? i = false : i.startsWith("/") ? i = toRegExp(i) : "string" == typeof i && /^\d+$/.test(i) && (i = parseFloat(i)), 
        {
          path: n,
          value: i
        }) : {
          path: n
        };
      }));
    }
    return [];
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isKeyInObject(t, r, e) {
    var n = r.split("."), _check3 = function _check(t, r) {
      if (null == t) return false;
      if (0 === r.length) return void 0 === e || ("string" == typeof t && e instanceof RegExp ? e.test(t) : t === e);
      var n = r[0], i = r.slice(1);
      if ("*" === n || "[]" === n) {
        if (Array.isArray(t)) return t.some((function(t) {
          return _check3(t, i);
        }));
        if ("object" == typeof t && null !== t) return Object.keys(t).some((function(r) {
          return _check3(t[r], i);
        }));
      }
      return !!Object.prototype.hasOwnProperty.call(t, n) && _check3(t[n], i);
    };
    return _check3(t, n);
  }
  function jsonPath(e, r, t, a, n) {
    var i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "", s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6], o = "$", l = ".", u = "..", p = "", c = "\\", f = ")", h = "[", v = "@", d = "contains", g = "equal", m = "exists", y = "greater_than", k = "greater_than_or_equal", P = "less_than", b = "less_than_or_equal", S = "not_equal", x = "regex", $ = [ "==", "!=", "<=", ">=", "*=", "=~", "<", ">", "=" ], C = 1e5, w = /^[A-Za-z_$][\w$]*$/;
    function isObjectLike(e) {
      return null !== e && "object" == typeof e;
    }
    function isPlainObject(e) {
      if (!isObjectLike(e) || Array.isArray(e)) return false;
      var r = Object.getPrototypeOf(e);
      return r === Object.prototype || null === r;
    }
    function isQuoteCharacter(e) {
      return "'" === e || '"' === e;
    }
    function isEscaped(e, r) {
      for (var t = 0, a = r - 1; a >= 0 && e[a] === c; ) t += 1, a -= 1;
      return t % 2 != 0;
    }
    function stripQuotes(e) {
      var r = e.trim();
      if (r.length < 2) return r;
      var t = r[0], a = r[r.length - 1];
      return isQuoteCharacter(t) && t === a ? r.slice(1, -1).split("\\'").join("'").split('\\"').join('"').split(c + c).join(c) : r;
    }
    function appendPath(e, r) {
      return "number" == typeof r || /^\d+$/.test(String(r)) ? `${e}[${r}]` : w.test(String(r)) ? `${e}.${r}` : `${e}['${String(r).replace(/'/g, "\\'")}']`;
    }
    function createCandidate(e, r, t, a) {
      return {
        key: t,
        parent: r,
        path: a,
        value: e
      };
    }
    function walkTopLevelChars(e, r) {
      for (var t = 0, a = 0, n = 0, i = null, s = 0; s < e.length; s += 1) {
        var o = e[s];
        if (i) {
          if (o !== i || isEscaped(e, s) || (i = null), r(s, false)) return;
        } else if (isQuoteCharacter(o)) {
          if (i = o, r(s, false)) return;
        } else {
          var l = true;
          if (o === h ? t += 1 : "]" === o ? t -= 1 : "{" === o ? a += 1 : "}" === o ? a -= 1 : "(" === o ? n += 1 : o === f ? n -= 1 : l = false, 
          r(s, !l && 0 === t && 0 === a && 0 === n)) return;
        }
      }
    }
    function findClosingBracket(e, r) {
      for (var t = 0, a = null, n = r; n < e.length; n += 1) {
        var i = e[n];
        if (a) i !== a || isEscaped(e, n) || (a = null); else if (isQuoteCharacter(i)) a = i; else if (i !== h) {
          if ("]" === i && 0 === (t -= 1)) return n;
        } else t += 1;
      }
      return -1;
    }
    function splitByTopLevelToken(e, r) {
      var t = [], a = p, n = new Set;
      return walkTopLevelChars(e, (function(i, s) {
        if (!n.has(i)) if (s && e.startsWith(r, i)) {
          t.push(a.trim()), a = p;
          for (var o = 1; o < r.length; o += 1) n.add(i + o);
        } else a += e[i];
      })), a !== p && t.push(a.trim()), t;
    }
    function normalizeFilterPath(e) {
      var r = e.trim();
      return r.startsWith(v) && (r = r.slice(1)), r === p ? o : r.startsWith(o) ? r : r.startsWith(l) || r.startsWith(u) || r.startsWith(h) ? `${o}${r}` : `${o}${l}${r}`;
    }
    function parseFilterExpression(e) {
      var r = e.trim();
      if (r.startsWith("(") && r.endsWith(f)) {
        for (var t = 0, a = null, n = false, i = 0; i < r.length; i += 1) {
          var s = r[i];
          if (a) s !== a || isEscaped(r, i) || (a = null); else if (isQuoteCharacter(s)) a = s; else if ("(" === s) t += 1; else if (s === f && 0 === (t -= 1)) {
            n = i === r.length - 1;
            break;
          }
        }
        n && (r = r.slice(1, -1).trim());
      }
      var u = splitByTopLevelToken(r, "||");
      if (u.length > 1) return {
        conditions: u.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "or"
      };
      var p = splitByTopLevelToken(r, "&&");
      if (p.length > 1) return {
        conditions: p.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "and"
      };
      if (r.startsWith("!") && !r.startsWith("!=")) return {
        condition: parseFilterExpression(r.slice(1).trim()),
        operator: "not"
      };
      var c, C, w = (C = null, walkTopLevelChars(c = r, (function(e, r) {
        if (!r) return false;
        for (var t = null, a = 0; a < $.length; a += 1) {
          var n = $[a];
          c.startsWith(n, e) && (null === t || n.length > t.length) && (t = n);
        }
        return null !== t && (C = {
          index: e,
          operator: t
        }, true);
      })), C);
      if (!w) return {
        operator: m,
        selectorPath: normalizeFilterPath(r)
      };
      var W = r.slice(0, w.index).trim(), O = r.slice(w.index + w.operator.length).trim(), A = g;
      "!=" === w.operator ? A = S : "<" === w.operator ? A = P : "<=" === w.operator ? A = b : ">" === w.operator ? A = y : ">=" === w.operator ? A = k : "*=" === w.operator ? A = d : ("=~" === w.operator || "=" === w.operator && /^\/.*\/[a-z]*$/i.test(O)) && (A = x);
      var j, E, L = O.trim(), F = L === o || L.startsWith(o + l) || L.startsWith(o + h), M = L === v || L.startsWith(v + l) || L.startsWith(v + h);
      return F || M ? {
        comparisonSelectorPath: normalizeFilterPath(L),
        operator: A,
        resolveComparisonAgainstRoot: F,
        selectorPath: normalizeFilterPath(W)
      } : {
        comparisonValue: (j = O, E = j.trim(), "true" === E || "false" !== E && ("null" === E ? null : /^-?\d+(?:\.\d+)?$/.test(E) ? Number(E) : /^\/.*\/[a-z]*$/i.test(E) ? toRegExp(E) : stripQuotes(E))),
        operator: A,
        selectorPath: normalizeFilterPath(W)
      };
    }
    function parseBracketStep(e, r) {
      if ("*" === e) return {
        mode: "wildcard",
        recursive: r
      };
      if (e.startsWith("?")) return {
        filter: parseFilterExpression(e.slice(1)),
        mode: "filter",
        recursive: r
      };
      if (/^\(@\.length(?:-\d+)?\)$/.test(e)) {
        var t = e.match(/^\(@\.length(?:-(\d+))?\)$/);
        return {
          mode: "computed-index",
          recursive: r,
          subtractLength: t && t[1] ? Number(t[1]) : 0
        };
      }
      var a = function(e) {
        var r = [], t = p;
        return walkTopLevelChars(e, (function(a, n) {
          n && ":" === e[a] ? (r.push(t.trim()), t = p) : t += e[a];
        })), r.push(t.trim()), r;
      }(e);
      if (a.length > 1) {
        var n = a[0] === p ? void 0 : Number(a[0]);
        return {
          mode: "slice",
          recursive: r,
          slice: {
            end: a[1] === p ? void 0 : Number(a[1]),
            start: n,
            step: a.length > 2 && a[2] !== p ? Number(a[2]) : 1
          }
        };
      }
      var i = function(e, r) {
        var t = [], a = p;
        return walkTopLevelChars(e, (function(n, i) {
          i && e[n] === r ? (t.push(a.trim()), a = p) : a += e[n];
        })), a !== p && t.push(a.trim()), t;
      }(e, ",");
      return i.every((function(e) {
        return /^-?\d+$/.test(e);
      })) ? {
        indexes: i.map((function(e) {
          return Number(e);
        })),
        mode: "index",
        recursive: r
      } : {
        mode: "property",
        properties: i.map((function(e) {
          return r = e.trim(), /^\/.*\/[a-z]*$/i.test(r) ? toRegExp(r) : stripQuotes(r);
          var r;
        })),
        recursive: r
      };
    }
    function parseJsonPathSelector(e) {
      var r = [], t = 0;
      for (e.startsWith(o) && (t = 1); t < e.length; ) {
        var a = false;
        if (e.startsWith(u, t) ? (a = true, t += 2) : e[t] === l && (t += 1), t >= e.length) break;
        if (e[t] !== h) {
          if ("*" !== e[t]) {
            for (var n = t; n < e.length && e[n] !== l && e[n] !== h; ) n += 1;
            var i = e.slice(t, n).trim();
            i && r.push({
              mode: "property",
              properties: [ i ],
              recursive: a
            }), t = n;
          } else r.push({
            mode: "wildcard",
            recursive: a
          }), t += 1;
        } else {
          var s = findClosingBracket(e, t);
          if (-1 === s) throw new Error(`Invalid JSONPath expression: ${e}`);
          var p = e.slice(t + 1, s).trim();
          r.push(parseBracketStep(p, a)), t = s + 1;
        }
      }
      return {
        steps: r
      };
    }
    function buildAppendUpdater(e, r, t) {
      var a, n = e.trim();
      if (n.startsWith("{") || n.startsWith(h)) a = r(parseKeywordValue(n)); else {
        var i = t(n);
        if (!i || i.shouldReplaceArgument) throw new Error(`Invalid append value: ${e}`);
        a = i.constantValue;
      }
      return function(e) {
        return Array.isArray(e) ? Array.isArray(a) ? e.concat(a) : e.concat([ a ]) : isPlainObject(e) && isPlainObject(a) ? Object.assign({}, e, a) : "string" == typeof e && "string" == typeof a ? `${e}${a}` : a;
      };
    }
    function buildSetUpdater(e, r, t) {
      var a = e.trim();
      if (a.startsWith("replace(") && a.endsWith(f)) return function(e, r) {
        var t = r(e.slice(8, -1));
        if ("string" != typeof t.regex || "string" != typeof t.replacement) throw new Error('Invalid replace payload: "regex" and "replacement" must be strings');
        var a = t.regex.startsWith("/") ? toRegExp(t.regex) : new RegExp(t.regex, t.flags || p), n = parseKeywordValue(t.replacement);
        return function(e) {
          return "string" != typeof e ? e : e.replace(a, n);
        };
      }(a, r);
      var n = t(a);
      if (!n) throw new Error(`Invalid set value: ${e}`);
      return function(e) {
        return getJsonSetValue(e, n);
      };
    }
    function getChildCandidates(e) {
      if (!isObjectLike(e.value)) return [];
      if (ArrayBuffer.isView(e.value)) return [];
      for (var r = Object.keys(e.value), t = [], a = 0; a < r.length; a += 1) {
        var n = r[a];
        t.push(createCandidate(e.value[n], e.value, n, appendPath(e.path, n)));
      }
      return t;
    }
    function getRecursiveCandidates(r) {
      var t = [ r ], a = [ 0 ], n = new WeakSet;
      isObjectLike(r.value) && n.add(r.value);
      for (var i = false, s = isObjectLike(r.value) ? 1 : 0, o = getChildCandidates(r), l = 0; l < o.length; l += 1) {
        if (isObjectLike(o[l].value)) {
          if (n.has(o[l].value)) continue;
          if (n.add(o[l].value), (s += 1) >= C) {
            i = true;
            break;
          }
        }
        t.push(o[l]), a.push(1);
      }
      for (var u = 1; u < t.length && !i; ) {
        var p = a[u] + 1;
        if (p > 1e3) {
          i = true;
          break;
        }
        for (var c = getChildCandidates(t[u]), f = 0; f < c.length; f += 1) {
          if (isObjectLike(c[f].value)) {
            if (n.has(c[f].value)) continue;
            if (n.add(c[f].value), (s += 1) >= C) {
              i = true;
              break;
            }
          }
          t.push(c[f]), a.push(p);
        }
        u += 1;
      }
      return i && logMessage(e, "JSONPath recursive descent exceeded its traversal budget, results may be incomplete"), 
      t;
    }
    function resolveIndex(e, r) {
      return r < 0 ? e + r : r;
    }
    function applyDirectStep(e, r) {
      var t = [];
      if ("property" === r.mode) {
        if (!isObjectLike(e.value) || !r.properties) return t;
        for (var a = new Set, n = 0; n < r.properties.length; n += 1) {
          var i = r.properties[n];
          if (i instanceof RegExp) for (var s = Object.keys(e.value), o = 0; o < s.length; o += 1) {
            var l = s[o];
            i.lastIndex = 0, i.test(l) && !a.has(l) && (a.add(l), t.push(createCandidate(e.value[l], e.value, l, appendPath(e.path, l))));
          } else !a.has(i) && Object.prototype.hasOwnProperty.call(e.value, i) && (a.add(i), 
          t.push(createCandidate(e.value[i], e.value, i, appendPath(e.path, i))));
        }
        return t;
      }
      if ("wildcard" === r.mode) return getChildCandidates(e);
      if ("index" === r.mode) {
        if (!Array.isArray(e.value) || !r.indexes) return t;
        for (var u = 0; u < r.indexes.length; u += 1) {
          var p = resolveIndex(e.value.length, r.indexes[u]);
          p >= 0 && p < e.value.length && t.push(createCandidate(e.value[p], e.value, p, appendPath(e.path, p)));
        }
        return t;
      }
      if ("computed-index" === r.mode) {
        if (!Array.isArray(e.value)) return t;
        var c = e.value.length - (r.subtractLength || 0);
        return c >= 0 && c < e.value.length && t.push(createCandidate(e.value[c], e.value, c, appendPath(e.path, c))), 
        t;
      }
      if ("slice" === r.mode) {
        if (!Array.isArray(e.value) || !r.slice) return t;
        for (var f = function(e, r) {
          var t, a, n = [], i = void 0 === r.step ? 1 : r.step;
          if (0 === i) return n;
          if (t = void 0 === r.start ? i > 0 ? 0 : e - 1 : resolveIndex(e, r.start), a = void 0 === r.end ? i > 0 ? e : -1 : resolveIndex(e, r.end), 
          i > 0) {
            for (var s = Math.max(0, t); s < Math.min(e, a); s += i) n.push(s);
            return n;
          }
          for (var o = Math.min(e - 1, t); o > Math.max(-1, a); o += i) n.push(o);
          return n;
        }(e.value.length, r.slice), h = 0; h < f.length; h += 1) {
          var v = f[h];
          t.push(createCandidate(e.value[v], e.value, v, appendPath(e.path, v)));
        }
      }
      return t;
    }
    function evaluateSelector(e, t) {
      function matchesFilterValue(e, t) {
        if ("conditions" in t) return "and" === t.operator ? t.conditions.every((function(r) {
          return matchesFilterValue(e, r);
        })) : t.conditions.some((function(r) {
          return matchesFilterValue(e, r);
        }));
        if ("condition" in t) return !matchesFilterValue(e, t.condition);
        var a = evaluateSelector(e, parseJsonPathSelector(t.selectorPath));
        if (t.operator === m) return a.length > 0;
        var n = t.comparisonValue;
        if (t.comparisonSelectorPath) {
          var i = evaluateSelector(t.resolveComparisonAgainstRoot ? r : e, parseJsonPathSelector(t.comparisonSelectorPath));
          if (0 === i.length) return false;
          n = i[0].value;
        }
        for (var s = 0; s < a.length; s += 1) {
          var o = a[s].value;
          if (t.operator !== d) {
            if (t.operator !== x) {
              if (t.operator === g && o === n) return true;
              if (t.operator === S && o !== n) return true;
              if (t.operator === P && o < n) return true;
              if (t.operator === b && o <= n) return true;
              if (t.operator === y && o > n) return true;
              if (t.operator === k && o >= n) return true;
            } else if ("string" == typeof o && n instanceof RegExp && (n.lastIndex = 0, n.test(o))) return true;
          } else if ("string" == typeof o && o.includes(String(n))) return true;
        }
        return false;
      }
      function applyFilterStep(e, r) {
        for (var t = [], a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (Array.isArray(n.value)) for (var i = 0; i < n.value.length; i += 1) matchesFilterValue(n.value[i], r) && t.push(createCandidate(n.value[i], n.value, i, appendPath(n.path, i))); else matchesFilterValue(n.value, r) && t.push(n);
        }
        return t;
      }
      for (var a = [ createCandidate(e, null, null, o) ], n = 0; n < t.steps.length; n += 1) {
        var i = t.steps[n];
        if ("filter" === i.mode && i.filter) {
          var s = a;
          if (i.recursive) {
            s = [];
            for (var l = 0; l < a.length; l += 1) for (var u = getRecursiveCandidates(a[l]), p = 0; p < u.length; p += 1) s.push(u[p]);
          }
          a = applyFilterStep(s, i.filter);
        } else {
          for (var c = [], f = 0; f < a.length; f += 1) for (var h = a[f], v = i.recursive ? getRecursiveCandidates(h) : [ h ], $ = 0; $ < v.length; $ += 1) for (var C = applyDirectStep(v[$], i), w = 0; w < C.length; w += 1) c.push(C[w]);
          a = c;
        }
      }
      return a;
    }
    var W = false;
    function markMutated() {
      W = true;
    }
    if (!isObjectLike(r)) return r;
    var O, A = (O = a) && O.nativeParse ? O.nativeParse : JSON.parse, j = function(e) {
      return e && e.nativeStringify ? e.nativeStringify : JSON.stringify;
    }(a), E = (new Error).stack || "";
    if (i && !matchStackTrace(i, E)) return r;
    if (!t) return logMessage(e, `${window.location.hostname}\n${j(r, null, 2)}\nStack trace:\n${E}`, true), 
    logMessage(e, r, true, false), r;
    try {
      for (var L = function(e, r, t) {
        var a, n, i = function(e) {
          var r = -1, t = "remove", a = 0;
          return walkTopLevelChars(e, (function(n, i) {
            return !!i && (e.startsWith("+=", n) ? (r = n, t = "append", a = 2, !0) : "=" === e[n] && (r = n, 
            t = "set", a = 1, !0));
          })), -1 === r ? {
            mode: "remove",
            selectorPart: e.trim(),
            valuePart: p
          } : {
            mode: t,
            selectorPart: e.slice(0, r).trim(),
            valuePart: e.slice(r + a).trim()
          };
        }(e), s = function(e) {
          for (var r = [], t = e.trim(); t.startsWith("[?"); ) {
            var a = findClosingBracket(t, 0);
            if (-1 === a) break;
            var n = t.slice(1, a);
            r.push(parseFilterExpression(n.slice(1))), t = t.slice(a + 1).trim();
          }
          return {
            guards: r,
            selectorPart: t
          };
        }(i.selectorPart), c = parseJsonPathSelector((a = s.selectorPart, (n = a.trim()) === p ? o : n.startsWith(o) ? n : n.startsWith(l) || n.startsWith(h) || n.startsWith(u) ? `${o}${n}` : `${o}${l}${n}`)), f = {
          mode: i.mode
        };
        return "append" === i.mode ? f = {
          mode: "append",
          updater: buildAppendUpdater(i.valuePart, r, t)
        } : "set" === i.mode && (f = {
          mode: "set",
          updater: buildSetUpdater(i.valuePart, r, t)
        }), {
          guards: s.guards,
          mutation: f,
          selector: c
        };
      }(t, A, (function(r) {
        return parseJsonSetArgumentValue(e, r, A);
      })), F = 0; F < L.guards.length; F += 1) {
        if (0 === evaluateSelector(r, {
          steps: [ {
            filter: L.guards[F],
            mode: "filter",
            recursive: !1
          } ]
        }).length) return r;
      }
      var M = evaluateSelector(r, L.selector);
      if (s) return M.length > 0 && n && n(), r;
      if (!("remove" === L.mutation.mode || "string" == typeof e.name && e.name.startsWith("trusted-"))) return logMessage(e, "JSONPath set and append operations are allowed only in trusted scriptlets"), 
      r;
      if ("remove" === L.mutation.mode) return function(e) {
        for (var r = new Set, t = new Map, a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (null !== n.parent && null !== n.key && !r.has(n.path)) if (r.add(n.path), Array.isArray(n.parent)) {
            var i = t.get(n.parent) || [];
            i.push(Number(n.key)), t.set(n.parent, i);
          } else delete n.parent[n.key], markMutated();
        }
        t.forEach((function(e, r) {
          for (var t = Array.from(new Set(e)).sort((function(e, r) {
            return r - e;
          })), a = 0; a < t.length; a += 1) {
            var n = t[a];
            n >= 0 && n < r.length && (r.splice(n, 1), markMutated());
          }
        }));
      }(M), W && n && n(), r;
      L.mutation.updater && (r = function(e, r, t) {
        for (var a = new Set, n = e, i = 0; i < r.length; i += 1) {
          var s = r[i];
          a.has(s.path) || (a.add(s.path), null !== s.parent || null !== s.key || s.path !== o ? null !== s.parent && null !== s.key && (s.parent[s.key] = t(s.parent[s.key]), 
          markMutated()) : (n = t(n), markMutated()));
        }
        return n;
      }(r, M, L.mutation.updater), W && n && n());
    } catch (r) {
      logMessage(e, `JSONPath processing failed for expression '${t}': ${r.message}`);
    }
    return r;
  }
  function resolveJsonSyntaxMode(t, r) {
    var e = "legacy", o = "jsonpath", s = "string" == typeof r ? r.trim().toLowerCase() : "";
    if (s === e || s === o) return {
      mode: s
    };
    var a = "string" == typeof t ? t.trim() : "";
    return a.startsWith("$") || a.startsWith("[?") || a.startsWith(".") ? {
      mode: o
    } : {
      mode: e
    };
  }
  function getJsonSetValue(e, t) {
    return t.shouldReplaceArgument ? "string" == typeof e ? e.replace(t.replaceRegexValue, t.constantValue) : e : t.shouldMergeJsonValue && null !== e && "object" == typeof e && !Array.isArray(e) && null !== t.constantValue && "object" == typeof t.constantValue && !Array.isArray(t.constantValue) ? Object.assign({}, e, t.constantValue) : t.constantValue;
  }
  function parseJsonSetArgumentValue(e, l, a) {
    var r, n = "json:", s = "replace:", o = "", t = false, u = false, i = false;
    if (l.startsWith(s)) {
      var c = extractRegexAndReplacement(l);
      if (!c) return logMessage(e, `Invalid argument value format: ${l}`), null;
      o = c.regexPart, i = (r = parseKeywordValue(c.replacementPart)) !== c.replacementPart, 
      t = true;
    } else if (l.startsWith(n)) try {
      var f = l.slice(n.length), p = parseKeywordValue(f);
      i = p !== f, r = a(p), u = !0;
    } catch (a) {
      return logMessage(e, `Invalid JSON argument value: ${l}`), null;
    } else {
      var m = noopArray(), d = noopObject(), g = parseKeywordValue(l);
      if (i = g !== l, "undefined" === g) r = void 0; else if ("false" === g) r = false; else if ("true" === g) r = true; else if ("null" === g) r = null; else if ("NaN" === g) r = NaN; else if ("emptyArr" === g || "[]" === g) r = m; else if ("emptyObj" === g || "{}" === g) r = d; else if ("noopFunc" === g) r = noopFunc; else if ("noopCallbackFunc" === g) r = noopCallbackFunc; else if ("trueFunc" === g) r = trueFunc; else if ("falseFunc" === g) r = falseFunc; else if ("throwFunc" === g) r = throwFunc; else if ("noopPromiseResolve" === g) r = noopPromiseResolve; else if ("noopPromiseReject" === g) r = noopPromiseReject; else if (/^-?\d+$/.test(g)) {
        if (r = parseFloat(g), nativeIsNaN(r)) return null;
      } else r = g;
    }
    return {
      constantValue: r,
      replaceRegexValue: o,
      shouldReplaceArgument: t,
      shouldMergeJsonValue: u,
      hasTimeKeywords: i
    };
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopCallbackFunc() {
    return noopFunc;
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    jsonPrune.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"hideInShadowDom":function hideInShadowDom(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function hideInShadowDom(source, selector, baseSelector) {
    if (!Element.prototype.attachShadow) {
      return;
    }
    var hideElement = function hideElement(targetElement) {
      var DISPLAY_NONE_CSS = "display:none!important;";
      targetElement.style.cssText = DISPLAY_NONE_CSS;
    };
    var hideHandler = function hideHandler() {
      var hostElements = !baseSelector ? findHostElements(document.documentElement) : document.querySelectorAll(baseSelector);
      var _loop = function _loop() {
        var isHidden = false;
        var {targets: targets, innerHosts: innerHosts} = pierceShadowDom(selector, hostElements);
        targets.forEach((function(targetEl) {
          hideElement(targetEl);
          isHidden = true;
        }));
        if (isHidden) {
          hit(source);
        }
        hostElements = innerHosts;
      };
      while (hostElements.length !== 0) {
        _loop();
      }
    };
    hideHandler();
    observeDOMChanges(hideHandler, true);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function findHostElements(o) {
    var n = [];
    o && o.querySelectorAll("*").forEach((function(o) {
      o.shadowRoot && n.push(o);
    }));
    return n;
  }
  function pierceShadowDom(e, t) {
    var c = [], l = [];
    t.forEach((function(t) {
      var o = t.querySelectorAll(e);
      c = c.concat([].slice.call(o));
      var r = t.shadowRoot, a = r.querySelectorAll(e);
      c = c.concat([].slice.call(a)), l.push(findHostElements(r));
    }));
    var o = flatten(l);
    return {
      targets: c,
      innerHosts: o
    };
  }
  function flatten(r) {
    var n = [];
    r.forEach((function(r) {
      return n.push(r);
    }));
    for (var t = []; n.length; ) {
      var u = n.pop();
      Array.isArray(u) ? u.forEach((function(r) {
        return n.push(r);
      })) : t.push(u);
    }
    return t.reverse();
  }
  function throttle(n, t) {
    var r, e = false, _wrapper2 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper2(...r), r = null);
      }), t));
    };
    return _wrapper2;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    hideInShadowDom.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setSessionStorageItem":function setSessionStorageItem(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setSessionStorageItem(source, key, value) {
    if (typeof key === "undefined") {
      logMessage(source, "Item key should be specified.");
      return;
    }
    var validValue;
    try {
      validValue = getLimitedStorageItemValue(value);
    } catch (_unused) {
      logMessage(source, `Invalid storage item value: '${value}'`);
      return;
    }
    var {sessionStorage: sessionStorage} = window;
    if (validValue === "$remove$") {
      removeStorageItem(source, sessionStorage, key);
    } else {
      setStorageItem(source, sessionStorage, key, validValue);
    }
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function setStorageItem(e, t, s, a) {
    try {
      t.setItem(s, a);
    } catch (t) {
      var o = `Unable to set storage item due to: ${t.message}`;
      logMessage(e, o);
    }
  }
  function removeStorageItem(e, t, o) {
    try {
      if (o.startsWith("/") && (o.endsWith("/") || o.endsWith("/i")) && isValidStrPattern(o)) {
        var r = toRegExp(o);
        Object.keys(t).forEach((function(e) {
          r.test(e) && t.removeItem(e);
        }));
      } else t.removeItem(o);
    } catch (t) {
      var s = `Unable to remove storage item due to: ${t.message}`;
      logMessage(e, s);
    }
  }
  function getLimitedStorageItemValue(e) {
    if ("string" != typeof e) throw new Error("Invalid value");
    var r;
    if (new Set([ "undefined", "false", "true", "null", "", "yes", "no", "on", "off", "accept", "accepted", "reject", "rejected", "allowed", "denied", "forbidden", "forever" ]).has(e.toLowerCase())) r = e; else if ("emptyArr" === e) r = "[]"; else if ("emptyObj" === e) r = "{}"; else if (/^\d+$/.test(e)) {
      if (r = parseFloat(e), nativeIsNaN(r)) throw new Error("Invalid value");
      if (Math.abs(r) > 32767) throw new Error("Invalid value");
    } else {
      if ("$remove$" !== e) throw new Error("Invalid value");
      r = "$remove$";
    }
    return r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setSessionStorageItem.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setLocalStorageItem":function setLocalStorageItem(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setLocalStorageItem(source, key, value) {
    if (typeof key === "undefined") {
      logMessage(source, "Item key should be specified.");
      return;
    }
    var validValue;
    try {
      validValue = getLimitedStorageItemValue(value);
    } catch (_unused) {
      logMessage(source, `Invalid storage item value: '${value}'`);
      return;
    }
    var {localStorage: localStorage} = window;
    if (validValue === "$remove$") {
      removeStorageItem(source, localStorage, key);
    } else {
      setStorageItem(source, localStorage, key, validValue);
    }
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function setStorageItem(e, t, s, a) {
    try {
      t.setItem(s, a);
    } catch (t) {
      var o = `Unable to set storage item due to: ${t.message}`;
      logMessage(e, o);
    }
  }
  function removeStorageItem(e, t, o) {
    try {
      if (o.startsWith("/") && (o.endsWith("/") || o.endsWith("/i")) && isValidStrPattern(o)) {
        var r = toRegExp(o);
        Object.keys(t).forEach((function(e) {
          r.test(e) && t.removeItem(e);
        }));
      } else t.removeItem(o);
    } catch (t) {
      var s = `Unable to remove storage item due to: ${t.message}`;
      logMessage(e, s);
    }
  }
  function getLimitedStorageItemValue(e) {
    if ("string" != typeof e) throw new Error("Invalid value");
    var r;
    if (new Set([ "undefined", "false", "true", "null", "", "yes", "no", "on", "off", "accept", "accepted", "reject", "rejected", "allowed", "denied", "forbidden", "forever" ]).has(e.toLowerCase())) r = e; else if ("emptyArr" === e) r = "[]"; else if ("emptyObj" === e) r = "{}"; else if (/^\d+$/.test(e)) {
      if (r = parseFloat(e), nativeIsNaN(r)) throw new Error("Invalid value");
      if (Math.abs(r) > 32767) throw new Error("Invalid value");
    } else {
      if ("$remove$" !== e) throw new Error("Invalid value");
      r = "$remove$";
    }
    return r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setLocalStorageItem.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventNavigation":function preventNavigation(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventNavigation(source, urlPattern) {
    var nav = window.navigation;
    if (!nav) {
      return;
    }
    var currentUrlKeyword = "location.href";
    var shouldLog = typeof urlPattern === "undefined";
    var pattern = null;
    if (urlPattern === currentUrlKeyword) {
      pattern = window.location.href;
    } else if (typeof urlPattern === "string") {
      pattern = toRegExp(urlPattern);
    }
    var shouldPrevent = function shouldPrevent(patternUrl, url) {
      if (!patternUrl) {
        return false;
      }
      if (typeof patternUrl === "string") {
        return url === patternUrl;
      }
      return patternUrl.test(url);
    };
    nav.addEventListener("navigate", (function(event) {
      var _event$destination;
      var destinationURL = event === null || event === void 0 || (_event$destination = event.destination) === null || _event$destination === void 0 ? void 0 : _event$destination.url;
      if (!destinationURL) {
        return;
      }
      if (shouldLog) {
        hit(source);
        logMessage(source, `Navigating to: ${destinationURL}`);
        return;
      }
      if (shouldPrevent(pattern, destinationURL)) {
        event.preventDefault();
        hit(source);
        logMessage(source, `Blocked navigation to: ${destinationURL}`);
      }
    }));
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventNavigation.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setCookie":function setCookie(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setCookie(source, name, value) {
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "/";
    var domain = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var validValue = getLimitedCookieValue(value);
    if (validValue === null) {
      logMessage(source, `Invalid cookie value: '${validValue}'`);
      return;
    }
    if (!isValidCookiePath(path)) {
      logMessage(source, `Invalid cookie path: '${path}'`);
      return;
    }
    if (!document.location.origin.includes(domain)) {
      logMessage(source, `Cookie domain not matched by origin: '${domain}'`);
      return;
    }
    var cookieToSet = serializeCookie(name, validValue, path, domain, false);
    if (!cookieToSet) {
      logMessage(source, "Invalid cookie name or value");
      return;
    }
    hit(source);
    document.cookie = cookieToSet;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function getLimitedCookieValue(e) {
    if (!e) return null;
    var n;
    if (new Set([ "true", "t", "false", "f", "yes", "y", "no", "n", "ok", "on", "off", "accept", "accepted", "notaccepted", "reject", "rejected", "allow", "allowed", "disallow", "deny", "denied", "enable", "enabled", "disable", "disabled", "necessary", "required", "hide", "hidden", "essential", "nonessential", "checked", "unchecked", "forbidden", "forever", "declined", "mandatory", "all" ]).has(e.toLowerCase())) n = e; else if ("emptyArr" === e) n = "[]"; else if ("emptyObj" === e) n = "{}"; else {
      if (!/^\d+$/.test(e)) return null;
      if (n = parseFloat(e), nativeIsNaN(n)) return null;
      if (Math.abs(n) < 0 || Math.abs(n) > 32767) return null;
    }
    return n;
  }
  function serializeCookie(e, o, i) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", t = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
    if (!t && `${o}`.includes(";") || e.includes(";")) return null;
    var r = `${e}=${t ? encodeURIComponent(o) : o}`;
    if (e.startsWith("__Host-")) return r += "; path=/; secure", n && console.debug(`Domain value: "${n}" has been ignored, because is not allowed for __Host- prefixed cookies`), 
    r;
    var s = getCookiePath(i);
    return s && (r += `; ${s}`), e.startsWith("__Secure-") && (r += "; secure"), n && (r += `; domain=${n}`), 
    r;
  }
  function isValidCookiePath(n) {
    return "/" === n || "none" === n;
  }
  function getCookiePath(t) {
    return "/" === t ? "path=/" : "";
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setCookie.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetLocalStorageItem":function trustedSetLocalStorageItem(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetLocalStorageItem(source, key, value) {
    if (typeof key === "undefined") {
      logMessage(source, "Item key should be specified");
      return;
    }
    if (typeof value === "undefined") {
      logMessage(source, "Item value should be specified");
      return;
    }
    var parsedValue = parseKeywordValue(value);
    var {localStorage: localStorage} = window;
    setStorageItem(source, localStorage, key, parsedValue);
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function setStorageItem(e, t, s, a) {
    try {
      t.setItem(s, a);
    } catch (t) {
      var o = `Unable to set storage item due to: ${t.message}`;
      logMessage(e, o);
    }
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetLocalStorageItem.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventInnerHTML":function preventInnerHTML(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventInnerHTML(source) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var pattern = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var replacement = arguments.length > 3 ? arguments[3] : undefined;
    var {isInvertedMatch: isInvertedMatch, matchRegexp: matchRegexp} = parseMatchArg(pattern);
    var nativeDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (nativeDescriptor === undefined) {
      return;
    }
    var shouldPrevent = function shouldPrevent(element, value) {
      if (selector !== "") {
        if (typeof element.matches !== "function") {
          return false;
        }
        try {
          if (element.matches(selector) === false) {
            return false;
          }
        } catch (e) {
          logMessage(source, `prevent-innerHTML: invalid selector "${selector}"`, true);
          return false;
        }
      }
      var patternMatches = matchRegexp.test(String(value));
      return isInvertedMatch ? !patternMatches : patternMatches;
    };
    Object.defineProperty(Element.prototype, "innerHTML", {
      configurable: true,
      enumerable: true,
      get() {
        var value = nativeDescriptor.get ? nativeDescriptor.get.call(this) : nativeDescriptor.value;
        if (replacement !== undefined && shouldPrevent(this, value)) {
          hit(source);
          logMessage(source, "Replaced innerHTML getter value");
          return replacement;
        }
        return value;
      },
      set(value) {
        if (shouldPrevent(this, value)) {
          hit(source);
          logMessage(source, "Prevented innerHTML assignment");
          return;
        }
        if (nativeDescriptor.set) {
          nativeDescriptor.set.call(this, value);
        }
      }
    });
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventInnerHTML.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetAttr":function trustedSetAttr(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetAttr(source, selector, attr) {
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    if (!selector || !attr) {
      return;
    }
    setAttributeBySelector(source, selector, attr, value);
    observeDOMChanges((function() {
      return setAttributeBySelector(source, selector, attr, value);
    }), true);
  }
  function setAttributeBySelector(e, t, l, o) {
    var r, c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : defaultAttributeSetter;
    try {
      r = document.querySelectorAll(t);
    } catch (l) {
      return void logMessage(e, `Failed to find elements matching selector "${t}"`);
    }
    if (r && 0 !== r.length) try {
      r.forEach((function(e) {
        return c(e, l, o);
      })), hit(e);
    } catch (t) {
      logMessage(e, `Failed to set [${l}="${o}"] to each of selected elements.`);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function defaultAttributeSetter(t, e, r) {
    return t.setAttribute(e, r);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function throttle(n, t) {
    var r, e = false, _wrapper9 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper9(...r), r = null);
      }), t));
    };
    return _wrapper9;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetAttr.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"removeAttr":function removeAttr(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeAttr(source, attrs, selector) {
    var applying = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "asap stay";
    if (!attrs) {
      return;
    }
    attrs = attrs.split(/\s*\|\s*/);
    if (!selector) {
      selector = `[${attrs.join("],[")}]`;
    }
    var rmattr = function rmattr() {
      var nodes = [];
      try {
        nodes = [].slice.call(document.querySelectorAll(selector));
      } catch (e) {
        logMessage(source, `Invalid selector arg: '${selector}'`);
      }
      var removed = false;
      nodes.forEach((function(node) {
        attrs.forEach((function(attr) {
          node.removeAttribute(attr);
          removed = true;
        }));
      }));
      if (removed) {
        hit(source);
      }
    };
    var flags = parseFlags(applying);
    var run = function run() {
      rmattr();
      if (!flags.hasFlag(flags.STAY)) {
        return;
      }
      observeDOMChanges(rmattr, true);
    };
    if (flags.hasFlag(flags.ASAP)) {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", rmattr, {
          once: true
        });
      } else {
        rmattr();
      }
    }
    if (document.readyState !== "complete" && flags.hasFlag(flags.COMPLETE)) {
      window.addEventListener("load", run, {
        once: true
      });
    } else if (flags.hasFlag(flags.STAY)) {
      if (!applying.includes(" ")) {
        rmattr();
      }
      observeDOMChanges(rmattr, true);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function parseFlags(t) {
    var e = "asap", n = "complete", a = "stay", r = new Set([ e, n, a ]), s = new Set(t.trim().split(" ").filter((function(t) {
      return r.has(t);
    })));
    return {
      ASAP: e,
      COMPLETE: n,
      STAY: a,
      hasFlag: function hasFlag(t) {
        return s.has(t);
      }
    };
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function throttle(n, t) {
    var r, e = false, _wrapper4 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper4(...r), r = null);
      }), t));
    };
    return _wrapper4;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeAttr.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSuppressNativeMethod":function trustedSuppressNativeMethod(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSuppressNativeMethod(source, methodPath, signatureStr) {
    var how = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "abort";
    var stack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    if (!methodPath || !signatureStr) {
      return;
    }
    var IGNORE_ARG_SYMBOL = " ";
    var suppress = how === "abort" ? getAbortFunc() : function() {};
    var signatureMatcher;
    try {
      signatureMatcher = splitByPipeRespectingRegex(signatureStr).map((function(value) {
        return value === IGNORE_ARG_SYMBOL ? value : inferValue(value);
      }));
    } catch (e) {
      logMessage(source, `Could not parse the signature matcher: ${getErrorMessage(e)}`);
      return;
    }
    var getPathParts = getPropertyInChain;
    var {base: base, chain: chain, prop: prop} = getPathParts(window, methodPath);
    if (typeof chain !== "undefined") {
      logMessage(source, `Could not reach the end of the prop chain: ${methodPath}`);
      return;
    }
    var nativeMethod = base[prop];
    if (!nativeMethod || typeof nativeMethod !== "function") {
      logMessage(source, `Could not retrieve the method: ${methodPath}`);
      return;
    }
    function matchMethodCall(nativeArguments, matchArguments) {
      return matchArguments.every((function(matcher, i) {
        if (matcher === IGNORE_ARG_SYMBOL) {
          return true;
        }
        var argument = nativeArguments[i];
        return isValueMatched(argument, matcher);
      }));
    }
    var isMatchingSuspended = false;
    function apply(target, thisArg, argumentsList) {
      if (isMatchingSuspended) {
        return Reflect.apply(target, thisArg, argumentsList);
      }
      isMatchingSuspended = true;
      if (stack && !matchStackTrace(stack, (new Error).stack || "")) {
        isMatchingSuspended = false;
        return Reflect.apply(target, thisArg, argumentsList);
      }
      var isMatching = matchMethodCall(argumentsList, signatureMatcher);
      isMatchingSuspended = false;
      if (isMatching) {
        hit(source);
        return suppress();
      }
      return Reflect.apply(target, thisArg, argumentsList);
    }
    base[prop] = new Proxy(nativeMethod, {
      apply: apply
    });
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function inferValue(r) {
    if ("undefined" !== r) {
      if ("false" === r) return false;
      if ("true" === r) return true;
      if ("null" === r) return null;
      if ("NaN" === r) return NaN;
      if (r.startsWith("/") && r.endsWith("/")) return toRegExp(r);
      var e = Number(r);
      if (!nativeIsNaN(e)) {
        if (Math.abs(e) > 32767) throw new Error("number values bigger than 32767 are not allowed");
        return e;
      }
      try {
        var t = JSON.parse(r);
        if (t instanceof Object || "string" == typeof t) return t;
      } catch (e) {
        return r;
      }
      return r;
    }
  }
  function isValueMatched(t, r) {
    return "function" != typeof t && (nativeIsNaN(t) ? nativeIsNaN(r) : null == t || "number" == typeof t || "boolean" == typeof t ? t === r : "string" == typeof t ? ("string" == typeof r || r instanceof RegExp) && isStringMatched(t, r) : Array.isArray(t) && Array.isArray(r) ? isArrayMatched(t, r) : !(!isArbitraryObject(t) || !isArbitraryObject(r)) && isObjectMatched(t, r));
  }
  function getAbortFunc() {
    var r = randomId(), n = false;
    return function() {
      throw n || (window.onerror = createOnErrorHandler(r), n = true), new ReferenceError(r);
    };
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getErrorMessage(e) {
    var r;
    if ("object" == typeof (r = e) && null !== r && "message" in r && "string" == typeof r.message) return e.message;
    try {
      return new Error(JSON.stringify(e)).message;
    } catch (r) {
      return new Error(String(e)).message;
    }
  }
  function splitByPipeRespectingRegex(e) {
    for (var i = [], n = "", t = false, f = 0; f < e.length; ) {
      var r = e[f];
      if (t) {
        if ("/" === r) {
          for (var u = 0, o = n.length - 1; o >= 0 && "\\" === n[o]; ) u += 1, o -= 1;
          if (u % 2 == 0) {
            for (n += r, f += 1; f < e.length && /[gimsuy]/.test(e[f]); ) n += e[f], f += 1;
            t = false;
            continue;
          }
        }
      } else {
        if ("/" === r && "" === n) {
          t = true, n += r, f += 1;
          continue;
        }
        if ("|" === r) {
          i.push(n), n = "", f += 1;
          continue;
        }
      }
      n += r, f += 1;
    }
    return i.push(n), i;
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function isArbitraryObject(r) {
    return !(null === r || "object" != typeof r || Array.isArray(r) || r instanceof RegExp);
  }
  function isStringMatched(t, n) {
    return "string" == typeof n ? "" === n ? t === n : t.includes(n) : n instanceof RegExp && n.test(t);
  }
  function isArrayMatched(r, n) {
    if (0 === r.length) return 0 === n.length;
    if (0 === n.length) return false;
    for (var t, _loop = function _loop() {
      var t = n[e];
      return r.some((function(r) {
        return isValueMatched(r, t);
      })) ? 0 : {
        v: false
      };
    }, e = 0; e < n.length; e += 1) if (0 !== (t = _loop()) && t) return t.v;
    return true;
  }
  function isObjectMatched(e, t) {
    for (var r = Object.keys(t), a = 0; a < r.length; a += 1) {
      var c = r[a], n = e[c];
      if (!isValueMatched(n, t[c])) return false;
    }
    return true;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSuppressNativeMethod.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"jsonPruneFetchResponse":function jsonPruneFetchResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function jsonPruneFetchResponse(source, propsToRemove, obligatoryProps) {
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var stack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var mode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    if (typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var syntaxModeDetails = resolveJsonSyntaxMode(propsToRemove, mode);
    var prunePaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(propsToRemove) : [];
    var requiredPaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(obligatoryProps) : [];
    var nativeRequestClone = window.Request.prototype.clone;
    var nativeResponseClone = window.Response.prototype.clone;
    var nativeFetch = window.fetch;
    var nativeObjects = {
      nativeParse: window.JSON.parse,
      nativeStringify: window.JSON.stringify
    };
    var pruneJsonValue = function pruneJsonValue(root) {
      if (syntaxModeDetails.mode === "jsonpath") {
        return jsonPath(source, root, propsToRemove, nativeObjects, (function() {
          return hit(source);
        }), stack);
      }
      return jsonPruner(source, root, prunePaths, requiredPaths, stack, nativeObjects);
    };
    var fetchHandlerWrapper = async function fetchHandlerWrapper(target, thisArg, args) {
      var fetchData = getFetchData(args, nativeRequestClone);
      if (!matchRequestProps(source, propsToMatch, fetchData)) {
        return Reflect.apply(target, thisArg, args);
      }
      var originalResponse;
      var clonedResponse;
      try {
        originalResponse = await nativeFetch.apply(null, args);
        clonedResponse = nativeResponseClone.call(originalResponse);
      } catch (_unused) {
        logMessage(source, `Could not make an original fetch request: ${fetchData.url}`);
        return Reflect.apply(target, thisArg, args);
      }
      var json;
      try {
        json = await originalResponse.json();
      } catch (e) {
        var message = `Response body can't be converted to json: ${objectToString(fetchData)}`;
        logMessage(source, message);
        return clonedResponse;
      }
      var modifiedJson = pruneJsonValue(json);
      var forgedResponse = forgeResponse(originalResponse, nativeObjects.nativeStringify(modifiedJson));
      hit(source);
      return forgedResponse;
    };
    var fetchHandler = {
      apply: fetchHandlerWrapper
    };
    window.fetch = new Proxy(window.fetch, fetchHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function getFetchData(e, t) {
    var a, c, n = {}, r = e[0];
    if (r instanceof Request) {
      var u = t.call(r), f = getRequestData(u);
      a = f.url, c = f;
    } else a = r, c = e[1];
    (n.url = a, c instanceof Object) && Object.keys(c).forEach((function(e) {
      n[e] = c[e];
    }));
    return n;
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function jsonPruner(e, r, n, a, t, i) {
    var {nativeStringify: o} = i;
    if (0 === n.length && 0 === a.length) return logMessage(e, `${window.location.hostname}\n${o(r, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
    r && "object" == typeof r && logMessage(e, r, true, false), r;
    try {
      if (!1 === isPruningNeeded(e, r, n, a, t, i)) return r;
      n.forEach((function(n) {
        for (var a = n.path, t = n.value, i = getWildcardPropertyInChain(r, a, !0, [], t), o = i.length - 1; o >= 0; o -= 1) {
          var s = i[o];
          if (void 0 !== s && s.base) if (hit(e), Array.isArray(s.base)) try {
            var l = Number(s.prop);
            if (Number.isNaN(l)) continue;
            s.base.splice(l, 1);
          } catch (e) {
            console.error("Error while deleting array element", e);
          } else delete s.base[s.prop];
        }
      }));
    } catch (r) {
      logMessage(e, r);
    }
    return r;
  }
  function jsonPath(e, r, t, a, n) {
    var i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "", s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6], o = "$", l = ".", u = "..", p = "", c = "\\", f = ")", h = "[", v = "@", d = "contains", g = "equal", m = "exists", y = "greater_than", k = "greater_than_or_equal", P = "less_than", b = "less_than_or_equal", S = "not_equal", x = "regex", $ = [ "==", "!=", "<=", ">=", "*=", "=~", "<", ">", "=" ], C = 1e5, w = /^[A-Za-z_$][\w$]*$/;
    function isObjectLike(e) {
      return null !== e && "object" == typeof e;
    }
    function isPlainObject(e) {
      if (!isObjectLike(e) || Array.isArray(e)) return false;
      var r = Object.getPrototypeOf(e);
      return r === Object.prototype || null === r;
    }
    function isQuoteCharacter(e) {
      return "'" === e || '"' === e;
    }
    function isEscaped(e, r) {
      for (var t = 0, a = r - 1; a >= 0 && e[a] === c; ) t += 1, a -= 1;
      return t % 2 != 0;
    }
    function stripQuotes(e) {
      var r = e.trim();
      if (r.length < 2) return r;
      var t = r[0], a = r[r.length - 1];
      return isQuoteCharacter(t) && t === a ? r.slice(1, -1).split("\\'").join("'").split('\\"').join('"').split(c + c).join(c) : r;
    }
    function appendPath(e, r) {
      return "number" == typeof r || /^\d+$/.test(String(r)) ? `${e}[${r}]` : w.test(String(r)) ? `${e}.${r}` : `${e}['${String(r).replace(/'/g, "\\'")}']`;
    }
    function createCandidate(e, r, t, a) {
      return {
        key: t,
        parent: r,
        path: a,
        value: e
      };
    }
    function walkTopLevelChars(e, r) {
      for (var t = 0, a = 0, n = 0, i = null, s = 0; s < e.length; s += 1) {
        var o = e[s];
        if (i) {
          if (o !== i || isEscaped(e, s) || (i = null), r(s, false)) return;
        } else if (isQuoteCharacter(o)) {
          if (i = o, r(s, false)) return;
        } else {
          var l = true;
          if (o === h ? t += 1 : "]" === o ? t -= 1 : "{" === o ? a += 1 : "}" === o ? a -= 1 : "(" === o ? n += 1 : o === f ? n -= 1 : l = false, 
          r(s, !l && 0 === t && 0 === a && 0 === n)) return;
        }
      }
    }
    function findClosingBracket(e, r) {
      for (var t = 0, a = null, n = r; n < e.length; n += 1) {
        var i = e[n];
        if (a) i !== a || isEscaped(e, n) || (a = null); else if (isQuoteCharacter(i)) a = i; else if (i !== h) {
          if ("]" === i && 0 === (t -= 1)) return n;
        } else t += 1;
      }
      return -1;
    }
    function splitByTopLevelToken(e, r) {
      var t = [], a = p, n = new Set;
      return walkTopLevelChars(e, (function(i, s) {
        if (!n.has(i)) if (s && e.startsWith(r, i)) {
          t.push(a.trim()), a = p;
          for (var o = 1; o < r.length; o += 1) n.add(i + o);
        } else a += e[i];
      })), a !== p && t.push(a.trim()), t;
    }
    function normalizeFilterPath(e) {
      var r = e.trim();
      return r.startsWith(v) && (r = r.slice(1)), r === p ? o : r.startsWith(o) ? r : r.startsWith(l) || r.startsWith(u) || r.startsWith(h) ? `${o}${r}` : `${o}${l}${r}`;
    }
    function parseFilterExpression(e) {
      var r = e.trim();
      if (r.startsWith("(") && r.endsWith(f)) {
        for (var t = 0, a = null, n = false, i = 0; i < r.length; i += 1) {
          var s = r[i];
          if (a) s !== a || isEscaped(r, i) || (a = null); else if (isQuoteCharacter(s)) a = s; else if ("(" === s) t += 1; else if (s === f && 0 === (t -= 1)) {
            n = i === r.length - 1;
            break;
          }
        }
        n && (r = r.slice(1, -1).trim());
      }
      var u = splitByTopLevelToken(r, "||");
      if (u.length > 1) return {
        conditions: u.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "or"
      };
      var p = splitByTopLevelToken(r, "&&");
      if (p.length > 1) return {
        conditions: p.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "and"
      };
      if (r.startsWith("!") && !r.startsWith("!=")) return {
        condition: parseFilterExpression(r.slice(1).trim()),
        operator: "not"
      };
      var c, C, w = (C = null, walkTopLevelChars(c = r, (function(e, r) {
        if (!r) return false;
        for (var t = null, a = 0; a < $.length; a += 1) {
          var n = $[a];
          c.startsWith(n, e) && (null === t || n.length > t.length) && (t = n);
        }
        return null !== t && (C = {
          index: e,
          operator: t
        }, true);
      })), C);
      if (!w) return {
        operator: m,
        selectorPath: normalizeFilterPath(r)
      };
      var W = r.slice(0, w.index).trim(), O = r.slice(w.index + w.operator.length).trim(), A = g;
      "!=" === w.operator ? A = S : "<" === w.operator ? A = P : "<=" === w.operator ? A = b : ">" === w.operator ? A = y : ">=" === w.operator ? A = k : "*=" === w.operator ? A = d : ("=~" === w.operator || "=" === w.operator && /^\/.*\/[a-z]*$/i.test(O)) && (A = x);
      var j, E, L = O.trim(), F = L === o || L.startsWith(o + l) || L.startsWith(o + h), M = L === v || L.startsWith(v + l) || L.startsWith(v + h);
      return F || M ? {
        comparisonSelectorPath: normalizeFilterPath(L),
        operator: A,
        resolveComparisonAgainstRoot: F,
        selectorPath: normalizeFilterPath(W)
      } : {
        comparisonValue: (j = O, E = j.trim(), "true" === E || "false" !== E && ("null" === E ? null : /^-?\d+(?:\.\d+)?$/.test(E) ? Number(E) : /^\/.*\/[a-z]*$/i.test(E) ? toRegExp(E) : stripQuotes(E))),
        operator: A,
        selectorPath: normalizeFilterPath(W)
      };
    }
    function parseBracketStep(e, r) {
      if ("*" === e) return {
        mode: "wildcard",
        recursive: r
      };
      if (e.startsWith("?")) return {
        filter: parseFilterExpression(e.slice(1)),
        mode: "filter",
        recursive: r
      };
      if (/^\(@\.length(?:-\d+)?\)$/.test(e)) {
        var t = e.match(/^\(@\.length(?:-(\d+))?\)$/);
        return {
          mode: "computed-index",
          recursive: r,
          subtractLength: t && t[1] ? Number(t[1]) : 0
        };
      }
      var a = function(e) {
        var r = [], t = p;
        return walkTopLevelChars(e, (function(a, n) {
          n && ":" === e[a] ? (r.push(t.trim()), t = p) : t += e[a];
        })), r.push(t.trim()), r;
      }(e);
      if (a.length > 1) {
        var n = a[0] === p ? void 0 : Number(a[0]);
        return {
          mode: "slice",
          recursive: r,
          slice: {
            end: a[1] === p ? void 0 : Number(a[1]),
            start: n,
            step: a.length > 2 && a[2] !== p ? Number(a[2]) : 1
          }
        };
      }
      var i = function(e, r) {
        var t = [], a = p;
        return walkTopLevelChars(e, (function(n, i) {
          i && e[n] === r ? (t.push(a.trim()), a = p) : a += e[n];
        })), a !== p && t.push(a.trim()), t;
      }(e, ",");
      return i.every((function(e) {
        return /^-?\d+$/.test(e);
      })) ? {
        indexes: i.map((function(e) {
          return Number(e);
        })),
        mode: "index",
        recursive: r
      } : {
        mode: "property",
        properties: i.map((function(e) {
          return r = e.trim(), /^\/.*\/[a-z]*$/i.test(r) ? toRegExp(r) : stripQuotes(r);
          var r;
        })),
        recursive: r
      };
    }
    function parseJsonPathSelector(e) {
      var r = [], t = 0;
      for (e.startsWith(o) && (t = 1); t < e.length; ) {
        var a = false;
        if (e.startsWith(u, t) ? (a = true, t += 2) : e[t] === l && (t += 1), t >= e.length) break;
        if (e[t] !== h) {
          if ("*" !== e[t]) {
            for (var n = t; n < e.length && e[n] !== l && e[n] !== h; ) n += 1;
            var i = e.slice(t, n).trim();
            i && r.push({
              mode: "property",
              properties: [ i ],
              recursive: a
            }), t = n;
          } else r.push({
            mode: "wildcard",
            recursive: a
          }), t += 1;
        } else {
          var s = findClosingBracket(e, t);
          if (-1 === s) throw new Error(`Invalid JSONPath expression: ${e}`);
          var p = e.slice(t + 1, s).trim();
          r.push(parseBracketStep(p, a)), t = s + 1;
        }
      }
      return {
        steps: r
      };
    }
    function buildAppendUpdater(e, r, t) {
      var a, n = e.trim();
      if (n.startsWith("{") || n.startsWith(h)) a = r(parseKeywordValue(n)); else {
        var i = t(n);
        if (!i || i.shouldReplaceArgument) throw new Error(`Invalid append value: ${e}`);
        a = i.constantValue;
      }
      return function(e) {
        return Array.isArray(e) ? Array.isArray(a) ? e.concat(a) : e.concat([ a ]) : isPlainObject(e) && isPlainObject(a) ? Object.assign({}, e, a) : "string" == typeof e && "string" == typeof a ? `${e}${a}` : a;
      };
    }
    function buildSetUpdater(e, r, t) {
      var a = e.trim();
      if (a.startsWith("replace(") && a.endsWith(f)) return function(e, r) {
        var t = r(e.slice(8, -1));
        if ("string" != typeof t.regex || "string" != typeof t.replacement) throw new Error('Invalid replace payload: "regex" and "replacement" must be strings');
        var a = t.regex.startsWith("/") ? toRegExp(t.regex) : new RegExp(t.regex, t.flags || p), n = parseKeywordValue(t.replacement);
        return function(e) {
          return "string" != typeof e ? e : e.replace(a, n);
        };
      }(a, r);
      var n = t(a);
      if (!n) throw new Error(`Invalid set value: ${e}`);
      return function(e) {
        return getJsonSetValue(e, n);
      };
    }
    function getChildCandidates(e) {
      if (!isObjectLike(e.value)) return [];
      if (ArrayBuffer.isView(e.value)) return [];
      for (var r = Object.keys(e.value), t = [], a = 0; a < r.length; a += 1) {
        var n = r[a];
        t.push(createCandidate(e.value[n], e.value, n, appendPath(e.path, n)));
      }
      return t;
    }
    function getRecursiveCandidates(r) {
      var t = [ r ], a = [ 0 ], n = new WeakSet;
      isObjectLike(r.value) && n.add(r.value);
      for (var i = false, s = isObjectLike(r.value) ? 1 : 0, o = getChildCandidates(r), l = 0; l < o.length; l += 1) {
        if (isObjectLike(o[l].value)) {
          if (n.has(o[l].value)) continue;
          if (n.add(o[l].value), (s += 1) >= C) {
            i = true;
            break;
          }
        }
        t.push(o[l]), a.push(1);
      }
      for (var u = 1; u < t.length && !i; ) {
        var p = a[u] + 1;
        if (p > 1e3) {
          i = true;
          break;
        }
        for (var c = getChildCandidates(t[u]), f = 0; f < c.length; f += 1) {
          if (isObjectLike(c[f].value)) {
            if (n.has(c[f].value)) continue;
            if (n.add(c[f].value), (s += 1) >= C) {
              i = true;
              break;
            }
          }
          t.push(c[f]), a.push(p);
        }
        u += 1;
      }
      return i && logMessage(e, "JSONPath recursive descent exceeded its traversal budget, results may be incomplete"), 
      t;
    }
    function resolveIndex(e, r) {
      return r < 0 ? e + r : r;
    }
    function applyDirectStep(e, r) {
      var t = [];
      if ("property" === r.mode) {
        if (!isObjectLike(e.value) || !r.properties) return t;
        for (var a = new Set, n = 0; n < r.properties.length; n += 1) {
          var i = r.properties[n];
          if (i instanceof RegExp) for (var s = Object.keys(e.value), o = 0; o < s.length; o += 1) {
            var l = s[o];
            i.lastIndex = 0, i.test(l) && !a.has(l) && (a.add(l), t.push(createCandidate(e.value[l], e.value, l, appendPath(e.path, l))));
          } else !a.has(i) && Object.prototype.hasOwnProperty.call(e.value, i) && (a.add(i), 
          t.push(createCandidate(e.value[i], e.value, i, appendPath(e.path, i))));
        }
        return t;
      }
      if ("wildcard" === r.mode) return getChildCandidates(e);
      if ("index" === r.mode) {
        if (!Array.isArray(e.value) || !r.indexes) return t;
        for (var u = 0; u < r.indexes.length; u += 1) {
          var p = resolveIndex(e.value.length, r.indexes[u]);
          p >= 0 && p < e.value.length && t.push(createCandidate(e.value[p], e.value, p, appendPath(e.path, p)));
        }
        return t;
      }
      if ("computed-index" === r.mode) {
        if (!Array.isArray(e.value)) return t;
        var c = e.value.length - (r.subtractLength || 0);
        return c >= 0 && c < e.value.length && t.push(createCandidate(e.value[c], e.value, c, appendPath(e.path, c))), 
        t;
      }
      if ("slice" === r.mode) {
        if (!Array.isArray(e.value) || !r.slice) return t;
        for (var f = function(e, r) {
          var t, a, n = [], i = void 0 === r.step ? 1 : r.step;
          if (0 === i) return n;
          if (t = void 0 === r.start ? i > 0 ? 0 : e - 1 : resolveIndex(e, r.start), a = void 0 === r.end ? i > 0 ? e : -1 : resolveIndex(e, r.end), 
          i > 0) {
            for (var s = Math.max(0, t); s < Math.min(e, a); s += i) n.push(s);
            return n;
          }
          for (var o = Math.min(e - 1, t); o > Math.max(-1, a); o += i) n.push(o);
          return n;
        }(e.value.length, r.slice), h = 0; h < f.length; h += 1) {
          var v = f[h];
          t.push(createCandidate(e.value[v], e.value, v, appendPath(e.path, v)));
        }
      }
      return t;
    }
    function evaluateSelector(e, t) {
      function matchesFilterValue(e, t) {
        if ("conditions" in t) return "and" === t.operator ? t.conditions.every((function(r) {
          return matchesFilterValue(e, r);
        })) : t.conditions.some((function(r) {
          return matchesFilterValue(e, r);
        }));
        if ("condition" in t) return !matchesFilterValue(e, t.condition);
        var a = evaluateSelector(e, parseJsonPathSelector(t.selectorPath));
        if (t.operator === m) return a.length > 0;
        var n = t.comparisonValue;
        if (t.comparisonSelectorPath) {
          var i = evaluateSelector(t.resolveComparisonAgainstRoot ? r : e, parseJsonPathSelector(t.comparisonSelectorPath));
          if (0 === i.length) return false;
          n = i[0].value;
        }
        for (var s = 0; s < a.length; s += 1) {
          var o = a[s].value;
          if (t.operator !== d) {
            if (t.operator !== x) {
              if (t.operator === g && o === n) return true;
              if (t.operator === S && o !== n) return true;
              if (t.operator === P && o < n) return true;
              if (t.operator === b && o <= n) return true;
              if (t.operator === y && o > n) return true;
              if (t.operator === k && o >= n) return true;
            } else if ("string" == typeof o && n instanceof RegExp && (n.lastIndex = 0, n.test(o))) return true;
          } else if ("string" == typeof o && o.includes(String(n))) return true;
        }
        return false;
      }
      function applyFilterStep(e, r) {
        for (var t = [], a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (Array.isArray(n.value)) for (var i = 0; i < n.value.length; i += 1) matchesFilterValue(n.value[i], r) && t.push(createCandidate(n.value[i], n.value, i, appendPath(n.path, i))); else matchesFilterValue(n.value, r) && t.push(n);
        }
        return t;
      }
      for (var a = [ createCandidate(e, null, null, o) ], n = 0; n < t.steps.length; n += 1) {
        var i = t.steps[n];
        if ("filter" === i.mode && i.filter) {
          var s = a;
          if (i.recursive) {
            s = [];
            for (var l = 0; l < a.length; l += 1) for (var u = getRecursiveCandidates(a[l]), p = 0; p < u.length; p += 1) s.push(u[p]);
          }
          a = applyFilterStep(s, i.filter);
        } else {
          for (var c = [], f = 0; f < a.length; f += 1) for (var h = a[f], v = i.recursive ? getRecursiveCandidates(h) : [ h ], $ = 0; $ < v.length; $ += 1) for (var C = applyDirectStep(v[$], i), w = 0; w < C.length; w += 1) c.push(C[w]);
          a = c;
        }
      }
      return a;
    }
    var W = false;
    function markMutated() {
      W = true;
    }
    if (!isObjectLike(r)) return r;
    var O, A = (O = a) && O.nativeParse ? O.nativeParse : JSON.parse, j = function(e) {
      return e && e.nativeStringify ? e.nativeStringify : JSON.stringify;
    }(a), E = (new Error).stack || "";
    if (i && !matchStackTrace(i, E)) return r;
    if (!t) return logMessage(e, `${window.location.hostname}\n${j(r, null, 2)}\nStack trace:\n${E}`, true), 
    logMessage(e, r, true, false), r;
    try {
      for (var L = function(e, r, t) {
        var a, n, i = function(e) {
          var r = -1, t = "remove", a = 0;
          return walkTopLevelChars(e, (function(n, i) {
            return !!i && (e.startsWith("+=", n) ? (r = n, t = "append", a = 2, !0) : "=" === e[n] && (r = n, 
            t = "set", a = 1, !0));
          })), -1 === r ? {
            mode: "remove",
            selectorPart: e.trim(),
            valuePart: p
          } : {
            mode: t,
            selectorPart: e.slice(0, r).trim(),
            valuePart: e.slice(r + a).trim()
          };
        }(e), s = function(e) {
          for (var r = [], t = e.trim(); t.startsWith("[?"); ) {
            var a = findClosingBracket(t, 0);
            if (-1 === a) break;
            var n = t.slice(1, a);
            r.push(parseFilterExpression(n.slice(1))), t = t.slice(a + 1).trim();
          }
          return {
            guards: r,
            selectorPart: t
          };
        }(i.selectorPart), c = parseJsonPathSelector((a = s.selectorPart, (n = a.trim()) === p ? o : n.startsWith(o) ? n : n.startsWith(l) || n.startsWith(h) || n.startsWith(u) ? `${o}${n}` : `${o}${l}${n}`)), f = {
          mode: i.mode
        };
        return "append" === i.mode ? f = {
          mode: "append",
          updater: buildAppendUpdater(i.valuePart, r, t)
        } : "set" === i.mode && (f = {
          mode: "set",
          updater: buildSetUpdater(i.valuePart, r, t)
        }), {
          guards: s.guards,
          mutation: f,
          selector: c
        };
      }(t, A, (function(r) {
        return parseJsonSetArgumentValue(e, r, A);
      })), F = 0; F < L.guards.length; F += 1) {
        if (0 === evaluateSelector(r, {
          steps: [ {
            filter: L.guards[F],
            mode: "filter",
            recursive: !1
          } ]
        }).length) return r;
      }
      var M = evaluateSelector(r, L.selector);
      if (s) return M.length > 0 && n && n(), r;
      if (!("remove" === L.mutation.mode || "string" == typeof e.name && e.name.startsWith("trusted-"))) return logMessage(e, "JSONPath set and append operations are allowed only in trusted scriptlets"), 
      r;
      if ("remove" === L.mutation.mode) return function(e) {
        for (var r = new Set, t = new Map, a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (null !== n.parent && null !== n.key && !r.has(n.path)) if (r.add(n.path), Array.isArray(n.parent)) {
            var i = t.get(n.parent) || [];
            i.push(Number(n.key)), t.set(n.parent, i);
          } else delete n.parent[n.key], markMutated();
        }
        t.forEach((function(e, r) {
          for (var t = Array.from(new Set(e)).sort((function(e, r) {
            return r - e;
          })), a = 0; a < t.length; a += 1) {
            var n = t[a];
            n >= 0 && n < r.length && (r.splice(n, 1), markMutated());
          }
        }));
      }(M), W && n && n(), r;
      L.mutation.updater && (r = function(e, r, t) {
        for (var a = new Set, n = e, i = 0; i < r.length; i += 1) {
          var s = r[i];
          a.has(s.path) || (a.add(s.path), null !== s.parent || null !== s.key || s.path !== o ? null !== s.parent && null !== s.key && (s.parent[s.key] = t(s.parent[s.key]), 
          markMutated()) : (n = t(n), markMutated()));
        }
        return n;
      }(r, M, L.mutation.updater), W && n && n());
    } catch (r) {
      logMessage(e, `JSONPath processing failed for expression '${t}': ${r.message}`);
    }
    return r;
  }
  function getJsonSetValue(e, t) {
    return t.shouldReplaceArgument ? "string" == typeof e ? e.replace(t.replaceRegexValue, t.constantValue) : e : t.shouldMergeJsonValue && null !== e && "object" == typeof e && !Array.isArray(e) && null !== t.constantValue && "object" == typeof t.constantValue && !Array.isArray(t.constantValue) ? Object.assign({}, e, t.constantValue) : t.constantValue;
  }
  function parseJsonSetArgumentValue(e, l, a) {
    var r, n = "json:", s = "replace:", o = "", t = false, u = false, i = false;
    if (l.startsWith(s)) {
      var c = extractRegexAndReplacement(l);
      if (!c) return logMessage(e, `Invalid argument value format: ${l}`), null;
      o = c.regexPart, i = (r = parseKeywordValue(c.replacementPart)) !== c.replacementPart, 
      t = true;
    } else if (l.startsWith(n)) try {
      var f = l.slice(n.length), p = parseKeywordValue(f);
      i = p !== f, r = a(p), u = !0;
    } catch (a) {
      return logMessage(e, `Invalid JSON argument value: ${l}`), null;
    } else {
      var m = noopArray(), d = noopObject(), g = parseKeywordValue(l);
      if (i = g !== l, "undefined" === g) r = void 0; else if ("false" === g) r = false; else if ("true" === g) r = true; else if ("null" === g) r = null; else if ("NaN" === g) r = NaN; else if ("emptyArr" === g || "[]" === g) r = m; else if ("emptyObj" === g || "{}" === g) r = d; else if ("noopFunc" === g) r = noopFunc; else if ("noopCallbackFunc" === g) r = noopCallbackFunc; else if ("trueFunc" === g) r = trueFunc; else if ("falseFunc" === g) r = falseFunc; else if ("throwFunc" === g) r = throwFunc; else if ("noopPromiseResolve" === g) r = noopPromiseResolve; else if ("noopPromiseReject" === g) r = noopPromiseReject; else if (/^-?\d+$/.test(g)) {
        if (r = parseFloat(g), nativeIsNaN(r)) return null;
      } else r = g;
    }
    return {
      constantValue: r,
      replaceRegexValue: o,
      shouldReplaceArgument: t,
      shouldMergeJsonValue: u,
      hasTimeKeywords: i
    };
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopCallbackFunc() {
    return noopFunc;
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  function getPrunePath(t) {
    var r = ".[=].";
    if ("string" == typeof t && void 0 !== t && "" !== t) {
      var e = function(t) {
        for (var e = [], n = "", i = 0, a = false, s = false; i < t.length; ) {
          var u = t[i];
          if (a) n += u, "\\" === u ? s = !s : ("/" !== u || s || (a = false), s = false), 
          i += 1; else {
            if (" " === u || "\n" === u || "\t" === u || "\r" === u || "\f" === u || "\v" === u) {
              for (;i < t.length && /\s/.test(t[i]); ) i += 1;
              "" !== n && (e.push(n), n = "");
              continue;
            }
            if (t.startsWith(r, i)) {
              if (n += r, "/" === t[i += 5]) {
                a = true, s = false, n += "/", i += 1;
                continue;
              }
              continue;
            }
            n += u, i += 1;
          }
        }
        return "" !== n && e.push(n), e;
      }(t);
      return e.map((function(t) {
        var e = t.split(r), n = e[0], i = e[1];
        return void 0 !== i ? ("true" === i ? i = true : "false" === i ? i = false : i.startsWith("/") ? i = toRegExp(i) : "string" == typeof i && /^\d+$/.test(i) && (i = parseFloat(i)), 
        {
          path: n,
          value: i
        }) : {
          path: n
        };
      }));
    }
    return [];
  }
  function forgeResponse(e, t) {
    var {bodyUsed: s, headers: r, ok: u, redirected: a, status: d, statusText: o, type: l, url: n} = e, v = new Response(t, {
      status: d,
      statusText: o,
      headers: r
    });
    return Object.defineProperties(v, {
      url: {
        value: n
      },
      type: {
        value: l
      },
      ok: {
        value: u
      },
      bodyUsed: {
        value: s
      },
      redirected: {
        value: a
      }
    }), v;
  }
  function isPruningNeeded(n, t, r, e, a, i) {
    if (!t) return false;
    var o, {nativeStringify: u} = i, c = r.map((function(n) {
      return n.path;
    })), f = e.map((function(n) {
      return n.path;
    }));
    if (0 === c.length && f.length > 0) {
      var g = u(t);
      if (toRegExp(f.join("")).test(g)) return logMessage(n, `${window.location.hostname}\n${u(t, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
      t && "object" == typeof t && logMessage(n, t, true, false), o = false;
    }
    if (a && !matchStackTrace(a, (new Error).stack || "")) return o = false;
    for (var s, l = [ ".*.", "*.", ".*", ".[].", "[].", ".[]" ], _loop = function _loop() {
      var n = f[p], r = n.split(".").pop(), e = l.some((function(t) {
        return n.includes(t);
      })), a = getWildcardPropertyInChain(t, n, e);
      if (!a.length) return {
        v: o = false
      };
      o = !e;
      for (var i = 0; i < a.length; i += 1) {
        var u = "string" == typeof r && void 0 !== a[i].base[r];
        o = e ? u || o : u && o;
      }
    }, p = 0; p < f.length; p += 1) if (s = _loop()) return s.v;
    return o;
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function resolveJsonSyntaxMode(t, r) {
    var e = "legacy", o = "jsonpath", s = "string" == typeof r ? r.trim().toLowerCase() : "";
    if (s === e || s === o) return {
      mode: s
    };
    var a = "string" == typeof t ? t.trim() : "";
    return a.startsWith("$") || a.startsWith("[?") || a.startsWith(".") ? {
      mode: o
    } : {
      mode: e
    };
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getRequestData(t) {
    var e = getRequestProps().map((function(e) {
      return [ e, t[e] ];
    }));
    return Object.fromEntries(e);
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getWildcardPropertyInChain(r, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [], t = arguments.length > 4 ? arguments[4] : void 0, o = e.indexOf(".");
    if (-1 === o) {
      if ("*" === e || "[]" === e) {
        for (var n in r) if (Object.prototype.hasOwnProperty.call(r, n)) if (void 0 !== t) {
          var s = r[n];
          "string" == typeof s && t instanceof RegExp ? t.test(s) && i.push({
            base: r,
            prop: n
          }) : s === t && i.push({
            base: r,
            prop: n
          });
        } else i.push({
          base: r,
          prop: n
        });
      } else if (void 0 !== t) {
        var p = r[e];
        "string" == typeof p && t instanceof RegExp ? t.test(p) && i.push({
          base: r,
          prop: e
        }) : r[e] === t && i.push({
          base: r,
          prop: e
        });
      } else i.push({
        base: r,
        prop: e
      });
      return i;
    }
    var c = e.slice(0, o);
    if ("[]" === c && Array.isArray(r) || "*" === c && r instanceof Object || "[-]" === c && Array.isArray(r) || "{-}" === c && r instanceof Object) {
      var f = e.slice(o + 1), y = Object.keys(r);
      if ("{-}" === c || "[-]" === c) {
        var h = Array.isArray(r) ? "array" : "object";
        return ("{-}" !== c || "object" !== h) && ("[-]" !== c || "array" !== h) || y.forEach((function(e) {
          var a = r[e];
          isKeyInObject(a, f, t) && i.push({
            base: r,
            prop: e
          });
        })), i;
      }
      y.forEach((function(e) {
        getWildcardPropertyInChain(r[e], f, a, i, t);
      }));
    }
    Array.isArray(r) && r.forEach((function(r) {
      void 0 !== r && getWildcardPropertyInChain(r, e, a, i, t);
    }));
    var d = r[c];
    return e = e.slice(o + 1), void 0 !== d && getWildcardPropertyInChain(d, e, a, i, t), 
    i;
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function isKeyInObject(t, r, e) {
    var n = r.split("."), _check4 = function _check(t, r) {
      if (null == t) return false;
      if (0 === r.length) return void 0 === e || ("string" == typeof t && e instanceof RegExp ? e.test(t) : t === e);
      var n = r[0], i = r.slice(1);
      if ("*" === n || "[]" === n) {
        if (Array.isArray(t)) return t.some((function(t) {
          return _check4(t, i);
        }));
        if ("object" == typeof t && null !== t) return Object.keys(t).some((function(r) {
          return _check4(t[r], i);
        }));
      }
      return !!Object.prototype.hasOwnProperty.call(t, n) && _check4(t[n], i);
    };
    return _check4(t, n);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    jsonPruneFetchResponse.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedReplaceNodeText":function trustedReplaceNodeText(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceNodeText(source, nodeName, textMatch, pattern, replacement) {
    var fixQuotes = function fixQuotes(str) {
      if (typeof str !== "string") {
        return str;
      }
      return str.replace(/\\'/g, "'").replace(/\\"/g, '"');
    };
    var fixedPattern = fixQuotes(pattern);
    var fixedReplacement = fixQuotes(replacement);
    var {selector: selector, nodeNameMatch: nodeNameMatch, textContentMatch: textContentMatch, patternMatch: patternMatch} = parseNodeTextParams(nodeName, textMatch, fixedPattern);
    for (var _len = arguments.length, extraArgs = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      extraArgs[_key - 5] = arguments[_key];
    }
    var shouldLog = extraArgs.includes("verbose");
    var handleNodes = function handleNodes(nodes) {
      return nodes.forEach((function(node) {
        var shouldReplace = isTargetNode(node, nodeNameMatch, textContentMatch);
        if (shouldReplace) {
          if (shouldLog) {
            var originalText = node.textContent;
            if (originalText) {
              logMessage(source, `Original text content: ${originalText}`);
            }
          }
          replaceNodeText(source, node, patternMatch, fixedReplacement);
          if (shouldLog) {
            var modifiedText = node.textContent;
            if (modifiedText) {
              logMessage(source, `Modified text content: ${modifiedText}`);
            }
          }
        }
      }));
    };
    if (document.documentElement) {
      handleExistingNodes(selector, handleNodes);
    }
    observeDocumentWithTimeout((function(mutations) {
      return handleMutations(mutations, handleNodes);
    }));
  }
  function observeDocumentWithTimeout(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
      subtree: true,
      childList: true
    }, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e4, o = new MutationObserver((function(n, o) {
      o.disconnect(), e(n, o), o.observe(document.documentElement, t);
    }));
    o.observe(document.documentElement, t), "number" == typeof n && setTimeout((function() {
      return o.disconnect();
    }), n);
  }
  function handleExistingNodes(e, n, o) {
    [ document ].forEach((function(o) {
      return function(o) {
        if ("#text" === e) {
          var r = nodeListToArray(o.childNodes).filter((function(e) {
            return e.nodeType === Node.TEXT_NODE;
          }));
          n(r);
        } else {
          var t = nodeListToArray(o.querySelectorAll(e));
          n(t);
        }
      }(o);
    }));
  }
  function handleMutations(n, d, e, o) {
    var t = getAddedNodes(n);
    d(t);
  }
  function replaceNodeText(e, t, n, r) {
    var {textContent: a} = t;
    if (a) {
      var i = a.replace(n, r);
      if ("SCRIPT" === t.nodeName) i = getTrustedTypesApi(e).createScript(i);
      t.textContent = i, hit(e);
    }
  }
  function isTargetNode(e, t, n) {
    var {nodeName: o, textContent: s} = e, a = o.toLowerCase();
    return null !== s && "" !== s && (t instanceof RegExp ? t.test(a) : t === a) && (n instanceof RegExp ? n.test(s) : s.includes(n));
  }
  function parseNodeTextParams(t, e) {
    var a, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, r = "/", s = !(t.startsWith(r) && t.endsWith(r)), o = s ? t : "*", h = s ? t : toRegExp(t), i = e.startsWith(r) ? toRegExp(e) : e;
    return n && (a = n.startsWith(r) ? toRegExp(n) : n), {
      selector: o,
      nodeNameMatch: h,
      textContentMatch: i,
      patternMatch: a
    };
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function nodeListToArray(r) {
    for (var n = [], o = 0; o < r.length; o += 1) n.push(r[o]);
    return n;
  }
  function getAddedNodes(d) {
    for (var e = [], r = 0; r < d.length; r += 1) for (var {addedNodes: n} = d[r], o = 0; o < n.length; o += 1) e.push(n[o]);
    return e;
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getTrustedTypesApi(t) {
    var r, e = null == t || null === (r = t.api) || void 0 === r ? void 0 : r.policy;
    if (e) return e;
    var n = "AGPolicy", i = window.trustedTypes, u = !!i, c = {
      HTML: "TrustedHTML",
      Script: "TrustedScript",
      ScriptURL: "TrustedScriptURL"
    };
    if (!u) return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      },
      create: function create(t, r) {
        return r;
      },
      getAttributeType: function getAttributeType() {
        return null;
      },
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e) {
        return e;
      },
      getPropertyType: function getPropertyType() {
        return null;
      },
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e) {
        return e;
      },
      isHTML: function isHTML() {
        return false;
      },
      isScript: function isScript() {
        return false;
      },
      isScriptURL: function isScriptURL() {
        return false;
      }
    };
    var o = i.createPolicy(n, {
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      }
    }), createHTML = function createHTML(t) {
      return o.createHTML(t);
    }, createScript = function createScript(t) {
      return o.createScript(t);
    }, createScriptURL = function createScriptURL(t) {
      return o.createScriptURL(t);
    }, create = function create(t, r) {
      switch (t) {
       case c.HTML:
        return createHTML(r);

       case c.Script:
        return createScript(r);

       case c.ScriptURL:
        return createScriptURL(r);

       default:
        return r;
      }
    }, p = i.getAttributeType.bind(i), T = i.getPropertyType.bind(i), s = i.isHTML.bind(i), a = i.isScript.bind(i), f = i.isScriptURL.bind(i);
    return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: createHTML,
      createScript: createScript,
      createScriptURL: createScriptURL,
      create: create,
      getAttributeType: p,
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e, n, i) {
        var u = p(t, r, n, i);
        return u ? create(u, e) : e;
      },
      getPropertyType: T,
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e, n) {
        var i = T(t, r, n);
        return i ? create(i, e) : e;
      },
      isHTML: s,
      isScript: a,
      isScriptURL: f
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceNodeText.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"evalDataPrune":function evalDataPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function evalDataPrune(source, propsToRemove, requiredInitialProps, stack) {
    var prunePaths = getPrunePath(propsToRemove);
    var requiredPaths = getPrunePath(requiredInitialProps);
    var nativeObjects = {
      nativeStringify: window.JSON.stringify
    };
    var evalWrapper = function evalWrapper(target, thisArg, args) {
      var data = Reflect.apply(target, thisArg, args);
      if (typeof data === "object") {
        data = jsonPruner(source, data, prunePaths, requiredPaths, stack, nativeObjects);
      }
      return data;
    };
    var evalHandler = {
      apply: evalWrapper
    };
    window.eval = new Proxy(window.eval, evalHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getWildcardPropertyInChain(r, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [], t = arguments.length > 4 ? arguments[4] : void 0, o = e.indexOf(".");
    if (-1 === o) {
      if ("*" === e || "[]" === e) {
        for (var n in r) if (Object.prototype.hasOwnProperty.call(r, n)) if (void 0 !== t) {
          var s = r[n];
          "string" == typeof s && t instanceof RegExp ? t.test(s) && i.push({
            base: r,
            prop: n
          }) : s === t && i.push({
            base: r,
            prop: n
          });
        } else i.push({
          base: r,
          prop: n
        });
      } else if (void 0 !== t) {
        var p = r[e];
        "string" == typeof p && t instanceof RegExp ? t.test(p) && i.push({
          base: r,
          prop: e
        }) : r[e] === t && i.push({
          base: r,
          prop: e
        });
      } else i.push({
        base: r,
        prop: e
      });
      return i;
    }
    var c = e.slice(0, o);
    if ("[]" === c && Array.isArray(r) || "*" === c && r instanceof Object || "[-]" === c && Array.isArray(r) || "{-}" === c && r instanceof Object) {
      var f = e.slice(o + 1), y = Object.keys(r);
      if ("{-}" === c || "[-]" === c) {
        var h = Array.isArray(r) ? "array" : "object";
        return ("{-}" !== c || "object" !== h) && ("[-]" !== c || "array" !== h) || y.forEach((function(e) {
          var a = r[e];
          isKeyInObject(a, f, t) && i.push({
            base: r,
            prop: e
          });
        })), i;
      }
      y.forEach((function(e) {
        getWildcardPropertyInChain(r[e], f, a, i, t);
      }));
    }
    Array.isArray(r) && r.forEach((function(r) {
      void 0 !== r && getWildcardPropertyInChain(r, e, a, i, t);
    }));
    var d = r[c];
    return e = e.slice(o + 1), void 0 !== d && getWildcardPropertyInChain(d, e, a, i, t), 
    i;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isPruningNeeded(n, t, r, e, a, i) {
    if (!t) return false;
    var o, {nativeStringify: u} = i, c = r.map((function(n) {
      return n.path;
    })), f = e.map((function(n) {
      return n.path;
    }));
    if (0 === c.length && f.length > 0) {
      var g = u(t);
      if (toRegExp(f.join("")).test(g)) return logMessage(n, `${window.location.hostname}\n${u(t, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
      t && "object" == typeof t && logMessage(n, t, true, false), o = false;
    }
    if (a && !matchStackTrace(a, (new Error).stack || "")) return o = false;
    for (var s, l = [ ".*.", "*.", ".*", ".[].", "[].", ".[]" ], _loop = function _loop() {
      var n = f[p], r = n.split(".").pop(), e = l.some((function(t) {
        return n.includes(t);
      })), a = getWildcardPropertyInChain(t, n, e);
      if (!a.length) return {
        v: o = false
      };
      o = !e;
      for (var i = 0; i < a.length; i += 1) {
        var u = "string" == typeof r && void 0 !== a[i].base[r];
        o = e ? u || o : u && o;
      }
    }, p = 0; p < f.length; p += 1) if (s = _loop()) return s.v;
    return o;
  }
  function jsonPruner(e, r, n, a, t, i) {
    var {nativeStringify: o} = i;
    if (0 === n.length && 0 === a.length) return logMessage(e, `${window.location.hostname}\n${o(r, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
    r && "object" == typeof r && logMessage(e, r, true, false), r;
    try {
      if (!1 === isPruningNeeded(e, r, n, a, t, i)) return r;
      n.forEach((function(n) {
        for (var a = n.path, t = n.value, i = getWildcardPropertyInChain(r, a, !0, [], t), o = i.length - 1; o >= 0; o -= 1) {
          var s = i[o];
          if (void 0 !== s && s.base) if (hit(e), Array.isArray(s.base)) try {
            var l = Number(s.prop);
            if (Number.isNaN(l)) continue;
            s.base.splice(l, 1);
          } catch (e) {
            console.error("Error while deleting array element", e);
          } else delete s.base[s.prop];
        }
      }));
    } catch (r) {
      logMessage(e, r);
    }
    return r;
  }
  function getPrunePath(t) {
    var r = ".[=].";
    if ("string" == typeof t && void 0 !== t && "" !== t) {
      var e = function(t) {
        for (var e = [], n = "", i = 0, a = false, s = false; i < t.length; ) {
          var u = t[i];
          if (a) n += u, "\\" === u ? s = !s : ("/" !== u || s || (a = false), s = false), 
          i += 1; else {
            if (" " === u || "\n" === u || "\t" === u || "\r" === u || "\f" === u || "\v" === u) {
              for (;i < t.length && /\s/.test(t[i]); ) i += 1;
              "" !== n && (e.push(n), n = "");
              continue;
            }
            if (t.startsWith(r, i)) {
              if (n += r, "/" === t[i += 5]) {
                a = true, s = false, n += "/", i += 1;
                continue;
              }
              continue;
            }
            n += u, i += 1;
          }
        }
        return "" !== n && e.push(n), e;
      }(t);
      return e.map((function(t) {
        var e = t.split(r), n = e[0], i = e[1];
        return void 0 !== i ? ("true" === i ? i = true : "false" === i ? i = false : i.startsWith("/") ? i = toRegExp(i) : "string" == typeof i && /^\d+$/.test(i) && (i = parseFloat(i)), 
        {
          path: n,
          value: i
        }) : {
          path: n
        };
      }));
    }
    return [];
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function isKeyInObject(t, r, e) {
    var n = r.split("."), _check2 = function _check(t, r) {
      if (null == t) return false;
      if (0 === r.length) return void 0 === e || ("string" == typeof t && e instanceof RegExp ? e.test(t) : t === e);
      var n = r[0], i = r.slice(1);
      if ("*" === n || "[]" === n) {
        if (Array.isArray(t)) return t.some((function(t) {
          return _check2(t, i);
        }));
        if ("object" == typeof t && null !== t) return Object.keys(t).some((function(r) {
          return _check2(t[r], i);
        }));
      }
      return !!Object.prototype.hasOwnProperty.call(t, n) && _check2(t[n], i);
    };
    return _check2(t, n);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    evalDataPrune.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedReplaceXhrResponse":function trustedReplaceXhrResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceXhrResponse(source) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (typeof Proxy === "undefined") {
      return;
    }
    if (pattern === "" && replacement !== "") {
      var message = "Pattern argument should not be empty string.";
      logMessage(source, message);
      return;
    }
    var shouldLog = pattern === "" && replacement === "";
    var shouldLogContent = verbose === "true";
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var matchedXhrRequests = new Set;
    var xhrRequestHeaders = new Map;
    var forgedRequests = new WeakMap;
    var xhrData;
    var openWrapper = function openWrapper(target, thisArg, args) {
      xhrData = getXhrData.apply(null, args);
      if (shouldLog) {
        var _message = `xhr( ${objectToString(xhrData)} )`;
        logMessage(source, _message, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      if (matchRequestProps(source, propsToMatch, xhrData)) {
        matchedXhrRequests.add(thisArg);
      }
      if (matchedXhrRequests.has(thisArg) && !xhrRequestHeaders.has(thisArg)) {
        xhrRequestHeaders.set(thisArg, []);
        var setRequestHeaderWrapper = function setRequestHeaderWrapper(target, thisArg, args) {
          var headers = xhrRequestHeaders.get(thisArg);
          if (headers) {
            headers.push(args);
          }
          return Reflect.apply(target, thisArg, args);
        };
        var setRequestHeaderHandler = {
          apply: setRequestHeaderWrapper
        };
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
        var responseHeaderWrapper = function responseHeaderWrapper(target, thisArg, args) {
          var forgedRequest = forgedRequests.get(thisArg);
          if (forgedRequest) {
            return Reflect.apply(target, forgedRequest, args);
          }
          return Reflect.apply(target, thisArg, args);
        };
        var responseHeaderHandler = {
          apply: responseHeaderWrapper
        };
        thisArg.getResponseHeader = new Proxy(thisArg.getResponseHeader, responseHeaderHandler);
        thisArg.getAllResponseHeaders = new Proxy(thisArg.getAllResponseHeaders, responseHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      if (!matchedXhrRequests.has(thisArg)) {
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.withCredentials = thisArg.withCredentials;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string") {
          return;
        }
        var patternRegexp = pattern === "*" ? /(\n|.)*/ : toRegExp(pattern);
        var isPatternFound = pattern === "*" || patternRegexp.test(content);
        var responseContent = content;
        if (isPatternFound) {
          if (shouldLogContent) {
            logMessage(source, `Original text content: ${content}`);
          }
          responseContent = content.replace(patternRegexp, replacement);
          if (shouldLogContent) {
            logMessage(source, `Modified text content: ${responseContent}`);
          }
        }
        Object.defineProperties(thisArg, {
          readyState: {
            value: readyState,
            writable: false
          },
          responseURL: {
            value: responseURL,
            writable: false
          },
          responseXML: {
            value: responseXML,
            writable: false
          },
          status: {
            value: status,
            writable: false
          },
          statusText: {
            value: statusText,
            writable: false
          },
          response: {
            value: responseContent,
            writable: false
          },
          responseText: {
            value: responseContent,
            writable: false
          }
        });
        forgedRequests.set(thisArg, forgedRequest);
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new ProgressEvent("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new ProgressEvent("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        if (isPatternFound) {
          hit(source);
        }
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url ]);
      var collectedHeaders = xhrRequestHeaders.get(thisArg) || [];
      collectedHeaders.forEach((function(header) {
        var name = header[0];
        var value = header[1];
        forgedRequest.setRequestHeader(name, value);
      }));
      xhrRequestHeaders.delete(thisArg);
      matchedXhrRequests.delete(thisArg);
      try {
        Reflect.apply(nativeSend, forgedRequest, args);
      } catch (_unused) {
        return Reflect.apply(target, thisArg, args);
      }
      return undefined;
    };
    var openHandler = {
      apply: openWrapper
    };
    var sendHandler = {
      apply: sendWrapper
    };
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, openHandler);
    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, sendHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceXhrResponse.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"noeval":function noeval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function noeval(source) {
    window.eval = function evalWrapper(s) {
      hit(source);
      logMessage(source, `AdGuard has prevented eval:\n${s}`, true);
    }.bind();
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    noeval.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"nowebrtc":function nowebrtc(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function nowebrtc(source) {
    var propertyName = "";
    if (window.RTCPeerConnection) {
      propertyName = "RTCPeerConnection";
    } else if (window.webkitRTCPeerConnection) {
      propertyName = "webkitRTCPeerConnection";
    }
    if (propertyName === "") {
      return;
    }
    var rtcReplacement = function rtcReplacement(config) {
      var message = `Document tried to create an RTCPeerConnection: ${convertRtcConfigToString(config)}`;
      logMessage(source, message);
      hit(source);
    };
    rtcReplacement.prototype = {
      close: noopFunc,
      createDataChannel: noopFunc,
      createOffer: noopFunc,
      setRemoteDescription: noopFunc
    };
    var rtc = window[propertyName];
    window[propertyName] = rtcReplacement;
    if (rtc.prototype) {
      rtc.prototype.createDataChannel = function(a, b) {
        return {
          close: noopFunc,
          send: noopFunc
        };
      }.bind(null);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function convertRtcConfigToString(e) {
    var t = "undefined";
    if (null === e) t = "null"; else if (e instanceof Object) {
      var r = "iceServers", n = "urls";
      Object.prototype.hasOwnProperty.call(e, r) && e[r] && Object.prototype.hasOwnProperty.call(e[r][0], n) && e[r][0][n] && (t = e[r][0][n].toString());
    }
    return t;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    nowebrtc.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventFab":function preventFab(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventFab(source) {
    hit(source);
    var Fab = function Fab() {};
    Fab.prototype.check = noopFunc;
    Fab.prototype.clearEvent = noopFunc;
    Fab.prototype.emitEvent = noopFunc;
    Fab.prototype.on = function(a, b) {
      if (!a) {
        b();
      }
      return this;
    };
    Fab.prototype.onDetected = noopThis;
    Fab.prototype.onNotDetected = function(a) {
      a();
      return this;
    };
    Fab.prototype.setOption = noopFunc;
    Fab.prototype.options = {
      set: noopFunc,
      get: noopFunc
    };
    var fab = new Fab;
    var getSetFab = {
      get() {
        return Fab;
      },
      set() {}
    };
    var getsetfab = {
      get() {
        return fab;
      },
      set() {}
    };
    if (Object.prototype.hasOwnProperty.call(window, "FuckAdBlock")) {
      window.FuckAdBlock = Fab;
    } else {
      Object.defineProperty(window, "FuckAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "BlockAdBlock")) {
      window.BlockAdBlock = Fab;
    } else {
      Object.defineProperty(window, "BlockAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "SniffAdBlock")) {
      window.SniffAdBlock = Fab;
    } else {
      Object.defineProperty(window, "SniffAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "fuckAdBlock")) {
      window.fuckAdBlock = fab;
    } else {
      Object.defineProperty(window, "fuckAdBlock", getsetfab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "blockAdBlock")) {
      window.blockAdBlock = fab;
    } else {
      Object.defineProperty(window, "blockAdBlock", getsetfab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "sniffAdBlock")) {
      window.sniffAdBlock = fab;
    } else {
      Object.defineProperty(window, "sniffAdBlock", getsetfab);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function noopThis() {
    return this;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventFab.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventPopadsNet":function preventPopadsNet(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventPopadsNet(source) {
    var rid = randomId();
    var throwError = function throwError() {
      throw new ReferenceError(rid);
    };
    delete window.PopAds;
    delete window.popns;
    Object.defineProperties(window, {
      PopAds: {
        set: throwError
      },
      popns: {
        set: throwError
      }
    });
    window.onerror = createOnErrorHandler(rid).bind();
    hit(source);
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventPopadsNet.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setPopadsDummy":function setPopadsDummy(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setPopadsDummy(source) {
    delete window.PopAds;
    delete window.popns;
    Object.defineProperties(window, {
      PopAds: {
        get: function get() {
          hit(source);
          return {};
        }
      },
      popns: {
        get: function get() {
          hit(source);
          return {};
        }
      }
    });
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setPopadsDummy.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventRequestAnimationFrame":function preventRequestAnimationFrame(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventRequestAnimationFrame(source, match) {
    var nativeRequestAnimationFrame = window.requestAnimationFrame;
    var shouldLog = typeof match === "undefined";
    var {isInvertedMatch: isInvertedMatch, matchRegexp: matchRegexp} = parseMatchArg(match);
    var rafWrapper = function rafWrapper(callback) {
      var shouldPrevent = false;
      if (shouldLog) {
        hit(source);
        logMessage(source, `requestAnimationFrame(${callbackToString(callback)})`, true);
      } else if (isValidCallback(callback) && isValidStrPattern(match)) {
        shouldPrevent = matchRegexp.test(callbackToString(callback)) !== isInvertedMatch;
      }
      if (shouldPrevent) {
        hit(source);
        return nativeRequestAnimationFrame(noopFunc);
      }
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return nativeRequestAnimationFrame.apply(window, [ callback, ...args ]);
    };
    window.requestAnimationFrame = rafWrapper;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function noopFunc() {}
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventRequestAnimationFrame.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"removeCookie":function removeCookie(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeCookie(source, match) {
    var matchRegexp = toRegExp(match);
    var removeCookieFromHost = function removeCookieFromHost(cookieName, hostName) {
      var cookieSpec = `${cookieName}=`;
      var domain1 = `; domain=${hostName}`;
      var domain2 = `; domain=.${hostName}`;
      var path = "; path=/";
      var expiration = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = cookieSpec + expiration;
      document.cookie = cookieSpec + domain1 + expiration;
      document.cookie = cookieSpec + domain2 + expiration;
      document.cookie = cookieSpec + path + expiration;
      document.cookie = cookieSpec + domain1 + path + expiration;
      document.cookie = cookieSpec + domain2 + path + expiration;
      hit(source);
    };
    var rmCookie = function rmCookie() {
      document.cookie.split(";").forEach((function(cookieStr) {
        var pos = cookieStr.indexOf("=");
        if (pos === -1) {
          return;
        }
        var cookieName = cookieStr.slice(0, pos).trim();
        if (!matchRegexp.test(cookieName)) {
          return;
        }
        var hostParts = document.location.hostname.split(".");
        for (var i = 0; i <= hostParts.length - 1; i += 1) {
          var hostName = hostParts.slice(i).join(".");
          if (hostName) {
            removeCookieFromHost(cookieName, hostName);
          }
        }
      }));
    };
    rmCookie();
    window.addEventListener("beforeunload", rmCookie);
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeCookie.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"hrefSanitizer":function hrefSanitizer(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function hrefSanitizer(source, selector) {
    var attribute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "text";
    var transform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    if (!selector) {
      logMessage(source, "Selector is required.");
      return;
    }
    var BASE64_DECODE_TRANSFORM_MARKER = new Set([ "base64decode", "-base64" ]);
    var REMOVE_HASH_TRANSFORM_MARKER = "removeHash";
    var REMOVE_PARAM_TRANSFORM_MARKER = "removeParam";
    var MARKER_SEPARATOR = ":";
    var COMMA = ",";
    var regexpNotValidAtStart = /^[^!-~\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{10300}-\u{1031F}\u{1032D}-\u{10340}\u{10342}-\u{10349}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{103A0}-\u{103C3}\u{103C8}-\u{103CF}\u{10400}-\u{1049D}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{10570}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{105C0}-\u{105F3}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10860}-\u{10876}\u{10880}-\u{1089E}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{10900}-\u{10915}\u{10920}-\u{10939}\u{10980}-\u{109B7}\u{109BE}\u{109BF}\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A60}-\u{10A7C}\u{10A80}-\u{10A9C}\u{10AC0}-\u{10AC7}\u{10AC9}-\u{10AE4}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B60}-\u{10B72}\u{10B80}-\u{10B91}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10D00}-\u{10D23}\u{10D4A}-\u{10D65}\u{10D6F}-\u{10D85}\u{10E80}-\u{10EA9}\u{10EB0}\u{10EB1}\u{10EC2}-\u{10EC4}\u{10F00}-\u{10F1C}\u{10F27}\u{10F30}-\u{10F45}\u{10F70}-\u{10F81}\u{10FB0}-\u{10FC4}\u{10FE0}-\u{10FF6}\u{11003}-\u{11037}\u{11071}\u{11072}\u{11075}\u{11083}-\u{110AF}\u{110D0}-\u{110E8}\u{11103}-\u{11126}\u{11144}\u{11147}\u{11150}-\u{11172}\u{11176}\u{11183}-\u{111B2}\u{111C1}-\u{111C4}\u{111DA}\u{111DC}\u{11200}-\u{11211}\u{11213}-\u{1122B}\u{1123F}\u{11240}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A8}\u{112B0}-\u{112DE}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}\u{11350}\u{1135D}-\u{11361}\u{11380}-\u{11389}\u{1138B}\u{1138E}\u{11390}-\u{113B5}\u{113B7}\u{113D1}\u{113D3}\u{11400}-\u{11434}\u{11447}-\u{1144A}\u{1145F}-\u{11461}\u{11480}-\u{114AF}\u{114C4}\u{114C5}\u{114C7}\u{11580}-\u{115AE}\u{115D8}-\u{115DB}\u{11600}-\u{1162F}\u{11644}\u{11680}-\u{116AA}\u{116B8}\u{11700}-\u{1171A}\u{11740}-\u{11746}\u{11800}-\u{1182B}\u{118A0}-\u{118DF}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{1192F}\u{1193F}\u{11941}\u{119A0}-\u{119A7}\u{119AA}-\u{119D0}\u{119E1}\u{119E3}\u{11A00}\u{11A0B}-\u{11A32}\u{11A3A}\u{11A50}\u{11A5C}-\u{11A89}\u{11A9D}\u{11AB0}-\u{11AF8}\u{11BC0}-\u{11BE0}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2E}\u{11C40}\u{11C72}-\u{11C8F}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D89}\u{11D98}\u{11EE0}-\u{11EF2}\u{11F02}\u{11F04}-\u{11F10}\u{11F12}-\u{11F33}\u{11FB0}\u{12000}-\u{12399}\u{12480}-\u{12543}\u{12F90}-\u{12FF0}\u{13000}-\u{1342F}\u{13441}-\u{13446}\u{13460}-\u{143FA}\u{14400}-\u{14646}\u{16100}-\u{1611D}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A70}-\u{16ABE}\u{16AD0}-\u{16AED}\u{16B00}-\u{16B2F}\u{16B40}-\u{16B43}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16D40}-\u{16D6C}\u{16E40}-\u{16E7F}\u{16F00}-\u{16F4A}\u{16F50}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18CFF}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6C0}\u{1D6C2}-\u{1D6DA}\u{1D6DC}-\u{1D6FA}\u{1D6FC}-\u{1D714}\u{1D716}-\u{1D734}\u{1D736}-\u{1D74E}\u{1D750}-\u{1D76E}\u{1D770}-\u{1D788}\u{1D78A}-\u{1D7A8}\u{1D7AA}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E030}-\u{1E06D}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E14E}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E4D0}-\u{1E4EB}\u{1E5D0}-\u{1E5ED}\u{1E5F0}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1E800}-\u{1E8C4}\u{1E900}-\u{1E943}\u{1E94B}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2EBF0}-\u{2EE5D}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}]+/u;
    var regexpNotValidAtEnd = /[^!-~\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{10300}-\u{1031F}\u{1032D}-\u{10340}\u{10342}-\u{10349}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{103A0}-\u{103C3}\u{103C8}-\u{103CF}\u{10400}-\u{1049D}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{10570}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{105C0}-\u{105F3}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10860}-\u{10876}\u{10880}-\u{1089E}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{10900}-\u{10915}\u{10920}-\u{10939}\u{10980}-\u{109B7}\u{109BE}\u{109BF}\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A60}-\u{10A7C}\u{10A80}-\u{10A9C}\u{10AC0}-\u{10AC7}\u{10AC9}-\u{10AE4}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B60}-\u{10B72}\u{10B80}-\u{10B91}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10D00}-\u{10D23}\u{10D4A}-\u{10D65}\u{10D6F}-\u{10D85}\u{10E80}-\u{10EA9}\u{10EB0}\u{10EB1}\u{10EC2}-\u{10EC4}\u{10F00}-\u{10F1C}\u{10F27}\u{10F30}-\u{10F45}\u{10F70}-\u{10F81}\u{10FB0}-\u{10FC4}\u{10FE0}-\u{10FF6}\u{11003}-\u{11037}\u{11071}\u{11072}\u{11075}\u{11083}-\u{110AF}\u{110D0}-\u{110E8}\u{11103}-\u{11126}\u{11144}\u{11147}\u{11150}-\u{11172}\u{11176}\u{11183}-\u{111B2}\u{111C1}-\u{111C4}\u{111DA}\u{111DC}\u{11200}-\u{11211}\u{11213}-\u{1122B}\u{1123F}\u{11240}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A8}\u{112B0}-\u{112DE}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}\u{11350}\u{1135D}-\u{11361}\u{11380}-\u{11389}\u{1138B}\u{1138E}\u{11390}-\u{113B5}\u{113B7}\u{113D1}\u{113D3}\u{11400}-\u{11434}\u{11447}-\u{1144A}\u{1145F}-\u{11461}\u{11480}-\u{114AF}\u{114C4}\u{114C5}\u{114C7}\u{11580}-\u{115AE}\u{115D8}-\u{115DB}\u{11600}-\u{1162F}\u{11644}\u{11680}-\u{116AA}\u{116B8}\u{11700}-\u{1171A}\u{11740}-\u{11746}\u{11800}-\u{1182B}\u{118A0}-\u{118DF}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{1192F}\u{1193F}\u{11941}\u{119A0}-\u{119A7}\u{119AA}-\u{119D0}\u{119E1}\u{119E3}\u{11A00}\u{11A0B}-\u{11A32}\u{11A3A}\u{11A50}\u{11A5C}-\u{11A89}\u{11A9D}\u{11AB0}-\u{11AF8}\u{11BC0}-\u{11BE0}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2E}\u{11C40}\u{11C72}-\u{11C8F}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D89}\u{11D98}\u{11EE0}-\u{11EF2}\u{11F02}\u{11F04}-\u{11F10}\u{11F12}-\u{11F33}\u{11FB0}\u{12000}-\u{12399}\u{12480}-\u{12543}\u{12F90}-\u{12FF0}\u{13000}-\u{1342F}\u{13441}-\u{13446}\u{13460}-\u{143FA}\u{14400}-\u{14646}\u{16100}-\u{1611D}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A70}-\u{16ABE}\u{16AD0}-\u{16AED}\u{16B00}-\u{16B2F}\u{16B40}-\u{16B43}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16D40}-\u{16D6C}\u{16E40}-\u{16E7F}\u{16F00}-\u{16F4A}\u{16F50}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18CFF}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6C0}\u{1D6C2}-\u{1D6DA}\u{1D6DC}-\u{1D6FA}\u{1D6FC}-\u{1D714}\u{1D716}-\u{1D734}\u{1D736}-\u{1D74E}\u{1D750}-\u{1D76E}\u{1D770}-\u{1D788}\u{1D78A}-\u{1D7A8}\u{1D7AA}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E030}-\u{1E06D}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E14E}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E4D0}-\u{1E4EB}\u{1E5D0}-\u{1E5ED}\u{1E5F0}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1E800}-\u{1E8C4}\u{1E900}-\u{1E943}\u{1E94B}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2EBF0}-\u{2EE5D}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}]+$/u;
    var extractNewHref = function extractNewHref(anchor, attr) {
      if (attr === "text") {
        if (!anchor.textContent) {
          return "";
        }
        return anchor.textContent.replace(regexpNotValidAtStart, "").replace(regexpNotValidAtEnd, "");
      }
      if (attr.startsWith("?")) {
        try {
          var url = new URL(anchor.href, document.location.href);
          return url.searchParams.get(attr.slice(1)) || "";
        } catch (ex) {
          logMessage(source, `Cannot retrieve the parameter '${attr.slice(1)}' from the URL '${anchor.href}`);
          return "";
        }
      }
      if (attr.startsWith("[") && attr.endsWith("]")) {
        return anchor.getAttribute(attr.slice(1, -1)) || "";
      }
      return "";
    };
    var isValidURL = function isValidURL(url) {
      try {
        new URL(url);
        return true;
      } catch (_unused) {
        return false;
      }
    };
    var getValidURL = function getValidURL(text) {
      if (!text) {
        return null;
      }
      try {
        var {href: href, protocol: protocol} = new URL(text, document.location.href);
        if (protocol !== "http:" && protocol !== "https:") {
          logMessage(source, `Protocol not allowed: "${protocol}", from URL: "${href}"`);
          return null;
        }
        return href;
      } catch (_unused2) {
        return null;
      }
    };
    var isSanitizableAnchor = function isSanitizableAnchor(element) {
      return element.nodeName.toLowerCase() === "a" && element.hasAttribute("href");
    };
    var _extractURLFromObject = function extractURLFromObject(obj) {
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        var value = obj[key];
        if (typeof value === "string" && isValidURL(value)) {
          return value;
        }
        if (typeof value === "object" && value !== null) {
          var result = _extractURLFromObject(value);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    var isStringifiedObject = function isStringifiedObject(content) {
      return content.startsWith("{") && content.endsWith("}");
    };
    var decodeBase64SeveralTimes = function decodeBase64SeveralTimes(text, times) {
      var result = text;
      for (var i = 0; i < times; i += 1) {
        try {
          result = atob(result);
        } catch (e) {
          if (result === text) {
            return "";
          }
        }
      }
      if (isValidURL(result)) {
        return result;
      }
      if (isStringifiedObject(result)) {
        try {
          var parsedResult = JSON.parse(result);
          return _extractURLFromObject(parsedResult);
        } catch (ex) {
          return "";
        }
      }
      logMessage(source, `Failed to decode base64 string: ${text}`);
      return "";
    };
    var SEARCH_QUERY_MARKER = "?";
    var SEARCH_PARAMS_MARKER = "&";
    var HASHBANG_MARKER = "#!";
    var ANCHOR_MARKER = "#";
    var DECODE_ATTEMPTS_NUMBER = 10;
    var decodeSearchString = function decodeSearchString(search) {
      var searchString = search.replace(SEARCH_QUERY_MARKER, "");
      var decodedParam;
      var validEncodedParam;
      if (searchString.includes(SEARCH_PARAMS_MARKER)) {
        var searchParamsArray = searchString.split(SEARCH_PARAMS_MARKER);
        searchParamsArray.forEach((function(param) {
          decodedParam = decodeBase64SeveralTimes(param, DECODE_ATTEMPTS_NUMBER);
          if (decodedParam && decodedParam.length > 0) {
            validEncodedParam = decodedParam;
          }
        }));
        return validEncodedParam;
      }
      return decodeBase64SeveralTimes(searchString, DECODE_ATTEMPTS_NUMBER);
    };
    var decodeHashString = function decodeHashString(hash) {
      var validEncodedHash = "";
      if (hash.includes(HASHBANG_MARKER)) {
        validEncodedHash = hash.replace(HASHBANG_MARKER, "");
      } else if (hash.includes(ANCHOR_MARKER)) {
        validEncodedHash = hash.replace(ANCHOR_MARKER, "");
      }
      return validEncodedHash ? decodeBase64SeveralTimes(validEncodedHash, DECODE_ATTEMPTS_NUMBER) : "";
    };
    var removeHash = function removeHash(url) {
      var urlObj = new URL(url, window.location.origin);
      if (!urlObj.hash) {
        return "";
      }
      urlObj.hash = "";
      return urlObj.toString();
    };
    var removeParam = function removeParam(url, transformValue) {
      var urlObj = new URL(url, window.location.origin);
      var paramNamesToRemoveStr = transformValue.split(MARKER_SEPARATOR)[1];
      if (!paramNamesToRemoveStr) {
        urlObj.search = "";
        return urlObj.toString();
      }
      var initSearchParamsLength = urlObj.searchParams.toString().length;
      var removeParams = paramNamesToRemoveStr.split(COMMA);
      removeParams.forEach((function(param) {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.delete(param);
        }
      }));
      if (initSearchParamsLength === urlObj.searchParams.toString().length) {
        return "";
      }
      return urlObj.toString();
    };
    var decodeBase64URL = function decodeBase64URL(url) {
      var {search: search, hash: hash} = new URL(url, document.location.href);
      if (search.length > 0) {
        return decodeSearchString(search);
      }
      if (hash.length > 0) {
        return decodeHashString(hash);
      }
      logMessage(source, `Failed to execute base64 from URL: ${url}`);
      return null;
    };
    var base64Decode = function base64Decode(href) {
      if (isValidURL(href)) {
        return decodeBase64URL(href) || "";
      }
      return decodeBase64SeveralTimes(href, DECODE_ATTEMPTS_NUMBER) || "";
    };
    var sanitize = function sanitize(elementSelector) {
      var elements;
      try {
        elements = document.querySelectorAll(elementSelector);
      } catch (e) {
        logMessage(source, `Invalid selector "${elementSelector}"`);
        return;
      }
      elements.forEach((function(elem) {
        try {
          if (!isSanitizableAnchor(elem)) {
            logMessage(source, `${elem} is not a valid element to sanitize`);
            return;
          }
          var newHref = extractNewHref(elem, attribute);
          if (transform) {
            switch (true) {
             case BASE64_DECODE_TRANSFORM_MARKER.has(transform):
              newHref = base64Decode(newHref);
              break;

             case transform === REMOVE_HASH_TRANSFORM_MARKER:
              newHref = removeHash(newHref);
              break;

             case transform.startsWith(REMOVE_PARAM_TRANSFORM_MARKER):
              {
                newHref = removeParam(newHref, transform);
                break;
              }

             default:
              logMessage(source, `Invalid transform option: "${transform}"`);
              return;
            }
          }
          var newValidHref = getValidURL(newHref);
          if (!newValidHref) {
            logMessage(source, `Invalid URL: ${newHref}`);
            return;
          }
          var oldHref = elem.href;
          elem.setAttribute("href", newValidHref);
          if (newValidHref !== oldHref) {
            logMessage(source, `Sanitized "${oldHref}" to "${newValidHref}".`);
          }
        } catch (ex) {
          logMessage(source, `Failed to sanitize ${elem}.`);
        }
      }));
      hit(source);
    };
    var run = function run() {
      sanitize(selector);
      observeDOMChanges((function() {
        return sanitize(selector);
      }), true);
    };
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", run, {
        once: true
      });
    } else {
      run();
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function throttle(n, t) {
    var r, e = false, _wrapper3 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper3(...r), r = null);
      }), t));
    };
    return _wrapper3;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    hrefSanitizer.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"disableNewtabLinks":function disableNewtabLinks(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function disableNewtabLinks(source) {
    document.addEventListener("click", (function(ev) {
      var {target: target} = ev;
      while (target instanceof Element) {
        if (target.localName === "a" && target.hasAttribute("target")) {
          ev.stopPropagation();
          ev.preventDefault();
          hit(source);
          break;
        }
        target = target.parentNode;
      }
    }), {
      capture: true
    });
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    disableNewtabLinks.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventRefresh":function preventRefresh(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventRefresh(source, delaySec) {
    var getMetaElements = function getMetaElements() {
      var metaNodes = [];
      try {
        metaNodes = document.querySelectorAll('meta[http-equiv="refresh" i][content]');
      } catch (e) {
        try {
          metaNodes = document.querySelectorAll('meta[http-equiv="refresh"][content]');
        } catch (e) {
          logMessage(source, e);
        }
      }
      return Array.from(metaNodes);
    };
    var getMetaContentDelay = function getMetaContentDelay(metaElements) {
      var delays = metaElements.map((function(meta) {
        var contentString = meta.getAttribute("content");
        if (contentString.length === 0) {
          return null;
        }
        var contentDelay;
        var limiterIndex = contentString.indexOf(";");
        if (limiterIndex !== -1) {
          var delaySubstring = contentString.substring(0, limiterIndex);
          contentDelay = getNumberFromString(delaySubstring);
        } else {
          contentDelay = getNumberFromString(contentString);
        }
        return contentDelay;
      })).filter((function(delay) {
        return delay !== null;
      }));
      if (!delays.length) {
        return null;
      }
      var minDelay = delays.reduce((function(a, b) {
        return Math.min(a, b);
      }));
      return minDelay;
    };
    var stop = function stop() {
      var metaElements = getMetaElements();
      if (metaElements.length === 0) {
        return;
      }
      var secondsToRun = getNumberFromString(delaySec);
      if (secondsToRun === null) {
        secondsToRun = getMetaContentDelay(metaElements);
      }
      if (secondsToRun === null) {
        return;
      }
      var delayMs = secondsToRun * 1e3;
      setTimeout((function() {
        window.stop();
        hit(source);
      }), delayMs);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", stop, {
        once: true
      });
    } else {
      stop();
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventRefresh.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedClickElement":function trustedClickElement(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedClickElement(source, selectors) {
    var extraMatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : NaN;
    var reload = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var observerTimeoutSec = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : NaN;
    if (!selectors) {
      return;
    }
    var SHADOW_COMBINATOR = " >>> ";
    var DEFAULT_OBSERVER_TIMEOUT_SEC = 10;
    var THROTTLE_DELAY_MS = 20;
    var STATIC_CLICK_DELAY_MS = 150;
    var STATIC_RELOAD_DELAY_MS = 500;
    var COOKIE_MATCH_MARKER = "cookie:";
    var LOCAL_STORAGE_MATCH_MARKER = "localStorage:";
    var TEXT_MATCH_MARKER = "containsText:";
    var CLICK_TYPE_MATCH_MARKER = "clickType:";
    var CLICK_TYPE_NATIVE = "native";
    var RELOAD_ON_FINAL_CLICK_MARKER = "reloadAfterClick";
    var SELECTORS_DELIMITER = ",";
    var COOKIE_STRING_DELIMITER = ";";
    var COLON = ":";
    var EXTRA_MATCH_DELIMITER = /(,\s*){1}(?=!?cookie:|!?localStorage:|containsText:|clickType:)/;
    var sleep = function sleep(delayMs) {
      return new Promise((function(resolve) {
        setTimeout(resolve, delayMs);
      }));
    };
    spoofClickEventsIsTrusted();
    var closedShadowRoots = new WeakMap;
    var bridgeObservers = new Set;
    if (selectors.includes(SHADOW_COMBINATOR)) {
      var attachShadowWrapper = function attachShadowWrapper(target, thisArg, argumentsList) {
        var _argumentsList$;
        var shadowRoot = Reflect.apply(target, thisArg, argumentsList);
        var mode = (_argumentsList$ = argumentsList[0]) === null || _argumentsList$ === void 0 ? void 0 : _argumentsList$.mode;
        if (mode === "closed") {
          closedShadowRoots.set(thisArg, shadowRoot);
        }
        var bridgeObserver = new MutationObserver((function(mutations) {
          triggerMainObserver();
          mutations.forEach((function(mutation) {
            bridgeIframeLoads(mutation.addedNodes);
          }));
        }));
        bridgeObserver.observe(shadowRoot, {
          childList: true,
          subtree: true
        });
        bridgeObservers.add(bridgeObserver);
        return shadowRoot;
      };
      var attachShadowHandler = {
        apply: attachShadowWrapper
      };
      window.Element.prototype.attachShadow = new Proxy(window.Element.prototype.attachShadow, attachShadowHandler);
    }
    var disconnectBridgeObservers = function disconnectBridgeObservers() {
      bridgeObservers.forEach((function(obs) {
        return obs.disconnect();
      }));
      bridgeObservers.clear();
    };
    var observerTimeoutMs = DEFAULT_OBSERVER_TIMEOUT_SEC * 1e3;
    if (observerTimeoutSec) {
      var parsedTimeout = Number(observerTimeoutSec);
      if (!Number.isInteger(parsedTimeout) || parsedTimeout <= 0) {
        logMessage(source, `Passed observer timeout '${observerTimeoutSec}' is invalid`);
        return;
      }
      observerTimeoutMs = parsedTimeout * 1e3;
    }
    var parsedDelayMs;
    if (delay) {
      parsedDelayMs = Number(delay);
      if (!Number.isInteger(parsedDelayMs) || parsedDelayMs < 0) {
        logMessage(source, `Passed delay '${delay}' is invalid`);
        return;
      }
      if (parsedDelayMs >= observerTimeoutMs) {
        var message = `Passed delay '${delay}' is bigger than ${observerTimeoutMs} ms`;
        logMessage(source, message);
        return;
      }
    }
    var canClick = !parsedDelayMs;
    var cookieMatches = [];
    var localStorageMatches = [];
    var textMatches = "";
    var clickType = "";
    var isInvertedMatchCookie = false;
    var isInvertedMatchLocalStorage = false;
    if (extraMatch) {
      var parsedExtraMatch = extraMatch.split(EXTRA_MATCH_DELIMITER).map((function(matchStr) {
        return matchStr.trim();
      }));
      parsedExtraMatch.forEach((function(matchStr) {
        if (matchStr.includes(COOKIE_MATCH_MARKER)) {
          var {isInvertedMatch: isInvertedMatch, matchValue: matchValue} = parseMatchArg(matchStr);
          isInvertedMatchCookie = isInvertedMatch;
          var cookieMatch = matchValue.replace(COOKIE_MATCH_MARKER, "");
          cookieMatches.push(cookieMatch);
        }
        if (matchStr.includes(LOCAL_STORAGE_MATCH_MARKER)) {
          var {isInvertedMatch: _isInvertedMatch, matchValue: _matchValue} = parseMatchArg(matchStr);
          isInvertedMatchLocalStorage = _isInvertedMatch;
          var localStorageMatch = _matchValue.replace(LOCAL_STORAGE_MATCH_MARKER, "");
          localStorageMatches.push(localStorageMatch);
        }
        if (matchStr.includes(TEXT_MATCH_MARKER)) {
          var {matchValue: _matchValue2} = parseMatchArg(matchStr);
          var textMatch = _matchValue2.replace(TEXT_MATCH_MARKER, "");
          textMatches = textMatch;
        }
        if (matchStr.includes(CLICK_TYPE_MATCH_MARKER)) {
          var {isInvertedMatch: _isInvertedMatch2, matchValue: _matchValue3} = parseMatchArg(matchStr);
          if (_isInvertedMatch2) {
            logMessage(source, `Passed click type '${matchStr}' is invalid`);
            return;
          }
          var passedClickType = _matchValue3.replace(CLICK_TYPE_MATCH_MARKER, "");
          if (passedClickType !== CLICK_TYPE_NATIVE) {
            logMessage(source, `Passed click type '${passedClickType}' is invalid`);
            return;
          }
          clickType = passedClickType;
        }
      }));
    }
    if (cookieMatches.length > 0) {
      var parsedCookieMatches = parseCookieString(cookieMatches.join(COOKIE_STRING_DELIMITER));
      var parsedCookies = parseCookieString(document.cookie);
      var cookieKeys = Object.keys(parsedCookies);
      if (cookieKeys.length === 0) {
        return;
      }
      var cookiesMatched = Object.keys(parsedCookieMatches).every((function(key) {
        var valueMatch = parsedCookieMatches[key] ? toRegExp(parsedCookieMatches[key]) : null;
        var keyMatch = toRegExp(key);
        return cookieKeys.some((function(cookieKey) {
          var keysMatched = keyMatch.test(cookieKey);
          if (!keysMatched) {
            return false;
          }
          if (!valueMatch) {
            return true;
          }
          var parsedCookieValue = parsedCookies[cookieKey];
          if (!parsedCookieValue) {
            return false;
          }
          return valueMatch.test(parsedCookieValue);
        }));
      }));
      var shouldRun = cookiesMatched !== isInvertedMatchCookie;
      if (!shouldRun) {
        return;
      }
    }
    if (localStorageMatches.length > 0) {
      var localStorageMatched = localStorageMatches.every((function(str) {
        var itemValue = window.localStorage.getItem(str);
        return itemValue || itemValue === "";
      }));
      var _shouldRun = localStorageMatched !== isInvertedMatchLocalStorage;
      if (!_shouldRun) {
        return;
      }
    }
    var textMatchRegexp = textMatches ? toRegExp(textMatches) : null;
    var selectorsSequence = selectors.split(SELECTORS_DELIMITER).map((function(selector) {
      return selector.trim();
    }));
    var createElementObj = function createElementObj(element, selector) {
      return {
        element: element || null,
        clicked: false,
        selectorText: selector || null
      };
    };
    var elementsSequence = Array(selectorsSequence.length).fill(createElementObj(null));
    var findAndClickElement = function findAndClickElement(elementObj) {
      try {
        if (!elementObj.selectorText) {
          return;
        }
        var element = queryShadowSelector(elementObj.selectorText, document.documentElement, null, closedShadowRoots);
        if (!element) {
          logMessage(source, `Could not find element: '${elementObj.selectorText}'`);
          return;
        }
        clickElement(element, clickType);
        elementObj.clicked = true;
      } catch (error) {
        logMessage(source, `Could not click element: '${elementObj.selectorText}'`);
      }
    };
    var shouldReloadAfterClick = false;
    var reloadDelayMs = STATIC_RELOAD_DELAY_MS;
    if (reload) {
      var reloadSplit = reload.split(COLON);
      var reloadMarker = reloadSplit[0];
      var reloadValue = reloadSplit[1];
      if (reloadMarker !== RELOAD_ON_FINAL_CLICK_MARKER) {
        logMessage(source, `Passed reload option '${reload}' is invalid`);
        return;
      }
      if (reloadValue) {
        var passedReload = Number(reloadValue);
        if (Number.isNaN(passedReload)) {
          logMessage(source, `Passed reload delay value '${passedReload}' is invalid`);
          return;
        }
        if (passedReload > observerTimeoutMs) {
          logMessage(source, `Passed reload delay value '${passedReload}' is bigger than maximum ${observerTimeoutMs} ms`);
          return;
        }
        reloadDelayMs = passedReload;
      }
      shouldReloadAfterClick = true;
    }
    var canReload = true;
    var clickElementsBySequence = async function clickElementsBySequence() {
      for (var i = 0; i < elementsSequence.length; i += 1) {
        var elementObj = elementsSequence[i];
        if (i >= 1) {
          await sleep(STATIC_CLICK_DELAY_MS);
        }
        if (!elementObj.element) {
          break;
        }
        if (!elementObj.clicked) {
          if (elementObj.element.isConnected) {
            clickElement(elementObj.element, clickType);
            elementObj.clicked = true;
          } else {
            findAndClickElement(elementObj);
          }
        }
      }
      var allElementsClicked = elementsSequence.every((function(elementObj) {
        return elementObj.clicked === true;
      }));
      if (allElementsClicked) {
        if (shouldReloadAfterClick && canReload) {
          canReload = false;
          setTimeout((function() {
            window.location.reload();
          }), reloadDelayMs);
        }
        hit(source);
      }
    };
    var handleElement = function handleElement(element, i, selector) {
      var elementObj = createElementObj(element, selector);
      elementsSequence[i] = elementObj;
      if (canClick) {
        clickElementsBySequence();
      }
    };
    var fulfillAndHandleSelectors = function fulfillAndHandleSelectors() {
      var fulfilledSelectors = [];
      selectorsSequence.forEach((function(selector, i) {
        if (!selector) {
          return;
        }
        var element = queryShadowSelector(selector, document.documentElement, textMatchRegexp, closedShadowRoots);
        if (!element) {
          return;
        }
        handleElement(element, i, selector);
        fulfilledSelectors.push(selector);
      }));
      selectorsSequence = selectorsSequence.map((function(selector) {
        return selector && fulfilledSelectors.includes(selector) ? null : selector;
      }));
      return selectorsSequence;
    };
    var findElements = function findElements(mutations, observer) {
      selectorsSequence = fulfillAndHandleSelectors();
      var allSelectorsFulfilled = selectorsSequence.every((function(selector) {
        return selector === null;
      }));
      if (allSelectorsFulfilled) {
        observer.disconnect();
        disconnectBridgeObservers();
      }
    };
    var initializeMutationObserver = function initializeMutationObserver() {
      var observer = new MutationObserver(throttle(findElements, THROTTLE_DELAY_MS));
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
      setTimeout((function() {
        observer.disconnect();
        disconnectBridgeObservers();
      }), observerTimeoutMs);
    };
    var checkInitialElements = function checkInitialElements() {
      var foundElements = selectorsSequence.every((function(selector) {
        if (!selector) {
          return false;
        }
        var element = queryShadowSelector(selector, document.documentElement, textMatchRegexp, closedShadowRoots);
        return !!element;
      }));
      if (foundElements) {
        fulfillAndHandleSelectors();
        disconnectBridgeObservers();
      } else {
        initializeMutationObserver();
      }
    };
    checkInitialElements();
    if (parsedDelayMs) {
      setTimeout((function() {
        clickElementsBySequence();
        canClick = true;
      }), parsedDelayMs);
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function parseCookieString(i) {
    var r = i.split(";"), n = {};
    return r.forEach((function(i) {
      var r, t = "", e = i.indexOf("=");
      -1 === e ? r = i.trim() : (r = i.slice(0, e).trim(), t = i.slice(e + 1)), n[r] = t || null;
    })), n;
  }
  function throttle(n, t) {
    var r, e = false, _wrapper8 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper8(...r), r = null);
      }), t));
    };
    return _wrapper8;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function queryShadowSelector(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.documentElement, l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, r = arguments.length > 3 ? arguments[3] : void 0, n = " >>> ", o = e.indexOf(n);
    if (-1 === o) return l ? findElementWithText(t, e, l) : t.querySelector(e);
    var i = e.slice(0, o).trim(), u = t.querySelector(i);
    if (!u) return null;
    var d = u.shadowRoot || (null == r ? void 0 : r.get(u));
    return d ? queryShadowSelector(e.slice(o + 5).trim(), d, l, r) : null;
  }
  function spoofClickEventsIsTrusted() {
    var e = Symbol.for("adg-spoof-click-isTrusted");
    if (!EventTarget.prototype[e]) {
      var t = new Set([ "click", "mousedown", "mouseup", "mouseover", "mouseenter", "pointerdown", "pointerup", "pointerover", "pointerenter" ]), r = EventTarget.prototype.addEventListener, n = EventTarget.prototype.removeEventListener, o = new WeakMap, getMapKey = function getMapKey(e, t) {
        return `${e}\0${function(e) {
          var t;
          return "boolean" == typeof e ? e : null !== (t = null == e ? void 0 : e.capture) && void 0 !== t && t;
        }(t)}`;
      };
      EventTarget.prototype.addEventListener = function(e, n, i) {
        if (!n || !t.has(e)) return r.call(this, e, n, i);
        var a = "function" == typeof n, s = getMapKey(e, i), wrapped = function wrapped(e) {
          var t = new Proxy(e, {
            get(e, t) {
              if ("isTrusted" === t) return true;
              var r = Reflect.get(e, t);
              return "function" == typeof r ? r.bind(e) : r;
            },
            set: function set(e, t, r) {
              return Reflect.set(e, t, r);
            }
          });
          return a ? n.call(this, t) : n.handleEvent.call(n, t);
        }, u = n, l = o.get(u);
        l || (l = new Map, o.set(u, l));
        var v = l.get(s);
        return v || l.set(s, wrapped), r.call(this, e, v || wrapped, i);
      }, EventTarget.prototype.removeEventListener = function(e, r, i) {
        if (!r || !t.has(e)) return n.call(this, e, r, i);
        var a = r, s = getMapKey(e, i), u = o.get(a);
        if (u && u.has(s)) {
          var l = u.get(s);
          return u.delete(s), n.call(this, e, l, i);
        }
        return n.call(this, e, r, i);
      }, EventTarget.prototype[e] = true;
    }
  }
  function triggerMainObserver() {
    var e = `adg-${randomId()}`, t = document.documentElement;
    t.setAttribute(e, ""), t.removeAttribute(e);
  }
  function bridgeIframeLoads(e) {
    Array.from(e).forEach((function(e) {
      (e instanceof HTMLIFrameElement && e.addEventListener("load", (function() {
        triggerMainObserver();
      })), e instanceof Element) && e.querySelectorAll("iframe").forEach((function(e) {
        e.addEventListener("load", (function() {
          triggerMainObserver();
        }));
      }));
    }));
  }
  function clickElement(e) {
    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", t = e.getBoundingClientRect(), o = t.left + t.width / 2, i = t.top + t.height / 2, r = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      clientX: o,
      clientY: i,
      screenX: o + window.screenX,
      screenY: i + window.screenY,
      button: 0,
      buttons: 1
    }, u = Object.assign({}, r, {
      bubbles: false
    }), c = Object.assign({}, r, {
      buttons: 0
    }), createEventProxy = function createEventProxy(n, t) {
      var o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = n.defaultPrevented, r = false;
      return new Proxy(n, {
        get(n, u) {
          if ("isTrusted" === u) return true;
          if (!o) {
            var c = Reflect.get(n, u);
            return "function" == typeof c ? c.bind(n) : c;
          }
          if ("nativeEvent" === u) return n;
          if ("target" === u || "srcElement" === u || "currentTarget" === u) return e;
          if ("type" === u) return t;
          if ("defaultPrevented" === u) return i;
          if ("persist" === u) return function() {};
          if ("isDefaultPrevented" === u) return function() {
            return i;
          };
          if ("isPropagationStopped" === u) return function() {
            return r;
          };
          if ("preventDefault" === u) return function() {
            i = true, n.preventDefault();
          };
          if ("stopPropagation" === u) return function() {
            r = true, n.stopPropagation();
          };
          if ("stopImmediatePropagation" === u) return function() {
            r = true, "function" == typeof n.stopImmediatePropagation && n.stopImmediatePropagation();
          };
          var s = Reflect.get(n, u);
          return "function" == typeof s ? s.bind(n) : s;
        }
      });
    }, s = Object.keys(e).find((function(e) {
      return e.startsWith("__reactProps$");
    }));
    if (s && "native" !== n) {
      var a = e[s];
      if (a && "function" == typeof a.onClick) {
        if ("function" == typeof a.onFocus) {
          var f = "function" == typeof FocusEvent ? new FocusEvent("focus", {
            bubbles: false,
            cancelable: false,
            composed: true,
            relatedTarget: null
          }) : new Event("focus", {
            bubbles: false,
            cancelable: false,
            composed: true
          }), p = createEventProxy(f, "focus", true);
          a.onFocus.call(e, p);
        }
        var v = new MouseEvent("click", c), l = createEventProxy(v, "click", true);
        return void a.onClick.call(e, l);
      }
    }
    !function() {
      var n, t, o, i, s = "function" == typeof PointerEvent, a = new Set([ "click", "mousedown", "mouseup", "mouseover", "mouseenter", "pointerdown", "pointerup", "pointerover", "pointerenter" ]), f = (n = e, 
      t = a, o = new Map, i = n, t.forEach((function(e) {
        var n = `on${e}`, t = i[n];
        "function" != typeof t || o.has(n) || (o.set(n, t), i[n] = function(n) {
          var o = createEventProxy(n, e);
          return t.call(this, o);
        });
      })), function() {
        o.forEach((function(e, n) {
          i[n] = e;
        }));
      });
      try {
        s && (e.dispatchEvent(new PointerEvent("pointerover", r)), e.dispatchEvent(new PointerEvent("pointerenter", u))), 
        e.dispatchEvent(new MouseEvent("mouseover", r)), e.dispatchEvent(new MouseEvent("mouseenter", u)), 
        s && e.dispatchEvent(new PointerEvent("pointerdown", r)), e.dispatchEvent(new MouseEvent("mousedown", r)), 
        e.focus(), s && e.dispatchEvent(new PointerEvent("pointerup", c)), e.dispatchEvent(new MouseEvent("mouseup", c)), 
        e.dispatchEvent(new MouseEvent("click", c));
      } finally {
        f();
      }
    }();
  }
  function doesElementContainText(t, e) {
    var {textContent: n} = t;
    return !!n && e.test(n);
  }
  function findElementWithText(e, n, t) {
    for (var l = e.querySelectorAll(n), r = 0; r < l.length; r += 1) if (doesElementContainText(l[r], t)) return l[r];
    return null;
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedClickElement.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"jsonPruneXhrResponse":function jsonPruneXhrResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function jsonPruneXhrResponse(source, propsToRemove, obligatoryProps) {
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var stack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var mode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    if (typeof Proxy === "undefined") {
      return;
    }
    var shouldLog = !propsToRemove && !obligatoryProps;
    var syntaxModeDetails = resolveJsonSyntaxMode(propsToRemove, mode);
    var prunePaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(propsToRemove) : [];
    var requiredPaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(obligatoryProps) : [];
    var nativeParse = window.JSON.parse;
    var nativeStringify = window.JSON.stringify;
    var nativeObjects = {
      nativeParse: nativeParse,
      nativeStringify: nativeStringify
    };
    var pruneJsonValue = function pruneJsonValue(root) {
      if (syntaxModeDetails.mode === "jsonpath") {
        return jsonPath(source, root, propsToRemove, nativeObjects, (function() {
          return hit(source);
        }), "");
      }
      return jsonPruner(source, root, prunePaths, requiredPaths, "", nativeObjects);
    };
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var matchedXhrRequests = new Map;
    var xhrRequestHeaders = new Map;
    var setRequestHeaderWrapper = function setRequestHeaderWrapper(setRequestHeader, thisArgument, argsList) {
      var headers = xhrRequestHeaders.get(thisArgument);
      if (headers) {
        headers.push(argsList);
      }
      return Reflect.apply(setRequestHeader, thisArgument, argsList);
    };
    var setRequestHeaderHandler = {
      apply: setRequestHeaderWrapper
    };
    var openWrapper = function openWrapper(target, thisArg, args) {
      var xhrData = getXhrData.apply(null, args);
      if (matchRequestProps(source, propsToMatch, xhrData) || shouldLog) {
        matchedXhrRequests.set(thisArg, xhrData);
      }
      if (matchedXhrRequests.has(thisArg) && !xhrRequestHeaders.has(thisArg)) {
        xhrRequestHeaders.set(thisArg, []);
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      if (!matchedXhrRequests.has(thisArg)) {
        return Reflect.apply(target, thisArg, args);
      }
      var xhrData = matchedXhrRequests.get(thisArg);
      var stackTrace = (new Error).stack || "";
      if (!xhrData || stack && !matchStackTrace(stack, stackTrace)) {
        xhrRequestHeaders.delete(thisArg);
        matchedXhrRequests.delete(thisArg);
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.withCredentials = thisArg.withCredentials;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string" && typeof content !== "object") {
          return;
        }
        var modifiedContent;
        if (typeof content === "string") {
          try {
            var jsonContent = nativeParse(content);
            if (shouldLog) {
              logMessage(source, `${window.location.hostname}\n${nativeStringify(jsonContent, null, 2)}\nStack trace:\n${stackTrace}`, true);
              logMessage(source, jsonContent, true, false);
              modifiedContent = content;
            } else {
              modifiedContent = pruneJsonValue(jsonContent);
              try {
                var {responseType: responseType} = thisArg;
                switch (responseType) {
                 case "":
                 case "text":
                  modifiedContent = nativeStringify(modifiedContent);
                  break;

                 case "arraybuffer":
                  modifiedContent = (new TextEncoder).encode(nativeStringify(modifiedContent)).buffer;
                  break;

                 case "blob":
                  modifiedContent = new Blob([ nativeStringify(modifiedContent) ]);
                  break;

                 default:
                  break;
                }
              } catch (error) {
                var message = `Response body cannot be converted to response type: '${content}'`;
                logMessage(source, message);
                modifiedContent = content;
              }
            }
          } catch (error) {
            var _message = `Response body cannot be converted to json: '${content}'`;
            logMessage(source, _message);
            modifiedContent = content;
          }
        }
        Object.defineProperties(thisArg, {
          readyState: {
            value: readyState,
            writable: false
          },
          responseURL: {
            value: responseURL,
            writable: false
          },
          responseXML: {
            value: responseXML,
            writable: false
          },
          status: {
            value: status,
            writable: false
          },
          statusText: {
            value: statusText,
            writable: false
          },
          response: {
            value: modifiedContent,
            writable: false
          },
          responseText: {
            value: modifiedContent,
            writable: false
          }
        });
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new Event("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new Event("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        hit(source);
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url, Boolean(xhrData.async) ]);
      var collectedHeaders = xhrRequestHeaders.get(thisArg) || [];
      collectedHeaders.forEach((function(header) {
        forgedRequest.setRequestHeader(header[0], header[1]);
      }));
      xhrRequestHeaders.delete(thisArg);
      matchedXhrRequests.delete(thisArg);
      try {
        Reflect.apply(nativeSend, forgedRequest, args);
      } catch (_unused) {
        return Reflect.apply(target, thisArg, args);
      }
      return undefined;
    };
    var openHandler = {
      apply: openWrapper
    };
    var sendHandler = {
      apply: sendWrapper
    };
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, openHandler);
    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, sendHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function jsonPruner(e, r, n, a, t, i) {
    var {nativeStringify: o} = i;
    if (0 === n.length && 0 === a.length) return logMessage(e, `${window.location.hostname}\n${o(r, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
    r && "object" == typeof r && logMessage(e, r, true, false), r;
    try {
      if (!1 === isPruningNeeded(e, r, n, a, t, i)) return r;
      n.forEach((function(n) {
        for (var a = n.path, t = n.value, i = getWildcardPropertyInChain(r, a, !0, [], t), o = i.length - 1; o >= 0; o -= 1) {
          var s = i[o];
          if (void 0 !== s && s.base) if (hit(e), Array.isArray(s.base)) try {
            var l = Number(s.prop);
            if (Number.isNaN(l)) continue;
            s.base.splice(l, 1);
          } catch (e) {
            console.error("Error while deleting array element", e);
          } else delete s.base[s.prop];
        }
      }));
    } catch (r) {
      logMessage(e, r);
    }
    return r;
  }
  function jsonPath(e, r, t, a, n) {
    var i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "", s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6], o = "$", l = ".", u = "..", p = "", c = "\\", f = ")", h = "[", v = "@", d = "contains", g = "equal", m = "exists", y = "greater_than", k = "greater_than_or_equal", P = "less_than", b = "less_than_or_equal", S = "not_equal", x = "regex", $ = [ "==", "!=", "<=", ">=", "*=", "=~", "<", ">", "=" ], C = 1e5, w = /^[A-Za-z_$][\w$]*$/;
    function isObjectLike(e) {
      return null !== e && "object" == typeof e;
    }
    function isPlainObject(e) {
      if (!isObjectLike(e) || Array.isArray(e)) return false;
      var r = Object.getPrototypeOf(e);
      return r === Object.prototype || null === r;
    }
    function isQuoteCharacter(e) {
      return "'" === e || '"' === e;
    }
    function isEscaped(e, r) {
      for (var t = 0, a = r - 1; a >= 0 && e[a] === c; ) t += 1, a -= 1;
      return t % 2 != 0;
    }
    function stripQuotes(e) {
      var r = e.trim();
      if (r.length < 2) return r;
      var t = r[0], a = r[r.length - 1];
      return isQuoteCharacter(t) && t === a ? r.slice(1, -1).split("\\'").join("'").split('\\"').join('"').split(c + c).join(c) : r;
    }
    function appendPath(e, r) {
      return "number" == typeof r || /^\d+$/.test(String(r)) ? `${e}[${r}]` : w.test(String(r)) ? `${e}.${r}` : `${e}['${String(r).replace(/'/g, "\\'")}']`;
    }
    function createCandidate(e, r, t, a) {
      return {
        key: t,
        parent: r,
        path: a,
        value: e
      };
    }
    function walkTopLevelChars(e, r) {
      for (var t = 0, a = 0, n = 0, i = null, s = 0; s < e.length; s += 1) {
        var o = e[s];
        if (i) {
          if (o !== i || isEscaped(e, s) || (i = null), r(s, false)) return;
        } else if (isQuoteCharacter(o)) {
          if (i = o, r(s, false)) return;
        } else {
          var l = true;
          if (o === h ? t += 1 : "]" === o ? t -= 1 : "{" === o ? a += 1 : "}" === o ? a -= 1 : "(" === o ? n += 1 : o === f ? n -= 1 : l = false, 
          r(s, !l && 0 === t && 0 === a && 0 === n)) return;
        }
      }
    }
    function findClosingBracket(e, r) {
      for (var t = 0, a = null, n = r; n < e.length; n += 1) {
        var i = e[n];
        if (a) i !== a || isEscaped(e, n) || (a = null); else if (isQuoteCharacter(i)) a = i; else if (i !== h) {
          if ("]" === i && 0 === (t -= 1)) return n;
        } else t += 1;
      }
      return -1;
    }
    function splitByTopLevelToken(e, r) {
      var t = [], a = p, n = new Set;
      return walkTopLevelChars(e, (function(i, s) {
        if (!n.has(i)) if (s && e.startsWith(r, i)) {
          t.push(a.trim()), a = p;
          for (var o = 1; o < r.length; o += 1) n.add(i + o);
        } else a += e[i];
      })), a !== p && t.push(a.trim()), t;
    }
    function normalizeFilterPath(e) {
      var r = e.trim();
      return r.startsWith(v) && (r = r.slice(1)), r === p ? o : r.startsWith(o) ? r : r.startsWith(l) || r.startsWith(u) || r.startsWith(h) ? `${o}${r}` : `${o}${l}${r}`;
    }
    function parseFilterExpression(e) {
      var r = e.trim();
      if (r.startsWith("(") && r.endsWith(f)) {
        for (var t = 0, a = null, n = false, i = 0; i < r.length; i += 1) {
          var s = r[i];
          if (a) s !== a || isEscaped(r, i) || (a = null); else if (isQuoteCharacter(s)) a = s; else if ("(" === s) t += 1; else if (s === f && 0 === (t -= 1)) {
            n = i === r.length - 1;
            break;
          }
        }
        n && (r = r.slice(1, -1).trim());
      }
      var u = splitByTopLevelToken(r, "||");
      if (u.length > 1) return {
        conditions: u.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "or"
      };
      var p = splitByTopLevelToken(r, "&&");
      if (p.length > 1) return {
        conditions: p.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "and"
      };
      if (r.startsWith("!") && !r.startsWith("!=")) return {
        condition: parseFilterExpression(r.slice(1).trim()),
        operator: "not"
      };
      var c, C, w = (C = null, walkTopLevelChars(c = r, (function(e, r) {
        if (!r) return false;
        for (var t = null, a = 0; a < $.length; a += 1) {
          var n = $[a];
          c.startsWith(n, e) && (null === t || n.length > t.length) && (t = n);
        }
        return null !== t && (C = {
          index: e,
          operator: t
        }, true);
      })), C);
      if (!w) return {
        operator: m,
        selectorPath: normalizeFilterPath(r)
      };
      var W = r.slice(0, w.index).trim(), O = r.slice(w.index + w.operator.length).trim(), A = g;
      "!=" === w.operator ? A = S : "<" === w.operator ? A = P : "<=" === w.operator ? A = b : ">" === w.operator ? A = y : ">=" === w.operator ? A = k : "*=" === w.operator ? A = d : ("=~" === w.operator || "=" === w.operator && /^\/.*\/[a-z]*$/i.test(O)) && (A = x);
      var j, E, L = O.trim(), F = L === o || L.startsWith(o + l) || L.startsWith(o + h), M = L === v || L.startsWith(v + l) || L.startsWith(v + h);
      return F || M ? {
        comparisonSelectorPath: normalizeFilterPath(L),
        operator: A,
        resolveComparisonAgainstRoot: F,
        selectorPath: normalizeFilterPath(W)
      } : {
        comparisonValue: (j = O, E = j.trim(), "true" === E || "false" !== E && ("null" === E ? null : /^-?\d+(?:\.\d+)?$/.test(E) ? Number(E) : /^\/.*\/[a-z]*$/i.test(E) ? toRegExp(E) : stripQuotes(E))),
        operator: A,
        selectorPath: normalizeFilterPath(W)
      };
    }
    function parseBracketStep(e, r) {
      if ("*" === e) return {
        mode: "wildcard",
        recursive: r
      };
      if (e.startsWith("?")) return {
        filter: parseFilterExpression(e.slice(1)),
        mode: "filter",
        recursive: r
      };
      if (/^\(@\.length(?:-\d+)?\)$/.test(e)) {
        var t = e.match(/^\(@\.length(?:-(\d+))?\)$/);
        return {
          mode: "computed-index",
          recursive: r,
          subtractLength: t && t[1] ? Number(t[1]) : 0
        };
      }
      var a = function(e) {
        var r = [], t = p;
        return walkTopLevelChars(e, (function(a, n) {
          n && ":" === e[a] ? (r.push(t.trim()), t = p) : t += e[a];
        })), r.push(t.trim()), r;
      }(e);
      if (a.length > 1) {
        var n = a[0] === p ? void 0 : Number(a[0]);
        return {
          mode: "slice",
          recursive: r,
          slice: {
            end: a[1] === p ? void 0 : Number(a[1]),
            start: n,
            step: a.length > 2 && a[2] !== p ? Number(a[2]) : 1
          }
        };
      }
      var i = function(e, r) {
        var t = [], a = p;
        return walkTopLevelChars(e, (function(n, i) {
          i && e[n] === r ? (t.push(a.trim()), a = p) : a += e[n];
        })), a !== p && t.push(a.trim()), t;
      }(e, ",");
      return i.every((function(e) {
        return /^-?\d+$/.test(e);
      })) ? {
        indexes: i.map((function(e) {
          return Number(e);
        })),
        mode: "index",
        recursive: r
      } : {
        mode: "property",
        properties: i.map((function(e) {
          return r = e.trim(), /^\/.*\/[a-z]*$/i.test(r) ? toRegExp(r) : stripQuotes(r);
          var r;
        })),
        recursive: r
      };
    }
    function parseJsonPathSelector(e) {
      var r = [], t = 0;
      for (e.startsWith(o) && (t = 1); t < e.length; ) {
        var a = false;
        if (e.startsWith(u, t) ? (a = true, t += 2) : e[t] === l && (t += 1), t >= e.length) break;
        if (e[t] !== h) {
          if ("*" !== e[t]) {
            for (var n = t; n < e.length && e[n] !== l && e[n] !== h; ) n += 1;
            var i = e.slice(t, n).trim();
            i && r.push({
              mode: "property",
              properties: [ i ],
              recursive: a
            }), t = n;
          } else r.push({
            mode: "wildcard",
            recursive: a
          }), t += 1;
        } else {
          var s = findClosingBracket(e, t);
          if (-1 === s) throw new Error(`Invalid JSONPath expression: ${e}`);
          var p = e.slice(t + 1, s).trim();
          r.push(parseBracketStep(p, a)), t = s + 1;
        }
      }
      return {
        steps: r
      };
    }
    function buildAppendUpdater(e, r, t) {
      var a, n = e.trim();
      if (n.startsWith("{") || n.startsWith(h)) a = r(parseKeywordValue(n)); else {
        var i = t(n);
        if (!i || i.shouldReplaceArgument) throw new Error(`Invalid append value: ${e}`);
        a = i.constantValue;
      }
      return function(e) {
        return Array.isArray(e) ? Array.isArray(a) ? e.concat(a) : e.concat([ a ]) : isPlainObject(e) && isPlainObject(a) ? Object.assign({}, e, a) : "string" == typeof e && "string" == typeof a ? `${e}${a}` : a;
      };
    }
    function buildSetUpdater(e, r, t) {
      var a = e.trim();
      if (a.startsWith("replace(") && a.endsWith(f)) return function(e, r) {
        var t = r(e.slice(8, -1));
        if ("string" != typeof t.regex || "string" != typeof t.replacement) throw new Error('Invalid replace payload: "regex" and "replacement" must be strings');
        var a = t.regex.startsWith("/") ? toRegExp(t.regex) : new RegExp(t.regex, t.flags || p), n = parseKeywordValue(t.replacement);
        return function(e) {
          return "string" != typeof e ? e : e.replace(a, n);
        };
      }(a, r);
      var n = t(a);
      if (!n) throw new Error(`Invalid set value: ${e}`);
      return function(e) {
        return getJsonSetValue(e, n);
      };
    }
    function getChildCandidates(e) {
      if (!isObjectLike(e.value)) return [];
      if (ArrayBuffer.isView(e.value)) return [];
      for (var r = Object.keys(e.value), t = [], a = 0; a < r.length; a += 1) {
        var n = r[a];
        t.push(createCandidate(e.value[n], e.value, n, appendPath(e.path, n)));
      }
      return t;
    }
    function getRecursiveCandidates(r) {
      var t = [ r ], a = [ 0 ], n = new WeakSet;
      isObjectLike(r.value) && n.add(r.value);
      for (var i = false, s = isObjectLike(r.value) ? 1 : 0, o = getChildCandidates(r), l = 0; l < o.length; l += 1) {
        if (isObjectLike(o[l].value)) {
          if (n.has(o[l].value)) continue;
          if (n.add(o[l].value), (s += 1) >= C) {
            i = true;
            break;
          }
        }
        t.push(o[l]), a.push(1);
      }
      for (var u = 1; u < t.length && !i; ) {
        var p = a[u] + 1;
        if (p > 1e3) {
          i = true;
          break;
        }
        for (var c = getChildCandidates(t[u]), f = 0; f < c.length; f += 1) {
          if (isObjectLike(c[f].value)) {
            if (n.has(c[f].value)) continue;
            if (n.add(c[f].value), (s += 1) >= C) {
              i = true;
              break;
            }
          }
          t.push(c[f]), a.push(p);
        }
        u += 1;
      }
      return i && logMessage(e, "JSONPath recursive descent exceeded its traversal budget, results may be incomplete"), 
      t;
    }
    function resolveIndex(e, r) {
      return r < 0 ? e + r : r;
    }
    function applyDirectStep(e, r) {
      var t = [];
      if ("property" === r.mode) {
        if (!isObjectLike(e.value) || !r.properties) return t;
        for (var a = new Set, n = 0; n < r.properties.length; n += 1) {
          var i = r.properties[n];
          if (i instanceof RegExp) for (var s = Object.keys(e.value), o = 0; o < s.length; o += 1) {
            var l = s[o];
            i.lastIndex = 0, i.test(l) && !a.has(l) && (a.add(l), t.push(createCandidate(e.value[l], e.value, l, appendPath(e.path, l))));
          } else !a.has(i) && Object.prototype.hasOwnProperty.call(e.value, i) && (a.add(i), 
          t.push(createCandidate(e.value[i], e.value, i, appendPath(e.path, i))));
        }
        return t;
      }
      if ("wildcard" === r.mode) return getChildCandidates(e);
      if ("index" === r.mode) {
        if (!Array.isArray(e.value) || !r.indexes) return t;
        for (var u = 0; u < r.indexes.length; u += 1) {
          var p = resolveIndex(e.value.length, r.indexes[u]);
          p >= 0 && p < e.value.length && t.push(createCandidate(e.value[p], e.value, p, appendPath(e.path, p)));
        }
        return t;
      }
      if ("computed-index" === r.mode) {
        if (!Array.isArray(e.value)) return t;
        var c = e.value.length - (r.subtractLength || 0);
        return c >= 0 && c < e.value.length && t.push(createCandidate(e.value[c], e.value, c, appendPath(e.path, c))), 
        t;
      }
      if ("slice" === r.mode) {
        if (!Array.isArray(e.value) || !r.slice) return t;
        for (var f = function(e, r) {
          var t, a, n = [], i = void 0 === r.step ? 1 : r.step;
          if (0 === i) return n;
          if (t = void 0 === r.start ? i > 0 ? 0 : e - 1 : resolveIndex(e, r.start), a = void 0 === r.end ? i > 0 ? e : -1 : resolveIndex(e, r.end), 
          i > 0) {
            for (var s = Math.max(0, t); s < Math.min(e, a); s += i) n.push(s);
            return n;
          }
          for (var o = Math.min(e - 1, t); o > Math.max(-1, a); o += i) n.push(o);
          return n;
        }(e.value.length, r.slice), h = 0; h < f.length; h += 1) {
          var v = f[h];
          t.push(createCandidate(e.value[v], e.value, v, appendPath(e.path, v)));
        }
      }
      return t;
    }
    function evaluateSelector(e, t) {
      function matchesFilterValue(e, t) {
        if ("conditions" in t) return "and" === t.operator ? t.conditions.every((function(r) {
          return matchesFilterValue(e, r);
        })) : t.conditions.some((function(r) {
          return matchesFilterValue(e, r);
        }));
        if ("condition" in t) return !matchesFilterValue(e, t.condition);
        var a = evaluateSelector(e, parseJsonPathSelector(t.selectorPath));
        if (t.operator === m) return a.length > 0;
        var n = t.comparisonValue;
        if (t.comparisonSelectorPath) {
          var i = evaluateSelector(t.resolveComparisonAgainstRoot ? r : e, parseJsonPathSelector(t.comparisonSelectorPath));
          if (0 === i.length) return false;
          n = i[0].value;
        }
        for (var s = 0; s < a.length; s += 1) {
          var o = a[s].value;
          if (t.operator !== d) {
            if (t.operator !== x) {
              if (t.operator === g && o === n) return true;
              if (t.operator === S && o !== n) return true;
              if (t.operator === P && o < n) return true;
              if (t.operator === b && o <= n) return true;
              if (t.operator === y && o > n) return true;
              if (t.operator === k && o >= n) return true;
            } else if ("string" == typeof o && n instanceof RegExp && (n.lastIndex = 0, n.test(o))) return true;
          } else if ("string" == typeof o && o.includes(String(n))) return true;
        }
        return false;
      }
      function applyFilterStep(e, r) {
        for (var t = [], a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (Array.isArray(n.value)) for (var i = 0; i < n.value.length; i += 1) matchesFilterValue(n.value[i], r) && t.push(createCandidate(n.value[i], n.value, i, appendPath(n.path, i))); else matchesFilterValue(n.value, r) && t.push(n);
        }
        return t;
      }
      for (var a = [ createCandidate(e, null, null, o) ], n = 0; n < t.steps.length; n += 1) {
        var i = t.steps[n];
        if ("filter" === i.mode && i.filter) {
          var s = a;
          if (i.recursive) {
            s = [];
            for (var l = 0; l < a.length; l += 1) for (var u = getRecursiveCandidates(a[l]), p = 0; p < u.length; p += 1) s.push(u[p]);
          }
          a = applyFilterStep(s, i.filter);
        } else {
          for (var c = [], f = 0; f < a.length; f += 1) for (var h = a[f], v = i.recursive ? getRecursiveCandidates(h) : [ h ], $ = 0; $ < v.length; $ += 1) for (var C = applyDirectStep(v[$], i), w = 0; w < C.length; w += 1) c.push(C[w]);
          a = c;
        }
      }
      return a;
    }
    var W = false;
    function markMutated() {
      W = true;
    }
    if (!isObjectLike(r)) return r;
    var O, A = (O = a) && O.nativeParse ? O.nativeParse : JSON.parse, j = function(e) {
      return e && e.nativeStringify ? e.nativeStringify : JSON.stringify;
    }(a), E = (new Error).stack || "";
    if (i && !matchStackTrace(i, E)) return r;
    if (!t) return logMessage(e, `${window.location.hostname}\n${j(r, null, 2)}\nStack trace:\n${E}`, true), 
    logMessage(e, r, true, false), r;
    try {
      for (var L = function(e, r, t) {
        var a, n, i = function(e) {
          var r = -1, t = "remove", a = 0;
          return walkTopLevelChars(e, (function(n, i) {
            return !!i && (e.startsWith("+=", n) ? (r = n, t = "append", a = 2, !0) : "=" === e[n] && (r = n, 
            t = "set", a = 1, !0));
          })), -1 === r ? {
            mode: "remove",
            selectorPart: e.trim(),
            valuePart: p
          } : {
            mode: t,
            selectorPart: e.slice(0, r).trim(),
            valuePart: e.slice(r + a).trim()
          };
        }(e), s = function(e) {
          for (var r = [], t = e.trim(); t.startsWith("[?"); ) {
            var a = findClosingBracket(t, 0);
            if (-1 === a) break;
            var n = t.slice(1, a);
            r.push(parseFilterExpression(n.slice(1))), t = t.slice(a + 1).trim();
          }
          return {
            guards: r,
            selectorPart: t
          };
        }(i.selectorPart), c = parseJsonPathSelector((a = s.selectorPart, (n = a.trim()) === p ? o : n.startsWith(o) ? n : n.startsWith(l) || n.startsWith(h) || n.startsWith(u) ? `${o}${n}` : `${o}${l}${n}`)), f = {
          mode: i.mode
        };
        return "append" === i.mode ? f = {
          mode: "append",
          updater: buildAppendUpdater(i.valuePart, r, t)
        } : "set" === i.mode && (f = {
          mode: "set",
          updater: buildSetUpdater(i.valuePart, r, t)
        }), {
          guards: s.guards,
          mutation: f,
          selector: c
        };
      }(t, A, (function(r) {
        return parseJsonSetArgumentValue(e, r, A);
      })), F = 0; F < L.guards.length; F += 1) {
        if (0 === evaluateSelector(r, {
          steps: [ {
            filter: L.guards[F],
            mode: "filter",
            recursive: !1
          } ]
        }).length) return r;
      }
      var M = evaluateSelector(r, L.selector);
      if (s) return M.length > 0 && n && n(), r;
      if (!("remove" === L.mutation.mode || "string" == typeof e.name && e.name.startsWith("trusted-"))) return logMessage(e, "JSONPath set and append operations are allowed only in trusted scriptlets"), 
      r;
      if ("remove" === L.mutation.mode) return function(e) {
        for (var r = new Set, t = new Map, a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (null !== n.parent && null !== n.key && !r.has(n.path)) if (r.add(n.path), Array.isArray(n.parent)) {
            var i = t.get(n.parent) || [];
            i.push(Number(n.key)), t.set(n.parent, i);
          } else delete n.parent[n.key], markMutated();
        }
        t.forEach((function(e, r) {
          for (var t = Array.from(new Set(e)).sort((function(e, r) {
            return r - e;
          })), a = 0; a < t.length; a += 1) {
            var n = t[a];
            n >= 0 && n < r.length && (r.splice(n, 1), markMutated());
          }
        }));
      }(M), W && n && n(), r;
      L.mutation.updater && (r = function(e, r, t) {
        for (var a = new Set, n = e, i = 0; i < r.length; i += 1) {
          var s = r[i];
          a.has(s.path) || (a.add(s.path), null !== s.parent || null !== s.key || s.path !== o ? null !== s.parent && null !== s.key && (s.parent[s.key] = t(s.parent[s.key]), 
          markMutated()) : (n = t(n), markMutated()));
        }
        return n;
      }(r, M, L.mutation.updater), W && n && n());
    } catch (r) {
      logMessage(e, `JSONPath processing failed for expression '${t}': ${r.message}`);
    }
    return r;
  }
  function getJsonSetValue(e, t) {
    return t.shouldReplaceArgument ? "string" == typeof e ? e.replace(t.replaceRegexValue, t.constantValue) : e : t.shouldMergeJsonValue && null !== e && "object" == typeof e && !Array.isArray(e) && null !== t.constantValue && "object" == typeof t.constantValue && !Array.isArray(t.constantValue) ? Object.assign({}, e, t.constantValue) : t.constantValue;
  }
  function parseJsonSetArgumentValue(e, l, a) {
    var r, n = "json:", s = "replace:", o = "", t = false, u = false, i = false;
    if (l.startsWith(s)) {
      var c = extractRegexAndReplacement(l);
      if (!c) return logMessage(e, `Invalid argument value format: ${l}`), null;
      o = c.regexPart, i = (r = parseKeywordValue(c.replacementPart)) !== c.replacementPart, 
      t = true;
    } else if (l.startsWith(n)) try {
      var f = l.slice(n.length), p = parseKeywordValue(f);
      i = p !== f, r = a(p), u = !0;
    } catch (a) {
      return logMessage(e, `Invalid JSON argument value: ${l}`), null;
    } else {
      var m = noopArray(), d = noopObject(), g = parseKeywordValue(l);
      if (i = g !== l, "undefined" === g) r = void 0; else if ("false" === g) r = false; else if ("true" === g) r = true; else if ("null" === g) r = null; else if ("NaN" === g) r = NaN; else if ("emptyArr" === g || "[]" === g) r = m; else if ("emptyObj" === g || "{}" === g) r = d; else if ("noopFunc" === g) r = noopFunc; else if ("noopCallbackFunc" === g) r = noopCallbackFunc; else if ("trueFunc" === g) r = trueFunc; else if ("falseFunc" === g) r = falseFunc; else if ("throwFunc" === g) r = throwFunc; else if ("noopPromiseResolve" === g) r = noopPromiseResolve; else if ("noopPromiseReject" === g) r = noopPromiseReject; else if (/^-?\d+$/.test(g)) {
        if (r = parseFloat(g), nativeIsNaN(r)) return null;
      } else r = g;
    }
    return {
      constantValue: r,
      replaceRegexValue: o,
      shouldReplaceArgument: t,
      shouldMergeJsonValue: u,
      hasTimeKeywords: i
    };
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopCallbackFunc() {
    return noopFunc;
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  function getPrunePath(t) {
    var r = ".[=].";
    if ("string" == typeof t && void 0 !== t && "" !== t) {
      var e = function(t) {
        for (var e = [], n = "", i = 0, a = false, s = false; i < t.length; ) {
          var u = t[i];
          if (a) n += u, "\\" === u ? s = !s : ("/" !== u || s || (a = false), s = false), 
          i += 1; else {
            if (" " === u || "\n" === u || "\t" === u || "\r" === u || "\f" === u || "\v" === u) {
              for (;i < t.length && /\s/.test(t[i]); ) i += 1;
              "" !== n && (e.push(n), n = "");
              continue;
            }
            if (t.startsWith(r, i)) {
              if (n += r, "/" === t[i += 5]) {
                a = true, s = false, n += "/", i += 1;
                continue;
              }
              continue;
            }
            n += u, i += 1;
          }
        }
        return "" !== n && e.push(n), e;
      }(t);
      return e.map((function(t) {
        var e = t.split(r), n = e[0], i = e[1];
        return void 0 !== i ? ("true" === i ? i = true : "false" === i ? i = false : i.startsWith("/") ? i = toRegExp(i) : "string" == typeof i && /^\d+$/.test(i) && (i = parseFloat(i)), 
        {
          path: n,
          value: i
        }) : {
          path: n
        };
      }));
    }
    return [];
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function isPruningNeeded(n, t, r, e, a, i) {
    if (!t) return false;
    var o, {nativeStringify: u} = i, c = r.map((function(n) {
      return n.path;
    })), f = e.map((function(n) {
      return n.path;
    }));
    if (0 === c.length && f.length > 0) {
      var g = u(t);
      if (toRegExp(f.join("")).test(g)) return logMessage(n, `${window.location.hostname}\n${u(t, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
      t && "object" == typeof t && logMessage(n, t, true, false), o = false;
    }
    for (var s, l = [ ".*.", "*.", ".*", ".[].", "[].", ".[]" ], _loop = function _loop() {
      var n = f[p], r = n.split(".").pop(), e = l.some((function(t) {
        return n.includes(t);
      })), a = getWildcardPropertyInChain(t, n, e);
      if (!a.length) return {
        v: o = false
      };
      o = !e;
      for (var i = 0; i < a.length; i += 1) {
        var u = "string" == typeof r && void 0 !== a[i].base[r];
        o = e ? u || o : u && o;
      }
    }, p = 0; p < f.length; p += 1) if (s = _loop()) return s.v;
    return o;
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function resolveJsonSyntaxMode(t, r) {
    var e = "legacy", o = "jsonpath", s = "string" == typeof r ? r.trim().toLowerCase() : "";
    if (s === e || s === o) return {
      mode: s
    };
    var a = "string" == typeof t ? t.trim() : "";
    return a.startsWith("$") || a.startsWith("[?") || a.startsWith(".") ? {
      mode: o
    } : {
      mode: e
    };
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function getWildcardPropertyInChain(r, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [], t = arguments.length > 4 ? arguments[4] : void 0, o = e.indexOf(".");
    if (-1 === o) {
      if ("*" === e || "[]" === e) {
        for (var n in r) if (Object.prototype.hasOwnProperty.call(r, n)) if (void 0 !== t) {
          var s = r[n];
          "string" == typeof s && t instanceof RegExp ? t.test(s) && i.push({
            base: r,
            prop: n
          }) : s === t && i.push({
            base: r,
            prop: n
          });
        } else i.push({
          base: r,
          prop: n
        });
      } else if (void 0 !== t) {
        var p = r[e];
        "string" == typeof p && t instanceof RegExp ? t.test(p) && i.push({
          base: r,
          prop: e
        }) : r[e] === t && i.push({
          base: r,
          prop: e
        });
      } else i.push({
        base: r,
        prop: e
      });
      return i;
    }
    var c = e.slice(0, o);
    if ("[]" === c && Array.isArray(r) || "*" === c && r instanceof Object || "[-]" === c && Array.isArray(r) || "{-}" === c && r instanceof Object) {
      var f = e.slice(o + 1), y = Object.keys(r);
      if ("{-}" === c || "[-]" === c) {
        var h = Array.isArray(r) ? "array" : "object";
        return ("{-}" !== c || "object" !== h) && ("[-]" !== c || "array" !== h) || y.forEach((function(e) {
          var a = r[e];
          isKeyInObject(a, f, t) && i.push({
            base: r,
            prop: e
          });
        })), i;
      }
      y.forEach((function(e) {
        getWildcardPropertyInChain(r[e], f, a, i, t);
      }));
    }
    Array.isArray(r) && r.forEach((function(r) {
      void 0 !== r && getWildcardPropertyInChain(r, e, a, i, t);
    }));
    var d = r[c];
    return e = e.slice(o + 1), void 0 !== d && getWildcardPropertyInChain(d, e, a, i, t), 
    i;
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  function isKeyInObject(t, r, e) {
    var n = r.split("."), _check5 = function _check(t, r) {
      if (null == t) return false;
      if (0 === r.length) return void 0 === e || ("string" == typeof t && e instanceof RegExp ? e.test(t) : t === e);
      var n = r[0], i = r.slice(1);
      if ("*" === n || "[]" === n) {
        if (Array.isArray(t)) return t.some((function(t) {
          return _check5(t, i);
        }));
        if ("object" == typeof t && null !== t) return Object.keys(t).some((function(r) {
          return _check5(t[r], i);
        }));
      }
      return !!Object.prototype.hasOwnProperty.call(t, n) && _check5(t[n], i);
    };
    return _check5(t, n);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    jsonPruneXhrResponse.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"xmlPrune":function xmlPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function xmlPrune(source, propsToRemove) {
    var optionalProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var urlToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (typeof Reflect === "undefined" || typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var shouldPruneResponse = false;
    var shouldLogContent = verbose === "true";
    var urlMatchRegexp = toRegExp(urlToMatch);
    var XPATH_MARKER = "xpath(";
    var isXpath = propsToRemove && propsToRemove.startsWith(XPATH_MARKER);
    var getXPathElements = function getXPathElements(contextNode) {
      var matchedElements = [];
      try {
        var elementsToRemove = propsToRemove.slice(XPATH_MARKER.length, -1);
        var xpathResult = contextNode.evaluate(elementsToRemove, contextNode, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < xpathResult.snapshotLength; i += 1) {
          matchedElements.push(xpathResult.snapshotItem(i));
        }
      } catch (ex) {
        var message = `Invalid XPath parameter: ${propsToRemove}\n${ex}`;
        logMessage(source, message);
      }
      return matchedElements;
    };
    var xPathPruning = function xPathPruning(xPathElements) {
      xPathElements.forEach((function(element) {
        if (element.nodeType === 1) {
          element.remove();
        } else if (element.nodeType === 2) {
          element.ownerElement.removeAttribute(element.nodeName);
        }
      }));
    };
    var isXML = function isXML(text) {
      if (typeof text === "string") {
        var trimmedText = text.trim();
        if (trimmedText.startsWith("<") && trimmedText.endsWith(">")) {
          return true;
        }
      }
      return false;
    };
    var createXMLDocument = function createXMLDocument(text) {
      var xmlParser = new DOMParser;
      var xmlDocument = xmlParser.parseFromString(text, "text/xml");
      return xmlDocument;
    };
    var isPruningNeeded = function isPruningNeeded(response, propsToRemove) {
      if (!isXML(response)) {
        return false;
      }
      var docXML = createXMLDocument(response);
      return isXpath ? getXPathElements(docXML) : !!docXML.querySelector(propsToRemove);
    };
    var pruneXML = function pruneXML(text) {
      if (!isXML(text)) {
        shouldPruneResponse = false;
        return text;
      }
      var xmlDoc = createXMLDocument(text);
      var errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        return text;
      }
      if (optionalProp !== "" && xmlDoc.querySelector(optionalProp) === null) {
        shouldPruneResponse = false;
        return text;
      }
      var elements = isXpath ? getXPathElements(xmlDoc) : xmlDoc.querySelectorAll(propsToRemove);
      if (!elements.length) {
        shouldPruneResponse = false;
        return text;
      }
      if (shouldLogContent) {
        var cloneXmlDoc = xmlDoc.cloneNode(true);
        logMessage(source, "Original xml:");
        logMessage(source, cloneXmlDoc, true, false);
      }
      if (isXpath) {
        xPathPruning(elements);
      } else {
        elements.forEach((function(elem) {
          elem.remove();
        }));
      }
      if (shouldLogContent) {
        logMessage(source, "Modified xml:");
        logMessage(source, xmlDoc, true, false);
      }
      var serializer = new XMLSerializer;
      text = serializer.serializeToString(xmlDoc);
      return text;
    };
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var matchedXhrRequests = new Set;
    var xhrRequestHeaders = new Map;
    var xhrData;
    var openWrapper = function openWrapper(target, thisArg, args) {
      xhrData = getXhrData.apply(null, args);
      if (matchRequestProps(source, urlToMatch, xhrData)) {
        matchedXhrRequests.add(thisArg);
      }
      if (matchedXhrRequests.has(thisArg) && !xhrRequestHeaders.has(thisArg)) {
        xhrRequestHeaders.set(thisArg, []);
        var setRequestHeaderWrapper = function setRequestHeaderWrapper(target, thisArg, args) {
          var headers = xhrRequestHeaders.get(thisArg);
          if (headers) {
            headers.push(args);
          }
          return Reflect.apply(target, thisArg, args);
        };
        var setRequestHeaderHandler = {
          apply: setRequestHeaderWrapper
        };
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      var allowedResponseTypeValues = [ "", "text" ];
      if (!matchedXhrRequests.has(thisArg) || !allowedResponseTypeValues.includes(thisArg.responseType)) {
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.withCredentials = thisArg.withCredentials;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string") {
          return;
        }
        if (!propsToRemove) {
          if (isXML(response)) {
            var message = `XMLHttpRequest.open() URL: ${responseURL}\nresponse: ${response}`;
            logMessage(source, message);
            logMessage(source, createXMLDocument(response), true, false);
          }
        } else {
          shouldPruneResponse = isPruningNeeded(response, propsToRemove);
        }
        var responseContent = shouldPruneResponse ? pruneXML(response) : response;
        Object.defineProperties(thisArg, {
          readyState: {
            value: readyState,
            writable: false
          },
          responseURL: {
            value: responseURL,
            writable: false
          },
          responseXML: {
            value: responseXML,
            writable: false
          },
          status: {
            value: status,
            writable: false
          },
          statusText: {
            value: statusText,
            writable: false
          },
          response: {
            value: responseContent,
            writable: false
          },
          responseText: {
            value: responseContent,
            writable: false
          }
        });
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new ProgressEvent("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new ProgressEvent("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        if (shouldPruneResponse) {
          hit(source);
        }
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url ]);
      var collectedHeaders = xhrRequestHeaders.get(thisArg) || [];
      collectedHeaders.forEach((function(header) {
        var name = header[0];
        var value = header[1];
        forgedRequest.setRequestHeader(name, value);
      }));
      xhrRequestHeaders.delete(thisArg);
      matchedXhrRequests.delete(thisArg);
      try {
        Reflect.apply(nativeSend, forgedRequest, args);
      } catch (_unused) {
        return Reflect.apply(target, thisArg, args);
      }
      return undefined;
    };
    var openHandler = {
      apply: openWrapper
    };
    var sendHandler = {
      apply: sendWrapper
    };
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, openHandler);
    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, sendHandler);
    var nativeFetch = window.fetch;
    var fetchWrapper = async function fetchWrapper(target, thisArg, args) {
      var fetchURL = args[0] instanceof Request ? args[0].url : args[0];
      if (typeof fetchURL !== "string" || fetchURL.length === 0) {
        return Reflect.apply(target, thisArg, args);
      }
      if (urlMatchRegexp.test(fetchURL)) {
        var response = await nativeFetch(...args);
        var clonedResponse = response.clone();
        var responseText = await response.text();
        shouldPruneResponse = isPruningNeeded(responseText, propsToRemove);
        if (!shouldPruneResponse) {
          var message = `fetch URL: ${fetchURL}\nresponse text: ${responseText}`;
          logMessage(source, message);
          logMessage(source, createXMLDocument(responseText), true, false);
          return clonedResponse;
        }
        var prunedText = pruneXML(responseText);
        if (shouldPruneResponse) {
          hit(source);
          return new Response(prunedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
        return clonedResponse;
      }
      return Reflect.apply(target, thisArg, args);
    };
    var fetchHandler = {
      apply: fetchWrapper
    };
    window.fetch = new Proxy(window.fetch, fetchHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    xmlPrune.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"m3uPrune":function m3uPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function m3uPrune(source, propsToRemove) {
    var urlToMatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (typeof Reflect === "undefined" || typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var shouldPruneResponse = false;
    var shouldLogContent = verbose === "true";
    var urlMatchRegexp = toRegExp(urlToMatch);
    var SEGMENT_MARKER = "#";
    var AD_MARKER = {
      ASSET: "#EXT-X-ASSET:",
      CUE: "#EXT-X-CUE:",
      CUE_IN: "#EXT-X-CUE-IN",
      DISCONTINUITY: "#EXT-X-DISCONTINUITY",
      EXTINF: "#EXTINF",
      EXTM3U: "#EXTM3U",
      SCTE35: "#EXT-X-SCTE35:"
    };
    var COMCAST_AD_MARKER = {
      AD: "-AD-",
      VAST: "-VAST-",
      VMAP_AD: "-VMAP-AD-",
      VMAP_AD_BREAK: "#EXT-X-VMAP-AD-BREAK:"
    };
    var TAGS_ALLOWLIST = [ "#EXT-X-TARGETDURATION", "#EXT-X-MEDIA-SEQUENCE", "#EXT-X-DISCONTINUITY-SEQUENCE", "#EXT-X-ENDLIST", "#EXT-X-PLAYLIST-TYPE", "#EXT-X-I-FRAMES-ONLY", "#EXT-X-MEDIA", "#EXT-X-STREAM-INF", "#EXT-X-I-FRAME-STREAM-INF", "#EXT-X-SESSION-DATA", "#EXT-X-SESSION-KEY", "#EXT-X-INDEPENDENT-SEGMENTS", "#EXT-X-START" ];
    var isAllowedTag = function isAllowedTag(str) {
      return TAGS_ALLOWLIST.some((function(el) {
        return str.startsWith(el);
      }));
    };
    var _pruneExtinfFromVmapBlock = function pruneExtinfFromVmapBlock(lines, i) {
      var array = lines.slice();
      var index = i;
      if (array[index].includes(AD_MARKER.EXTINF)) {
        array[index] = undefined;
        index += 1;
        if (array[index].includes(AD_MARKER.DISCONTINUITY)) {
          array[index] = undefined;
          index += 1;
          var prunedExtinf = _pruneExtinfFromVmapBlock(array, index);
          array = prunedExtinf.array;
          index = prunedExtinf.index;
        }
      }
      return {
        array: array,
        index: index
      };
    };
    var pruneVmapBlock = function pruneVmapBlock(lines) {
      var array = lines.slice();
      for (var i = 0; i < array.length - 1; i += 1) {
        if (array[i].includes(COMCAST_AD_MARKER.VMAP_AD) || array[i].includes(COMCAST_AD_MARKER.VAST) || array[i].includes(COMCAST_AD_MARKER.AD)) {
          array[i] = undefined;
          if (array[i + 1].includes(AD_MARKER.EXTINF)) {
            i += 1;
            var prunedExtinf = _pruneExtinfFromVmapBlock(array, i);
            array = prunedExtinf.array;
            i = prunedExtinf.index - 1;
          }
        }
      }
      return array;
    };
    var pruneSpliceoutBlock = function pruneSpliceoutBlock(line, index, array) {
      if (!line.startsWith(AD_MARKER.CUE)) {
        return line;
      }
      line = undefined;
      index += 1;
      if (array[index].startsWith(AD_MARKER.ASSET)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.SCTE35)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.CUE_IN)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.SCTE35)) {
        array[index] = undefined;
      }
      return line;
    };
    var removeM3ULineRegexp = toRegExp(propsToRemove);
    var pruneInfBlock = function pruneInfBlock(line, index, array) {
      if (!line.startsWith(AD_MARKER.EXTINF)) {
        return line;
      }
      if (!removeM3ULineRegexp.test(array[index + 1])) {
        return line;
      }
      if (!isAllowedTag(array[index])) {
        array[index] = undefined;
      }
      index += 1;
      if (!isAllowedTag(array[index])) {
        array[index] = undefined;
      }
      index += 1;
      if (array[index].startsWith(AD_MARKER.DISCONTINUITY)) {
        array[index] = undefined;
      }
      return line;
    };
    var pruneSegments = function pruneSegments(lines) {
      for (var i = 0; i < lines.length - 1; i += 1) {
        var _lines$i;
        if ((_lines$i = lines[i]) !== null && _lines$i !== void 0 && _lines$i.startsWith(SEGMENT_MARKER) && removeM3ULineRegexp.test(lines[i])) {
          var segmentName = lines[i].substring(0, lines[i].indexOf(":"));
          if (!segmentName) {
            return lines;
          }
          lines[i] = undefined;
          i += 1;
          for (var j = i; j < lines.length; j += 1) {
            if (!lines[j].includes(segmentName) && !isAllowedTag(lines[j])) {
              lines[j] = undefined;
            } else {
              i = j - 1;
              break;
            }
          }
        }
      }
      return lines;
    };
    var isM3U = function isM3U(text) {
      if (typeof text === "string") {
        var trimmedText = text.trim();
        return trimmedText.startsWith(AD_MARKER.EXTM3U) || trimmedText.startsWith(COMCAST_AD_MARKER.VMAP_AD_BREAK);
      }
      return false;
    };
    var isPruningNeeded = function isPruningNeeded(text, regexp) {
      return isM3U(text) && regexp.test(text);
    };
    var pruneM3U = function pruneM3U(text) {
      if (shouldLogContent) {
        logMessage(source, `Original M3U content:\n${text}`);
      }
      var lines = text.split(/\r?\n/);
      if (text.includes(COMCAST_AD_MARKER.VMAP_AD_BREAK)) {
        lines = pruneVmapBlock(lines);
        lines = lines.filter((function(l) {
          return !!l;
        })).join("\n");
        if (shouldLogContent) {
          logMessage(source, `Modified M3U content:\n${lines}`);
        }
        return lines;
      }
      lines = pruneSegments(lines);
      lines = lines.map((function(line, index, array) {
        if (typeof line === "undefined") {
          return line;
        }
        line = pruneSpliceoutBlock(line, index, array);
        if (typeof line !== "undefined") {
          line = pruneInfBlock(line, index, array);
        }
        return line;
      })).filter((function(l) {
        return !!l;
      })).join("\n");
      if (shouldLogContent) {
        logMessage(source, `Modified M3U content:\n${lines}`);
      }
      return lines;
    };
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var xhrData;
    var openWrapper = function openWrapper(target, thisArg, args) {
      xhrData = getXhrData.apply(null, args);
      if (matchRequestProps(source, urlToMatch, xhrData)) {
        thisArg.shouldBePruned = true;
      }
      if (thisArg.shouldBePruned) {
        thisArg.collectedHeaders = [];
        var setRequestHeaderWrapper = function setRequestHeaderWrapper(target, thisArg, args) {
          thisArg.collectedHeaders.push(args);
          return Reflect.apply(target, thisArg, args);
        };
        var setRequestHeaderHandler = {
          apply: setRequestHeaderWrapper
        };
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      var allowedResponseTypeValues = [ "", "text" ];
      if (!thisArg.shouldBePruned || !allowedResponseTypeValues.includes(thisArg.responseType)) {
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string") {
          return;
        }
        if (!propsToRemove) {
          if (isM3U(response)) {
            var message = `XMLHttpRequest.open() URL: ${responseURL}\nresponse: ${response}`;
            logMessage(source, message);
          }
        } else {
          shouldPruneResponse = isPruningNeeded(response, removeM3ULineRegexp);
        }
        var responseContent = shouldPruneResponse ? pruneM3U(response) : response;
        Object.defineProperties(thisArg, {
          readyState: {
            value: readyState,
            writable: false
          },
          responseURL: {
            value: responseURL,
            writable: false
          },
          responseXML: {
            value: responseXML,
            writable: false
          },
          status: {
            value: status,
            writable: false
          },
          statusText: {
            value: statusText,
            writable: false
          },
          response: {
            value: responseContent,
            writable: false
          },
          responseText: {
            value: responseContent,
            writable: false
          }
        });
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new Event("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new Event("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        hit(source);
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url ]);
      thisArg.collectedHeaders.forEach((function(header) {
        var name = header[0];
        var value = header[1];
        forgedRequest.setRequestHeader(name, value);
      }));
      thisArg.collectedHeaders = [];
      try {
        Reflect.apply(nativeSend, forgedRequest, args);
      } catch (_unused) {
        return Reflect.apply(target, thisArg, args);
      }
      return undefined;
    };
    var openHandler = {
      apply: openWrapper
    };
    var sendHandler = {
      apply: sendWrapper
    };
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, openHandler);
    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, sendHandler);
    var nativeFetch = window.fetch;
    var fetchWrapper = async function fetchWrapper(target, thisArg, args) {
      var fetchURL = args[0] instanceof Request ? args[0].url : args[0];
      if (typeof fetchURL !== "string" || fetchURL.length === 0) {
        return Reflect.apply(target, thisArg, args);
      }
      if (urlMatchRegexp.test(fetchURL)) {
        var response = await nativeFetch(...args);
        var clonedResponse = response.clone();
        var responseText = await response.text();
        if (!propsToRemove && isM3U(responseText)) {
          var message = `fetch URL: ${fetchURL}\nresponse text: ${responseText}`;
          logMessage(source, message);
          return clonedResponse;
        }
        if (isPruningNeeded(responseText, removeM3ULineRegexp)) {
          var prunedText = pruneM3U(responseText);
          hit(source);
          return new Response(prunedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
        return clonedResponse;
      }
      return Reflect.apply(target, thisArg, args);
    };
    var fetchHandler = {
      apply: fetchWrapper
    };
    window.fetch = new Proxy(window.fetch, fetchHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    m3uPrune.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetSessionStorageItem":function trustedSetSessionStorageItem(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetSessionStorageItem(source, key, value) {
    if (typeof key === "undefined") {
      logMessage(source, "Item key should be specified");
      return;
    }
    if (typeof value === "undefined") {
      logMessage(source, "Item value should be specified");
      return;
    }
    var parsedValue = parseKeywordValue(value);
    var {sessionStorage: sessionStorage} = window;
    setStorageItem(source, sessionStorage, key, parsedValue);
    hit(source);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function setStorageItem(e, t, s, a) {
    try {
      t.setItem(s, a);
    } catch (t) {
      var o = `Unable to set storage item due to: ${t.message}`;
      logMessage(e, o);
    }
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetSessionStorageItem.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedReplaceOutboundText":function trustedReplaceOutboundText(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceOutboundText(source, methodPath) {
    var textToReplace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var replacement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var decodeMethod = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var stack = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    var logContent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";
    if (!methodPath) {
      return;
    }
    var getPathParts = getPropertyInChain;
    var {base: base, chain: chain, prop: prop} = getPathParts(window, methodPath);
    if (typeof chain !== "undefined") {
      logMessage(source, `Could not reach the end of the prop chain: ${methodPath}`);
      return;
    }
    var nativeMethod = base[prop];
    if (!nativeMethod || typeof nativeMethod !== "function") {
      logMessage(source, `Could not retrieve the method: ${methodPath}`);
      return;
    }
    var isValidBase64 = function isValidBase64(str) {
      try {
        if (str === "") {
          return false;
        }
        var decodedString = atob(str);
        var encodedString = btoa(decodedString);
        var stringWithoutPadding = str.replace(/=+$/, "");
        var encodedStringWithoutPadding = encodedString.replace(/=+$/, "");
        return encodedStringWithoutPadding === stringWithoutPadding;
      } catch (e) {
        return false;
      }
    };
    var decodeAndReplaceContent = function decodeAndReplaceContent(content, pattern, textReplacement, decode, log) {
      switch (decode) {
       case "base64":
        try {
          if (!isValidBase64(content)) {
            logMessage(source, `Text content is not a valid base64 encoded string: ${content}`);
            return content;
          }
          var decodedContent = atob(content);
          if (log) {
            logMessage(source, `Decoded text content: ${decodedContent}`);
          }
          var modifiedContent = textToReplace ? decodedContent.replace(pattern, textReplacement) : decodedContent;
          if (log) {
            var message = modifiedContent !== decodedContent ? `Modified decoded text content: ${modifiedContent}` : "Decoded text content was not modified";
            logMessage(source, message);
          }
          var encodedContent = btoa(modifiedContent);
          return encodedContent;
        } catch (e) {
          return content;
        }

       default:
        return content.replace(pattern, textReplacement);
      }
    };
    var logOriginalContent = !textToReplace || !!logContent;
    var logModifiedContent = !!logContent;
    var logDecodedContent = !!decodeMethod && !!logContent;
    var isMatchingSuspended = false;
    var objectWrapper = function objectWrapper(target, thisArg, argumentsList) {
      if (isMatchingSuspended) {
        return Reflect.apply(target, thisArg, argumentsList);
      }
      isMatchingSuspended = true;
      hit(source);
      var result = Reflect.apply(target, thisArg, argumentsList);
      if (stack && !matchStackTrace(stack, (new Error).stack || "")) {
        return result;
      }
      if (typeof result === "string") {
        if (logOriginalContent) {
          logMessage(source, `Original text content: ${result}`);
        }
        var patternRegexp = toRegExp(textToReplace);
        var modifiedContent = textToReplace || logDecodedContent ? decodeAndReplaceContent(result, patternRegexp, replacement, decodeMethod, logContent) : result;
        if (logModifiedContent) {
          var message = modifiedContent !== result ? `Modified text content: ${modifiedContent}` : "Text content was not modified";
          logMessage(source, message);
        }
        isMatchingSuspended = false;
        return modifiedContent;
      }
      isMatchingSuspended = false;
      logMessage(source, "Content is not a string");
      return result;
    };
    var objectHandler = {
      apply: objectWrapper
    };
    base[prop] = new Proxy(nativeMethod, objectHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceOutboundText.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"setAttr":function setAttr(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setAttr(source, selector, attr) {
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    if (!selector || !attr) {
      return;
    }
    var allowedValues = [ "true", "false" ];
    var shouldCopyValue = value.startsWith("[") && value.endsWith("]");
    var isValidValue = value.length === 0 || !nativeIsNaN(parseInt(value, 10)) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 32767 || allowedValues.includes(value.toLowerCase());
    if (!shouldCopyValue && !isValidValue) {
      logMessage(source, `Invalid attribute value provided: '${convertTypeToString(value)}'`);
      return;
    }
    var attributeHandler;
    if (shouldCopyValue) {
      attributeHandler = function attributeHandler(elem, attr, value) {
        var valueToCopy = elem.getAttribute(value.slice(1, -1));
        if (valueToCopy === null) {
          logMessage(source, `No element attribute found to copy value from: ${value}`);
        }
        elem.setAttribute(attr, valueToCopy);
      };
    }
    setAttributeBySelector(source, selector, attr, value, attributeHandler);
    observeDOMChanges((function() {
      return setAttributeBySelector(source, selector, attr, value, attributeHandler);
    }), true);
  }
  function setAttributeBySelector(e, t, l, o) {
    var r, c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : defaultAttributeSetter;
    try {
      r = document.querySelectorAll(t);
    } catch (l) {
      return void logMessage(e, `Failed to find elements matching selector "${t}"`);
    }
    if (r && 0 !== r.length) try {
      r.forEach((function(e) {
        return c(e, l, o);
      })), hit(e);
    } catch (t) {
      logMessage(e, `Failed to set [${l}="${o}"] to each of selected elements.`);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function convertTypeToString(n) {
    return void 0 === n ? "undefined" : "object" == typeof n ? null === n ? "null" : objectToString(n) : String(n);
  }
  function defaultAttributeSetter(t, e, r) {
    return t.setAttribute(e, r);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function throttle(n, t) {
    var r, e = false, _wrapper7 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper7(...r), r = null);
      }), t));
    };
    return _wrapper7;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setAttr.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"forceWindowClose":function forceWindowClose(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function forceWindowClose(source) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    if (typeof window.close !== "function") {
      var message = "window.close() is not a function so 'close-window' scriptlet is unavailable";
      logMessage(source, message);
      return;
    }
    var closeImmediately = function closeImmediately() {
      try {
        hit(source);
        window.close();
      } catch (e) {
        logMessage(source, e);
      }
    };
    var closeByExtension = function closeByExtension() {
      var extCall = function extCall() {
        dispatchEvent(new Event("adguard:scriptlet-close-window"));
      };
      window.addEventListener("adguard:subscribed-to-close-window", extCall, {
        once: true
      });
      setTimeout((function() {
        window.removeEventListener("adguard:subscribed-to-close-window", extCall, {
          once: true
        });
      }), 5e3);
    };
    var shouldClose = function shouldClose() {
      if (path === "") {
        return true;
      }
      var pathRegexp = toRegExp(path);
      var currentPath = `${window.location.pathname}${window.location.search}`;
      return pathRegexp.test(currentPath);
    };
    if (shouldClose()) {
      closeImmediately();
      if (navigator.userAgent.includes("Chrome")) {
        closeByExtension();
      }
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    forceWindowClose.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"preventCanvas":function preventCanvas(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventCanvas(source, contextType) {
    var handlerWrapper = function handlerWrapper(target, thisArg, argumentsList) {
      var type = argumentsList[0];
      var shouldPrevent = false;
      if (!contextType) {
        shouldPrevent = true;
      } else if (isValidMatchStr(contextType)) {
        var {isInvertedMatch: isInvertedMatch, matchRegexp: matchRegexp} = parseMatchArg(contextType);
        shouldPrevent = matchRegexp.test(type) !== isInvertedMatch;
      } else {
        logMessage(source, `Invalid contextType parameter: ${contextType}`);
        shouldPrevent = false;
      }
      if (shouldPrevent) {
        hit(source);
        return null;
      }
      return Reflect.apply(target, thisArg, argumentsList);
    };
    var canvasHandler = {
      apply: handlerWrapper
    };
    window.HTMLCanvasElement.prototype.getContext = new Proxy(window.HTMLCanvasElement.prototype.getContext, canvasHandler);
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventCanvas.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
},
"trustedSetCookieReload":function trustedSetCookieReload(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetCookieReload(source, name, value) {
    var offsetExpiresSec = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
    var domain = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
    if (typeof name === "undefined") {
      logMessage(source, "Cookie name should be specified");
      return;
    }
    if (typeof value === "undefined") {
      logMessage(source, "Cookie value should be specified");
      return;
    }
    if (isCookieSetWithValue(document.cookie, name, value)) {
      return;
    }
    var parsedValue = parseKeywordValue(value);
    if (!isValidCookiePath(path)) {
      logMessage(source, `Invalid cookie path: '${path}'`);
      return;
    }
    if (!document.location.origin.includes(domain)) {
      logMessage(source, `Cookie domain not matched by origin: '${domain}'`);
      return;
    }
    var cookieToSet = serializeCookie(name, parsedValue, path, domain, false);
    if (!cookieToSet) {
      logMessage(source, "Invalid cookie name or value");
      return;
    }
    if (offsetExpiresSec) {
      var parsedOffsetMs = getTrustedCookieOffsetMs(offsetExpiresSec);
      if (!parsedOffsetMs) {
        logMessage(source, `Invalid offsetExpiresSec value: ${offsetExpiresSec}`);
        return;
      }
      var expires = Date.now() + parsedOffsetMs;
      cookieToSet += `; expires=${new Date(expires).toUTCString()}`;
    }
    document.cookie = cookieToSet;
    hit(source);
    var cookieValueToCheck = parseCookieString(document.cookie)[name];
    if (isCookieSetWithValue(document.cookie, name, cookieValueToCheck)) {
      window.location.reload();
    }
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function isCookieSetWithValue(e, r, t) {
    var n = /\$(?:currentISODate|currentDate|now)\$/g, u = "string" == typeof t ? t.match(n) : null, i = null;
    if (u) {
      var a = t.split(n).map((function(e, r) {
        var t = u[r];
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (t ? function(e) {
          switch (e) {
           case "$now$":
            return `(\\d{${`${Date.now()}`.length}})`;

           case "$currentDate$":
            return "(\\w{3} \\w{3} \\d{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT[+-]\\d{4}(?: \\([^)]*\\))?)";

           case "$currentISODate$":
            return "(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)";

           default:
            return "";
          }
        }(t) : "");
      })).join("");
      i = new RegExp(`^${a}$`);
    }
    return e.split(";").some((function(e) {
      var n = e.indexOf("=");
      if (-1 === n) return false;
      var u = e.slice(0, n).trim(), a = e.slice(n + 1).trim();
      if (r !== u) return false;
      if (i) {
        var c = i.exec(a);
        if (null === c) return false;
        var d = Date.now();
        return c.slice(1).every((function(e) {
          return (/^\d+$/.test(e) ? parseInt(e, 10) : new Date(e).getTime()) > d - 864e5;
        }));
      }
      return t === a;
    }));
  }
  function serializeCookie(e, o, i) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", t = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
    if (!t && `${o}`.includes(";") || e.includes(";")) return null;
    var r = `${e}=${t ? encodeURIComponent(o) : o}`;
    if (e.startsWith("__Host-")) return r += "; path=/; secure", n && console.debug(`Domain value: "${n}" has been ignored, because is not allowed for __Host- prefixed cookies`), 
    r;
    var s = getCookiePath(i);
    return s && (r += `; ${s}`), e.startsWith("__Secure-") && (r += "; secure"), n && (r += `; domain=${n}`), 
    r;
  }
  function isValidCookiePath(n) {
    return "/" === n || "none" === n;
  }
  function getTrustedCookieOffsetMs(e) {
    var r;
    if ("1year" === e) r = 31536e3; else if ("1day" === e) r = 86400; else if (r = Number.parseInt(e, 10), 
    Number.isNaN(r)) return null;
    return 1e3 * r;
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function parseCookieString(i) {
    var r = i.split(";"), n = {};
    return r.forEach((function(i) {
      var r, t = "", e = i.indexOf("=");
      -1 === e ? r = i.trim() : (r = i.slice(0, e).trim(), t = i.slice(e + 1)), n[r] = t || null;
    })), n;
  }
  function getCookiePath(t) {
    return "/" === t ? "path=/" : "";
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedSetCookieReload.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
}};
Object.defineProperty(globalThis,'__clearviewFixes',{configurable:true,value(keys,records){
const host=location.hostname.toLowerCase().replace(/\.$/,'');
const suffix=globalThis.AdShieldDomainUtils.getPublicSuffix(host,{allowPrivateDomains:false}) || '';
const entity=suffix && host.length>suffix.length?host.slice(0,-suffix.length-1):'';
const own=[...host.split('.').map((_,i,a)=>a.slice(i).join('.')),...(entity?entity.split('.').map((_,i,a)=>a.slice(i).join('.')+'.*'):[])];
const candidates=[...new Set(own.flatMap(key=>keys[key] || []))];
if(!candidates.length)return;
const listed=x=>x.endsWith('.*')?(entity===x.slice(0,-2) || entity.endsWith('.'+x.slice(0,-2))):(host===x || host.endsWith('.'+x));
const excluded=exceptions.filter(entry=>(!entry.include.length || entry.include.some(listed)) && !entry.exclude.some(listed));
for(const i of candidates){const [name,implementation,args,exclude]=records[i];if(exclude.some(listed) || excluded.some(x=>x.all || (x.implementation===implementation && JSON.stringify(x.args)===JSON.stringify(args))))continue;try{implementations[implementation]({name,args,engine:'extension',version:'2.5.1',verbose:false,domainName:host,uniqueId:'ad-shield-4'},args);}catch(error){console.debug('Clearview site fix:',name,error.message);}}
}});
})();
