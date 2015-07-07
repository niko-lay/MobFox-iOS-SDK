(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
 
    var vast        = require('./lib/vast.js'),
        parser      = require('./lib/parser.js'),
        player      = require('./lib/player.js');

    window.loadAd    = function(url,options,cb){

        url             = url || "http://my.mobfox.com/request.php";      
        cb              = cb || function(){};
        options         = options || {};
        options.rt      = "api";
        options.r_type  = "video";
        options.r_resp  = "vast20";
        options.u       = options.u || navigator.userAgent;
        
        var autoplay    = options.autoplay;
        var skip        = options.skip;
        delete options.autoplay;
        delete options.skip;

        vast.parse(url,options,function(err,json){
            
            if(err) return cb({error:err});

            var params = parser(json);
            if(params.error){
                return cb(params);
            }
            params.autoplay = autoplay;
            params.skip     = skip;
            player(params,document.body);

            cb(null,"ad loaded");
        });
    };

    window.play = function(vastURL,autoplay,skip){
    
        autoplay    = autoplay || true;
        skip        = skip || true;

        vast.parse(vastURL,{},function(err,json){
            
            if(err) return err;

            var params = parser(json);
            if(params.error){
                return params.error;
            }
            params.autoplay = autoplay;
            params.skip = skip;
            player(params,document.body);

        });
    };

   //---------------------------------------------------------
   //iOS bridge code
    function connectWebViewJavascriptBridge(callback) {
        
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    }

   //---------------------------------------------------------
    connectWebViewJavascriptBridge(function(bridge) {
        
        bridge.init(function(params, cb) {
            loadAd("http://my.mobfox.com/request.php",params,function(err,callback){

                if(err) return cb({error:err});
                     
                cb(callback);

            });            
        });
        window.bridge = bridge;
    });
   //---------------------------------------------------------
})();

},{"./lib/parser.js":4,"./lib/player.js":5,"./lib/vast.js":6}],2:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b="length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,aa=/[+~]/,ba=/'|\\/g,ca=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),da=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ea=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fa){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ba,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+ra(o[l]);w=aa.test(a)&&pa(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",ea,!1):e.attachEvent&&e.attachEvent("onunload",ea)),p=!f(g),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?la(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ca,da),a[3]=(a[3]||a[4]||a[5]||"").replace(ca,da),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ca,da).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(ca,da),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return W.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(ca,da).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:oa(function(){return[0]}),last:oa(function(a,b){return[b-1]}),eq:oa(function(a,b,c){return[0>c?c+b:c]}),even:oa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:oa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:oa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:oa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function qa(){}qa.prototype=d.filters=d.pseudos,d.setFilters=new qa,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function ra(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sa(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function ta(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ua(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function va(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wa(a,b,c,d,e,f){return d&&!d[u]&&(d=wa(d)),e&&!e[u]&&(e=wa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ua(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:va(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=va(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=va(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sa(function(a){return a===b},h,!0),l=sa(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sa(ta(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wa(i>1&&ta(m),i>1&&ra(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xa(a.slice(i,e)),f>e&&xa(a=a.slice(e)),f>e&&ra(a))}m.push(c)}return ta(m)}function ya(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=va(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&ga.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,ya(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ca,da),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ca,da),aa.test(j[0].type)&&pa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&ra(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,aa.test(a)&&pa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){
return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ba=/<([\w:]+)/,ca=/<|&#?\w+;/,da=/<(?:script|style|link)/i,ea=/checked\s*(?:[^=]|=\s*.checked.)/i,fa=/^$|\/(?:java|ecma)script/i,ga=/^true\/(.*)/,ha=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ia={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ia.optgroup=ia.option,ia.tbody=ia.tfoot=ia.colgroup=ia.caption=ia.thead,ia.th=ia.td;function ja(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function ka(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function la(a){var b=ga.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function ma(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function na(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function oa(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pa(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=oa(h),f=oa(a),d=0,e=f.length;e>d;d++)pa(f[d],g[d]);if(b)if(c)for(f=f||oa(a),g=g||oa(h),d=0,e=f.length;e>d;d++)na(f[d],g[d]);else na(a,h);return g=oa(h,"script"),g.length>0&&ma(g,!i&&oa(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(ca.test(e)){f=f||k.appendChild(b.createElement("div")),g=(ba.exec(e)||["",""])[1].toLowerCase(),h=ia[g]||ia._default,f.innerHTML=h[1]+e.replace(aa,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=oa(k.appendChild(e),"script"),i&&ma(f),c)){j=0;while(e=f[j++])fa.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(oa(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&ma(oa(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(oa(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!da.test(a)&&!ia[(ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(aa,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(oa(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(oa(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&ea.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(oa(c,"script"),ka),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,oa(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,la),j=0;g>j;j++)h=f[j],fa.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(ha,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qa,ra={};function sa(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function ta(a){var b=l,c=ra[a];return c||(c=sa(a,b),"none"!==c&&c||(qa=(qa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qa[0].contentDocument,b.write(),b.close(),c=sa(a,b),qa.detach()),ra[a]=c),c}var ua=/^margin/,va=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wa=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xa(a,b,c){var d,e,f,g,h=a.style;return c=c||wa(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),va.test(g)&&ua.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function ya(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var za=/^(none|table(?!-c[ea]).+)/,Aa=new RegExp("^("+Q+")(.*)$","i"),Ba=new RegExp("^([+-])=("+Q+")","i"),Ca={position:"absolute",visibility:"hidden",display:"block"},Da={letterSpacing:"0",fontWeight:"400"},Ea=["Webkit","O","Moz","ms"];function Fa(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Ea.length;while(e--)if(b=Ea[e]+c,b in a)return b;return d}function Ga(a,b,c){var d=Aa.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Ha(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ia(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wa(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xa(a,b,f),(0>e||null==e)&&(e=a.style[b]),va.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Ha(a,b,c||(g?"border":"content"),d,f)+"px"}function Ja(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",ta(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xa(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fa(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Ba.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fa(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xa(a,b,d)),"normal"===e&&b in Da&&(e=Da[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?za.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Ca,function(){return Ia(a,b,d)}):Ia(a,b,d):void 0},set:function(a,c,d){var e=d&&wa(a);return Ga(a,c,d?Ha(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=ya(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ua.test(a)||(n.cssHooks[a+b].set=Ga)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wa(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Ja(this,!0)},hide:function(){return Ja(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Ka(a,b,c,d,e){return new Ka.prototype.init(a,b,c,d,e)}n.Tween=Ka,Ka.prototype={constructor:Ka,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ka.propHooks[this.prop];return a&&a.get?a.get(this):Ka.propHooks._default.get(this)},run:function(a){var b,c=Ka.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ka.propHooks._default.set(this),this}},Ka.prototype.init.prototype=Ka.prototype,Ka.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Ka.propHooks.scrollTop=Ka.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Ka.prototype.init,n.fx.step={};var La,Ma,Na=/^(?:toggle|show|hide)$/,Oa=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pa=/queueHooks$/,Qa=[Va],Ra={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Oa.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Oa.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sa(){return setTimeout(function(){La=void 0}),La=n.now()}function Ta(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ua(a,b,c){for(var d,e=(Ra[b]||[]).concat(Ra["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Va(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||ta(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Na.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?ta(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ua(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wa(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xa(a,b,c){var d,e,f=0,g=Qa.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=La||Sa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:La||Sa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wa(k,j.opts.specialEasing);g>f;f++)if(d=Qa[f].call(j,a,k,j.opts))return d;return n.map(k,Ua,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xa,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Ra[c]=Ra[c]||[],Ra[c].unshift(b)},prefilter:function(a,b){b?Qa.unshift(a):Qa.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xa(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pa.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Ta(b,!0),a,d,e)}}),n.each({slideDown:Ta("show"),slideUp:Ta("hide"),slideToggle:Ta("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(La=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),La=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ma||(Ma=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Ma),Ma=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Ya,Za,$a=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Za:Ya)),
void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Za={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$a[b]||n.find.attr;$a[b]=function(a,b,d){var e,f;return d||(f=$a[b],$a[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$a[b]=f),e}});var _a=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_a.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ab=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ab," ").indexOf(b)>=0)return!0;return!1}});var bb=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cb=n.now(),db=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var eb=/#.*$/,fb=/([?&])_=[^&]*/,gb=/^(.*?):[ \t]*([^\r\n]*)$/gm,hb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ib=/^(?:GET|HEAD)$/,jb=/^\/\//,kb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lb={},mb={},nb="*/".concat("*"),ob=a.location.href,pb=kb.exec(ob.toLowerCase())||[];function qb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rb(a,b,c,d){var e={},f=a===mb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function ub(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ob,type:"GET",isLocal:hb.test(pb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sb(sb(a,n.ajaxSettings),b):sb(n.ajaxSettings,a)},ajaxPrefilter:qb(lb),ajaxTransport:qb(mb),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gb.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||ob)+"").replace(eb,"").replace(jb,pb[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kb.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pb[1]&&h[2]===pb[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pb[3]||("http:"===pb[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rb(lb,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ib.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(db.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fb.test(d)?d.replace(fb,"$1_="+cb++):d+(db.test(d)?"&":"?")+"_="+cb++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nb+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rb(mb,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tb(k,v,f)),u=ub(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vb=/%20/g,wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&").replace(vb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bb=0,Cb={},Db={0:200,1223:204},Eb=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cb)Cb[a]()}),k.cors=!!Eb&&"withCredentials"in Eb,k.ajax=Eb=!!Eb,n.ajaxTransport(function(a){var b;return k.cors||Eb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cb[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Db[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cb[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fb=[],Gb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fb.pop()||n.expando+"_"+cb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gb.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gb,"$1"+e):b.jsonp!==!1&&(b.url+=(db.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hb)return Hb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ib=a.document.documentElement;function Jb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ib;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ib})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jb(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=ya(k.pixelPosition,function(a,c){return c?(c=xa(a,b),va.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kb=a.jQuery,Lb=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lb),b&&a.jQuery===n&&(a.jQuery=Kb),n},typeof b===U&&(a.jQuery=a.$=n),n});

; browserify_shim__define__module__export__(typeof $ != "undefined" ? $ : window.$);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){

; require("/Users/nabriski/projects/vast/js/jquery.js");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){"use strict";var t={},n=Math.max,r=Math.min;t.c={};t.c.d=e(document);t.c.t=function(e){return e.originalEvent.touches.length-1};t.o=function(){var n=this;this.o=null;this.$=null;this.i=null;this.g=null;this.v=null;this.cv=null;this.x=0;this.y=0;this.w=0;this.h=0;this.$c=null;this.c=null;this.t=0;this.isInit=false;this.fgColor=null;this.pColor=null;this.dH=null;this.cH=null;this.eH=null;this.rH=null;this.scale=1;this.relative=false;this.relativeWidth=false;this.relativeHeight=false;this.$div=null;this.run=function(){var t=function(e,t){var r;for(r in t){n.o[r]=t[r]}n._carve().init();n._configure()._draw()};if(this.$.data("kontroled"))return;this.$.data("kontroled",true);this.extend();this.o=e.extend({min:this.$.data("min")!==undefined?this.$.data("min"):0,max:this.$.data("max")!==undefined?this.$.data("max"):100,stopper:true,readOnly:this.$.data("readonly")||this.$.attr("readonly")==="readonly",cursor:this.$.data("cursor")===true&&30||this.$.data("cursor")||0,thickness:this.$.data("thickness")&&Math.max(Math.min(this.$.data("thickness"),1),.01)||.35,lineCap:this.$.data("linecap")||"butt",width:this.$.data("width")||200,height:this.$.data("height")||200,displayInput:this.$.data("displayinput")==null||this.$.data("displayinput"),displayPrevious:this.$.data("displayprevious"),fgColor:this.$.data("fgcolor")||"#87CEEB",inputColor:this.$.data("inputcolor"),font:this.$.data("font")||"Arial",fontWeight:this.$.data("font-weight")||"bold",inline:false,step:this.$.data("step")||1,rotation:this.$.data("rotation"),draw:null,change:null,cancel:null,release:null,format:function(e){return e},parse:function(e){return parseFloat(e)}},this.o);this.o.flip=this.o.rotation==="anticlockwise"||this.o.rotation==="acw";if(!this.o.inputColor){this.o.inputColor=this.o.fgColor}if(this.$.is("fieldset")){this.v={};this.i=this.$.find("input");this.i.each(function(t){var r=e(this);n.i[t]=r;n.v[t]=n.o.parse(r.val());r.bind("change blur",function(){var e={};e[t]=r.val();n.val(n._validate(e))})});this.$.find("legend").remove()}else{this.i=this.$;this.v=this.o.parse(this.$.val());this.v===""&&(this.v=this.o.min);this.$.bind("change blur",function(){n.val(n._validate(n.o.parse(n.$.val())))})}!this.o.displayInput&&this.$.hide();this.$c=e(document.createElement("canvas")).attr({width:this.o.width,height:this.o.height});this.$div=e('<div style="'+(this.o.inline?"display:inline;":"")+"width:"+this.o.width+"px;height:"+this.o.height+"px;"+'"></div>');this.$.wrap(this.$div).before(this.$c);this.$div=this.$.parent();if(typeof G_vmlCanvasManager!=="undefined"){G_vmlCanvasManager.initElement(this.$c[0])}this.c=this.$c[0].getContext?this.$c[0].getContext("2d"):null;if(!this.c){throw{name:"CanvasNotSupportedException",message:"Canvas not supported. Please use excanvas on IE8.0.",toString:function(){return this.name+": "+this.message}}}this.scale=(window.devicePixelRatio||1)/(this.c.webkitBackingStorePixelRatio||this.c.mozBackingStorePixelRatio||this.c.msBackingStorePixelRatio||this.c.oBackingStorePixelRatio||this.c.backingStorePixelRatio||1);this.relativeWidth=this.o.width%1!==0&&this.o.width.indexOf("%");this.relativeHeight=this.o.height%1!==0&&this.o.height.indexOf("%");this.relative=this.relativeWidth||this.relativeHeight;this._carve();if(this.v instanceof Object){this.cv={};this.copy(this.v,this.cv)}else{this.cv=this.v}this.$.bind("configure",t).parent().bind("configure",t);this._listen()._configure()._xy().init();this.isInit=true;this.$.val(this.o.format(this.v));this._draw();return this};this._carve=function(){if(this.relative){var e=this.relativeWidth?this.$div.parent().width()*parseInt(this.o.width)/100:this.$div.parent().width(),t=this.relativeHeight?this.$div.parent().height()*parseInt(this.o.height)/100:this.$div.parent().height();this.w=this.h=Math.min(e,t)}else{this.w=this.o.width;this.h=this.o.height}this.$div.css({width:this.w+"px",height:this.h+"px"});this.$c.attr({width:this.w,height:this.h});if(this.scale!==1){this.$c[0].width=this.$c[0].width*this.scale;this.$c[0].height=this.$c[0].height*this.scale;this.$c.width(this.w);this.$c.height(this.h)}return this};this._draw=function(){var e=true;n.g=n.c;n.clear();n.dH&&(e=n.dH());e!==false&&n.draw()};this._touch=function(e){var r=function(e){var t=n.xy2val(e.originalEvent.touches[n.t].pageX,e.originalEvent.touches[n.t].pageY);if(t==n.cv)return;if(n.cH&&n.cH(t)===false)return;n.change(n._validate(t));n._draw()};this.t=t.c.t(e);r(e);t.c.d.bind("touchmove.k",r).bind("touchend.k",function(){t.c.d.unbind("touchmove.k touchend.k");n.val(n.cv)});return this};this._mouse=function(e){var r=function(e){var t=n.xy2val(e.pageX,e.pageY);if(t==n.cv)return;if(n.cH&&n.cH(t)===false)return;n.change(n._validate(t));n._draw()};r(e);t.c.d.bind("mousemove.k",r).bind("keyup.k",function(e){if(e.keyCode===27){t.c.d.unbind("mouseup.k mousemove.k keyup.k");if(n.eH&&n.eH()===false)return;n.cancel()}}).bind("mouseup.k",function(e){t.c.d.unbind("mousemove.k mouseup.k keyup.k");n.val(n.cv)});return this};this._xy=function(){var e=this.$c.offset();this.x=e.left;this.y=e.top;return this};this._listen=function(){if(!this.o.readOnly){this.$c.bind("mousedown",function(e){e.preventDefault();n._xy()._mouse(e)}).bind("touchstart",function(e){e.preventDefault();n._xy()._touch(e)});this.listen()}else{this.$.attr("readonly","readonly")}if(this.relative){e(window).resize(function(){n._carve().init();n._draw()})}return this};this._configure=function(){if(this.o.draw)this.dH=this.o.draw;if(this.o.change)this.cH=this.o.change;if(this.o.cancel)this.eH=this.o.cancel;if(this.o.release)this.rH=this.o.release;if(this.o.displayPrevious){this.pColor=this.h2rgba(this.o.fgColor,"0.4");this.fgColor=this.h2rgba(this.o.fgColor,"0.6")}else{this.fgColor=this.o.fgColor}return this};this._clear=function(){this.$c[0].width=this.$c[0].width};this._validate=function(e){var t=~~((e<0?-.5:.5)+e/this.o.step)*this.o.step;return Math.round(t*100)/100};this.listen=function(){};this.extend=function(){};this.init=function(){};this.change=function(e){};this.val=function(e){};this.xy2val=function(e,t){};this.draw=function(){};this.clear=function(){this._clear()};this.h2rgba=function(e,t){var n;e=e.substring(1,7);n=[parseInt(e.substring(0,2),16),parseInt(e.substring(2,4),16),parseInt(e.substring(4,6),16)];return"rgba("+n[0]+","+n[1]+","+n[2]+","+t+")"};this.copy=function(e,t){for(var n in e){t[n]=e[n]}}};t.Dial=function(){t.o.call(this);this.startAngle=null;this.xy=null;this.radius=null;this.lineWidth=null;this.cursorExt=null;this.w2=null;this.PI2=2*Math.PI;this.extend=function(){this.o=e.extend({bgColor:this.$.data("bgcolor")||"#EEEEEE",angleOffset:this.$.data("angleoffset")||0,angleArc:this.$.data("anglearc")||360,inline:true},this.o)};this.val=function(e,t){if(null!=e){e=this.o.parse(e);if(t!==false&&e!=this.v&&this.rH&&this.rH(e)===false){return}this.cv=this.o.stopper?n(r(e,this.o.max),this.o.min):e;this.v=this.cv;this.$.val(this.o.format(this.v));this._draw()}else{return this.v}};this.xy2val=function(e,t){var i,s;i=Math.atan2(e-(this.x+this.w2),-(t-this.y-this.w2))-this.angleOffset;if(this.o.flip){i=this.angleArc-i-this.PI2}if(this.angleArc!=this.PI2&&i<0&&i>-.5){i=0}else if(i<0){i+=this.PI2}s=i*(this.o.max-this.o.min)/this.angleArc+this.o.min;this.o.stopper&&(s=n(r(s,this.o.max),this.o.min));return s};this.listen=function(){var t=this,i,s,o=function(e){e.preventDefault();var o=e.originalEvent,u=o.detail||o.wheelDeltaX,a=o.detail||o.wheelDeltaY,f=t._validate(t.o.parse(t.$.val()))+(u>0||a>0?t.o.step:u<0||a<0?-t.o.step:0);f=n(r(f,t.o.max),t.o.min);t.val(f,false);if(t.rH){clearTimeout(i);i=setTimeout(function(){t.rH(f);i=null},100);if(!s){s=setTimeout(function(){if(i)t.rH(f);s=null},200)}}},u,a,f=1,l={37:-t.o.step,38:t.o.step,39:t.o.step,40:-t.o.step};this.$.bind("keydown",function(i){var s=i.keyCode;if(s>=96&&s<=105){s=i.keyCode=s-48}u=parseInt(String.fromCharCode(s));if(isNaN(u)){s!==13&&s!==8&&s!==9&&s!==189&&(s!==190||t.$.val().match(/\./))&&i.preventDefault();if(e.inArray(s,[37,38,39,40])>-1){i.preventDefault();var o=t.o.parse(t.$.val())+l[s]*f;t.o.stopper&&(o=n(r(o,t.o.max),t.o.min));t.change(t._validate(o));t._draw();a=window.setTimeout(function(){f*=2},30)}}}).bind("keyup",function(e){if(isNaN(u)){if(a){window.clearTimeout(a);a=null;f=1;t.val(t.$.val())}}else{t.$.val()>t.o.max&&t.$.val(t.o.max)||t.$.val()<t.o.min&&t.$.val(t.o.min)}});this.$c.bind("mousewheel DOMMouseScroll",o);this.$.bind("mousewheel DOMMouseScroll",o)};this.init=function(){if(this.v<this.o.min||this.v>this.o.max){this.v=this.o.min}this.$.val(this.v);this.w2=this.w/2;this.cursorExt=this.o.cursor/100;this.xy=this.w2*this.scale;this.lineWidth=this.xy*this.o.thickness;this.lineCap=this.o.lineCap;this.radius=this.xy-this.lineWidth/2;this.o.angleOffset&&(this.o.angleOffset=isNaN(this.o.angleOffset)?0:this.o.angleOffset);this.o.angleArc&&(this.o.angleArc=isNaN(this.o.angleArc)?this.PI2:this.o.angleArc);this.angleOffset=this.o.angleOffset*Math.PI/180;this.angleArc=this.o.angleArc*Math.PI/180;this.startAngle=1.5*Math.PI+this.angleOffset;this.endAngle=1.5*Math.PI+this.angleOffset+this.angleArc;var e=n(String(Math.abs(this.o.max)).length,String(Math.abs(this.o.min)).length,2)+2;this.o.displayInput&&this.i.css({width:(this.w/2+4>>0)+"px",height:(this.w/3>>0)+"px",position:"absolute","vertical-align":"middle","margin-top":(this.w/3>>0)+"px","margin-left":"-"+(this.w*3/4+2>>0)+"px",border:0,background:"none",font:this.o.fontWeight+" "+(this.w/e>>0)+"px "+this.o.font,"text-align":"center",color:this.o.inputColor||this.o.fgColor,padding:"0px","-webkit-appearance":"none"})||this.i.css({width:"0px",visibility:"hidden"})};this.change=function(e){this.cv=e;this.$.val(this.o.format(e))};this.angle=function(e){return(e-this.o.min)*this.angleArc/(this.o.max-this.o.min)};this.arc=function(e){var t,n;e=this.angle(e);if(this.o.flip){t=this.endAngle+1e-5;n=t-e-1e-5}else{t=this.startAngle-1e-5;n=t+e+1e-5}this.o.cursor&&(t=n-this.cursorExt)&&(n=n+this.cursorExt);return{s:t,e:n,d:this.o.flip&&!this.o.cursor}};this.draw=function(){var e=this.g,t=this.arc(this.cv),n,r=1;e.lineWidth=this.lineWidth;e.lineCap=this.lineCap;if(this.o.bgColor!=="none"){e.beginPath();e.strokeStyle=this.o.bgColor;e.arc(this.xy,this.xy,this.radius,this.endAngle-1e-5,this.startAngle+1e-5,true);e.stroke()}if(this.o.displayPrevious){n=this.arc(this.v);e.beginPath();e.strokeStyle=this.pColor;e.arc(this.xy,this.xy,this.radius,n.s,n.e,n.d);e.stroke();r=this.cv==this.v}e.beginPath();e.strokeStyle=r?this.o.fgColor:this.fgColor;e.arc(this.xy,this.xy,this.radius,t.s,t.e,t.d);e.stroke()};this.cancel=function(){this.val(this.v)}};e.fn.dial=e.fn.knob=function(n){return this.each(function(){var r=new t.Dial;r.o=n;r.$=e(this);r.run()}).parent()}})
}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"/Users/nabriski/projects/vast/js/jquery.js":2}],4:[function(require,module,exports){
var formatURL = function(url){
    return url.replace(/[\r\n\s]*/g,"");
};

module.exports = function(vastArr){

    if(!vastArr || vastArr.length === 0){
        return {error:"empty"};
    }

    if(vastArr[0].error){
        return {error:vastArr[0].error};
    }

    var ret = {
        impressions : [],
        tracking : {}
    };

    vastArr.forEach(function(v){

        var root = v.DAAST ? v.DAAST : v.VAST;

        if(Array.isArray(root.Ad)){
            root.Ad = root.Ad[0];
        }

        if(root.Ad.InLine.Impression){

            var impressions = root.Ad.InLine.Impression;

            if(!Array.isArray(impressions)){
                impressions = [impressions]; 
            }

            impressions.forEach(function(impURL){
                ret.impressions.push(formatURL(impURL.__cdata || impURL));
            });
        }

        var creative = root.Ad.InLine.Creatives.Creative;
        if(Array.isArray(creative)){
            creative = creative[0];
        }
        var trackingEvents = creative.Linear.TrackingEvents;
        if(trackingEvents && trackingEvents.Tracking){
            if(!Array.isArray(trackingEvents.Tracking)){
                trackingEvents.Tracking = [trackingEvents.Tracking];
            }
            trackingEvents.Tracking.forEach(function(t){
                
                var url         = formatURL(t.__text || t.__cdata),
                    eventType   = t._event;

                if(!ret.tracking[eventType]) ret.tracking[eventType] = [];

                ret.tracking[eventType].push(url);
            });
        }
   
    });

    var last            = vastArr.slice(-1)[0],
        type            = last.DAAST ? "DAAST" : "VAST",
        creatives       = last[type].Ad.InLine.Creatives.Creative;
        creativesArr    = Array.isArray(creatives) ? creatives : [creatives],
        linear          = creativesArr
                            .filter(function(c){
                                return c.Linear;
                            })
                            .map(function(c){
                                return c.Linear;
                            })[0],
        media           = creativesArr
                            .filter(function(c){
                                return c.Linear;
                            })
                            .map(function(c){
                                return c.Linear.MediaFiles.MediaFile;
                            })[0],
        companions      = creativesArr
                            .filter(function(c){
                               return c.CompanionAds;
                            })
                            .map(function(c){
                                return c.CompanionAds.Companion;
                            });

    if(companions.length > 0){

        companions.forEach(function(comp){
            if(comp.TrackingEvents){

                if(!Array.isArray(comp.TrackingEvents.Tracking)){
                    comp.TrackingEvents.Tracking = [comp.TrackingEvents.Tracking];
                }

                comp.TrackingEvents.Tracking.forEach(function(t){

                    var url         = formatURL(t.__cdata),
                        eventType   = t._event;

                    if(!ret.tracking[eventType]) ret.tracking[eventType] = [];
                    ret.tracking[eventType].push(url);

                });
            }

        });

         ret.poster = companions
            .filter(function(comp){
                return comp.StaticResource && comp.StaticResource._creativeType.indexOf("image") === 0;
            })
            .map(function(comp){
                return {
                    url : formatURL(comp.StaticResource.__cdata),
                    width : comp._width,
                    height : comp._height
                };
            })[0];
    }                        

    ret.mime       = media._type;
    ret.src         = formatURL(media.__cdata || media.__text);

    ret.clickURL = "#";
    if(linear.VideoClicks){
        
        if(!Array.isArray(linear.VideoClicks)){
            linear.VideoClicks = [linear.VideoClicks];
        }

        linear.VideoClicks.forEach(function(vc){
            if(vc.ClickThrough){
                ret.clickURL    = formatURL(vc.ClickThrough);
            }

            if(vc.CustomClick){
                ret.clickURL    = formatURL(vc.CustomClick.__cdata || vc.CustomClick.__text);
            }
        });
    }
    ret.width       =   "100%";
    ret.height      =   "100%";

    if(ret.poster && ret.mime.indexOf("audio")===0 ){
        ret.width   = ret.poster.width+"px";
        ret.height  = ret.poster.height+"px";
    }

    return ret;

};

},{}],5:[function(require,module,exports){
var mustache        = require('mustache'),
    knob            = require("knob"),
    tmpl            = require('../templates/player.html'),
    defaultPosterURI = require('../templates/poster.txt');


module.exports = function(params,parent){

    params.tag = "video";
    if(!params.poster && params.mime.indexOf("audio")===0){
        params.poster = {url:defaultPosterURI};
    }

    var playerHTML =mustache.render(
        tmpl, 
        params 
    );

    parent.insertAdjacentHTML('beforeend', playerHTML);

    //center with js
    var vid = document.querySelector("#player");
   
    var y = (document.body.clientHeight - vid.clientHeight) / 2 ;

    vid.style.top = y +"px";

    //add button listeners
    vid.addEventListener("click",function(e){
        if(window.bridge){
            window.bridge.send({clickURL:vid.dataset.href});
        }
    },false);


    if(document.querySelector("#close")){
        document.querySelector("#close").addEventListener("click",function(e){
            e.stopPropagation();
            if(window.bridge){
                window.bridge.send({"close":true});
            }
            return false;
        },false);
    }

    //add tracking events
    var firstStart = true;

    if(!params.autoplay){
        vid.style.visibility = "visible";
    }

    addEventListener(
        "playing", 
        function(e) { 
            var duration = Math.ceil(e.target.duration);

            $("#timer").show();
            $("#timer").val(duration);
            $("#timer").knob({
                min:0,
                max:duration,
                readOnly:true,
                fgColor : "#fff",
                bgColor:"transparent",
                fontWeight:"bold",
                width:24,
                height:24,
                thickness:0.2
            });
            
            if(firstStart && params.tracking && params.tracking.start){
                params.tracking.start.forEach(function(url){
                    var img = new Image();
                    img.src = url;
                    img.width = 0;
                    img.height = 0;
                    document.body.appendChild(img);
                });
                firstStart = false;
            }

            vid.style.visibility = "visible";
        },
    true);

    var firstEnd = true;
    addEventListener("ended", 
                    function(e) { 
                        if(firstEnd && params.tracking && params.tracking.complete){
                            params.tracking.complete.forEach(function(url){
                                var img = new Image();
                                img.src = url;
                                img.width = 0;
                                img.height = 0;
                                document.body.appendChild(img);
                            });
                            firstEnd = false;
                        }
                    },
    true);

    addEventListener("timeupdate", 
        function(e) { 
            var pos = Math.ceil(e.srcElement.duration -e.srcElement.currentTime);
            $('#timer').val(pos).trigger('change');
        },
    true);
};

},{"../templates/player.html":15,"../templates/poster.txt":16,"knob":3,"mustache":8}],6:[function(require,module,exports){
var X2JS    = require('../lib/x2js.js'),
    x2js    = new X2JS(),
    superagent  = require('superagent');

var _parse = function(url,params,vastArr,cb){

    var req = superagent.get(url).query(params);

    if(typeof(window)==="undefined"){ //server side
        req = superagent.get(url).query(params).buffer();
    }

    req.end(function(err,res){

        if(err) return cb(err+"\n"+res.text);
        if(res.error) return cb(res.error+"\n"+res.text);

        var json = x2js.xml_str2json(res.text);

        vastArr.push(json);

        try{

            if(json.VAST && json.VAST.Ad[0].Wrapper[0].VASTAdTagURI[0]){
               return _parse(json.VAST.Ad[0].Wrapper[0].VASTAdTagURI[0],{},vastArr,cb) ;
            }

            if(json.DAAST && json.DAAST.Ad[0].Wrapper[0].DAASTAdTagURI[0]){
               return _parse(json.DAAST.Ad[0].Wrapper[0].DAASTAdTagURI[0],{},vastArr,cb) ;
            }

            cb(null,vastArr);
        }
        catch(e){
        
            cb(null,vastArr);
        }
    });
};

module.exports.parse = function(url,params,cb){
    _parse(url,params,[],cb);
    
};


},{"../lib/x2js.js":7,"superagent":9}],7:[function(require,module,exports){
/*
 Copyright 2011-2013 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var DOMParser = require('xmldom').DOMParser;

module.exports = function X2JS(config) {
	'use strict';
		
	var VERSION = "1.1.5";
	
	config = config || {};
	initConfigDefaults();
	initRequiredPolyfills();
	
	function initConfigDefaults() {
		if(config.escapeMode === undefined) {
			config.escapeMode = true;
		}
		config.attributePrefix = config.attributePrefix || "_";
		config.arrayAccessForm = config.arrayAccessForm || "none";
		config.emptyNodeForm = config.emptyNodeForm || "text";
		if(config.enableToStringFunc === undefined) {
			config.enableToStringFunc = true; 
		}
		config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
		if(config.skipEmptyTextNodesForObj === undefined) {
			config.skipEmptyTextNodesForObj = true;
		}
		if(config.stripWhitespaces === undefined) {
			config.stripWhitespaces = true;
		}
		config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
	}

	var DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		COMMENT_NODE	   : 8,
		DOCUMENT_NODE 	   : 9
	};
	
	function initRequiredPolyfills() {
		function pad(number) {
	      var r = String(number);
	      if ( r.length === 1 ) {
	        r = '0' + r;
	      }
	      return r;
	    }
		// Hello IE8-
		if(typeof String.prototype.trim !== 'function') {			
			String.prototype.trim = function() {
				return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
			}
		}
		if(typeof Date.prototype.toISOString !== 'function') {
			// Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
			Date.prototype.toISOString = function() {
		      return this.getUTCFullYear()
		        + '-' + pad( this.getUTCMonth() + 1 )
		        + '-' + pad( this.getUTCDate() )
		        + 'T' + pad( this.getUTCHours() )
		        + ':' + pad( this.getUTCMinutes() )
		        + ':' + pad( this.getUTCSeconds() )
		        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
		        + 'Z';
		    };
		}
	}
	
	function getNodeLocalName( node ) {
		var nodeLocalName = node.localName;			
		if(nodeLocalName == null) // Yeah, this is IE!! 
			nodeLocalName = node.baseName;
		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
			nodeLocalName = node.nodeName;
		return nodeLocalName;
	}
	
	function getNodePrefix(node) {
		return node.prefix;
	}
		
	function escapeXmlChars(str) {
		if(typeof(str) == "string")
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
		else
			return str;
	}

	function unescapeXmlChars(str) {
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '\/');
	}
	
	function toArrayAccessForm(obj, childName, path) {
		switch(config.arrayAccessForm) {
		case "property":
			if(!(obj[childName] instanceof Array))
				obj[childName+"_asArray"] = [obj[childName]];
			else
				obj[childName+"_asArray"] = obj[childName];
			break;		
		/*case "none":
			break;*/
		}
		
		if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
			var idx = 0;
			for(; idx < config.arrayAccessFormPaths.length; idx++) {
				var arrayPath = config.arrayAccessFormPaths[idx];
				if( typeof arrayPath === "string" ) {
					if(arrayPath == path)
						break;
				}
				else
				if( arrayPath instanceof RegExp) {
					if(arrayPath.test(path))
						break;
				}				
				else
				if( typeof arrayPath === "function") {
					if(arrayPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.arrayAccessFormPaths.length) {
				obj[childName] = [obj[childName]];
			}
		}
	}
	
	function fromXmlDateTime(prop) {
		// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
		// Improved to support full spec and optional parts
		var bits = prop.split(/[-T:+Z]/g);
		
		var d = new Date(bits[0], bits[1]-1, bits[2]);			
		var secondBits = bits[5].split("\.");
		d.setHours(bits[3], bits[4], secondBits[0]);
		if(secondBits.length>1)
			d.setMilliseconds(secondBits[1]);

		// Get supplied time zone offset in minutes
		if(bits[6] && bits[7]) {
			var offsetMinutes = bits[6] * 60 + Number(bits[7]);
			var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';

			// Apply the sign
			offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);

			// Apply offset and local timezone
			d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset())
		}
		else
			if(prop.indexOf("Z", prop.length - 1) !== -1) {
				d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
			}

		// d is now a local time equivalent to the supplied time
		return d;
	}
	
	function checkFromXmlDateTimePaths(value, childName, fullPath) {
		if(config.datetimeAccessFormPaths.length > 0) {
			var path = fullPath.split("\.#")[0];
			var idx = 0;
			for(; idx < config.datetimeAccessFormPaths.length; idx++) {
				var dtPath = config.datetimeAccessFormPaths[idx];
				if( typeof dtPath === "string" ) {
					if(dtPath == path)
						break;
				}
				else
				if( dtPath instanceof RegExp) {
					if(dtPath.test(path))
						break;
				}				
				else
				if( typeof dtPath === "function") {
					if(dtPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.datetimeAccessFormPaths.length) {
				return fromXmlDateTime(value);
			}
			else
				return value;
		}
		else
			return value;
	}

	function parseDOMChildren( node, path ) {
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			var nodeChildren = node.childNodes;
			// Alternative for firstElementChild which is not supported in some environments
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx);
				if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
					var childName = getNodeLocalName(child);
					result[childName] = parseDOMChildren(child, childName);
				}
			}
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result.__cnt=0;
			
			var nodeChildren = node.childNodes;
			
			// Children nodes
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
				var childName = getNodeLocalName(child);
				
				if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
					result.__cnt++;
					if(result[childName] == null) {
						result[childName] = parseDOMChildren(child, path+"."+childName);
						toArrayAccessForm(result, childName, path+"."+childName);					
					}
					else {
						if(result[childName] != null) {
							if( !(result[childName] instanceof Array)) {
								result[childName] = [result[childName]];
								toArrayAccessForm(result, childName, path+"."+childName);
							}
						}
						(result[childName])[result[childName].length] = parseDOMChildren(child, path+"."+childName);
					}
				}								
			}
			
			// Attributes
			for(var aidx=0; aidx <node.attributes.length; aidx++) {
				var attr = node.attributes.item(aidx); // [aidx];
				result.__cnt++;
				result[config.attributePrefix+attr.name]=attr.value;
			}
			
			// Node namespace prefix
			var nodePrefix = getNodePrefix(node);
			if(nodePrefix!=null && nodePrefix!="") {
				result.__cnt++;
				result.__prefix=nodePrefix;
			}
			
			if(result["#text"]!=null) {				
				result.__text = result["#text"];
				if(result.__text instanceof Array) {
					result.__text = result.__text.join("\n");
				}
				if(config.escapeMode)
					result.__text = unescapeXmlChars(result.__text);
				if(config.stripWhitespaces)
					result.__text = result.__text.trim();
				delete result["#text"];
				if(config.arrayAccessForm=="property")
					delete result["#text_asArray"];
				result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
			}
			if(result["#cdata-section"]!=null) {
				result.__cdata = result["#cdata-section"];
				delete result["#cdata-section"];
				if(config.arrayAccessForm=="property")
					delete result["#cdata-section_asArray"];
			}
			
			if( result.__cnt == 1 && result.__text!=null  ) {
				result = result.__text;
			}
			else
			if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
				result = '';
			}
			else
			if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
				if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
					delete result.__text;
				}
			}
			delete result.__cnt;			
			
			if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
				result.toString = function() {
					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
				};
			}
			
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
			return node.nodeValue;
		}	
	}
	
	function startTag(jsonObj, element, attrList, closed) {
		var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
		if(attrList!=null) {
			for(var aidx = 0; aidx < attrList.length; aidx++) {
				var attrName = attrList[aidx];
				var attrVal = jsonObj[attrName];
				if(config.escapeMode)
					attrVal=escapeXmlChars(attrVal);
				resultStr+=" "+attrName.substr(config.attributePrefix.length)+"='"+attrVal+"'";
			}
		}
		if(!closed)
			resultStr+=">";
		else
			resultStr+="/>";
		return resultStr;
	}
	
	function endTag(jsonObj,elementName) {
		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
		if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
				|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
				|| jsonObjField.toString().indexOf("__")==0
				|| (jsonObj[jsonObjField] instanceof Function) )
			return true;
		else
			return false;
	}
	
	function jsonXmlElemCount ( jsonObj ) {
		var elementsCnt = 0;
		if(jsonObj instanceof Object ) {
			for( var it in jsonObj  ) {
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				elementsCnt++;
			}
		}
		return elementsCnt;
	}
	
	function parseJSONAttributes ( jsonObj ) {
		var attrList = [];
		if(jsonObj instanceof Object ) {
			for( var ait in jsonObj  ) {
				if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
					attrList.push(ait);
				}
			}
		}
		return attrList;
	}
	
	function parseJSONTextAttrs ( jsonTxtObj ) {
		var result ="";
		
		if(jsonTxtObj.__cdata!=null) {										
			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
		}
		
		if(jsonTxtObj.__text!=null) {			
			if(config.escapeMode)
				result+=escapeXmlChars(jsonTxtObj.__text);
			else
				result+=jsonTxtObj.__text;
		}
		return result;
	}
	
	function parseJSONTextObject ( jsonTxtObj ) {
		var result ="";

		if( jsonTxtObj instanceof Object ) {
			result+=parseJSONTextAttrs ( jsonTxtObj );
		}
		else
			if(jsonTxtObj!=null) {
				if(config.escapeMode)
					result+=escapeXmlChars(jsonTxtObj);
				else
					result+=jsonTxtObj;
			}
		
		return result;
	}
	
	function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList ) {
		var result = ""; 
		if(jsonArrRoot.length == 0) {
			result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
		}
		else {
			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
				result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
				result+=parseJSONObject(jsonArrRoot[arIdx]);
				result+=endTag(jsonArrRoot[arIdx],jsonArrObj);						
			}
		}
		return result;
	}
	
	function parseJSONObject ( jsonObj ) {
		var result = "";	

		var elementsCnt = jsonXmlElemCount ( jsonObj );
		
		if(elementsCnt > 0) {
			for( var it in jsonObj ) {
				
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				
				var subObj = jsonObj[it];						
				
				var attrList = parseJSONAttributes( subObj )
				
				if(subObj == null || subObj == undefined) {
					result+=startTag(subObj, it, attrList, true);
				}
				else
				if(subObj instanceof Object) {
					
					if(subObj instanceof Array) {					
						result+=parseJSONArray( subObj, it, attrList );					
					}
					else if(subObj instanceof Date) {
						result+=startTag(subObj, it, attrList, false);
						result+=subObj.toISOString();
						result+=endTag(subObj,it);
					}
					else {
						var subObjElementsCnt = jsonXmlElemCount ( subObj );
						if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
							result+=startTag(subObj, it, attrList, false);
							result+=parseJSONObject(subObj);
							result+=endTag(subObj,it);
						}
						else {
							result+=startTag(subObj, it, attrList, true);
						}
					}
				}
				else {
					result+=startTag(subObj, it, attrList, false);
					result+=parseJSONTextObject(subObj);
					result+=endTag(subObj,it);
				}
			}
		}
		result+=parseJSONTextObject(jsonObj);
		
		return result;
	}
	
	this.parseXmlString = function(xmlDocStr) {

		if (xmlDocStr === undefined) {
			return null;
		}
		var xmlDoc;
        var parser=new DOMParser();			
        var parsererrorNS = null;
        
        try {
            xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
            if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                //throw new Error('Error parsing XML: '+xmlDocStr);
                xmlDoc = null;
            }
        }
        catch(err) {
            xmlDoc = null;
        }
		
		return xmlDoc;
	};
	
	this.asArray = function(prop) {
		if(prop instanceof Array)
			return prop;
		else
			return [prop];
	};
	
	this.toXmlDateTime = function(dt) {
		if(dt instanceof Date)
			return dt.toISOString();
		else
		if(typeof(dt) === 'number' )
			return new Date(dt).toISOString();
		else	
			return null;
	};
	
	this.asDateTime = function(prop) {
		if(typeof(prop) == "string") {
			return fromXmlDateTime(prop);
		}
		else
			return prop;
	};

	this.xml2json = function (xmlDoc) {
		return parseDOMChildren ( xmlDoc );
	};
	
	this.xml_str2json = function (xmlDocStr) {
		var xmlDoc = this.parseXmlString(xmlDocStr);
		if(xmlDoc!=null)
			return this.xml2json(xmlDoc);
		else
			return null;
	};

	this.json2xml_str = function (jsonObj) {
		return parseJSONObject ( jsonObj );
	};

	this.json2xml = function (jsonObj) {
		var xmlDocStr = this.json2xml_str (jsonObj);
		return this.parseXmlString(xmlDocStr);
	};
	
	this.getVersion = function () {
		return VERSION;
	};
	
}

},{"xmldom":12}],8:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (global, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    factory(global.Mustache = {}); // <script>
  }
}(this, function (mustache) {

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tags) {
      if (typeof tags === 'string')
        tags = tags.split(spaceRe, 2);

      if (!isArray(tags) || tags.length !== 2)
        throw new Error('Invalid tags: ' + tags);

      openingTagRe = new RegExp(escapeRegExp(tags[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tags[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tags[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1 && value != null)
              lookupHit = (typeof value === 'object') &&
                value.hasOwnProperty(names[index]);
            value = value[names[index++]];
          }
        } else if (context.view != null && typeof context.view === 'object') {
          value = context.view[name];
          lookupHit = context.view.hasOwnProperty(name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this._renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this._renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this._renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this._unescapedValue(token, context);
      else if (symbol === 'name') value = this._escapedValue(token, context);
      else if (symbol === 'text') value = this._rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype._renderSection = function (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender(template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype._renderInverted = function(token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype._renderPartial = function(token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype._unescapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype._escapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype._rawValue = function(token) {
    return token[1];
  };

  mustache.name = "mustache.js";
  mustache.version = "2.0.0";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}],9:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? (this || self)
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(err || new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":10,"reduce":11}],10:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],11:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],12:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){	
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid document source");
	}
	return domBuilder.document;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn){
			if(isCallback){
				fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
			}else{
				var i=arguments.length;
				while(--i){
					if(fn = errorImpl[arguments[i]]){
						break;
					}
				}
			}
		}
		errorHandler[key] = fn && function(msg){
			fn(msg+_locator(locator));
		}||function(){};
	}
	build('warning','warn');
	build('error','warn','warning');
	build('fatalError','warn','warning','error');
	return errorHandler;
}
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.document = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.document.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.document;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			if( attr.getOffset){
				position(attr.getOffset(1),attr)
			}
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
	    var tagName = current.tagName;
	    this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.document.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(this.currentElement && chars){
			if (this.cdata) {
				var charNode = this.document.createCDATASection(chars);
				this.currentElement.appendChild(charNode);
			} else {
				var charNode = this.document.createTextNode(chars);
				this.currentElement.appendChild(charNode);
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.document.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.document.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.document.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn(error,_locator(this.locator));
	},
	error:function(error) {
		console.error(error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error(error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.document.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
}

},{"./dom":13,"./sax":14}],13:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error())
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		var i = this.length;
		while(i--){
			var attr = this[i];
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		doc.implementation = this;
		doc.childNodes = new NodeList();
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == 2?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == 2?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == 1){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == 1){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && node.namespaceURI === namespaceURI && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		//if(!(newChild instanceof CharacterData)){
			throw new Error(ExceptionMessage[3])
		//}
		return Node.prototype.appendChild.apply(this,arguments)
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node){
	var buf = [];
	serializeToString(node,buf);
	return buf.join('');
}
Node.prototype.toString =function(){
	return XMLSerializer.prototype.serializeToString(this);
}
function serializeToString(node,buf){
	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		var isHTML = htmlns === node.namespaceURI
		buf.push('<',nodeName);
		for(var i=0;i<len;i++){
			serializeToString(attrs.item(i),buf,isHTML);
		}
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				if(child){
					buf.push(child.data);
				}
			}else{
				while(child){
					serializeToString(child,buf);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case 1:
				case 11:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = value;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case 1:
			case 11:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
}

},{}],14:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\u00B7\u0300-\u036F\\ux203F-\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_V
//S_ATTR_S,	S_E,	S_S,	S_C
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_S=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_V = 4;//attr value(no quot value only)
var S_E = 5;//attr value end and no space(quot end)
var S_S = 6;//(attr value end || tag end ) && (space offer)
var S_C = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
  function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
		locator&&position(start);
		domBuilder.characters(xt,0,end-start);
		start = end
	}
	function position(start,m){
		while(start>=endPos && (m = linePattern.exec(source))){
			startPos = m.index;
			endPos = startPos + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = start-startPos+1;
	}
	var startPos = 0;
	var endPos = 0;
	var linePattern = /.+(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		var i = source.indexOf('<',start);
		if(i<0){
			if(!source.substr(start).match(/^\s*$/)){
				var doc = domBuilder.document;
    			var text = doc.createTextNode(source.substr(start));
    			doc.appendChild(text);
    			domBuilder.currentElement = text;
			}
			return;
		}
		if(i>start){
			appendText(i);
		}
		switch(source.charAt(i+1)){
		case '/':
			var end = source.indexOf('>',i+3);
			var tagName = source.substring(i+2,end);
			var config = parseStack.pop();
			var localNSMap = config.localNSMap;
			
	        if(config.tagName != tagName){
	            errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
	        }
			domBuilder.endElement(config.uri,config.localName,tagName);
			if(localNSMap){
				for(var prefix in localNSMap){
					domBuilder.endPrefixMapping(prefix) ;
				}
			}
			end++;
			break;
			// end elment
		case '?':// <?...?>
			locator&&position(i);
			end = parseInstruction(source,i,domBuilder);
			break;
		case '!':// <!doctype,<![CDATA,<!--
			locator&&position(i);
			end = parseDCC(source,i,domBuilder,errorHandler);
			break;
		default:
			try{
				locator&&position(i);
				
				var el = new ElementAttributes();
				
				//elStartEnd
				var end = parseElementStartPart(source,i,el,entityReplacer,errorHandler);
				var len = el.length;
				//position fixed
				if(len && locator){
					var backup = copyLocator(locator,{});
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.offset = copyLocator(locator,{});
					}
					copyLocator(backup,locator);
				}
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				appendElement(el,domBuilder,parseStack);
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}catch(e){
				errorHandler.error('element parse error: '+e);
				end = -1;
			}

		}
		if(end<0){
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(i+1);
		}else{
			start = end;
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
	
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_S){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ){//equal
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_E;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_V){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_E
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_E:
			case S_S:
			case S_C:
				s = S_C;
				el.closed = true;
			case S_V:
			case S_ATTR:
			case S_ATTR_S:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_E:
			case S_S:
			case S_C:
				break;//normal
			case S_V://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_S:
				if(s === S_ATTR_S){
					value = attrName;
				}
				if(s == S_V){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_S;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_S;
					break;
				case S_V:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_E:
					s = S_S;
					break;
				//case S_S:
				//case S_EQ:
				//case S_ATTR_S:
				//	void();break;
				//case S_C:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_V
//S_ATTR_S,	S_E,	S_S,	S_C
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_V:void();break;
				case S_ATTR_S:
					errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead!!')
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_E:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_S:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_V;
					start = p;
					break;
				case S_C:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}
		p++;
	}
}
/**
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function appendElement(el,domBuilder,parseStack){
	var tagName = el.tagName;
	var localNSMap = null;
	var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix]
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		parseStack.push(el);
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos = closeMap[tagName] = source.lastIndexOf('</'+tagName+'>')
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getOffset:function(i){return this[i].offset},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

if(typeof require == 'function'){
	exports.XMLReader = XMLReader;
}


},{}],15:[function(require,module,exports){
module.exports = "<style>\n    *:focus {\n        outline: 0;\n    }\n\n    #player{\n        position:relative;\n        visibility:hidden;\n    }\n\n    video{\n        background-color: #000;\n    }\n\n    video::-webkit-media-controls-panel{\n        -webkit-appearance:none;\n        background-color:transparent;\n        justify-content: flex-end;\n    }\n\n    video::-webkit-full-page-media::-webkit-media-controls-panel{\n            -webkit-appearance:none;\n            display:none;\n    }\n\n\n    video::-webkit-media-controls-timeline,\n    /*video::-webkit-media-controls-play-button,*/\n    video::-webkit-media-controls-volume-slider-container,\n    video::-webkit-media-controls-volume-slider,\n    video::-webkit-media-controls-time-remaining-display,\n    video::-webkit-media-controls-timeline-container,\n    video::-webkit-media-controls-current-time-display {\n        -webkit-appearance:none;\n        visibility:hidden;\n    }\n\n\n    #timerContainer{\n        position:absolute;\n        left:5px;\n        bottom:5px;\n    }\n\n    #timer{\n        display:none;\n    }\n\n    #timerContainer canvas{\n        background-color: #33648b;\n        border-radius: 18px;\n        border: 2px solid #33648b; \n    }\n\n    #timerContainer input{\n        font-size: 9px !important;\n        height: 12px !important;\n        width: 13px !important;\n    }\n\n\n    video::-webkit-media-controls-fullscreen-button{\n        -webkit-appearance:none;\n        height:24px;\n        width:24px;\n        background-size: 75% auto;\n/*        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACQElEQVRYR+2X3XHaQBDHd/XxTge2K4iMCohdQXAFgYAL8AOaSQWZEQ8uwBArFZhUYFIAoFRgpwO9S7r1XMx54HTHrSAvmTGPaG/3d3u7t//DeJSuATAC149ovpwlVy4z+T0epg+A2HPbUo7xaEJuQwAC+rWaJhcc2+4oXSDgR44tC4AIfos6uMizm4LjNOrfdjy/WiDCB5e9E6BtcBWQC7EXgAgKUQdn3J3ru91APCFCx5YJRgYoW82SgSuVpu/dYXqPiP19a50AcjFRewhOcOm7AUAEfxDhRKduA2ELbvK9A6AKzvPKHnp4fwiENbiggRDhXO+ONwC92rtf0r4JokY6z++S3HSu0XUa+YTrBrigwep7ksn/9e6QAHMC6ogq7OnV3oAg+LGcjfcWVTycZIDwWUHQVvCdFg3KOQIW6KruNwhGcOVLQZiC6/GcAH/Tdp1GtrTbNsBdwwJwZemY7+8A7xn4PzIQ9b+d5tnX5zbV/s/aUN3thwwjzhrcCMhOXQVXjatYm+cch/owMq2R88APqgcgKramIeV1FV4qCNtUq6vqzHYc8qj8IHjaN0Vfg5ePSolreuAVwvPLW5OS4dzttikqMyHq8GY7uE2QFCYNxwmudm6HgIZvniQzjFRXR9ggGtPQ9TBps3PdOQfCIcvpWdTh+XGyvFwj4unBshxgtztcqd9WPXrBmdayaqAthN5qR78LNg4Wy+n4kpOBeDR5BADWQxa7w0nOeUQCwM/ldMx4cgNIoQsAn1ywUom/AC4bjAMzNOWEAAAAAElFTkSuQmCC');*/\n        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABj0lEQVRIS+1W21HDQAzcrYB0QKggoQJCB1BBSAUklQAVECoAKiCpgLgCKAEqWGZn7jL2+c7Ha4Yf9JXYGq20klampB2ACbrmZ28A7kiuk3edv5IuAMwBjABME98NJWkgwA3JZQXgGsBlyWcIwNk7u6pJcpWuomdDAIsaPTFaoOn2qwD2PyW5qVBk3p+HKMo1Ofq70QaxT88kjUNwNzhnjSlyhieeGAD+nZb6CuCYpMHSCcoltwAwCz3ZGsCNnMZpkeSSDXQQor0DGKcAkpy1wdt+s1itJE/XjgOlPzgwgGWp2SE5B3J1ZzkqswDVuWw5hEqQo9BuPwaoJfMPUGOo3INa81oyMSo1uNjksAv3QYJXlTG9CvtwTtJ70bG4aBOSK7+R5C2Mwf3IM35UWLSXkET028vKftFaUmHJ3WakoiGZHhIn4k22VBwmSfekYkjsLBOWkV7podpUVlKGdrWLZpHLKmmryab0qTROf3pw1iTNZ9W+ezId+FeOfjw47UybMJ6u4jOfLb4pnqr08+fxA1Ip2i/cEiTXAAAAAElFTkSuQmCC'); \n        background-color: #33648b;\n        background-position: center center;\n        background-repeat: no-repeat;\n        border-radius:5px;\n        border:1px solid #fff;\n        position:relative;\n        top:5px;\n        right:5px\n    }\n\n   #close{\n        background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABv0lEQVRIS82WQVbCQBBEq8IB1JMIeADxBh4BBdey0GzVbVgIa0XwBt6AcAAw3kQOQMo30eAkmRB46nuygnRTv7tnpiZExafe7bc84JhAy04VEIoKXx/82SYJlgWb50Eb5D2J/U0CEt4J9uajq2dXXgFQvwjqNWEMsF7VXTauaEWcRQ9+ZD/PAIy4F3NaVXUZ2HQTezqxIWvAT8VTaB6yBjQ7/YjE4W5jKe0lmj/6DRNNAGZB6XFcTNdSwoTkpUtK0pBEG+BePq5YZ4snf5IAjrrBezFJyxXRMvN0FZAKfG2KMP9/M6rF6PqAZp/XgGmhAmm4GPm99LkNScXXsU4wcHW5ohpsdvu3BG6cI/hq04aY76Z1F7hQJHDHZjcICR6XLlcOYueVr91nlqBZJSBJdECqxP8PwFX9NvO3OvjjRf7zbVp20GxPqTpoboPUcv7o72+0CgMBYY77+sDZ21TAAELb5b4Zq0j86BfNTsLbYnSd3CcZu64JBU/Z3V2/PSwDMD/KjGt7SFa8AEghXszJrneDGUvsqb3xyiz6DAYur892pKVi9GwDtOOlbxVpUnKViqeAMq8tAMOYeslXnB/nB+ULOYiAruOGAAAAAElFTkSuQmCC\");\n        background-size: 100% auto;\n        height:18px;\n        width:18px;\n        border-radius:9px;\n        border:1px solid #fff;\n        position:absolute;\n        right:5px;\n        top:5px;\n        background-color: #fff;\n        z-index:100;\n   } \n\n</style>\n<div id=\"player\" data-href=\"{{{clickURL}}}\">\n\n    {{#skip}}\n    <div id=\"close\"></div>\n    {{/skip}}\n\n    <{{tag}} src=\"{{{src}}}\" \n        {{#autoplay}}autoplay{{/autoplay}}\n        preload\n        controls\n        webkit-playsinline \n        width = \"{{width}}\" \n        height = \"{{height}}\"\n        {{#poster}}poster=\"{{{url}}}\"{{/poster}}\n        >\n    </{{tag}}>\n    <span id=\"timerContainer\">\n        <input type=\"text\" id=\"timer\">\n    </span>\n</div>\n\n<!-- START impression pixels -->\n{{#impressions}}\n<script src=\"{{{.}}}\"></script>\n{{/impressions}}\n<!-- END impression pixels -->\n\n<!-- START creative view Tracking URLs -->\n{{#tracking.creativeView}}\n<script src=\"{{{.}}}\"></script>\n{{/tracking.creativeView}}\n<!-- END creative view Tracking URLs -->\n\n";

},{}],16:[function(require,module,exports){
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAHgCAYAAADUjLREAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALFwAACxcB/2cbCgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N13fBz1nf/x18xsL9pdrbpW1aq23ORewDZgmw6hhABphPQjPZd26bm7XC6/5FIuJLk0CAkEEhIg9GJMs8G4d0u2JVm9S6vtbX5/rFhZTqPbyn6ej4ce0qxnd7+7lt4785nvfEYBdIQQIgupp3sAQghxukgACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSg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iKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJp/X8udkESzyX4DQAAAABJRU5ErkJggg==\n";

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL2pxdWVyeS5qcyIsImpzL2pxdWVyeS5rbm9iLmpzIiwibGliL3BhcnNlci5qcyIsImxpYi9wbGF5ZXIuanMiLCJsaWIvdmFzdC5qcyIsImxpYi94MmpzLmpzIiwibm9kZV9tb2R1bGVzL211c3RhY2hlL211c3RhY2hlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9jb21wb25lbnQtZW1pdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3htbGRvbS9kb20tcGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3htbGRvbS9kb20uanMiLCJub2RlX21vZHVsZXMveG1sZG9tL3NheC5qcyIsInRlbXBsYXRlcy9wbGF5ZXIuaHRtbCIsInRlbXBsYXRlcy9wb3N0ZXIudHh0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0aUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25tQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hrQkE7QUFDQTs7QUNEQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qISBqUXVlcnkgdjIuMS40IHwgKGMpIDIwMDUsIDIwMTUgalF1ZXJ5IEZvdW5kYXRpb24sIEluYy4gfCBqcXVlcnkub3JnL2xpY2Vuc2UgKi9cbiFmdW5jdGlvbihhLGIpe1wib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hLmRvY3VtZW50P2IoYSwhMCk6ZnVuY3Rpb24oYSl7aWYoIWEuZG9jdW1lbnQpdGhyb3cgbmV3IEVycm9yKFwialF1ZXJ5IHJlcXVpcmVzIGEgd2luZG93IHdpdGggYSBkb2N1bWVudFwiKTtyZXR1cm4gYihhKX06YihhKX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6dGhpcyxmdW5jdGlvbihhLGIpe3ZhciBjPVtdLGQ9Yy5zbGljZSxlPWMuY29uY2F0LGY9Yy5wdXNoLGc9Yy5pbmRleE9mLGg9e30saT1oLnRvU3RyaW5nLGo9aC5oYXNPd25Qcm9wZXJ0eSxrPXt9LGw9YS5kb2N1bWVudCxtPVwiMi4xLjRcIixuPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBuLmZuLmluaXQoYSxiKX0sbz0vXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2cscD0vXi1tcy0vLHE9Ly0oW1xcZGEtel0pL2dpLHI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi50b1VwcGVyQ2FzZSgpfTtuLmZuPW4ucHJvdG90eXBlPXtqcXVlcnk6bSxjb25zdHJ1Y3RvcjpuLHNlbGVjdG9yOlwiXCIsbGVuZ3RoOjAsdG9BcnJheTpmdW5jdGlvbigpe3JldHVybiBkLmNhbGwodGhpcyl9LGdldDpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YT8wPmE/dGhpc1thK3RoaXMubGVuZ3RoXTp0aGlzW2FdOmQuY2FsbCh0aGlzKX0scHVzaFN0YWNrOmZ1bmN0aW9uKGEpe3ZhciBiPW4ubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLGEpO3JldHVybiBiLnByZXZPYmplY3Q9dGhpcyxiLmNvbnRleHQ9dGhpcy5jb250ZXh0LGJ9LGVhY2g6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbi5lYWNoKHRoaXMsYSxiKX0sbWFwOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayhuLm1hcCh0aGlzLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuY2FsbChiLGMsYil9KSl9LHNsaWNlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGQuYXBwbHkodGhpcyxhcmd1bWVudHMpKX0sZmlyc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgwKX0sbGFzdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVxKC0xKX0sZXE6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5sZW5ndGgsYz0rYSsoMD5hP2I6MCk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGM+PTAmJmI+Yz9bdGhpc1tjXV06W10pfSxlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcmV2T2JqZWN0fHx0aGlzLmNvbnN0cnVjdG9yKG51bGwpfSxwdXNoOmYsc29ydDpjLnNvcnQsc3BsaWNlOmMuc3BsaWNlfSxuLmV4dGVuZD1uLmZuLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZixnPWFyZ3VtZW50c1swXXx8e30saD0xLGk9YXJndW1lbnRzLmxlbmd0aCxqPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIGcmJihqPWcsZz1hcmd1bWVudHNbaF18fHt9LGgrKyksXCJvYmplY3RcIj09dHlwZW9mIGd8fG4uaXNGdW5jdGlvbihnKXx8KGc9e30pLGg9PT1pJiYoZz10aGlzLGgtLSk7aT5oO2grKylpZihudWxsIT0oYT1hcmd1bWVudHNbaF0pKWZvcihiIGluIGEpYz1nW2JdLGQ9YVtiXSxnIT09ZCYmKGomJmQmJihuLmlzUGxhaW5PYmplY3QoZCl8fChlPW4uaXNBcnJheShkKSkpPyhlPyhlPSExLGY9YyYmbi5pc0FycmF5KGMpP2M6W10pOmY9YyYmbi5pc1BsYWluT2JqZWN0KGMpP2M6e30sZ1tiXT1uLmV4dGVuZChqLGYsZCkpOnZvaWQgMCE9PWQmJihnW2JdPWQpKTtyZXR1cm4gZ30sbi5leHRlbmQoe2V4cGFuZG86XCJqUXVlcnlcIisobStNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxpc1JlYWR5OiEwLGVycm9yOmZ1bmN0aW9uKGEpe3Rocm93IG5ldyBFcnJvcihhKX0sbm9vcDpmdW5jdGlvbigpe30saXNGdW5jdGlvbjpmdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1uLnR5cGUoYSl9LGlzQXJyYXk6QXJyYXkuaXNBcnJheSxpc1dpbmRvdzpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YSYmYT09PWEud2luZG93fSxpc051bWVyaWM6ZnVuY3Rpb24oYSl7cmV0dXJuIW4uaXNBcnJheShhKSYmYS1wYXJzZUZsb2F0KGEpKzE+PTB9LGlzUGxhaW5PYmplY3Q6ZnVuY3Rpb24oYSl7cmV0dXJuXCJvYmplY3RcIiE9PW4udHlwZShhKXx8YS5ub2RlVHlwZXx8bi5pc1dpbmRvdyhhKT8hMTphLmNvbnN0cnVjdG9yJiYhai5jYWxsKGEuY29uc3RydWN0b3IucHJvdG90eXBlLFwiaXNQcm90b3R5cGVPZlwiKT8hMTohMH0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihhKXt2YXIgYjtmb3IoYiBpbiBhKXJldHVybiExO3JldHVybiEwfSx0eXBlOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hP2ErXCJcIjpcIm9iamVjdFwiPT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYT9oW2kuY2FsbChhKV18fFwib2JqZWN0XCI6dHlwZW9mIGF9LGdsb2JhbEV2YWw6ZnVuY3Rpb24oYSl7dmFyIGIsYz1ldmFsO2E9bi50cmltKGEpLGEmJigxPT09YS5pbmRleE9mKFwidXNlIHN0cmljdFwiKT8oYj1sLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksYi50ZXh0PWEsbC5oZWFkLmFwcGVuZENoaWxkKGIpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYikpOmMoYSkpfSxjYW1lbENhc2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZShwLFwibXMtXCIpLnJlcGxhY2UocSxyKX0sbm9kZU5hbWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5ub2RlTmFtZSYmYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09Yi50b0xvd2VyQ2FzZSgpfSxlYWNoOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlPTAsZj1hLmxlbmd0aCxnPXMoYSk7aWYoYyl7aWYoZyl7Zm9yKDtmPmU7ZSsrKWlmKGQ9Yi5hcHBseShhW2VdLGMpLGQ9PT0hMSlicmVha31lbHNlIGZvcihlIGluIGEpaWYoZD1iLmFwcGx5KGFbZV0sYyksZD09PSExKWJyZWFrfWVsc2UgaWYoZyl7Zm9yKDtmPmU7ZSsrKWlmKGQ9Yi5jYWxsKGFbZV0sZSxhW2VdKSxkPT09ITEpYnJlYWt9ZWxzZSBmb3IoZSBpbiBhKWlmKGQ9Yi5jYWxsKGFbZV0sZSxhW2VdKSxkPT09ITEpYnJlYWs7cmV0dXJuIGF9LHRyaW06ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PWE/XCJcIjooYStcIlwiKS5yZXBsYWNlKG8sXCJcIil9LG1ha2VBcnJheTpmdW5jdGlvbihhLGIpe3ZhciBjPWJ8fFtdO3JldHVybiBudWxsIT1hJiYocyhPYmplY3QoYSkpP24ubWVyZ2UoYyxcInN0cmluZ1wiPT10eXBlb2YgYT9bYV06YSk6Zi5jYWxsKGMsYSkpLGN9LGluQXJyYXk6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBudWxsPT1iPy0xOmcuY2FsbChiLGEsYyl9LG1lcmdlOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPStiLmxlbmd0aCxkPTAsZT1hLmxlbmd0aDtjPmQ7ZCsrKWFbZSsrXT1iW2RdO3JldHVybiBhLmxlbmd0aD1lLGF9LGdyZXA6ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZCxlPVtdLGY9MCxnPWEubGVuZ3RoLGg9IWM7Zz5mO2YrKylkPSFiKGFbZl0sZiksZCE9PWgmJmUucHVzaChhW2ZdKTtyZXR1cm4gZX0sbWFwOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxmPTAsZz1hLmxlbmd0aCxoPXMoYSksaT1bXTtpZihoKWZvcig7Zz5mO2YrKylkPWIoYVtmXSxmLGMpLG51bGwhPWQmJmkucHVzaChkKTtlbHNlIGZvcihmIGluIGEpZD1iKGFbZl0sZixjKSxudWxsIT1kJiZpLnB1c2goZCk7cmV0dXJuIGUuYXBwbHkoW10saSl9LGd1aWQ6MSxwcm94eTpmdW5jdGlvbihhLGIpe3ZhciBjLGUsZjtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYiYmKGM9YVtiXSxiPWEsYT1jKSxuLmlzRnVuY3Rpb24oYSk/KGU9ZC5jYWxsKGFyZ3VtZW50cywyKSxmPWZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYnx8dGhpcyxlLmNvbmNhdChkLmNhbGwoYXJndW1lbnRzKSkpfSxmLmd1aWQ9YS5ndWlkPWEuZ3VpZHx8bi5ndWlkKyssZik6dm9pZCAwfSxub3c6RGF0ZS5ub3csc3VwcG9ydDprfSksbi5lYWNoKFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihhLGIpe2hbXCJbb2JqZWN0IFwiK2IrXCJdXCJdPWIudG9Mb3dlckNhc2UoKX0pO2Z1bmN0aW9uIHMoYSl7dmFyIGI9XCJsZW5ndGhcImluIGEmJmEubGVuZ3RoLGM9bi50eXBlKGEpO3JldHVyblwiZnVuY3Rpb25cIj09PWN8fG4uaXNXaW5kb3coYSk/ITE6MT09PWEubm9kZVR5cGUmJmI/ITA6XCJhcnJheVwiPT09Y3x8MD09PWJ8fFwibnVtYmVyXCI9PXR5cGVvZiBiJiZiPjAmJmItMSBpbiBhfXZhciB0PWZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoLGksaixrLGwsbSxuLG8scCxxLHIscyx0LHU9XCJzaXp6bGVcIisxKm5ldyBEYXRlLHY9YS5kb2N1bWVudCx3PTAseD0wLHk9aGEoKSx6PWhhKCksQT1oYSgpLEI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT09PWImJihsPSEwKSwwfSxDPTE8PDMxLEQ9e30uaGFzT3duUHJvcGVydHksRT1bXSxGPUUucG9wLEc9RS5wdXNoLEg9RS5wdXNoLEk9RS5zbGljZSxKPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTAsZD1hLmxlbmd0aDtkPmM7YysrKWlmKGFbY109PT1iKXJldHVybiBjO3JldHVybi0xfSxLPVwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufGlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixMPVwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixNPVwiKD86XFxcXFxcXFwufFtcXFxcdy1dfFteXFxcXHgwMC1cXFxceGEwXSkrXCIsTj1NLnJlcGxhY2UoXCJ3XCIsXCJ3I1wiKSxPPVwiXFxcXFtcIitMK1wiKihcIitNK1wiKSg/OlwiK0wrXCIqKFsqXiR8IX5dPz0pXCIrTCtcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiK04rXCIpKXwpXCIrTCtcIipcXFxcXVwiLFA9XCI6KFwiK00rXCIpKD86XFxcXCgoKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8KCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiK08rXCIpKil8LiopXFxcXCl8KVwiLFE9bmV3IFJlZ0V4cChMK1wiK1wiLFwiZ1wiKSxSPW5ldyBSZWdFeHAoXCJeXCIrTCtcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIrTCtcIiskXCIsXCJnXCIpLFM9bmV3IFJlZ0V4cChcIl5cIitMK1wiKixcIitMK1wiKlwiKSxUPW5ldyBSZWdFeHAoXCJeXCIrTCtcIiooWz4rfl18XCIrTCtcIilcIitMK1wiKlwiKSxVPW5ldyBSZWdFeHAoXCI9XCIrTCtcIiooW15cXFxcXSdcXFwiXSo/KVwiK0wrXCIqXFxcXF1cIixcImdcIiksVj1uZXcgUmVnRXhwKFApLFc9bmV3IFJlZ0V4cChcIl5cIitOK1wiJFwiKSxYPXtJRDpuZXcgUmVnRXhwKFwiXiMoXCIrTStcIilcIiksQ0xBU1M6bmV3IFJlZ0V4cChcIl5cXFxcLihcIitNK1wiKVwiKSxUQUc6bmV3IFJlZ0V4cChcIl4oXCIrTS5yZXBsYWNlKFwid1wiLFwidypcIikrXCIpXCIpLEFUVFI6bmV3IFJlZ0V4cChcIl5cIitPKSxQU0VVRE86bmV3IFJlZ0V4cChcIl5cIitQKSxDSElMRDpuZXcgUmVnRXhwKFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIitMK1wiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIrTCtcIiooPzooWystXXwpXCIrTCtcIiooXFxcXGQrKXwpKVwiK0wrXCIqXFxcXCl8KVwiLFwiaVwiKSxib29sOm5ldyBSZWdFeHAoXCJeKD86XCIrSytcIikkXCIsXCJpXCIpLG5lZWRzQ29udGV4dDpuZXcgUmVnRXhwKFwiXlwiK0wrXCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiK0wrXCIqKCg/Oi1cXFxcZCk/XFxcXGQqKVwiK0wrXCIqXFxcXCl8KSg/PVteLV18JClcIixcImlcIil9LFk9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxaPS9eaFxcZCQvaSwkPS9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXz0vXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxhYT0vWyt+XS8sYmE9Lyd8XFxcXC9nLGNhPW5ldyBSZWdFeHAoXCJcXFxcXFxcXChbXFxcXGRhLWZdezEsNn1cIitMK1wiP3woXCIrTCtcIil8LilcIixcImlnXCIpLGRhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1cIjB4XCIrYi02NTUzNjtyZXR1cm4gZCE9PWR8fGM/YjowPmQ/U3RyaW5nLmZyb21DaGFyQ29kZShkKzY1NTM2KTpTdHJpbmcuZnJvbUNoYXJDb2RlKGQ+PjEwfDU1Mjk2LDEwMjMmZHw1NjMyMCl9LGVhPWZ1bmN0aW9uKCl7bSgpfTt0cnl7SC5hcHBseShFPUkuY2FsbCh2LmNoaWxkTm9kZXMpLHYuY2hpbGROb2RlcyksRVt2LmNoaWxkTm9kZXMubGVuZ3RoXS5ub2RlVHlwZX1jYXRjaChmYSl7SD17YXBwbHk6RS5sZW5ndGg/ZnVuY3Rpb24oYSxiKXtHLmFwcGx5KGEsSS5jYWxsKGIpKX06ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLmxlbmd0aCxkPTA7d2hpbGUoYVtjKytdPWJbZCsrXSk7YS5sZW5ndGg9Yy0xfX19ZnVuY3Rpb24gZ2EoYSxiLGQsZSl7dmFyIGYsaCxqLGssbCxvLHIscyx3LHg7aWYoKGI/Yi5vd25lckRvY3VtZW50fHxiOnYpIT09biYmbShiKSxiPWJ8fG4sZD1kfHxbXSxrPWIubm9kZVR5cGUsXCJzdHJpbmdcIiE9dHlwZW9mIGF8fCFhfHwxIT09ayYmOSE9PWsmJjExIT09aylyZXR1cm4gZDtpZighZSYmcCl7aWYoMTEhPT1rJiYoZj1fLmV4ZWMoYSkpKWlmKGo9ZlsxXSl7aWYoOT09PWspe2lmKGg9Yi5nZXRFbGVtZW50QnlJZChqKSwhaHx8IWgucGFyZW50Tm9kZSlyZXR1cm4gZDtpZihoLmlkPT09ailyZXR1cm4gZC5wdXNoKGgpLGR9ZWxzZSBpZihiLm93bmVyRG9jdW1lbnQmJihoPWIub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChqKSkmJnQoYixoKSYmaC5pZD09PWopcmV0dXJuIGQucHVzaChoKSxkfWVsc2V7aWYoZlsyXSlyZXR1cm4gSC5hcHBseShkLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSkpLGQ7aWYoKGo9ZlszXSkmJmMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSlyZXR1cm4gSC5hcHBseShkLGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShqKSksZH1pZihjLnFzYSYmKCFxfHwhcS50ZXN0KGEpKSl7aWYocz1yPXUsdz1iLHg9MSE9PWsmJmEsMT09PWsmJlwib2JqZWN0XCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpe289ZyhhKSwocj1iLmdldEF0dHJpYnV0ZShcImlkXCIpKT9zPXIucmVwbGFjZShiYSxcIlxcXFwkJlwiKTpiLnNldEF0dHJpYnV0ZShcImlkXCIscykscz1cIltpZD0nXCIrcytcIiddIFwiLGw9by5sZW5ndGg7d2hpbGUobC0tKW9bbF09cytyYShvW2xdKTt3PWFhLnRlc3QoYSkmJnBhKGIucGFyZW50Tm9kZSl8fGIseD1vLmpvaW4oXCIsXCIpfWlmKHgpdHJ5e3JldHVybiBILmFwcGx5KGQsdy5xdWVyeVNlbGVjdG9yQWxsKHgpKSxkfWNhdGNoKHkpe31maW5hbGx5e3J8fGIucmVtb3ZlQXR0cmlidXRlKFwiaWRcIil9fX1yZXR1cm4gaShhLnJlcGxhY2UoUixcIiQxXCIpLGIsZCxlKX1mdW5jdGlvbiBoYSgpe3ZhciBhPVtdO2Z1bmN0aW9uIGIoYyxlKXtyZXR1cm4gYS5wdXNoKGMrXCIgXCIpPmQuY2FjaGVMZW5ndGgmJmRlbGV0ZSBiW2Euc2hpZnQoKV0sYltjK1wiIFwiXT1lfXJldHVybiBifWZ1bmN0aW9uIGlhKGEpe3JldHVybiBhW3VdPSEwLGF9ZnVuY3Rpb24gamEoYSl7dmFyIGI9bi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXtyZXR1cm4hIWEoYil9Y2F0Y2goYyl7cmV0dXJuITF9ZmluYWxseXtiLnBhcmVudE5vZGUmJmIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKSxiPW51bGx9fWZ1bmN0aW9uIGthKGEsYil7dmFyIGM9YS5zcGxpdChcInxcIiksZT1hLmxlbmd0aDt3aGlsZShlLS0pZC5hdHRySGFuZGxlW2NbZV1dPWJ9ZnVuY3Rpb24gbGEoYSxiKXt2YXIgYz1iJiZhLGQ9YyYmMT09PWEubm9kZVR5cGUmJjE9PT1iLm5vZGVUeXBlJiYofmIuc291cmNlSW5kZXh8fEMpLSh+YS5zb3VyY2VJbmRleHx8Qyk7aWYoZClyZXR1cm4gZDtpZihjKXdoaWxlKGM9Yy5uZXh0U2libGluZylpZihjPT09YilyZXR1cm4tMTtyZXR1cm4gYT8xOi0xfWZ1bmN0aW9uIG1hKGEpe3JldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJpbnB1dFwiPT09YyYmYi50eXBlPT09YX19ZnVuY3Rpb24gbmEoYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3ZhciBjPWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm4oXCJpbnB1dFwiPT09Y3x8XCJidXR0b25cIj09PWMpJiZiLnR5cGU9PT1hfX1mdW5jdGlvbiBvYShhKXtyZXR1cm4gaWEoZnVuY3Rpb24oYil7cmV0dXJuIGI9K2IsaWEoZnVuY3Rpb24oYyxkKXt2YXIgZSxmPWEoW10sYy5sZW5ndGgsYiksZz1mLmxlbmd0aDt3aGlsZShnLS0pY1tlPWZbZ11dJiYoY1tlXT0hKGRbZV09Y1tlXSkpfSl9KX1mdW5jdGlvbiBwYShhKXtyZXR1cm4gYSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUmJmF9Yz1nYS5zdXBwb3J0PXt9LGY9Z2EuaXNYTUw9ZnVuY3Rpb24oYSl7dmFyIGI9YSYmKGEub3duZXJEb2N1bWVudHx8YSkuZG9jdW1lbnRFbGVtZW50O3JldHVybiBiP1wiSFRNTFwiIT09Yi5ub2RlTmFtZTohMX0sbT1nYS5zZXREb2N1bWVudD1mdW5jdGlvbihhKXt2YXIgYixlLGc9YT9hLm93bmVyRG9jdW1lbnR8fGE6djtyZXR1cm4gZyE9PW4mJjk9PT1nLm5vZGVUeXBlJiZnLmRvY3VtZW50RWxlbWVudD8obj1nLG89Zy5kb2N1bWVudEVsZW1lbnQsZT1nLmRlZmF1bHRWaWV3LGUmJmUhPT1lLnRvcCYmKGUuYWRkRXZlbnRMaXN0ZW5lcj9lLmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIixlYSwhMSk6ZS5hdHRhY2hFdmVudCYmZS5hdHRhY2hFdmVudChcIm9udW5sb2FkXCIsZWEpKSxwPSFmKGcpLGMuYXR0cmlidXRlcz1qYShmdW5jdGlvbihhKXtyZXR1cm4gYS5jbGFzc05hbWU9XCJpXCIsIWEuZ2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIpfSksYy5nZXRFbGVtZW50c0J5VGFnTmFtZT1qYShmdW5jdGlvbihhKXtyZXR1cm4gYS5hcHBlbmRDaGlsZChnLmNyZWF0ZUNvbW1lbnQoXCJcIikpLCFhLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKS5sZW5ndGh9KSxjLmdldEVsZW1lbnRzQnlDbGFzc05hbWU9JC50ZXN0KGcuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSksYy5nZXRCeUlkPWphKGZ1bmN0aW9uKGEpe3JldHVybiBvLmFwcGVuZENoaWxkKGEpLmlkPXUsIWcuZ2V0RWxlbWVudHNCeU5hbWV8fCFnLmdldEVsZW1lbnRzQnlOYW1lKHUpLmxlbmd0aH0pLGMuZ2V0QnlJZD8oZC5maW5kLklEPWZ1bmN0aW9uKGEsYil7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGIuZ2V0RWxlbWVudEJ5SWQmJnApe3ZhciBjPWIuZ2V0RWxlbWVudEJ5SWQoYSk7cmV0dXJuIGMmJmMucGFyZW50Tm9kZT9bY106W119fSxkLmZpbHRlci5JRD1mdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UoY2EsZGEpO3JldHVybiBmdW5jdGlvbihhKXtyZXR1cm4gYS5nZXRBdHRyaWJ1dGUoXCJpZFwiKT09PWJ9fSk6KGRlbGV0ZSBkLmZpbmQuSUQsZC5maWx0ZXIuSUQ9ZnVuY3Rpb24oYSl7dmFyIGI9YS5yZXBsYWNlKGNhLGRhKTtyZXR1cm4gZnVuY3Rpb24oYSl7dmFyIGM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0QXR0cmlidXRlTm9kZSYmYS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7cmV0dXJuIGMmJmMudmFsdWU9PT1ifX0pLGQuZmluZC5UQUc9Yy5nZXRFbGVtZW50c0J5VGFnTmFtZT9mdW5jdGlvbihhLGIpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmdldEVsZW1lbnRzQnlUYWdOYW1lP2IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk6Yy5xc2E/Yi5xdWVyeVNlbGVjdG9yQWxsKGEpOnZvaWQgMH06ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9MCxmPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk7aWYoXCIqXCI9PT1hKXt3aGlsZShjPWZbZSsrXSkxPT09Yy5ub2RlVHlwZSYmZC5wdXNoKGMpO3JldHVybiBkfXJldHVybiBmfSxkLmZpbmQuQ0xBU1M9Yy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZmdW5jdGlvbihhLGIpe3JldHVybiBwP2IuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShhKTp2b2lkIDB9LHI9W10scT1bXSwoYy5xc2E9JC50ZXN0KGcucXVlcnlTZWxlY3RvckFsbCkpJiYoamEoZnVuY3Rpb24oYSl7by5hcHBlbmRDaGlsZChhKS5pbm5lckhUTUw9XCI8YSBpZD0nXCIrdStcIic+PC9hPjxzZWxlY3QgaWQ9J1wiK3UrXCItXFxmXScgbXNhbGxvd2NhcHR1cmU9Jyc+PG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIixhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGgmJnEucHVzaChcIlsqXiRdPVwiK0wrXCIqKD86Jyd8XFxcIlxcXCIpXCIpLGEucXVlcnlTZWxlY3RvckFsbChcIltzZWxlY3RlZF1cIikubGVuZ3RofHxxLnB1c2goXCJcXFxcW1wiK0wrXCIqKD86dmFsdWV8XCIrSytcIilcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiW2lkfj1cIit1K1wiLV1cIikubGVuZ3RofHxxLnB1c2goXCJ+PVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGh8fHEucHVzaChcIjpjaGVja2VkXCIpLGEucXVlcnlTZWxlY3RvckFsbChcImEjXCIrdStcIisqXCIpLmxlbmd0aHx8cS5wdXNoKFwiLiMuK1srfl1cIil9KSxqYShmdW5jdGlvbihhKXt2YXIgYj1nLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtiLnNldEF0dHJpYnV0ZShcInR5cGVcIixcImhpZGRlblwiKSxhLmFwcGVuZENoaWxkKGIpLnNldEF0dHJpYnV0ZShcIm5hbWVcIixcIkRcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9ZF1cIikubGVuZ3RoJiZxLnB1c2goXCJuYW1lXCIrTCtcIipbKl4kfCF+XT89XCIpLGEucXVlcnlTZWxlY3RvckFsbChcIjplbmFibGVkXCIpLmxlbmd0aHx8cS5wdXNoKFwiOmVuYWJsZWRcIixcIjpkaXNhYmxlZFwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqLDp4XCIpLHEucHVzaChcIiwuKjpcIil9KSksKGMubWF0Y2hlc1NlbGVjdG9yPSQudGVzdChzPW8ubWF0Y2hlc3x8by53ZWJraXRNYXRjaGVzU2VsZWN0b3J8fG8ubW96TWF0Y2hlc1NlbGVjdG9yfHxvLm9NYXRjaGVzU2VsZWN0b3J8fG8ubXNNYXRjaGVzU2VsZWN0b3IpKSYmamEoZnVuY3Rpb24oYSl7Yy5kaXNjb25uZWN0ZWRNYXRjaD1zLmNhbGwoYSxcImRpdlwiKSxzLmNhbGwoYSxcIltzIT0nJ106eFwiKSxyLnB1c2goXCIhPVwiLFApfSkscT1xLmxlbmd0aCYmbmV3IFJlZ0V4cChxLmpvaW4oXCJ8XCIpKSxyPXIubGVuZ3RoJiZuZXcgUmVnRXhwKHIuam9pbihcInxcIikpLGI9JC50ZXN0KG8uY29tcGFyZURvY3VtZW50UG9zaXRpb24pLHQ9Ynx8JC50ZXN0KG8uY29udGFpbnMpP2Z1bmN0aW9uKGEsYil7dmFyIGM9OT09PWEubm9kZVR5cGU/YS5kb2N1bWVudEVsZW1lbnQ6YSxkPWImJmIucGFyZW50Tm9kZTtyZXR1cm4gYT09PWR8fCEoIWR8fDEhPT1kLm5vZGVUeXBlfHwhKGMuY29udGFpbnM/Yy5jb250YWlucyhkKTphLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uJiYxNiZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGQpKSl9OmZ1bmN0aW9uKGEsYil7aWYoYil3aGlsZShiPWIucGFyZW50Tm9kZSlpZihiPT09YSlyZXR1cm4hMDtyZXR1cm4hMX0sQj1iP2Z1bmN0aW9uKGEsYil7aWYoYT09PWIpcmV0dXJuIGw9ITAsMDt2YXIgZD0hYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbi0hYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtyZXR1cm4gZD9kOihkPShhLm93bmVyRG9jdW1lbnR8fGEpPT09KGIub3duZXJEb2N1bWVudHx8Yik/YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKToxLDEmZHx8IWMuc29ydERldGFjaGVkJiZiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGEpPT09ZD9hPT09Z3x8YS5vd25lckRvY3VtZW50PT09diYmdCh2LGEpPy0xOmI9PT1nfHxiLm93bmVyRG9jdW1lbnQ9PT12JiZ0KHYsYik/MTprP0ooayxhKS1KKGssYik6MDo0JmQ/LTE6MSl9OmZ1bmN0aW9uKGEsYil7aWYoYT09PWIpcmV0dXJuIGw9ITAsMDt2YXIgYyxkPTAsZT1hLnBhcmVudE5vZGUsZj1iLnBhcmVudE5vZGUsaD1bYV0saT1bYl07aWYoIWV8fCFmKXJldHVybiBhPT09Zz8tMTpiPT09Zz8xOmU/LTE6Zj8xOms/SihrLGEpLUooayxiKTowO2lmKGU9PT1mKXJldHVybiBsYShhLGIpO2M9YTt3aGlsZShjPWMucGFyZW50Tm9kZSloLnVuc2hpZnQoYyk7Yz1iO3doaWxlKGM9Yy5wYXJlbnROb2RlKWkudW5zaGlmdChjKTt3aGlsZShoW2RdPT09aVtkXSlkKys7cmV0dXJuIGQ/bGEoaFtkXSxpW2RdKTpoW2RdPT09dj8tMTppW2RdPT09dj8xOjB9LGcpOm59LGdhLm1hdGNoZXM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZ2EoYSxudWxsLG51bGwsYil9LGdhLm1hdGNoZXNTZWxlY3Rvcj1mdW5jdGlvbihhLGIpe2lmKChhLm93bmVyRG9jdW1lbnR8fGEpIT09biYmbShhKSxiPWIucmVwbGFjZShVLFwiPSckMSddXCIpLCEoIWMubWF0Y2hlc1NlbGVjdG9yfHwhcHx8ciYmci50ZXN0KGIpfHxxJiZxLnRlc3QoYikpKXRyeXt2YXIgZD1zLmNhbGwoYSxiKTtpZihkfHxjLmRpc2Nvbm5lY3RlZE1hdGNofHxhLmRvY3VtZW50JiYxMSE9PWEuZG9jdW1lbnQubm9kZVR5cGUpcmV0dXJuIGR9Y2F0Y2goZSl7fXJldHVybiBnYShiLG4sbnVsbCxbYV0pLmxlbmd0aD4wfSxnYS5jb250YWlucz1mdW5jdGlvbihhLGIpe3JldHVybihhLm93bmVyRG9jdW1lbnR8fGEpIT09biYmbShhKSx0KGEsYil9LGdhLmF0dHI9ZnVuY3Rpb24oYSxiKXsoYS5vd25lckRvY3VtZW50fHxhKSE9PW4mJm0oYSk7dmFyIGU9ZC5hdHRySGFuZGxlW2IudG9Mb3dlckNhc2UoKV0sZj1lJiZELmNhbGwoZC5hdHRySGFuZGxlLGIudG9Mb3dlckNhc2UoKSk/ZShhLGIsIXApOnZvaWQgMDtyZXR1cm4gdm9pZCAwIT09Zj9mOmMuYXR0cmlidXRlc3x8IXA/YS5nZXRBdHRyaWJ1dGUoYik6KGY9YS5nZXRBdHRyaWJ1dGVOb2RlKGIpKSYmZi5zcGVjaWZpZWQ/Zi52YWx1ZTpudWxsfSxnYS5lcnJvcj1mdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIithKX0sZ2EudW5pcXVlU29ydD1mdW5jdGlvbihhKXt2YXIgYixkPVtdLGU9MCxmPTA7aWYobD0hYy5kZXRlY3REdXBsaWNhdGVzLGs9IWMuc29ydFN0YWJsZSYmYS5zbGljZSgwKSxhLnNvcnQoQiksbCl7d2hpbGUoYj1hW2YrK10pYj09PWFbZl0mJihlPWQucHVzaChmKSk7d2hpbGUoZS0tKWEuc3BsaWNlKGRbZV0sMSl9cmV0dXJuIGs9bnVsbCxhfSxlPWdhLmdldFRleHQ9ZnVuY3Rpb24oYSl7dmFyIGIsYz1cIlwiLGQ9MCxmPWEubm9kZVR5cGU7aWYoZil7aWYoMT09PWZ8fDk9PT1mfHwxMT09PWYpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLnRleHRDb250ZW50KXJldHVybiBhLnRleHRDb250ZW50O2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZyljKz1lKGEpfWVsc2UgaWYoMz09PWZ8fDQ9PT1mKXJldHVybiBhLm5vZGVWYWx1ZX1lbHNlIHdoaWxlKGI9YVtkKytdKWMrPWUoYik7cmV0dXJuIGN9LGQ9Z2Euc2VsZWN0b3JzPXtjYWNoZUxlbmd0aDo1MCxjcmVhdGVQc2V1ZG86aWEsbWF0Y2g6WCxhdHRySGFuZGxlOnt9LGZpbmQ6e30scmVsYXRpdmU6e1wiPlwiOntkaXI6XCJwYXJlbnROb2RlXCIsZmlyc3Q6ITB9LFwiIFwiOntkaXI6XCJwYXJlbnROb2RlXCJ9LFwiK1wiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIixmaXJzdDohMH0sXCJ+XCI6e2RpcjpcInByZXZpb3VzU2libGluZ1wifX0scHJlRmlsdGVyOntBVFRSOmZ1bmN0aW9uKGEpe3JldHVybiBhWzFdPWFbMV0ucmVwbGFjZShjYSxkYSksYVszXT0oYVszXXx8YVs0XXx8YVs1XXx8XCJcIikucmVwbGFjZShjYSxkYSksXCJ+PVwiPT09YVsyXSYmKGFbM109XCIgXCIrYVszXStcIiBcIiksYS5zbGljZSgwLDQpfSxDSElMRDpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnRvTG93ZXJDYXNlKCksXCJudGhcIj09PWFbMV0uc2xpY2UoMCwzKT8oYVszXXx8Z2EuZXJyb3IoYVswXSksYVs0XT0rKGFbNF0/YVs1XSsoYVs2XXx8MSk6MiooXCJldmVuXCI9PT1hWzNdfHxcIm9kZFwiPT09YVszXSkpLGFbNV09KyhhWzddK2FbOF18fFwib2RkXCI9PT1hWzNdKSk6YVszXSYmZ2EuZXJyb3IoYVswXSksYX0sUFNFVURPOmZ1bmN0aW9uKGEpe3ZhciBiLGM9IWFbNl0mJmFbMl07cmV0dXJuIFguQ0hJTEQudGVzdChhWzBdKT9udWxsOihhWzNdP2FbMl09YVs0XXx8YVs1XXx8XCJcIjpjJiZWLnRlc3QoYykmJihiPWcoYywhMCkpJiYoYj1jLmluZGV4T2YoXCIpXCIsYy5sZW5ndGgtYiktYy5sZW5ndGgpJiYoYVswXT1hWzBdLnNsaWNlKDAsYiksYVsyXT1jLnNsaWNlKDAsYikpLGEuc2xpY2UoMCwzKSl9fSxmaWx0ZXI6e1RBRzpmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UoY2EsZGEpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCIqXCI9PT1hP2Z1bmN0aW9uKCl7cmV0dXJuITB9OmZ1bmN0aW9uKGEpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1ifX0sQ0xBU1M6ZnVuY3Rpb24oYSl7dmFyIGI9eVthK1wiIFwiXTtyZXR1cm4gYnx8KGI9bmV3IFJlZ0V4cChcIihefFwiK0wrXCIpXCIrYStcIihcIitMK1wifCQpXCIpKSYmeShhLGZ1bmN0aW9uKGEpe3JldHVybiBiLnRlc3QoXCJzdHJpbmdcIj09dHlwZW9mIGEuY2xhc3NOYW1lJiZhLmNsYXNzTmFtZXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0QXR0cmlidXRlJiZhLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKX0pfSxBVFRSOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCl7dmFyIGU9Z2EuYXR0cihkLGEpO3JldHVybiBudWxsPT1lP1wiIT1cIj09PWI6Yj8oZSs9XCJcIixcIj1cIj09PWI/ZT09PWM6XCIhPVwiPT09Yj9lIT09YzpcIl49XCI9PT1iP2MmJjA9PT1lLmluZGV4T2YoYyk6XCIqPVwiPT09Yj9jJiZlLmluZGV4T2YoYyk+LTE6XCIkPVwiPT09Yj9jJiZlLnNsaWNlKC1jLmxlbmd0aCk9PT1jOlwifj1cIj09PWI/KFwiIFwiK2UucmVwbGFjZShRLFwiIFwiKStcIiBcIikuaW5kZXhPZihjKT4tMTpcInw9XCI9PT1iP2U9PT1jfHxlLnNsaWNlKDAsYy5sZW5ndGgrMSk9PT1jK1wiLVwiOiExKTohMH19LENISUxEOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGY9XCJudGhcIiE9PWEuc2xpY2UoMCwzKSxnPVwibGFzdFwiIT09YS5zbGljZSgtNCksaD1cIm9mLXR5cGVcIj09PWI7cmV0dXJuIDE9PT1kJiYwPT09ZT9mdW5jdGlvbihhKXtyZXR1cm4hIWEucGFyZW50Tm9kZX06ZnVuY3Rpb24oYixjLGkpe3ZhciBqLGssbCxtLG4sbyxwPWYhPT1nP1wibmV4dFNpYmxpbmdcIjpcInByZXZpb3VzU2libGluZ1wiLHE9Yi5wYXJlbnROb2RlLHI9aCYmYi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLHM9IWkmJiFoO2lmKHEpe2lmKGYpe3doaWxlKHApe2w9Yjt3aGlsZShsPWxbcF0paWYoaD9sLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1yOjE9PT1sLm5vZGVUeXBlKXJldHVybiExO289cD1cIm9ubHlcIj09PWEmJiFvJiZcIm5leHRTaWJsaW5nXCJ9cmV0dXJuITB9aWYobz1bZz9xLmZpcnN0Q2hpbGQ6cS5sYXN0Q2hpbGRdLGcmJnMpe2s9cVt1XXx8KHFbdV09e30pLGo9a1thXXx8W10sbj1qWzBdPT09dyYmalsxXSxtPWpbMF09PT13JiZqWzJdLGw9biYmcS5jaGlsZE5vZGVzW25dO3doaWxlKGw9KytuJiZsJiZsW3BdfHwobT1uPTApfHxvLnBvcCgpKWlmKDE9PT1sLm5vZGVUeXBlJiYrK20mJmw9PT1iKXtrW2FdPVt3LG4sbV07YnJlYWt9fWVsc2UgaWYocyYmKGo9KGJbdV18fChiW3VdPXt9KSlbYV0pJiZqWzBdPT09dyltPWpbMV07ZWxzZSB3aGlsZShsPSsrbiYmbCYmbFtwXXx8KG09bj0wKXx8by5wb3AoKSlpZigoaD9sLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1yOjE9PT1sLm5vZGVUeXBlKSYmKyttJiYocyYmKChsW3VdfHwobFt1XT17fSkpW2FdPVt3LG1dKSxsPT09YikpYnJlYWs7cmV0dXJuIG0tPWUsbT09PWR8fG0lZD09PTAmJm0vZD49MH19fSxQU0VVRE86ZnVuY3Rpb24oYSxiKXt2YXIgYyxlPWQucHNldWRvc1thXXx8ZC5zZXRGaWx0ZXJzW2EudG9Mb3dlckNhc2UoKV18fGdhLmVycm9yKFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIithKTtyZXR1cm4gZVt1XT9lKGIpOmUubGVuZ3RoPjE/KGM9W2EsYSxcIlwiLGJdLGQuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eShhLnRvTG93ZXJDYXNlKCkpP2lhKGZ1bmN0aW9uKGEsYyl7dmFyIGQsZj1lKGEsYiksZz1mLmxlbmd0aDt3aGlsZShnLS0pZD1KKGEsZltnXSksYVtkXT0hKGNbZF09ZltnXSl9KTpmdW5jdGlvbihhKXtyZXR1cm4gZShhLDAsYyl9KTplfX0scHNldWRvczp7bm90OmlhKGZ1bmN0aW9uKGEpe3ZhciBiPVtdLGM9W10sZD1oKGEucmVwbGFjZShSLFwiJDFcIikpO3JldHVybiBkW3VdP2lhKGZ1bmN0aW9uKGEsYixjLGUpe3ZhciBmLGc9ZChhLG51bGwsZSxbXSksaD1hLmxlbmd0aDt3aGlsZShoLS0pKGY9Z1toXSkmJihhW2hdPSEoYltoXT1mKSl9KTpmdW5jdGlvbihhLGUsZil7cmV0dXJuIGJbMF09YSxkKGIsbnVsbCxmLGMpLGJbMF09bnVsbCwhYy5wb3AoKX19KSxoYXM6aWEoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBnYShhLGIpLmxlbmd0aD4wfX0pLGNvbnRhaW5zOmlhKGZ1bmN0aW9uKGEpe3JldHVybiBhPWEucmVwbGFjZShjYSxkYSksZnVuY3Rpb24oYil7cmV0dXJuKGIudGV4dENvbnRlbnR8fGIuaW5uZXJUZXh0fHxlKGIpKS5pbmRleE9mKGEpPi0xfX0pLGxhbmc6aWEoZnVuY3Rpb24oYSl7cmV0dXJuIFcudGVzdChhfHxcIlwiKXx8Z2EuZXJyb3IoXCJ1bnN1cHBvcnRlZCBsYW5nOiBcIithKSxhPWEucmVwbGFjZShjYSxkYSkudG9Mb3dlckNhc2UoKSxmdW5jdGlvbihiKXt2YXIgYztkbyBpZihjPXA/Yi5sYW5nOmIuZ2V0QXR0cmlidXRlKFwieG1sOmxhbmdcIil8fGIuZ2V0QXR0cmlidXRlKFwibGFuZ1wiKSlyZXR1cm4gYz1jLnRvTG93ZXJDYXNlKCksYz09PWF8fDA9PT1jLmluZGV4T2YoYStcIi1cIik7d2hpbGUoKGI9Yi5wYXJlbnROb2RlKSYmMT09PWIubm9kZVR5cGUpO3JldHVybiExfX0pLHRhcmdldDpmdW5jdGlvbihiKXt2YXIgYz1hLmxvY2F0aW9uJiZhLmxvY2F0aW9uLmhhc2g7cmV0dXJuIGMmJmMuc2xpY2UoMSk9PT1iLmlkfSxyb290OmZ1bmN0aW9uKGEpe3JldHVybiBhPT09b30sZm9jdXM6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1uLmFjdGl2ZUVsZW1lbnQmJighbi5oYXNGb2N1c3x8bi5oYXNGb2N1cygpKSYmISEoYS50eXBlfHxhLmhyZWZ8fH5hLnRhYkluZGV4KX0sZW5hYmxlZDpmdW5jdGlvbihhKXtyZXR1cm4gYS5kaXNhYmxlZD09PSExfSxkaXNhYmxlZDpmdW5jdGlvbihhKXtyZXR1cm4gYS5kaXNhYmxlZD09PSEwfSxjaGVja2VkOmZ1bmN0aW9uKGEpe3ZhciBiPWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT1iJiYhIWEuY2hlY2tlZHx8XCJvcHRpb25cIj09PWImJiEhYS5zZWxlY3RlZH0sc2VsZWN0ZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucGFyZW50Tm9kZSYmYS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgsYS5zZWxlY3RlZD09PSEwfSxlbXB0eTpmdW5jdGlvbihhKXtmb3IoYT1hLmZpcnN0Q2hpbGQ7YTthPWEubmV4dFNpYmxpbmcpaWYoYS5ub2RlVHlwZTw2KXJldHVybiExO3JldHVybiEwfSxwYXJlbnQ6ZnVuY3Rpb24oYSl7cmV0dXJuIWQucHNldWRvcy5lbXB0eShhKX0saGVhZGVyOmZ1bmN0aW9uKGEpe3JldHVybiBaLnRlc3QoYS5ub2RlTmFtZSl9LGlucHV0OmZ1bmN0aW9uKGEpe3JldHVybiBZLnRlc3QoYS5ub2RlTmFtZSl9LGJ1dHRvbjpmdW5jdGlvbihhKXt2YXIgYj1hLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJpbnB1dFwiPT09YiYmXCJidXR0b25cIj09PWEudHlwZXx8XCJidXR0b25cIj09PWJ9LHRleHQ6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuXCJpbnB1dFwiPT09YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpJiZcInRleHRcIj09PWEudHlwZSYmKG51bGw9PShiPWEuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSl8fFwidGV4dFwiPT09Yi50b0xvd2VyQ2FzZSgpKX0sZmlyc3Q6b2EoZnVuY3Rpb24oKXtyZXR1cm5bMF19KSxsYXN0Om9hKGZ1bmN0aW9uKGEsYil7cmV0dXJuW2ItMV19KSxlcTpvYShmdW5jdGlvbihhLGIsYyl7cmV0dXJuWzA+Yz9jK2I6Y119KSxldmVuOm9hKGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTA7Yj5jO2MrPTIpYS5wdXNoKGMpO3JldHVybiBhfSksb2RkOm9hKGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTE7Yj5jO2MrPTIpYS5wdXNoKGMpO3JldHVybiBhfSksbHQ6b2EoZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD0wPmM/YytiOmM7LS1kPj0wOylhLnB1c2goZCk7cmV0dXJuIGF9KSxndDpvYShmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPTA+Yz9jK2I6YzsrK2Q8YjspYS5wdXNoKGQpO3JldHVybiBhfSl9fSxkLnBzZXVkb3MubnRoPWQucHNldWRvcy5lcTtmb3IoYiBpbntyYWRpbzohMCxjaGVja2JveDohMCxmaWxlOiEwLHBhc3N3b3JkOiEwLGltYWdlOiEwfSlkLnBzZXVkb3NbYl09bWEoYik7Zm9yKGIgaW57c3VibWl0OiEwLHJlc2V0OiEwfSlkLnBzZXVkb3NbYl09bmEoYik7ZnVuY3Rpb24gcWEoKXt9cWEucHJvdG90eXBlPWQuZmlsdGVycz1kLnBzZXVkb3MsZC5zZXRGaWx0ZXJzPW5ldyBxYSxnPWdhLnRva2VuaXplPWZ1bmN0aW9uKGEsYil7dmFyIGMsZSxmLGcsaCxpLGosaz16W2ErXCIgXCJdO2lmKGspcmV0dXJuIGI/MDprLnNsaWNlKDApO2g9YSxpPVtdLGo9ZC5wcmVGaWx0ZXI7d2hpbGUoaCl7KCFjfHwoZT1TLmV4ZWMoaCkpKSYmKGUmJihoPWguc2xpY2UoZVswXS5sZW5ndGgpfHxoKSxpLnB1c2goZj1bXSkpLGM9ITEsKGU9VC5leGVjKGgpKSYmKGM9ZS5zaGlmdCgpLGYucHVzaCh7dmFsdWU6Yyx0eXBlOmVbMF0ucmVwbGFjZShSLFwiIFwiKX0pLGg9aC5zbGljZShjLmxlbmd0aCkpO2ZvcihnIGluIGQuZmlsdGVyKSEoZT1YW2ddLmV4ZWMoaCkpfHxqW2ddJiYhKGU9altnXShlKSl8fChjPWUuc2hpZnQoKSxmLnB1c2goe3ZhbHVlOmMsdHlwZTpnLG1hdGNoZXM6ZX0pLGg9aC5zbGljZShjLmxlbmd0aCkpO2lmKCFjKWJyZWFrfXJldHVybiBiP2gubGVuZ3RoOmg/Z2EuZXJyb3IoYSk6eihhLGkpLnNsaWNlKDApfTtmdW5jdGlvbiByYShhKXtmb3IodmFyIGI9MCxjPWEubGVuZ3RoLGQ9XCJcIjtjPmI7YisrKWQrPWFbYl0udmFsdWU7cmV0dXJuIGR9ZnVuY3Rpb24gc2EoYSxiLGMpe3ZhciBkPWIuZGlyLGU9YyYmXCJwYXJlbnROb2RlXCI9PT1kLGY9eCsrO3JldHVybiBiLmZpcnN0P2Z1bmN0aW9uKGIsYyxmKXt3aGlsZShiPWJbZF0paWYoMT09PWIubm9kZVR5cGV8fGUpcmV0dXJuIGEoYixjLGYpfTpmdW5jdGlvbihiLGMsZyl7dmFyIGgsaSxqPVt3LGZdO2lmKGcpe3doaWxlKGI9YltkXSlpZigoMT09PWIubm9kZVR5cGV8fGUpJiZhKGIsYyxnKSlyZXR1cm4hMH1lbHNlIHdoaWxlKGI9YltkXSlpZigxPT09Yi5ub2RlVHlwZXx8ZSl7aWYoaT1iW3VdfHwoYlt1XT17fSksKGg9aVtkXSkmJmhbMF09PT13JiZoWzFdPT09ZilyZXR1cm4galsyXT1oWzJdO2lmKGlbZF09aixqWzJdPWEoYixjLGcpKXJldHVybiEwfX19ZnVuY3Rpb24gdGEoYSl7cmV0dXJuIGEubGVuZ3RoPjE/ZnVuY3Rpb24oYixjLGQpe3ZhciBlPWEubGVuZ3RoO3doaWxlKGUtLSlpZighYVtlXShiLGMsZCkpcmV0dXJuITE7cmV0dXJuITB9OmFbMF19ZnVuY3Rpb24gdWEoYSxiLGMpe2Zvcih2YXIgZD0wLGU9Yi5sZW5ndGg7ZT5kO2QrKylnYShhLGJbZF0sYyk7cmV0dXJuIGN9ZnVuY3Rpb24gdmEoYSxiLGMsZCxlKXtmb3IodmFyIGYsZz1bXSxoPTAsaT1hLmxlbmd0aCxqPW51bGwhPWI7aT5oO2grKykoZj1hW2hdKSYmKCFjfHxjKGYsZCxlKSkmJihnLnB1c2goZiksaiYmYi5wdXNoKGgpKTtyZXR1cm4gZ31mdW5jdGlvbiB3YShhLGIsYyxkLGUsZil7cmV0dXJuIGQmJiFkW3VdJiYoZD13YShkKSksZSYmIWVbdV0mJihlPXdhKGUsZikpLGlhKGZ1bmN0aW9uKGYsZyxoLGkpe3ZhciBqLGssbCxtPVtdLG49W10sbz1nLmxlbmd0aCxwPWZ8fHVhKGJ8fFwiKlwiLGgubm9kZVR5cGU/W2hdOmgsW10pLHE9IWF8fCFmJiZiP3A6dmEocCxtLGEsaCxpKSxyPWM/ZXx8KGY/YTpvfHxkKT9bXTpnOnE7aWYoYyYmYyhxLHIsaCxpKSxkKXtqPXZhKHIsbiksZChqLFtdLGgsaSksaz1qLmxlbmd0aDt3aGlsZShrLS0pKGw9altrXSkmJihyW25ba11dPSEocVtuW2tdXT1sKSl9aWYoZil7aWYoZXx8YSl7aWYoZSl7aj1bXSxrPXIubGVuZ3RoO3doaWxlKGstLSkobD1yW2tdKSYmai5wdXNoKHFba109bCk7ZShudWxsLHI9W10saixpKX1rPXIubGVuZ3RoO3doaWxlKGstLSkobD1yW2tdKSYmKGo9ZT9KKGYsbCk6bVtrXSk+LTEmJihmW2pdPSEoZ1tqXT1sKSl9fWVsc2Ugcj12YShyPT09Zz9yLnNwbGljZShvLHIubGVuZ3RoKTpyKSxlP2UobnVsbCxnLHIsaSk6SC5hcHBseShnLHIpfSl9ZnVuY3Rpb24geGEoYSl7Zm9yKHZhciBiLGMsZSxmPWEubGVuZ3RoLGc9ZC5yZWxhdGl2ZVthWzBdLnR5cGVdLGg9Z3x8ZC5yZWxhdGl2ZVtcIiBcIl0saT1nPzE6MCxrPXNhKGZ1bmN0aW9uKGEpe3JldHVybiBhPT09Yn0saCwhMCksbD1zYShmdW5jdGlvbihhKXtyZXR1cm4gSihiLGEpPi0xfSxoLCEwKSxtPVtmdW5jdGlvbihhLGMsZCl7dmFyIGU9IWcmJihkfHxjIT09ail8fCgoYj1jKS5ub2RlVHlwZT9rKGEsYyxkKTpsKGEsYyxkKSk7cmV0dXJuIGI9bnVsbCxlfV07Zj5pO2krKylpZihjPWQucmVsYXRpdmVbYVtpXS50eXBlXSltPVtzYSh0YShtKSxjKV07ZWxzZXtpZihjPWQuZmlsdGVyW2FbaV0udHlwZV0uYXBwbHkobnVsbCxhW2ldLm1hdGNoZXMpLGNbdV0pe2ZvcihlPSsraTtmPmU7ZSsrKWlmKGQucmVsYXRpdmVbYVtlXS50eXBlXSlicmVhaztyZXR1cm4gd2EoaT4xJiZ0YShtKSxpPjEmJnJhKGEuc2xpY2UoMCxpLTEpLmNvbmNhdCh7dmFsdWU6XCIgXCI9PT1hW2ktMl0udHlwZT9cIipcIjpcIlwifSkpLnJlcGxhY2UoUixcIiQxXCIpLGMsZT5pJiZ4YShhLnNsaWNlKGksZSkpLGY+ZSYmeGEoYT1hLnNsaWNlKGUpKSxmPmUmJnJhKGEpKX1tLnB1c2goYyl9cmV0dXJuIHRhKG0pfWZ1bmN0aW9uIHlhKGEsYil7dmFyIGM9Yi5sZW5ndGg+MCxlPWEubGVuZ3RoPjAsZj1mdW5jdGlvbihmLGcsaCxpLGspe3ZhciBsLG0sbyxwPTAscT1cIjBcIixyPWYmJltdLHM9W10sdD1qLHU9Znx8ZSYmZC5maW5kLlRBRyhcIipcIixrKSx2PXcrPW51bGw9PXQ/MTpNYXRoLnJhbmRvbSgpfHwuMSx4PXUubGVuZ3RoO2ZvcihrJiYoaj1nIT09biYmZyk7cSE9PXgmJm51bGwhPShsPXVbcV0pO3ErKyl7aWYoZSYmbCl7bT0wO3doaWxlKG89YVttKytdKWlmKG8obCxnLGgpKXtpLnB1c2gobCk7YnJlYWt9ayYmKHc9dil9YyYmKChsPSFvJiZsKSYmcC0tLGYmJnIucHVzaChsKSl9aWYocCs9cSxjJiZxIT09cCl7bT0wO3doaWxlKG89YlttKytdKW8ocixzLGcsaCk7aWYoZil7aWYocD4wKXdoaWxlKHEtLSlyW3FdfHxzW3FdfHwoc1txXT1GLmNhbGwoaSkpO3M9dmEocyl9SC5hcHBseShpLHMpLGsmJiFmJiZzLmxlbmd0aD4wJiZwK2IubGVuZ3RoPjEmJmdhLnVuaXF1ZVNvcnQoaSl9cmV0dXJuIGsmJih3PXYsaj10KSxyfTtyZXR1cm4gYz9pYShmKTpmfXJldHVybiBoPWdhLmNvbXBpbGU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9W10sZj1BW2ErXCIgXCJdO2lmKCFmKXtifHwoYj1nKGEpKSxjPWIubGVuZ3RoO3doaWxlKGMtLSlmPXhhKGJbY10pLGZbdV0/ZC5wdXNoKGYpOmUucHVzaChmKTtmPUEoYSx5YShlLGQpKSxmLnNlbGVjdG9yPWF9cmV0dXJuIGZ9LGk9Z2Euc2VsZWN0PWZ1bmN0aW9uKGEsYixlLGYpe3ZhciBpLGosayxsLG0sbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBhJiZhLG89IWYmJmcoYT1uLnNlbGVjdG9yfHxhKTtpZihlPWV8fFtdLDE9PT1vLmxlbmd0aCl7aWYoaj1vWzBdPW9bMF0uc2xpY2UoMCksai5sZW5ndGg+MiYmXCJJRFwiPT09KGs9alswXSkudHlwZSYmYy5nZXRCeUlkJiY5PT09Yi5ub2RlVHlwZSYmcCYmZC5yZWxhdGl2ZVtqWzFdLnR5cGVdKXtpZihiPShkLmZpbmQuSUQoay5tYXRjaGVzWzBdLnJlcGxhY2UoY2EsZGEpLGIpfHxbXSlbMF0sIWIpcmV0dXJuIGU7biYmKGI9Yi5wYXJlbnROb2RlKSxhPWEuc2xpY2Uoai5zaGlmdCgpLnZhbHVlLmxlbmd0aCl9aT1YLm5lZWRzQ29udGV4dC50ZXN0KGEpPzA6ai5sZW5ndGg7d2hpbGUoaS0tKXtpZihrPWpbaV0sZC5yZWxhdGl2ZVtsPWsudHlwZV0pYnJlYWs7aWYoKG09ZC5maW5kW2xdKSYmKGY9bShrLm1hdGNoZXNbMF0ucmVwbGFjZShjYSxkYSksYWEudGVzdChqWzBdLnR5cGUpJiZwYShiLnBhcmVudE5vZGUpfHxiKSkpe2lmKGouc3BsaWNlKGksMSksYT1mLmxlbmd0aCYmcmEoaiksIWEpcmV0dXJuIEguYXBwbHkoZSxmKSxlO2JyZWFrfX19cmV0dXJuKG58fGgoYSxvKSkoZixiLCFwLGUsYWEudGVzdChhKSYmcGEoYi5wYXJlbnROb2RlKXx8YiksZX0sYy5zb3J0U3RhYmxlPXUuc3BsaXQoXCJcIikuc29ydChCKS5qb2luKFwiXCIpPT09dSxjLmRldGVjdER1cGxpY2F0ZXM9ISFsLG0oKSxjLnNvcnREZXRhY2hlZD1qYShmdW5jdGlvbihhKXtyZXR1cm4gMSZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG4uY3JlYXRlRWxlbWVudChcImRpdlwiKSl9KSxqYShmdW5jdGlvbihhKXtyZXR1cm4gYS5pbm5lckhUTUw9XCI8YSBocmVmPScjJz48L2E+XCIsXCIjXCI9PT1hLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKX0pfHxrYShcInR5cGV8aHJlZnxoZWlnaHR8d2lkdGhcIixmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGM/dm9pZCAwOmEuZ2V0QXR0cmlidXRlKGIsXCJ0eXBlXCI9PT1iLnRvTG93ZXJDYXNlKCk/MToyKX0pLGMuYXR0cmlidXRlcyYmamEoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaW5uZXJIVE1MPVwiPGlucHV0Lz5cIixhLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiKSxcIlwiPT09YS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpfSl8fGthKFwidmFsdWVcIixmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGN8fFwiaW5wdXRcIiE9PWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKT92b2lkIDA6YS5kZWZhdWx0VmFsdWV9KSxqYShmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YS5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKX0pfHxrYShLLGZ1bmN0aW9uKGEsYixjKXt2YXIgZDtyZXR1cm4gYz92b2lkIDA6YVtiXT09PSEwP2IudG9Mb3dlckNhc2UoKTooZD1hLmdldEF0dHJpYnV0ZU5vZGUoYikpJiZkLnNwZWNpZmllZD9kLnZhbHVlOm51bGx9KSxnYX0oYSk7bi5maW5kPXQsbi5leHByPXQuc2VsZWN0b3JzLG4uZXhwcltcIjpcIl09bi5leHByLnBzZXVkb3Msbi51bmlxdWU9dC51bmlxdWVTb3J0LG4udGV4dD10LmdldFRleHQsbi5pc1hNTERvYz10LmlzWE1MLG4uY29udGFpbnM9dC5jb250YWluczt2YXIgdT1uLmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LHY9L148KFxcdyspXFxzKlxcLz8+KD86PFxcL1xcMT58KSQvLHc9L14uW146I1xcW1xcLixdKiQvO2Z1bmN0aW9uIHgoYSxiLGMpe2lmKG4uaXNGdW5jdGlvbihiKSlyZXR1cm4gbi5ncmVwKGEsZnVuY3Rpb24oYSxkKXtyZXR1cm4hIWIuY2FsbChhLGQsYSkhPT1jfSk7aWYoYi5ub2RlVHlwZSlyZXR1cm4gbi5ncmVwKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1iIT09Y30pO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXtpZih3LnRlc3QoYikpcmV0dXJuIG4uZmlsdGVyKGIsYSxjKTtiPW4uZmlsdGVyKGIsYSl9cmV0dXJuIG4uZ3JlcChhLGZ1bmN0aW9uKGEpe3JldHVybiBnLmNhbGwoYixhKT49MCE9PWN9KX1uLmZpbHRlcj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YlswXTtyZXR1cm4gYyYmKGE9XCI6bm90KFwiK2ErXCIpXCIpLDE9PT1iLmxlbmd0aCYmMT09PWQubm9kZVR5cGU/bi5maW5kLm1hdGNoZXNTZWxlY3RvcihkLGEpP1tkXTpbXTpuLmZpbmQubWF0Y2hlcyhhLG4uZ3JlcChiLGZ1bmN0aW9uKGEpe3JldHVybiAxPT09YS5ub2RlVHlwZX0pKX0sbi5mbi5leHRlbmQoe2ZpbmQ6ZnVuY3Rpb24oYSl7dmFyIGIsYz10aGlzLmxlbmd0aCxkPVtdLGU9dGhpcztpZihcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm4gdGhpcy5wdXNoU3RhY2sobihhKS5maWx0ZXIoZnVuY3Rpb24oKXtmb3IoYj0wO2M+YjtiKyspaWYobi5jb250YWlucyhlW2JdLHRoaXMpKXJldHVybiEwfSkpO2ZvcihiPTA7Yz5iO2IrKyluLmZpbmQoYSxlW2JdLGQpO3JldHVybiBkPXRoaXMucHVzaFN0YWNrKGM+MT9uLnVuaXF1ZShkKTpkKSxkLnNlbGVjdG9yPXRoaXMuc2VsZWN0b3I/dGhpcy5zZWxlY3RvcitcIiBcIithOmEsZH0sZmlsdGVyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayh4KHRoaXMsYXx8W10sITEpKX0sbm90OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayh4KHRoaXMsYXx8W10sITApKX0saXM6ZnVuY3Rpb24oYSl7cmV0dXJuISF4KHRoaXMsXCJzdHJpbmdcIj09dHlwZW9mIGEmJnUudGVzdChhKT9uKGEpOmF8fFtdLCExKS5sZW5ndGh9fSk7dmFyIHksej0vXig/OlxccyooPFtcXHdcXFddKz4pW14+XSp8IyhbXFx3LV0qKSkkLyxBPW4uZm4uaW5pdD1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7aWYoIWEpcmV0dXJuIHRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEpe2lmKGM9XCI8XCI9PT1hWzBdJiZcIj5cIj09PWFbYS5sZW5ndGgtMV0mJmEubGVuZ3RoPj0zP1tudWxsLGEsbnVsbF06ei5leGVjKGEpLCFjfHwhY1sxXSYmYilyZXR1cm4hYnx8Yi5qcXVlcnk/KGJ8fHkpLmZpbmQoYSk6dGhpcy5jb25zdHJ1Y3RvcihiKS5maW5kKGEpO2lmKGNbMV0pe2lmKGI9YiBpbnN0YW5jZW9mIG4/YlswXTpiLG4ubWVyZ2UodGhpcyxuLnBhcnNlSFRNTChjWzFdLGImJmIubm9kZVR5cGU/Yi5vd25lckRvY3VtZW50fHxiOmwsITApKSx2LnRlc3QoY1sxXSkmJm4uaXNQbGFpbk9iamVjdChiKSlmb3IoYyBpbiBiKW4uaXNGdW5jdGlvbih0aGlzW2NdKT90aGlzW2NdKGJbY10pOnRoaXMuYXR0cihjLGJbY10pO3JldHVybiB0aGlzfXJldHVybiBkPWwuZ2V0RWxlbWVudEJ5SWQoY1syXSksZCYmZC5wYXJlbnROb2RlJiYodGhpcy5sZW5ndGg9MSx0aGlzWzBdPWQpLHRoaXMuY29udGV4dD1sLHRoaXMuc2VsZWN0b3I9YSx0aGlzfXJldHVybiBhLm5vZGVUeXBlPyh0aGlzLmNvbnRleHQ9dGhpc1swXT1hLHRoaXMubGVuZ3RoPTEsdGhpcyk6bi5pc0Z1bmN0aW9uKGEpP1widW5kZWZpbmVkXCIhPXR5cGVvZiB5LnJlYWR5P3kucmVhZHkoYSk6YShuKToodm9pZCAwIT09YS5zZWxlY3RvciYmKHRoaXMuc2VsZWN0b3I9YS5zZWxlY3Rvcix0aGlzLmNvbnRleHQ9YS5jb250ZXh0KSxuLm1ha2VBcnJheShhLHRoaXMpKX07QS5wcm90b3R5cGU9bi5mbix5PW4obCk7dmFyIEI9L14oPzpwYXJlbnRzfHByZXYoPzpVbnRpbHxBbGwpKS8sQz17Y2hpbGRyZW46ITAsY29udGVudHM6ITAsbmV4dDohMCxwcmV2OiEwfTtuLmV4dGVuZCh7ZGlyOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1bXSxlPXZvaWQgMCE9PWM7d2hpbGUoKGE9YVtiXSkmJjkhPT1hLm5vZGVUeXBlKWlmKDE9PT1hLm5vZGVUeXBlKXtpZihlJiZuKGEpLmlzKGMpKWJyZWFrO2QucHVzaChhKX1yZXR1cm4gZH0sc2libGluZzpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1bXTthO2E9YS5uZXh0U2libGluZykxPT09YS5ub2RlVHlwZSYmYSE9PWImJmMucHVzaChhKTtyZXR1cm4gY319KSxuLmZuLmV4dGVuZCh7aGFzOmZ1bmN0aW9uKGEpe3ZhciBiPW4oYSx0aGlzKSxjPWIubGVuZ3RoO3JldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2M+YTthKyspaWYobi5jb250YWlucyh0aGlzLGJbYV0pKXJldHVybiEwfSl9LGNsb3Nlc3Q6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGMsZD0wLGU9dGhpcy5sZW5ndGgsZj1bXSxnPXUudGVzdChhKXx8XCJzdHJpbmdcIiE9dHlwZW9mIGE/bihhLGJ8fHRoaXMuY29udGV4dCk6MDtlPmQ7ZCsrKWZvcihjPXRoaXNbZF07YyYmYyE9PWI7Yz1jLnBhcmVudE5vZGUpaWYoYy5ub2RlVHlwZTwxMSYmKGc/Zy5pbmRleChjKT4tMToxPT09Yy5ub2RlVHlwZSYmbi5maW5kLm1hdGNoZXNTZWxlY3RvcihjLGEpKSl7Zi5wdXNoKGMpO2JyZWFrfXJldHVybiB0aGlzLnB1c2hTdGFjayhmLmxlbmd0aD4xP24udW5pcXVlKGYpOmYpfSxpbmRleDpmdW5jdGlvbihhKXtyZXR1cm4gYT9cInN0cmluZ1wiPT10eXBlb2YgYT9nLmNhbGwobihhKSx0aGlzWzBdKTpnLmNhbGwodGhpcyxhLmpxdWVyeT9hWzBdOmEpOnRoaXNbMF0mJnRoaXNbMF0ucGFyZW50Tm9kZT90aGlzLmZpcnN0KCkucHJldkFsbCgpLmxlbmd0aDotMX0sYWRkOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucHVzaFN0YWNrKG4udW5pcXVlKG4ubWVyZ2UodGhpcy5nZXQoKSxuKGEsYikpKSl9LGFkZEJhY2s6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYWRkKG51bGw9PWE/dGhpcy5wcmV2T2JqZWN0OnRoaXMucHJldk9iamVjdC5maWx0ZXIoYSkpfX0pO2Z1bmN0aW9uIEQoYSxiKXt3aGlsZSgoYT1hW2JdKSYmMSE9PWEubm9kZVR5cGUpO3JldHVybiBhfW4uZWFjaCh7cGFyZW50OmZ1bmN0aW9uKGEpe3ZhciBiPWEucGFyZW50Tm9kZTtyZXR1cm4gYiYmMTEhPT1iLm5vZGVUeXBlP2I6bnVsbH0scGFyZW50czpmdW5jdGlvbihhKXtyZXR1cm4gbi5kaXIoYSxcInBhcmVudE5vZGVcIil9LHBhcmVudHNVbnRpbDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIG4uZGlyKGEsXCJwYXJlbnROb2RlXCIsYyl9LG5leHQ6ZnVuY3Rpb24oYSl7cmV0dXJuIEQoYSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2OmZ1bmN0aW9uKGEpe3JldHVybiBEKGEsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRBbGw6ZnVuY3Rpb24oYSl7cmV0dXJuIG4uZGlyKGEsXCJuZXh0U2libGluZ1wiKX0scHJldkFsbDpmdW5jdGlvbihhKXtyZXR1cm4gbi5kaXIoYSxcInByZXZpb3VzU2libGluZ1wiKX0sbmV4dFVudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5kaXIoYSxcIm5leHRTaWJsaW5nXCIsYyl9LHByZXZVbnRpbDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIG4uZGlyKGEsXCJwcmV2aW91c1NpYmxpbmdcIixjKX0sc2libGluZ3M6ZnVuY3Rpb24oYSl7cmV0dXJuIG4uc2libGluZygoYS5wYXJlbnROb2RlfHx7fSkuZmlyc3RDaGlsZCxhKX0sY2hpbGRyZW46ZnVuY3Rpb24oYSl7cmV0dXJuIG4uc2libGluZyhhLmZpcnN0Q2hpbGQpfSxjb250ZW50czpmdW5jdGlvbihhKXtyZXR1cm4gYS5jb250ZW50RG9jdW1lbnR8fG4ubWVyZ2UoW10sYS5jaGlsZE5vZGVzKX19LGZ1bmN0aW9uKGEsYil7bi5mblthXT1mdW5jdGlvbihjLGQpe3ZhciBlPW4ubWFwKHRoaXMsYixjKTtyZXR1cm5cIlVudGlsXCIhPT1hLnNsaWNlKC01KSYmKGQ9YyksZCYmXCJzdHJpbmdcIj09dHlwZW9mIGQmJihlPW4uZmlsdGVyKGQsZSkpLHRoaXMubGVuZ3RoPjEmJihDW2FdfHxuLnVuaXF1ZShlKSxCLnRlc3QoYSkmJmUucmV2ZXJzZSgpKSx0aGlzLnB1c2hTdGFjayhlKX19KTt2YXIgRT0vXFxTKy9nLEY9e307ZnVuY3Rpb24gRyhhKXt2YXIgYj1GW2FdPXt9O3JldHVybiBuLmVhY2goYS5tYXRjaChFKXx8W10sZnVuY3Rpb24oYSxjKXtiW2NdPSEwfSksYn1uLkNhbGxiYWNrcz1mdW5jdGlvbihhKXthPVwic3RyaW5nXCI9PXR5cGVvZiBhP0ZbYV18fEcoYSk6bi5leHRlbmQoe30sYSk7dmFyIGIsYyxkLGUsZixnLGg9W10saT0hYS5vbmNlJiZbXSxqPWZ1bmN0aW9uKGwpe2ZvcihiPWEubWVtb3J5JiZsLGM9ITAsZz1lfHwwLGU9MCxmPWgubGVuZ3RoLGQ9ITA7aCYmZj5nO2crKylpZihoW2ddLmFwcGx5KGxbMF0sbFsxXSk9PT0hMSYmYS5zdG9wT25GYWxzZSl7Yj0hMTticmVha31kPSExLGgmJihpP2kubGVuZ3RoJiZqKGkuc2hpZnQoKSk6Yj9oPVtdOmsuZGlzYWJsZSgpKX0saz17YWRkOmZ1bmN0aW9uKCl7aWYoaCl7dmFyIGM9aC5sZW5ndGg7IWZ1bmN0aW9uIGcoYil7bi5lYWNoKGIsZnVuY3Rpb24oYixjKXt2YXIgZD1uLnR5cGUoYyk7XCJmdW5jdGlvblwiPT09ZD9hLnVuaXF1ZSYmay5oYXMoYyl8fGgucHVzaChjKTpjJiZjLmxlbmd0aCYmXCJzdHJpbmdcIiE9PWQmJmcoYyl9KX0oYXJndW1lbnRzKSxkP2Y9aC5sZW5ndGg6YiYmKGU9YyxqKGIpKX1yZXR1cm4gdGhpc30scmVtb3ZlOmZ1bmN0aW9uKCl7cmV0dXJuIGgmJm4uZWFjaChhcmd1bWVudHMsZnVuY3Rpb24oYSxiKXt2YXIgYzt3aGlsZSgoYz1uLmluQXJyYXkoYixoLGMpKT4tMSloLnNwbGljZShjLDEpLGQmJihmPj1jJiZmLS0sZz49YyYmZy0tKX0pLHRoaXN9LGhhczpmdW5jdGlvbihhKXtyZXR1cm4gYT9uLmluQXJyYXkoYSxoKT4tMTohKCFofHwhaC5sZW5ndGgpfSxlbXB0eTpmdW5jdGlvbigpe3JldHVybiBoPVtdLGY9MCx0aGlzfSxkaXNhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIGg9aT1iPXZvaWQgMCx0aGlzfSxkaXNhYmxlZDpmdW5jdGlvbigpe3JldHVybiFofSxsb2NrOmZ1bmN0aW9uKCl7cmV0dXJuIGk9dm9pZCAwLGJ8fGsuZGlzYWJsZSgpLHRoaXN9LGxvY2tlZDpmdW5jdGlvbigpe3JldHVybiFpfSxmaXJlV2l0aDpmdW5jdGlvbihhLGIpe3JldHVybiFofHxjJiYhaXx8KGI9Ynx8W10sYj1bYSxiLnNsaWNlP2Iuc2xpY2UoKTpiXSxkP2kucHVzaChiKTpqKGIpKSx0aGlzfSxmaXJlOmZ1bmN0aW9uKCl7cmV0dXJuIGsuZmlyZVdpdGgodGhpcyxhcmd1bWVudHMpLHRoaXN9LGZpcmVkOmZ1bmN0aW9uKCl7cmV0dXJuISFjfX07cmV0dXJuIGt9LG4uZXh0ZW5kKHtEZWZlcnJlZDpmdW5jdGlvbihhKXt2YXIgYj1bW1wicmVzb2x2ZVwiLFwiZG9uZVwiLG4uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZXNvbHZlZFwiXSxbXCJyZWplY3RcIixcImZhaWxcIixuLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLFwicmVqZWN0ZWRcIl0sW1wibm90aWZ5XCIsXCJwcm9ncmVzc1wiLG4uQ2FsbGJhY2tzKFwibWVtb3J5XCIpXV0sYz1cInBlbmRpbmdcIixkPXtzdGF0ZTpmdW5jdGlvbigpe3JldHVybiBjfSxhbHdheXM6ZnVuY3Rpb24oKXtyZXR1cm4gZS5kb25lKGFyZ3VtZW50cykuZmFpbChhcmd1bWVudHMpLHRoaXN9LHRoZW46ZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHM7cmV0dXJuIG4uRGVmZXJyZWQoZnVuY3Rpb24oYyl7bi5lYWNoKGIsZnVuY3Rpb24oYixmKXt2YXIgZz1uLmlzRnVuY3Rpb24oYVtiXSkmJmFbYl07ZVtmWzFdXShmdW5jdGlvbigpe3ZhciBhPWcmJmcuYXBwbHkodGhpcyxhcmd1bWVudHMpO2EmJm4uaXNGdW5jdGlvbihhLnByb21pc2UpP2EucHJvbWlzZSgpLmRvbmUoYy5yZXNvbHZlKS5mYWlsKGMucmVqZWN0KS5wcm9ncmVzcyhjLm5vdGlmeSk6Y1tmWzBdK1wiV2l0aFwiXSh0aGlzPT09ZD9jLnByb21pc2UoKTp0aGlzLGc/W2FdOmFyZ3VtZW50cyl9KX0pLGE9bnVsbH0pLnByb21pc2UoKX0scHJvbWlzZTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YT9uLmV4dGVuZChhLGQpOmR9fSxlPXt9O3JldHVybiBkLnBpcGU9ZC50aGVuLG4uZWFjaChiLGZ1bmN0aW9uKGEsZil7dmFyIGc9ZlsyXSxoPWZbM107ZFtmWzFdXT1nLmFkZCxoJiZnLmFkZChmdW5jdGlvbigpe2M9aH0sYlsxXmFdWzJdLmRpc2FibGUsYlsyXVsyXS5sb2NrKSxlW2ZbMF1dPWZ1bmN0aW9uKCl7cmV0dXJuIGVbZlswXStcIldpdGhcIl0odGhpcz09PWU/ZDp0aGlzLGFyZ3VtZW50cyksdGhpc30sZVtmWzBdK1wiV2l0aFwiXT1nLmZpcmVXaXRofSksZC5wcm9taXNlKGUpLGEmJmEuY2FsbChlLGUpLGV9LHdoZW46ZnVuY3Rpb24oYSl7dmFyIGI9MCxjPWQuY2FsbChhcmd1bWVudHMpLGU9Yy5sZW5ndGgsZj0xIT09ZXx8YSYmbi5pc0Z1bmN0aW9uKGEucHJvbWlzZSk/ZTowLGc9MT09PWY/YTpuLkRlZmVycmVkKCksaD1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGZ1bmN0aW9uKGUpe2JbYV09dGhpcyxjW2FdPWFyZ3VtZW50cy5sZW5ndGg+MT9kLmNhbGwoYXJndW1lbnRzKTplLGM9PT1pP2cubm90aWZ5V2l0aChiLGMpOi0tZnx8Zy5yZXNvbHZlV2l0aChiLGMpfX0saSxqLGs7aWYoZT4xKWZvcihpPW5ldyBBcnJheShlKSxqPW5ldyBBcnJheShlKSxrPW5ldyBBcnJheShlKTtlPmI7YisrKWNbYl0mJm4uaXNGdW5jdGlvbihjW2JdLnByb21pc2UpP2NbYl0ucHJvbWlzZSgpLmRvbmUoaChiLGssYykpLmZhaWwoZy5yZWplY3QpLnByb2dyZXNzKGgoYixqLGkpKTotLWY7cmV0dXJuIGZ8fGcucmVzb2x2ZVdpdGgoayxjKSxnLnByb21pc2UoKX19KTt2YXIgSDtuLmZuLnJlYWR5PWZ1bmN0aW9uKGEpe3JldHVybiBuLnJlYWR5LnByb21pc2UoKS5kb25lKGEpLHRoaXN9LG4uZXh0ZW5kKHtpc1JlYWR5OiExLHJlYWR5V2FpdDoxLGhvbGRSZWFkeTpmdW5jdGlvbihhKXthP24ucmVhZHlXYWl0Kys6bi5yZWFkeSghMCl9LHJlYWR5OmZ1bmN0aW9uKGEpeyhhPT09ITA/LS1uLnJlYWR5V2FpdDpuLmlzUmVhZHkpfHwobi5pc1JlYWR5PSEwLGEhPT0hMCYmLS1uLnJlYWR5V2FpdD4wfHwoSC5yZXNvbHZlV2l0aChsLFtuXSksbi5mbi50cmlnZ2VySGFuZGxlciYmKG4obCkudHJpZ2dlckhhbmRsZXIoXCJyZWFkeVwiKSxuKGwpLm9mZihcInJlYWR5XCIpKSkpfX0pO2Z1bmN0aW9uIEkoKXtsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsSSwhMSksYS5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLEksITEpLG4ucmVhZHkoKX1uLnJlYWR5LnByb21pc2U9ZnVuY3Rpb24oYil7cmV0dXJuIEh8fChIPW4uRGVmZXJyZWQoKSxcImNvbXBsZXRlXCI9PT1sLnJlYWR5U3RhdGU/c2V0VGltZW91dChuLnJlYWR5KToobC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLEksITEpLGEuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixJLCExKSkpLEgucHJvbWlzZShiKX0sbi5yZWFkeS5wcm9taXNlKCk7dmFyIEo9bi5hY2Nlc3M9ZnVuY3Rpb24oYSxiLGMsZCxlLGYsZyl7dmFyIGg9MCxpPWEubGVuZ3RoLGo9bnVsbD09YztpZihcIm9iamVjdFwiPT09bi50eXBlKGMpKXtlPSEwO2ZvcihoIGluIGMpbi5hY2Nlc3MoYSxiLGgsY1toXSwhMCxmLGcpfWVsc2UgaWYodm9pZCAwIT09ZCYmKGU9ITAsbi5pc0Z1bmN0aW9uKGQpfHwoZz0hMCksaiYmKGc/KGIuY2FsbChhLGQpLGI9bnVsbCk6KGo9YixiPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gai5jYWxsKG4oYSksYyl9KSksYikpZm9yKDtpPmg7aCsrKWIoYVtoXSxjLGc/ZDpkLmNhbGwoYVtoXSxoLGIoYVtoXSxjKSkpO3JldHVybiBlP2E6aj9iLmNhbGwoYSk6aT9iKGFbMF0sYyk6Zn07bi5hY2NlcHREYXRhPWZ1bmN0aW9uKGEpe3JldHVybiAxPT09YS5ub2RlVHlwZXx8OT09PWEubm9kZVR5cGV8fCErYS5ub2RlVHlwZX07ZnVuY3Rpb24gSygpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmNhY2hlPXt9LDAse2dldDpmdW5jdGlvbigpe3JldHVybnt9fX0pLHRoaXMuZXhwYW5kbz1uLmV4cGFuZG8rSy51aWQrK31LLnVpZD0xLEsuYWNjZXB0cz1uLmFjY2VwdERhdGEsSy5wcm90b3R5cGU9e2tleTpmdW5jdGlvbihhKXtpZighSy5hY2NlcHRzKGEpKXJldHVybiAwO3ZhciBiPXt9LGM9YVt0aGlzLmV4cGFuZG9dO2lmKCFjKXtjPUsudWlkKys7dHJ5e2JbdGhpcy5leHBhbmRvXT17dmFsdWU6Y30sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYSxiKX1jYXRjaChkKXtiW3RoaXMuZXhwYW5kb109YyxuLmV4dGVuZChhLGIpfX1yZXR1cm4gdGhpcy5jYWNoZVtjXXx8KHRoaXMuY2FjaGVbY109e30pLGN9LHNldDpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZT10aGlzLmtleShhKSxmPXRoaXMuY2FjaGVbZV07aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpZltiXT1jO2Vsc2UgaWYobi5pc0VtcHR5T2JqZWN0KGYpKW4uZXh0ZW5kKHRoaXMuY2FjaGVbZV0sYik7ZWxzZSBmb3IoZCBpbiBiKWZbZF09YltkXTtyZXR1cm4gZn0sZ2V0OmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5jYWNoZVt0aGlzLmtleShhKV07cmV0dXJuIHZvaWQgMD09PWI/YzpjW2JdfSxhY2Nlc3M6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO3JldHVybiB2b2lkIDA9PT1ifHxiJiZcInN0cmluZ1wiPT10eXBlb2YgYiYmdm9pZCAwPT09Yz8oZD10aGlzLmdldChhLGIpLHZvaWQgMCE9PWQ/ZDp0aGlzLmdldChhLG4uY2FtZWxDYXNlKGIpKSk6KHRoaXMuc2V0KGEsYixjKSx2b2lkIDAhPT1jP2M6Yil9LHJlbW92ZTpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmPXRoaXMua2V5KGEpLGc9dGhpcy5jYWNoZVtmXTtpZih2b2lkIDA9PT1iKXRoaXMuY2FjaGVbZl09e307ZWxzZXtuLmlzQXJyYXkoYik/ZD1iLmNvbmNhdChiLm1hcChuLmNhbWVsQ2FzZSkpOihlPW4uY2FtZWxDYXNlKGIpLGIgaW4gZz9kPVtiLGVdOihkPWUsZD1kIGluIGc/W2RdOmQubWF0Y2goRSl8fFtdKSksYz1kLmxlbmd0aDt3aGlsZShjLS0pZGVsZXRlIGdbZFtjXV19fSxoYXNEYXRhOmZ1bmN0aW9uKGEpe3JldHVybiFuLmlzRW1wdHlPYmplY3QodGhpcy5jYWNoZVthW3RoaXMuZXhwYW5kb11dfHx7fSl9LGRpc2NhcmQ6ZnVuY3Rpb24oYSl7YVt0aGlzLmV4cGFuZG9dJiZkZWxldGUgdGhpcy5jYWNoZVthW3RoaXMuZXhwYW5kb11dfX07dmFyIEw9bmV3IEssTT1uZXcgSyxOPS9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLyxPPS8oW0EtWl0pL2c7ZnVuY3Rpb24gUChhLGIsYyl7dmFyIGQ7aWYodm9pZCAwPT09YyYmMT09PWEubm9kZVR5cGUpaWYoZD1cImRhdGEtXCIrYi5yZXBsYWNlKE8sXCItJDFcIikudG9Mb3dlckNhc2UoKSxjPWEuZ2V0QXR0cmlidXRlKGQpLFwic3RyaW5nXCI9PXR5cGVvZiBjKXt0cnl7Yz1cInRydWVcIj09PWM/ITA6XCJmYWxzZVwiPT09Yz8hMTpcIm51bGxcIj09PWM/bnVsbDorYytcIlwiPT09Yz8rYzpOLnRlc3QoYyk/bi5wYXJzZUpTT04oYyk6Y31jYXRjaChlKXt9TS5zZXQoYSxiLGMpfWVsc2UgYz12b2lkIDA7cmV0dXJuIGN9bi5leHRlbmQoe2hhc0RhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuIE0uaGFzRGF0YShhKXx8TC5oYXNEYXRhKGEpfSxkYXRhOmZ1bmN0aW9uKGEsYixjKXtcbnJldHVybiBNLmFjY2VzcyhhLGIsYyl9LHJlbW92ZURhdGE6ZnVuY3Rpb24oYSxiKXtNLnJlbW92ZShhLGIpfSxfZGF0YTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIEwuYWNjZXNzKGEsYixjKX0sX3JlbW92ZURhdGE6ZnVuY3Rpb24oYSxiKXtMLnJlbW92ZShhLGIpfX0pLG4uZm4uZXh0ZW5kKHtkYXRhOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpc1swXSxnPWYmJmYuYXR0cmlidXRlcztpZih2b2lkIDA9PT1hKXtpZih0aGlzLmxlbmd0aCYmKGU9TS5nZXQoZiksMT09PWYubm9kZVR5cGUmJiFMLmdldChmLFwiaGFzRGF0YUF0dHJzXCIpKSl7Yz1nLmxlbmd0aDt3aGlsZShjLS0pZ1tjXSYmKGQ9Z1tjXS5uYW1lLDA9PT1kLmluZGV4T2YoXCJkYXRhLVwiKSYmKGQ9bi5jYW1lbENhc2UoZC5zbGljZSg1KSksUChmLGQsZVtkXSkpKTtMLnNldChmLFwiaGFzRGF0YUF0dHJzXCIsITApfXJldHVybiBlfXJldHVyblwib2JqZWN0XCI9PXR5cGVvZiBhP3RoaXMuZWFjaChmdW5jdGlvbigpe00uc2V0KHRoaXMsYSl9KTpKKHRoaXMsZnVuY3Rpb24oYil7dmFyIGMsZD1uLmNhbWVsQ2FzZShhKTtpZihmJiZ2b2lkIDA9PT1iKXtpZihjPU0uZ2V0KGYsYSksdm9pZCAwIT09YylyZXR1cm4gYztpZihjPU0uZ2V0KGYsZCksdm9pZCAwIT09YylyZXR1cm4gYztpZihjPVAoZixkLHZvaWQgMCksdm9pZCAwIT09YylyZXR1cm4gY31lbHNlIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBjPU0uZ2V0KHRoaXMsZCk7TS5zZXQodGhpcyxkLGIpLC0xIT09YS5pbmRleE9mKFwiLVwiKSYmdm9pZCAwIT09YyYmTS5zZXQodGhpcyxhLGIpfSl9LG51bGwsYixhcmd1bWVudHMubGVuZ3RoPjEsbnVsbCwhMCl9LHJlbW92ZURhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe00ucmVtb3ZlKHRoaXMsYSl9KX19KSxuLmV4dGVuZCh7cXVldWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO3JldHVybiBhPyhiPShifHxcImZ4XCIpK1wicXVldWVcIixkPUwuZ2V0KGEsYiksYyYmKCFkfHxuLmlzQXJyYXkoYyk/ZD1MLmFjY2VzcyhhLGIsbi5tYWtlQXJyYXkoYykpOmQucHVzaChjKSksZHx8W10pOnZvaWQgMH0sZGVxdWV1ZTpmdW5jdGlvbihhLGIpe2I9Ynx8XCJmeFwiO3ZhciBjPW4ucXVldWUoYSxiKSxkPWMubGVuZ3RoLGU9Yy5zaGlmdCgpLGY9bi5fcXVldWVIb29rcyhhLGIpLGc9ZnVuY3Rpb24oKXtuLmRlcXVldWUoYSxiKX07XCJpbnByb2dyZXNzXCI9PT1lJiYoZT1jLnNoaWZ0KCksZC0tKSxlJiYoXCJmeFwiPT09YiYmYy51bnNoaWZ0KFwiaW5wcm9ncmVzc1wiKSxkZWxldGUgZi5zdG9wLGUuY2FsbChhLGcsZikpLCFkJiZmJiZmLmVtcHR5LmZpcmUoKX0sX3F1ZXVlSG9va3M6ZnVuY3Rpb24oYSxiKXt2YXIgYz1iK1wicXVldWVIb29rc1wiO3JldHVybiBMLmdldChhLGMpfHxMLmFjY2VzcyhhLGMse2VtcHR5Om4uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIikuYWRkKGZ1bmN0aW9uKCl7TC5yZW1vdmUoYSxbYitcInF1ZXVlXCIsY10pfSl9KX19KSxuLmZuLmV4dGVuZCh7cXVldWU6ZnVuY3Rpb24oYSxiKXt2YXIgYz0yO3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiBhJiYoYj1hLGE9XCJmeFwiLGMtLSksYXJndW1lbnRzLmxlbmd0aDxjP24ucXVldWUodGhpc1swXSxhKTp2b2lkIDA9PT1iP3RoaXM6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9bi5xdWV1ZSh0aGlzLGEsYik7bi5fcXVldWVIb29rcyh0aGlzLGEpLFwiZnhcIj09PWEmJlwiaW5wcm9ncmVzc1wiIT09Y1swXSYmbi5kZXF1ZXVlKHRoaXMsYSl9KX0sZGVxdWV1ZTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7bi5kZXF1ZXVlKHRoaXMsYSl9KX0sY2xlYXJRdWV1ZTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5xdWV1ZShhfHxcImZ4XCIsW10pfSxwcm9taXNlOmZ1bmN0aW9uKGEsYil7dmFyIGMsZD0xLGU9bi5EZWZlcnJlZCgpLGY9dGhpcyxnPXRoaXMubGVuZ3RoLGg9ZnVuY3Rpb24oKXstLWR8fGUucmVzb2x2ZVdpdGgoZixbZl0pfTtcInN0cmluZ1wiIT10eXBlb2YgYSYmKGI9YSxhPXZvaWQgMCksYT1hfHxcImZ4XCI7d2hpbGUoZy0tKWM9TC5nZXQoZltnXSxhK1wicXVldWVIb29rc1wiKSxjJiZjLmVtcHR5JiYoZCsrLGMuZW1wdHkuYWRkKGgpKTtyZXR1cm4gaCgpLGUucHJvbWlzZShiKX19KTt2YXIgUT0vWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpLy5zb3VyY2UsUj1bXCJUb3BcIixcIlJpZ2h0XCIsXCJCb3R0b21cIixcIkxlZnRcIl0sUz1mdW5jdGlvbihhLGIpe3JldHVybiBhPWJ8fGEsXCJub25lXCI9PT1uLmNzcyhhLFwiZGlzcGxheVwiKXx8IW4uY29udGFpbnMoYS5vd25lckRvY3VtZW50LGEpfSxUPS9eKD86Y2hlY2tib3h8cmFkaW8pJC9pOyFmdW5jdGlvbigpe3ZhciBhPWwuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGI9YS5hcHBlbmRDaGlsZChsLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLGM9bC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7Yy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJyYWRpb1wiKSxjLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIixcImNoZWNrZWRcIiksYy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJ0XCIpLGIuYXBwZW5kQ2hpbGQoYyksay5jaGVja0Nsb25lPWIuY2xvbmVOb2RlKCEwKS5jbG9uZU5vZGUoITApLmxhc3RDaGlsZC5jaGVja2VkLGIuaW5uZXJIVE1MPVwiPHRleHRhcmVhPng8L3RleHRhcmVhPlwiLGsubm9DbG9uZUNoZWNrZWQ9ISFiLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZX0oKTt2YXIgVT1cInVuZGVmaW5lZFwiO2suZm9jdXNpbkJ1YmJsZXM9XCJvbmZvY3VzaW5cImluIGE7dmFyIFY9L15rZXkvLFc9L14oPzptb3VzZXxwb2ludGVyfGNvbnRleHRtZW51KXxjbGljay8sWD0vXig/OmZvY3VzaW5mb2N1c3xmb2N1c291dGJsdXIpJC8sWT0vXihbXi5dKikoPzpcXC4oLispfCkkLztmdW5jdGlvbiBaKCl7cmV0dXJuITB9ZnVuY3Rpb24gJCgpe3JldHVybiExfWZ1bmN0aW9uIF8oKXt0cnl7cmV0dXJuIGwuYWN0aXZlRWxlbWVudH1jYXRjaChhKXt9fW4uZXZlbnQ9e2dsb2JhbDp7fSxhZGQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnLGgsaSxqLGssbCxtLG8scCxxLHI9TC5nZXQoYSk7aWYocil7Yy5oYW5kbGVyJiYoZj1jLGM9Zi5oYW5kbGVyLGU9Zi5zZWxlY3RvciksYy5ndWlkfHwoYy5ndWlkPW4uZ3VpZCsrKSwoaT1yLmV2ZW50cyl8fChpPXIuZXZlbnRzPXt9KSwoZz1yLmhhbmRsZSl8fChnPXIuaGFuZGxlPWZ1bmN0aW9uKGIpe3JldHVybiB0eXBlb2YgbiE9PVUmJm4uZXZlbnQudHJpZ2dlcmVkIT09Yi50eXBlP24uZXZlbnQuZGlzcGF0Y2guYXBwbHkoYSxhcmd1bWVudHMpOnZvaWQgMH0pLGI9KGJ8fFwiXCIpLm1hdGNoKEUpfHxbXCJcIl0saj1iLmxlbmd0aDt3aGlsZShqLS0paD1ZLmV4ZWMoYltqXSl8fFtdLG89cT1oWzFdLHA9KGhbMl18fFwiXCIpLnNwbGl0KFwiLlwiKS5zb3J0KCksbyYmKGw9bi5ldmVudC5zcGVjaWFsW29dfHx7fSxvPShlP2wuZGVsZWdhdGVUeXBlOmwuYmluZFR5cGUpfHxvLGw9bi5ldmVudC5zcGVjaWFsW29dfHx7fSxrPW4uZXh0ZW5kKHt0eXBlOm8sb3JpZ1R5cGU6cSxkYXRhOmQsaGFuZGxlcjpjLGd1aWQ6Yy5ndWlkLHNlbGVjdG9yOmUsbmVlZHNDb250ZXh0OmUmJm4uZXhwci5tYXRjaC5uZWVkc0NvbnRleHQudGVzdChlKSxuYW1lc3BhY2U6cC5qb2luKFwiLlwiKX0sZiksKG09aVtvXSl8fChtPWlbb109W10sbS5kZWxlZ2F0ZUNvdW50PTAsbC5zZXR1cCYmbC5zZXR1cC5jYWxsKGEsZCxwLGcpIT09ITF8fGEuYWRkRXZlbnRMaXN0ZW5lciYmYS5hZGRFdmVudExpc3RlbmVyKG8sZywhMSkpLGwuYWRkJiYobC5hZGQuY2FsbChhLGspLGsuaGFuZGxlci5ndWlkfHwoay5oYW5kbGVyLmd1aWQ9Yy5ndWlkKSksZT9tLnNwbGljZShtLmRlbGVnYXRlQ291bnQrKywwLGspOm0ucHVzaChrKSxuLmV2ZW50Lmdsb2JhbFtvXT0hMCl9fSxyZW1vdmU6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnLGgsaSxqLGssbCxtLG8scCxxLHI9TC5oYXNEYXRhKGEpJiZMLmdldChhKTtpZihyJiYoaT1yLmV2ZW50cykpe2I9KGJ8fFwiXCIpLm1hdGNoKEUpfHxbXCJcIl0saj1iLmxlbmd0aDt3aGlsZShqLS0paWYoaD1ZLmV4ZWMoYltqXSl8fFtdLG89cT1oWzFdLHA9KGhbMl18fFwiXCIpLnNwbGl0KFwiLlwiKS5zb3J0KCksbyl7bD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LG89KGQ/bC5kZWxlZ2F0ZVR5cGU6bC5iaW5kVHlwZSl8fG8sbT1pW29dfHxbXSxoPWhbMl0mJm5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIitwLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKSxnPWY9bS5sZW5ndGg7d2hpbGUoZi0tKWs9bVtmXSwhZSYmcSE9PWsub3JpZ1R5cGV8fGMmJmMuZ3VpZCE9PWsuZ3VpZHx8aCYmIWgudGVzdChrLm5hbWVzcGFjZSl8fGQmJmQhPT1rLnNlbGVjdG9yJiYoXCIqKlwiIT09ZHx8IWsuc2VsZWN0b3IpfHwobS5zcGxpY2UoZiwxKSxrLnNlbGVjdG9yJiZtLmRlbGVnYXRlQ291bnQtLSxsLnJlbW92ZSYmbC5yZW1vdmUuY2FsbChhLGspKTtnJiYhbS5sZW5ndGgmJihsLnRlYXJkb3duJiZsLnRlYXJkb3duLmNhbGwoYSxwLHIuaGFuZGxlKSE9PSExfHxuLnJlbW92ZUV2ZW50KGEsbyxyLmhhbmRsZSksZGVsZXRlIGlbb10pfWVsc2UgZm9yKG8gaW4gaSluLmV2ZW50LnJlbW92ZShhLG8rYltqXSxjLGQsITApO24uaXNFbXB0eU9iamVjdChpKSYmKGRlbGV0ZSByLmhhbmRsZSxMLnJlbW92ZShhLFwiZXZlbnRzXCIpKX19LHRyaWdnZXI6ZnVuY3Rpb24oYixjLGQsZSl7dmFyIGYsZyxoLGksayxtLG8scD1bZHx8bF0scT1qLmNhbGwoYixcInR5cGVcIik/Yi50eXBlOmIscj1qLmNhbGwoYixcIm5hbWVzcGFjZVwiKT9iLm5hbWVzcGFjZS5zcGxpdChcIi5cIik6W107aWYoZz1oPWQ9ZHx8bCwzIT09ZC5ub2RlVHlwZSYmOCE9PWQubm9kZVR5cGUmJiFYLnRlc3QocStuLmV2ZW50LnRyaWdnZXJlZCkmJihxLmluZGV4T2YoXCIuXCIpPj0wJiYocj1xLnNwbGl0KFwiLlwiKSxxPXIuc2hpZnQoKSxyLnNvcnQoKSksaz1xLmluZGV4T2YoXCI6XCIpPDAmJlwib25cIitxLGI9YltuLmV4cGFuZG9dP2I6bmV3IG4uRXZlbnQocSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYiksYi5pc1RyaWdnZXI9ZT8yOjMsYi5uYW1lc3BhY2U9ci5qb2luKFwiLlwiKSxiLm5hbWVzcGFjZV9yZT1iLm5hbWVzcGFjZT9uZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIrci5qb2luKFwiXFxcXC4oPzouKlxcXFwufClcIikrXCIoXFxcXC58JClcIik6bnVsbCxiLnJlc3VsdD12b2lkIDAsYi50YXJnZXR8fChiLnRhcmdldD1kKSxjPW51bGw9PWM/W2JdOm4ubWFrZUFycmF5KGMsW2JdKSxvPW4uZXZlbnQuc3BlY2lhbFtxXXx8e30sZXx8IW8udHJpZ2dlcnx8by50cmlnZ2VyLmFwcGx5KGQsYykhPT0hMSkpe2lmKCFlJiYhby5ub0J1YmJsZSYmIW4uaXNXaW5kb3coZCkpe2ZvcihpPW8uZGVsZWdhdGVUeXBlfHxxLFgudGVzdChpK3EpfHwoZz1nLnBhcmVudE5vZGUpO2c7Zz1nLnBhcmVudE5vZGUpcC5wdXNoKGcpLGg9ZztoPT09KGQub3duZXJEb2N1bWVudHx8bCkmJnAucHVzaChoLmRlZmF1bHRWaWV3fHxoLnBhcmVudFdpbmRvd3x8YSl9Zj0wO3doaWxlKChnPXBbZisrXSkmJiFiLmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpYi50eXBlPWY+MT9pOm8uYmluZFR5cGV8fHEsbT0oTC5nZXQoZyxcImV2ZW50c1wiKXx8e30pW2IudHlwZV0mJkwuZ2V0KGcsXCJoYW5kbGVcIiksbSYmbS5hcHBseShnLGMpLG09ayYmZ1trXSxtJiZtLmFwcGx5JiZuLmFjY2VwdERhdGEoZykmJihiLnJlc3VsdD1tLmFwcGx5KGcsYyksYi5yZXN1bHQ9PT0hMSYmYi5wcmV2ZW50RGVmYXVsdCgpKTtyZXR1cm4gYi50eXBlPXEsZXx8Yi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8by5fZGVmYXVsdCYmby5fZGVmYXVsdC5hcHBseShwLnBvcCgpLGMpIT09ITF8fCFuLmFjY2VwdERhdGEoZCl8fGsmJm4uaXNGdW5jdGlvbihkW3FdKSYmIW4uaXNXaW5kb3coZCkmJihoPWRba10saCYmKGRba109bnVsbCksbi5ldmVudC50cmlnZ2VyZWQ9cSxkW3FdKCksbi5ldmVudC50cmlnZ2VyZWQ9dm9pZCAwLGgmJihkW2tdPWgpKSxiLnJlc3VsdH19LGRpc3BhdGNoOmZ1bmN0aW9uKGEpe2E9bi5ldmVudC5maXgoYSk7dmFyIGIsYyxlLGYsZyxoPVtdLGk9ZC5jYWxsKGFyZ3VtZW50cyksaj0oTC5nZXQodGhpcyxcImV2ZW50c1wiKXx8e30pW2EudHlwZV18fFtdLGs9bi5ldmVudC5zcGVjaWFsW2EudHlwZV18fHt9O2lmKGlbMF09YSxhLmRlbGVnYXRlVGFyZ2V0PXRoaXMsIWsucHJlRGlzcGF0Y2h8fGsucHJlRGlzcGF0Y2guY2FsbCh0aGlzLGEpIT09ITEpe2g9bi5ldmVudC5oYW5kbGVycy5jYWxsKHRoaXMsYSxqKSxiPTA7d2hpbGUoKGY9aFtiKytdKSYmIWEuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSl7YS5jdXJyZW50VGFyZ2V0PWYuZWxlbSxjPTA7d2hpbGUoKGc9Zi5oYW5kbGVyc1tjKytdKSYmIWEuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKSkoIWEubmFtZXNwYWNlX3JlfHxhLm5hbWVzcGFjZV9yZS50ZXN0KGcubmFtZXNwYWNlKSkmJihhLmhhbmRsZU9iaj1nLGEuZGF0YT1nLmRhdGEsZT0oKG4uZXZlbnQuc3BlY2lhbFtnLm9yaWdUeXBlXXx8e30pLmhhbmRsZXx8Zy5oYW5kbGVyKS5hcHBseShmLmVsZW0saSksdm9pZCAwIT09ZSYmKGEucmVzdWx0PWUpPT09ITEmJihhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSkpfXJldHVybiBrLnBvc3REaXNwYXRjaCYmay5wb3N0RGlzcGF0Y2guY2FsbCh0aGlzLGEpLGEucmVzdWx0fX0saGFuZGxlcnM6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnPVtdLGg9Yi5kZWxlZ2F0ZUNvdW50LGk9YS50YXJnZXQ7aWYoaCYmaS5ub2RlVHlwZSYmKCFhLmJ1dHRvbnx8XCJjbGlja1wiIT09YS50eXBlKSlmb3IoO2khPT10aGlzO2k9aS5wYXJlbnROb2RlfHx0aGlzKWlmKGkuZGlzYWJsZWQhPT0hMHx8XCJjbGlja1wiIT09YS50eXBlKXtmb3IoZD1bXSxjPTA7aD5jO2MrKylmPWJbY10sZT1mLnNlbGVjdG9yK1wiIFwiLHZvaWQgMD09PWRbZV0mJihkW2VdPWYubmVlZHNDb250ZXh0P24oZSx0aGlzKS5pbmRleChpKT49MDpuLmZpbmQoZSx0aGlzLG51bGwsW2ldKS5sZW5ndGgpLGRbZV0mJmQucHVzaChmKTtkLmxlbmd0aCYmZy5wdXNoKHtlbGVtOmksaGFuZGxlcnM6ZH0pfXJldHVybiBoPGIubGVuZ3RoJiZnLnB1c2goe2VsZW06dGhpcyxoYW5kbGVyczpiLnNsaWNlKGgpfSksZ30scHJvcHM6XCJhbHRLZXkgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCBldmVudFBoYXNlIG1ldGFLZXkgcmVsYXRlZFRhcmdldCBzaGlmdEtleSB0YXJnZXQgdGltZVN0YW1wIHZpZXcgd2hpY2hcIi5zcGxpdChcIiBcIiksZml4SG9va3M6e30sa2V5SG9va3M6e3Byb3BzOlwiY2hhciBjaGFyQ29kZSBrZXkga2V5Q29kZVwiLnNwbGl0KFwiIFwiKSxmaWx0ZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbnVsbD09YS53aGljaCYmKGEud2hpY2g9bnVsbCE9Yi5jaGFyQ29kZT9iLmNoYXJDb2RlOmIua2V5Q29kZSksYX19LG1vdXNlSG9va3M6e3Byb3BzOlwiYnV0dG9uIGJ1dHRvbnMgY2xpZW50WCBjbGllbnRZIG9mZnNldFggb2Zmc2V0WSBwYWdlWCBwYWdlWSBzY3JlZW5YIHNjcmVlblkgdG9FbGVtZW50XCIuc3BsaXQoXCIgXCIpLGZpbHRlcjpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmPWIuYnV0dG9uO3JldHVybiBudWxsPT1hLnBhZ2VYJiZudWxsIT1iLmNsaWVudFgmJihjPWEudGFyZ2V0Lm93bmVyRG9jdW1lbnR8fGwsZD1jLmRvY3VtZW50RWxlbWVudCxlPWMuYm9keSxhLnBhZ2VYPWIuY2xpZW50WCsoZCYmZC5zY3JvbGxMZWZ0fHxlJiZlLnNjcm9sbExlZnR8fDApLShkJiZkLmNsaWVudExlZnR8fGUmJmUuY2xpZW50TGVmdHx8MCksYS5wYWdlWT1iLmNsaWVudFkrKGQmJmQuc2Nyb2xsVG9wfHxlJiZlLnNjcm9sbFRvcHx8MCktKGQmJmQuY2xpZW50VG9wfHxlJiZlLmNsaWVudFRvcHx8MCkpLGEud2hpY2h8fHZvaWQgMD09PWZ8fChhLndoaWNoPTEmZj8xOjImZj8zOjQmZj8yOjApLGF9fSxmaXg6ZnVuY3Rpb24oYSl7aWYoYVtuLmV4cGFuZG9dKXJldHVybiBhO3ZhciBiLGMsZCxlPWEudHlwZSxmPWEsZz10aGlzLmZpeEhvb2tzW2VdO2d8fCh0aGlzLmZpeEhvb2tzW2VdPWc9Vy50ZXN0KGUpP3RoaXMubW91c2VIb29rczpWLnRlc3QoZSk/dGhpcy5rZXlIb29rczp7fSksZD1nLnByb3BzP3RoaXMucHJvcHMuY29uY2F0KGcucHJvcHMpOnRoaXMucHJvcHMsYT1uZXcgbi5FdmVudChmKSxiPWQubGVuZ3RoO3doaWxlKGItLSljPWRbYl0sYVtjXT1mW2NdO3JldHVybiBhLnRhcmdldHx8KGEudGFyZ2V0PWwpLDM9PT1hLnRhcmdldC5ub2RlVHlwZSYmKGEudGFyZ2V0PWEudGFyZ2V0LnBhcmVudE5vZGUpLGcuZmlsdGVyP2cuZmlsdGVyKGEsZik6YX0sc3BlY2lhbDp7bG9hZDp7bm9CdWJibGU6ITB9LGZvY3VzOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMhPT1fKCkmJnRoaXMuZm9jdXM/KHRoaXMuZm9jdXMoKSwhMSk6dm9pZCAwfSxkZWxlZ2F0ZVR5cGU6XCJmb2N1c2luXCJ9LGJsdXI6e3RyaWdnZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcz09PV8oKSYmdGhpcy5ibHVyPyh0aGlzLmJsdXIoKSwhMSk6dm9pZCAwfSxkZWxlZ2F0ZVR5cGU6XCJmb2N1c291dFwifSxjbGljazp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVyblwiY2hlY2tib3hcIj09PXRoaXMudHlwZSYmdGhpcy5jbGljayYmbi5ub2RlTmFtZSh0aGlzLFwiaW5wdXRcIik/KHRoaXMuY2xpY2soKSwhMSk6dm9pZCAwfSxfZGVmYXVsdDpmdW5jdGlvbihhKXtyZXR1cm4gbi5ub2RlTmFtZShhLnRhcmdldCxcImFcIil9fSxiZWZvcmV1bmxvYWQ6e3Bvc3REaXNwYXRjaDpmdW5jdGlvbihhKXt2b2lkIDAhPT1hLnJlc3VsdCYmYS5vcmlnaW5hbEV2ZW50JiYoYS5vcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlPWEucmVzdWx0KX19fSxzaW11bGF0ZTpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1uLmV4dGVuZChuZXcgbi5FdmVudCxjLHt0eXBlOmEsaXNTaW11bGF0ZWQ6ITAsb3JpZ2luYWxFdmVudDp7fX0pO2Q/bi5ldmVudC50cmlnZ2VyKGUsbnVsbCxiKTpuLmV2ZW50LmRpc3BhdGNoLmNhbGwoYixlKSxlLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZjLnByZXZlbnREZWZhdWx0KCl9fSxuLnJlbW92ZUV2ZW50PWZ1bmN0aW9uKGEsYixjKXthLnJlbW92ZUV2ZW50TGlzdGVuZXImJmEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfSxuLkV2ZW50PWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBuLkV2ZW50PyhhJiZhLnR5cGU/KHRoaXMub3JpZ2luYWxFdmVudD1hLHRoaXMudHlwZT1hLnR5cGUsdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9YS5kZWZhdWx0UHJldmVudGVkfHx2b2lkIDA9PT1hLmRlZmF1bHRQcmV2ZW50ZWQmJmEucmV0dXJuVmFsdWU9PT0hMT9aOiQpOnRoaXMudHlwZT1hLGImJm4uZXh0ZW5kKHRoaXMsYiksdGhpcy50aW1lU3RhbXA9YSYmYS50aW1lU3RhbXB8fG4ubm93KCksdm9pZCh0aGlzW24uZXhwYW5kb109ITApKTpuZXcgbi5FdmVudChhLGIpfSxuLkV2ZW50LnByb3RvdHlwZT17aXNEZWZhdWx0UHJldmVudGVkOiQsaXNQcm9wYWdhdGlvblN0b3BwZWQ6JCxpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDokLHByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNEZWZhdWx0UHJldmVudGVkPVosYSYmYS5wcmV2ZW50RGVmYXVsdCYmYS5wcmV2ZW50RGVmYXVsdCgpfSxzdG9wUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9yaWdpbmFsRXZlbnQ7dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1aLGEmJmEuc3RvcFByb3BhZ2F0aW9uJiZhLnN0b3BQcm9wYWdhdGlvbigpfSxzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9yaWdpbmFsRXZlbnQ7dGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZD1aLGEmJmEuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uJiZhLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLHRoaXMuc3RvcFByb3BhZ2F0aW9uKCl9fSxuLmVhY2goe21vdXNlZW50ZXI6XCJtb3VzZW92ZXJcIixtb3VzZWxlYXZlOlwibW91c2VvdXRcIixwb2ludGVyZW50ZXI6XCJwb2ludGVyb3ZlclwiLHBvaW50ZXJsZWF2ZTpcInBvaW50ZXJvdXRcIn0sZnVuY3Rpb24oYSxiKXtuLmV2ZW50LnNwZWNpYWxbYV09e2RlbGVnYXRlVHlwZTpiLGJpbmRUeXBlOmIsaGFuZGxlOmZ1bmN0aW9uKGEpe3ZhciBjLGQ9dGhpcyxlPWEucmVsYXRlZFRhcmdldCxmPWEuaGFuZGxlT2JqO3JldHVybighZXx8ZSE9PWQmJiFuLmNvbnRhaW5zKGQsZSkpJiYoYS50eXBlPWYub3JpZ1R5cGUsYz1mLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpLGEudHlwZT1iKSxjfX19KSxrLmZvY3VzaW5CdWJibGVzfHxuLmVhY2goe2ZvY3VzOlwiZm9jdXNpblwiLGJsdXI6XCJmb2N1c291dFwifSxmdW5jdGlvbihhLGIpe3ZhciBjPWZ1bmN0aW9uKGEpe24uZXZlbnQuc2ltdWxhdGUoYixhLnRhcmdldCxuLmV2ZW50LmZpeChhKSwhMCl9O24uZXZlbnQuc3BlY2lhbFtiXT17c2V0dXA6ZnVuY3Rpb24oKXt2YXIgZD10aGlzLm93bmVyRG9jdW1lbnR8fHRoaXMsZT1MLmFjY2VzcyhkLGIpO2V8fGQuYWRkRXZlbnRMaXN0ZW5lcihhLGMsITApLEwuYWNjZXNzKGQsYiwoZXx8MCkrMSl9LHRlYXJkb3duOmZ1bmN0aW9uKCl7dmFyIGQ9dGhpcy5vd25lckRvY3VtZW50fHx0aGlzLGU9TC5hY2Nlc3MoZCxiKS0xO2U/TC5hY2Nlc3MoZCxiLGUpOihkLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSxjLCEwKSxMLnJlbW92ZShkLGIpKX19fSksbi5mbi5leHRlbmQoe29uOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGYsZztpZihcIm9iamVjdFwiPT10eXBlb2YgYSl7XCJzdHJpbmdcIiE9dHlwZW9mIGImJihjPWN8fGIsYj12b2lkIDApO2ZvcihnIGluIGEpdGhpcy5vbihnLGIsYyxhW2ddLGUpO3JldHVybiB0aGlzfWlmKG51bGw9PWMmJm51bGw9PWQ/KGQ9YixjPWI9dm9pZCAwKTpudWxsPT1kJiYoXCJzdHJpbmdcIj09dHlwZW9mIGI/KGQ9YyxjPXZvaWQgMCk6KGQ9YyxjPWIsYj12b2lkIDApKSxkPT09ITEpZD0kO2Vsc2UgaWYoIWQpcmV0dXJuIHRoaXM7cmV0dXJuIDE9PT1lJiYoZj1kLGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIG4oKS5vZmYoYSksZi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGQuZ3VpZD1mLmd1aWR8fChmLmd1aWQ9bi5ndWlkKyspKSx0aGlzLmVhY2goZnVuY3Rpb24oKXtuLmV2ZW50LmFkZCh0aGlzLGEsZCxjLGIpfSl9LG9uZTpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gdGhpcy5vbihhLGIsYyxkLDEpfSxvZmY6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU7aWYoYSYmYS5wcmV2ZW50RGVmYXVsdCYmYS5oYW5kbGVPYmopcmV0dXJuIGQ9YS5oYW5kbGVPYmosbihhLmRlbGVnYXRlVGFyZ2V0KS5vZmYoZC5uYW1lc3BhY2U/ZC5vcmlnVHlwZStcIi5cIitkLm5hbWVzcGFjZTpkLm9yaWdUeXBlLGQuc2VsZWN0b3IsZC5oYW5kbGVyKSx0aGlzO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBhKXtmb3IoZSBpbiBhKXRoaXMub2ZmKGUsYixhW2VdKTtyZXR1cm4gdGhpc31yZXR1cm4oYj09PSExfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBiKSYmKGM9YixiPXZvaWQgMCksYz09PSExJiYoYz0kKSx0aGlzLmVhY2goZnVuY3Rpb24oKXtuLmV2ZW50LnJlbW92ZSh0aGlzLGEsYyxiKX0pfSx0cmlnZ2VyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe24uZXZlbnQudHJpZ2dlcihhLGIsdGhpcyl9KX0sdHJpZ2dlckhhbmRsZXI6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzWzBdO3JldHVybiBjP24uZXZlbnQudHJpZ2dlcihhLGIsYywhMCk6dm9pZCAwfX0pO3ZhciBhYT0vPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vZ2ksYmE9LzwoW1xcdzpdKykvLGNhPS88fCYjP1xcdys7LyxkYT0vPCg/OnNjcmlwdHxzdHlsZXxsaW5rKS9pLGVhPS9jaGVja2VkXFxzKig/OltePV18PVxccyouY2hlY2tlZC4pL2ksZmE9L14kfFxcLyg/OmphdmF8ZWNtYSlzY3JpcHQvaSxnYT0vXnRydWVcXC8oLiopLyxoYT0vXlxccyo8ISg/OlxcW0NEQVRBXFxbfC0tKXwoPzpcXF1cXF18LS0pPlxccyokL2csaWE9e29wdGlvbjpbMSxcIjxzZWxlY3QgbXVsdGlwbGU9J211bHRpcGxlJz5cIixcIjwvc2VsZWN0PlwiXSx0aGVhZDpbMSxcIjx0YWJsZT5cIixcIjwvdGFibGU+XCJdLGNvbDpbMixcIjx0YWJsZT48Y29sZ3JvdXA+XCIsXCI8L2NvbGdyb3VwPjwvdGFibGU+XCJdLHRyOlsyLFwiPHRhYmxlPjx0Ym9keT5cIixcIjwvdGJvZHk+PC90YWJsZT5cIl0sdGQ6WzMsXCI8dGFibGU+PHRib2R5Pjx0cj5cIixcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiXSxfZGVmYXVsdDpbMCxcIlwiLFwiXCJdfTtpYS5vcHRncm91cD1pYS5vcHRpb24saWEudGJvZHk9aWEudGZvb3Q9aWEuY29sZ3JvdXA9aWEuY2FwdGlvbj1pYS50aGVhZCxpYS50aD1pYS50ZDtmdW5jdGlvbiBqYShhLGIpe3JldHVybiBuLm5vZGVOYW1lKGEsXCJ0YWJsZVwiKSYmbi5ub2RlTmFtZSgxMSE9PWIubm9kZVR5cGU/YjpiLmZpcnN0Q2hpbGQsXCJ0clwiKT9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF18fGEuYXBwZW5kQ2hpbGQoYS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKSk6YX1mdW5jdGlvbiBrYShhKXtyZXR1cm4gYS50eXBlPShudWxsIT09YS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKStcIi9cIithLnR5cGUsYX1mdW5jdGlvbiBsYShhKXt2YXIgYj1nYS5leGVjKGEudHlwZSk7cmV0dXJuIGI/YS50eXBlPWJbMV06YS5yZW1vdmVBdHRyaWJ1dGUoXCJ0eXBlXCIpLGF9ZnVuY3Rpb24gbWEoYSxiKXtmb3IodmFyIGM9MCxkPWEubGVuZ3RoO2Q+YztjKyspTC5zZXQoYVtjXSxcImdsb2JhbEV2YWxcIiwhYnx8TC5nZXQoYltjXSxcImdsb2JhbEV2YWxcIikpfWZ1bmN0aW9uIG5hKGEsYil7dmFyIGMsZCxlLGYsZyxoLGksajtpZigxPT09Yi5ub2RlVHlwZSl7aWYoTC5oYXNEYXRhKGEpJiYoZj1MLmFjY2VzcyhhKSxnPUwuc2V0KGIsZiksaj1mLmV2ZW50cykpe2RlbGV0ZSBnLmhhbmRsZSxnLmV2ZW50cz17fTtmb3IoZSBpbiBqKWZvcihjPTAsZD1qW2VdLmxlbmd0aDtkPmM7YysrKW4uZXZlbnQuYWRkKGIsZSxqW2VdW2NdKX1NLmhhc0RhdGEoYSkmJihoPU0uYWNjZXNzKGEpLGk9bi5leHRlbmQoe30saCksTS5zZXQoYixpKSl9fWZ1bmN0aW9uIG9hKGEsYil7dmFyIGM9YS5nZXRFbGVtZW50c0J5VGFnTmFtZT9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKGJ8fFwiKlwiKTphLnF1ZXJ5U2VsZWN0b3JBbGw/YS5xdWVyeVNlbGVjdG9yQWxsKGJ8fFwiKlwiKTpbXTtyZXR1cm4gdm9pZCAwPT09Ynx8YiYmbi5ub2RlTmFtZShhLGIpP24ubWVyZ2UoW2FdLGMpOmN9ZnVuY3Rpb24gcGEoYSxiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XCJpbnB1dFwiPT09YyYmVC50ZXN0KGEudHlwZSk/Yi5jaGVja2VkPWEuY2hlY2tlZDooXCJpbnB1dFwiPT09Y3x8XCJ0ZXh0YXJlYVwiPT09YykmJihiLmRlZmF1bHRWYWx1ZT1hLmRlZmF1bHRWYWx1ZSl9bi5leHRlbmQoe2Nsb25lOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuY2xvbmVOb2RlKCEwKSxpPW4uY29udGFpbnMoYS5vd25lckRvY3VtZW50LGEpO2lmKCEoay5ub0Nsb25lQ2hlY2tlZHx8MSE9PWEubm9kZVR5cGUmJjExIT09YS5ub2RlVHlwZXx8bi5pc1hNTERvYyhhKSkpZm9yKGc9b2EoaCksZj1vYShhKSxkPTAsZT1mLmxlbmd0aDtlPmQ7ZCsrKXBhKGZbZF0sZ1tkXSk7aWYoYilpZihjKWZvcihmPWZ8fG9hKGEpLGc9Z3x8b2EoaCksZD0wLGU9Zi5sZW5ndGg7ZT5kO2QrKyluYShmW2RdLGdbZF0pO2Vsc2UgbmEoYSxoKTtyZXR1cm4gZz1vYShoLFwic2NyaXB0XCIpLGcubGVuZ3RoPjAmJm1hKGcsIWkmJm9hKGEsXCJzY3JpcHRcIikpLGh9LGJ1aWxkRnJhZ21lbnQ6ZnVuY3Rpb24oYSxiLGMsZCl7Zm9yKHZhciBlLGYsZyxoLGksaixrPWIuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGw9W10sbT0wLG89YS5sZW5ndGg7bz5tO20rKylpZihlPWFbbV0sZXx8MD09PWUpaWYoXCJvYmplY3RcIj09PW4udHlwZShlKSluLm1lcmdlKGwsZS5ub2RlVHlwZT9bZV06ZSk7ZWxzZSBpZihjYS50ZXN0KGUpKXtmPWZ8fGsuYXBwZW5kQ2hpbGQoYi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxnPShiYS5leGVjKGUpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKSxoPWlhW2ddfHxpYS5fZGVmYXVsdCxmLmlubmVySFRNTD1oWzFdK2UucmVwbGFjZShhYSxcIjwkMT48LyQyPlwiKStoWzJdLGo9aFswXTt3aGlsZShqLS0pZj1mLmxhc3RDaGlsZDtuLm1lcmdlKGwsZi5jaGlsZE5vZGVzKSxmPWsuZmlyc3RDaGlsZCxmLnRleHRDb250ZW50PVwiXCJ9ZWxzZSBsLnB1c2goYi5jcmVhdGVUZXh0Tm9kZShlKSk7ay50ZXh0Q29udGVudD1cIlwiLG09MDt3aGlsZShlPWxbbSsrXSlpZigoIWR8fC0xPT09bi5pbkFycmF5KGUsZCkpJiYoaT1uLmNvbnRhaW5zKGUub3duZXJEb2N1bWVudCxlKSxmPW9hKGsuYXBwZW5kQ2hpbGQoZSksXCJzY3JpcHRcIiksaSYmbWEoZiksYykpe2o9MDt3aGlsZShlPWZbaisrXSlmYS50ZXN0KGUudHlwZXx8XCJcIikmJmMucHVzaChlKX1yZXR1cm4ga30sY2xlYW5EYXRhOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjLGQsZSxmPW4uZXZlbnQuc3BlY2lhbCxnPTA7dm9pZCAwIT09KGM9YVtnXSk7ZysrKXtpZihuLmFjY2VwdERhdGEoYykmJihlPWNbTC5leHBhbmRvXSxlJiYoYj1MLmNhY2hlW2VdKSkpe2lmKGIuZXZlbnRzKWZvcihkIGluIGIuZXZlbnRzKWZbZF0/bi5ldmVudC5yZW1vdmUoYyxkKTpuLnJlbW92ZUV2ZW50KGMsZCxiLmhhbmRsZSk7TC5jYWNoZVtlXSYmZGVsZXRlIEwuY2FjaGVbZV19ZGVsZXRlIE0uY2FjaGVbY1tNLmV4cGFuZG9dXX19fSksbi5mbi5leHRlbmQoe3RleHQ6ZnVuY3Rpb24oYSl7cmV0dXJuIEoodGhpcyxmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwPT09YT9uLnRleHQodGhpcyk6dGhpcy5lbXB0eSgpLmVhY2goZnVuY3Rpb24oKXsoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpJiYodGhpcy50ZXh0Q29udGVudD1hKX0pfSxudWxsLGEsYXJndW1lbnRzLmxlbmd0aCl9LGFwcGVuZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cyxmdW5jdGlvbihhKXtpZigxPT09dGhpcy5ub2RlVHlwZXx8MTE9PT10aGlzLm5vZGVUeXBlfHw5PT09dGhpcy5ub2RlVHlwZSl7dmFyIGI9amEodGhpcyxhKTtiLmFwcGVuZENoaWxkKGEpfX0pfSxwcmVwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe2lmKDE9PT10aGlzLm5vZGVUeXBlfHwxMT09PXRoaXMubm9kZVR5cGV8fDk9PT10aGlzLm5vZGVUeXBlKXt2YXIgYj1qYSh0aGlzLGEpO2IuaW5zZXJ0QmVmb3JlKGEsYi5maXJzdENoaWxkKX19KX0sYmVmb3JlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe3RoaXMucGFyZW50Tm9kZSYmdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLHRoaXMpfSl9LGFmdGVyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe3RoaXMucGFyZW50Tm9kZSYmdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLHRoaXMubmV4dFNpYmxpbmcpfSl9LHJlbW92ZTpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYyxkPWE/bi5maWx0ZXIoYSx0aGlzKTp0aGlzLGU9MDtudWxsIT0oYz1kW2VdKTtlKyspYnx8MSE9PWMubm9kZVR5cGV8fG4uY2xlYW5EYXRhKG9hKGMpKSxjLnBhcmVudE5vZGUmJihiJiZuLmNvbnRhaW5zKGMub3duZXJEb2N1bWVudCxjKSYmbWEob2EoYyxcInNjcmlwdFwiKSksYy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGMpKTtyZXR1cm4gdGhpc30sZW1wdHk6ZnVuY3Rpb24oKXtmb3IodmFyIGEsYj0wO251bGwhPShhPXRoaXNbYl0pO2IrKykxPT09YS5ub2RlVHlwZSYmKG4uY2xlYW5EYXRhKG9hKGEsITEpKSxhLnRleHRDb250ZW50PVwiXCIpO3JldHVybiB0aGlzfSxjbG9uZTpmdW5jdGlvbihhLGIpe3JldHVybiBhPW51bGw9PWE/ITE6YSxiPW51bGw9PWI/YTpiLHRoaXMubWFwKGZ1bmN0aW9uKCl7cmV0dXJuIG4uY2xvbmUodGhpcyxhLGIpfSl9LGh0bWw6ZnVuY3Rpb24oYSl7cmV0dXJuIEoodGhpcyxmdW5jdGlvbihhKXt2YXIgYj10aGlzWzBdfHx7fSxjPTAsZD10aGlzLmxlbmd0aDtpZih2b2lkIDA9PT1hJiYxPT09Yi5ub2RlVHlwZSlyZXR1cm4gYi5pbm5lckhUTUw7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEmJiFkYS50ZXN0KGEpJiYhaWFbKGJhLmV4ZWMoYSl8fFtcIlwiLFwiXCJdKVsxXS50b0xvd2VyQ2FzZSgpXSl7YT1hLnJlcGxhY2UoYWEsXCI8JDE+PC8kMj5cIik7dHJ5e2Zvcig7ZD5jO2MrKyliPXRoaXNbY118fHt9LDE9PT1iLm5vZGVUeXBlJiYobi5jbGVhbkRhdGEob2EoYiwhMSkpLGIuaW5uZXJIVE1MPWEpO2I9MH1jYXRjaChlKXt9fWImJnRoaXMuZW1wdHkoKS5hcHBlbmQoYSl9LG51bGwsYSxhcmd1bWVudHMubGVuZ3RoKX0scmVwbGFjZVdpdGg6ZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHNbMF07cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGIpe2E9dGhpcy5wYXJlbnROb2RlLG4uY2xlYW5EYXRhKG9hKHRoaXMpKSxhJiZhLnJlcGxhY2VDaGlsZChiLHRoaXMpfSksYSYmKGEubGVuZ3RofHxhLm5vZGVUeXBlKT90aGlzOnRoaXMucmVtb3ZlKCl9LGRldGFjaDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5yZW1vdmUoYSwhMCl9LGRvbU1hbmlwOmZ1bmN0aW9uKGEsYil7YT1lLmFwcGx5KFtdLGEpO3ZhciBjLGQsZixnLGgsaSxqPTAsbD10aGlzLmxlbmd0aCxtPXRoaXMsbz1sLTEscD1hWzBdLHE9bi5pc0Z1bmN0aW9uKHApO2lmKHF8fGw+MSYmXCJzdHJpbmdcIj09dHlwZW9mIHAmJiFrLmNoZWNrQ2xvbmUmJmVhLnRlc3QocCkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihjKXt2YXIgZD1tLmVxKGMpO3EmJihhWzBdPXAuY2FsbCh0aGlzLGMsZC5odG1sKCkpKSxkLmRvbU1hbmlwKGEsYil9KTtpZihsJiYoYz1uLmJ1aWxkRnJhZ21lbnQoYSx0aGlzWzBdLm93bmVyRG9jdW1lbnQsITEsdGhpcyksZD1jLmZpcnN0Q2hpbGQsMT09PWMuY2hpbGROb2Rlcy5sZW5ndGgmJihjPWQpLGQpKXtmb3IoZj1uLm1hcChvYShjLFwic2NyaXB0XCIpLGthKSxnPWYubGVuZ3RoO2w+ajtqKyspaD1jLGohPT1vJiYoaD1uLmNsb25lKGgsITAsITApLGcmJm4ubWVyZ2UoZixvYShoLFwic2NyaXB0XCIpKSksYi5jYWxsKHRoaXNbal0saCxqKTtpZihnKWZvcihpPWZbZi5sZW5ndGgtMV0ub3duZXJEb2N1bWVudCxuLm1hcChmLGxhKSxqPTA7Zz5qO2orKyloPWZbal0sZmEudGVzdChoLnR5cGV8fFwiXCIpJiYhTC5hY2Nlc3MoaCxcImdsb2JhbEV2YWxcIikmJm4uY29udGFpbnMoaSxoKSYmKGguc3JjP24uX2V2YWxVcmwmJm4uX2V2YWxVcmwoaC5zcmMpOm4uZ2xvYmFsRXZhbChoLnRleHRDb250ZW50LnJlcGxhY2UoaGEsXCJcIikpKX1yZXR1cm4gdGhpc319KSxuLmVhY2goe2FwcGVuZFRvOlwiYXBwZW5kXCIscHJlcGVuZFRvOlwicHJlcGVuZFwiLGluc2VydEJlZm9yZTpcImJlZm9yZVwiLGluc2VydEFmdGVyOlwiYWZ0ZXJcIixyZXBsYWNlQWxsOlwicmVwbGFjZVdpdGhcIn0sZnVuY3Rpb24oYSxiKXtuLmZuW2FdPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxkPVtdLGU9bihhKSxnPWUubGVuZ3RoLTEsaD0wO2c+PWg7aCsrKWM9aD09PWc/dGhpczp0aGlzLmNsb25lKCEwKSxuKGVbaF0pW2JdKGMpLGYuYXBwbHkoZCxjLmdldCgpKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2soZCl9fSk7dmFyIHFhLHJhPXt9O2Z1bmN0aW9uIHNhKGIsYyl7dmFyIGQsZT1uKGMuY3JlYXRlRWxlbWVudChiKSkuYXBwZW5kVG8oYy5ib2R5KSxmPWEuZ2V0RGVmYXVsdENvbXB1dGVkU3R5bGUmJihkPWEuZ2V0RGVmYXVsdENvbXB1dGVkU3R5bGUoZVswXSkpP2QuZGlzcGxheTpuLmNzcyhlWzBdLFwiZGlzcGxheVwiKTtyZXR1cm4gZS5kZXRhY2goKSxmfWZ1bmN0aW9uIHRhKGEpe3ZhciBiPWwsYz1yYVthXTtyZXR1cm4gY3x8KGM9c2EoYSxiKSxcIm5vbmVcIiE9PWMmJmN8fChxYT0ocWF8fG4oXCI8aWZyYW1lIGZyYW1lYm9yZGVyPScwJyB3aWR0aD0nMCcgaGVpZ2h0PScwJy8+XCIpKS5hcHBlbmRUbyhiLmRvY3VtZW50RWxlbWVudCksYj1xYVswXS5jb250ZW50RG9jdW1lbnQsYi53cml0ZSgpLGIuY2xvc2UoKSxjPXNhKGEsYikscWEuZGV0YWNoKCkpLHJhW2FdPWMpLGN9dmFyIHVhPS9ebWFyZ2luLyx2YT1uZXcgUmVnRXhwKFwiXihcIitRK1wiKSg/IXB4KVthLXolXSskXCIsXCJpXCIpLHdhPWZ1bmN0aW9uKGIpe3JldHVybiBiLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcub3BlbmVyP2Iub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCk6YS5nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCl9O2Z1bmN0aW9uIHhhKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuc3R5bGU7cmV0dXJuIGM9Y3x8d2EoYSksYyYmKGc9Yy5nZXRQcm9wZXJ0eVZhbHVlKGIpfHxjW2JdKSxjJiYoXCJcIiE9PWd8fG4uY29udGFpbnMoYS5vd25lckRvY3VtZW50LGEpfHwoZz1uLnN0eWxlKGEsYikpLHZhLnRlc3QoZykmJnVhLnRlc3QoYikmJihkPWgud2lkdGgsZT1oLm1pbldpZHRoLGY9aC5tYXhXaWR0aCxoLm1pbldpZHRoPWgubWF4V2lkdGg9aC53aWR0aD1nLGc9Yy53aWR0aCxoLndpZHRoPWQsaC5taW5XaWR0aD1lLGgubWF4V2lkdGg9ZikpLHZvaWQgMCE9PWc/ZytcIlwiOmd9ZnVuY3Rpb24geWEoYSxiKXtyZXR1cm57Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGEoKT92b2lkIGRlbGV0ZSB0aGlzLmdldDoodGhpcy5nZXQ9YikuYXBwbHkodGhpcyxhcmd1bWVudHMpfX19IWZ1bmN0aW9uKCl7dmFyIGIsYyxkPWwuZG9jdW1lbnRFbGVtZW50LGU9bC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGY9bC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKGYuc3R5bGUpe2Yuc3R5bGUuYmFja2dyb3VuZENsaXA9XCJjb250ZW50LWJveFwiLGYuY2xvbmVOb2RlKCEwKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcD1cIlwiLGsuY2xlYXJDbG9uZVN0eWxlPVwiY29udGVudC1ib3hcIj09PWYuc3R5bGUuYmFja2dyb3VuZENsaXAsZS5zdHlsZS5jc3NUZXh0PVwiYm9yZGVyOjA7d2lkdGg6MDtoZWlnaHQ6MDt0b3A6MDtsZWZ0Oi05OTk5cHg7bWFyZ2luLXRvcDoxcHg7cG9zaXRpb246YWJzb2x1dGVcIixlLmFwcGVuZENoaWxkKGYpO2Z1bmN0aW9uIGcoKXtmLnN0eWxlLmNzc1RleHQ9XCItd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTpibG9jazttYXJnaW4tdG9wOjElO3RvcDoxJTtib3JkZXI6MXB4O3BhZGRpbmc6MXB4O3dpZHRoOjRweDtwb3NpdGlvbjphYnNvbHV0ZVwiLGYuaW5uZXJIVE1MPVwiXCIsZC5hcHBlbmRDaGlsZChlKTt2YXIgZz1hLmdldENvbXB1dGVkU3R5bGUoZixudWxsKTtiPVwiMSVcIiE9PWcudG9wLGM9XCI0cHhcIj09PWcud2lkdGgsZC5yZW1vdmVDaGlsZChlKX1hLmdldENvbXB1dGVkU3R5bGUmJm4uZXh0ZW5kKGsse3BpeGVsUG9zaXRpb246ZnVuY3Rpb24oKXtyZXR1cm4gZygpLGJ9LGJveFNpemluZ1JlbGlhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PWMmJmcoKSxjfSxyZWxpYWJsZU1hcmdpblJpZ2h0OmZ1bmN0aW9uKCl7dmFyIGIsYz1mLmFwcGVuZENoaWxkKGwuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7cmV0dXJuIGMuc3R5bGUuY3NzVGV4dD1mLnN0eWxlLmNzc1RleHQ9XCItd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3g7ZGlzcGxheTpibG9jazttYXJnaW46MDtib3JkZXI6MDtwYWRkaW5nOjBcIixjLnN0eWxlLm1hcmdpblJpZ2h0PWMuc3R5bGUud2lkdGg9XCIwXCIsZi5zdHlsZS53aWR0aD1cIjFweFwiLGQuYXBwZW5kQ2hpbGQoZSksYj0hcGFyc2VGbG9hdChhLmdldENvbXB1dGVkU3R5bGUoYyxudWxsKS5tYXJnaW5SaWdodCksZC5yZW1vdmVDaGlsZChlKSxmLnJlbW92ZUNoaWxkKGMpLGJ9fSl9fSgpLG4uc3dhcD1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZSxmLGc9e307Zm9yKGYgaW4gYilnW2ZdPWEuc3R5bGVbZl0sYS5zdHlsZVtmXT1iW2ZdO2U9Yy5hcHBseShhLGR8fFtdKTtmb3IoZiBpbiBiKWEuc3R5bGVbZl09Z1tmXTtyZXR1cm4gZX07dmFyIHphPS9eKG5vbmV8dGFibGUoPyEtY1tlYV0pLispLyxBYT1uZXcgUmVnRXhwKFwiXihcIitRK1wiKSguKikkXCIsXCJpXCIpLEJhPW5ldyBSZWdFeHAoXCJeKFsrLV0pPShcIitRK1wiKVwiLFwiaVwiKSxDYT17cG9zaXRpb246XCJhYnNvbHV0ZVwiLHZpc2liaWxpdHk6XCJoaWRkZW5cIixkaXNwbGF5OlwiYmxvY2tcIn0sRGE9e2xldHRlclNwYWNpbmc6XCIwXCIsZm9udFdlaWdodDpcIjQwMFwifSxFYT1bXCJXZWJraXRcIixcIk9cIixcIk1velwiLFwibXNcIl07ZnVuY3Rpb24gRmEoYSxiKXtpZihiIGluIGEpcmV0dXJuIGI7dmFyIGM9YlswXS50b1VwcGVyQ2FzZSgpK2Iuc2xpY2UoMSksZD1iLGU9RWEubGVuZ3RoO3doaWxlKGUtLSlpZihiPUVhW2VdK2MsYiBpbiBhKXJldHVybiBiO3JldHVybiBkfWZ1bmN0aW9uIEdhKGEsYixjKXt2YXIgZD1BYS5leGVjKGIpO3JldHVybiBkP01hdGgubWF4KDAsZFsxXS0oY3x8MCkpKyhkWzJdfHxcInB4XCIpOmJ9ZnVuY3Rpb24gSGEoYSxiLGMsZCxlKXtmb3IodmFyIGY9Yz09PShkP1wiYm9yZGVyXCI6XCJjb250ZW50XCIpPzQ6XCJ3aWR0aFwiPT09Yj8xOjAsZz0wOzQ+ZjtmKz0yKVwibWFyZ2luXCI9PT1jJiYoZys9bi5jc3MoYSxjK1JbZl0sITAsZSkpLGQ/KFwiY29udGVudFwiPT09YyYmKGctPW4uY3NzKGEsXCJwYWRkaW5nXCIrUltmXSwhMCxlKSksXCJtYXJnaW5cIiE9PWMmJihnLT1uLmNzcyhhLFwiYm9yZGVyXCIrUltmXStcIldpZHRoXCIsITAsZSkpKTooZys9bi5jc3MoYSxcInBhZGRpbmdcIitSW2ZdLCEwLGUpLFwicGFkZGluZ1wiIT09YyYmKGcrPW4uY3NzKGEsXCJib3JkZXJcIitSW2ZdK1wiV2lkdGhcIiwhMCxlKSkpO3JldHVybiBnfWZ1bmN0aW9uIElhKGEsYixjKXt2YXIgZD0hMCxlPVwid2lkdGhcIj09PWI/YS5vZmZzZXRXaWR0aDphLm9mZnNldEhlaWdodCxmPXdhKGEpLGc9XCJib3JkZXItYm94XCI9PT1uLmNzcyhhLFwiYm94U2l6aW5nXCIsITEsZik7aWYoMD49ZXx8bnVsbD09ZSl7aWYoZT14YShhLGIsZiksKDA+ZXx8bnVsbD09ZSkmJihlPWEuc3R5bGVbYl0pLHZhLnRlc3QoZSkpcmV0dXJuIGU7ZD1nJiYoay5ib3hTaXppbmdSZWxpYWJsZSgpfHxlPT09YS5zdHlsZVtiXSksZT1wYXJzZUZsb2F0KGUpfHwwfXJldHVybiBlK0hhKGEsYixjfHwoZz9cImJvcmRlclwiOlwiY29udGVudFwiKSxkLGYpK1wicHhcIn1mdW5jdGlvbiBKYShhLGIpe2Zvcih2YXIgYyxkLGUsZj1bXSxnPTAsaD1hLmxlbmd0aDtoPmc7ZysrKWQ9YVtnXSxkLnN0eWxlJiYoZltnXT1MLmdldChkLFwib2xkZGlzcGxheVwiKSxjPWQuc3R5bGUuZGlzcGxheSxiPyhmW2ddfHxcIm5vbmVcIiE9PWN8fChkLnN0eWxlLmRpc3BsYXk9XCJcIiksXCJcIj09PWQuc3R5bGUuZGlzcGxheSYmUyhkKSYmKGZbZ109TC5hY2Nlc3MoZCxcIm9sZGRpc3BsYXlcIix0YShkLm5vZGVOYW1lKSkpKTooZT1TKGQpLFwibm9uZVwiPT09YyYmZXx8TC5zZXQoZCxcIm9sZGRpc3BsYXlcIixlP2M6bi5jc3MoZCxcImRpc3BsYXlcIikpKSk7Zm9yKGc9MDtoPmc7ZysrKWQ9YVtnXSxkLnN0eWxlJiYoYiYmXCJub25lXCIhPT1kLnN0eWxlLmRpc3BsYXkmJlwiXCIhPT1kLnN0eWxlLmRpc3BsYXl8fChkLnN0eWxlLmRpc3BsYXk9Yj9mW2ddfHxcIlwiOlwibm9uZVwiKSk7cmV0dXJuIGF9bi5leHRlbmQoe2Nzc0hvb2tzOntvcGFjaXR5OntnZXQ6ZnVuY3Rpb24oYSxiKXtpZihiKXt2YXIgYz14YShhLFwib3BhY2l0eVwiKTtyZXR1cm5cIlwiPT09Yz9cIjFcIjpjfX19fSxjc3NOdW1iZXI6e2NvbHVtbkNvdW50OiEwLGZpbGxPcGFjaXR5OiEwLGZsZXhHcm93OiEwLGZsZXhTaHJpbms6ITAsZm9udFdlaWdodDohMCxsaW5lSGVpZ2h0OiEwLG9wYWNpdHk6ITAsb3JkZXI6ITAsb3JwaGFuczohMCx3aWRvd3M6ITAsekluZGV4OiEwLHpvb206ITB9LGNzc1Byb3BzOntcImZsb2F0XCI6XCJjc3NGbG9hdFwifSxzdHlsZTpmdW5jdGlvbihhLGIsYyxkKXtpZihhJiYzIT09YS5ub2RlVHlwZSYmOCE9PWEubm9kZVR5cGUmJmEuc3R5bGUpe3ZhciBlLGYsZyxoPW4uY2FtZWxDYXNlKGIpLGk9YS5zdHlsZTtyZXR1cm4gYj1uLmNzc1Byb3BzW2hdfHwobi5jc3NQcm9wc1toXT1GYShpLGgpKSxnPW4uY3NzSG9va3NbYl18fG4uY3NzSG9va3NbaF0sdm9pZCAwPT09Yz9nJiZcImdldFwiaW4gZyYmdm9pZCAwIT09KGU9Zy5nZXQoYSwhMSxkKSk/ZTppW2JdOihmPXR5cGVvZiBjLFwic3RyaW5nXCI9PT1mJiYoZT1CYS5leGVjKGMpKSYmKGM9KGVbMV0rMSkqZVsyXStwYXJzZUZsb2F0KG4uY3NzKGEsYikpLGY9XCJudW1iZXJcIiksbnVsbCE9YyYmYz09PWMmJihcIm51bWJlclwiIT09Znx8bi5jc3NOdW1iZXJbaF18fChjKz1cInB4XCIpLGsuY2xlYXJDbG9uZVN0eWxlfHxcIlwiIT09Y3x8MCE9PWIuaW5kZXhPZihcImJhY2tncm91bmRcIil8fChpW2JdPVwiaW5oZXJpdFwiKSxnJiZcInNldFwiaW4gZyYmdm9pZCAwPT09KGM9Zy5zZXQoYSxjLGQpKXx8KGlbYl09YykpLHZvaWQgMCl9fSxjc3M6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGUsZixnLGg9bi5jYW1lbENhc2UoYik7cmV0dXJuIGI9bi5jc3NQcm9wc1toXXx8KG4uY3NzUHJvcHNbaF09RmEoYS5zdHlsZSxoKSksZz1uLmNzc0hvb2tzW2JdfHxuLmNzc0hvb2tzW2hdLGcmJlwiZ2V0XCJpbiBnJiYoZT1nLmdldChhLCEwLGMpKSx2b2lkIDA9PT1lJiYoZT14YShhLGIsZCkpLFwibm9ybWFsXCI9PT1lJiZiIGluIERhJiYoZT1EYVtiXSksXCJcIj09PWN8fGM/KGY9cGFyc2VGbG9hdChlKSxjPT09ITB8fG4uaXNOdW1lcmljKGYpP2Z8fDA6ZSk6ZX19KSxuLmVhY2goW1wiaGVpZ2h0XCIsXCJ3aWR0aFwiXSxmdW5jdGlvbihhLGIpe24uY3NzSG9va3NbYl09e2dldDpmdW5jdGlvbihhLGMsZCl7cmV0dXJuIGM/emEudGVzdChuLmNzcyhhLFwiZGlzcGxheVwiKSkmJjA9PT1hLm9mZnNldFdpZHRoP24uc3dhcChhLENhLGZ1bmN0aW9uKCl7cmV0dXJuIElhKGEsYixkKX0pOklhKGEsYixkKTp2b2lkIDB9LHNldDpmdW5jdGlvbihhLGMsZCl7dmFyIGU9ZCYmd2EoYSk7cmV0dXJuIEdhKGEsYyxkP0hhKGEsYixkLFwiYm9yZGVyLWJveFwiPT09bi5jc3MoYSxcImJveFNpemluZ1wiLCExLGUpLGUpOjApfX19KSxuLmNzc0hvb2tzLm1hcmdpblJpZ2h0PXlhKGsucmVsaWFibGVNYXJnaW5SaWdodCxmdW5jdGlvbihhLGIpe3JldHVybiBiP24uc3dhcChhLHtkaXNwbGF5OlwiaW5saW5lLWJsb2NrXCJ9LHhhLFthLFwibWFyZ2luUmlnaHRcIl0pOnZvaWQgMH0pLG4uZWFjaCh7bWFyZ2luOlwiXCIscGFkZGluZzpcIlwiLGJvcmRlcjpcIldpZHRoXCJ9LGZ1bmN0aW9uKGEsYil7bi5jc3NIb29rc1thK2JdPXtleHBhbmQ6ZnVuY3Rpb24oYyl7Zm9yKHZhciBkPTAsZT17fSxmPVwic3RyaW5nXCI9PXR5cGVvZiBjP2Muc3BsaXQoXCIgXCIpOltjXTs0PmQ7ZCsrKWVbYStSW2RdK2JdPWZbZF18fGZbZC0yXXx8ZlswXTtyZXR1cm4gZX19LHVhLnRlc3QoYSl8fChuLmNzc0hvb2tzW2ErYl0uc2V0PUdhKX0pLG4uZm4uZXh0ZW5kKHtjc3M6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gSih0aGlzLGZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGY9e30sZz0wO2lmKG4uaXNBcnJheShiKSl7Zm9yKGQ9d2EoYSksZT1iLmxlbmd0aDtlPmc7ZysrKWZbYltnXV09bi5jc3MoYSxiW2ddLCExLGQpO3JldHVybiBmfXJldHVybiB2b2lkIDAhPT1jP24uc3R5bGUoYSxiLGMpOm4uY3NzKGEsYil9LGEsYixhcmd1bWVudHMubGVuZ3RoPjEpfSxzaG93OmZ1bmN0aW9uKCl7cmV0dXJuIEphKHRoaXMsITApfSxoaWRlOmZ1bmN0aW9uKCl7cmV0dXJuIEphKHRoaXMpfSx0b2dnbGU6ZnVuY3Rpb24oYSl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBhP2E/dGhpcy5zaG93KCk6dGhpcy5oaWRlKCk6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7Uyh0aGlzKT9uKHRoaXMpLnNob3coKTpuKHRoaXMpLmhpZGUoKX0pfX0pO2Z1bmN0aW9uIEthKGEsYixjLGQsZSl7cmV0dXJuIG5ldyBLYS5wcm90b3R5cGUuaW5pdChhLGIsYyxkLGUpfW4uVHdlZW49S2EsS2EucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpLYSxpbml0OmZ1bmN0aW9uKGEsYixjLGQsZSxmKXt0aGlzLmVsZW09YSx0aGlzLnByb3A9Yyx0aGlzLmVhc2luZz1lfHxcInN3aW5nXCIsdGhpcy5vcHRpb25zPWIsdGhpcy5zdGFydD10aGlzLm5vdz10aGlzLmN1cigpLHRoaXMuZW5kPWQsdGhpcy51bml0PWZ8fChuLmNzc051bWJlcltjXT9cIlwiOlwicHhcIil9LGN1cjpmdW5jdGlvbigpe3ZhciBhPUthLnByb3BIb29rc1t0aGlzLnByb3BdO3JldHVybiBhJiZhLmdldD9hLmdldCh0aGlzKTpLYS5wcm9wSG9va3MuX2RlZmF1bHQuZ2V0KHRoaXMpfSxydW46ZnVuY3Rpb24oYSl7dmFyIGIsYz1LYS5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gdGhpcy5vcHRpb25zLmR1cmF0aW9uP3RoaXMucG9zPWI9bi5lYXNpbmdbdGhpcy5lYXNpbmddKGEsdGhpcy5vcHRpb25zLmR1cmF0aW9uKmEsMCwxLHRoaXMub3B0aW9ucy5kdXJhdGlvbik6dGhpcy5wb3M9Yj1hLHRoaXMubm93PSh0aGlzLmVuZC10aGlzLnN0YXJ0KSpiK3RoaXMuc3RhcnQsdGhpcy5vcHRpb25zLnN0ZXAmJnRoaXMub3B0aW9ucy5zdGVwLmNhbGwodGhpcy5lbGVtLHRoaXMubm93LHRoaXMpLGMmJmMuc2V0P2Muc2V0KHRoaXMpOkthLnByb3BIb29rcy5fZGVmYXVsdC5zZXQodGhpcyksdGhpc319LEthLnByb3RvdHlwZS5pbml0LnByb3RvdHlwZT1LYS5wcm90b3R5cGUsS2EucHJvcEhvb2tzPXtfZGVmYXVsdDp7Z2V0OmZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiBudWxsPT1hLmVsZW1bYS5wcm9wXXx8YS5lbGVtLnN0eWxlJiZudWxsIT1hLmVsZW0uc3R5bGVbYS5wcm9wXT8oYj1uLmNzcyhhLmVsZW0sYS5wcm9wLFwiXCIpLGImJlwiYXV0b1wiIT09Yj9iOjApOmEuZWxlbVthLnByb3BdfSxzZXQ6ZnVuY3Rpb24oYSl7bi5meC5zdGVwW2EucHJvcF0/bi5meC5zdGVwW2EucHJvcF0oYSk6YS5lbGVtLnN0eWxlJiYobnVsbCE9YS5lbGVtLnN0eWxlW24uY3NzUHJvcHNbYS5wcm9wXV18fG4uY3NzSG9va3NbYS5wcm9wXSk/bi5zdHlsZShhLmVsZW0sYS5wcm9wLGEubm93K2EudW5pdCk6YS5lbGVtW2EucHJvcF09YS5ub3d9fX0sS2EucHJvcEhvb2tzLnNjcm9sbFRvcD1LYS5wcm9wSG9va3Muc2Nyb2xsTGVmdD17c2V0OmZ1bmN0aW9uKGEpe2EuZWxlbS5ub2RlVHlwZSYmYS5lbGVtLnBhcmVudE5vZGUmJihhLmVsZW1bYS5wcm9wXT1hLm5vdyl9fSxuLmVhc2luZz17bGluZWFyOmZ1bmN0aW9uKGEpe3JldHVybiBhfSxzd2luZzpmdW5jdGlvbihhKXtyZXR1cm4uNS1NYXRoLmNvcyhhKk1hdGguUEkpLzJ9fSxuLmZ4PUthLnByb3RvdHlwZS5pbml0LG4uZnguc3RlcD17fTt2YXIgTGEsTWEsTmE9L14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLE9hPW5ldyBSZWdFeHAoXCJeKD86KFsrLV0pPXwpKFwiK1ErXCIpKFthLXolXSopJFwiLFwiaVwiKSxQYT0vcXVldWVIb29rcyQvLFFhPVtWYV0sUmE9e1wiKlwiOltmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuY3JlYXRlVHdlZW4oYSxiKSxkPWMuY3VyKCksZT1PYS5leGVjKGIpLGY9ZSYmZVszXXx8KG4uY3NzTnVtYmVyW2FdP1wiXCI6XCJweFwiKSxnPShuLmNzc051bWJlclthXXx8XCJweFwiIT09ZiYmK2QpJiZPYS5leGVjKG4uY3NzKGMuZWxlbSxhKSksaD0xLGk9MjA7aWYoZyYmZ1szXSE9PWYpe2Y9Znx8Z1szXSxlPWV8fFtdLGc9K2R8fDE7ZG8gaD1ofHxcIi41XCIsZy89aCxuLnN0eWxlKGMuZWxlbSxhLGcrZik7d2hpbGUoaCE9PShoPWMuY3VyKCkvZCkmJjEhPT1oJiYtLWkpfXJldHVybiBlJiYoZz1jLnN0YXJ0PStnfHwrZHx8MCxjLnVuaXQ9ZixjLmVuZD1lWzFdP2crKGVbMV0rMSkqZVsyXTorZVsyXSksY31dfTtmdW5jdGlvbiBTYSgpe3JldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7TGE9dm9pZCAwfSksTGE9bi5ub3coKX1mdW5jdGlvbiBUYShhLGIpe3ZhciBjLGQ9MCxlPXtoZWlnaHQ6YX07Zm9yKGI9Yj8xOjA7ND5kO2QrPTItYiljPVJbZF0sZVtcIm1hcmdpblwiK2NdPWVbXCJwYWRkaW5nXCIrY109YTtyZXR1cm4gYiYmKGUub3BhY2l0eT1lLndpZHRoPWEpLGV9ZnVuY3Rpb24gVWEoYSxiLGMpe2Zvcih2YXIgZCxlPShSYVtiXXx8W10pLmNvbmNhdChSYVtcIipcIl0pLGY9MCxnPWUubGVuZ3RoO2c+ZjtmKyspaWYoZD1lW2ZdLmNhbGwoYyxiLGEpKXJldHVybiBkfWZ1bmN0aW9uIFZhKGEsYixjKXt2YXIgZCxlLGYsZyxoLGksaixrLGw9dGhpcyxtPXt9LG89YS5zdHlsZSxwPWEubm9kZVR5cGUmJlMoYSkscT1MLmdldChhLFwiZnhzaG93XCIpO2MucXVldWV8fChoPW4uX3F1ZXVlSG9va3MoYSxcImZ4XCIpLG51bGw9PWgudW5xdWV1ZWQmJihoLnVucXVldWVkPTAsaT1oLmVtcHR5LmZpcmUsaC5lbXB0eS5maXJlPWZ1bmN0aW9uKCl7aC51bnF1ZXVlZHx8aSgpfSksaC51bnF1ZXVlZCsrLGwuYWx3YXlzKGZ1bmN0aW9uKCl7bC5hbHdheXMoZnVuY3Rpb24oKXtoLnVucXVldWVkLS0sbi5xdWV1ZShhLFwiZnhcIikubGVuZ3RofHxoLmVtcHR5LmZpcmUoKX0pfSkpLDE9PT1hLm5vZGVUeXBlJiYoXCJoZWlnaHRcImluIGJ8fFwid2lkdGhcImluIGIpJiYoYy5vdmVyZmxvdz1bby5vdmVyZmxvdyxvLm92ZXJmbG93WCxvLm92ZXJmbG93WV0saj1uLmNzcyhhLFwiZGlzcGxheVwiKSxrPVwibm9uZVwiPT09aj9MLmdldChhLFwib2xkZGlzcGxheVwiKXx8dGEoYS5ub2RlTmFtZSk6aixcImlubGluZVwiPT09ayYmXCJub25lXCI9PT1uLmNzcyhhLFwiZmxvYXRcIikmJihvLmRpc3BsYXk9XCJpbmxpbmUtYmxvY2tcIikpLGMub3ZlcmZsb3cmJihvLm92ZXJmbG93PVwiaGlkZGVuXCIsbC5hbHdheXMoZnVuY3Rpb24oKXtvLm92ZXJmbG93PWMub3ZlcmZsb3dbMF0sby5vdmVyZmxvd1g9Yy5vdmVyZmxvd1sxXSxvLm92ZXJmbG93WT1jLm92ZXJmbG93WzJdfSkpO2ZvcihkIGluIGIpaWYoZT1iW2RdLE5hLmV4ZWMoZSkpe2lmKGRlbGV0ZSBiW2RdLGY9Znx8XCJ0b2dnbGVcIj09PWUsZT09PShwP1wiaGlkZVwiOlwic2hvd1wiKSl7aWYoXCJzaG93XCIhPT1lfHwhcXx8dm9pZCAwPT09cVtkXSljb250aW51ZTtwPSEwfW1bZF09cSYmcVtkXXx8bi5zdHlsZShhLGQpfWVsc2Ugaj12b2lkIDA7aWYobi5pc0VtcHR5T2JqZWN0KG0pKVwiaW5saW5lXCI9PT0oXCJub25lXCI9PT1qP3RhKGEubm9kZU5hbWUpOmopJiYoby5kaXNwbGF5PWopO2Vsc2V7cT9cImhpZGRlblwiaW4gcSYmKHA9cS5oaWRkZW4pOnE9TC5hY2Nlc3MoYSxcImZ4c2hvd1wiLHt9KSxmJiYocS5oaWRkZW49IXApLHA/bihhKS5zaG93KCk6bC5kb25lKGZ1bmN0aW9uKCl7bihhKS5oaWRlKCl9KSxsLmRvbmUoZnVuY3Rpb24oKXt2YXIgYjtMLnJlbW92ZShhLFwiZnhzaG93XCIpO2ZvcihiIGluIG0pbi5zdHlsZShhLGIsbVtiXSl9KTtmb3IoZCBpbiBtKWc9VWEocD9xW2RdOjAsZCxsKSxkIGluIHF8fChxW2RdPWcuc3RhcnQscCYmKGcuZW5kPWcuc3RhcnQsZy5zdGFydD1cIndpZHRoXCI9PT1kfHxcImhlaWdodFwiPT09ZD8xOjApKX19ZnVuY3Rpb24gV2EoYSxiKXt2YXIgYyxkLGUsZixnO2ZvcihjIGluIGEpaWYoZD1uLmNhbWVsQ2FzZShjKSxlPWJbZF0sZj1hW2NdLG4uaXNBcnJheShmKSYmKGU9ZlsxXSxmPWFbY109ZlswXSksYyE9PWQmJihhW2RdPWYsZGVsZXRlIGFbY10pLGc9bi5jc3NIb29rc1tkXSxnJiZcImV4cGFuZFwiaW4gZyl7Zj1nLmV4cGFuZChmKSxkZWxldGUgYVtkXTtmb3IoYyBpbiBmKWMgaW4gYXx8KGFbY109ZltjXSxiW2NdPWUpfWVsc2UgYltkXT1lfWZ1bmN0aW9uIFhhKGEsYixjKXt2YXIgZCxlLGY9MCxnPVFhLmxlbmd0aCxoPW4uRGVmZXJyZWQoKS5hbHdheXMoZnVuY3Rpb24oKXtkZWxldGUgaS5lbGVtfSksaT1mdW5jdGlvbigpe2lmKGUpcmV0dXJuITE7Zm9yKHZhciBiPUxhfHxTYSgpLGM9TWF0aC5tYXgoMCxqLnN0YXJ0VGltZStqLmR1cmF0aW9uLWIpLGQ9Yy9qLmR1cmF0aW9ufHwwLGY9MS1kLGc9MCxpPWoudHdlZW5zLmxlbmd0aDtpPmc7ZysrKWoudHdlZW5zW2ddLnJ1bihmKTtyZXR1cm4gaC5ub3RpZnlXaXRoKGEsW2osZixjXSksMT5mJiZpP2M6KGgucmVzb2x2ZVdpdGgoYSxbal0pLCExKX0saj1oLnByb21pc2Uoe2VsZW06YSxwcm9wczpuLmV4dGVuZCh7fSxiKSxvcHRzOm4uZXh0ZW5kKCEwLHtzcGVjaWFsRWFzaW5nOnt9fSxjKSxvcmlnaW5hbFByb3BlcnRpZXM6YixvcmlnaW5hbE9wdGlvbnM6YyxzdGFydFRpbWU6TGF8fFNhKCksZHVyYXRpb246Yy5kdXJhdGlvbix0d2VlbnM6W10sY3JlYXRlVHdlZW46ZnVuY3Rpb24oYixjKXt2YXIgZD1uLlR3ZWVuKGEsai5vcHRzLGIsYyxqLm9wdHMuc3BlY2lhbEVhc2luZ1tiXXx8ai5vcHRzLmVhc2luZyk7cmV0dXJuIGoudHdlZW5zLnB1c2goZCksZH0sc3RvcDpmdW5jdGlvbihiKXt2YXIgYz0wLGQ9Yj9qLnR3ZWVucy5sZW5ndGg6MDtpZihlKXJldHVybiB0aGlzO2ZvcihlPSEwO2Q+YztjKyspai50d2VlbnNbY10ucnVuKDEpO3JldHVybiBiP2gucmVzb2x2ZVdpdGgoYSxbaixiXSk6aC5yZWplY3RXaXRoKGEsW2osYl0pLHRoaXN9fSksaz1qLnByb3BzO2ZvcihXYShrLGoub3B0cy5zcGVjaWFsRWFzaW5nKTtnPmY7ZisrKWlmKGQ9UWFbZl0uY2FsbChqLGEsayxqLm9wdHMpKXJldHVybiBkO3JldHVybiBuLm1hcChrLFVhLGopLG4uaXNGdW5jdGlvbihqLm9wdHMuc3RhcnQpJiZqLm9wdHMuc3RhcnQuY2FsbChhLGopLG4uZngudGltZXIobi5leHRlbmQoaSx7ZWxlbTphLGFuaW06aixxdWV1ZTpqLm9wdHMucXVldWV9KSksai5wcm9ncmVzcyhqLm9wdHMucHJvZ3Jlc3MpLmRvbmUoai5vcHRzLmRvbmUsai5vcHRzLmNvbXBsZXRlKS5mYWlsKGoub3B0cy5mYWlsKS5hbHdheXMoai5vcHRzLmFsd2F5cyl9bi5BbmltYXRpb249bi5leHRlbmQoWGEse3R3ZWVuZXI6ZnVuY3Rpb24oYSxiKXtuLmlzRnVuY3Rpb24oYSk/KGI9YSxhPVtcIipcIl0pOmE9YS5zcGxpdChcIiBcIik7Zm9yKHZhciBjLGQ9MCxlPWEubGVuZ3RoO2U+ZDtkKyspYz1hW2RdLFJhW2NdPVJhW2NdfHxbXSxSYVtjXS51bnNoaWZ0KGIpfSxwcmVmaWx0ZXI6ZnVuY3Rpb24oYSxiKXtiP1FhLnVuc2hpZnQoYSk6UWEucHVzaChhKX19KSxuLnNwZWVkPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hJiZcIm9iamVjdFwiPT10eXBlb2YgYT9uLmV4dGVuZCh7fSxhKTp7Y29tcGxldGU6Y3x8IWMmJmJ8fG4uaXNGdW5jdGlvbihhKSYmYSxkdXJhdGlvbjphLGVhc2luZzpjJiZifHxiJiYhbi5pc0Z1bmN0aW9uKGIpJiZifTtyZXR1cm4gZC5kdXJhdGlvbj1uLmZ4Lm9mZj8wOlwibnVtYmVyXCI9PXR5cGVvZiBkLmR1cmF0aW9uP2QuZHVyYXRpb246ZC5kdXJhdGlvbiBpbiBuLmZ4LnNwZWVkcz9uLmZ4LnNwZWVkc1tkLmR1cmF0aW9uXTpuLmZ4LnNwZWVkcy5fZGVmYXVsdCwobnVsbD09ZC5xdWV1ZXx8ZC5xdWV1ZT09PSEwKSYmKGQucXVldWU9XCJmeFwiKSxkLm9sZD1kLmNvbXBsZXRlLGQuY29tcGxldGU9ZnVuY3Rpb24oKXtuLmlzRnVuY3Rpb24oZC5vbGQpJiZkLm9sZC5jYWxsKHRoaXMpLGQucXVldWUmJm4uZGVxdWV1ZSh0aGlzLGQucXVldWUpfSxkfSxuLmZuLmV4dGVuZCh7ZmFkZVRvOmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiB0aGlzLmZpbHRlcihTKS5jc3MoXCJvcGFjaXR5XCIsMCkuc2hvdygpLmVuZCgpLmFuaW1hdGUoe29wYWNpdHk6Yn0sYSxjLGQpfSxhbmltYXRlOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPW4uaXNFbXB0eU9iamVjdChhKSxmPW4uc3BlZWQoYixjLGQpLGc9ZnVuY3Rpb24oKXt2YXIgYj1YYSh0aGlzLG4uZXh0ZW5kKHt9LGEpLGYpOyhlfHxMLmdldCh0aGlzLFwiZmluaXNoXCIpKSYmYi5zdG9wKCEwKX07cmV0dXJuIGcuZmluaXNoPWcsZXx8Zi5xdWV1ZT09PSExP3RoaXMuZWFjaChnKTp0aGlzLnF1ZXVlKGYucXVldWUsZyl9LHN0b3A6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWZ1bmN0aW9uKGEpe3ZhciBiPWEuc3RvcDtkZWxldGUgYS5zdG9wLGIoYyl9O3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiBhJiYoYz1iLGI9YSxhPXZvaWQgMCksYiYmYSE9PSExJiZ0aGlzLnF1ZXVlKGF8fFwiZnhcIixbXSksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGI9ITAsZT1udWxsIT1hJiZhK1wicXVldWVIb29rc1wiLGY9bi50aW1lcnMsZz1MLmdldCh0aGlzKTtpZihlKWdbZV0mJmdbZV0uc3RvcCYmZChnW2VdKTtlbHNlIGZvcihlIGluIGcpZ1tlXSYmZ1tlXS5zdG9wJiZQYS50ZXN0KGUpJiZkKGdbZV0pO2ZvcihlPWYubGVuZ3RoO2UtLTspZltlXS5lbGVtIT09dGhpc3x8bnVsbCE9YSYmZltlXS5xdWV1ZSE9PWF8fChmW2VdLmFuaW0uc3RvcChjKSxiPSExLGYuc3BsaWNlKGUsMSkpOyhifHwhYykmJm4uZGVxdWV1ZSh0aGlzLGEpfSl9LGZpbmlzaDpmdW5jdGlvbihhKXtyZXR1cm4gYSE9PSExJiYoYT1hfHxcImZ4XCIpLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiLGM9TC5nZXQodGhpcyksZD1jW2ErXCJxdWV1ZVwiXSxlPWNbYStcInF1ZXVlSG9va3NcIl0sZj1uLnRpbWVycyxnPWQ/ZC5sZW5ndGg6MDtmb3IoYy5maW5pc2g9ITAsbi5xdWV1ZSh0aGlzLGEsW10pLGUmJmUuc3RvcCYmZS5zdG9wLmNhbGwodGhpcywhMCksYj1mLmxlbmd0aDtiLS07KWZbYl0uZWxlbT09PXRoaXMmJmZbYl0ucXVldWU9PT1hJiYoZltiXS5hbmltLnN0b3AoITApLGYuc3BsaWNlKGIsMSkpO2ZvcihiPTA7Zz5iO2IrKylkW2JdJiZkW2JdLmZpbmlzaCYmZFtiXS5maW5pc2guY2FsbCh0aGlzKTtkZWxldGUgYy5maW5pc2h9KX19KSxuLmVhY2goW1widG9nZ2xlXCIsXCJzaG93XCIsXCJoaWRlXCJdLGZ1bmN0aW9uKGEsYil7dmFyIGM9bi5mbltiXTtuLmZuW2JdPWZ1bmN0aW9uKGEsZCxlKXtyZXR1cm4gbnVsbD09YXx8XCJib29sZWFuXCI9PXR5cGVvZiBhP2MuYXBwbHkodGhpcyxhcmd1bWVudHMpOnRoaXMuYW5pbWF0ZShUYShiLCEwKSxhLGQsZSl9fSksbi5lYWNoKHtzbGlkZURvd246VGEoXCJzaG93XCIpLHNsaWRlVXA6VGEoXCJoaWRlXCIpLHNsaWRlVG9nZ2xlOlRhKFwidG9nZ2xlXCIpLGZhZGVJbjp7b3BhY2l0eTpcInNob3dcIn0sZmFkZU91dDp7b3BhY2l0eTpcImhpZGVcIn0sZmFkZVRvZ2dsZTp7b3BhY2l0eTpcInRvZ2dsZVwifX0sZnVuY3Rpb24oYSxiKXtuLmZuW2FdPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gdGhpcy5hbmltYXRlKGIsYSxjLGQpfX0pLG4udGltZXJzPVtdLG4uZngudGljaz1mdW5jdGlvbigpe3ZhciBhLGI9MCxjPW4udGltZXJzO2ZvcihMYT1uLm5vdygpO2I8Yy5sZW5ndGg7YisrKWE9Y1tiXSxhKCl8fGNbYl0hPT1hfHxjLnNwbGljZShiLS0sMSk7Yy5sZW5ndGh8fG4uZnguc3RvcCgpLExhPXZvaWQgMH0sbi5meC50aW1lcj1mdW5jdGlvbihhKXtuLnRpbWVycy5wdXNoKGEpLGEoKT9uLmZ4LnN0YXJ0KCk6bi50aW1lcnMucG9wKCl9LG4uZnguaW50ZXJ2YWw9MTMsbi5meC5zdGFydD1mdW5jdGlvbigpe01hfHwoTWE9c2V0SW50ZXJ2YWwobi5meC50aWNrLG4uZnguaW50ZXJ2YWwpKX0sbi5meC5zdG9wPWZ1bmN0aW9uKCl7Y2xlYXJJbnRlcnZhbChNYSksTWE9bnVsbH0sbi5meC5zcGVlZHM9e3Nsb3c6NjAwLGZhc3Q6MjAwLF9kZWZhdWx0OjQwMH0sbi5mbi5kZWxheT1mdW5jdGlvbihhLGIpe3JldHVybiBhPW4uZng/bi5meC5zcGVlZHNbYV18fGE6YSxiPWJ8fFwiZnhcIix0aGlzLnF1ZXVlKGIsZnVuY3Rpb24oYixjKXt2YXIgZD1zZXRUaW1lb3V0KGIsYSk7Yy5zdG9wPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGQpfX0pfSxmdW5jdGlvbigpe3ZhciBhPWwuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLGI9bC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpLGM9Yi5hcHBlbmRDaGlsZChsLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikpO2EudHlwZT1cImNoZWNrYm94XCIsay5jaGVja09uPVwiXCIhPT1hLnZhbHVlLGsub3B0U2VsZWN0ZWQ9Yy5zZWxlY3RlZCxiLmRpc2FibGVkPSEwLGsub3B0RGlzYWJsZWQ9IWMuZGlzYWJsZWQsYT1sLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxhLnZhbHVlPVwidFwiLGEudHlwZT1cInJhZGlvXCIsay5yYWRpb1ZhbHVlPVwidFwiPT09YS52YWx1ZX0oKTt2YXIgWWEsWmEsJGE9bi5leHByLmF0dHJIYW5kbGU7bi5mbi5leHRlbmQoe2F0dHI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gSih0aGlzLG4uYXR0cixhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0scmVtb3ZlQXR0cjpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7bi5yZW1vdmVBdHRyKHRoaXMsYSl9KX19KSxuLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmPWEubm9kZVR5cGU7aWYoYSYmMyE9PWYmJjghPT1mJiYyIT09ZilyZXR1cm4gdHlwZW9mIGEuZ2V0QXR0cmlidXRlPT09VT9uLnByb3AoYSxiLGMpOigxPT09ZiYmbi5pc1hNTERvYyhhKXx8KGI9Yi50b0xvd2VyQ2FzZSgpLGQ9bi5hdHRySG9va3NbYl18fChuLmV4cHIubWF0Y2guYm9vbC50ZXN0KGIpP1phOllhKSksXG52b2lkIDA9PT1jP2QmJlwiZ2V0XCJpbiBkJiZudWxsIT09KGU9ZC5nZXQoYSxiKSk/ZTooZT1uLmZpbmQuYXR0cihhLGIpLG51bGw9PWU/dm9pZCAwOmUpOm51bGwhPT1jP2QmJlwic2V0XCJpbiBkJiZ2b2lkIDAhPT0oZT1kLnNldChhLGMsYikpP2U6KGEuc2V0QXR0cmlidXRlKGIsYytcIlwiKSxjKTp2b2lkIG4ucmVtb3ZlQXR0cihhLGIpKX0scmVtb3ZlQXR0cjpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZT0wLGY9YiYmYi5tYXRjaChFKTtpZihmJiYxPT09YS5ub2RlVHlwZSl3aGlsZShjPWZbZSsrXSlkPW4ucHJvcEZpeFtjXXx8YyxuLmV4cHIubWF0Y2guYm9vbC50ZXN0KGMpJiYoYVtkXT0hMSksYS5yZW1vdmVBdHRyaWJ1dGUoYyl9LGF0dHJIb29rczp7dHlwZTp7c2V0OmZ1bmN0aW9uKGEsYil7aWYoIWsucmFkaW9WYWx1ZSYmXCJyYWRpb1wiPT09YiYmbi5ub2RlTmFtZShhLFwiaW5wdXRcIikpe3ZhciBjPWEudmFsdWU7cmV0dXJuIGEuc2V0QXR0cmlidXRlKFwidHlwZVwiLGIpLGMmJihhLnZhbHVlPWMpLGJ9fX19fSksWmE9e3NldDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGI9PT0hMT9uLnJlbW92ZUF0dHIoYSxjKTphLnNldEF0dHJpYnV0ZShjLGMpLGN9fSxuLmVhY2gobi5leHByLm1hdGNoLmJvb2wuc291cmNlLm1hdGNoKC9cXHcrL2cpLGZ1bmN0aW9uKGEsYil7dmFyIGM9JGFbYl18fG4uZmluZC5hdHRyOyRhW2JdPWZ1bmN0aW9uKGEsYixkKXt2YXIgZSxmO3JldHVybiBkfHwoZj0kYVtiXSwkYVtiXT1lLGU9bnVsbCE9YyhhLGIsZCk/Yi50b0xvd2VyQ2FzZSgpOm51bGwsJGFbYl09ZiksZX19KTt2YXIgX2E9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaTtuLmZuLmV4dGVuZCh7cHJvcDpmdW5jdGlvbihhLGIpe3JldHVybiBKKHRoaXMsbi5wcm9wLGEsYixhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVQcm9wOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtkZWxldGUgdGhpc1tuLnByb3BGaXhbYV18fGFdfSl9fSksbi5leHRlbmQoe3Byb3BGaXg6e1wiZm9yXCI6XCJodG1sRm9yXCIsXCJjbGFzc1wiOlwiY2xhc3NOYW1lXCJ9LHByb3A6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnPWEubm9kZVR5cGU7aWYoYSYmMyE9PWcmJjghPT1nJiYyIT09ZylyZXR1cm4gZj0xIT09Z3x8IW4uaXNYTUxEb2MoYSksZiYmKGI9bi5wcm9wRml4W2JdfHxiLGU9bi5wcm9wSG9va3NbYl0pLHZvaWQgMCE9PWM/ZSYmXCJzZXRcImluIGUmJnZvaWQgMCE9PShkPWUuc2V0KGEsYyxiKSk/ZDphW2JdPWM6ZSYmXCJnZXRcImluIGUmJm51bGwhPT0oZD1lLmdldChhLGIpKT9kOmFbYl19LHByb3BIb29rczp7dGFiSW5kZXg6e2dldDpmdW5jdGlvbihhKXtyZXR1cm4gYS5oYXNBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKXx8X2EudGVzdChhLm5vZGVOYW1lKXx8YS5ocmVmP2EudGFiSW5kZXg6LTF9fX19KSxrLm9wdFNlbGVjdGVkfHwobi5wcm9wSG9va3Muc2VsZWN0ZWQ9e2dldDpmdW5jdGlvbihhKXt2YXIgYj1hLnBhcmVudE5vZGU7cmV0dXJuIGImJmIucGFyZW50Tm9kZSYmYi5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgsbnVsbH19KSxuLmVhY2goW1widGFiSW5kZXhcIixcInJlYWRPbmx5XCIsXCJtYXhMZW5ndGhcIixcImNlbGxTcGFjaW5nXCIsXCJjZWxsUGFkZGluZ1wiLFwicm93U3BhblwiLFwiY29sU3BhblwiLFwidXNlTWFwXCIsXCJmcmFtZUJvcmRlclwiLFwiY29udGVudEVkaXRhYmxlXCJdLGZ1bmN0aW9uKCl7bi5wcm9wRml4W3RoaXMudG9Mb3dlckNhc2UoKV09dGhpc30pO3ZhciBhYj0vW1xcdFxcclxcblxcZl0vZztuLmZuLmV4dGVuZCh7YWRkQ2xhc3M6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZixnLGg9XCJzdHJpbmdcIj09dHlwZW9mIGEmJmEsaT0wLGo9dGhpcy5sZW5ndGg7aWYobi5pc0Z1bmN0aW9uKGEpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oYil7bih0aGlzKS5hZGRDbGFzcyhhLmNhbGwodGhpcyxiLHRoaXMuY2xhc3NOYW1lKSl9KTtpZihoKWZvcihiPShhfHxcIlwiKS5tYXRjaChFKXx8W107aj5pO2krKylpZihjPXRoaXNbaV0sZD0xPT09Yy5ub2RlVHlwZSYmKGMuY2xhc3NOYW1lPyhcIiBcIitjLmNsYXNzTmFtZStcIiBcIikucmVwbGFjZShhYixcIiBcIik6XCIgXCIpKXtmPTA7d2hpbGUoZT1iW2YrK10pZC5pbmRleE9mKFwiIFwiK2UrXCIgXCIpPDAmJihkKz1lK1wiIFwiKTtnPW4udHJpbShkKSxjLmNsYXNzTmFtZSE9PWcmJihjLmNsYXNzTmFtZT1nKX1yZXR1cm4gdGhpc30scmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZixnLGg9MD09PWFyZ3VtZW50cy5sZW5ndGh8fFwic3RyaW5nXCI9PXR5cGVvZiBhJiZhLGk9MCxqPXRoaXMubGVuZ3RoO2lmKG4uaXNGdW5jdGlvbihhKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGIpe24odGhpcykucmVtb3ZlQ2xhc3MoYS5jYWxsKHRoaXMsYix0aGlzLmNsYXNzTmFtZSkpfSk7aWYoaClmb3IoYj0oYXx8XCJcIikubWF0Y2goRSl8fFtdO2o+aTtpKyspaWYoYz10aGlzW2ldLGQ9MT09PWMubm9kZVR5cGUmJihjLmNsYXNzTmFtZT8oXCIgXCIrYy5jbGFzc05hbWUrXCIgXCIpLnJlcGxhY2UoYWIsXCIgXCIpOlwiXCIpKXtmPTA7d2hpbGUoZT1iW2YrK10pd2hpbGUoZC5pbmRleE9mKFwiIFwiK2UrXCIgXCIpPj0wKWQ9ZC5yZXBsYWNlKFwiIFwiK2UrXCIgXCIsXCIgXCIpO2c9YT9uLnRyaW0oZCk6XCJcIixjLmNsYXNzTmFtZSE9PWcmJihjLmNsYXNzTmFtZT1nKX1yZXR1cm4gdGhpc30sdG9nZ2xlQ2xhc3M6ZnVuY3Rpb24oYSxiKXt2YXIgYz10eXBlb2YgYTtyZXR1cm5cImJvb2xlYW5cIj09dHlwZW9mIGImJlwic3RyaW5nXCI9PT1jP2I/dGhpcy5hZGRDbGFzcyhhKTp0aGlzLnJlbW92ZUNsYXNzKGEpOnRoaXMuZWFjaChuLmlzRnVuY3Rpb24oYSk/ZnVuY3Rpb24oYyl7bih0aGlzKS50b2dnbGVDbGFzcyhhLmNhbGwodGhpcyxjLHRoaXMuY2xhc3NOYW1lLGIpLGIpfTpmdW5jdGlvbigpe2lmKFwic3RyaW5nXCI9PT1jKXt2YXIgYixkPTAsZT1uKHRoaXMpLGY9YS5tYXRjaChFKXx8W107d2hpbGUoYj1mW2QrK10pZS5oYXNDbGFzcyhiKT9lLnJlbW92ZUNsYXNzKGIpOmUuYWRkQ2xhc3MoYil9ZWxzZShjPT09VXx8XCJib29sZWFuXCI9PT1jKSYmKHRoaXMuY2xhc3NOYW1lJiZMLnNldCh0aGlzLFwiX19jbGFzc05hbWVfX1wiLHRoaXMuY2xhc3NOYW1lKSx0aGlzLmNsYXNzTmFtZT10aGlzLmNsYXNzTmFtZXx8YT09PSExP1wiXCI6TC5nZXQodGhpcyxcIl9fY2xhc3NOYW1lX19cIil8fFwiXCIpfSl9LGhhc0NsYXNzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cIiBcIithK1wiIFwiLGM9MCxkPXRoaXMubGVuZ3RoO2Q+YztjKyspaWYoMT09PXRoaXNbY10ubm9kZVR5cGUmJihcIiBcIit0aGlzW2NdLmNsYXNzTmFtZStcIiBcIikucmVwbGFjZShhYixcIiBcIikuaW5kZXhPZihiKT49MClyZXR1cm4hMDtyZXR1cm4hMX19KTt2YXIgYmI9L1xcci9nO24uZm4uZXh0ZW5kKHt2YWw6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGU9dGhpc1swXTt7aWYoYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZD1uLmlzRnVuY3Rpb24oYSksdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe3ZhciBlOzE9PT10aGlzLm5vZGVUeXBlJiYoZT1kP2EuY2FsbCh0aGlzLGMsbih0aGlzKS52YWwoKSk6YSxudWxsPT1lP2U9XCJcIjpcIm51bWJlclwiPT10eXBlb2YgZT9lKz1cIlwiOm4uaXNBcnJheShlKSYmKGU9bi5tYXAoZSxmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT9cIlwiOmErXCJcIn0pKSxiPW4udmFsSG9va3NbdGhpcy50eXBlXXx8bi52YWxIb29rc1t0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLGImJlwic2V0XCJpbiBiJiZ2b2lkIDAhPT1iLnNldCh0aGlzLGUsXCJ2YWx1ZVwiKXx8KHRoaXMudmFsdWU9ZSkpfSk7aWYoZSlyZXR1cm4gYj1uLnZhbEhvb2tzW2UudHlwZV18fG4udmFsSG9va3NbZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSxiJiZcImdldFwiaW4gYiYmdm9pZCAwIT09KGM9Yi5nZXQoZSxcInZhbHVlXCIpKT9jOihjPWUudmFsdWUsXCJzdHJpbmdcIj09dHlwZW9mIGM/Yy5yZXBsYWNlKGJiLFwiXCIpOm51bGw9PWM/XCJcIjpjKX19fSksbi5leHRlbmQoe3ZhbEhvb2tzOntvcHRpb246e2dldDpmdW5jdGlvbihhKXt2YXIgYj1uLmZpbmQuYXR0cihhLFwidmFsdWVcIik7cmV0dXJuIG51bGwhPWI/YjpuLnRyaW0obi50ZXh0KGEpKX19LHNlbGVjdDp7Z2V0OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjLGQ9YS5vcHRpb25zLGU9YS5zZWxlY3RlZEluZGV4LGY9XCJzZWxlY3Qtb25lXCI9PT1hLnR5cGV8fDA+ZSxnPWY/bnVsbDpbXSxoPWY/ZSsxOmQubGVuZ3RoLGk9MD5lP2g6Zj9lOjA7aD5pO2krKylpZihjPWRbaV0sISghYy5zZWxlY3RlZCYmaSE9PWV8fChrLm9wdERpc2FibGVkP2MuZGlzYWJsZWQ6bnVsbCE9PWMuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIikpfHxjLnBhcmVudE5vZGUuZGlzYWJsZWQmJm4ubm9kZU5hbWUoYy5wYXJlbnROb2RlLFwib3B0Z3JvdXBcIikpKXtpZihiPW4oYykudmFsKCksZilyZXR1cm4gYjtnLnB1c2goYil9cmV0dXJuIGd9LHNldDpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZT1hLm9wdGlvbnMsZj1uLm1ha2VBcnJheShiKSxnPWUubGVuZ3RoO3doaWxlKGctLSlkPWVbZ10sKGQuc2VsZWN0ZWQ9bi5pbkFycmF5KGQudmFsdWUsZik+PTApJiYoYz0hMCk7cmV0dXJuIGN8fChhLnNlbGVjdGVkSW5kZXg9LTEpLGZ9fX19KSxuLmVhY2goW1wicmFkaW9cIixcImNoZWNrYm94XCJdLGZ1bmN0aW9uKCl7bi52YWxIb29rc1t0aGlzXT17c2V0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIG4uaXNBcnJheShiKT9hLmNoZWNrZWQ9bi5pbkFycmF5KG4oYSkudmFsKCksYik+PTA6dm9pZCAwfX0say5jaGVja09ufHwobi52YWxIb29rc1t0aGlzXS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PT1hLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpP1wib25cIjphLnZhbHVlfSl9KSxuLmVhY2goXCJibHVyIGZvY3VzIGZvY3VzaW4gZm9jdXNvdXQgbG9hZCByZXNpemUgc2Nyb2xsIHVubG9hZCBjbGljayBkYmxjbGljayBtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZSBjaGFuZ2Ugc2VsZWN0IHN1Ym1pdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yIGNvbnRleHRtZW51XCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEsYil7bi5mbltiXT1mdW5jdGlvbihhLGMpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPjA/dGhpcy5vbihiLG51bGwsYSxjKTp0aGlzLnRyaWdnZXIoYil9fSksbi5mbi5leHRlbmQoe2hvdmVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMubW91c2VlbnRlcihhKS5tb3VzZWxlYXZlKGJ8fGEpfSxiaW5kOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5vbihhLG51bGwsYixjKX0sdW5iaW5kOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMub2ZmKGEsbnVsbCxiKX0sZGVsZWdhdGU6ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIHRoaXMub24oYixhLGMsZCl9LHVuZGVsZWdhdGU6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiAxPT09YXJndW1lbnRzLmxlbmd0aD90aGlzLm9mZihhLFwiKipcIik6dGhpcy5vZmYoYixhfHxcIioqXCIsYyl9fSk7dmFyIGNiPW4ubm93KCksZGI9L1xcPy87bi5wYXJzZUpTT049ZnVuY3Rpb24oYSl7cmV0dXJuIEpTT04ucGFyc2UoYStcIlwiKX0sbi5wYXJzZVhNTD1mdW5jdGlvbihhKXt2YXIgYixjO2lmKCFhfHxcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm4gbnVsbDt0cnl7Yz1uZXcgRE9NUGFyc2VyLGI9Yy5wYXJzZUZyb21TdHJpbmcoYSxcInRleHQveG1sXCIpfWNhdGNoKGQpe2I9dm9pZCAwfXJldHVybighYnx8Yi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpLmxlbmd0aCkmJm4uZXJyb3IoXCJJbnZhbGlkIFhNTDogXCIrYSksYn07dmFyIGViPS8jLiokLyxmYj0vKFs/Jl0pXz1bXiZdKi8sZ2I9L14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9nbSxoYj0vXig/OmFib3V0fGFwcHxhcHAtc3RvcmFnZXwuKy1leHRlbnNpb258ZmlsZXxyZXN8d2lkZ2V0KTokLyxpYj0vXig/OkdFVHxIRUFEKSQvLGpiPS9eXFwvXFwvLyxrYj0vXihbXFx3ListXSs6KSg/OlxcL1xcLyg/OlteXFwvPyNdKkB8KShbXlxcLz8jOl0qKSg/OjooXFxkKyl8KXwpLyxsYj17fSxtYj17fSxuYj1cIiovXCIuY29uY2F0KFwiKlwiKSxvYj1hLmxvY2F0aW9uLmhyZWYscGI9a2IuZXhlYyhvYi50b0xvd2VyQ2FzZSgpKXx8W107ZnVuY3Rpb24gcWIoYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7XCJzdHJpbmdcIiE9dHlwZW9mIGImJihjPWIsYj1cIipcIik7dmFyIGQsZT0wLGY9Yi50b0xvd2VyQ2FzZSgpLm1hdGNoKEUpfHxbXTtpZihuLmlzRnVuY3Rpb24oYykpd2hpbGUoZD1mW2UrK10pXCIrXCI9PT1kWzBdPyhkPWQuc2xpY2UoMSl8fFwiKlwiLChhW2RdPWFbZF18fFtdKS51bnNoaWZ0KGMpKTooYVtkXT1hW2RdfHxbXSkucHVzaChjKX19ZnVuY3Rpb24gcmIoYSxiLGMsZCl7dmFyIGU9e30sZj1hPT09bWI7ZnVuY3Rpb24gZyhoKXt2YXIgaTtyZXR1cm4gZVtoXT0hMCxuLmVhY2goYVtoXXx8W10sZnVuY3Rpb24oYSxoKXt2YXIgaj1oKGIsYyxkKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2Yganx8Znx8ZVtqXT9mPyEoaT1qKTp2b2lkIDA6KGIuZGF0YVR5cGVzLnVuc2hpZnQoaiksZyhqKSwhMSl9KSxpfXJldHVybiBnKGIuZGF0YVR5cGVzWzBdKXx8IWVbXCIqXCJdJiZnKFwiKlwiKX1mdW5jdGlvbiBzYihhLGIpe3ZhciBjLGQsZT1uLmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9uc3x8e307Zm9yKGMgaW4gYil2b2lkIDAhPT1iW2NdJiYoKGVbY10/YTpkfHwoZD17fSkpW2NdPWJbY10pO3JldHVybiBkJiZuLmV4dGVuZCghMCxhLGQpLGF9ZnVuY3Rpb24gdGIoYSxiLGMpe3ZhciBkLGUsZixnLGg9YS5jb250ZW50cyxpPWEuZGF0YVR5cGVzO3doaWxlKFwiKlwiPT09aVswXSlpLnNoaWZ0KCksdm9pZCAwPT09ZCYmKGQ9YS5taW1lVHlwZXx8Yi5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7aWYoZClmb3IoZSBpbiBoKWlmKGhbZV0mJmhbZV0udGVzdChkKSl7aS51bnNoaWZ0KGUpO2JyZWFrfWlmKGlbMF1pbiBjKWY9aVswXTtlbHNle2ZvcihlIGluIGMpe2lmKCFpWzBdfHxhLmNvbnZlcnRlcnNbZStcIiBcIitpWzBdXSl7Zj1lO2JyZWFrfWd8fChnPWUpfWY9Znx8Z31yZXR1cm4gZj8oZiE9PWlbMF0mJmkudW5zaGlmdChmKSxjW2ZdKTp2b2lkIDB9ZnVuY3Rpb24gdWIoYSxiLGMsZCl7dmFyIGUsZixnLGgsaSxqPXt9LGs9YS5kYXRhVHlwZXMuc2xpY2UoKTtpZihrWzFdKWZvcihnIGluIGEuY29udmVydGVycylqW2cudG9Mb3dlckNhc2UoKV09YS5jb252ZXJ0ZXJzW2ddO2Y9ay5zaGlmdCgpO3doaWxlKGYpaWYoYS5yZXNwb25zZUZpZWxkc1tmXSYmKGNbYS5yZXNwb25zZUZpZWxkc1tmXV09YiksIWkmJmQmJmEuZGF0YUZpbHRlciYmKGI9YS5kYXRhRmlsdGVyKGIsYS5kYXRhVHlwZSkpLGk9ZixmPWsuc2hpZnQoKSlpZihcIipcIj09PWYpZj1pO2Vsc2UgaWYoXCIqXCIhPT1pJiZpIT09Zil7aWYoZz1qW2krXCIgXCIrZl18fGpbXCIqIFwiK2ZdLCFnKWZvcihlIGluIGopaWYoaD1lLnNwbGl0KFwiIFwiKSxoWzFdPT09ZiYmKGc9altpK1wiIFwiK2hbMF1dfHxqW1wiKiBcIitoWzBdXSkpe2c9PT0hMD9nPWpbZV06altlXSE9PSEwJiYoZj1oWzBdLGsudW5zaGlmdChoWzFdKSk7YnJlYWt9aWYoZyE9PSEwKWlmKGcmJmFbXCJ0aHJvd3NcIl0pYj1nKGIpO2Vsc2UgdHJ5e2I9ZyhiKX1jYXRjaChsKXtyZXR1cm57c3RhdGU6XCJwYXJzZXJlcnJvclwiLGVycm9yOmc/bDpcIk5vIGNvbnZlcnNpb24gZnJvbSBcIitpK1wiIHRvIFwiK2Z9fX1yZXR1cm57c3RhdGU6XCJzdWNjZXNzXCIsZGF0YTpifX1uLmV4dGVuZCh7YWN0aXZlOjAsbGFzdE1vZGlmaWVkOnt9LGV0YWc6e30sYWpheFNldHRpbmdzOnt1cmw6b2IsdHlwZTpcIkdFVFwiLGlzTG9jYWw6aGIudGVzdChwYlsxXSksZ2xvYmFsOiEwLHByb2Nlc3NEYXRhOiEwLGFzeW5jOiEwLGNvbnRlbnRUeXBlOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCIsYWNjZXB0czp7XCIqXCI6bmIsdGV4dDpcInRleHQvcGxhaW5cIixodG1sOlwidGV4dC9odG1sXCIseG1sOlwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLGpzb246XCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIn0sY29udGVudHM6e3htbDoveG1sLyxodG1sOi9odG1sLyxqc29uOi9qc29uL30scmVzcG9uc2VGaWVsZHM6e3htbDpcInJlc3BvbnNlWE1MXCIsdGV4dDpcInJlc3BvbnNlVGV4dFwiLGpzb246XCJyZXNwb25zZUpTT05cIn0sY29udmVydGVyczp7XCIqIHRleHRcIjpTdHJpbmcsXCJ0ZXh0IGh0bWxcIjohMCxcInRleHQganNvblwiOm4ucGFyc2VKU09OLFwidGV4dCB4bWxcIjpuLnBhcnNlWE1MfSxmbGF0T3B0aW9uczp7dXJsOiEwLGNvbnRleHQ6ITB9fSxhamF4U2V0dXA6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj9zYihzYihhLG4uYWpheFNldHRpbmdzKSxiKTpzYihuLmFqYXhTZXR0aW5ncyxhKX0sYWpheFByZWZpbHRlcjpxYihsYiksYWpheFRyYW5zcG9ydDpxYihtYiksYWpheDpmdW5jdGlvbihhLGIpe1wib2JqZWN0XCI9PXR5cGVvZiBhJiYoYj1hLGE9dm9pZCAwKSxiPWJ8fHt9O3ZhciBjLGQsZSxmLGcsaCxpLGosaz1uLmFqYXhTZXR1cCh7fSxiKSxsPWsuY29udGV4dHx8ayxtPWsuY29udGV4dCYmKGwubm9kZVR5cGV8fGwuanF1ZXJ5KT9uKGwpOm4uZXZlbnQsbz1uLkRlZmVycmVkKCkscD1uLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLHE9ay5zdGF0dXNDb2RlfHx7fSxyPXt9LHM9e30sdD0wLHU9XCJjYW5jZWxlZFwiLHY9e3JlYWR5U3RhdGU6MCxnZXRSZXNwb25zZUhlYWRlcjpmdW5jdGlvbihhKXt2YXIgYjtpZigyPT09dCl7aWYoIWYpe2Y9e307d2hpbGUoYj1nYi5leGVjKGUpKWZbYlsxXS50b0xvd2VyQ2FzZSgpXT1iWzJdfWI9ZlthLnRvTG93ZXJDYXNlKCldfXJldHVybiBudWxsPT1iP251bGw6Yn0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIDI9PT10P2U6bnVsbH0sc2V0UmVxdWVzdEhlYWRlcjpmdW5jdGlvbihhLGIpe3ZhciBjPWEudG9Mb3dlckNhc2UoKTtyZXR1cm4gdHx8KGE9c1tjXT1zW2NdfHxhLHJbYV09YiksdGhpc30sb3ZlcnJpZGVNaW1lVHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gdHx8KGsubWltZVR5cGU9YSksdGhpc30sc3RhdHVzQ29kZTpmdW5jdGlvbihhKXt2YXIgYjtpZihhKWlmKDI+dClmb3IoYiBpbiBhKXFbYl09W3FbYl0sYVtiXV07ZWxzZSB2LmFsd2F5cyhhW3Yuc3RhdHVzXSk7cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGEpe3ZhciBiPWF8fHU7cmV0dXJuIGMmJmMuYWJvcnQoYikseCgwLGIpLHRoaXN9fTtpZihvLnByb21pc2UodikuY29tcGxldGU9cC5hZGQsdi5zdWNjZXNzPXYuZG9uZSx2LmVycm9yPXYuZmFpbCxrLnVybD0oKGF8fGsudXJsfHxvYikrXCJcIikucmVwbGFjZShlYixcIlwiKS5yZXBsYWNlKGpiLHBiWzFdK1wiLy9cIiksay50eXBlPWIubWV0aG9kfHxiLnR5cGV8fGsubWV0aG9kfHxrLnR5cGUsay5kYXRhVHlwZXM9bi50cmltKGsuZGF0YVR5cGV8fFwiKlwiKS50b0xvd2VyQ2FzZSgpLm1hdGNoKEUpfHxbXCJcIl0sbnVsbD09ay5jcm9zc0RvbWFpbiYmKGg9a2IuZXhlYyhrLnVybC50b0xvd2VyQ2FzZSgpKSxrLmNyb3NzRG9tYWluPSEoIWh8fGhbMV09PT1wYlsxXSYmaFsyXT09PXBiWzJdJiYoaFszXXx8KFwiaHR0cDpcIj09PWhbMV0/XCI4MFwiOlwiNDQzXCIpKT09PShwYlszXXx8KFwiaHR0cDpcIj09PXBiWzFdP1wiODBcIjpcIjQ0M1wiKSkpKSxrLmRhdGEmJmsucHJvY2Vzc0RhdGEmJlwic3RyaW5nXCIhPXR5cGVvZiBrLmRhdGEmJihrLmRhdGE9bi5wYXJhbShrLmRhdGEsay50cmFkaXRpb25hbCkpLHJiKGxiLGssYix2KSwyPT09dClyZXR1cm4gdjtpPW4uZXZlbnQmJmsuZ2xvYmFsLGkmJjA9PT1uLmFjdGl2ZSsrJiZuLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RhcnRcIiksay50eXBlPWsudHlwZS50b1VwcGVyQ2FzZSgpLGsuaGFzQ29udGVudD0haWIudGVzdChrLnR5cGUpLGQ9ay51cmwsay5oYXNDb250ZW50fHwoay5kYXRhJiYoZD1rLnVybCs9KGRiLnRlc3QoZCk/XCImXCI6XCI/XCIpK2suZGF0YSxkZWxldGUgay5kYXRhKSxrLmNhY2hlPT09ITEmJihrLnVybD1mYi50ZXN0KGQpP2QucmVwbGFjZShmYixcIiQxXz1cIitjYisrKTpkKyhkYi50ZXN0KGQpP1wiJlwiOlwiP1wiKStcIl89XCIrY2IrKykpLGsuaWZNb2RpZmllZCYmKG4ubGFzdE1vZGlmaWVkW2RdJiZ2LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Nb2RpZmllZC1TaW5jZVwiLG4ubGFzdE1vZGlmaWVkW2RdKSxuLmV0YWdbZF0mJnYuc2V0UmVxdWVzdEhlYWRlcihcIklmLU5vbmUtTWF0Y2hcIixuLmV0YWdbZF0pKSwoay5kYXRhJiZrLmhhc0NvbnRlbnQmJmsuY29udGVudFR5cGUhPT0hMXx8Yi5jb250ZW50VHlwZSkmJnYuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLGsuY29udGVudFR5cGUpLHYuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLGsuZGF0YVR5cGVzWzBdJiZrLmFjY2VwdHNbay5kYXRhVHlwZXNbMF1dP2suYWNjZXB0c1trLmRhdGFUeXBlc1swXV0rKFwiKlwiIT09ay5kYXRhVHlwZXNbMF0/XCIsIFwiK25iK1wiOyBxPTAuMDFcIjpcIlwiKTprLmFjY2VwdHNbXCIqXCJdKTtmb3IoaiBpbiBrLmhlYWRlcnMpdi5zZXRSZXF1ZXN0SGVhZGVyKGosay5oZWFkZXJzW2pdKTtpZihrLmJlZm9yZVNlbmQmJihrLmJlZm9yZVNlbmQuY2FsbChsLHYsayk9PT0hMXx8Mj09PXQpKXJldHVybiB2LmFib3J0KCk7dT1cImFib3J0XCI7Zm9yKGogaW57c3VjY2VzczoxLGVycm9yOjEsY29tcGxldGU6MX0pdltqXShrW2pdKTtpZihjPXJiKG1iLGssYix2KSl7di5yZWFkeVN0YXRlPTEsaSYmbS50cmlnZ2VyKFwiYWpheFNlbmRcIixbdixrXSksay5hc3luYyYmay50aW1lb3V0PjAmJihnPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt2LmFib3J0KFwidGltZW91dFwiKX0say50aW1lb3V0KSk7dHJ5e3Q9MSxjLnNlbmQocix4KX1jYXRjaCh3KXtpZighKDI+dCkpdGhyb3cgdzt4KC0xLHcpfX1lbHNlIHgoLTEsXCJObyBUcmFuc3BvcnRcIik7ZnVuY3Rpb24geChhLGIsZixoKXt2YXIgaixyLHMsdSx3LHg9YjsyIT09dCYmKHQ9MixnJiZjbGVhclRpbWVvdXQoZyksYz12b2lkIDAsZT1ofHxcIlwiLHYucmVhZHlTdGF0ZT1hPjA/NDowLGo9YT49MjAwJiYzMDA+YXx8MzA0PT09YSxmJiYodT10YihrLHYsZikpLHU9dWIoayx1LHYsaiksaj8oay5pZk1vZGlmaWVkJiYodz12LmdldFJlc3BvbnNlSGVhZGVyKFwiTGFzdC1Nb2RpZmllZFwiKSx3JiYobi5sYXN0TW9kaWZpZWRbZF09dyksdz12LmdldFJlc3BvbnNlSGVhZGVyKFwiZXRhZ1wiKSx3JiYobi5ldGFnW2RdPXcpKSwyMDQ9PT1hfHxcIkhFQURcIj09PWsudHlwZT94PVwibm9jb250ZW50XCI6MzA0PT09YT94PVwibm90bW9kaWZpZWRcIjooeD11LnN0YXRlLHI9dS5kYXRhLHM9dS5lcnJvcixqPSFzKSk6KHM9eCwoYXx8IXgpJiYoeD1cImVycm9yXCIsMD5hJiYoYT0wKSkpLHYuc3RhdHVzPWEsdi5zdGF0dXNUZXh0PShifHx4KStcIlwiLGo/by5yZXNvbHZlV2l0aChsLFtyLHgsdl0pOm8ucmVqZWN0V2l0aChsLFt2LHgsc10pLHYuc3RhdHVzQ29kZShxKSxxPXZvaWQgMCxpJiZtLnRyaWdnZXIoaj9cImFqYXhTdWNjZXNzXCI6XCJhamF4RXJyb3JcIixbdixrLGo/cjpzXSkscC5maXJlV2l0aChsLFt2LHhdKSxpJiYobS50cmlnZ2VyKFwiYWpheENvbXBsZXRlXCIsW3Ysa10pLC0tbi5hY3RpdmV8fG4uZXZlbnQudHJpZ2dlcihcImFqYXhTdG9wXCIpKSl9cmV0dXJuIHZ9LGdldEpTT046ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBuLmdldChhLGIsYyxcImpzb25cIil9LGdldFNjcmlwdDpmdW5jdGlvbihhLGIpe3JldHVybiBuLmdldChhLHZvaWQgMCxiLFwic2NyaXB0XCIpfX0pLG4uZWFjaChbXCJnZXRcIixcInBvc3RcIl0sZnVuY3Rpb24oYSxiKXtuW2JdPWZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBuLmlzRnVuY3Rpb24oYykmJihlPWV8fGQsZD1jLGM9dm9pZCAwKSxuLmFqYXgoe3VybDphLHR5cGU6YixkYXRhVHlwZTplLGRhdGE6YyxzdWNjZXNzOmR9KX19KSxuLl9ldmFsVXJsPWZ1bmN0aW9uKGEpe3JldHVybiBuLmFqYXgoe3VybDphLHR5cGU6XCJHRVRcIixkYXRhVHlwZTpcInNjcmlwdFwiLGFzeW5jOiExLGdsb2JhbDohMSxcInRocm93c1wiOiEwfSl9LG4uZm4uZXh0ZW5kKHt3cmFwQWxsOmZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiBuLmlzRnVuY3Rpb24oYSk/dGhpcy5lYWNoKGZ1bmN0aW9uKGIpe24odGhpcykud3JhcEFsbChhLmNhbGwodGhpcyxiKSl9KToodGhpc1swXSYmKGI9bihhLHRoaXNbMF0ub3duZXJEb2N1bWVudCkuZXEoMCkuY2xvbmUoITApLHRoaXNbMF0ucGFyZW50Tm9kZSYmYi5pbnNlcnRCZWZvcmUodGhpc1swXSksYi5tYXAoZnVuY3Rpb24oKXt2YXIgYT10aGlzO3doaWxlKGEuZmlyc3RFbGVtZW50Q2hpbGQpYT1hLmZpcnN0RWxlbWVudENoaWxkO3JldHVybiBhfSkuYXBwZW5kKHRoaXMpKSx0aGlzKX0sd3JhcElubmVyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2gobi5pc0Z1bmN0aW9uKGEpP2Z1bmN0aW9uKGIpe24odGhpcykud3JhcElubmVyKGEuY2FsbCh0aGlzLGIpKX06ZnVuY3Rpb24oKXt2YXIgYj1uKHRoaXMpLGM9Yi5jb250ZW50cygpO2MubGVuZ3RoP2Mud3JhcEFsbChhKTpiLmFwcGVuZChhKX0pfSx3cmFwOmZ1bmN0aW9uKGEpe3ZhciBiPW4uaXNGdW5jdGlvbihhKTtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe24odGhpcykud3JhcEFsbChiP2EuY2FsbCh0aGlzLGMpOmEpfSl9LHVud3JhcDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudCgpLmVhY2goZnVuY3Rpb24oKXtuLm5vZGVOYW1lKHRoaXMsXCJib2R5XCIpfHxuKHRoaXMpLnJlcGxhY2VXaXRoKHRoaXMuY2hpbGROb2Rlcyl9KS5lbmQoKX19KSxuLmV4cHIuZmlsdGVycy5oaWRkZW49ZnVuY3Rpb24oYSl7cmV0dXJuIGEub2Zmc2V0V2lkdGg8PTAmJmEub2Zmc2V0SGVpZ2h0PD0wfSxuLmV4cHIuZmlsdGVycy52aXNpYmxlPWZ1bmN0aW9uKGEpe3JldHVybiFuLmV4cHIuZmlsdGVycy5oaWRkZW4oYSl9O3ZhciB2Yj0vJTIwL2csd2I9L1xcW1xcXSQvLHhiPS9cXHI/XFxuL2cseWI9L14oPzpzdWJtaXR8YnV0dG9ufGltYWdlfHJlc2V0fGZpbGUpJC9pLHpiPS9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGtleWdlbikvaTtmdW5jdGlvbiBBYihhLGIsYyxkKXt2YXIgZTtpZihuLmlzQXJyYXkoYikpbi5lYWNoKGIsZnVuY3Rpb24oYixlKXtjfHx3Yi50ZXN0KGEpP2QoYSxlKTpBYihhK1wiW1wiKyhcIm9iamVjdFwiPT10eXBlb2YgZT9iOlwiXCIpK1wiXVwiLGUsYyxkKX0pO2Vsc2UgaWYoY3x8XCJvYmplY3RcIiE9PW4udHlwZShiKSlkKGEsYik7ZWxzZSBmb3IoZSBpbiBiKUFiKGErXCJbXCIrZStcIl1cIixiW2VdLGMsZCl9bi5wYXJhbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9W10sZT1mdW5jdGlvbihhLGIpe2I9bi5pc0Z1bmN0aW9uKGIpP2IoKTpudWxsPT1iP1wiXCI6YixkW2QubGVuZ3RoXT1lbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGIpfTtpZih2b2lkIDA9PT1iJiYoYj1uLmFqYXhTZXR0aW5ncyYmbi5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWwpLG4uaXNBcnJheShhKXx8YS5qcXVlcnkmJiFuLmlzUGxhaW5PYmplY3QoYSkpbi5lYWNoKGEsZnVuY3Rpb24oKXtlKHRoaXMubmFtZSx0aGlzLnZhbHVlKX0pO2Vsc2UgZm9yKGMgaW4gYSlBYihjLGFbY10sYixlKTtyZXR1cm4gZC5qb2luKFwiJlwiKS5yZXBsYWNlKHZiLFwiK1wiKX0sbi5mbi5leHRlbmQoe3NlcmlhbGl6ZTpmdW5jdGlvbigpe3JldHVybiBuLnBhcmFtKHRoaXMuc2VyaWFsaXplQXJyYXkoKSl9LHNlcmlhbGl6ZUFycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7dmFyIGE9bi5wcm9wKHRoaXMsXCJlbGVtZW50c1wiKTtyZXR1cm4gYT9uLm1ha2VBcnJheShhKTp0aGlzfSkuZmlsdGVyKGZ1bmN0aW9uKCl7dmFyIGE9dGhpcy50eXBlO3JldHVybiB0aGlzLm5hbWUmJiFuKHRoaXMpLmlzKFwiOmRpc2FibGVkXCIpJiZ6Yi50ZXN0KHRoaXMubm9kZU5hbWUpJiYheWIudGVzdChhKSYmKHRoaXMuY2hlY2tlZHx8IVQudGVzdChhKSl9KS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz1uKHRoaXMpLnZhbCgpO3JldHVybiBudWxsPT1jP251bGw6bi5pc0FycmF5KGMpP24ubWFwKGMsZnVuY3Rpb24oYSl7cmV0dXJue25hbWU6Yi5uYW1lLHZhbHVlOmEucmVwbGFjZSh4YixcIlxcclxcblwiKX19KTp7bmFtZTpiLm5hbWUsdmFsdWU6Yy5yZXBsYWNlKHhiLFwiXFxyXFxuXCIpfX0pLmdldCgpfX0pLG4uYWpheFNldHRpbmdzLnhocj1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKGEpe319O3ZhciBCYj0wLENiPXt9LERiPXswOjIwMCwxMjIzOjIwNH0sRWI9bi5hamF4U2V0dGluZ3MueGhyKCk7YS5hdHRhY2hFdmVudCYmYS5hdHRhY2hFdmVudChcIm9udW5sb2FkXCIsZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gQ2IpQ2JbYV0oKX0pLGsuY29ycz0hIUViJiZcIndpdGhDcmVkZW50aWFsc1wiaW4gRWIsay5hamF4PUViPSEhRWIsbi5hamF4VHJhbnNwb3J0KGZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiBrLmNvcnN8fEViJiYhYS5jcm9zc0RvbWFpbj97c2VuZDpmdW5jdGlvbihjLGQpe3ZhciBlLGY9YS54aHIoKSxnPSsrQmI7aWYoZi5vcGVuKGEudHlwZSxhLnVybCxhLmFzeW5jLGEudXNlcm5hbWUsYS5wYXNzd29yZCksYS54aHJGaWVsZHMpZm9yKGUgaW4gYS54aHJGaWVsZHMpZltlXT1hLnhockZpZWxkc1tlXTthLm1pbWVUeXBlJiZmLm92ZXJyaWRlTWltZVR5cGUmJmYub3ZlcnJpZGVNaW1lVHlwZShhLm1pbWVUeXBlKSxhLmNyb3NzRG9tYWlufHxjW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXXx8KGNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdPVwiWE1MSHR0cFJlcXVlc3RcIik7Zm9yKGUgaW4gYylmLnNldFJlcXVlc3RIZWFkZXIoZSxjW2VdKTtiPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe2ImJihkZWxldGUgQ2JbZ10sYj1mLm9ubG9hZD1mLm9uZXJyb3I9bnVsbCxcImFib3J0XCI9PT1hP2YuYWJvcnQoKTpcImVycm9yXCI9PT1hP2QoZi5zdGF0dXMsZi5zdGF0dXNUZXh0KTpkKERiW2Yuc3RhdHVzXXx8Zi5zdGF0dXMsZi5zdGF0dXNUZXh0LFwic3RyaW5nXCI9PXR5cGVvZiBmLnJlc3BvbnNlVGV4dD97dGV4dDpmLnJlc3BvbnNlVGV4dH06dm9pZCAwLGYuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKX19LGYub25sb2FkPWIoKSxmLm9uZXJyb3I9YihcImVycm9yXCIpLGI9Q2JbZ109YihcImFib3J0XCIpO3RyeXtmLnNlbmQoYS5oYXNDb250ZW50JiZhLmRhdGF8fG51bGwpfWNhdGNoKGgpe2lmKGIpdGhyb3cgaH19LGFib3J0OmZ1bmN0aW9uKCl7YiYmYigpfX06dm9pZCAwfSksbi5hamF4U2V0dXAoe2FjY2VwdHM6e3NjcmlwdDpcInRleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCwgYXBwbGljYXRpb24vZWNtYXNjcmlwdCwgYXBwbGljYXRpb24veC1lY21hc2NyaXB0XCJ9LGNvbnRlbnRzOntzY3JpcHQ6Lyg/OmphdmF8ZWNtYSlzY3JpcHQvfSxjb252ZXJ0ZXJzOntcInRleHQgc2NyaXB0XCI6ZnVuY3Rpb24oYSl7cmV0dXJuIG4uZ2xvYmFsRXZhbChhKSxhfX19KSxuLmFqYXhQcmVmaWx0ZXIoXCJzY3JpcHRcIixmdW5jdGlvbihhKXt2b2lkIDA9PT1hLmNhY2hlJiYoYS5jYWNoZT0hMSksYS5jcm9zc0RvbWFpbiYmKGEudHlwZT1cIkdFVFwiKX0pLG4uYWpheFRyYW5zcG9ydChcInNjcmlwdFwiLGZ1bmN0aW9uKGEpe2lmKGEuY3Jvc3NEb21haW4pe3ZhciBiLGM7cmV0dXJue3NlbmQ6ZnVuY3Rpb24oZCxlKXtiPW4oXCI8c2NyaXB0PlwiKS5wcm9wKHthc3luYzohMCxjaGFyc2V0OmEuc2NyaXB0Q2hhcnNldCxzcmM6YS51cmx9KS5vbihcImxvYWQgZXJyb3JcIixjPWZ1bmN0aW9uKGEpe2IucmVtb3ZlKCksYz1udWxsLGEmJmUoXCJlcnJvclwiPT09YS50eXBlPzQwNDoyMDAsYS50eXBlKX0pLGwuaGVhZC5hcHBlbmRDaGlsZChiWzBdKX0sYWJvcnQ6ZnVuY3Rpb24oKXtjJiZjKCl9fX19KTt2YXIgRmI9W10sR2I9Lyg9KVxcPyg/PSZ8JCl8XFw/XFw/LztuLmFqYXhTZXR1cCh7anNvbnA6XCJjYWxsYmFja1wiLGpzb25wQ2FsbGJhY2s6ZnVuY3Rpb24oKXt2YXIgYT1GYi5wb3AoKXx8bi5leHBhbmRvK1wiX1wiK2NiKys7cmV0dXJuIHRoaXNbYV09ITAsYX19KSxuLmFqYXhQcmVmaWx0ZXIoXCJqc29uIGpzb25wXCIsZnVuY3Rpb24oYixjLGQpe3ZhciBlLGYsZyxoPWIuanNvbnAhPT0hMSYmKEdiLnRlc3QoYi51cmwpP1widXJsXCI6XCJzdHJpbmdcIj09dHlwZW9mIGIuZGF0YSYmIShiLmNvbnRlbnRUeXBlfHxcIlwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpJiZHYi50ZXN0KGIuZGF0YSkmJlwiZGF0YVwiKTtyZXR1cm4gaHx8XCJqc29ucFwiPT09Yi5kYXRhVHlwZXNbMF0/KGU9Yi5qc29ucENhbGxiYWNrPW4uaXNGdW5jdGlvbihiLmpzb25wQ2FsbGJhY2spP2IuanNvbnBDYWxsYmFjaygpOmIuanNvbnBDYWxsYmFjayxoP2JbaF09YltoXS5yZXBsYWNlKEdiLFwiJDFcIitlKTpiLmpzb25wIT09ITEmJihiLnVybCs9KGRiLnRlc3QoYi51cmwpP1wiJlwiOlwiP1wiKStiLmpzb25wK1wiPVwiK2UpLGIuY29udmVydGVyc1tcInNjcmlwdCBqc29uXCJdPWZ1bmN0aW9uKCl7cmV0dXJuIGd8fG4uZXJyb3IoZStcIiB3YXMgbm90IGNhbGxlZFwiKSxnWzBdfSxiLmRhdGFUeXBlc1swXT1cImpzb25cIixmPWFbZV0sYVtlXT1mdW5jdGlvbigpe2c9YXJndW1lbnRzfSxkLmFsd2F5cyhmdW5jdGlvbigpe2FbZV09ZixiW2VdJiYoYi5qc29ucENhbGxiYWNrPWMuanNvbnBDYWxsYmFjayxGYi5wdXNoKGUpKSxnJiZuLmlzRnVuY3Rpb24oZikmJmYoZ1swXSksZz1mPXZvaWQgMH0pLFwic2NyaXB0XCIpOnZvaWQgMH0pLG4ucGFyc2VIVE1MPWZ1bmN0aW9uKGEsYixjKXtpZighYXx8XCJzdHJpbmdcIiE9dHlwZW9mIGEpcmV0dXJuIG51bGw7XCJib29sZWFuXCI9PXR5cGVvZiBiJiYoYz1iLGI9ITEpLGI9Ynx8bDt2YXIgZD12LmV4ZWMoYSksZT0hYyYmW107cmV0dXJuIGQ/W2IuY3JlYXRlRWxlbWVudChkWzFdKV06KGQ9bi5idWlsZEZyYWdtZW50KFthXSxiLGUpLGUmJmUubGVuZ3RoJiZuKGUpLnJlbW92ZSgpLG4ubWVyZ2UoW10sZC5jaGlsZE5vZGVzKSl9O3ZhciBIYj1uLmZuLmxvYWQ7bi5mbi5sb2FkPWZ1bmN0aW9uKGEsYixjKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYSYmSGIpcmV0dXJuIEhiLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgZCxlLGYsZz10aGlzLGg9YS5pbmRleE9mKFwiIFwiKTtyZXR1cm4gaD49MCYmKGQ9bi50cmltKGEuc2xpY2UoaCkpLGE9YS5zbGljZSgwLGgpKSxuLmlzRnVuY3Rpb24oYik/KGM9YixiPXZvaWQgMCk6YiYmXCJvYmplY3RcIj09dHlwZW9mIGImJihlPVwiUE9TVFwiKSxnLmxlbmd0aD4wJiZuLmFqYXgoe3VybDphLHR5cGU6ZSxkYXRhVHlwZTpcImh0bWxcIixkYXRhOmJ9KS5kb25lKGZ1bmN0aW9uKGEpe2Y9YXJndW1lbnRzLGcuaHRtbChkP24oXCI8ZGl2PlwiKS5hcHBlbmQobi5wYXJzZUhUTUwoYSkpLmZpbmQoZCk6YSl9KS5jb21wbGV0ZShjJiZmdW5jdGlvbihhLGIpe2cuZWFjaChjLGZ8fFthLnJlc3BvbnNlVGV4dCxiLGFdKX0pLHRoaXN9LG4uZWFjaChbXCJhamF4U3RhcnRcIixcImFqYXhTdG9wXCIsXCJhamF4Q29tcGxldGVcIixcImFqYXhFcnJvclwiLFwiYWpheFN1Y2Nlc3NcIixcImFqYXhTZW5kXCJdLGZ1bmN0aW9uKGEsYil7bi5mbltiXT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vbihiLGEpfX0pLG4uZXhwci5maWx0ZXJzLmFuaW1hdGVkPWZ1bmN0aW9uKGEpe3JldHVybiBuLmdyZXAobi50aW1lcnMsZnVuY3Rpb24oYil7cmV0dXJuIGE9PT1iLmVsZW19KS5sZW5ndGh9O3ZhciBJYj1hLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtmdW5jdGlvbiBKYihhKXtyZXR1cm4gbi5pc1dpbmRvdyhhKT9hOjk9PT1hLm5vZGVUeXBlJiZhLmRlZmF1bHRWaWV3fW4ub2Zmc2V0PXtzZXRPZmZzZXQ6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnLGgsaSxqLGs9bi5jc3MoYSxcInBvc2l0aW9uXCIpLGw9bihhKSxtPXt9O1wic3RhdGljXCI9PT1rJiYoYS5zdHlsZS5wb3NpdGlvbj1cInJlbGF0aXZlXCIpLGg9bC5vZmZzZXQoKSxmPW4uY3NzKGEsXCJ0b3BcIiksaT1uLmNzcyhhLFwibGVmdFwiKSxqPShcImFic29sdXRlXCI9PT1rfHxcImZpeGVkXCI9PT1rKSYmKGYraSkuaW5kZXhPZihcImF1dG9cIik+LTEsaj8oZD1sLnBvc2l0aW9uKCksZz1kLnRvcCxlPWQubGVmdCk6KGc9cGFyc2VGbG9hdChmKXx8MCxlPXBhcnNlRmxvYXQoaSl8fDApLG4uaXNGdW5jdGlvbihiKSYmKGI9Yi5jYWxsKGEsYyxoKSksbnVsbCE9Yi50b3AmJihtLnRvcD1iLnRvcC1oLnRvcCtnKSxudWxsIT1iLmxlZnQmJihtLmxlZnQ9Yi5sZWZ0LWgubGVmdCtlKSxcInVzaW5nXCJpbiBiP2IudXNpbmcuY2FsbChhLG0pOmwuY3NzKG0pfX0sbi5mbi5leHRlbmQoe29mZnNldDpmdW5jdGlvbihhKXtpZihhcmd1bWVudHMubGVuZ3RoKXJldHVybiB2b2lkIDA9PT1hP3RoaXM6dGhpcy5lYWNoKGZ1bmN0aW9uKGIpe24ub2Zmc2V0LnNldE9mZnNldCh0aGlzLGEsYil9KTt2YXIgYixjLGQ9dGhpc1swXSxlPXt0b3A6MCxsZWZ0OjB9LGY9ZCYmZC5vd25lckRvY3VtZW50O2lmKGYpcmV0dXJuIGI9Zi5kb2N1bWVudEVsZW1lbnQsbi5jb250YWlucyhiLGQpPyh0eXBlb2YgZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QhPT1VJiYoZT1kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxjPUpiKGYpLHt0b3A6ZS50b3ArYy5wYWdlWU9mZnNldC1iLmNsaWVudFRvcCxsZWZ0OmUubGVmdCtjLnBhZ2VYT2Zmc2V0LWIuY2xpZW50TGVmdH0pOmV9LHBvc2l0aW9uOmZ1bmN0aW9uKCl7aWYodGhpc1swXSl7dmFyIGEsYixjPXRoaXNbMF0sZD17dG9wOjAsbGVmdDowfTtyZXR1cm5cImZpeGVkXCI9PT1uLmNzcyhjLFwicG9zaXRpb25cIik/Yj1jLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOihhPXRoaXMub2Zmc2V0UGFyZW50KCksYj10aGlzLm9mZnNldCgpLG4ubm9kZU5hbWUoYVswXSxcImh0bWxcIil8fChkPWEub2Zmc2V0KCkpLGQudG9wKz1uLmNzcyhhWzBdLFwiYm9yZGVyVG9wV2lkdGhcIiwhMCksZC5sZWZ0Kz1uLmNzcyhhWzBdLFwiYm9yZGVyTGVmdFdpZHRoXCIsITApKSx7dG9wOmIudG9wLWQudG9wLW4uY3NzKGMsXCJtYXJnaW5Ub3BcIiwhMCksbGVmdDpiLmxlZnQtZC5sZWZ0LW4uY3NzKGMsXCJtYXJnaW5MZWZ0XCIsITApfX19LG9mZnNldFBhcmVudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe3ZhciBhPXRoaXMub2Zmc2V0UGFyZW50fHxJYjt3aGlsZShhJiYhbi5ub2RlTmFtZShhLFwiaHRtbFwiKSYmXCJzdGF0aWNcIj09PW4uY3NzKGEsXCJwb3NpdGlvblwiKSlhPWEub2Zmc2V0UGFyZW50O3JldHVybiBhfHxJYn0pfX0pLG4uZWFjaCh7c2Nyb2xsTGVmdDpcInBhZ2VYT2Zmc2V0XCIsc2Nyb2xsVG9wOlwicGFnZVlPZmZzZXRcIn0sZnVuY3Rpb24oYixjKXt2YXIgZD1cInBhZ2VZT2Zmc2V0XCI9PT1jO24uZm5bYl09ZnVuY3Rpb24oZSl7cmV0dXJuIEoodGhpcyxmdW5jdGlvbihiLGUsZil7dmFyIGc9SmIoYik7cmV0dXJuIHZvaWQgMD09PWY/Zz9nW2NdOmJbZV06dm9pZChnP2cuc2Nyb2xsVG8oZD9hLnBhZ2VYT2Zmc2V0OmYsZD9mOmEucGFnZVlPZmZzZXQpOmJbZV09Zil9LGIsZSxhcmd1bWVudHMubGVuZ3RoLG51bGwpfX0pLG4uZWFjaChbXCJ0b3BcIixcImxlZnRcIl0sZnVuY3Rpb24oYSxiKXtuLmNzc0hvb2tzW2JdPXlhKGsucGl4ZWxQb3NpdGlvbixmdW5jdGlvbihhLGMpe3JldHVybiBjPyhjPXhhKGEsYiksdmEudGVzdChjKT9uKGEpLnBvc2l0aW9uKClbYl0rXCJweFwiOmMpOnZvaWQgMH0pfSksbi5lYWNoKHtIZWlnaHQ6XCJoZWlnaHRcIixXaWR0aDpcIndpZHRoXCJ9LGZ1bmN0aW9uKGEsYil7bi5lYWNoKHtwYWRkaW5nOlwiaW5uZXJcIithLGNvbnRlbnQ6YixcIlwiOlwib3V0ZXJcIithfSxmdW5jdGlvbihjLGQpe24uZm5bZF09ZnVuY3Rpb24oZCxlKXt2YXIgZj1hcmd1bWVudHMubGVuZ3RoJiYoY3x8XCJib29sZWFuXCIhPXR5cGVvZiBkKSxnPWN8fChkPT09ITB8fGU9PT0hMD9cIm1hcmdpblwiOlwiYm9yZGVyXCIpO3JldHVybiBKKHRoaXMsZnVuY3Rpb24oYixjLGQpe3ZhciBlO3JldHVybiBuLmlzV2luZG93KGIpP2IuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W1wiY2xpZW50XCIrYV06OT09PWIubm9kZVR5cGU/KGU9Yi5kb2N1bWVudEVsZW1lbnQsTWF0aC5tYXgoYi5ib2R5W1wic2Nyb2xsXCIrYV0sZVtcInNjcm9sbFwiK2FdLGIuYm9keVtcIm9mZnNldFwiK2FdLGVbXCJvZmZzZXRcIithXSxlW1wiY2xpZW50XCIrYV0pKTp2b2lkIDA9PT1kP24uY3NzKGIsYyxnKTpuLnN0eWxlKGIsYyxkLGcpfSxiLGY/ZDp2b2lkIDAsZixudWxsKX19KX0pLG4uZm4uc2l6ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxlbmd0aH0sbi5mbi5hbmRTZWxmPW4uZm4uYWRkQmFjayxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQmJmRlZmluZShcImpxdWVyeVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIG59KTt2YXIgS2I9YS5qUXVlcnksTGI9YS4kO3JldHVybiBuLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oYil7cmV0dXJuIGEuJD09PW4mJihhLiQ9TGIpLGImJmEualF1ZXJ5PT09biYmKGEualF1ZXJ5PUtiKSxufSx0eXBlb2YgYj09PVUmJihhLmpRdWVyeT1hLiQ9biksbn0pO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiAkICE9IFwidW5kZWZpbmVkXCIgPyAkIDogd2luZG93LiQpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCJcbjsgcmVxdWlyZShcIi9Vc2Vycy9uYWJyaXNraS9wcm9qZWN0cy92YXN0L2pzL2pxdWVyeS5qc1wiKTtcbjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGRlZmluZSwgcmVxdWlyZSkge1xuKGZ1bmN0aW9uKGUpe2lmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXCJqcXVlcnlcIl0sZSl9ZWxzZXtlKGpRdWVyeSl9fSkoZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9e30sbj1NYXRoLm1heCxyPU1hdGgubWluO3QuYz17fTt0LmMuZD1lKGRvY3VtZW50KTt0LmMudD1mdW5jdGlvbihlKXtyZXR1cm4gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoLTF9O3Qubz1mdW5jdGlvbigpe3ZhciBuPXRoaXM7dGhpcy5vPW51bGw7dGhpcy4kPW51bGw7dGhpcy5pPW51bGw7dGhpcy5nPW51bGw7dGhpcy52PW51bGw7dGhpcy5jdj1udWxsO3RoaXMueD0wO3RoaXMueT0wO3RoaXMudz0wO3RoaXMuaD0wO3RoaXMuJGM9bnVsbDt0aGlzLmM9bnVsbDt0aGlzLnQ9MDt0aGlzLmlzSW5pdD1mYWxzZTt0aGlzLmZnQ29sb3I9bnVsbDt0aGlzLnBDb2xvcj1udWxsO3RoaXMuZEg9bnVsbDt0aGlzLmNIPW51bGw7dGhpcy5lSD1udWxsO3RoaXMuckg9bnVsbDt0aGlzLnNjYWxlPTE7dGhpcy5yZWxhdGl2ZT1mYWxzZTt0aGlzLnJlbGF0aXZlV2lkdGg9ZmFsc2U7dGhpcy5yZWxhdGl2ZUhlaWdodD1mYWxzZTt0aGlzLiRkaXY9bnVsbDt0aGlzLnJ1bj1mdW5jdGlvbigpe3ZhciB0PWZ1bmN0aW9uKGUsdCl7dmFyIHI7Zm9yKHIgaW4gdCl7bi5vW3JdPXRbcl19bi5fY2FydmUoKS5pbml0KCk7bi5fY29uZmlndXJlKCkuX2RyYXcoKX07aWYodGhpcy4kLmRhdGEoXCJrb250cm9sZWRcIikpcmV0dXJuO3RoaXMuJC5kYXRhKFwia29udHJvbGVkXCIsdHJ1ZSk7dGhpcy5leHRlbmQoKTt0aGlzLm89ZS5leHRlbmQoe21pbjp0aGlzLiQuZGF0YShcIm1pblwiKSE9PXVuZGVmaW5lZD90aGlzLiQuZGF0YShcIm1pblwiKTowLG1heDp0aGlzLiQuZGF0YShcIm1heFwiKSE9PXVuZGVmaW5lZD90aGlzLiQuZGF0YShcIm1heFwiKToxMDAsc3RvcHBlcjp0cnVlLHJlYWRPbmx5OnRoaXMuJC5kYXRhKFwicmVhZG9ubHlcIil8fHRoaXMuJC5hdHRyKFwicmVhZG9ubHlcIik9PT1cInJlYWRvbmx5XCIsY3Vyc29yOnRoaXMuJC5kYXRhKFwiY3Vyc29yXCIpPT09dHJ1ZSYmMzB8fHRoaXMuJC5kYXRhKFwiY3Vyc29yXCIpfHwwLHRoaWNrbmVzczp0aGlzLiQuZGF0YShcInRoaWNrbmVzc1wiKSYmTWF0aC5tYXgoTWF0aC5taW4odGhpcy4kLmRhdGEoXCJ0aGlja25lc3NcIiksMSksLjAxKXx8LjM1LGxpbmVDYXA6dGhpcy4kLmRhdGEoXCJsaW5lY2FwXCIpfHxcImJ1dHRcIix3aWR0aDp0aGlzLiQuZGF0YShcIndpZHRoXCIpfHwyMDAsaGVpZ2h0OnRoaXMuJC5kYXRhKFwiaGVpZ2h0XCIpfHwyMDAsZGlzcGxheUlucHV0OnRoaXMuJC5kYXRhKFwiZGlzcGxheWlucHV0XCIpPT1udWxsfHx0aGlzLiQuZGF0YShcImRpc3BsYXlpbnB1dFwiKSxkaXNwbGF5UHJldmlvdXM6dGhpcy4kLmRhdGEoXCJkaXNwbGF5cHJldmlvdXNcIiksZmdDb2xvcjp0aGlzLiQuZGF0YShcImZnY29sb3JcIil8fFwiIzg3Q0VFQlwiLGlucHV0Q29sb3I6dGhpcy4kLmRhdGEoXCJpbnB1dGNvbG9yXCIpLGZvbnQ6dGhpcy4kLmRhdGEoXCJmb250XCIpfHxcIkFyaWFsXCIsZm9udFdlaWdodDp0aGlzLiQuZGF0YShcImZvbnQtd2VpZ2h0XCIpfHxcImJvbGRcIixpbmxpbmU6ZmFsc2Usc3RlcDp0aGlzLiQuZGF0YShcInN0ZXBcIil8fDEscm90YXRpb246dGhpcy4kLmRhdGEoXCJyb3RhdGlvblwiKSxkcmF3Om51bGwsY2hhbmdlOm51bGwsY2FuY2VsOm51bGwscmVsZWFzZTpudWxsLGZvcm1hdDpmdW5jdGlvbihlKXtyZXR1cm4gZX0scGFyc2U6ZnVuY3Rpb24oZSl7cmV0dXJuIHBhcnNlRmxvYXQoZSl9fSx0aGlzLm8pO3RoaXMuby5mbGlwPXRoaXMuby5yb3RhdGlvbj09PVwiYW50aWNsb2Nrd2lzZVwifHx0aGlzLm8ucm90YXRpb249PT1cImFjd1wiO2lmKCF0aGlzLm8uaW5wdXRDb2xvcil7dGhpcy5vLmlucHV0Q29sb3I9dGhpcy5vLmZnQ29sb3J9aWYodGhpcy4kLmlzKFwiZmllbGRzZXRcIikpe3RoaXMudj17fTt0aGlzLmk9dGhpcy4kLmZpbmQoXCJpbnB1dFwiKTt0aGlzLmkuZWFjaChmdW5jdGlvbih0KXt2YXIgcj1lKHRoaXMpO24uaVt0XT1yO24udlt0XT1uLm8ucGFyc2Uoci52YWwoKSk7ci5iaW5kKFwiY2hhbmdlIGJsdXJcIixmdW5jdGlvbigpe3ZhciBlPXt9O2VbdF09ci52YWwoKTtuLnZhbChuLl92YWxpZGF0ZShlKSl9KX0pO3RoaXMuJC5maW5kKFwibGVnZW5kXCIpLnJlbW92ZSgpfWVsc2V7dGhpcy5pPXRoaXMuJDt0aGlzLnY9dGhpcy5vLnBhcnNlKHRoaXMuJC52YWwoKSk7dGhpcy52PT09XCJcIiYmKHRoaXMudj10aGlzLm8ubWluKTt0aGlzLiQuYmluZChcImNoYW5nZSBibHVyXCIsZnVuY3Rpb24oKXtuLnZhbChuLl92YWxpZGF0ZShuLm8ucGFyc2Uobi4kLnZhbCgpKSkpfSl9IXRoaXMuby5kaXNwbGF5SW5wdXQmJnRoaXMuJC5oaWRlKCk7dGhpcy4kYz1lKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikpLmF0dHIoe3dpZHRoOnRoaXMuby53aWR0aCxoZWlnaHQ6dGhpcy5vLmhlaWdodH0pO3RoaXMuJGRpdj1lKCc8ZGl2IHN0eWxlPVwiJysodGhpcy5vLmlubGluZT9cImRpc3BsYXk6aW5saW5lO1wiOlwiXCIpK1wid2lkdGg6XCIrdGhpcy5vLndpZHRoK1wicHg7aGVpZ2h0OlwiK3RoaXMuby5oZWlnaHQrXCJweDtcIisnXCI+PC9kaXY+Jyk7dGhpcy4kLndyYXAodGhpcy4kZGl2KS5iZWZvcmUodGhpcy4kYyk7dGhpcy4kZGl2PXRoaXMuJC5wYXJlbnQoKTtpZih0eXBlb2YgR192bWxDYW52YXNNYW5hZ2VyIT09XCJ1bmRlZmluZWRcIil7R192bWxDYW52YXNNYW5hZ2VyLmluaXRFbGVtZW50KHRoaXMuJGNbMF0pfXRoaXMuYz10aGlzLiRjWzBdLmdldENvbnRleHQ/dGhpcy4kY1swXS5nZXRDb250ZXh0KFwiMmRcIik6bnVsbDtpZighdGhpcy5jKXt0aHJvd3tuYW1lOlwiQ2FudmFzTm90U3VwcG9ydGVkRXhjZXB0aW9uXCIsbWVzc2FnZTpcIkNhbnZhcyBub3Qgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIGV4Y2FudmFzIG9uIElFOC4wLlwiLHRvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmFtZStcIjogXCIrdGhpcy5tZXNzYWdlfX19dGhpcy5zY2FsZT0od2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLyh0aGlzLmMud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpb3x8dGhpcy5jLm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW98fHRoaXMuYy5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW98fHRoaXMuYy5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpb3x8dGhpcy5jLmJhY2tpbmdTdG9yZVBpeGVsUmF0aW98fDEpO3RoaXMucmVsYXRpdmVXaWR0aD10aGlzLm8ud2lkdGglMSE9PTAmJnRoaXMuby53aWR0aC5pbmRleE9mKFwiJVwiKTt0aGlzLnJlbGF0aXZlSGVpZ2h0PXRoaXMuby5oZWlnaHQlMSE9PTAmJnRoaXMuby5oZWlnaHQuaW5kZXhPZihcIiVcIik7dGhpcy5yZWxhdGl2ZT10aGlzLnJlbGF0aXZlV2lkdGh8fHRoaXMucmVsYXRpdmVIZWlnaHQ7dGhpcy5fY2FydmUoKTtpZih0aGlzLnYgaW5zdGFuY2VvZiBPYmplY3Qpe3RoaXMuY3Y9e307dGhpcy5jb3B5KHRoaXMudix0aGlzLmN2KX1lbHNle3RoaXMuY3Y9dGhpcy52fXRoaXMuJC5iaW5kKFwiY29uZmlndXJlXCIsdCkucGFyZW50KCkuYmluZChcImNvbmZpZ3VyZVwiLHQpO3RoaXMuX2xpc3RlbigpLl9jb25maWd1cmUoKS5feHkoKS5pbml0KCk7dGhpcy5pc0luaXQ9dHJ1ZTt0aGlzLiQudmFsKHRoaXMuby5mb3JtYXQodGhpcy52KSk7dGhpcy5fZHJhdygpO3JldHVybiB0aGlzfTt0aGlzLl9jYXJ2ZT1mdW5jdGlvbigpe2lmKHRoaXMucmVsYXRpdmUpe3ZhciBlPXRoaXMucmVsYXRpdmVXaWR0aD90aGlzLiRkaXYucGFyZW50KCkud2lkdGgoKSpwYXJzZUludCh0aGlzLm8ud2lkdGgpLzEwMDp0aGlzLiRkaXYucGFyZW50KCkud2lkdGgoKSx0PXRoaXMucmVsYXRpdmVIZWlnaHQ/dGhpcy4kZGl2LnBhcmVudCgpLmhlaWdodCgpKnBhcnNlSW50KHRoaXMuby5oZWlnaHQpLzEwMDp0aGlzLiRkaXYucGFyZW50KCkuaGVpZ2h0KCk7dGhpcy53PXRoaXMuaD1NYXRoLm1pbihlLHQpfWVsc2V7dGhpcy53PXRoaXMuby53aWR0aDt0aGlzLmg9dGhpcy5vLmhlaWdodH10aGlzLiRkaXYuY3NzKHt3aWR0aDp0aGlzLncrXCJweFwiLGhlaWdodDp0aGlzLmgrXCJweFwifSk7dGhpcy4kYy5hdHRyKHt3aWR0aDp0aGlzLncsaGVpZ2h0OnRoaXMuaH0pO2lmKHRoaXMuc2NhbGUhPT0xKXt0aGlzLiRjWzBdLndpZHRoPXRoaXMuJGNbMF0ud2lkdGgqdGhpcy5zY2FsZTt0aGlzLiRjWzBdLmhlaWdodD10aGlzLiRjWzBdLmhlaWdodCp0aGlzLnNjYWxlO3RoaXMuJGMud2lkdGgodGhpcy53KTt0aGlzLiRjLmhlaWdodCh0aGlzLmgpfXJldHVybiB0aGlzfTt0aGlzLl9kcmF3PWZ1bmN0aW9uKCl7dmFyIGU9dHJ1ZTtuLmc9bi5jO24uY2xlYXIoKTtuLmRIJiYoZT1uLmRIKCkpO2UhPT1mYWxzZSYmbi5kcmF3KCl9O3RoaXMuX3RvdWNoPWZ1bmN0aW9uKGUpe3ZhciByPWZ1bmN0aW9uKGUpe3ZhciB0PW4ueHkydmFsKGUub3JpZ2luYWxFdmVudC50b3VjaGVzW24udF0ucGFnZVgsZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbbi50XS5wYWdlWSk7aWYodD09bi5jdilyZXR1cm47aWYobi5jSCYmbi5jSCh0KT09PWZhbHNlKXJldHVybjtuLmNoYW5nZShuLl92YWxpZGF0ZSh0KSk7bi5fZHJhdygpfTt0aGlzLnQ9dC5jLnQoZSk7cihlKTt0LmMuZC5iaW5kKFwidG91Y2htb3ZlLmtcIixyKS5iaW5kKFwidG91Y2hlbmQua1wiLGZ1bmN0aW9uKCl7dC5jLmQudW5iaW5kKFwidG91Y2htb3ZlLmsgdG91Y2hlbmQua1wiKTtuLnZhbChuLmN2KX0pO3JldHVybiB0aGlzfTt0aGlzLl9tb3VzZT1mdW5jdGlvbihlKXt2YXIgcj1mdW5jdGlvbihlKXt2YXIgdD1uLnh5MnZhbChlLnBhZ2VYLGUucGFnZVkpO2lmKHQ9PW4uY3YpcmV0dXJuO2lmKG4uY0gmJm4uY0godCk9PT1mYWxzZSlyZXR1cm47bi5jaGFuZ2Uobi5fdmFsaWRhdGUodCkpO24uX2RyYXcoKX07cihlKTt0LmMuZC5iaW5kKFwibW91c2Vtb3ZlLmtcIixyKS5iaW5kKFwia2V5dXAua1wiLGZ1bmN0aW9uKGUpe2lmKGUua2V5Q29kZT09PTI3KXt0LmMuZC51bmJpbmQoXCJtb3VzZXVwLmsgbW91c2Vtb3ZlLmsga2V5dXAua1wiKTtpZihuLmVIJiZuLmVIKCk9PT1mYWxzZSlyZXR1cm47bi5jYW5jZWwoKX19KS5iaW5kKFwibW91c2V1cC5rXCIsZnVuY3Rpb24oZSl7dC5jLmQudW5iaW5kKFwibW91c2Vtb3ZlLmsgbW91c2V1cC5rIGtleXVwLmtcIik7bi52YWwobi5jdil9KTtyZXR1cm4gdGhpc307dGhpcy5feHk9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLiRjLm9mZnNldCgpO3RoaXMueD1lLmxlZnQ7dGhpcy55PWUudG9wO3JldHVybiB0aGlzfTt0aGlzLl9saXN0ZW49ZnVuY3Rpb24oKXtpZighdGhpcy5vLnJlYWRPbmx5KXt0aGlzLiRjLmJpbmQoXCJtb3VzZWRvd25cIixmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7bi5feHkoKS5fbW91c2UoZSl9KS5iaW5kKFwidG91Y2hzdGFydFwiLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTtuLl94eSgpLl90b3VjaChlKX0pO3RoaXMubGlzdGVuKCl9ZWxzZXt0aGlzLiQuYXR0cihcInJlYWRvbmx5XCIsXCJyZWFkb25seVwiKX1pZih0aGlzLnJlbGF0aXZlKXtlKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7bi5fY2FydmUoKS5pbml0KCk7bi5fZHJhdygpfSl9cmV0dXJuIHRoaXN9O3RoaXMuX2NvbmZpZ3VyZT1mdW5jdGlvbigpe2lmKHRoaXMuby5kcmF3KXRoaXMuZEg9dGhpcy5vLmRyYXc7aWYodGhpcy5vLmNoYW5nZSl0aGlzLmNIPXRoaXMuby5jaGFuZ2U7aWYodGhpcy5vLmNhbmNlbCl0aGlzLmVIPXRoaXMuby5jYW5jZWw7aWYodGhpcy5vLnJlbGVhc2UpdGhpcy5ySD10aGlzLm8ucmVsZWFzZTtpZih0aGlzLm8uZGlzcGxheVByZXZpb3VzKXt0aGlzLnBDb2xvcj10aGlzLmgycmdiYSh0aGlzLm8uZmdDb2xvcixcIjAuNFwiKTt0aGlzLmZnQ29sb3I9dGhpcy5oMnJnYmEodGhpcy5vLmZnQ29sb3IsXCIwLjZcIil9ZWxzZXt0aGlzLmZnQ29sb3I9dGhpcy5vLmZnQ29sb3J9cmV0dXJuIHRoaXN9O3RoaXMuX2NsZWFyPWZ1bmN0aW9uKCl7dGhpcy4kY1swXS53aWR0aD10aGlzLiRjWzBdLndpZHRofTt0aGlzLl92YWxpZGF0ZT1mdW5jdGlvbihlKXt2YXIgdD1+figoZTwwPy0uNTouNSkrZS90aGlzLm8uc3RlcCkqdGhpcy5vLnN0ZXA7cmV0dXJuIE1hdGgucm91bmQodCoxMDApLzEwMH07dGhpcy5saXN0ZW49ZnVuY3Rpb24oKXt9O3RoaXMuZXh0ZW5kPWZ1bmN0aW9uKCl7fTt0aGlzLmluaXQ9ZnVuY3Rpb24oKXt9O3RoaXMuY2hhbmdlPWZ1bmN0aW9uKGUpe307dGhpcy52YWw9ZnVuY3Rpb24oZSl7fTt0aGlzLnh5MnZhbD1mdW5jdGlvbihlLHQpe307dGhpcy5kcmF3PWZ1bmN0aW9uKCl7fTt0aGlzLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5fY2xlYXIoKX07dGhpcy5oMnJnYmE9ZnVuY3Rpb24oZSx0KXt2YXIgbjtlPWUuc3Vic3RyaW5nKDEsNyk7bj1bcGFyc2VJbnQoZS5zdWJzdHJpbmcoMCwyKSwxNikscGFyc2VJbnQoZS5zdWJzdHJpbmcoMiw0KSwxNikscGFyc2VJbnQoZS5zdWJzdHJpbmcoNCw2KSwxNildO3JldHVyblwicmdiYShcIituWzBdK1wiLFwiK25bMV0rXCIsXCIrblsyXStcIixcIit0K1wiKVwifTt0aGlzLmNvcHk9ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gZSl7dFtuXT1lW25dfX19O3QuRGlhbD1mdW5jdGlvbigpe3Quby5jYWxsKHRoaXMpO3RoaXMuc3RhcnRBbmdsZT1udWxsO3RoaXMueHk9bnVsbDt0aGlzLnJhZGl1cz1udWxsO3RoaXMubGluZVdpZHRoPW51bGw7dGhpcy5jdXJzb3JFeHQ9bnVsbDt0aGlzLncyPW51bGw7dGhpcy5QSTI9MipNYXRoLlBJO3RoaXMuZXh0ZW5kPWZ1bmN0aW9uKCl7dGhpcy5vPWUuZXh0ZW5kKHtiZ0NvbG9yOnRoaXMuJC5kYXRhKFwiYmdjb2xvclwiKXx8XCIjRUVFRUVFXCIsYW5nbGVPZmZzZXQ6dGhpcy4kLmRhdGEoXCJhbmdsZW9mZnNldFwiKXx8MCxhbmdsZUFyYzp0aGlzLiQuZGF0YShcImFuZ2xlYXJjXCIpfHwzNjAsaW5saW5lOnRydWV9LHRoaXMubyl9O3RoaXMudmFsPWZ1bmN0aW9uKGUsdCl7aWYobnVsbCE9ZSl7ZT10aGlzLm8ucGFyc2UoZSk7aWYodCE9PWZhbHNlJiZlIT10aGlzLnYmJnRoaXMuckgmJnRoaXMuckgoZSk9PT1mYWxzZSl7cmV0dXJufXRoaXMuY3Y9dGhpcy5vLnN0b3BwZXI/bihyKGUsdGhpcy5vLm1heCksdGhpcy5vLm1pbik6ZTt0aGlzLnY9dGhpcy5jdjt0aGlzLiQudmFsKHRoaXMuby5mb3JtYXQodGhpcy52KSk7dGhpcy5fZHJhdygpfWVsc2V7cmV0dXJuIHRoaXMudn19O3RoaXMueHkydmFsPWZ1bmN0aW9uKGUsdCl7dmFyIGkscztpPU1hdGguYXRhbjIoZS0odGhpcy54K3RoaXMudzIpLC0odC10aGlzLnktdGhpcy53MikpLXRoaXMuYW5nbGVPZmZzZXQ7aWYodGhpcy5vLmZsaXApe2k9dGhpcy5hbmdsZUFyYy1pLXRoaXMuUEkyfWlmKHRoaXMuYW5nbGVBcmMhPXRoaXMuUEkyJiZpPDAmJmk+LS41KXtpPTB9ZWxzZSBpZihpPDApe2krPXRoaXMuUEkyfXM9aSoodGhpcy5vLm1heC10aGlzLm8ubWluKS90aGlzLmFuZ2xlQXJjK3RoaXMuby5taW47dGhpcy5vLnN0b3BwZXImJihzPW4ocihzLHRoaXMuby5tYXgpLHRoaXMuby5taW4pKTtyZXR1cm4gc307dGhpcy5saXN0ZW49ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGkscyxvPWZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt2YXIgbz1lLm9yaWdpbmFsRXZlbnQsdT1vLmRldGFpbHx8by53aGVlbERlbHRhWCxhPW8uZGV0YWlsfHxvLndoZWVsRGVsdGFZLGY9dC5fdmFsaWRhdGUodC5vLnBhcnNlKHQuJC52YWwoKSkpKyh1PjB8fGE+MD90Lm8uc3RlcDp1PDB8fGE8MD8tdC5vLnN0ZXA6MCk7Zj1uKHIoZix0Lm8ubWF4KSx0Lm8ubWluKTt0LnZhbChmLGZhbHNlKTtpZih0LnJIKXtjbGVhclRpbWVvdXQoaSk7aT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5ySChmKTtpPW51bGx9LDEwMCk7aWYoIXMpe3M9c2V0VGltZW91dChmdW5jdGlvbigpe2lmKGkpdC5ySChmKTtzPW51bGx9LDIwMCl9fX0sdSxhLGY9MSxsPXszNzotdC5vLnN0ZXAsMzg6dC5vLnN0ZXAsMzk6dC5vLnN0ZXAsNDA6LXQuby5zdGVwfTt0aGlzLiQuYmluZChcImtleWRvd25cIixmdW5jdGlvbihpKXt2YXIgcz1pLmtleUNvZGU7aWYocz49OTYmJnM8PTEwNSl7cz1pLmtleUNvZGU9cy00OH11PXBhcnNlSW50KFN0cmluZy5mcm9tQ2hhckNvZGUocykpO2lmKGlzTmFOKHUpKXtzIT09MTMmJnMhPT04JiZzIT09OSYmcyE9PTE4OSYmKHMhPT0xOTB8fHQuJC52YWwoKS5tYXRjaCgvXFwuLykpJiZpLnByZXZlbnREZWZhdWx0KCk7aWYoZS5pbkFycmF5KHMsWzM3LDM4LDM5LDQwXSk+LTEpe2kucHJldmVudERlZmF1bHQoKTt2YXIgbz10Lm8ucGFyc2UodC4kLnZhbCgpKStsW3NdKmY7dC5vLnN0b3BwZXImJihvPW4ocihvLHQuby5tYXgpLHQuby5taW4pKTt0LmNoYW5nZSh0Ll92YWxpZGF0ZShvKSk7dC5fZHJhdygpO2E9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtmKj0yfSwzMCl9fX0pLmJpbmQoXCJrZXl1cFwiLGZ1bmN0aW9uKGUpe2lmKGlzTmFOKHUpKXtpZihhKXt3aW5kb3cuY2xlYXJUaW1lb3V0KGEpO2E9bnVsbDtmPTE7dC52YWwodC4kLnZhbCgpKX19ZWxzZXt0LiQudmFsKCk+dC5vLm1heCYmdC4kLnZhbCh0Lm8ubWF4KXx8dC4kLnZhbCgpPHQuby5taW4mJnQuJC52YWwodC5vLm1pbil9fSk7dGhpcy4kYy5iaW5kKFwibW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbFwiLG8pO3RoaXMuJC5iaW5kKFwibW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbFwiLG8pfTt0aGlzLmluaXQ9ZnVuY3Rpb24oKXtpZih0aGlzLnY8dGhpcy5vLm1pbnx8dGhpcy52PnRoaXMuby5tYXgpe3RoaXMudj10aGlzLm8ubWlufXRoaXMuJC52YWwodGhpcy52KTt0aGlzLncyPXRoaXMudy8yO3RoaXMuY3Vyc29yRXh0PXRoaXMuby5jdXJzb3IvMTAwO3RoaXMueHk9dGhpcy53Mip0aGlzLnNjYWxlO3RoaXMubGluZVdpZHRoPXRoaXMueHkqdGhpcy5vLnRoaWNrbmVzczt0aGlzLmxpbmVDYXA9dGhpcy5vLmxpbmVDYXA7dGhpcy5yYWRpdXM9dGhpcy54eS10aGlzLmxpbmVXaWR0aC8yO3RoaXMuby5hbmdsZU9mZnNldCYmKHRoaXMuby5hbmdsZU9mZnNldD1pc05hTih0aGlzLm8uYW5nbGVPZmZzZXQpPzA6dGhpcy5vLmFuZ2xlT2Zmc2V0KTt0aGlzLm8uYW5nbGVBcmMmJih0aGlzLm8uYW5nbGVBcmM9aXNOYU4odGhpcy5vLmFuZ2xlQXJjKT90aGlzLlBJMjp0aGlzLm8uYW5nbGVBcmMpO3RoaXMuYW5nbGVPZmZzZXQ9dGhpcy5vLmFuZ2xlT2Zmc2V0Kk1hdGguUEkvMTgwO3RoaXMuYW5nbGVBcmM9dGhpcy5vLmFuZ2xlQXJjKk1hdGguUEkvMTgwO3RoaXMuc3RhcnRBbmdsZT0xLjUqTWF0aC5QSSt0aGlzLmFuZ2xlT2Zmc2V0O3RoaXMuZW5kQW5nbGU9MS41Kk1hdGguUEkrdGhpcy5hbmdsZU9mZnNldCt0aGlzLmFuZ2xlQXJjO3ZhciBlPW4oU3RyaW5nKE1hdGguYWJzKHRoaXMuby5tYXgpKS5sZW5ndGgsU3RyaW5nKE1hdGguYWJzKHRoaXMuby5taW4pKS5sZW5ndGgsMikrMjt0aGlzLm8uZGlzcGxheUlucHV0JiZ0aGlzLmkuY3NzKHt3aWR0aDoodGhpcy53LzIrND4+MCkrXCJweFwiLGhlaWdodDoodGhpcy53LzM+PjApK1wicHhcIixwb3NpdGlvbjpcImFic29sdXRlXCIsXCJ2ZXJ0aWNhbC1hbGlnblwiOlwibWlkZGxlXCIsXCJtYXJnaW4tdG9wXCI6KHRoaXMudy8zPj4wKStcInB4XCIsXCJtYXJnaW4tbGVmdFwiOlwiLVwiKyh0aGlzLncqMy80KzI+PjApK1wicHhcIixib3JkZXI6MCxiYWNrZ3JvdW5kOlwibm9uZVwiLGZvbnQ6dGhpcy5vLmZvbnRXZWlnaHQrXCIgXCIrKHRoaXMudy9lPj4wKStcInB4IFwiK3RoaXMuby5mb250LFwidGV4dC1hbGlnblwiOlwiY2VudGVyXCIsY29sb3I6dGhpcy5vLmlucHV0Q29sb3J8fHRoaXMuby5mZ0NvbG9yLHBhZGRpbmc6XCIwcHhcIixcIi13ZWJraXQtYXBwZWFyYW5jZVwiOlwibm9uZVwifSl8fHRoaXMuaS5jc3Moe3dpZHRoOlwiMHB4XCIsdmlzaWJpbGl0eTpcImhpZGRlblwifSl9O3RoaXMuY2hhbmdlPWZ1bmN0aW9uKGUpe3RoaXMuY3Y9ZTt0aGlzLiQudmFsKHRoaXMuby5mb3JtYXQoZSkpfTt0aGlzLmFuZ2xlPWZ1bmN0aW9uKGUpe3JldHVybihlLXRoaXMuby5taW4pKnRoaXMuYW5nbGVBcmMvKHRoaXMuby5tYXgtdGhpcy5vLm1pbil9O3RoaXMuYXJjPWZ1bmN0aW9uKGUpe3ZhciB0LG47ZT10aGlzLmFuZ2xlKGUpO2lmKHRoaXMuby5mbGlwKXt0PXRoaXMuZW5kQW5nbGUrMWUtNTtuPXQtZS0xZS01fWVsc2V7dD10aGlzLnN0YXJ0QW5nbGUtMWUtNTtuPXQrZSsxZS01fXRoaXMuby5jdXJzb3ImJih0PW4tdGhpcy5jdXJzb3JFeHQpJiYobj1uK3RoaXMuY3Vyc29yRXh0KTtyZXR1cm57czp0LGU6bixkOnRoaXMuby5mbGlwJiYhdGhpcy5vLmN1cnNvcn19O3RoaXMuZHJhdz1mdW5jdGlvbigpe3ZhciBlPXRoaXMuZyx0PXRoaXMuYXJjKHRoaXMuY3YpLG4scj0xO2UubGluZVdpZHRoPXRoaXMubGluZVdpZHRoO2UubGluZUNhcD10aGlzLmxpbmVDYXA7aWYodGhpcy5vLmJnQ29sb3IhPT1cIm5vbmVcIil7ZS5iZWdpblBhdGgoKTtlLnN0cm9rZVN0eWxlPXRoaXMuby5iZ0NvbG9yO2UuYXJjKHRoaXMueHksdGhpcy54eSx0aGlzLnJhZGl1cyx0aGlzLmVuZEFuZ2xlLTFlLTUsdGhpcy5zdGFydEFuZ2xlKzFlLTUsdHJ1ZSk7ZS5zdHJva2UoKX1pZih0aGlzLm8uZGlzcGxheVByZXZpb3VzKXtuPXRoaXMuYXJjKHRoaXMudik7ZS5iZWdpblBhdGgoKTtlLnN0cm9rZVN0eWxlPXRoaXMucENvbG9yO2UuYXJjKHRoaXMueHksdGhpcy54eSx0aGlzLnJhZGl1cyxuLnMsbi5lLG4uZCk7ZS5zdHJva2UoKTtyPXRoaXMuY3Y9PXRoaXMudn1lLmJlZ2luUGF0aCgpO2Uuc3Ryb2tlU3R5bGU9cj90aGlzLm8uZmdDb2xvcjp0aGlzLmZnQ29sb3I7ZS5hcmModGhpcy54eSx0aGlzLnh5LHRoaXMucmFkaXVzLHQucyx0LmUsdC5kKTtlLnN0cm9rZSgpfTt0aGlzLmNhbmNlbD1mdW5jdGlvbigpe3RoaXMudmFsKHRoaXMudil9fTtlLmZuLmRpYWw9ZS5mbi5rbm9iPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgcj1uZXcgdC5EaWFsO3Iubz1uO3IuJD1lKHRoaXMpO3IucnVuKCl9KS5wYXJlbnQoKX19KVxufSkuY2FsbChnbG9iYWwsIG1vZHVsZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuIiwidmFyIGZvcm1hdFVSTCA9IGZ1bmN0aW9uKHVybCl7XG4gICAgcmV0dXJuIHVybC5yZXBsYWNlKC9bXFxyXFxuXFxzXSovZyxcIlwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFzdEFycil7XG5cbiAgICBpZighdmFzdEFyciB8fCB2YXN0QXJyLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIHJldHVybiB7ZXJyb3I6XCJlbXB0eVwifTtcbiAgICB9XG5cbiAgICBpZih2YXN0QXJyWzBdLmVycm9yKXtcbiAgICAgICAgcmV0dXJuIHtlcnJvcjp2YXN0QXJyWzBdLmVycm9yfTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0ge1xuICAgICAgICBpbXByZXNzaW9ucyA6IFtdLFxuICAgICAgICB0cmFja2luZyA6IHt9XG4gICAgfTtcblxuICAgIHZhc3RBcnIuZm9yRWFjaChmdW5jdGlvbih2KXtcblxuICAgICAgICB2YXIgcm9vdCA9IHYuREFBU1QgPyB2LkRBQVNUIDogdi5WQVNUO1xuXG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkocm9vdC5BZCkpe1xuICAgICAgICAgICAgcm9vdC5BZCA9IHJvb3QuQWRbMF07XG4gICAgICAgIH1cblxuICAgICAgICBpZihyb290LkFkLkluTGluZS5JbXByZXNzaW9uKXtcblxuICAgICAgICAgICAgdmFyIGltcHJlc3Npb25zID0gcm9vdC5BZC5JbkxpbmUuSW1wcmVzc2lvbjtcblxuICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoaW1wcmVzc2lvbnMpKXtcbiAgICAgICAgICAgICAgICBpbXByZXNzaW9ucyA9IFtpbXByZXNzaW9uc107IFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbXByZXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGltcFVSTCl7XG4gICAgICAgICAgICAgICAgcmV0LmltcHJlc3Npb25zLnB1c2goZm9ybWF0VVJMKGltcFVSTC5fX2NkYXRhIHx8IGltcFVSTCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3JlYXRpdmUgPSByb290LkFkLkluTGluZS5DcmVhdGl2ZXMuQ3JlYXRpdmU7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY3JlYXRpdmUpKXtcbiAgICAgICAgICAgIGNyZWF0aXZlID0gY3JlYXRpdmVbMF07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRyYWNraW5nRXZlbnRzID0gY3JlYXRpdmUuTGluZWFyLlRyYWNraW5nRXZlbnRzO1xuICAgICAgICBpZih0cmFja2luZ0V2ZW50cyAmJiB0cmFja2luZ0V2ZW50cy5UcmFja2luZyl7XG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheSh0cmFja2luZ0V2ZW50cy5UcmFja2luZykpe1xuICAgICAgICAgICAgICAgIHRyYWNraW5nRXZlbnRzLlRyYWNraW5nID0gW3RyYWNraW5nRXZlbnRzLlRyYWNraW5nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyYWNraW5nRXZlbnRzLlRyYWNraW5nLmZvckVhY2goZnVuY3Rpb24odCl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHVybCAgICAgICAgID0gZm9ybWF0VVJMKHQuX190ZXh0IHx8IHQuX19jZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSAgID0gdC5fZXZlbnQ7XG5cbiAgICAgICAgICAgICAgICBpZighcmV0LnRyYWNraW5nW2V2ZW50VHlwZV0pIHJldC50cmFja2luZ1tldmVudFR5cGVdID0gW107XG5cbiAgICAgICAgICAgICAgICByZXQudHJhY2tpbmdbZXZlbnRUeXBlXS5wdXNoKHVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgXG4gICAgfSk7XG5cbiAgICB2YXIgbGFzdCAgICAgICAgICAgID0gdmFzdEFyci5zbGljZSgtMSlbMF0sXG4gICAgICAgIHR5cGUgICAgICAgICAgICA9IGxhc3QuREFBU1QgPyBcIkRBQVNUXCIgOiBcIlZBU1RcIixcbiAgICAgICAgY3JlYXRpdmVzICAgICAgID0gbGFzdFt0eXBlXS5BZC5JbkxpbmUuQ3JlYXRpdmVzLkNyZWF0aXZlO1xuICAgICAgICBjcmVhdGl2ZXNBcnIgICAgPSBBcnJheS5pc0FycmF5KGNyZWF0aXZlcykgPyBjcmVhdGl2ZXMgOiBbY3JlYXRpdmVzXSxcbiAgICAgICAgbGluZWFyICAgICAgICAgID0gY3JlYXRpdmVzQXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuTGluZWFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuTGluZWFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pWzBdLFxuICAgICAgICBtZWRpYSAgICAgICAgICAgPSBjcmVhdGl2ZXNBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5MaW5lYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5MaW5lYXIuTWVkaWFGaWxlcy5NZWRpYUZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlbMF0sXG4gICAgICAgIGNvbXBhbmlvbnMgICAgICA9IGNyZWF0aXZlc0FyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oYyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuQ29tcGFuaW9uQWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuQ29tcGFuaW9uQWRzLkNvbXBhbmlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgIGlmKGNvbXBhbmlvbnMubGVuZ3RoID4gMCl7XG5cbiAgICAgICAgY29tcGFuaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXApe1xuICAgICAgICAgICAgaWYoY29tcC5UcmFja2luZ0V2ZW50cyl7XG5cbiAgICAgICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShjb21wLlRyYWNraW5nRXZlbnRzLlRyYWNraW5nKSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbXAuVHJhY2tpbmdFdmVudHMuVHJhY2tpbmcgPSBbY29tcC5UcmFja2luZ0V2ZW50cy5UcmFja2luZ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29tcC5UcmFja2luZ0V2ZW50cy5UcmFja2luZy5mb3JFYWNoKGZ1bmN0aW9uKHQpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgICAgICAgICA9IGZvcm1hdFVSTCh0Ll9fY2RhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlICAgPSB0Ll9ldmVudDtcblxuICAgICAgICAgICAgICAgICAgICBpZighcmV0LnRyYWNraW5nW2V2ZW50VHlwZV0pIHJldC50cmFja2luZ1tldmVudFR5cGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJldC50cmFja2luZ1tldmVudFR5cGVdLnB1c2godXJsKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgICByZXQucG9zdGVyID0gY29tcGFuaW9uc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihjb21wKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcC5TdGF0aWNSZXNvdXJjZSAmJiBjb21wLlN0YXRpY1Jlc291cmNlLl9jcmVhdGl2ZVR5cGUuaW5kZXhPZihcImltYWdlXCIpID09PSAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24oY29tcCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogZm9ybWF0VVJMKGNvbXAuU3RhdGljUmVzb3VyY2UuX19jZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoIDogY29tcC5fd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA6IGNvbXAuX2hlaWdodFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVswXTtcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICByZXQubWltZSAgICAgICA9IG1lZGlhLl90eXBlO1xuICAgIHJldC5zcmMgICAgICAgICA9IGZvcm1hdFVSTChtZWRpYS5fX2NkYXRhIHx8IG1lZGlhLl9fdGV4dCk7XG5cbiAgICByZXQuY2xpY2tVUkwgPSBcIiNcIjtcbiAgICBpZihsaW5lYXIuVmlkZW9DbGlja3Mpe1xuICAgICAgICBcbiAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkobGluZWFyLlZpZGVvQ2xpY2tzKSl7XG4gICAgICAgICAgICBsaW5lYXIuVmlkZW9DbGlja3MgPSBbbGluZWFyLlZpZGVvQ2xpY2tzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVhci5WaWRlb0NsaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHZjKXtcbiAgICAgICAgICAgIGlmKHZjLkNsaWNrVGhyb3VnaCl7XG4gICAgICAgICAgICAgICAgcmV0LmNsaWNrVVJMICAgID0gZm9ybWF0VVJMKHZjLkNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZjLkN1c3RvbUNsaWNrKXtcbiAgICAgICAgICAgICAgICByZXQuY2xpY2tVUkwgICAgPSBmb3JtYXRVUkwodmMuQ3VzdG9tQ2xpY2suX19jZGF0YSB8fCB2Yy5DdXN0b21DbGljay5fX3RleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0LndpZHRoICAgICAgID0gICBcIjEwMCVcIjtcbiAgICByZXQuaGVpZ2h0ICAgICAgPSAgIFwiMTAwJVwiO1xuXG4gICAgaWYocmV0LnBvc3RlciAmJiByZXQubWltZS5pbmRleE9mKFwiYXVkaW9cIik9PT0wICl7XG4gICAgICAgIHJldC53aWR0aCAgID0gcmV0LnBvc3Rlci53aWR0aCtcInB4XCI7XG4gICAgICAgIHJldC5oZWlnaHQgID0gcmV0LnBvc3Rlci5oZWlnaHQrXCJweFwiO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG5cbn07XG4iLCJ2YXIgbXVzdGFjaGUgICAgICAgID0gcmVxdWlyZSgnbXVzdGFjaGUnKSxcbiAgICBrbm9iICAgICAgICAgICAgPSByZXF1aXJlKFwia25vYlwiKSxcbiAgICB0bXBsICAgICAgICAgICAgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGxheWVyLmh0bWwnKSxcbiAgICBkZWZhdWx0UG9zdGVyVVJJID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3Bvc3Rlci50eHQnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmFtcyxwYXJlbnQpe1xuXG4gICAgcGFyYW1zLnRhZyA9IFwidmlkZW9cIjtcbiAgICBpZighcGFyYW1zLnBvc3RlciAmJiBwYXJhbXMubWltZS5pbmRleE9mKFwiYXVkaW9cIik9PT0wKXtcbiAgICAgICAgcGFyYW1zLnBvc3RlciA9IHt1cmw6ZGVmYXVsdFBvc3RlclVSSX07XG4gICAgfVxuXG4gICAgdmFyIHBsYXllckhUTUwgPW11c3RhY2hlLnJlbmRlcihcbiAgICAgICAgdG1wbCwgXG4gICAgICAgIHBhcmFtcyBcbiAgICApO1xuXG4gICAgcGFyZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgcGxheWVySFRNTCk7XG5cbiAgICAvL2NlbnRlciB3aXRoIGpzXG4gICAgdmFyIHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyXCIpO1xuICAgXG4gICAgdmFyIHkgPSAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB2aWQuY2xpZW50SGVpZ2h0KSAvIDIgO1xuXG4gICAgdmlkLnN0eWxlLnRvcCA9IHkgK1wicHhcIjtcblxuICAgIC8vYWRkIGJ1dHRvbiBsaXN0ZW5lcnNcbiAgICB2aWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKHdpbmRvdy5icmlkZ2Upe1xuICAgICAgICAgICAgd2luZG93LmJyaWRnZS5zZW5kKHtjbGlja1VSTDp2aWQuZGF0YXNldC5ocmVmfSk7XG4gICAgICAgIH1cbiAgICB9LGZhbHNlKTtcblxuXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjbG9zZVwiKSl7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2xvc2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYod2luZG93LmJyaWRnZSl7XG4gICAgICAgICAgICAgICAgd2luZG93LmJyaWRnZS5zZW5kKHtcImNsb3NlXCI6dHJ1ZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LGZhbHNlKTtcbiAgICB9XG5cbiAgICAvL2FkZCB0cmFja2luZyBldmVudHNcbiAgICB2YXIgZmlyc3RTdGFydCA9IHRydWU7XG5cbiAgICBpZighcGFyYW1zLmF1dG9wbGF5KXtcbiAgICAgICAgdmlkLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICB9XG5cbiAgICBhZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInBsYXlpbmdcIiwgXG4gICAgICAgIGZ1bmN0aW9uKGUpIHsgXG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBNYXRoLmNlaWwoZS50YXJnZXQuZHVyYXRpb24pO1xuXG4gICAgICAgICAgICAkKFwiI3RpbWVyXCIpLnNob3coKTtcbiAgICAgICAgICAgICQoXCIjdGltZXJcIikudmFsKGR1cmF0aW9uKTtcbiAgICAgICAgICAgICQoXCIjdGltZXJcIikua25vYih7XG4gICAgICAgICAgICAgICAgbWluOjAsXG4gICAgICAgICAgICAgICAgbWF4OmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5OnRydWUsXG4gICAgICAgICAgICAgICAgZmdDb2xvciA6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgIGJnQ29sb3I6XCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6XCJib2xkXCIsXG4gICAgICAgICAgICAgICAgd2lkdGg6MjQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OjI0LFxuICAgICAgICAgICAgICAgIHRoaWNrbmVzczowLjJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihmaXJzdFN0YXJ0ICYmIHBhcmFtcy50cmFja2luZyAmJiBwYXJhbXMudHJhY2tpbmcuc3RhcnQpe1xuICAgICAgICAgICAgICAgIHBhcmFtcy50cmFja2luZy5zdGFydC5mb3JFYWNoKGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgaW1nLndpZHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaW1nLmhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmaXJzdFN0YXJ0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIH0sXG4gICAgdHJ1ZSk7XG5cbiAgICB2YXIgZmlyc3RFbmQgPSB0cnVlO1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZpcnN0RW5kICYmIHBhcmFtcy50cmFja2luZyAmJiBwYXJhbXMudHJhY2tpbmcuY29tcGxldGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy50cmFja2luZy5jb21wbGV0ZS5mb3JFYWNoKGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nLndpZHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nLmhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgIHRydWUpO1xuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihcInRpbWV1cGRhdGVcIiwgXG4gICAgICAgIGZ1bmN0aW9uKGUpIHsgXG4gICAgICAgICAgICB2YXIgcG9zID0gTWF0aC5jZWlsKGUuc3JjRWxlbWVudC5kdXJhdGlvbiAtZS5zcmNFbGVtZW50LmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICQoJyN0aW1lcicpLnZhbChwb3MpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9LFxuICAgIHRydWUpO1xufTtcbiIsInZhciBYMkpTICAgID0gcmVxdWlyZSgnLi4vbGliL3gyanMuanMnKSxcbiAgICB4MmpzICAgID0gbmV3IFgySlMoKSxcbiAgICBzdXBlcmFnZW50ICA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcblxudmFyIF9wYXJzZSA9IGZ1bmN0aW9uKHVybCxwYXJhbXMsdmFzdEFycixjYil7XG5cbiAgICB2YXIgcmVxID0gc3VwZXJhZ2VudC5nZXQodXJsKS5xdWVyeShwYXJhbXMpO1xuXG4gICAgaWYodHlwZW9mKHdpbmRvdyk9PT1cInVuZGVmaW5lZFwiKXsgLy9zZXJ2ZXIgc2lkZVxuICAgICAgICByZXEgPSBzdXBlcmFnZW50LmdldCh1cmwpLnF1ZXJ5KHBhcmFtcykuYnVmZmVyKCk7XG4gICAgfVxuXG4gICAgcmVxLmVuZChmdW5jdGlvbihlcnIscmVzKXtcblxuICAgICAgICBpZihlcnIpIHJldHVybiBjYihlcnIrXCJcXG5cIityZXMudGV4dCk7XG4gICAgICAgIGlmKHJlcy5lcnJvcikgcmV0dXJuIGNiKHJlcy5lcnJvcitcIlxcblwiK3Jlcy50ZXh0KTtcblxuICAgICAgICB2YXIganNvbiA9IHgyanMueG1sX3N0cjJqc29uKHJlcy50ZXh0KTtcblxuICAgICAgICB2YXN0QXJyLnB1c2goanNvbik7XG5cbiAgICAgICAgdHJ5e1xuXG4gICAgICAgICAgICBpZihqc29uLlZBU1QgJiYganNvbi5WQVNULkFkWzBdLldyYXBwZXJbMF0uVkFTVEFkVGFnVVJJWzBdKXtcbiAgICAgICAgICAgICAgIHJldHVybiBfcGFyc2UoanNvbi5WQVNULkFkWzBdLldyYXBwZXJbMF0uVkFTVEFkVGFnVVJJWzBdLHt9LHZhc3RBcnIsY2IpIDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoanNvbi5EQUFTVCAmJiBqc29uLkRBQVNULkFkWzBdLldyYXBwZXJbMF0uREFBU1RBZFRhZ1VSSVswXSl7XG4gICAgICAgICAgICAgICByZXR1cm4gX3BhcnNlKGpzb24uREFBU1QuQWRbMF0uV3JhcHBlclswXS5EQUFTVEFkVGFnVVJJWzBdLHt9LHZhc3RBcnIsY2IpIDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2IobnVsbCx2YXN0QXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgXG4gICAgICAgICAgICBjYihudWxsLHZhc3RBcnIpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHVybCxwYXJhbXMsY2Ipe1xuICAgIF9wYXJzZSh1cmwscGFyYW1zLFtdLGNiKTtcbiAgICBcbn07XG5cbiIsIi8qXHJcbiBDb3B5cmlnaHQgMjAxMS0yMDEzIEFiZHVsbGEgQWJkdXJha2htYW5vdlxyXG4gT3JpZ2luYWwgc291cmNlcyBhcmUgYXZhaWxhYmxlIGF0IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AveDJqcy9cclxuXHJcbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcblxyXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnZhciBET01QYXJzZXIgPSByZXF1aXJlKCd4bWxkb20nKS5ET01QYXJzZXI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFgySlMoY29uZmlnKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cdFx0XHJcblx0dmFyIFZFUlNJT04gPSBcIjEuMS41XCI7XHJcblx0XHJcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cdGluaXRDb25maWdEZWZhdWx0cygpO1xyXG5cdGluaXRSZXF1aXJlZFBvbHlmaWxscygpO1xyXG5cdFxyXG5cdGZ1bmN0aW9uIGluaXRDb25maWdEZWZhdWx0cygpIHtcclxuXHRcdGlmKGNvbmZpZy5lc2NhcGVNb2RlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uZmlnLmVzY2FwZU1vZGUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y29uZmlnLmF0dHJpYnV0ZVByZWZpeCA9IGNvbmZpZy5hdHRyaWJ1dGVQcmVmaXggfHwgXCJfXCI7XHJcblx0XHRjb25maWcuYXJyYXlBY2Nlc3NGb3JtID0gY29uZmlnLmFycmF5QWNjZXNzRm9ybSB8fCBcIm5vbmVcIjtcclxuXHRcdGNvbmZpZy5lbXB0eU5vZGVGb3JtID0gY29uZmlnLmVtcHR5Tm9kZUZvcm0gfHwgXCJ0ZXh0XCI7XHJcblx0XHRpZihjb25maWcuZW5hYmxlVG9TdHJpbmdGdW5jID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uZmlnLmVuYWJsZVRvU3RyaW5nRnVuYyA9IHRydWU7IFxyXG5cdFx0fVxyXG5cdFx0Y29uZmlnLmFycmF5QWNjZXNzRm9ybVBhdGhzID0gY29uZmlnLmFycmF5QWNjZXNzRm9ybVBhdGhzIHx8IFtdOyBcclxuXHRcdGlmKGNvbmZpZy5za2lwRW1wdHlUZXh0Tm9kZXNGb3JPYmogPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRjb25maWcuc2tpcEVtcHR5VGV4dE5vZGVzRm9yT2JqID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGlmKGNvbmZpZy5zdHJpcFdoaXRlc3BhY2VzID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uZmlnLnN0cmlwV2hpdGVzcGFjZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Y29uZmlnLmRhdGV0aW1lQWNjZXNzRm9ybVBhdGhzID0gY29uZmlnLmRhdGV0aW1lQWNjZXNzRm9ybVBhdGhzIHx8IFtdO1xyXG5cdH1cclxuXHJcblx0dmFyIERPTU5vZGVUeXBlcyA9IHtcclxuXHRcdEVMRU1FTlRfTk9ERSBcdCAgIDogMSxcclxuXHRcdFRFWFRfTk9ERSAgICBcdCAgIDogMyxcclxuXHRcdENEQVRBX1NFQ1RJT05fTk9ERSA6IDQsXHJcblx0XHRDT01NRU5UX05PREVcdCAgIDogOCxcclxuXHRcdERPQ1VNRU5UX05PREUgXHQgICA6IDlcclxuXHR9O1xyXG5cdFxyXG5cdGZ1bmN0aW9uIGluaXRSZXF1aXJlZFBvbHlmaWxscygpIHtcclxuXHRcdGZ1bmN0aW9uIHBhZChudW1iZXIpIHtcclxuXHQgICAgICB2YXIgciA9IFN0cmluZyhudW1iZXIpO1xyXG5cdCAgICAgIGlmICggci5sZW5ndGggPT09IDEgKSB7XHJcblx0ICAgICAgICByID0gJzAnICsgcjtcclxuXHQgICAgICB9XHJcblx0ICAgICAgcmV0dXJuIHI7XHJcblx0ICAgIH1cclxuXHRcdC8vIEhlbGxvIElFOC1cclxuXHRcdGlmKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnRyaW0gIT09ICdmdW5jdGlvbicpIHtcdFx0XHRcclxuXHRcdFx0U3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8Xlxcbit8KFxcc3xcXG4pKyQvZywgJycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZih0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Ly8gSW1wbGVtZW50YXRpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1NzM1MjEvaG93LWRvLWktb3V0cHV0LWFuLWlzby04NjAxLWZvcm1hdHRlZC1zdHJpbmctaW4tamF2YXNjcmlwdFxyXG5cdFx0XHREYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0VVRDRnVsbFllYXIoKVxyXG5cdFx0ICAgICAgICArICctJyArIHBhZCggdGhpcy5nZXRVVENNb250aCgpICsgMSApXHJcblx0XHQgICAgICAgICsgJy0nICsgcGFkKCB0aGlzLmdldFVUQ0RhdGUoKSApXHJcblx0XHQgICAgICAgICsgJ1QnICsgcGFkKCB0aGlzLmdldFVUQ0hvdXJzKCkgKVxyXG5cdFx0ICAgICAgICArICc6JyArIHBhZCggdGhpcy5nZXRVVENNaW51dGVzKCkgKVxyXG5cdFx0ICAgICAgICArICc6JyArIHBhZCggdGhpcy5nZXRVVENTZWNvbmRzKCkgKVxyXG5cdFx0ICAgICAgICArICcuJyArIFN0cmluZyggKHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkvMTAwMCkudG9GaXhlZCgzKSApLnNsaWNlKCAyLCA1IClcclxuXHRcdCAgICAgICAgKyAnWic7XHJcblx0XHQgICAgfTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gZ2V0Tm9kZUxvY2FsTmFtZSggbm9kZSApIHtcclxuXHRcdHZhciBub2RlTG9jYWxOYW1lID0gbm9kZS5sb2NhbE5hbWU7XHRcdFx0XHJcblx0XHRpZihub2RlTG9jYWxOYW1lID09IG51bGwpIC8vIFllYWgsIHRoaXMgaXMgSUUhISBcclxuXHRcdFx0bm9kZUxvY2FsTmFtZSA9IG5vZGUuYmFzZU5hbWU7XHJcblx0XHRpZihub2RlTG9jYWxOYW1lID09IG51bGwgfHwgbm9kZUxvY2FsTmFtZT09XCJcIikgLy8gPT1cIlwiIGlzIElFIHRvb1xyXG5cdFx0XHRub2RlTG9jYWxOYW1lID0gbm9kZS5ub2RlTmFtZTtcclxuXHRcdHJldHVybiBub2RlTG9jYWxOYW1lO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBnZXROb2RlUHJlZml4KG5vZGUpIHtcclxuXHRcdHJldHVybiBub2RlLnByZWZpeDtcclxuXHR9XHJcblx0XHRcclxuXHRmdW5jdGlvbiBlc2NhcGVYbWxDaGFycyhzdHIpIHtcclxuXHRcdGlmKHR5cGVvZihzdHIpID09IFwic3RyaW5nXCIpXHJcblx0XHRcdHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKS5yZXBsYWNlKC8nL2csICcmI3gyNzsnKS5yZXBsYWNlKC9cXC8vZywgJyYjeDJGOycpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdW5lc2NhcGVYbWxDaGFycyhzdHIpIHtcclxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKS5yZXBsYWNlKC8mI3gyNzsvZywgXCInXCIpLnJlcGxhY2UoLyYjeDJGOy9nLCAnXFwvJyk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHRvQXJyYXlBY2Nlc3NGb3JtKG9iaiwgY2hpbGROYW1lLCBwYXRoKSB7XHJcblx0XHRzd2l0Y2goY29uZmlnLmFycmF5QWNjZXNzRm9ybSkge1xyXG5cdFx0Y2FzZSBcInByb3BlcnR5XCI6XHJcblx0XHRcdGlmKCEob2JqW2NoaWxkTmFtZV0gaW5zdGFuY2VvZiBBcnJheSkpXHJcblx0XHRcdFx0b2JqW2NoaWxkTmFtZStcIl9hc0FycmF5XCJdID0gW29ialtjaGlsZE5hbWVdXTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9ialtjaGlsZE5hbWUrXCJfYXNBcnJheVwiXSA9IG9ialtjaGlsZE5hbWVdO1xyXG5cdFx0XHRicmVhaztcdFx0XHJcblx0XHQvKmNhc2UgXCJub25lXCI6XHJcblx0XHRcdGJyZWFrOyovXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCEob2JqW2NoaWxkTmFtZV0gaW5zdGFuY2VvZiBBcnJheSkgJiYgY29uZmlnLmFycmF5QWNjZXNzRm9ybVBhdGhzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dmFyIGlkeCA9IDA7XHJcblx0XHRcdGZvcig7IGlkeCA8IGNvbmZpZy5hcnJheUFjY2Vzc0Zvcm1QYXRocy5sZW5ndGg7IGlkeCsrKSB7XHJcblx0XHRcdFx0dmFyIGFycmF5UGF0aCA9IGNvbmZpZy5hcnJheUFjY2Vzc0Zvcm1QYXRoc1tpZHhdO1xyXG5cdFx0XHRcdGlmKCB0eXBlb2YgYXJyYXlQYXRoID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0aWYoYXJyYXlQYXRoID09IHBhdGgpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYoIGFycmF5UGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xyXG5cdFx0XHRcdFx0aWYoYXJyYXlQYXRoLnRlc3QocGF0aCkpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiggdHlwZW9mIGFycmF5UGF0aCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRpZihhcnJheVBhdGgob2JqLCBjaGlsZE5hbWUsIHBhdGgpKVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaWR4IT1jb25maWcuYXJyYXlBY2Nlc3NGb3JtUGF0aHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0b2JqW2NoaWxkTmFtZV0gPSBbb2JqW2NoaWxkTmFtZV1dO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGZyb21YbWxEYXRlVGltZShwcm9wKSB7XHJcblx0XHQvLyBJbXBsZW1lbnRhdGlvbiBiYXNlZCB1cCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzgxNzg1OTgveG1sLWRhdGV0aW1lLXRvLWphdmFzY3JpcHQtZGF0ZS1vYmplY3RcclxuXHRcdC8vIEltcHJvdmVkIHRvIHN1cHBvcnQgZnVsbCBzcGVjIGFuZCBvcHRpb25hbCBwYXJ0c1xyXG5cdFx0dmFyIGJpdHMgPSBwcm9wLnNwbGl0KC9bLVQ6K1pdL2cpO1xyXG5cdFx0XHJcblx0XHR2YXIgZCA9IG5ldyBEYXRlKGJpdHNbMF0sIGJpdHNbMV0tMSwgYml0c1syXSk7XHRcdFx0XHJcblx0XHR2YXIgc2Vjb25kQml0cyA9IGJpdHNbNV0uc3BsaXQoXCJcXC5cIik7XHJcblx0XHRkLnNldEhvdXJzKGJpdHNbM10sIGJpdHNbNF0sIHNlY29uZEJpdHNbMF0pO1xyXG5cdFx0aWYoc2Vjb25kQml0cy5sZW5ndGg+MSlcclxuXHRcdFx0ZC5zZXRNaWxsaXNlY29uZHMoc2Vjb25kQml0c1sxXSk7XHJcblxyXG5cdFx0Ly8gR2V0IHN1cHBsaWVkIHRpbWUgem9uZSBvZmZzZXQgaW4gbWludXRlc1xyXG5cdFx0aWYoYml0c1s2XSAmJiBiaXRzWzddKSB7XHJcblx0XHRcdHZhciBvZmZzZXRNaW51dGVzID0gYml0c1s2XSAqIDYwICsgTnVtYmVyKGJpdHNbN10pO1xyXG5cdFx0XHR2YXIgc2lnbiA9IC9cXGRcXGQtXFxkXFxkOlxcZFxcZCQvLnRlc3QocHJvcCk/ICctJyA6ICcrJztcclxuXHJcblx0XHRcdC8vIEFwcGx5IHRoZSBzaWduXHJcblx0XHRcdG9mZnNldE1pbnV0ZXMgPSAwICsgKHNpZ24gPT0gJy0nPyAtMSAqIG9mZnNldE1pbnV0ZXMgOiBvZmZzZXRNaW51dGVzKTtcclxuXHJcblx0XHRcdC8vIEFwcGx5IG9mZnNldCBhbmQgbG9jYWwgdGltZXpvbmVcclxuXHRcdFx0ZC5zZXRNaW51dGVzKGQuZ2V0TWludXRlcygpIC0gb2Zmc2V0TWludXRlcyAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSlcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYocHJvcC5pbmRleE9mKFwiWlwiLCBwcm9wLmxlbmd0aCAtIDEpICE9PSAtMSkge1xyXG5cdFx0XHRcdGQgPSBuZXcgRGF0ZShEYXRlLlVUQyhkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgZC5nZXREYXRlKCksIGQuZ2V0SG91cnMoKSwgZC5nZXRNaW51dGVzKCksIGQuZ2V0U2Vjb25kcygpLCBkLmdldE1pbGxpc2Vjb25kcygpKSk7XHRcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0Ly8gZCBpcyBub3cgYSBsb2NhbCB0aW1lIGVxdWl2YWxlbnQgdG8gdGhlIHN1cHBsaWVkIHRpbWVcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjaGVja0Zyb21YbWxEYXRlVGltZVBhdGhzKHZhbHVlLCBjaGlsZE5hbWUsIGZ1bGxQYXRoKSB7XHJcblx0XHRpZihjb25maWcuZGF0ZXRpbWVBY2Nlc3NGb3JtUGF0aHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR2YXIgcGF0aCA9IGZ1bGxQYXRoLnNwbGl0KFwiXFwuI1wiKVswXTtcclxuXHRcdFx0dmFyIGlkeCA9IDA7XHJcblx0XHRcdGZvcig7IGlkeCA8IGNvbmZpZy5kYXRldGltZUFjY2Vzc0Zvcm1QYXRocy5sZW5ndGg7IGlkeCsrKSB7XHJcblx0XHRcdFx0dmFyIGR0UGF0aCA9IGNvbmZpZy5kYXRldGltZUFjY2Vzc0Zvcm1QYXRoc1tpZHhdO1xyXG5cdFx0XHRcdGlmKCB0eXBlb2YgZHRQYXRoID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0aWYoZHRQYXRoID09IHBhdGgpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYoIGR0UGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xyXG5cdFx0XHRcdFx0aWYoZHRQYXRoLnRlc3QocGF0aCkpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiggdHlwZW9mIGR0UGF0aCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRpZihkdFBhdGgob2JqLCBjaGlsZE5hbWUsIHBhdGgpKVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaWR4IT1jb25maWcuZGF0ZXRpbWVBY2Nlc3NGb3JtUGF0aHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZyb21YbWxEYXRlVGltZSh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VET01DaGlsZHJlbiggbm9kZSwgcGF0aCApIHtcclxuXHRcdGlmKG5vZGUubm9kZVR5cGUgPT0gRE9NTm9kZVR5cGVzLkRPQ1VNRU5UX05PREUpIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IG5ldyBPYmplY3Q7XHJcblx0XHRcdHZhciBub2RlQ2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcblx0XHRcdC8vIEFsdGVybmF0aXZlIGZvciBmaXJzdEVsZW1lbnRDaGlsZCB3aGljaCBpcyBub3Qgc3VwcG9ydGVkIGluIHNvbWUgZW52aXJvbm1lbnRzXHJcblx0XHRcdGZvcih2YXIgY2lkeD0wOyBjaWR4IDxub2RlQ2hpbGRyZW4ubGVuZ3RoOyBjaWR4KyspIHtcclxuXHRcdFx0XHR2YXIgY2hpbGQgPSBub2RlQ2hpbGRyZW4uaXRlbShjaWR4KTtcclxuXHRcdFx0XHRpZihjaGlsZC5ub2RlVHlwZSA9PSBET01Ob2RlVHlwZXMuRUxFTUVOVF9OT0RFKSB7XHJcblx0XHRcdFx0XHR2YXIgY2hpbGROYW1lID0gZ2V0Tm9kZUxvY2FsTmFtZShjaGlsZCk7XHJcblx0XHRcdFx0XHRyZXN1bHRbY2hpbGROYW1lXSA9IHBhcnNlRE9NQ2hpbGRyZW4oY2hpbGQsIGNoaWxkTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHRpZihub2RlLm5vZGVUeXBlID09IERPTU5vZGVUeXBlcy5FTEVNRU5UX05PREUpIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IG5ldyBPYmplY3Q7XHJcblx0XHRcdHJlc3VsdC5fX2NudD0wO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG5vZGVDaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcclxuXHRcdFx0XHJcblx0XHRcdC8vIENoaWxkcmVuIG5vZGVzXHJcblx0XHRcdGZvcih2YXIgY2lkeD0wOyBjaWR4IDxub2RlQ2hpbGRyZW4ubGVuZ3RoOyBjaWR4KyspIHtcclxuXHRcdFx0XHR2YXIgY2hpbGQgPSBub2RlQ2hpbGRyZW4uaXRlbShjaWR4KTsgLy8gbm9kZUNoaWxkcmVuW2NpZHhdO1xyXG5cdFx0XHRcdHZhciBjaGlsZE5hbWUgPSBnZXROb2RlTG9jYWxOYW1lKGNoaWxkKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihjaGlsZC5ub2RlVHlwZSE9IERPTU5vZGVUeXBlcy5DT01NRU5UX05PREUpIHtcclxuXHRcdFx0XHRcdHJlc3VsdC5fX2NudCsrO1xyXG5cdFx0XHRcdFx0aWYocmVzdWx0W2NoaWxkTmFtZV0gPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRyZXN1bHRbY2hpbGROYW1lXSA9IHBhcnNlRE9NQ2hpbGRyZW4oY2hpbGQsIHBhdGgrXCIuXCIrY2hpbGROYW1lKTtcclxuXHRcdFx0XHRcdFx0dG9BcnJheUFjY2Vzc0Zvcm0ocmVzdWx0LCBjaGlsZE5hbWUsIHBhdGgrXCIuXCIrY2hpbGROYW1lKTtcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYocmVzdWx0W2NoaWxkTmFtZV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmKCAhKHJlc3VsdFtjaGlsZE5hbWVdIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRbY2hpbGROYW1lXSA9IFtyZXN1bHRbY2hpbGROYW1lXV07XHJcblx0XHRcdFx0XHRcdFx0XHR0b0FycmF5QWNjZXNzRm9ybShyZXN1bHQsIGNoaWxkTmFtZSwgcGF0aCtcIi5cIitjaGlsZE5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQocmVzdWx0W2NoaWxkTmFtZV0pW3Jlc3VsdFtjaGlsZE5hbWVdLmxlbmd0aF0gPSBwYXJzZURPTUNoaWxkcmVuKGNoaWxkLCBwYXRoK1wiLlwiK2NoaWxkTmFtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQXR0cmlidXRlc1xyXG5cdFx0XHRmb3IodmFyIGFpZHg9MDsgYWlkeCA8bm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgYWlkeCsrKSB7XHJcblx0XHRcdFx0dmFyIGF0dHIgPSBub2RlLmF0dHJpYnV0ZXMuaXRlbShhaWR4KTsgLy8gW2FpZHhdO1xyXG5cdFx0XHRcdHJlc3VsdC5fX2NudCsrO1xyXG5cdFx0XHRcdHJlc3VsdFtjb25maWcuYXR0cmlidXRlUHJlZml4K2F0dHIubmFtZV09YXR0ci52YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gTm9kZSBuYW1lc3BhY2UgcHJlZml4XHJcblx0XHRcdHZhciBub2RlUHJlZml4ID0gZ2V0Tm9kZVByZWZpeChub2RlKTtcclxuXHRcdFx0aWYobm9kZVByZWZpeCE9bnVsbCAmJiBub2RlUHJlZml4IT1cIlwiKSB7XHJcblx0XHRcdFx0cmVzdWx0Ll9fY250Kys7XHJcblx0XHRcdFx0cmVzdWx0Ll9fcHJlZml4PW5vZGVQcmVmaXg7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmKHJlc3VsdFtcIiN0ZXh0XCJdIT1udWxsKSB7XHRcdFx0XHRcclxuXHRcdFx0XHRyZXN1bHQuX190ZXh0ID0gcmVzdWx0W1wiI3RleHRcIl07XHJcblx0XHRcdFx0aWYocmVzdWx0Ll9fdGV4dCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdFx0XHRyZXN1bHQuX190ZXh0ID0gcmVzdWx0Ll9fdGV4dC5qb2luKFwiXFxuXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjb25maWcuZXNjYXBlTW9kZSlcclxuXHRcdFx0XHRcdHJlc3VsdC5fX3RleHQgPSB1bmVzY2FwZVhtbENoYXJzKHJlc3VsdC5fX3RleHQpO1xyXG5cdFx0XHRcdGlmKGNvbmZpZy5zdHJpcFdoaXRlc3BhY2VzKVxyXG5cdFx0XHRcdFx0cmVzdWx0Ll9fdGV4dCA9IHJlc3VsdC5fX3RleHQudHJpbSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSByZXN1bHRbXCIjdGV4dFwiXTtcclxuXHRcdFx0XHRpZihjb25maWcuYXJyYXlBY2Nlc3NGb3JtPT1cInByb3BlcnR5XCIpXHJcblx0XHRcdFx0XHRkZWxldGUgcmVzdWx0W1wiI3RleHRfYXNBcnJheVwiXTtcclxuXHRcdFx0XHRyZXN1bHQuX190ZXh0ID0gY2hlY2tGcm9tWG1sRGF0ZVRpbWVQYXRocyhyZXN1bHQuX190ZXh0LCBjaGlsZE5hbWUsIHBhdGgrXCIuXCIrY2hpbGROYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihyZXN1bHRbXCIjY2RhdGEtc2VjdGlvblwiXSE9bnVsbCkge1xyXG5cdFx0XHRcdHJlc3VsdC5fX2NkYXRhID0gcmVzdWx0W1wiI2NkYXRhLXNlY3Rpb25cIl07XHJcblx0XHRcdFx0ZGVsZXRlIHJlc3VsdFtcIiNjZGF0YS1zZWN0aW9uXCJdO1xyXG5cdFx0XHRcdGlmKGNvbmZpZy5hcnJheUFjY2Vzc0Zvcm09PVwicHJvcGVydHlcIilcclxuXHRcdFx0XHRcdGRlbGV0ZSByZXN1bHRbXCIjY2RhdGEtc2VjdGlvbl9hc0FycmF5XCJdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiggcmVzdWx0Ll9fY250ID09IDEgJiYgcmVzdWx0Ll9fdGV4dCE9bnVsbCAgKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0Ll9fdGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdGlmKCByZXN1bHQuX19jbnQgPT0gMCAmJiBjb25maWcuZW1wdHlOb2RlRm9ybT09XCJ0ZXh0XCIgKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRpZiAoIHJlc3VsdC5fX2NudCA+IDEgJiYgcmVzdWx0Ll9fdGV4dCE9bnVsbCAmJiBjb25maWcuc2tpcEVtcHR5VGV4dE5vZGVzRm9yT2JqKSB7XHJcblx0XHRcdFx0aWYoIChjb25maWcuc3RyaXBXaGl0ZXNwYWNlcyAmJiByZXN1bHQuX190ZXh0PT1cIlwiKSB8fCAocmVzdWx0Ll9fdGV4dC50cmltKCk9PVwiXCIpKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgcmVzdWx0Ll9fdGV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVsZXRlIHJlc3VsdC5fX2NudDtcdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdGlmKCBjb25maWcuZW5hYmxlVG9TdHJpbmdGdW5jICYmIChyZXN1bHQuX190ZXh0IT1udWxsIHx8IHJlc3VsdC5fX2NkYXRhIT1udWxsICkpIHtcclxuXHRcdFx0XHRyZXN1bHQudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHJldHVybiAodGhpcy5fX3RleHQhPW51bGw/IHRoaXMuX190ZXh0OicnKSsoIHRoaXMuX19jZGF0YSE9bnVsbCA/IHRoaXMuX19jZGF0YTonJyk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdGlmKG5vZGUubm9kZVR5cGUgPT0gRE9NTm9kZVR5cGVzLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09IERPTU5vZGVUeXBlcy5DREFUQV9TRUNUSU9OX05PREUpIHtcclxuXHRcdFx0cmV0dXJuIG5vZGUubm9kZVZhbHVlO1xyXG5cdFx0fVx0XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHN0YXJ0VGFnKGpzb25PYmosIGVsZW1lbnQsIGF0dHJMaXN0LCBjbG9zZWQpIHtcclxuXHRcdHZhciByZXN1bHRTdHIgPSBcIjxcIisgKCAoanNvbk9iaiE9bnVsbCAmJiBqc29uT2JqLl9fcHJlZml4IT1udWxsKT8gKGpzb25PYmouX19wcmVmaXgrXCI6XCIpOlwiXCIpICsgZWxlbWVudDtcclxuXHRcdGlmKGF0dHJMaXN0IT1udWxsKSB7XHJcblx0XHRcdGZvcih2YXIgYWlkeCA9IDA7IGFpZHggPCBhdHRyTGlzdC5sZW5ndGg7IGFpZHgrKykge1xyXG5cdFx0XHRcdHZhciBhdHRyTmFtZSA9IGF0dHJMaXN0W2FpZHhdO1xyXG5cdFx0XHRcdHZhciBhdHRyVmFsID0ganNvbk9ialthdHRyTmFtZV07XHJcblx0XHRcdFx0aWYoY29uZmlnLmVzY2FwZU1vZGUpXHJcblx0XHRcdFx0XHRhdHRyVmFsPWVzY2FwZVhtbENoYXJzKGF0dHJWYWwpO1xyXG5cdFx0XHRcdHJlc3VsdFN0cis9XCIgXCIrYXR0ck5hbWUuc3Vic3RyKGNvbmZpZy5hdHRyaWJ1dGVQcmVmaXgubGVuZ3RoKStcIj0nXCIrYXR0clZhbCtcIidcIjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoIWNsb3NlZClcclxuXHRcdFx0cmVzdWx0U3RyKz1cIj5cIjtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmVzdWx0U3RyKz1cIi8+XCI7XHJcblx0XHRyZXR1cm4gcmVzdWx0U3RyO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBlbmRUYWcoanNvbk9iaixlbGVtZW50TmFtZSkge1xyXG5cdFx0cmV0dXJuIFwiPC9cIisgKGpzb25PYmouX19wcmVmaXghPW51bGw/IChqc29uT2JqLl9fcHJlZml4K1wiOlwiKTpcIlwiKStlbGVtZW50TmFtZStcIj5cIjtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gZW5kc1dpdGgoc3RyLCBzdWZmaXgpIHtcclxuXHQgICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24ganNvblhtbFNwZWNpYWxFbGVtICgganNvbk9iaiwganNvbk9iakZpZWxkICkge1xyXG5cdFx0aWYoKGNvbmZpZy5hcnJheUFjY2Vzc0Zvcm09PVwicHJvcGVydHlcIiAmJiBlbmRzV2l0aChqc29uT2JqRmllbGQudG9TdHJpbmcoKSwoXCJfYXNBcnJheVwiKSkpIFxyXG5cdFx0XHRcdHx8IGpzb25PYmpGaWVsZC50b1N0cmluZygpLmluZGV4T2YoY29uZmlnLmF0dHJpYnV0ZVByZWZpeCk9PTAgXHJcblx0XHRcdFx0fHwganNvbk9iakZpZWxkLnRvU3RyaW5nKCkuaW5kZXhPZihcIl9fXCIpPT0wXHJcblx0XHRcdFx0fHwgKGpzb25PYmpbanNvbk9iakZpZWxkXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSApXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGpzb25YbWxFbGVtQ291bnQgKCBqc29uT2JqICkge1xyXG5cdFx0dmFyIGVsZW1lbnRzQ250ID0gMDtcclxuXHRcdGlmKGpzb25PYmogaW5zdGFuY2VvZiBPYmplY3QgKSB7XHJcblx0XHRcdGZvciggdmFyIGl0IGluIGpzb25PYmogICkge1xyXG5cdFx0XHRcdGlmKGpzb25YbWxTcGVjaWFsRWxlbSAoIGpzb25PYmosIGl0KSApXHJcblx0XHRcdFx0XHRjb250aW51ZTtcdFx0XHRcclxuXHRcdFx0XHRlbGVtZW50c0NudCsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZWxlbWVudHNDbnQ7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHBhcnNlSlNPTkF0dHJpYnV0ZXMgKCBqc29uT2JqICkge1xyXG5cdFx0dmFyIGF0dHJMaXN0ID0gW107XHJcblx0XHRpZihqc29uT2JqIGluc3RhbmNlb2YgT2JqZWN0ICkge1xyXG5cdFx0XHRmb3IoIHZhciBhaXQgaW4ganNvbk9iaiAgKSB7XHJcblx0XHRcdFx0aWYoYWl0LnRvU3RyaW5nKCkuaW5kZXhPZihcIl9fXCIpPT0gLTEgJiYgYWl0LnRvU3RyaW5nKCkuaW5kZXhPZihjb25maWcuYXR0cmlidXRlUHJlZml4KT09MCkge1xyXG5cdFx0XHRcdFx0YXR0ckxpc3QucHVzaChhaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGF0dHJMaXN0O1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBwYXJzZUpTT05UZXh0QXR0cnMgKCBqc29uVHh0T2JqICkge1xyXG5cdFx0dmFyIHJlc3VsdCA9XCJcIjtcclxuXHRcdFxyXG5cdFx0aWYoanNvblR4dE9iai5fX2NkYXRhIT1udWxsKSB7XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0cmVzdWx0Kz1cIjwhW0NEQVRBW1wiK2pzb25UeHRPYmouX19jZGF0YStcIl1dPlwiO1x0XHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoanNvblR4dE9iai5fX3RleHQhPW51bGwpIHtcdFx0XHRcclxuXHRcdFx0aWYoY29uZmlnLmVzY2FwZU1vZGUpXHJcblx0XHRcdFx0cmVzdWx0Kz1lc2NhcGVYbWxDaGFycyhqc29uVHh0T2JqLl9fdGV4dCk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXN1bHQrPWpzb25UeHRPYmouX190ZXh0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gcGFyc2VKU09OVGV4dE9iamVjdCAoIGpzb25UeHRPYmogKSB7XHJcblx0XHR2YXIgcmVzdWx0ID1cIlwiO1xyXG5cclxuXHRcdGlmKCBqc29uVHh0T2JqIGluc3RhbmNlb2YgT2JqZWN0ICkge1xyXG5cdFx0XHRyZXN1bHQrPXBhcnNlSlNPTlRleHRBdHRycyAoIGpzb25UeHRPYmogKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYoanNvblR4dE9iaiE9bnVsbCkge1xyXG5cdFx0XHRcdGlmKGNvbmZpZy5lc2NhcGVNb2RlKVxyXG5cdFx0XHRcdFx0cmVzdWx0Kz1lc2NhcGVYbWxDaGFycyhqc29uVHh0T2JqKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXN1bHQrPWpzb25UeHRPYmo7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gcGFyc2VKU09OQXJyYXkgKCBqc29uQXJyUm9vdCwganNvbkFyck9iaiwgYXR0ckxpc3QgKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gXCJcIjsgXHJcblx0XHRpZihqc29uQXJyUm9vdC5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXN1bHQrPXN0YXJ0VGFnKGpzb25BcnJSb290LCBqc29uQXJyT2JqLCBhdHRyTGlzdCwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Zm9yKHZhciBhcklkeCA9IDA7IGFySWR4IDwganNvbkFyclJvb3QubGVuZ3RoOyBhcklkeCsrKSB7XHJcblx0XHRcdFx0cmVzdWx0Kz1zdGFydFRhZyhqc29uQXJyUm9vdFthcklkeF0sIGpzb25BcnJPYmosIHBhcnNlSlNPTkF0dHJpYnV0ZXMoanNvbkFyclJvb3RbYXJJZHhdKSwgZmFsc2UpO1xyXG5cdFx0XHRcdHJlc3VsdCs9cGFyc2VKU09OT2JqZWN0KGpzb25BcnJSb290W2FySWR4XSk7XHJcblx0XHRcdFx0cmVzdWx0Kz1lbmRUYWcoanNvbkFyclJvb3RbYXJJZHhdLGpzb25BcnJPYmopO1x0XHRcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBwYXJzZUpTT05PYmplY3QgKCBqc29uT2JqICkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFwiXCI7XHRcclxuXHJcblx0XHR2YXIgZWxlbWVudHNDbnQgPSBqc29uWG1sRWxlbUNvdW50ICgganNvbk9iaiApO1xyXG5cdFx0XHJcblx0XHRpZihlbGVtZW50c0NudCA+IDApIHtcclxuXHRcdFx0Zm9yKCB2YXIgaXQgaW4ganNvbk9iaiApIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihqc29uWG1sU3BlY2lhbEVsZW0gKCBqc29uT2JqLCBpdCkgKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHN1Yk9iaiA9IGpzb25PYmpbaXRdO1x0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBhdHRyTGlzdCA9IHBhcnNlSlNPTkF0dHJpYnV0ZXMoIHN1Yk9iaiApXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoc3ViT2JqID09IG51bGwgfHwgc3ViT2JqID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0cmVzdWx0Kz1zdGFydFRhZyhzdWJPYmosIGl0LCBhdHRyTGlzdCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZihzdWJPYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoc3ViT2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHJlc3VsdCs9cGFyc2VKU09OQXJyYXkoIHN1Yk9iaiwgaXQsIGF0dHJMaXN0ICk7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZihzdWJPYmogaW5zdGFuY2VvZiBEYXRlKSB7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCs9c3RhcnRUYWcoc3ViT2JqLCBpdCwgYXR0ckxpc3QsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0cmVzdWx0Kz1zdWJPYmoudG9JU09TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0cmVzdWx0Kz1lbmRUYWcoc3ViT2JqLGl0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR2YXIgc3ViT2JqRWxlbWVudHNDbnQgPSBqc29uWG1sRWxlbUNvdW50ICggc3ViT2JqICk7XHJcblx0XHRcdFx0XHRcdGlmKHN1Yk9iakVsZW1lbnRzQ250ID4gMCB8fCBzdWJPYmouX190ZXh0IT1udWxsIHx8IHN1Yk9iai5fX2NkYXRhIT1udWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0Kz1zdGFydFRhZyhzdWJPYmosIGl0LCBhdHRyTGlzdCwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCs9cGFyc2VKU09OT2JqZWN0KHN1Yk9iaik7XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0Kz1lbmRUYWcoc3ViT2JqLGl0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRyZXN1bHQrPXN0YXJ0VGFnKHN1Yk9iaiwgaXQsIGF0dHJMaXN0LCB0cnVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHJlc3VsdCs9c3RhcnRUYWcoc3ViT2JqLCBpdCwgYXR0ckxpc3QsIGZhbHNlKTtcclxuXHRcdFx0XHRcdHJlc3VsdCs9cGFyc2VKU09OVGV4dE9iamVjdChzdWJPYmopO1xyXG5cdFx0XHRcdFx0cmVzdWx0Kz1lbmRUYWcoc3ViT2JqLGl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJlc3VsdCs9cGFyc2VKU09OVGV4dE9iamVjdChqc29uT2JqKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5wYXJzZVhtbFN0cmluZyA9IGZ1bmN0aW9uKHhtbERvY1N0cikge1xyXG5cclxuXHRcdGlmICh4bWxEb2NTdHIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdHZhciB4bWxEb2M7XHJcbiAgICAgICAgdmFyIHBhcnNlcj1uZXcgRE9NUGFyc2VyKCk7XHRcdFx0XHJcbiAgICAgICAgdmFyIHBhcnNlcmVycm9yTlMgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoIHhtbERvY1N0ciwgXCJ0ZXh0L3htbFwiICk7XHJcbiAgICAgICAgICAgIGlmKCBwYXJzZXJlcnJvck5TIT0gbnVsbCAmJiB4bWxEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUyhwYXJzZXJlcnJvck5TLCBcInBhcnNlcmVycm9yXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vdGhyb3cgbmV3IEVycm9yKCdFcnJvciBwYXJzaW5nIFhNTDogJyt4bWxEb2NTdHIpO1xyXG4gICAgICAgICAgICAgICAgeG1sRG9jID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgeG1sRG9jID0gbnVsbDtcclxuICAgICAgICB9XHJcblx0XHRcclxuXHRcdHJldHVybiB4bWxEb2M7XHJcblx0fTtcclxuXHRcclxuXHR0aGlzLmFzQXJyYXkgPSBmdW5jdGlvbihwcm9wKSB7XHJcblx0XHRpZihwcm9wIGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHRcdHJldHVybiBwcm9wO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gW3Byb3BdO1xyXG5cdH07XHJcblx0XHJcblx0dGhpcy50b1htbERhdGVUaW1lID0gZnVuY3Rpb24oZHQpIHtcclxuXHRcdGlmKGR0IGluc3RhbmNlb2YgRGF0ZSlcclxuXHRcdFx0cmV0dXJuIGR0LnRvSVNPU3RyaW5nKCk7XHJcblx0XHRlbHNlXHJcblx0XHRpZih0eXBlb2YoZHQpID09PSAnbnVtYmVyJyApXHJcblx0XHRcdHJldHVybiBuZXcgRGF0ZShkdCkudG9JU09TdHJpbmcoKTtcclxuXHRcdGVsc2VcdFxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHR9O1xyXG5cdFxyXG5cdHRoaXMuYXNEYXRlVGltZSA9IGZ1bmN0aW9uKHByb3ApIHtcclxuXHRcdGlmKHR5cGVvZihwcm9wKSA9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHJldHVybiBmcm9tWG1sRGF0ZVRpbWUocHJvcCk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBwcm9wO1xyXG5cdH07XHJcblxyXG5cdHRoaXMueG1sMmpzb24gPSBmdW5jdGlvbiAoeG1sRG9jKSB7XHJcblx0XHRyZXR1cm4gcGFyc2VET01DaGlsZHJlbiAoIHhtbERvYyApO1xyXG5cdH07XHJcblx0XHJcblx0dGhpcy54bWxfc3RyMmpzb24gPSBmdW5jdGlvbiAoeG1sRG9jU3RyKSB7XHJcblx0XHR2YXIgeG1sRG9jID0gdGhpcy5wYXJzZVhtbFN0cmluZyh4bWxEb2NTdHIpO1xyXG5cdFx0aWYoeG1sRG9jIT1udWxsKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy54bWwyanNvbih4bWxEb2MpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHR9O1xyXG5cclxuXHR0aGlzLmpzb24yeG1sX3N0ciA9IGZ1bmN0aW9uIChqc29uT2JqKSB7XHJcblx0XHRyZXR1cm4gcGFyc2VKU09OT2JqZWN0ICgganNvbk9iaiApO1xyXG5cdH07XHJcblxyXG5cdHRoaXMuanNvbjJ4bWwgPSBmdW5jdGlvbiAoanNvbk9iaikge1xyXG5cdFx0dmFyIHhtbERvY1N0ciA9IHRoaXMuanNvbjJ4bWxfc3RyIChqc29uT2JqKTtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlWG1sU3RyaW5nKHhtbERvY1N0cik7XHJcblx0fTtcclxuXHRcclxuXHR0aGlzLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gVkVSU0lPTjtcclxuXHR9O1xyXG5cdFxyXG59XHJcbiIsIi8qIVxuICogbXVzdGFjaGUuanMgLSBMb2dpYy1sZXNzIHt7bXVzdGFjaGV9fSB0ZW1wbGF0ZXMgd2l0aCBKYXZhU2NyaXB0XG4gKiBodHRwOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzXG4gKi9cblxuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiAmJiBleHBvcnRzKSB7XG4gICAgZmFjdG9yeShleHBvcnRzKTsgLy8gQ29tbW9uSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7IC8vIEFNRFxuICB9IGVsc2Uge1xuICAgIGZhY3RvcnkoZ2xvYmFsLk11c3RhY2hlID0ge30pOyAvLyA8c2NyaXB0PlxuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChtdXN0YWNoZSkge1xuXG4gIHZhciBPYmplY3RfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3RfdG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgXCJcXFxcJCZcIik7XG4gIH1cblxuICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2lzc3Vlcy5hcGFjaGUub3JnL2ppcmEvYnJvd3NlL0NPVUNIREItNTc3XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMTg5XG4gIHZhciBSZWdFeHBfdGVzdCA9IFJlZ0V4cC5wcm90b3R5cGUudGVzdDtcbiAgZnVuY3Rpb24gdGVzdFJlZ0V4cChyZSwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIFJlZ0V4cF90ZXN0LmNhbGwocmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgbm9uU3BhY2VSZSA9IC9cXFMvO1xuICBmdW5jdGlvbiBpc1doaXRlc3BhY2Uoc3RyaW5nKSB7XG4gICAgcmV0dXJuICF0ZXN0UmVnRXhwKG5vblNwYWNlUmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgIFwiJlwiOiBcIiZhbXA7XCIsXG4gICAgXCI8XCI6IFwiJmx0O1wiLFxuICAgIFwiPlwiOiBcIiZndDtcIixcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICBcIi9cIjogJyYjeDJGOydcbiAgfTtcblxuICBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bJjw+XCInXFwvXS9nLCBmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIGVudGl0eU1hcFtzXTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB3aGl0ZVJlID0gL1xccyovO1xuICB2YXIgc3BhY2VSZSA9IC9cXHMrLztcbiAgdmFyIGVxdWFsc1JlID0gL1xccyo9LztcbiAgdmFyIGN1cmx5UmUgPSAvXFxzKlxcfS87XG4gIHZhciB0YWdSZSA9IC8jfFxcXnxcXC98PnxcXHt8Jnw9fCEvO1xuXG4gIC8qKlxuICAgKiBCcmVha3MgdXAgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgc3RyaW5nIGludG8gYSB0cmVlIG9mIHRva2Vucy4gSWYgdGhlIGB0YWdzYFxuICAgKiBhcmd1bWVudCBpcyBnaXZlbiBoZXJlIGl0IG11c3QgYmUgYW4gYXJyYXkgd2l0aCB0d28gc3RyaW5nIHZhbHVlczogdGhlXG4gICAqIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFncyB1c2VkIGluIHRoZSB0ZW1wbGF0ZSAoZS5nLiBbIFwiPCVcIiwgXCIlPlwiIF0pLiBPZlxuICAgKiBjb3Vyc2UsIHRoZSBkZWZhdWx0IGlzIHRvIHVzZSBtdXN0YWNoZXMgKGkuZS4gbXVzdGFjaGUudGFncykuXG4gICAqXG4gICAqIEEgdG9rZW4gaXMgYW4gYXJyYXkgd2l0aCBhdCBsZWFzdCA0IGVsZW1lbnRzLiBUaGUgZmlyc3QgZWxlbWVudCBpcyB0aGVcbiAgICogbXVzdGFjaGUgc3ltYm9sIHRoYXQgd2FzIHVzZWQgaW5zaWRlIHRoZSB0YWcsIGUuZy4gXCIjXCIgb3IgXCImXCIuIElmIHRoZSB0YWdcbiAgICogZGlkIG5vdCBjb250YWluIGEgc3ltYm9sIChpLmUuIHt7bXlWYWx1ZX19KSB0aGlzIGVsZW1lbnQgaXMgXCJuYW1lXCIuIEZvclxuICAgKiBhbGwgdGV4dCB0aGF0IGFwcGVhcnMgb3V0c2lkZSBhIHN5bWJvbCB0aGlzIGVsZW1lbnQgaXMgXCJ0ZXh0XCIuXG4gICAqXG4gICAqIFRoZSBzZWNvbmQgZWxlbWVudCBvZiBhIHRva2VuIGlzIGl0cyBcInZhbHVlXCIuIEZvciBtdXN0YWNoZSB0YWdzIHRoaXMgaXNcbiAgICogd2hhdGV2ZXIgZWxzZSB3YXMgaW5zaWRlIHRoZSB0YWcgYmVzaWRlcyB0aGUgb3BlbmluZyBzeW1ib2wuIEZvciB0ZXh0IHRva2Vuc1xuICAgKiB0aGlzIGlzIHRoZSB0ZXh0IGl0c2VsZi5cbiAgICpcbiAgICogVGhlIHRoaXJkIGFuZCBmb3VydGggZWxlbWVudHMgb2YgdGhlIHRva2VuIGFyZSB0aGUgc3RhcnQgYW5kIGVuZCBpbmRpY2VzLFxuICAgKiByZXNwZWN0aXZlbHksIG9mIHRoZSB0b2tlbiBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUuXG4gICAqXG4gICAqIFRva2VucyB0aGF0IGFyZSB0aGUgcm9vdCBub2RlIG9mIGEgc3VidHJlZSBjb250YWluIHR3byBtb3JlIGVsZW1lbnRzOiAxKSBhblxuICAgKiBhcnJheSBvZiB0b2tlbnMgaW4gdGhlIHN1YnRyZWUgYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgYXRcbiAgICogd2hpY2ggdGhlIGNsb3NpbmcgdGFnIGZvciB0aGF0IHNlY3Rpb24gYmVnaW5zLlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdGFncykge1xuICAgIGlmICghdGVtcGxhdGUpXG4gICAgICByZXR1cm4gW107XG5cbiAgICB2YXIgc2VjdGlvbnMgPSBbXTsgICAgIC8vIFN0YWNrIHRvIGhvbGQgc2VjdGlvbiB0b2tlbnNcbiAgICB2YXIgdG9rZW5zID0gW107ICAgICAgIC8vIEJ1ZmZlciB0byBob2xkIHRoZSB0b2tlbnNcbiAgICB2YXIgc3BhY2VzID0gW107ICAgICAgIC8vIEluZGljZXMgb2Ygd2hpdGVzcGFjZSB0b2tlbnMgb24gdGhlIGN1cnJlbnQgbGluZVxuICAgIHZhciBoYXNUYWcgPSBmYWxzZTsgICAgLy8gSXMgdGhlcmUgYSB7e3RhZ319IG9uIHRoZSBjdXJyZW50IGxpbmU/XG4gICAgdmFyIG5vblNwYWNlID0gZmFsc2U7ICAvLyBJcyB0aGVyZSBhIG5vbi1zcGFjZSBjaGFyIG9uIHRoZSBjdXJyZW50IGxpbmU/XG5cbiAgICAvLyBTdHJpcHMgYWxsIHdoaXRlc3BhY2UgdG9rZW5zIGFycmF5IGZvciB0aGUgY3VycmVudCBsaW5lXG4gICAgLy8gaWYgdGhlcmUgd2FzIGEge3sjdGFnfX0gb24gaXQgYW5kIG90aGVyd2lzZSBvbmx5IHNwYWNlLlxuICAgIGZ1bmN0aW9uIHN0cmlwU3BhY2UoKSB7XG4gICAgICBpZiAoaGFzVGFnICYmICFub25TcGFjZSkge1xuICAgICAgICB3aGlsZSAoc3BhY2VzLmxlbmd0aClcbiAgICAgICAgICBkZWxldGUgdG9rZW5zW3NwYWNlcy5wb3AoKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFjZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaGFzVGFnID0gZmFsc2U7XG4gICAgICBub25TcGFjZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvcGVuaW5nVGFnUmUsIGNsb3NpbmdUYWdSZSwgY2xvc2luZ0N1cmx5UmU7XG4gICAgZnVuY3Rpb24gY29tcGlsZVRhZ3ModGFncykge1xuICAgICAgaWYgKHR5cGVvZiB0YWdzID09PSAnc3RyaW5nJylcbiAgICAgICAgdGFncyA9IHRhZ3Muc3BsaXQoc3BhY2VSZSwgMik7XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWdzKSB8fCB0YWdzLmxlbmd0aCAhPT0gMilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRhZ3M6ICcgKyB0YWdzKTtcblxuICAgICAgb3BlbmluZ1RhZ1JlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAodGFnc1swXSkgKyAnXFxcXHMqJyk7XG4gICAgICBjbG9zaW5nVGFnUmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKHRhZ3NbMV0pKTtcbiAgICAgIGNsb3NpbmdDdXJseVJlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCgnfScgKyB0YWdzWzFdKSk7XG4gICAgfVxuXG4gICAgY29tcGlsZVRhZ3ModGFncyB8fCBtdXN0YWNoZS50YWdzKTtcblxuICAgIHZhciBzY2FubmVyID0gbmV3IFNjYW5uZXIodGVtcGxhdGUpO1xuXG4gICAgdmFyIHN0YXJ0LCB0eXBlLCB2YWx1ZSwgY2hyLCB0b2tlbiwgb3BlblNlY3Rpb247XG4gICAgd2hpbGUgKCFzY2FubmVyLmVvcygpKSB7XG4gICAgICBzdGFydCA9IHNjYW5uZXIucG9zO1xuXG4gICAgICAvLyBNYXRjaCBhbnkgdGV4dCBiZXR3ZWVuIHRhZ3MuXG4gICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKG9wZW5pbmdUYWdSZSk7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCB2YWx1ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY2hyID0gdmFsdWUuY2hhckF0KGkpO1xuXG4gICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZShjaHIpKSB7XG4gICAgICAgICAgICBzcGFjZXMucHVzaCh0b2tlbnMubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRva2Vucy5wdXNoKFsgJ3RleHQnLCBjaHIsIHN0YXJ0LCBzdGFydCArIDEgXSk7XG4gICAgICAgICAgc3RhcnQgKz0gMTtcblxuICAgICAgICAgIC8vIENoZWNrIGZvciB3aGl0ZXNwYWNlIG9uIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgICAgICAgaWYgKGNociA9PT0gJ1xcbicpXG4gICAgICAgICAgICBzdHJpcFNwYWNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTWF0Y2ggdGhlIG9wZW5pbmcgdGFnLlxuICAgICAgaWYgKCFzY2FubmVyLnNjYW4ob3BlbmluZ1RhZ1JlKSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGhhc1RhZyA9IHRydWU7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHR5cGUuXG4gICAgICB0eXBlID0gc2Nhbm5lci5zY2FuKHRhZ1JlKSB8fCAnbmFtZSc7XG4gICAgICBzY2FubmVyLnNjYW4od2hpdGVSZSk7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHZhbHVlLlxuICAgICAgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3snKSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ0N1cmx5UmUpO1xuICAgICAgICBzY2FubmVyLnNjYW4oY3VybHlSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICAgIHR5cGUgPSAnJic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBjbG9zaW5nIHRhZy5cbiAgICAgIGlmICghc2Nhbm5lci5zY2FuKGNsb3NpbmdUYWdSZSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgdGFnIGF0ICcgKyBzY2FubmVyLnBvcyk7XG5cbiAgICAgIHRva2VuID0gWyB0eXBlLCB2YWx1ZSwgc3RhcnQsIHNjYW5uZXIucG9zIF07XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG5cbiAgICAgIGlmICh0eXBlID09PSAnIycgfHwgdHlwZSA9PT0gJ14nKSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnLycpIHtcbiAgICAgICAgLy8gQ2hlY2sgc2VjdGlvbiBuZXN0aW5nLlxuICAgICAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgICAgIGlmICghb3BlblNlY3Rpb24pXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbm9wZW5lZCBzZWN0aW9uIFwiJyArIHZhbHVlICsgJ1wiIGF0ICcgKyBzdGFydCk7XG5cbiAgICAgICAgaWYgKG9wZW5TZWN0aW9uWzFdICE9PSB2YWx1ZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHN0YXJ0KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ25hbWUnIHx8IHR5cGUgPT09ICd7JyB8fCB0eXBlID09PSAnJicpIHtcbiAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnPScpIHtcbiAgICAgICAgLy8gU2V0IHRoZSB0YWdzIGZvciB0aGUgbmV4dCB0aW1lIGFyb3VuZC5cbiAgICAgICAgY29tcGlsZVRhZ3ModmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gb3BlbiBzZWN0aW9ucyB3aGVuIHdlJ3JlIGRvbmUuXG4gICAgb3BlblNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcblxuICAgIGlmIChvcGVuU2VjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgc2VjdGlvbiBcIicgKyBvcGVuU2VjdGlvblsxXSArICdcIiBhdCAnICsgc2Nhbm5lci5wb3MpO1xuXG4gICAgcmV0dXJuIG5lc3RUb2tlbnMoc3F1YXNoVG9rZW5zKHRva2VucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbWJpbmVzIHRoZSB2YWx1ZXMgb2YgY29uc2VjdXRpdmUgdGV4dCB0b2tlbnMgaW4gdGhlIGdpdmVuIGB0b2tlbnNgIGFycmF5XG4gICAqIHRvIGEgc2luZ2xlIHRva2VuLlxuICAgKi9cbiAgZnVuY3Rpb24gc3F1YXNoVG9rZW5zKHRva2Vucykge1xuICAgIHZhciBzcXVhc2hlZFRva2VucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBsYXN0VG9rZW47XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBpZiAodG9rZW5bMF0gPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4gJiYgbGFzdFRva2VuWzBdID09PSAndGV4dCcpIHtcbiAgICAgICAgICBsYXN0VG9rZW5bMV0gKz0gdG9rZW5bMV07XG4gICAgICAgICAgbGFzdFRva2VuWzNdID0gdG9rZW5bM107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3F1YXNoZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgbGFzdFRva2VuID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3F1YXNoZWRUb2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogRm9ybXMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIGludG8gYSBuZXN0ZWQgdHJlZSBzdHJ1Y3R1cmUgd2hlcmVcbiAgICogdG9rZW5zIHRoYXQgcmVwcmVzZW50IGEgc2VjdGlvbiBoYXZlIHR3byBhZGRpdGlvbmFsIGl0ZW1zOiAxKSBhbiBhcnJheSBvZlxuICAgKiBhbGwgdG9rZW5zIHRoYXQgYXBwZWFyIGluIHRoYXQgc2VjdGlvbiBhbmQgMikgdGhlIGluZGV4IGluIHRoZSBvcmlnaW5hbFxuICAgKiB0ZW1wbGF0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGVuZCBvZiB0aGF0IHNlY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBuZXN0VG9rZW5zKHRva2Vucykge1xuICAgIHZhciBuZXN0ZWRUb2tlbnMgPSBbXTtcbiAgICB2YXIgY29sbGVjdG9yID0gbmVzdGVkVG9rZW5zO1xuICAgIHZhciBzZWN0aW9ucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBzZWN0aW9uO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICBzd2l0Y2ggKHRva2VuWzBdKSB7XG4gICAgICBjYXNlICcjJzpcbiAgICAgIGNhc2UgJ14nOlxuICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgICBjb2xsZWN0b3IgPSB0b2tlbls0XSA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJy8nOlxuICAgICAgICBzZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG4gICAgICAgIHNlY3Rpb25bNV0gPSB0b2tlblsyXTtcbiAgICAgICAgY29sbGVjdG9yID0gc2VjdGlvbnMubGVuZ3RoID4gMCA/IHNlY3Rpb25zW3NlY3Rpb25zLmxlbmd0aCAtIDFdWzRdIDogbmVzdGVkVG9rZW5zO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbGxlY3Rvci5wdXNoKHRva2VuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVzdGVkVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2ltcGxlIHN0cmluZyBzY2FubmVyIHRoYXQgaXMgdXNlZCBieSB0aGUgdGVtcGxhdGUgcGFyc2VyIHRvIGZpbmRcbiAgICogdG9rZW5zIGluIHRlbXBsYXRlIHN0cmluZ3MuXG4gICAqL1xuICBmdW5jdGlvbiBTY2FubmVyKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIHRoaXMudGFpbCA9IHN0cmluZztcbiAgICB0aGlzLnBvcyA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRhaWwgaXMgZW1wdHkgKGVuZCBvZiBzdHJpbmcpLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuZW9zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWwgPT09IFwiXCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIG1hdGNoIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIFJldHVybnMgdGhlIG1hdGNoZWQgdGV4dCBpZiBpdCBjYW4gbWF0Y2gsIHRoZSBlbXB0eSBzdHJpbmcgb3RoZXJ3aXNlLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuc2NhbiA9IGZ1bmN0aW9uIChyZSkge1xuICAgIHZhciBtYXRjaCA9IHRoaXMudGFpbC5tYXRjaChyZSk7XG5cbiAgICBpZiAoIW1hdGNoIHx8IG1hdGNoLmluZGV4ICE9PSAwKVxuICAgICAgcmV0dXJuICcnO1xuXG4gICAgdmFyIHN0cmluZyA9IG1hdGNoWzBdO1xuXG4gICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKTtcbiAgICB0aGlzLnBvcyArPSBzdHJpbmcubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICAvKipcbiAgICogU2tpcHMgYWxsIHRleHQgdW50aWwgdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbiBjYW4gYmUgbWF0Y2hlZC4gUmV0dXJuc1xuICAgKiB0aGUgc2tpcHBlZCBzdHJpbmcsIHdoaWNoIGlzIHRoZSBlbnRpcmUgdGFpbCBpZiBubyBtYXRjaCBjYW4gYmUgbWFkZS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLnNjYW5VbnRpbCA9IGZ1bmN0aW9uIChyZSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudGFpbC5zZWFyY2gocmUpLCBtYXRjaDtcblxuICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICBjYXNlIC0xOlxuICAgICAgbWF0Y2ggPSB0aGlzLnRhaWw7XG4gICAgICB0aGlzLnRhaWwgPSBcIlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAwOlxuICAgICAgbWF0Y2ggPSBcIlwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG1hdGNoID0gdGhpcy50YWlsLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKGluZGV4KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcyArPSBtYXRjaC5sZW5ndGg7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSByZW5kZXJpbmcgY29udGV4dCBieSB3cmFwcGluZyBhIHZpZXcgb2JqZWN0IGFuZFxuICAgKiBtYWludGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGNvbnRleHQuXG4gICAqL1xuICBmdW5jdGlvbiBDb250ZXh0KHZpZXcsIHBhcmVudENvbnRleHQpIHtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMuY2FjaGUgPSB7ICcuJzogdGhpcy52aWV3IH07XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29udGV4dCB1c2luZyB0aGUgZ2l2ZW4gdmlldyB3aXRoIHRoaXMgY29udGV4dFxuICAgKiBhcyB0aGUgcGFyZW50LlxuICAgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZXh0KHZpZXcsIHRoaXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGlzIGNvbnRleHQsIHRyYXZlcnNpbmdcbiAgICogdXAgdGhlIGNvbnRleHQgaGllcmFyY2h5IGlmIHRoZSB2YWx1ZSBpcyBhYnNlbnQgaW4gdGhpcyBjb250ZXh0J3Mgdmlldy5cbiAgICovXG4gIENvbnRleHQucHJvdG90eXBlLmxvb2t1cCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcblxuICAgIHZhciB2YWx1ZTtcbiAgICBpZiAobmFtZSBpbiBjYWNoZSkge1xuICAgICAgdmFsdWUgPSBjYWNoZVtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBuYW1lcywgaW5kZXgsIGxvb2t1cEhpdCA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoY29udGV4dCkge1xuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0LnZpZXc7XG4gICAgICAgICAgbmFtZXMgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVXNpbmcgdGhlIGRvdCBub3Rpb24gcGF0aCBpbiBgbmFtZWAsIHdlIGRlc2NlbmQgdGhyb3VnaCB0aGVcbiAgICAgICAgICAgKiBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRvIGJlIGNlcnRhaW4gdGhhdCB0aGUgbG9va3VwIGhhcyBiZWVuIHN1Y2Nlc3NmdWwsIHdlIGhhdmUgdG9cbiAgICAgICAgICAgKiBjaGVjayBpZiB0aGUgbGFzdCBvYmplY3QgaW4gdGhlIHBhdGggYWN0dWFsbHkgaGFzIHRoZSBwcm9wZXJ0eVxuICAgICAgICAgICAqIHdlIGFyZSBsb29raW5nIGZvci4gV2Ugc3RvcmUgdGhlIHJlc3VsdCBpbiBgbG9va3VwSGl0YC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRoaXMgaXMgc3BlY2lhbGx5IG5lY2Vzc2FyeSBmb3Igd2hlbiB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0IHRvXG4gICAgICAgICAgICogYHVuZGVmaW5lZGAgYW5kIHdlIHdhbnQgdG8gYXZvaWQgbG9va2luZyB1cCBwYXJlbnQgY29udGV4dHMuXG4gICAgICAgICAgICoqL1xuICAgICAgICAgIHdoaWxlICh2YWx1ZSAhPSBudWxsICYmIGluZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IG5hbWVzLmxlbmd0aCAtIDEgJiYgdmFsdWUgIT0gbnVsbClcbiAgICAgICAgICAgICAgbG9va3VwSGl0ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkobmFtZXNbaW5kZXhdKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbbmFtZXNbaW5kZXgrK11dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LnZpZXcgIT0gbnVsbCAmJiB0eXBlb2YgY29udGV4dC52aWV3ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dC52aWV3W25hbWVdO1xuICAgICAgICAgIGxvb2t1cEhpdCA9IGNvbnRleHQudmlldy5oYXNPd25Qcm9wZXJ0eShuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29rdXBIaXQpXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBjYWNoZVtuYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSlcbiAgICAgIHZhbHVlID0gdmFsdWUuY2FsbCh0aGlzLnZpZXcpO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIFdyaXRlciBrbm93cyBob3cgdG8gdGFrZSBhIHN0cmVhbSBvZiB0b2tlbnMgYW5kIHJlbmRlciB0aGVtIHRvIGFcbiAgICogc3RyaW5nLCBnaXZlbiBhIGNvbnRleHQuIEl0IGFsc28gbWFpbnRhaW5zIGEgY2FjaGUgb2YgdGVtcGxhdGVzIHRvXG4gICAqIGF2b2lkIHRoZSBuZWVkIHRvIHBhcnNlIHRoZSBzYW1lIHRlbXBsYXRlIHR3aWNlLlxuICAgKi9cbiAgZnVuY3Rpb24gV3JpdGVyKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhpcyB3cml0ZXIuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgdG9rZW5zXG4gICAqIHRoYXQgaXMgZ2VuZXJhdGVkIGZyb20gdGhlIHBhcnNlLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG4gICAgdmFyIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXTtcblxuICAgIGlmICh0b2tlbnMgPT0gbnVsbClcbiAgICAgIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXSA9IHBhcnNlVGVtcGxhdGUodGVtcGxhdGUsIHRhZ3MpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfTtcblxuICAvKipcbiAgICogSGlnaC1sZXZlbCBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIHJlbmRlciB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCB3aXRoXG4gICAqIHRoZSBnaXZlbiBgdmlld2AuXG4gICAqXG4gICAqIFRoZSBvcHRpb25hbCBgcGFydGlhbHNgIGFyZ3VtZW50IG1heSBiZSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGVcbiAgICogbmFtZXMgYW5kIHRlbXBsYXRlcyBvZiBwYXJ0aWFscyB0aGF0IGFyZSB1c2VkIGluIHRoZSB0ZW1wbGF0ZS4gSXQgbWF5XG4gICAqIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbG9hZCBwYXJ0aWFsIHRlbXBsYXRlcyBvbiB0aGUgZmx5XG4gICAqIHRoYXQgdGFrZXMgYSBzaW5nbGUgYXJndW1lbnQ6IHRoZSBuYW1lIG9mIHRoZSBwYXJ0aWFsLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKSB7XG4gICAgdmFyIHRva2VucyA9IHRoaXMucGFyc2UodGVtcGxhdGUpO1xuICAgIHZhciBjb250ZXh0ID0gKHZpZXcgaW5zdGFuY2VvZiBDb250ZXh0KSA/IHZpZXcgOiBuZXcgQ29udGV4dCh2aWV3KTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5zLCBjb250ZXh0LCBwYXJ0aWFscywgdGVtcGxhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb3ctbGV2ZWwgbWV0aG9kIHRoYXQgcmVuZGVycyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgdXNpbmdcbiAgICogdGhlIGdpdmVuIGBjb250ZXh0YCBhbmQgYHBhcnRpYWxzYC5cbiAgICpcbiAgICogTm90ZTogVGhlIGBvcmlnaW5hbFRlbXBsYXRlYCBpcyBvbmx5IGV2ZXIgdXNlZCB0byBleHRyYWN0IHRoZSBwb3J0aW9uXG4gICAqIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0aGF0IHdhcyBjb250YWluZWQgaW4gYSBoaWdoZXItb3JkZXIgc2VjdGlvbi5cbiAgICogSWYgdGhlIHRlbXBsYXRlIGRvZXNuJ3QgdXNlIGhpZ2hlci1vcmRlciBzZWN0aW9ucywgdGhpcyBhcmd1bWVudCBtYXlcbiAgICogYmUgb21pdHRlZC5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyVG9rZW5zID0gZnVuY3Rpb24gKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgYnVmZmVyID0gJyc7XG5cbiAgICB2YXIgdG9rZW4sIHN5bWJvbCwgdmFsdWU7XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgIHN5bWJvbCA9IHRva2VuWzBdO1xuXG4gICAgICBpZiAoc3ltYm9sID09PSAnIycpIHZhbHVlID0gdGhpcy5fcmVuZGVyU2VjdGlvbih0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnXicpIHZhbHVlID0gdGhpcy5fcmVuZGVySW52ZXJ0ZWQodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJz4nKSB2YWx1ZSA9IHRoaXMuX3JlbmRlclBhcnRpYWwodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJyYnKSB2YWx1ZSA9IHRoaXMuX3VuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ25hbWUnKSB2YWx1ZSA9IHRoaXMuX2VzY2FwZWRWYWx1ZSh0b2tlbiwgY29udGV4dCk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICd0ZXh0JykgdmFsdWUgPSB0aGlzLl9yYXdWYWx1ZSh0b2tlbik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLl9yZW5kZXJTZWN0aW9uID0gZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVyID0gJyc7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHJlbmRlciBhbiBhcmJpdHJhcnkgdGVtcGxhdGVcbiAgICAvLyBpbiB0aGUgY3VycmVudCBjb250ZXh0IGJ5IGhpZ2hlci1vcmRlciBzZWN0aW9ucy5cbiAgICBmdW5jdGlvbiBzdWJSZW5kZXIodGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwgY29udGV4dCwgcGFydGlhbHMpO1xuICAgIH1cblxuICAgIGlmICghdmFsdWUpIHJldHVybjtcblxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBqIDwgdmFsdWVMZW5ndGg7ICsraikge1xuICAgICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZVtqXSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG9yaWdpbmFsVGVtcGxhdGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zIHdpdGhvdXQgdGhlIG9yaWdpbmFsIHRlbXBsYXRlJyk7XG5cbiAgICAgIC8vIEV4dHJhY3QgdGhlIHBvcnRpb24gb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgdGhlIHNlY3Rpb24gY29udGFpbnMuXG4gICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwoY29udGV4dC52aWV3LCBvcmlnaW5hbFRlbXBsYXRlLnNsaWNlKHRva2VuWzNdLCB0b2tlbls1XSksIHN1YlJlbmRlcik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUuX3JlbmRlckludmVydGVkID0gZnVuY3Rpb24odG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVXNlIEphdmFTY3JpcHQncyBkZWZpbml0aW9uIG9mIGZhbHN5LiBJbmNsdWRlIGVtcHR5IGFycmF5cy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzE4NlxuICAgIGlmICghdmFsdWUgfHwgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLl9yZW5kZXJQYXJ0aWFsID0gZnVuY3Rpb24odG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzKSB7XG4gICAgaWYgKCFwYXJ0aWFscykgcmV0dXJuO1xuXG4gICAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbihwYXJ0aWFscykgPyBwYXJ0aWFscyh0b2tlblsxXSkgOiBwYXJ0aWFsc1t0b2tlblsxXV07XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModGhpcy5wYXJzZSh2YWx1ZSksIGNvbnRleHQsIHBhcnRpYWxzLCB2YWx1ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5fdW5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbih0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLl9lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbih0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiBtdXN0YWNoZS5lc2NhcGUodmFsdWUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUuX3Jhd1ZhbHVlID0gZnVuY3Rpb24odG9rZW4pIHtcbiAgICByZXR1cm4gdG9rZW5bMV07XG4gIH07XG5cbiAgbXVzdGFjaGUubmFtZSA9IFwibXVzdGFjaGUuanNcIjtcbiAgbXVzdGFjaGUudmVyc2lvbiA9IFwiMi4wLjBcIjtcbiAgbXVzdGFjaGUudGFncyA9IFsgXCJ7e1wiLCBcIn19XCIgXTtcblxuICAvLyBBbGwgaGlnaC1sZXZlbCBtdXN0YWNoZS4qIGZ1bmN0aW9ucyB1c2UgdGhpcyB3cml0ZXIuXG4gIHZhciBkZWZhdWx0V3JpdGVyID0gbmV3IFdyaXRlcigpO1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhlIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgbXVzdGFjaGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5jbGVhckNhY2hlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiB0ZW1wbGF0ZSBpbiB0aGUgZGVmYXVsdCB3cml0ZXIgYW5kIHJldHVybnMgdGhlXG4gICAqIGFycmF5IG9mIHRva2VucyBpdCBjb250YWlucy4gRG9pbmcgdGhpcyBhaGVhZCBvZiB0aW1lIGF2b2lkcyB0aGUgbmVlZCB0b1xuICAgKiBwYXJzZSB0ZW1wbGF0ZXMgb24gdGhlIGZseSBhcyB0aGV5IGFyZSByZW5kZXJlZC5cbiAgICovXG4gIG11c3RhY2hlLnBhcnNlID0gZnVuY3Rpb24gKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucGFyc2UodGVtcGxhdGUsIHRhZ3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBgdGVtcGxhdGVgIHdpdGggdGhlIGdpdmVuIGB2aWV3YCBhbmQgYHBhcnRpYWxzYCB1c2luZyB0aGVcbiAgICogZGVmYXVsdCB3cml0ZXIuXG4gICAqL1xuICBtdXN0YWNoZS5yZW5kZXIgPSBmdW5jdGlvbiAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyk7XG4gIH07XG5cbiAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIDAuNC54LlxuICBtdXN0YWNoZS50b19odG1sID0gZnVuY3Rpb24gKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscywgc2VuZCkge1xuICAgIHZhciByZXN1bHQgPSBtdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbmQpKSB7XG4gICAgICBzZW5kKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgZXNjYXBpbmcgZnVuY3Rpb24gc28gdGhhdCB0aGUgdXNlciBtYXkgb3ZlcnJpZGUgaXQuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMjQ0XG4gIG11c3RhY2hlLmVzY2FwZSA9IGVzY2FwZUh0bWw7XG5cbiAgLy8gRXhwb3J0IHRoZXNlIG1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28gZm9yIGFkdmFuY2VkIHVzYWdlLlxuICBtdXN0YWNoZS5TY2FubmVyID0gU2Nhbm5lcjtcbiAgbXVzdGFjaGUuQ29udGV4dCA9IENvbnRleHQ7XG4gIG11c3RhY2hlLldyaXRlciA9IFdyaXRlcjtcblxufSkpO1xuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290ID0gJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHdpbmRvd1xuICA/ICh0aGlzIHx8IHNlbGYpXG4gIDogd2luZG93O1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgICAmJiAoIXJvb3QubG9jYXRpb24gfHwgJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sXG4gICAgICAgICAgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcblxuICAgIHNlbGYuY2FsbGJhY2soZXJyIHx8IG5ld19lcnIsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcyl7XG4gIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQoZmllbGQsIGZpbGUsIGZpbGVuYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgLCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIHF1ZXJ5c3RyaW5nXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbXVsdGlwbGUgZGF0YSBcIndyaXRlc1wiXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3NlYXJjaCcpXG4gKiAgICAgICAgIC5zZW5kKHsgc2VhcmNoOiAncXVlcnknIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgcmFuZ2U6ICcxLi41JyB9KVxuICogICAgICAgICAuc2VuZCh7IG9yZGVyOiAnZGVzYycgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAgKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IGlzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ09yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplW3RoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKV07XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG4gIHhoci5zZW5kKGRhdGEpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZGVsID0gZnVuY3Rpb24odXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwiZnVuY3Rpb24gRE9NUGFyc2VyKG9wdGlvbnMpe1xyXG5cdHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHx7bG9jYXRvcjp7fX07XHJcblx0XHJcbn1cclxuRE9NUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZyb21TdHJpbmcgPSBmdW5jdGlvbihzb3VyY2UsbWltZVR5cGUpe1x0XHJcblx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblx0dmFyIHNheCA9ICBuZXcgWE1MUmVhZGVyKCk7XHJcblx0dmFyIGRvbUJ1aWxkZXIgPSBvcHRpb25zLmRvbUJ1aWxkZXIgfHwgbmV3IERPTUhhbmRsZXIoKTsvL2NvbnRlbnRIYW5kbGVyIGFuZCBMZXhpY2FsSGFuZGxlclxyXG5cdHZhciBlcnJvckhhbmRsZXIgPSBvcHRpb25zLmVycm9ySGFuZGxlcjtcclxuXHR2YXIgbG9jYXRvciA9IG9wdGlvbnMubG9jYXRvcjtcclxuXHR2YXIgZGVmYXVsdE5TTWFwID0gb3B0aW9ucy54bWxuc3x8e307XHJcblx0dmFyIGVudGl0eU1hcCA9IHsnbHQnOic8JywnZ3QnOic+JywnYW1wJzonJicsJ3F1b3QnOidcIicsJ2Fwb3MnOlwiJ1wifVxyXG5cdGlmKGxvY2F0b3Ipe1xyXG5cdFx0ZG9tQnVpbGRlci5zZXREb2N1bWVudExvY2F0b3IobG9jYXRvcilcclxuXHR9XHJcblx0XHJcblx0c2F4LmVycm9ySGFuZGxlciA9IGJ1aWxkRXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcixkb21CdWlsZGVyLGxvY2F0b3IpO1xyXG5cdHNheC5kb21CdWlsZGVyID0gb3B0aW9ucy5kb21CdWlsZGVyIHx8IGRvbUJ1aWxkZXI7XHJcblx0aWYoL1xcL3g/aHRtbD8kLy50ZXN0KG1pbWVUeXBlKSl7XHJcblx0XHRlbnRpdHlNYXAubmJzcCA9ICdcXHhhMCc7XHJcblx0XHRlbnRpdHlNYXAuY29weSA9ICdcXHhhOSc7XHJcblx0XHRkZWZhdWx0TlNNYXBbJyddPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XHJcblx0fVxyXG5cdGlmKHNvdXJjZSl7XHJcblx0XHRzYXgucGFyc2Uoc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXApO1xyXG5cdH1lbHNle1xyXG5cdFx0c2F4LmVycm9ySGFuZGxlci5lcnJvcihcImludmFsaWQgZG9jdW1lbnQgc291cmNlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gZG9tQnVpbGRlci5kb2N1bWVudDtcclxufVxyXG5mdW5jdGlvbiBidWlsZEVycm9ySGFuZGxlcihlcnJvckltcGwsZG9tQnVpbGRlcixsb2NhdG9yKXtcclxuXHRpZighZXJyb3JJbXBsKXtcclxuXHRcdGlmKGRvbUJ1aWxkZXIgaW5zdGFuY2VvZiBET01IYW5kbGVyKXtcclxuXHRcdFx0cmV0dXJuIGRvbUJ1aWxkZXI7XHJcblx0XHR9XHJcblx0XHRlcnJvckltcGwgPSBkb21CdWlsZGVyIDtcclxuXHR9XHJcblx0dmFyIGVycm9ySGFuZGxlciA9IHt9XHJcblx0dmFyIGlzQ2FsbGJhY2sgPSBlcnJvckltcGwgaW5zdGFuY2VvZiBGdW5jdGlvbjtcclxuXHRsb2NhdG9yID0gbG9jYXRvcnx8e31cclxuXHRmdW5jdGlvbiBidWlsZChrZXkpe1xyXG5cdFx0dmFyIGZuID0gZXJyb3JJbXBsW2tleV07XHJcblx0XHRpZighZm4pe1xyXG5cdFx0XHRpZihpc0NhbGxiYWNrKXtcclxuXHRcdFx0XHRmbiA9IGVycm9ySW1wbC5sZW5ndGggPT0gMj9mdW5jdGlvbihtc2cpe2Vycm9ySW1wbChrZXksbXNnKX06ZXJyb3JJbXBsO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR2YXIgaT1hcmd1bWVudHMubGVuZ3RoO1xyXG5cdFx0XHRcdHdoaWxlKC0taSl7XHJcblx0XHRcdFx0XHRpZihmbiA9IGVycm9ySW1wbFthcmd1bWVudHNbaV1dKXtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlcnJvckhhbmRsZXJba2V5XSA9IGZuICYmIGZ1bmN0aW9uKG1zZyl7XHJcblx0XHRcdGZuKG1zZytfbG9jYXRvcihsb2NhdG9yKSk7XHJcblx0XHR9fHxmdW5jdGlvbigpe307XHJcblx0fVxyXG5cdGJ1aWxkKCd3YXJuaW5nJywnd2FybicpO1xyXG5cdGJ1aWxkKCdlcnJvcicsJ3dhcm4nLCd3YXJuaW5nJyk7XHJcblx0YnVpbGQoJ2ZhdGFsRXJyb3InLCd3YXJuJywnd2FybmluZycsJ2Vycm9yJyk7XHJcblx0cmV0dXJuIGVycm9ySGFuZGxlcjtcclxufVxyXG4vKipcclxuICogK0NvbnRlbnRIYW5kbGVyK0Vycm9ySGFuZGxlclxyXG4gKiArTGV4aWNhbEhhbmRsZXIrRW50aXR5UmVzb2x2ZXIyXHJcbiAqIC1EZWNsSGFuZGxlci1EVERIYW5kbGVyIFxyXG4gKiBcclxuICogRGVmYXVsdEhhbmRsZXI6RW50aXR5UmVzb2x2ZXIsIERUREhhbmRsZXIsIENvbnRlbnRIYW5kbGVyLCBFcnJvckhhbmRsZXJcclxuICogRGVmYXVsdEhhbmRsZXIyOkRlZmF1bHRIYW5kbGVyLExleGljYWxIYW5kbGVyLCBEZWNsSGFuZGxlciwgRW50aXR5UmVzb2x2ZXIyXHJcbiAqIEBsaW5rIGh0dHA6Ly93d3cuc2F4cHJvamVjdC5vcmcvYXBpZG9jL29yZy94bWwvc2F4L2hlbHBlcnMvRGVmYXVsdEhhbmRsZXIuaHRtbFxyXG4gKi9cclxuZnVuY3Rpb24gRE9NSGFuZGxlcigpIHtcclxuICAgIHRoaXMuY2RhdGEgPSBmYWxzZTtcclxufVxyXG5mdW5jdGlvbiBwb3NpdGlvbihsb2NhdG9yLG5vZGUpe1xyXG5cdG5vZGUubGluZU51bWJlciA9IGxvY2F0b3IubGluZU51bWJlcjtcclxuXHRub2RlLmNvbHVtbk51bWJlciA9IGxvY2F0b3IuY29sdW1uTnVtYmVyO1xyXG59XHJcbi8qKlxyXG4gKiBAc2VlIG9yZy54bWwuc2F4LkNvbnRlbnRIYW5kbGVyI3N0YXJ0RG9jdW1lbnRcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvQ29udGVudEhhbmRsZXIuaHRtbFxyXG4gKi8gXHJcbkRPTUhhbmRsZXIucHJvdG90eXBlID0ge1xyXG5cdHN0YXJ0RG9jdW1lbnQgOiBmdW5jdGlvbigpIHtcclxuICAgIFx0dGhpcy5kb2N1bWVudCA9IG5ldyBET01JbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURvY3VtZW50KG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgXHRpZiAodGhpcy5sb2NhdG9yKSB7XHJcbiAgICAgICAgXHR0aGlzLmRvY3VtZW50LmRvY3VtZW50VVJJID0gdGhpcy5sb2NhdG9yLnN5c3RlbUlkO1xyXG4gICAgXHR9XHJcblx0fSxcclxuXHRzdGFydEVsZW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUsIHFOYW1lLCBhdHRycykge1xyXG5cdFx0dmFyIGRvYyA9IHRoaXMuZG9jdW1lbnQ7XHJcblx0ICAgIHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxTmFtZXx8bG9jYWxOYW1lKTtcclxuXHQgICAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuXHQgICAgYXBwZW5kRWxlbWVudCh0aGlzLCBlbCk7XHJcblx0ICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSBlbDtcclxuXHQgICAgXHJcblx0XHR0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLGVsKVxyXG5cdCAgICBmb3IgKHZhciBpID0gMCA7IGkgPCBsZW47IGkrKykge1xyXG5cdCAgICAgICAgdmFyIG5hbWVzcGFjZVVSSSA9IGF0dHJzLmdldFVSSShpKTtcclxuXHQgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJzLmdldFZhbHVlKGkpO1xyXG5cdCAgICAgICAgdmFyIHFOYW1lID0gYXR0cnMuZ2V0UU5hbWUoaSk7XHJcblx0XHRcdHZhciBhdHRyID0gZG9jLmNyZWF0ZUF0dHJpYnV0ZU5TKG5hbWVzcGFjZVVSSSwgcU5hbWUpO1xyXG5cdFx0XHRpZiggYXR0ci5nZXRPZmZzZXQpe1xyXG5cdFx0XHRcdHBvc2l0aW9uKGF0dHIuZ2V0T2Zmc2V0KDEpLGF0dHIpXHJcblx0XHRcdH1cclxuXHRcdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGVsLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0ZW5kRWxlbWVudDpmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSwgcU5hbWUpIHtcclxuXHRcdHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50RWxlbWVudFxyXG5cdCAgICB2YXIgdGFnTmFtZSA9IGN1cnJlbnQudGFnTmFtZTtcclxuXHQgICAgdGhpcy5jdXJyZW50RWxlbWVudCA9IGN1cnJlbnQucGFyZW50Tm9kZTtcclxuXHR9LFxyXG5cdHN0YXJ0UHJlZml4TWFwcGluZzpmdW5jdGlvbihwcmVmaXgsIHVyaSkge1xyXG5cdH0sXHJcblx0ZW5kUHJlZml4TWFwcGluZzpmdW5jdGlvbihwcmVmaXgpIHtcclxuXHR9LFxyXG5cdHByb2Nlc3NpbmdJbnN0cnVjdGlvbjpmdW5jdGlvbih0YXJnZXQsIGRhdGEpIHtcclxuXHQgICAgdmFyIGlucyA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uKHRhcmdldCwgZGF0YSk7XHJcblx0ICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsaW5zKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGlucyk7XHJcblx0fSxcclxuXHRpZ25vcmFibGVXaGl0ZXNwYWNlOmZ1bmN0aW9uKGNoLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0fSxcclxuXHRjaGFyYWN0ZXJzOmZ1bmN0aW9uKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XHJcblx0XHRjaGFycyA9IF90b1N0cmluZy5hcHBseSh0aGlzLGFyZ3VtZW50cylcclxuXHRcdC8vY29uc29sZS5sb2coY2hhcnMpXHJcblx0XHRpZih0aGlzLmN1cnJlbnRFbGVtZW50ICYmIGNoYXJzKXtcclxuXHRcdFx0aWYgKHRoaXMuY2RhdGEpIHtcclxuXHRcdFx0XHR2YXIgY2hhck5vZGUgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUNEQVRBU2VjdGlvbihjaGFycyk7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGNoYXJOb2RlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGFycyk7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixjaGFyTm9kZSlcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNraXBwZWRFbnRpdHk6ZnVuY3Rpb24obmFtZSkge1xyXG5cdH0sXHJcblx0ZW5kRG9jdW1lbnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmRvY3VtZW50Lm5vcm1hbGl6ZSgpO1xyXG5cdH0sXHJcblx0c2V0RG9jdW1lbnRMb2NhdG9yOmZ1bmN0aW9uIChsb2NhdG9yKSB7XHJcblx0ICAgIGlmKHRoaXMubG9jYXRvciA9IGxvY2F0b3Ipey8vICYmICEoJ2xpbmVOdW1iZXInIGluIGxvY2F0b3IpKXtcclxuXHQgICAgXHRsb2NhdG9yLmxpbmVOdW1iZXIgPSAwO1xyXG5cdCAgICB9XHJcblx0fSxcclxuXHQvL0xleGljYWxIYW5kbGVyXHJcblx0Y29tbWVudDpmdW5jdGlvbihjaGFycywgc3RhcnQsIGxlbmd0aCkge1xyXG5cdFx0Y2hhcnMgPSBfdG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpXHJcblx0ICAgIHZhciBjb21tID0gdGhpcy5kb2N1bWVudC5jcmVhdGVDb21tZW50KGNoYXJzKTtcclxuXHQgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvcixjb21tKVxyXG5cdCAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGNvbW0pO1xyXG5cdH0sXHJcblx0XHJcblx0c3RhcnRDREFUQTpmdW5jdGlvbigpIHtcclxuXHQgICAgLy91c2VkIGluIGNoYXJhY3RlcnMoKSBtZXRob2RzXHJcblx0ICAgIHRoaXMuY2RhdGEgPSB0cnVlO1xyXG5cdH0sXHJcblx0ZW5kQ0RBVEE6ZnVuY3Rpb24oKSB7XHJcblx0ICAgIHRoaXMuY2RhdGEgPSBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdHN0YXJ0RFREOmZ1bmN0aW9uKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge1xyXG5cdFx0dmFyIGltcGwgPSB0aGlzLmRvY3VtZW50LmltcGxlbWVudGF0aW9uO1xyXG5cdCAgICBpZiAoaW1wbCAmJiBpbXBsLmNyZWF0ZURvY3VtZW50VHlwZSkge1xyXG5cdCAgICAgICAgdmFyIGR0ID0gaW1wbC5jcmVhdGVEb2N1bWVudFR5cGUobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKTtcclxuXHQgICAgICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsZHQpXHJcblx0ICAgICAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGR0KTtcclxuXHQgICAgfVxyXG5cdH0sXHJcblx0LyoqXHJcblx0ICogQHNlZSBvcmcueG1sLnNheC5FcnJvckhhbmRsZXJcclxuXHQgKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9FcnJvckhhbmRsZXIuaHRtbFxyXG5cdCAqL1xyXG5cdHdhcm5pbmc6ZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUud2FybihlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHR9LFxyXG5cdGVycm9yOmZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGVycm9yLF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xyXG5cdH0sXHJcblx0ZmF0YWxFcnJvcjpmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcixfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcclxuXHQgICAgdGhyb3cgZXJyb3I7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIF9sb2NhdG9yKGwpe1xyXG5cdGlmKGwpe1xyXG5cdFx0cmV0dXJuICdcXG5AJysobC5zeXN0ZW1JZCB8fCcnKSsnI1tsaW5lOicrbC5saW5lTnVtYmVyKycsY29sOicrbC5jb2x1bW5OdW1iZXIrJ10nXHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIF90b1N0cmluZyhjaGFycyxzdGFydCxsZW5ndGgpe1xyXG5cdGlmKHR5cGVvZiBjaGFycyA9PSAnc3RyaW5nJyl7XHJcblx0XHRyZXR1cm4gY2hhcnMuc3Vic3RyKHN0YXJ0LGxlbmd0aClcclxuXHR9ZWxzZXsvL2phdmEgc2F4IGNvbm5lY3Qgd2lkdGggeG1sZG9tIG9uIHJoaW5vKHdoYXQgYWJvdXQ6IFwiPyAmJiAhKGNoYXJzIGluc3RhbmNlb2YgU3RyaW5nKVwiKVxyXG5cdFx0aWYoY2hhcnMubGVuZ3RoID49IHN0YXJ0K2xlbmd0aCB8fCBzdGFydCl7XHJcblx0XHRcdHJldHVybiBuZXcgamF2YS5sYW5nLlN0cmluZyhjaGFycyxzdGFydCxsZW5ndGgpKycnO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYXJzO1xyXG5cdH1cclxufVxyXG5cclxuLypcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0xleGljYWxIYW5kbGVyLmh0bWxcclxuICogdXNlZCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkxleGljYWxIYW5kbGVyOlxyXG4gKiAgI2NvbW1lbnQoY2hhcnMsIHN0YXJ0LCBsZW5ndGgpXHJcbiAqICAjc3RhcnRDREFUQSgpXHJcbiAqICAjZW5kQ0RBVEEoKVxyXG4gKiAgI3N0YXJ0RFREKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZClcclxuICpcclxuICpcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkxleGljYWxIYW5kbGVyOlxyXG4gKiAgI2VuZERURCgpXHJcbiAqICAjc3RhcnRFbnRpdHkobmFtZSlcclxuICogICNlbmRFbnRpdHkobmFtZSlcclxuICpcclxuICpcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0RlY2xIYW5kbGVyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguZXh0LkRlY2xIYW5kbGVyXHJcbiAqIFx0I2F0dHJpYnV0ZURlY2woZU5hbWUsIGFOYW1lLCB0eXBlLCBtb2RlLCB2YWx1ZSlcclxuICogICNlbGVtZW50RGVjbChuYW1lLCBtb2RlbClcclxuICogICNleHRlcm5hbEVudGl0eURlY2wobmFtZSwgcHVibGljSWQsIHN5c3RlbUlkKVxyXG4gKiAgI2ludGVybmFsRW50aXR5RGVjbChuYW1lLCB2YWx1ZSlcclxuICogQGxpbmsgaHR0cDovL3d3dy5zYXhwcm9qZWN0Lm9yZy9hcGlkb2Mvb3JnL3htbC9zYXgvZXh0L0VudGl0eVJlc29sdmVyMi5odG1sXHJcbiAqIElHTk9SRUQgbWV0aG9kIG9mIG9yZy54bWwuc2F4LkVudGl0eVJlc29sdmVyMlxyXG4gKiAgI3Jlc29sdmVFbnRpdHkoU3RyaW5nIG5hbWUsU3RyaW5nIHB1YmxpY0lkLFN0cmluZyBiYXNlVVJJLFN0cmluZyBzeXN0ZW1JZClcclxuICogICNyZXNvbHZlRW50aXR5KHB1YmxpY0lkLCBzeXN0ZW1JZClcclxuICogICNnZXRFeHRlcm5hbFN1YnNldChuYW1lLCBiYXNlVVJJKVxyXG4gKiBAbGluayBodHRwOi8vd3d3LnNheHByb2plY3Qub3JnL2FwaWRvYy9vcmcveG1sL3NheC9EVERIYW5kbGVyLmh0bWxcclxuICogSUdOT1JFRCBtZXRob2Qgb2Ygb3JnLnhtbC5zYXguRFRESGFuZGxlclxyXG4gKiAgI25vdGF0aW9uRGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpIHt9O1xyXG4gKiAgI3VucGFyc2VkRW50aXR5RGVjbChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQsIG5vdGF0aW9uTmFtZSkge307XHJcbiAqL1xyXG5cImVuZERURCxzdGFydEVudGl0eSxlbmRFbnRpdHksYXR0cmlidXRlRGVjbCxlbGVtZW50RGVjbCxleHRlcm5hbEVudGl0eURlY2wsaW50ZXJuYWxFbnRpdHlEZWNsLHJlc29sdmVFbnRpdHksZ2V0RXh0ZXJuYWxTdWJzZXQsbm90YXRpb25EZWNsLHVucGFyc2VkRW50aXR5RGVjbFwiLnJlcGxhY2UoL1xcdysvZyxmdW5jdGlvbihrZXkpe1xyXG5cdERPTUhhbmRsZXIucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbigpe3JldHVybiBudWxsfVxyXG59KVxyXG5cclxuLyogUHJpdmF0ZSBzdGF0aWMgaGVscGVycyB0cmVhdGVkIGJlbG93IGFzIHByaXZhdGUgaW5zdGFuY2UgbWV0aG9kcywgc28gZG9uJ3QgbmVlZCB0byBhZGQgdGhlc2UgdG8gdGhlIHB1YmxpYyBBUEk7IHdlIG1pZ2h0IHVzZSBhIFJlbGF0b3IgdG8gYWxzbyBnZXQgcmlkIG9mIG5vbi1zdGFuZGFyZCBwdWJsaWMgcHJvcGVydGllcyAqL1xyXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50IChoYW5kZXIsbm9kZSkge1xyXG4gICAgaWYgKCFoYW5kZXIuY3VycmVudEVsZW1lbnQpIHtcclxuICAgICAgICBoYW5kZXIuZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmRlci5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgIH1cclxufS8vYXBwZW5kQ2hpbGQgYW5kIHNldEF0dHJpYnV0ZU5TIGFyZSBwcmVmb3JtYW5jZSBrZXlcclxuXHJcbmlmKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpe1xyXG5cdHZhciBYTUxSZWFkZXIgPSByZXF1aXJlKCcuL3NheCcpLlhNTFJlYWRlcjtcclxuXHR2YXIgRE9NSW1wbGVtZW50YXRpb24gPSBleHBvcnRzLkRPTUltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9kb20nKS5ET01JbXBsZW1lbnRhdGlvbjtcclxuXHRleHBvcnRzLlhNTFNlcmlhbGl6ZXIgPSByZXF1aXJlKCcuL2RvbScpLlhNTFNlcmlhbGl6ZXIgO1xyXG5cdGV4cG9ydHMuRE9NUGFyc2VyID0gRE9NUGFyc2VyO1xyXG59XHJcbiIsIi8qXG4gKiBET00gTGV2ZWwgMlxuICogT2JqZWN0IERPTUV4Y2VwdGlvblxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtRE9NLUxldmVsLTEvZWNtYS1zY3JpcHQtbGFuZ3VhZ2UtYmluZGluZy5odG1sXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDAvUkVDLURPTS1MZXZlbC0yLUNvcmUtMjAwMDExMTMvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG4gKi9cblxuZnVuY3Rpb24gY29weShzcmMsZGVzdCl7XG5cdGZvcih2YXIgcCBpbiBzcmMpe1xuXHRcdGRlc3RbcF0gPSBzcmNbcF07XG5cdH1cbn1cbi8qKlxuXlxcdytcXC5wcm90b3R5cGVcXC4oW19cXHddKylcXHMqPVxccyooKD86LipcXHtcXHMqP1tcXHJcXG5dW1xcc1xcU10qP159KXxcXFMuKj8oPz1bO1xcclxcbl0pKTs/XG5eXFx3K1xcLnByb3RvdHlwZVxcLihbX1xcd10rKVxccyo9XFxzKihcXFMuKj8oPz1bO1xcclxcbl0pKTs/XG4gKi9cbmZ1bmN0aW9uIF9leHRlbmRzKENsYXNzLFN1cGVyKXtcblx0dmFyIHB0ID0gQ2xhc3MucHJvdG90eXBlO1xuXHRpZihPYmplY3QuY3JlYXRlKXtcblx0XHR2YXIgcHB0ID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpXG5cdFx0cHQuX19wcm90b19fID0gcHB0O1xuXHR9XG5cdGlmKCEocHQgaW5zdGFuY2VvZiBTdXBlcikpe1xuXHRcdGZ1bmN0aW9uIHQoKXt9O1xuXHRcdHQucHJvdG90eXBlID0gU3VwZXIucHJvdG90eXBlO1xuXHRcdHQgPSBuZXcgdCgpO1xuXHRcdGNvcHkocHQsdCk7XG5cdFx0Q2xhc3MucHJvdG90eXBlID0gcHQgPSB0O1xuXHR9XG5cdGlmKHB0LmNvbnN0cnVjdG9yICE9IENsYXNzKXtcblx0XHRpZih0eXBlb2YgQ2xhc3MgIT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwidW5rbm93IENsYXNzOlwiK0NsYXNzKVxuXHRcdH1cblx0XHRwdC5jb25zdHJ1Y3RvciA9IENsYXNzXG5cdH1cbn1cbnZhciBodG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgO1xuLy8gTm9kZSBUeXBlc1xudmFyIE5vZGVUeXBlID0ge31cbnZhciBFTEVNRU5UX05PREUgICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5FTEVNRU5UX05PREUgICAgICAgICAgICAgICAgPSAxO1xudmFyIEFUVFJJQlVURV9OT0RFICAgICAgICAgICAgICA9IE5vZGVUeXBlLkFUVFJJQlVURV9OT0RFICAgICAgICAgICAgICA9IDI7XG52YXIgVEVYVF9OT0RFICAgICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuVEVYVF9OT0RFICAgICAgICAgICAgICAgICAgID0gMztcbnZhciBDREFUQV9TRUNUSU9OX05PREUgICAgICAgICAgPSBOb2RlVHlwZS5DREFUQV9TRUNUSU9OX05PREUgICAgICAgICAgPSA0O1xudmFyIEVOVElUWV9SRUZFUkVOQ0VfTk9ERSAgICAgICA9IE5vZGVUeXBlLkVOVElUWV9SRUZFUkVOQ0VfTk9ERSAgICAgICA9IDU7XG52YXIgRU5USVRZX05PREUgICAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRU5USVRZX05PREUgICAgICAgICAgICAgICAgID0gNjtcbnZhciBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSBOb2RlVHlwZS5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSA3O1xudmFyIENPTU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IE5vZGVUeXBlLkNPTU1FTlRfTk9ERSAgICAgICAgICAgICAgICA9IDg7XG52YXIgRE9DVU1FTlRfTk9ERSAgICAgICAgICAgICAgID0gTm9kZVR5cGUuRE9DVU1FTlRfTk9ERSAgICAgICAgICAgICAgID0gOTtcbnZhciBET0NVTUVOVF9UWVBFX05PREUgICAgICAgICAgPSBOb2RlVHlwZS5ET0NVTUVOVF9UWVBFX05PREUgICAgICAgICAgPSAxMDtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFICAgICAgPSBOb2RlVHlwZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFICAgICAgPSAxMTtcbnZhciBOT1RBVElPTl9OT0RFICAgICAgICAgICAgICAgPSBOb2RlVHlwZS5OT1RBVElPTl9OT0RFICAgICAgICAgICAgICAgPSAxMjtcblxuLy8gRXhjZXB0aW9uQ29kZVxudmFyIEV4Y2VwdGlvbkNvZGUgPSB7fVxudmFyIEV4Y2VwdGlvbk1lc3NhZ2UgPSB7fTtcbnZhciBJTkRFWF9TSVpFX0VSUiAgICAgICAgICAgICAgPSBFeGNlcHRpb25Db2RlLklOREVYX1NJWkVfRVJSICAgICAgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVsxXT1cIkluZGV4IHNpemUgZXJyb3JcIiksMSk7XG52YXIgRE9NU1RSSU5HX1NJWkVfRVJSICAgICAgICAgID0gRXhjZXB0aW9uQ29kZS5ET01TVFJJTkdfU0laRV9FUlIgICAgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMl09XCJET01TdHJpbmcgc2l6ZSBlcnJvclwiKSwyKTtcbnZhciBISUVSQVJDSFlfUkVRVUVTVF9FUlIgICAgICAgPSBFeGNlcHRpb25Db2RlLkhJRVJBUkNIWV9SRVFVRVNUX0VSUiAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVszXT1cIkhpZXJhcmNoeSByZXF1ZXN0IGVycm9yXCIpLDMpO1xudmFyIFdST05HX0RPQ1VNRU5UX0VSUiAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuV1JPTkdfRE9DVU1FTlRfRVJSICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzRdPVwiV3JvbmcgZG9jdW1lbnRcIiksNCk7XG52YXIgSU5WQUxJRF9DSEFSQUNURVJfRVJSICAgICAgID0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX0NIQVJBQ1RFUl9FUlIgICAgICAgPSAoKEV4Y2VwdGlvbk1lc3NhZ2VbNV09XCJJbnZhbGlkIGNoYXJhY3RlclwiKSw1KTtcbnZhciBOT19EQVRBX0FMTE9XRURfRVJSICAgICAgICAgPSBFeGNlcHRpb25Db2RlLk5PX0RBVEFfQUxMT1dFRF9FUlIgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVs2XT1cIk5vIGRhdGEgYWxsb3dlZFwiKSw2KTtcbnZhciBOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIgPSBFeGNlcHRpb25Db2RlLk5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUiA9ICgoRXhjZXB0aW9uTWVzc2FnZVs3XT1cIk5vIG1vZGlmaWNhdGlvbiBhbGxvd2VkXCIpLDcpO1xudmFyIE5PVF9GT1VORF9FUlIgICAgICAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuTk9UX0ZPVU5EX0VSUiAgICAgICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzhdPVwiTm90IGZvdW5kXCIpLDgpO1xudmFyIE5PVF9TVVBQT1JURURfRVJSICAgICAgICAgICA9IEV4Y2VwdGlvbkNvZGUuTk9UX1NVUFBPUlRFRF9FUlIgICAgICAgICAgID0gKChFeGNlcHRpb25NZXNzYWdlWzldPVwiTm90IHN1cHBvcnRlZFwiKSw5KTtcbnZhciBJTlVTRV9BVFRSSUJVVEVfRVJSICAgICAgICAgPSBFeGNlcHRpb25Db2RlLklOVVNFX0FUVFJJQlVURV9FUlIgICAgICAgICA9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMF09XCJBdHRyaWJ1dGUgaW4gdXNlXCIpLDEwKTtcbi8vbGV2ZWwyXG52YXIgSU5WQUxJRF9TVEFURV9FUlIgICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLklOVkFMSURfU1RBVEVfRVJSICAgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzExXT1cIkludmFsaWQgc3RhdGVcIiksMTEpO1xudmFyIFNZTlRBWF9FUlIgICAgICAgICAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5TWU5UQVhfRVJSICAgICAgICAgICAgICAgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxMl09XCJTeW50YXggZXJyb3JcIiksMTIpO1xudmFyIElOVkFMSURfTU9ESUZJQ0FUSU9OX0VSUiBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX01PRElGSUNBVElPTl9FUlIgXHQ9ICgoRXhjZXB0aW9uTWVzc2FnZVsxM109XCJJbnZhbGlkIG1vZGlmaWNhdGlvblwiKSwxMyk7XG52YXIgTkFNRVNQQUNFX0VSUiAgICAgICAgICAgIFx0PSBFeGNlcHRpb25Db2RlLk5BTUVTUEFDRV9FUlIgICAgICAgICAgIFx0PSAoKEV4Y2VwdGlvbk1lc3NhZ2VbMTRdPVwiSW52YWxpZCBuYW1lc3BhY2VcIiksMTQpO1xudmFyIElOVkFMSURfQUNDRVNTX0VSUiAgICAgICBcdD0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX0FDQ0VTU19FUlIgICAgICBcdD0gKChFeGNlcHRpb25NZXNzYWdlWzE1XT1cIkludmFsaWQgYWNjZXNzXCIpLDE1KTtcblxuXG5mdW5jdGlvbiBET01FeGNlcHRpb24oY29kZSwgbWVzc2FnZSkge1xuXHRpZihtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3Ipe1xuXHRcdHZhciBlcnJvciA9IG1lc3NhZ2U7XG5cdH1lbHNle1xuXHRcdGVycm9yID0gdGhpcztcblx0XHRFcnJvci5jYWxsKHRoaXMsIEV4Y2VwdGlvbk1lc3NhZ2VbY29kZV0pO1xuXHRcdHRoaXMubWVzc2FnZSA9IEV4Y2VwdGlvbk1lc3NhZ2VbY29kZV07XG5cdFx0aWYoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIERPTUV4Y2VwdGlvbik7XG5cdH1cblx0ZXJyb3IuY29kZSA9IGNvZGU7XG5cdGlmKG1lc3NhZ2UpIHRoaXMubWVzc2FnZSA9IHRoaXMubWVzc2FnZSArIFwiOiBcIiArIG1lc3NhZ2U7XG5cdHJldHVybiBlcnJvcjtcbn07XG5ET01FeGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuY29weShFeGNlcHRpb25Db2RlLERPTUV4Y2VwdGlvbilcbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAwL1JFQy1ET00tTGV2ZWwtMi1Db3JlLTIwMDAxMTEzL2NvcmUuaHRtbCNJRC01MzYyOTcxNzdcbiAqIFRoZSBOb2RlTGlzdCBpbnRlcmZhY2UgcHJvdmlkZXMgdGhlIGFic3RyYWN0aW9uIG9mIGFuIG9yZGVyZWQgY29sbGVjdGlvbiBvZiBub2Rlcywgd2l0aG91dCBkZWZpbmluZyBvciBjb25zdHJhaW5pbmcgaG93IHRoaXMgY29sbGVjdGlvbiBpcyBpbXBsZW1lbnRlZC4gTm9kZUxpc3Qgb2JqZWN0cyBpbiB0aGUgRE9NIGFyZSBsaXZlLlxuICogVGhlIGl0ZW1zIGluIHRoZSBOb2RlTGlzdCBhcmUgYWNjZXNzaWJsZSB2aWEgYW4gaW50ZWdyYWwgaW5kZXgsIHN0YXJ0aW5nIGZyb20gMC5cbiAqL1xuZnVuY3Rpb24gTm9kZUxpc3QoKSB7XG59O1xuTm9kZUxpc3QucHJvdG90eXBlID0ge1xuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdC4gVGhlIHJhbmdlIG9mIHZhbGlkIGNoaWxkIG5vZGUgaW5kaWNlcyBpcyAwIHRvIGxlbmd0aC0xIGluY2x1c2l2ZS5cblx0ICogQHN0YW5kYXJkIGxldmVsMVxuXHQgKi9cblx0bGVuZ3RoOjAsIFxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgaW5kZXh0aCBpdGVtIGluIHRoZSBjb2xsZWN0aW9uLiBJZiBpbmRleCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdCwgdGhpcyByZXR1cm5zIG51bGwuXG5cdCAqIEBzdGFuZGFyZCBsZXZlbDFcblx0ICogQHBhcmFtIGluZGV4ICB1bnNpZ25lZCBsb25nIFxuXHQgKiAgIEluZGV4IGludG8gdGhlIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm4gTm9kZVxuXHQgKiBcdFRoZSBub2RlIGF0IHRoZSBpbmRleHRoIHBvc2l0aW9uIGluIHRoZSBOb2RlTGlzdCwgb3IgbnVsbCBpZiB0aGF0IGlzIG5vdCBhIHZhbGlkIGluZGV4LiBcblx0ICovXG5cdGl0ZW06IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0cmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGw7XG5cdH1cbn07XG5mdW5jdGlvbiBMaXZlTm9kZUxpc3Qobm9kZSxyZWZyZXNoKXtcblx0dGhpcy5fbm9kZSA9IG5vZGU7XG5cdHRoaXMuX3JlZnJlc2ggPSByZWZyZXNoXG5cdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVMaXZlTGlzdChsaXN0KXtcblx0dmFyIGluYyA9IGxpc3QuX25vZGUuX2luYyB8fCBsaXN0Ll9ub2RlLm93bmVyRG9jdW1lbnQuX2luYztcblx0aWYobGlzdC5faW5jICE9IGluYyl7XG5cdFx0dmFyIGxzID0gbGlzdC5fcmVmcmVzaChsaXN0Ll9ub2RlKTtcblx0XHQvL2NvbnNvbGUubG9nKGxzLmxlbmd0aClcblx0XHRfX3NldF9fKGxpc3QsJ2xlbmd0aCcsbHMubGVuZ3RoKTtcblx0XHRjb3B5KGxzLGxpc3QpO1xuXHRcdGxpc3QuX2luYyA9IGluYztcblx0fVxufVxuTGl2ZU5vZGVMaXN0LnByb3RvdHlwZS5pdGVtID0gZnVuY3Rpb24oaSl7XG5cdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcblx0cmV0dXJuIHRoaXNbaV07XG59XG5cbl9leHRlbmRzKExpdmVOb2RlTGlzdCxOb2RlTGlzdCk7XG4vKipcbiAqIFxuICogT2JqZWN0cyBpbXBsZW1lbnRpbmcgdGhlIE5hbWVkTm9kZU1hcCBpbnRlcmZhY2UgYXJlIHVzZWQgdG8gcmVwcmVzZW50IGNvbGxlY3Rpb25zIG9mIG5vZGVzIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIGJ5IG5hbWUuIE5vdGUgdGhhdCBOYW1lZE5vZGVNYXAgZG9lcyBub3QgaW5oZXJpdCBmcm9tIE5vZGVMaXN0OyBOYW1lZE5vZGVNYXBzIGFyZSBub3QgbWFpbnRhaW5lZCBpbiBhbnkgcGFydGljdWxhciBvcmRlci4gT2JqZWN0cyBjb250YWluZWQgaW4gYW4gb2JqZWN0IGltcGxlbWVudGluZyBOYW1lZE5vZGVNYXAgbWF5IGFsc28gYmUgYWNjZXNzZWQgYnkgYW4gb3JkaW5hbCBpbmRleCwgYnV0IHRoaXMgaXMgc2ltcGx5IHRvIGFsbG93IGNvbnZlbmllbnQgZW51bWVyYXRpb24gb2YgdGhlIGNvbnRlbnRzIG9mIGEgTmFtZWROb2RlTWFwLCBhbmQgZG9lcyBub3QgaW1wbHkgdGhhdCB0aGUgRE9NIHNwZWNpZmllcyBhbiBvcmRlciB0byB0aGVzZSBOb2Rlcy5cbiAqIE5hbWVkTm9kZU1hcCBvYmplY3RzIGluIHRoZSBET00gYXJlIGxpdmUuXG4gKiB1c2VkIGZvciBhdHRyaWJ1dGVzIG9yIERvY3VtZW50VHlwZSBlbnRpdGllcyBcbiAqL1xuZnVuY3Rpb24gTmFtZWROb2RlTWFwKCkge1xufTtcblxuZnVuY3Rpb24gX2ZpbmROb2RlSW5kZXgobGlzdCxub2RlKXtcblx0dmFyIGkgPSBsaXN0Lmxlbmd0aDtcblx0d2hpbGUoaS0tKXtcblx0XHRpZihsaXN0W2ldID09PSBub2RlKXtyZXR1cm4gaX1cblx0fVxufVxuXG5mdW5jdGlvbiBfYWRkTmFtZWROb2RlKGVsLGxpc3QsbmV3QXR0cixvbGRBdHRyKXtcblx0aWYob2xkQXR0cil7XG5cdFx0bGlzdFtfZmluZE5vZGVJbmRleChsaXN0LG9sZEF0dHIpXSA9IG5ld0F0dHI7XG5cdH1lbHNle1xuXHRcdGxpc3RbbGlzdC5sZW5ndGgrK10gPSBuZXdBdHRyO1xuXHR9XG5cdGlmKGVsKXtcblx0XHRuZXdBdHRyLm93bmVyRWxlbWVudCA9IGVsO1xuXHRcdHZhciBkb2MgPSBlbC5vd25lckRvY3VtZW50O1xuXHRcdGlmKGRvYyl7XG5cdFx0XHRvbGRBdHRyICYmIF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsb2xkQXR0cik7XG5cdFx0XHRfb25BZGRBdHRyaWJ1dGUoZG9jLGVsLG5ld0F0dHIpO1xuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gX3JlbW92ZU5hbWVkTm9kZShlbCxsaXN0LGF0dHIpe1xuXHR2YXIgaSA9IF9maW5kTm9kZUluZGV4KGxpc3QsYXR0cik7XG5cdGlmKGk+PTApe1xuXHRcdHZhciBsYXN0SW5kZXggPSBsaXN0Lmxlbmd0aC0xXG5cdFx0d2hpbGUoaTxsYXN0SW5kZXgpe1xuXHRcdFx0bGlzdFtpXSA9IGxpc3RbKytpXVxuXHRcdH1cblx0XHRsaXN0Lmxlbmd0aCA9IGxhc3RJbmRleDtcblx0XHRpZihlbCl7XG5cdFx0XHR2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblx0XHRcdGlmKGRvYyl7XG5cdFx0XHRcdF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsYXR0cik7XG5cdFx0XHRcdGF0dHIub3duZXJFbGVtZW50ID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH1lbHNle1xuXHRcdHRocm93IERPTUV4Y2VwdGlvbihOT1RfRk9VTkRfRVJSLG5ldyBFcnJvcigpKVxuXHR9XG59XG5OYW1lZE5vZGVNYXAucHJvdG90eXBlID0ge1xuXHRsZW5ndGg6MCxcblx0aXRlbTpOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSxcblx0Z2V0TmFtZWRJdGVtOiBmdW5jdGlvbihrZXkpIHtcbi8vXHRcdGlmKGtleS5pbmRleE9mKCc6Jyk+MCB8fCBrZXkgPT0gJ3htbG5zJyl7XG4vL1x0XHRcdHJldHVybiBudWxsO1xuLy9cdFx0fVxuXHRcdHZhciBpID0gdGhpcy5sZW5ndGg7XG5cdFx0d2hpbGUoaS0tKXtcblx0XHRcdHZhciBhdHRyID0gdGhpc1tpXTtcblx0XHRcdGlmKGF0dHIubm9kZU5hbWUgPT0ga2V5KXtcblx0XHRcdFx0cmV0dXJuIGF0dHI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRzZXROYW1lZEl0ZW06IGZ1bmN0aW9uKGF0dHIpIHtcblx0XHR2YXIgZWwgPSBhdHRyLm93bmVyRWxlbWVudDtcblx0XHRpZihlbCAmJiBlbCE9dGhpcy5fb3duZXJFbGVtZW50KXtcblx0XHRcdHRocm93IG5ldyBET01FeGNlcHRpb24oSU5VU0VfQVRUUklCVVRFX0VSUik7XG5cdFx0fVxuXHRcdHZhciBvbGRBdHRyID0gdGhpcy5nZXROYW1lZEl0ZW0oYXR0ci5ub2RlTmFtZSk7XG5cdFx0X2FkZE5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyLG9sZEF0dHIpO1xuXHRcdHJldHVybiBvbGRBdHRyO1xuXHR9LFxuXHQvKiByZXR1cm5zIE5vZGUgKi9cblx0c2V0TmFtZWRJdGVtTlM6IGZ1bmN0aW9uKGF0dHIpIHsvLyByYWlzZXM6IFdST05HX0RPQ1VNRU5UX0VSUixOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIsSU5VU0VfQVRUUklCVVRFX0VSUlxuXHRcdHZhciBlbCA9IGF0dHIub3duZXJFbGVtZW50LCBvbGRBdHRyO1xuXHRcdGlmKGVsICYmIGVsIT10aGlzLl9vd25lckVsZW1lbnQpe1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4Y2VwdGlvbihJTlVTRV9BVFRSSUJVVEVfRVJSKTtcblx0XHR9XG5cdFx0b2xkQXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtTlMoYXR0ci5uYW1lc3BhY2VVUkksYXR0ci5sb2NhbE5hbWUpO1xuXHRcdF9hZGROYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cixvbGRBdHRyKTtcblx0XHRyZXR1cm4gb2xkQXR0cjtcblx0fSxcblxuXHQvKiByZXR1cm5zIE5vZGUgKi9cblx0cmVtb3ZlTmFtZWRJdGVtOiBmdW5jdGlvbihrZXkpIHtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtKGtleSk7XG5cdFx0X3JlbW92ZU5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsdGhpcyxhdHRyKTtcblx0XHRyZXR1cm4gYXR0cjtcblx0XHRcblx0XHRcblx0fSwvLyByYWlzZXM6IE5PVF9GT1VORF9FUlIsTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSXG5cdFxuXHQvL2ZvciBsZXZlbDJcblx0cmVtb3ZlTmFtZWRJdGVtTlM6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLGxvY2FsTmFtZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbU5TKG5hbWVzcGFjZVVSSSxsb2NhbE5hbWUpO1xuXHRcdF9yZW1vdmVOYW1lZE5vZGUodGhpcy5fb3duZXJFbGVtZW50LHRoaXMsYXR0cik7XG5cdFx0cmV0dXJuIGF0dHI7XG5cdH0sXG5cdGdldE5hbWVkSXRlbU5TOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuXHRcdHZhciBpID0gdGhpcy5sZW5ndGg7XG5cdFx0d2hpbGUoaS0tKXtcblx0XHRcdHZhciBub2RlID0gdGhpc1tpXTtcblx0XHRcdGlmKG5vZGUubG9jYWxOYW1lID09IGxvY2FsTmFtZSAmJiBub2RlLm5hbWVzcGFjZVVSSSA9PSBuYW1lc3BhY2VVUkkpe1xuXHRcdFx0XHRyZXR1cm4gbm9kZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG4vKipcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLURPTS1MZXZlbC0xL2xldmVsLW9uZS1jb3JlLmh0bWwjSUQtMTAyMTYxNDkwXG4gKi9cbmZ1bmN0aW9uIERPTUltcGxlbWVudGF0aW9uKC8qIE9iamVjdCAqLyBmZWF0dXJlcykge1xuXHR0aGlzLl9mZWF0dXJlcyA9IHt9O1xuXHRpZiAoZmVhdHVyZXMpIHtcblx0XHRmb3IgKHZhciBmZWF0dXJlIGluIGZlYXR1cmVzKSB7XG5cdFx0XHQgdGhpcy5fZmVhdHVyZXMgPSBmZWF0dXJlc1tmZWF0dXJlXTtcblx0XHR9XG5cdH1cbn07XG5cbkRPTUltcGxlbWVudGF0aW9uLnByb3RvdHlwZSA9IHtcblx0aGFzRmVhdHVyZTogZnVuY3Rpb24oLyogc3RyaW5nICovIGZlYXR1cmUsIC8qIHN0cmluZyAqLyB2ZXJzaW9uKSB7XG5cdFx0dmFyIHZlcnNpb25zID0gdGhpcy5fZmVhdHVyZXNbZmVhdHVyZS50b0xvd2VyQ2FzZSgpXTtcblx0XHRpZiAodmVyc2lvbnMgJiYgKCF2ZXJzaW9uIHx8IHZlcnNpb24gaW4gdmVyc2lvbnMpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0Y3JlYXRlRG9jdW1lbnQ6ZnVuY3Rpb24obmFtZXNwYWNlVVJJLCAgcXVhbGlmaWVkTmFtZSwgZG9jdHlwZSl7Ly8gcmFpc2VzOklOVkFMSURfQ0hBUkFDVEVSX0VSUixOQU1FU1BBQ0VfRVJSLFdST05HX0RPQ1VNRU5UX0VSUlxuXHRcdHZhciBkb2MgPSBuZXcgRG9jdW1lbnQoKTtcblx0XHRkb2MuZG9jdHlwZSA9IGRvY3R5cGU7XG5cdFx0aWYoZG9jdHlwZSl7XG5cdFx0XHRkb2MuYXBwZW5kQ2hpbGQoZG9jdHlwZSk7XG5cdFx0fVxuXHRcdGRvYy5pbXBsZW1lbnRhdGlvbiA9IHRoaXM7XG5cdFx0ZG9jLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRpZihxdWFsaWZpZWROYW1lKXtcblx0XHRcdHZhciByb290ID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSk7XG5cdFx0XHRkb2MuYXBwZW5kQ2hpbGQocm9vdCk7XG5cdFx0fVxuXHRcdHJldHVybiBkb2M7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGNyZWF0ZURvY3VtZW50VHlwZTpmdW5jdGlvbihxdWFsaWZpZWROYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpey8vIHJhaXNlczpJTlZBTElEX0NIQVJBQ1RFUl9FUlIsTkFNRVNQQUNFX0VSUlxuXHRcdHZhciBub2RlID0gbmV3IERvY3VtZW50VHlwZSgpO1xuXHRcdG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5wdWJsaWNJZCA9IHB1YmxpY0lkO1xuXHRcdG5vZGUuc3lzdGVtSWQgPSBzeXN0ZW1JZDtcblx0XHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRcdC8vcmVhZG9ubHkgYXR0cmlidXRlIERPTVN0cmluZyAgICAgICAgaW50ZXJuYWxTdWJzZXQ7XG5cdFx0XG5cdFx0Ly9UT0RPOi4uXG5cdFx0Ly8gIHJlYWRvbmx5IGF0dHJpYnV0ZSBOYW1lZE5vZGVNYXAgICAgIGVudGl0aWVzO1xuXHRcdC8vICByZWFkb25seSBhdHRyaWJ1dGUgTmFtZWROb2RlTWFwICAgICBub3RhdGlvbnM7XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cbn07XG5cblxuLyoqXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDAvUkVDLURPTS1MZXZlbC0yLUNvcmUtMjAwMDExMTMvY29yZS5odG1sI0lELTE5NTA2NDEyNDdcbiAqL1xuXG5mdW5jdGlvbiBOb2RlKCkge1xufTtcblxuTm9kZS5wcm90b3R5cGUgPSB7XG5cdGZpcnN0Q2hpbGQgOiBudWxsLFxuXHRsYXN0Q2hpbGQgOiBudWxsLFxuXHRwcmV2aW91c1NpYmxpbmcgOiBudWxsLFxuXHRuZXh0U2libGluZyA6IG51bGwsXG5cdGF0dHJpYnV0ZXMgOiBudWxsLFxuXHRwYXJlbnROb2RlIDogbnVsbCxcblx0Y2hpbGROb2RlcyA6IG51bGwsXG5cdG93bmVyRG9jdW1lbnQgOiBudWxsLFxuXHRub2RlVmFsdWUgOiBudWxsLFxuXHRuYW1lc3BhY2VVUkkgOiBudWxsLFxuXHRwcmVmaXggOiBudWxsLFxuXHRsb2NhbE5hbWUgOiBudWxsLFxuXHQvLyBNb2RpZmllZCBpbiBET00gTGV2ZWwgMjpcblx0aW5zZXJ0QmVmb3JlOmZ1bmN0aW9uKG5ld0NoaWxkLCByZWZDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0cmV0dXJuIF9pbnNlcnRCZWZvcmUodGhpcyxuZXdDaGlsZCxyZWZDaGlsZCk7XG5cdH0sXG5cdHJlcGxhY2VDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCwgb2xkQ2hpbGQpey8vcmFpc2VzIFxuXHRcdHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG9sZENoaWxkKTtcblx0XHRpZihvbGRDaGlsZCl7XG5cdFx0XHR0aGlzLnJlbW92ZUNoaWxkKG9sZENoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUNoaWxkOmZ1bmN0aW9uKG9sZENoaWxkKXtcblx0XHRyZXR1cm4gX3JlbW92ZUNoaWxkKHRoaXMsb2xkQ2hpbGQpO1xuXHR9LFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0cmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG51bGwpO1xuXHR9LFxuXHRoYXNDaGlsZE5vZGVzOmZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuZmlyc3RDaGlsZCAhPSBudWxsO1xuXHR9LFxuXHRjbG9uZU5vZGU6ZnVuY3Rpb24oZGVlcCl7XG5cdFx0cmV0dXJuIGNsb25lTm9kZSh0aGlzLm93bmVyRG9jdW1lbnR8fHRoaXMsdGhpcyxkZWVwKTtcblx0fSxcblx0Ly8gTW9kaWZpZWQgaW4gRE9NIExldmVsIDI6XG5cdG5vcm1hbGl6ZTpmdW5jdGlvbigpe1xuXHRcdHZhciBjaGlsZCA9IHRoaXMuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0aWYobmV4dCAmJiBuZXh0Lm5vZGVUeXBlID09IFRFWFRfTk9ERSAmJiBjaGlsZC5ub2RlVHlwZSA9PSBURVhUX05PREUpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNoaWxkKG5leHQpO1xuXHRcdFx0XHRjaGlsZC5hcHBlbmREYXRhKG5leHQuZGF0YSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Y2hpbGQubm9ybWFsaXplKCk7XG5cdFx0XHRcdGNoaWxkID0gbmV4dDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG4gIFx0Ly8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcblx0aXNTdXBwb3J0ZWQ6ZnVuY3Rpb24oZmVhdHVyZSwgdmVyc2lvbil7XG5cdFx0cmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKGZlYXR1cmUsdmVyc2lvbik7XG5cdH0sXG4gICAgLy8gSW50cm9kdWNlZCBpbiBET00gTGV2ZWwgMjpcbiAgICBoYXNBdHRyaWJ1dGVzOmZ1bmN0aW9uKCl7XG4gICAgXHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aD4wO1xuICAgIH0sXG4gICAgbG9va3VwUHJlZml4OmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSl7XG4gICAgXHR2YXIgZWwgPSB0aGlzO1xuICAgIFx0d2hpbGUoZWwpe1xuICAgIFx0XHR2YXIgbWFwID0gZWwuX25zTWFwO1xuICAgIFx0XHQvL2NvbnNvbGUuZGlyKG1hcClcbiAgICBcdFx0aWYobWFwKXtcbiAgICBcdFx0XHRmb3IodmFyIG4gaW4gbWFwKXtcbiAgICBcdFx0XHRcdGlmKG1hcFtuXSA9PSBuYW1lc3BhY2VVUkkpe1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gbjtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cbiAgICBcdFx0ZWwgPSBlbC5ub2RlVHlwZSA9PSAyP2VsLm93bmVyRG9jdW1lbnQgOiBlbC5wYXJlbnROb2RlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAzOlxuICAgIGxvb2t1cE5hbWVzcGFjZVVSSTpmdW5jdGlvbihwcmVmaXgpe1xuICAgIFx0dmFyIGVsID0gdGhpcztcbiAgICBcdHdoaWxlKGVsKXtcbiAgICBcdFx0dmFyIG1hcCA9IGVsLl9uc01hcDtcbiAgICBcdFx0Ly9jb25zb2xlLmRpcihtYXApXG4gICAgXHRcdGlmKG1hcCl7XG4gICAgXHRcdFx0aWYocHJlZml4IGluIG1hcCl7XG4gICAgXHRcdFx0XHRyZXR1cm4gbWFwW3ByZWZpeF0gO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0XHRlbCA9IGVsLm5vZGVUeXBlID09IDI/ZWwub3duZXJEb2N1bWVudCA6IGVsLnBhcmVudE5vZGU7XG4gICAgXHR9XG4gICAgXHRyZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDM6XG4gICAgaXNEZWZhdWx0TmFtZXNwYWNlOmZ1bmN0aW9uKG5hbWVzcGFjZVVSSSl7XG4gICAgXHR2YXIgcHJlZml4ID0gdGhpcy5sb29rdXBQcmVmaXgobmFtZXNwYWNlVVJJKTtcbiAgICBcdHJldHVybiBwcmVmaXggPT0gbnVsbDtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIF94bWxFbmNvZGVyKGMpe1xuXHRyZXR1cm4gYyA9PSAnPCcgJiYgJyZsdDsnIHx8XG4gICAgICAgICBjID09ICc+JyAmJiAnJmd0OycgfHxcbiAgICAgICAgIGMgPT0gJyYnICYmICcmYW1wOycgfHxcbiAgICAgICAgIGMgPT0gJ1wiJyAmJiAnJnF1b3Q7JyB8fFxuICAgICAgICAgJyYjJytjLmNoYXJDb2RlQXQoKSsnOydcbn1cblxuXG5jb3B5KE5vZGVUeXBlLE5vZGUpO1xuY29weShOb2RlVHlwZSxOb2RlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQHBhcmFtIGNhbGxiYWNrIHJldHVybiB0cnVlIGZvciBjb250aW51ZSxmYWxzZSBmb3IgYnJlYWtcbiAqIEByZXR1cm4gYm9vbGVhbiB0cnVlOiBicmVhayB2aXNpdDtcbiAqL1xuZnVuY3Rpb24gX3Zpc2l0Tm9kZShub2RlLGNhbGxiYWNrKXtcblx0aWYoY2FsbGJhY2sobm9kZSkpe1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGlmKG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQpe1xuXHRcdGRve1xuXHRcdFx0aWYoX3Zpc2l0Tm9kZShub2RlLGNhbGxiYWNrKSl7cmV0dXJuIHRydWV9XG4gICAgICAgIH13aGlsZShub2RlPW5vZGUubmV4dFNpYmxpbmcpXG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gRG9jdW1lbnQoKXtcbn1cbmZ1bmN0aW9uIF9vbkFkZEF0dHJpYnV0ZShkb2MsZWwsbmV3QXR0cil7XG5cdGRvYyAmJiBkb2MuX2luYysrO1xuXHR2YXIgbnMgPSBuZXdBdHRyLm5hbWVzcGFjZVVSSSA7XG5cdGlmKG5zID09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLycpe1xuXHRcdC8vdXBkYXRlIG5hbWVzcGFjZVxuXHRcdGVsLl9uc01hcFtuZXdBdHRyLnByZWZpeD9uZXdBdHRyLmxvY2FsTmFtZTonJ10gPSBuZXdBdHRyLnZhbHVlXG5cdH1cbn1cbmZ1bmN0aW9uIF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsZWwsbmV3QXR0cixyZW1vdmUpe1xuXHRkb2MgJiYgZG9jLl9pbmMrKztcblx0dmFyIG5zID0gbmV3QXR0ci5uYW1lc3BhY2VVUkkgO1xuXHRpZihucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKXtcblx0XHQvL3VwZGF0ZSBuYW1lc3BhY2Vcblx0XHRkZWxldGUgZWwuX25zTWFwW25ld0F0dHIucHJlZml4P25ld0F0dHIubG9jYWxOYW1lOicnXVxuXHR9XG59XG5mdW5jdGlvbiBfb25VcGRhdGVDaGlsZChkb2MsZWwsbmV3Q2hpbGQpe1xuXHRpZihkb2MgJiYgZG9jLl9pbmMpe1xuXHRcdGRvYy5faW5jKys7XG5cdFx0Ly91cGRhdGUgY2hpbGROb2Rlc1xuXHRcdHZhciBjcyA9IGVsLmNoaWxkTm9kZXM7XG5cdFx0aWYobmV3Q2hpbGQpe1xuXHRcdFx0Y3NbY3MubGVuZ3RoKytdID0gbmV3Q2hpbGQ7XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2NvbnNvbGUubG9nKDEpXG5cdFx0XHR2YXIgY2hpbGQgPSBlbC5maXJzdENoaWxkO1xuXHRcdFx0dmFyIGkgPSAwO1xuXHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRjc1tpKytdID0gY2hpbGQ7XG5cdFx0XHRcdGNoaWxkID1jaGlsZC5uZXh0U2libGluZztcblx0XHRcdH1cblx0XHRcdGNzLmxlbmd0aCA9IGk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogYXR0cmlidXRlcztcbiAqIGNoaWxkcmVuO1xuICogXG4gKiB3cml0ZWFibGUgcHJvcGVydGllczpcbiAqIG5vZGVWYWx1ZSxBdHRyOnZhbHVlLENoYXJhY3RlckRhdGE6ZGF0YVxuICogcHJlZml4XG4gKi9cbmZ1bmN0aW9uIF9yZW1vdmVDaGlsZChwYXJlbnROb2RlLGNoaWxkKXtcblx0dmFyIHByZXZpb3VzID0gY2hpbGQucHJldmlvdXNTaWJsaW5nO1xuXHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRpZihwcmV2aW91cyl7XG5cdFx0cHJldmlvdXMubmV4dFNpYmxpbmcgPSBuZXh0O1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXh0XG5cdH1cblx0aWYobmV4dCl7XG5cdFx0bmV4dC5wcmV2aW91c1NpYmxpbmcgPSBwcmV2aW91cztcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBwcmV2aW91cztcblx0fVxuXHRfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQscGFyZW50Tm9kZSk7XG5cdHJldHVybiBjaGlsZDtcbn1cbi8qKlxuICogcHJlZm9ybWFuY2Uga2V5KHJlZkNoaWxkID09IG51bGwpXG4gKi9cbmZ1bmN0aW9uIF9pbnNlcnRCZWZvcmUocGFyZW50Tm9kZSxuZXdDaGlsZCxuZXh0Q2hpbGQpe1xuXHR2YXIgY3AgPSBuZXdDaGlsZC5wYXJlbnROb2RlO1xuXHRpZihjcCl7XG5cdFx0Y3AucmVtb3ZlQ2hpbGQobmV3Q2hpbGQpOy8vcmVtb3ZlIGFuZCB1cGRhdGVcblx0fVxuXHRpZihuZXdDaGlsZC5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0dmFyIG5ld0ZpcnN0ID0gbmV3Q2hpbGQuZmlyc3RDaGlsZDtcblx0XHRpZiAobmV3Rmlyc3QgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG5ld0NoaWxkO1xuXHRcdH1cblx0XHR2YXIgbmV3TGFzdCA9IG5ld0NoaWxkLmxhc3RDaGlsZDtcblx0fWVsc2V7XG5cdFx0bmV3Rmlyc3QgPSBuZXdMYXN0ID0gbmV3Q2hpbGQ7XG5cdH1cblx0dmFyIHByZSA9IG5leHRDaGlsZCA/IG5leHRDaGlsZC5wcmV2aW91c1NpYmxpbmcgOiBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblxuXHRuZXdGaXJzdC5wcmV2aW91c1NpYmxpbmcgPSBwcmU7XG5cdG5ld0xhc3QubmV4dFNpYmxpbmcgPSBuZXh0Q2hpbGQ7XG5cdFxuXHRcblx0aWYocHJlKXtcblx0XHRwcmUubmV4dFNpYmxpbmcgPSBuZXdGaXJzdDtcblx0fWVsc2V7XG5cdFx0cGFyZW50Tm9kZS5maXJzdENoaWxkID0gbmV3Rmlyc3Q7XG5cdH1cblx0aWYobmV4dENoaWxkID09IG51bGwpe1xuXHRcdHBhcmVudE5vZGUubGFzdENoaWxkID0gbmV3TGFzdDtcblx0fWVsc2V7XG5cdFx0bmV4dENoaWxkLnByZXZpb3VzU2libGluZyA9IG5ld0xhc3Q7XG5cdH1cblx0ZG97XG5cdFx0bmV3Rmlyc3QucGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG5cdH13aGlsZShuZXdGaXJzdCAhPT0gbmV3TGFzdCAmJiAobmV3Rmlyc3Q9IG5ld0ZpcnN0Lm5leHRTaWJsaW5nKSlcblx0X29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50fHxwYXJlbnROb2RlLHBhcmVudE5vZGUpO1xuXHQvL2NvbnNvbGUubG9nKHBhcmVudE5vZGUubGFzdENoaWxkLm5leHRTaWJsaW5nID09IG51bGwpXG5cdGlmIChuZXdDaGlsZC5ub2RlVHlwZSA9PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG5cdFx0bmV3Q2hpbGQuZmlyc3RDaGlsZCA9IG5ld0NoaWxkLmxhc3RDaGlsZCA9IG51bGw7XG5cdH1cblx0cmV0dXJuIG5ld0NoaWxkO1xufVxuZnVuY3Rpb24gX2FwcGVuZFNpbmdsZUNoaWxkKHBhcmVudE5vZGUsbmV3Q2hpbGQpe1xuXHR2YXIgY3AgPSBuZXdDaGlsZC5wYXJlbnROb2RlO1xuXHRpZihjcCl7XG5cdFx0dmFyIHByZSA9IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXHRcdGNwLnJlbW92ZUNoaWxkKG5ld0NoaWxkKTsvL3JlbW92ZSBhbmQgdXBkYXRlXG5cdFx0dmFyIHByZSA9IHBhcmVudE5vZGUubGFzdENoaWxkO1xuXHR9XG5cdHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcblx0bmV3Q2hpbGQucGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG5cdG5ld0NoaWxkLnByZXZpb3VzU2libGluZyA9IHByZTtcblx0bmV3Q2hpbGQubmV4dFNpYmxpbmcgPSBudWxsO1xuXHRpZihwcmUpe1xuXHRcdHByZS5uZXh0U2libGluZyA9IG5ld0NoaWxkO1xuXHR9ZWxzZXtcblx0XHRwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZDtcblx0fVxuXHRwYXJlbnROb2RlLmxhc3RDaGlsZCA9IG5ld0NoaWxkO1xuXHRfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQscGFyZW50Tm9kZSxuZXdDaGlsZCk7XG5cdHJldHVybiBuZXdDaGlsZDtcblx0Ly9jb25zb2xlLmxvZyhcIl9fYWFcIixwYXJlbnROb2RlLmxhc3RDaGlsZC5uZXh0U2libGluZyA9PSBudWxsKVxufVxuRG9jdW1lbnQucHJvdG90eXBlID0ge1xuXHQvL2ltcGxlbWVudGF0aW9uIDogbnVsbCxcblx0bm9kZU5hbWUgOiAgJyNkb2N1bWVudCcsXG5cdG5vZGVUeXBlIDogIERPQ1VNRU5UX05PREUsXG5cdGRvY3R5cGUgOiAgbnVsbCxcblx0ZG9jdW1lbnRFbGVtZW50IDogIG51bGwsXG5cdF9pbmMgOiAxLFxuXHRcblx0aW5zZXJ0QmVmb3JlIDogIGZ1bmN0aW9uKG5ld0NoaWxkLCByZWZDaGlsZCl7Ly9yYWlzZXMgXG5cdFx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSl7XG5cdFx0XHR2YXIgY2hpbGQgPSBuZXdDaGlsZC5maXJzdENoaWxkO1xuXHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHR2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR0aGlzLmluc2VydEJlZm9yZShjaGlsZCxyZWZDaGlsZCk7XG5cdFx0XHRcdGNoaWxkID0gbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXdDaGlsZDtcblx0XHR9XG5cdFx0aWYodGhpcy5kb2N1bWVudEVsZW1lbnQgPT0gbnVsbCAmJiBuZXdDaGlsZC5ub2RlVHlwZSA9PSAxKXtcblx0XHRcdHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbmV3Q2hpbGQ7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBfaW5zZXJ0QmVmb3JlKHRoaXMsbmV3Q2hpbGQscmVmQ2hpbGQpLChuZXdDaGlsZC5vd25lckRvY3VtZW50ID0gdGhpcyksbmV3Q2hpbGQ7XG5cdH0sXG5cdHJlbW92ZUNoaWxkIDogIGZ1bmN0aW9uKG9sZENoaWxkKXtcblx0XHRpZih0aGlzLmRvY3VtZW50RWxlbWVudCA9PSBvbGRDaGlsZCl7XG5cdFx0XHR0aGlzLmRvY3VtZW50RWxlbWVudCA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiBfcmVtb3ZlQ2hpbGQodGhpcyxvbGRDaGlsZCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGltcG9ydE5vZGUgOiBmdW5jdGlvbihpbXBvcnRlZE5vZGUsZGVlcCl7XG5cdFx0cmV0dXJuIGltcG9ydE5vZGUodGhpcyxpbXBvcnRlZE5vZGUsZGVlcCk7XG5cdH0sXG5cdC8vIEludHJvZHVjZWQgaW4gRE9NIExldmVsIDI6XG5cdGdldEVsZW1lbnRCeUlkIDpcdGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgcnR2ID0gbnVsbDtcblx0XHRfdmlzaXROb2RlKHRoaXMuZG9jdW1lbnRFbGVtZW50LGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0aWYobm9kZS5ub2RlVHlwZSA9PSAxKXtcblx0XHRcdFx0aWYobm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT0gaWQpe1xuXHRcdFx0XHRcdHJ0diA9IG5vZGU7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdHJldHVybiBydHY7XG5cdH0sXG5cdFxuXHQvL2RvY3VtZW50IGZhY3RvcnkgbWV0aG9kOlxuXHRjcmVhdGVFbGVtZW50IDpcdGZ1bmN0aW9uKHRhZ05hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEVsZW1lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSB0YWdOYW1lO1xuXHRcdG5vZGUudGFnTmFtZSA9IHRhZ05hbWU7XG5cdFx0bm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHRhdHRycy5fb3duZXJFbGVtZW50ID0gbm9kZTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlRG9jdW1lbnRGcmFnbWVudCA6XHRmdW5jdGlvbigpe1xuXHRcdHZhciBub2RlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVUZXh0Tm9kZSA6XHRmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBUZXh0KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQ29tbWVudCA6XHRmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgbm9kZSA9IG5ldyBDb21tZW50KCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLmFwcGVuZERhdGEoZGF0YSlcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQ0RBVEFTZWN0aW9uIDpcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBub2RlID0gbmV3IENEQVRBU2VjdGlvbigpO1xuXHRcdG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG5cdFx0bm9kZS5hcHBlbmREYXRhKGRhdGEpXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH0sXG5cdGNyZWF0ZVByb2Nlc3NpbmdJbnN0cnVjdGlvbiA6XHRmdW5jdGlvbih0YXJnZXQsZGF0YSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgUHJvY2Vzc2luZ0luc3RydWN0aW9uKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcblx0XHRub2RlLnRhZ05hbWUgPSBub2RlLnRhcmdldCA9IHRhcmdldDtcblx0XHRub2RlLm5vZGVWYWx1ZT0gbm9kZS5kYXRhID0gZGF0YTtcblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0Y3JlYXRlQXR0cmlidXRlIDpcdGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEF0dHIoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnRcdD0gdGhpcztcblx0XHRub2RlLm5hbWUgPSBuYW1lO1xuXHRcdG5vZGUubm9kZU5hbWVcdD0gbmFtZTtcblx0XHRub2RlLmxvY2FsTmFtZSA9IG5hbWU7XG5cdFx0bm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRjcmVhdGVFbnRpdHlSZWZlcmVuY2UgOlx0ZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgRW50aXR5UmVmZXJlbmNlKCk7XG5cdFx0bm9kZS5vd25lckRvY3VtZW50XHQ9IHRoaXM7XG5cdFx0bm9kZS5ub2RlTmFtZVx0PSBuYW1lO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVFbGVtZW50TlMgOlx0ZnVuY3Rpb24obmFtZXNwYWNlVVJJLHF1YWxpZmllZE5hbWUpe1xuXHRcdHZhciBub2RlID0gbmV3IEVsZW1lbnQoKTtcblx0XHR2YXIgcGwgPSBxdWFsaWZpZWROYW1lLnNwbGl0KCc6Jyk7XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcblx0XHRub2RlLmNoaWxkTm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUudGFnTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XG5cdFx0aWYocGwubGVuZ3RoID09IDIpe1xuXHRcdFx0bm9kZS5wcmVmaXggPSBwbFswXTtcblx0XHRcdG5vZGUubG9jYWxOYW1lID0gcGxbMV07XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2VsLnByZWZpeCA9IG51bGw7XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0fVxuXHRcdGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHQvLyBJbnRyb2R1Y2VkIGluIERPTSBMZXZlbCAyOlxuXHRjcmVhdGVBdHRyaWJ1dGVOUyA6XHRmdW5jdGlvbihuYW1lc3BhY2VVUkkscXVhbGlmaWVkTmFtZSl7XG5cdFx0dmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuXHRcdHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcblx0XHRub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuXHRcdG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG5cdFx0bm9kZS5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XG5cdFx0bm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuXHRcdGlmKHBsLmxlbmd0aCA9PSAyKXtcblx0XHRcdG5vZGUucHJlZml4ID0gcGxbMF07XG5cdFx0XHRub2RlLmxvY2FsTmFtZSA9IHBsWzFdO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly9lbC5wcmVmaXggPSBudWxsO1xuXHRcdFx0bm9kZS5sb2NhbE5hbWUgPSBxdWFsaWZpZWROYW1lO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcbl9leHRlbmRzKERvY3VtZW50LE5vZGUpO1xuXG5cbmZ1bmN0aW9uIEVsZW1lbnQoKSB7XG5cdHRoaXMuX25zTWFwID0ge307XG59O1xuRWxlbWVudC5wcm90b3R5cGUgPSB7XG5cdG5vZGVUeXBlIDogRUxFTUVOVF9OT0RFLFxuXHRoYXNBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpIT1udWxsO1xuXHR9LFxuXHRnZXRBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKTtcblx0XHRyZXR1cm4gYXR0ciAmJiBhdHRyLnZhbHVlIHx8ICcnO1xuXHR9LFxuXHRnZXRBdHRyaWJ1dGVOb2RlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0obmFtZSk7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0YXR0ci52YWx1ZSA9IGF0dHIubm9kZVZhbHVlID0gXCJcIiArIHZhbHVlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlTm9kZShhdHRyKVxuXHR9LFxuXHRyZW1vdmVBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKVxuXHRcdGF0dHIgJiYgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuXHR9LFxuXHRcblx0Ly9mb3VyIHJlYWwgb3BlYXJ0aW9uIG1ldGhvZFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0aWYobmV3Q2hpbGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe1xuXHRcdFx0cmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLG51bGwpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIF9hcHBlbmRTaW5nbGVDaGlsZCh0aGlzLG5ld0NoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5vZGUgOiBmdW5jdGlvbihuZXdBdHRyKXtcblx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShuZXdBdHRyKTtcblx0fSxcblx0c2V0QXR0cmlidXRlTm9kZU5TIDogZnVuY3Rpb24obmV3QXR0cil7XG5cdFx0cmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW1OUyhuZXdBdHRyKTtcblx0fSxcblx0cmVtb3ZlQXR0cmlidXRlTm9kZSA6IGZ1bmN0aW9uKG9sZEF0dHIpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKG9sZEF0dHIubm9kZU5hbWUpO1xuXHR9LFxuXHQvL2dldCByZWFsIGF0dHJpYnV0ZSBuYW1lLGFuZCByZW1vdmUgaXQgYnkgcmVtb3ZlQXR0cmlidXRlTm9kZVxuXHRyZW1vdmVBdHRyaWJ1dGVOUyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKXtcblx0XHR2YXIgb2xkID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdG9sZCAmJiB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5vZGUob2xkKTtcblx0fSxcblx0XG5cdGhhc0F0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkhPW51bGw7XG5cdH0sXG5cdGdldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHRcdHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG5cdH0sXG5cdHNldEF0dHJpYnV0ZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lLCB2YWx1ZSl7XG5cdFx0dmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcblx0XHRhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSB2YWx1ZTtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZU5vZGUoYXR0cilcblx0fSxcblx0Z2V0QXR0cmlidXRlTm9kZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuXHR9LFxuXHRcblx0Z2V0RWxlbWVudHNCeVRhZ05hbWUgOiBmdW5jdGlvbih0YWdOYW1lKXtcblx0XHRyZXR1cm4gbmV3IExpdmVOb2RlTGlzdCh0aGlzLGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0dmFyIGxzID0gW107XG5cdFx0XHRfdmlzaXROb2RlKGJhc2UsZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRcdGlmKG5vZGUgIT09IGJhc2UgJiYgbm9kZS5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUgJiYgKHRhZ05hbWUgPT09ICcqJyB8fCBub2RlLnRhZ05hbWUgPT0gdGFnTmFtZSkpe1xuXHRcdFx0XHRcdGxzLnB1c2gobm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxzO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXRFbGVtZW50c0J5VGFnTmFtZU5TIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpe1xuXHRcdHJldHVybiBuZXcgTGl2ZU5vZGVMaXN0KHRoaXMsZnVuY3Rpb24oYmFzZSl7XG5cdFx0XHR2YXIgbHMgPSBbXTtcblx0XHRcdF92aXNpdE5vZGUoYmFzZSxmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0aWYobm9kZSAhPT0gYmFzZSAmJiBub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgJiYgbm9kZS5uYW1lc3BhY2VVUkkgPT09IG5hbWVzcGFjZVVSSSAmJiAobG9jYWxOYW1lID09PSAnKicgfHwgbm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lKSl7XG5cdFx0XHRcdFx0bHMucHVzaChub2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbHM7XG5cdFx0fSk7XG5cdH1cbn07XG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBFbGVtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZTtcbkRvY3VtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TID0gRWxlbWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUztcblxuXG5fZXh0ZW5kcyhFbGVtZW50LE5vZGUpO1xuZnVuY3Rpb24gQXR0cigpIHtcbn07XG5BdHRyLnByb3RvdHlwZS5ub2RlVHlwZSA9IEFUVFJJQlVURV9OT0RFO1xuX2V4dGVuZHMoQXR0cixOb2RlKTtcblxuXG5mdW5jdGlvbiBDaGFyYWN0ZXJEYXRhKCkge1xufTtcbkNoYXJhY3RlckRhdGEucHJvdG90eXBlID0ge1xuXHRkYXRhIDogJycsXG5cdHN1YnN0cmluZ0RhdGEgOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50KSB7XG5cdFx0cmV0dXJuIHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0LCBvZmZzZXQrY291bnQpO1xuXHR9LFxuXHRhcHBlbmREYXRhOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0dGV4dCA9IHRoaXMuZGF0YSt0ZXh0O1xuXHRcdHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHR9LFxuXHRpbnNlcnREYXRhOiBmdW5jdGlvbihvZmZzZXQsdGV4dCkge1xuXHRcdHRoaXMucmVwbGFjZURhdGEob2Zmc2V0LDAsdGV4dCk7XG5cdFxuXHR9LFxuXHRhcHBlbmRDaGlsZDpmdW5jdGlvbihuZXdDaGlsZCl7XG5cdFx0Ly9pZighKG5ld0NoaWxkIGluc3RhbmNlb2YgQ2hhcmFjdGVyRGF0YSkpe1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKEV4Y2VwdGlvbk1lc3NhZ2VbM10pXG5cdFx0Ly99XG5cdFx0cmV0dXJuIE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxuXHR9LFxuXHRkZWxldGVEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50KSB7XG5cdFx0dGhpcy5yZXBsYWNlRGF0YShvZmZzZXQsY291bnQsXCJcIik7XG5cdH0sXG5cdHJlcGxhY2VEYXRhOiBmdW5jdGlvbihvZmZzZXQsIGNvdW50LCB0ZXh0KSB7XG5cdFx0dmFyIHN0YXJ0ID0gdGhpcy5kYXRhLnN1YnN0cmluZygwLG9mZnNldCk7XG5cdFx0dmFyIGVuZCA9IHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0K2NvdW50KTtcblx0XHR0ZXh0ID0gc3RhcnQgKyB0ZXh0ICsgZW5kO1xuXHRcdHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcblx0XHR0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHR9XG59XG5fZXh0ZW5kcyhDaGFyYWN0ZXJEYXRhLE5vZGUpO1xuZnVuY3Rpb24gVGV4dCgpIHtcbn07XG5UZXh0LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiN0ZXh0XCIsXG5cdG5vZGVUeXBlIDogVEVYVF9OT0RFLFxuXHRzcGxpdFRleHQgOiBmdW5jdGlvbihvZmZzZXQpIHtcblx0XHR2YXIgdGV4dCA9IHRoaXMuZGF0YTtcblx0XHR2YXIgbmV3VGV4dCA9IHRleHQuc3Vic3RyaW5nKG9mZnNldCk7XG5cdFx0dGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIG9mZnNldCk7XG5cdFx0dGhpcy5kYXRhID0gdGhpcy5ub2RlVmFsdWUgPSB0ZXh0O1xuXHRcdHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0dmFyIG5ld05vZGUgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3VGV4dCk7XG5cdFx0aWYodGhpcy5wYXJlbnROb2RlKXtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgdGhpcy5uZXh0U2libGluZyk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdOb2RlO1xuXHR9XG59XG5fZXh0ZW5kcyhUZXh0LENoYXJhY3RlckRhdGEpO1xuZnVuY3Rpb24gQ29tbWVudCgpIHtcbn07XG5Db21tZW50LnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjb21tZW50XCIsXG5cdG5vZGVUeXBlIDogQ09NTUVOVF9OT0RFXG59XG5fZXh0ZW5kcyhDb21tZW50LENoYXJhY3RlckRhdGEpO1xuXG5mdW5jdGlvbiBDREFUQVNlY3Rpb24oKSB7XG59O1xuQ0RBVEFTZWN0aW9uLnByb3RvdHlwZSA9IHtcblx0bm9kZU5hbWUgOiBcIiNjZGF0YS1zZWN0aW9uXCIsXG5cdG5vZGVUeXBlIDogQ0RBVEFfU0VDVElPTl9OT0RFXG59XG5fZXh0ZW5kcyhDREFUQVNlY3Rpb24sQ2hhcmFjdGVyRGF0YSk7XG5cblxuZnVuY3Rpb24gRG9jdW1lbnRUeXBlKCkge1xufTtcbkRvY3VtZW50VHlwZS5wcm90b3R5cGUubm9kZVR5cGUgPSBET0NVTUVOVF9UWVBFX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudFR5cGUsTm9kZSk7XG5cbmZ1bmN0aW9uIE5vdGF0aW9uKCkge1xufTtcbk5vdGF0aW9uLnByb3RvdHlwZS5ub2RlVHlwZSA9IE5PVEFUSU9OX05PREU7XG5fZXh0ZW5kcyhOb3RhdGlvbixOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5KCkge1xufTtcbkVudGl0eS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfTk9ERTtcbl9leHRlbmRzKEVudGl0eSxOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5UmVmZXJlbmNlKCkge1xufTtcbkVudGl0eVJlZmVyZW5jZS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfUkVGRVJFTkNFX05PREU7XG5fZXh0ZW5kcyhFbnRpdHlSZWZlcmVuY2UsTm9kZSk7XG5cbmZ1bmN0aW9uIERvY3VtZW50RnJhZ21lbnQoKSB7XG59O1xuRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUubm9kZU5hbWUgPVx0XCIjZG9jdW1lbnQtZnJhZ21lbnRcIjtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVUeXBlID1cdERPQ1VNRU5UX0ZSQUdNRU5UX05PREU7XG5fZXh0ZW5kcyhEb2N1bWVudEZyYWdtZW50LE5vZGUpO1xuXG5cbmZ1bmN0aW9uIFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpIHtcbn1cblByb2Nlc3NpbmdJbnN0cnVjdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU7XG5fZXh0ZW5kcyhQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sTm9kZSk7XG5mdW5jdGlvbiBYTUxTZXJpYWxpemVyKCl7fVxuWE1MU2VyaWFsaXplci5wcm90b3R5cGUuc2VyaWFsaXplVG9TdHJpbmcgPSBmdW5jdGlvbihub2RlKXtcblx0dmFyIGJ1ZiA9IFtdO1xuXHRzZXJpYWxpemVUb1N0cmluZyhub2RlLGJ1Zik7XG5cdHJldHVybiBidWYuam9pbignJyk7XG59XG5Ob2RlLnByb3RvdHlwZS50b1N0cmluZyA9ZnVuY3Rpb24oKXtcblx0cmV0dXJuIFhNTFNlcmlhbGl6ZXIucHJvdG90eXBlLnNlcmlhbGl6ZVRvU3RyaW5nKHRoaXMpO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplVG9TdHJpbmcobm9kZSxidWYpe1xuXHRzd2l0Y2gobm9kZS5ub2RlVHlwZSl7XG5cdGNhc2UgRUxFTUVOVF9OT0RFOlxuXHRcdHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcblx0XHR2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR2YXIgbm9kZU5hbWUgPSBub2RlLnRhZ05hbWU7XG5cdFx0dmFyIGlzSFRNTCA9IGh0bWxucyA9PT0gbm9kZS5uYW1lc3BhY2VVUklcblx0XHRidWYucHVzaCgnPCcsbm9kZU5hbWUpO1xuXHRcdGZvcih2YXIgaT0wO2k8bGVuO2krKyl7XG5cdFx0XHRzZXJpYWxpemVUb1N0cmluZyhhdHRycy5pdGVtKGkpLGJ1Zixpc0hUTUwpO1xuXHRcdH1cblx0XHRpZihjaGlsZCB8fCBpc0hUTUwgJiYgIS9eKD86bWV0YXxsaW5rfGltZ3xicnxocnxpbnB1dCkkL2kudGVzdChub2RlTmFtZSkpe1xuXHRcdFx0YnVmLnB1c2goJz4nKTtcblx0XHRcdC8vaWYgaXMgY2RhdGEgY2hpbGQgbm9kZVxuXHRcdFx0aWYoaXNIVE1MICYmIC9ec2NyaXB0JC9pLnRlc3Qobm9kZU5hbWUpKXtcblx0XHRcdFx0aWYoY2hpbGQpe1xuXHRcdFx0XHRcdGJ1Zi5wdXNoKGNoaWxkLmRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0d2hpbGUoY2hpbGQpe1xuXHRcdFx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zik7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goJzwvJyxub2RlTmFtZSwnPicpO1xuXHRcdH1lbHNle1xuXHRcdFx0YnVmLnB1c2goJy8+Jyk7XG5cdFx0fVxuXHRcdHJldHVybjtcblx0Y2FzZSBET0NVTUVOVF9OT0RFOlxuXHRjYXNlIERPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLGJ1Zik7XG5cdFx0XHRjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0XHRyZXR1cm47XG5cdGNhc2UgQVRUUklCVVRFX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCcgJyxub2RlLm5hbWUsJz1cIicsbm9kZS52YWx1ZS5yZXBsYWNlKC9bPCZcIl0vZyxfeG1sRW5jb2RlciksJ1wiJyk7XG5cdGNhc2UgVEVYVF9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaChub2RlLmRhdGEucmVwbGFjZSgvWzwmXS9nLF94bWxFbmNvZGVyKSk7XG5cdGNhc2UgQ0RBVEFfU0VDVElPTl9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggJzwhW0NEQVRBWycsbm9kZS5kYXRhLCddXT4nKTtcblx0Y2FzZSBDT01NRU5UX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCBcIjwhLS1cIixub2RlLmRhdGEsXCItLT5cIik7XG5cdGNhc2UgRE9DVU1FTlRfVFlQRV9OT0RFOlxuXHRcdHZhciBwdWJpZCA9IG5vZGUucHVibGljSWQ7XG5cdFx0dmFyIHN5c2lkID0gbm9kZS5zeXN0ZW1JZDtcblx0XHRidWYucHVzaCgnPCFET0NUWVBFICcsbm9kZS5uYW1lKTtcblx0XHRpZihwdWJpZCl7XG5cdFx0XHRidWYucHVzaCgnIFBVQkxJQyBcIicscHViaWQpO1xuXHRcdFx0aWYgKHN5c2lkICYmIHN5c2lkIT0nLicpIHtcblx0XHRcdFx0YnVmLnB1c2goICdcIiBcIicsc3lzaWQpO1xuXHRcdFx0fVxuXHRcdFx0YnVmLnB1c2goJ1wiPicpO1xuXHRcdH1lbHNlIGlmKHN5c2lkICYmIHN5c2lkIT0nLicpe1xuXHRcdFx0YnVmLnB1c2goJyBTWVNURU0gXCInLHN5c2lkLCdcIj4nKTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBzdWIgPSBub2RlLmludGVybmFsU3Vic2V0O1xuXHRcdFx0aWYoc3ViKXtcblx0XHRcdFx0YnVmLnB1c2goXCIgW1wiLHN1YixcIl1cIik7XG5cdFx0XHR9XG5cdFx0XHRidWYucHVzaChcIj5cIik7XG5cdFx0fVxuXHRcdHJldHVybjtcblx0Y2FzZSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU6XG5cdFx0cmV0dXJuIGJ1Zi5wdXNoKCBcIjw/XCIsbm9kZS50YXJnZXQsXCIgXCIsbm9kZS5kYXRhLFwiPz5cIik7XG5cdGNhc2UgRU5USVRZX1JFRkVSRU5DRV9OT0RFOlxuXHRcdHJldHVybiBidWYucHVzaCggJyYnLG5vZGUubm9kZU5hbWUsJzsnKTtcblx0Ly9jYXNlIEVOVElUWV9OT0RFOlxuXHQvL2Nhc2UgTk9UQVRJT05fTk9ERTpcblx0ZGVmYXVsdDpcblx0XHRidWYucHVzaCgnPz8nLG5vZGUubm9kZU5hbWUpO1xuXHR9XG59XG5mdW5jdGlvbiBpbXBvcnROb2RlKGRvYyxub2RlLGRlZXApe1xuXHR2YXIgbm9kZTI7XG5cdHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuXHRjYXNlIEVMRU1FTlRfTk9ERTpcblx0XHRub2RlMiA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKTtcblx0XHRub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuXHRcdC8vdmFyIGF0dHJzID0gbm9kZTIuYXR0cmlidXRlcztcblx0XHQvL3ZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG5cdFx0Ly9mb3IodmFyIGk9MDtpPGxlbjtpKyspe1xuXHRcdFx0Ly9ub2RlMi5zZXRBdHRyaWJ1dGVOb2RlTlMoaW1wb3J0Tm9kZShkb2MsYXR0cnMuaXRlbShpKSxkZWVwKSk7XG5cdFx0Ly99XG5cdGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcblx0XHRicmVhaztcblx0Y2FzZSBBVFRSSUJVVEVfTk9ERTpcblx0XHRkZWVwID0gdHJ1ZTtcblx0XHRicmVhaztcblx0Ly9jYXNlIEVOVElUWV9SRUZFUkVOQ0VfTk9ERTpcblx0Ly9jYXNlIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTpcblx0Ly8vL2Nhc2UgVEVYVF9OT0RFOlxuXHQvL2Nhc2UgQ0RBVEFfU0VDVElPTl9OT0RFOlxuXHQvL2Nhc2UgQ09NTUVOVF9OT0RFOlxuXHQvL1x0ZGVlcCA9IGZhbHNlO1xuXHQvL1x0YnJlYWs7XG5cdC8vY2FzZSBET0NVTUVOVF9OT0RFOlxuXHQvL2Nhc2UgRE9DVU1FTlRfVFlQRV9OT0RFOlxuXHQvL2Nhbm5vdCBiZSBpbXBvcnRlZC5cblx0Ly9jYXNlIEVOVElUWV9OT0RFOlxuXHQvL2Nhc2UgTk9UQVRJT05fTk9ERe+8mlxuXHQvL2NhbiBub3QgaGl0IGluIGxldmVsM1xuXHQvL2RlZmF1bHQ6dGhyb3cgZTtcblx0fVxuXHRpZighbm9kZTIpe1xuXHRcdG5vZGUyID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpOy8vZmFsc2Vcblx0fVxuXHRub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuXHRub2RlMi5wYXJlbnROb2RlID0gbnVsbDtcblx0aWYoZGVlcCl7XG5cdFx0dmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuXHRcdHdoaWxlKGNoaWxkKXtcblx0XHRcdG5vZGUyLmFwcGVuZENoaWxkKGltcG9ydE5vZGUoZG9jLGNoaWxkLGRlZXApKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2RlMjtcbn1cbi8vXG4vL3ZhciBfcmVsYXRpb25NYXAgPSB7Zmlyc3RDaGlsZDoxLGxhc3RDaGlsZDoxLHByZXZpb3VzU2libGluZzoxLG5leHRTaWJsaW5nOjEsXG4vL1x0XHRcdFx0XHRhdHRyaWJ1dGVzOjEsY2hpbGROb2RlczoxLHBhcmVudE5vZGU6MSxkb2N1bWVudEVsZW1lbnQ6MSxkb2N0eXBlLH07XG5mdW5jdGlvbiBjbG9uZU5vZGUoZG9jLG5vZGUsZGVlcCl7XG5cdHZhciBub2RlMiA9IG5ldyBub2RlLmNvbnN0cnVjdG9yKCk7XG5cdGZvcih2YXIgbiBpbiBub2RlKXtcblx0XHR2YXIgdiA9IG5vZGVbbl07XG5cdFx0aWYodHlwZW9mIHYgIT0gJ29iamVjdCcgKXtcblx0XHRcdGlmKHYgIT0gbm9kZTJbbl0pe1xuXHRcdFx0XHRub2RlMltuXSA9IHY7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmKG5vZGUuY2hpbGROb2Rlcyl7XG5cdFx0bm9kZTIuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuXHR9XG5cdG5vZGUyLm93bmVyRG9jdW1lbnQgPSBkb2M7XG5cdHN3aXRjaCAobm9kZTIubm9kZVR5cGUpIHtcblx0Y2FzZSBFTEVNRU5UX05PREU6XG5cdFx0dmFyIGF0dHJzXHQ9IG5vZGUuYXR0cmlidXRlcztcblx0XHR2YXIgYXR0cnMyXHQ9IG5vZGUyLmF0dHJpYnV0ZXMgPSBuZXcgTmFtZWROb2RlTWFwKCk7XG5cdFx0dmFyIGxlbiA9IGF0dHJzLmxlbmd0aFxuXHRcdGF0dHJzMi5fb3duZXJFbGVtZW50ID0gbm9kZTI7XG5cdFx0Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtcblx0XHRcdG5vZGUyLnNldEF0dHJpYnV0ZU5vZGUoY2xvbmVOb2RlKGRvYyxhdHRycy5pdGVtKGkpLHRydWUpKTtcblx0XHR9XG5cdFx0YnJlYWs7O1xuXHRjYXNlIEFUVFJJQlVURV9OT0RFOlxuXHRcdGRlZXAgPSB0cnVlO1xuXHR9XG5cdGlmKGRlZXApe1xuXHRcdHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblx0XHR3aGlsZShjaGlsZCl7XG5cdFx0XHRub2RlMi5hcHBlbmRDaGlsZChjbG9uZU5vZGUoZG9jLGNoaWxkLGRlZXApKTtcblx0XHRcdGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2RlMjtcbn1cblxuZnVuY3Rpb24gX19zZXRfXyhvYmplY3Qsa2V5LHZhbHVlKXtcblx0b2JqZWN0W2tleV0gPSB2YWx1ZVxufVxuLy9kbyBkeW5hbWljXG50cnl7XG5cdGlmKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSl7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KExpdmVOb2RlTGlzdC5wcm90b3R5cGUsJ2xlbmd0aCcse1xuXHRcdFx0Z2V0OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuJCRsZW5ndGg7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCd0ZXh0Q29udGVudCcse1xuXHRcdFx0Z2V0OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiBnZXRUZXh0Q29udGVudCh0aGlzKTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdHN3aXRjaCh0aGlzLm5vZGVUeXBlKXtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRjYXNlIDExOlxuXHRcdFx0XHRcdHdoaWxlKHRoaXMuZmlyc3RDaGlsZCl7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGRhdGEgfHwgU3RyaW5nKGRhdGEpKXtcblx0XHRcdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly9UT0RPOlxuXHRcdFx0XHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdHRoaXMubm9kZVZhbHVlID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0XG5cdFx0ZnVuY3Rpb24gZ2V0VGV4dENvbnRlbnQobm9kZSl7XG5cdFx0XHRzd2l0Y2gobm9kZS5ub2RlVHlwZSl7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRjYXNlIDExOlxuXHRcdFx0XHR2YXIgYnVmID0gW107XG5cdFx0XHRcdG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG5cdFx0XHRcdHdoaWxlKG5vZGUpe1xuXHRcdFx0XHRcdGlmKG5vZGUubm9kZVR5cGUhPT03ICYmIG5vZGUubm9kZVR5cGUgIT09OCl7XG5cdFx0XHRcdFx0XHRidWYucHVzaChnZXRUZXh0Q29udGVudChub2RlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBidWYuam9pbignJyk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9fc2V0X18gPSBmdW5jdGlvbihvYmplY3Qsa2V5LHZhbHVlKXtcblx0XHRcdC8vY29uc29sZS5sb2codmFsdWUpXG5cdFx0XHRvYmplY3RbJyQkJytrZXldID0gdmFsdWVcblx0XHR9XG5cdH1cbn1jYXRjaChlKXsvL2llOFxufVxuXG5pZih0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nKXtcblx0ZXhwb3J0cy5ET01JbXBsZW1lbnRhdGlvbiA9IERPTUltcGxlbWVudGF0aW9uO1xuXHRleHBvcnRzLlhNTFNlcmlhbGl6ZXIgPSBYTUxTZXJpYWxpemVyO1xufVxuIiwiLy9bNF0gICBcdE5hbWVTdGFydENoYXJcdCAgIDo6PSAgIFx0XCI6XCIgfCBbQS1aXSB8IFwiX1wiIHwgW2Etel0gfCBbI3hDMC0jeEQ2XSB8IFsjeEQ4LSN4RjZdIHwgWyN4RjgtI3gyRkZdIHwgWyN4MzcwLSN4MzdEXSB8IFsjeDM3Ri0jeDFGRkZdIHwgWyN4MjAwQy0jeDIwMERdIHwgWyN4MjA3MC0jeDIxOEZdIHwgWyN4MkMwMC0jeDJGRUZdIHwgWyN4MzAwMS0jeEQ3RkZdIHwgWyN4RjkwMC0jeEZEQ0ZdIHwgWyN4RkRGMC0jeEZGRkRdIHwgWyN4MTAwMDAtI3hFRkZGRl1cclxuLy9bNGFdICAgXHROYW1lQ2hhclx0ICAgOjo9ICAgXHROYW1lU3RhcnRDaGFyIHwgXCItXCIgfCBcIi5cIiB8IFswLTldIHwgI3hCNyB8IFsjeDAzMDAtI3gwMzZGXSB8IFsjeDIwM0YtI3gyMDQwXVxyXG4vL1s1XSAgIFx0TmFtZVx0ICAgOjo9ICAgXHROYW1lU3RhcnRDaGFyIChOYW1lQ2hhcikqXHJcbnZhciBuYW1lU3RhcnRDaGFyID0gL1tBLVpfYS16XFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRF0vLy9cXHUxMDAwMC1cXHVFRkZGRlxyXG52YXIgbmFtZUNoYXIgPSBuZXcgUmVnRXhwKFwiW1xcXFwtXFxcXC4wLTlcIituYW1lU3RhcnRDaGFyLnNvdXJjZS5zbGljZSgxLC0xKStcIlxcdTAwQjdcXHUwMzAwLVxcdTAzNkZcXFxcdXgyMDNGLVxcdTIwNDBdXCIpO1xyXG52YXIgdGFnTmFtZVBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeJytuYW1lU3RhcnRDaGFyLnNvdXJjZStuYW1lQ2hhci5zb3VyY2UrJyooPzpcXDonK25hbWVTdGFydENoYXIuc291cmNlK25hbWVDaGFyLnNvdXJjZSsnKik/JCcpO1xyXG4vL3ZhciB0YWdOYW1lUGF0dGVybiA9IC9eW2EtekEtWl9dW1xcd1xcLVxcLl0qKD86XFw6W2EtekEtWl9dW1xcd1xcLVxcLl0qKT8kL1xyXG4vL3ZhciBoYW5kbGVycyA9ICdyZXNvbHZlRW50aXR5LGdldEV4dGVybmFsU3Vic2V0LGNoYXJhY3RlcnMsZW5kRG9jdW1lbnQsZW5kRWxlbWVudCxlbmRQcmVmaXhNYXBwaW5nLGlnbm9yYWJsZVdoaXRlc3BhY2UscHJvY2Vzc2luZ0luc3RydWN0aW9uLHNldERvY3VtZW50TG9jYXRvcixza2lwcGVkRW50aXR5LHN0YXJ0RG9jdW1lbnQsc3RhcnRFbGVtZW50LHN0YXJ0UHJlZml4TWFwcGluZyxub3RhdGlvbkRlY2wsdW5wYXJzZWRFbnRpdHlEZWNsLGVycm9yLGZhdGFsRXJyb3Isd2FybmluZyxhdHRyaWJ1dGVEZWNsLGVsZW1lbnREZWNsLGV4dGVybmFsRW50aXR5RGVjbCxpbnRlcm5hbEVudGl0eURlY2wsY29tbWVudCxlbmRDREFUQSxlbmREVEQsZW5kRW50aXR5LHN0YXJ0Q0RBVEEsc3RhcnREVEQsc3RhcnRFbnRpdHknLnNwbGl0KCcsJylcclxuXHJcbi8vU19UQUcsXHRTX0FUVFIsXHRTX0VRLFx0U19WXHJcbi8vU19BVFRSX1MsXHRTX0UsXHRTX1MsXHRTX0NcclxudmFyIFNfVEFHID0gMDsvL3RhZyBuYW1lIG9mZmVycmluZ1xyXG52YXIgU19BVFRSID0gMTsvL2F0dHIgbmFtZSBvZmZlcnJpbmcgXHJcbnZhciBTX0FUVFJfUz0yOy8vYXR0ciBuYW1lIGVuZCBhbmQgc3BhY2Ugb2ZmZXJcclxudmFyIFNfRVEgPSAzOy8vPXNwYWNlP1xyXG52YXIgU19WID0gNDsvL2F0dHIgdmFsdWUobm8gcXVvdCB2YWx1ZSBvbmx5KVxyXG52YXIgU19FID0gNTsvL2F0dHIgdmFsdWUgZW5kIGFuZCBubyBzcGFjZShxdW90IGVuZClcclxudmFyIFNfUyA9IDY7Ly8oYXR0ciB2YWx1ZSBlbmQgfHwgdGFnIGVuZCApICYmIChzcGFjZSBvZmZlcilcclxudmFyIFNfQyA9IDc7Ly9jbG9zZWQgZWw8ZWwgLz5cclxuXHJcbmZ1bmN0aW9uIFhNTFJlYWRlcigpe1xyXG5cdFxyXG59XHJcblxyXG5YTUxSZWFkZXIucHJvdG90eXBlID0ge1xyXG5cdHBhcnNlOmZ1bmN0aW9uKHNvdXJjZSxkZWZhdWx0TlNNYXAsZW50aXR5TWFwKXtcclxuXHRcdHZhciBkb21CdWlsZGVyID0gdGhpcy5kb21CdWlsZGVyO1xyXG5cdFx0ZG9tQnVpbGRlci5zdGFydERvY3VtZW50KCk7XHJcblx0XHRfY29weShkZWZhdWx0TlNNYXAgLGRlZmF1bHROU01hcCA9IHt9KVxyXG5cdFx0cGFyc2Uoc291cmNlLGRlZmF1bHROU01hcCxlbnRpdHlNYXAsXHJcblx0XHRcdFx0ZG9tQnVpbGRlcix0aGlzLmVycm9ySGFuZGxlcik7XHJcblx0XHRkb21CdWlsZGVyLmVuZERvY3VtZW50KCk7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHNvdXJjZSxkZWZhdWx0TlNNYXBDb3B5LGVudGl0eU1hcCxkb21CdWlsZGVyLGVycm9ySGFuZGxlcil7XHJcbiAgZnVuY3Rpb24gZml4ZWRGcm9tQ2hhckNvZGUoY29kZSkge1xyXG5cdFx0Ly8gU3RyaW5nLnByb3RvdHlwZS5mcm9tQ2hhckNvZGUgZG9lcyBub3Qgc3VwcG9ydHNcclxuXHRcdC8vID4gMiBieXRlcyB1bmljb2RlIGNoYXJzIGRpcmVjdGx5XHJcblx0XHRpZiAoY29kZSA+IDB4ZmZmZikge1xyXG5cdFx0XHRjb2RlIC09IDB4MTAwMDA7XHJcblx0XHRcdHZhciBzdXJyb2dhdGUxID0gMHhkODAwICsgKGNvZGUgPj4gMTApXHJcblx0XHRcdFx0LCBzdXJyb2dhdGUyID0gMHhkYzAwICsgKGNvZGUgJiAweDNmZik7XHJcblxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdXJyb2dhdGUxLCBzdXJyb2dhdGUyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBlbnRpdHlSZXBsYWNlcihhKXtcclxuXHRcdHZhciBrID0gYS5zbGljZSgxLC0xKTtcclxuXHRcdGlmKGsgaW4gZW50aXR5TWFwKXtcclxuXHRcdFx0cmV0dXJuIGVudGl0eU1hcFtrXTsgXHJcblx0XHR9ZWxzZSBpZihrLmNoYXJBdCgwKSA9PT0gJyMnKXtcclxuXHRcdFx0cmV0dXJuIGZpeGVkRnJvbUNoYXJDb2RlKHBhcnNlSW50KGsuc3Vic3RyKDEpLnJlcGxhY2UoJ3gnLCcweCcpKSlcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRlcnJvckhhbmRsZXIuZXJyb3IoJ2VudGl0eSBub3QgZm91bmQ6JythKTtcclxuXHRcdFx0cmV0dXJuIGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFwcGVuZFRleHQoZW5kKXsvL2hhcyBzb21lIGJ1Z3NcclxuXHRcdHZhciB4dCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdGxvY2F0b3ImJnBvc2l0aW9uKHN0YXJ0KTtcclxuXHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh4dCwwLGVuZC1zdGFydCk7XHJcblx0XHRzdGFydCA9IGVuZFxyXG5cdH1cclxuXHRmdW5jdGlvbiBwb3NpdGlvbihzdGFydCxtKXtcclxuXHRcdHdoaWxlKHN0YXJ0Pj1lbmRQb3MgJiYgKG0gPSBsaW5lUGF0dGVybi5leGVjKHNvdXJjZSkpKXtcclxuXHRcdFx0c3RhcnRQb3MgPSBtLmluZGV4O1xyXG5cdFx0XHRlbmRQb3MgPSBzdGFydFBvcyArIG1bMF0ubGVuZ3RoO1xyXG5cdFx0XHRsb2NhdG9yLmxpbmVOdW1iZXIrKztcclxuXHRcdFx0Ly9jb25zb2xlLmxvZygnbGluZSsrOicsbG9jYXRvcixzdGFydFBvcyxlbmRQb3MpXHJcblx0XHR9XHJcblx0XHRsb2NhdG9yLmNvbHVtbk51bWJlciA9IHN0YXJ0LXN0YXJ0UG9zKzE7XHJcblx0fVxyXG5cdHZhciBzdGFydFBvcyA9IDA7XHJcblx0dmFyIGVuZFBvcyA9IDA7XHJcblx0dmFyIGxpbmVQYXR0ZXJuID0gLy4rKD86XFxyXFxuP3xcXG4pfC4qJC9nXHJcblx0dmFyIGxvY2F0b3IgPSBkb21CdWlsZGVyLmxvY2F0b3I7XHJcblx0XHJcblx0dmFyIHBhcnNlU3RhY2sgPSBbe2N1cnJlbnROU01hcDpkZWZhdWx0TlNNYXBDb3B5fV1cclxuXHR2YXIgY2xvc2VNYXAgPSB7fTtcclxuXHR2YXIgc3RhcnQgPSAwO1xyXG5cdHdoaWxlKHRydWUpe1xyXG5cdFx0dmFyIGkgPSBzb3VyY2UuaW5kZXhPZignPCcsc3RhcnQpO1xyXG5cdFx0aWYoaTwwKXtcclxuXHRcdFx0aWYoIXNvdXJjZS5zdWJzdHIoc3RhcnQpLm1hdGNoKC9eXFxzKiQvKSl7XHJcblx0XHRcdFx0dmFyIGRvYyA9IGRvbUJ1aWxkZXIuZG9jdW1lbnQ7XHJcbiAgICBcdFx0XHR2YXIgdGV4dCA9IGRvYy5jcmVhdGVUZXh0Tm9kZShzb3VyY2Uuc3Vic3RyKHN0YXJ0KSk7XHJcbiAgICBcdFx0XHRkb2MuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICBcdFx0XHRkb21CdWlsZGVyLmN1cnJlbnRFbGVtZW50ID0gdGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZihpPnN0YXJ0KXtcclxuXHRcdFx0YXBwZW5kVGV4dChpKTtcclxuXHRcdH1cclxuXHRcdHN3aXRjaChzb3VyY2UuY2hhckF0KGkrMSkpe1xyXG5cdFx0Y2FzZSAnLyc6XHJcblx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignPicsaSszKTtcclxuXHRcdFx0dmFyIHRhZ05hbWUgPSBzb3VyY2Uuc3Vic3RyaW5nKGkrMixlbmQpO1xyXG5cdFx0XHR2YXIgY29uZmlnID0gcGFyc2VTdGFjay5wb3AoKTtcclxuXHRcdFx0dmFyIGxvY2FsTlNNYXAgPSBjb25maWcubG9jYWxOU01hcDtcclxuXHRcdFx0XHJcblx0ICAgICAgICBpZihjb25maWcudGFnTmFtZSAhPSB0YWdOYW1lKXtcclxuXHQgICAgICAgICAgICBlcnJvckhhbmRsZXIuZmF0YWxFcnJvcihcImVuZCB0YWcgbmFtZTogXCIrdGFnTmFtZSsnIGlzIG5vdCBtYXRjaCB0aGUgY3VycmVudCBzdGFydCB0YWdOYW1lOicrY29uZmlnLnRhZ05hbWUgKTtcclxuXHQgICAgICAgIH1cclxuXHRcdFx0ZG9tQnVpbGRlci5lbmRFbGVtZW50KGNvbmZpZy51cmksY29uZmlnLmxvY2FsTmFtZSx0YWdOYW1lKTtcclxuXHRcdFx0aWYobG9jYWxOU01hcCl7XHJcblx0XHRcdFx0Zm9yKHZhciBwcmVmaXggaW4gbG9jYWxOU01hcCl7XHJcblx0XHRcdFx0XHRkb21CdWlsZGVyLmVuZFByZWZpeE1hcHBpbmcocHJlZml4KSA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVuZCsrO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Ly8gZW5kIGVsbWVudFxyXG5cdFx0Y2FzZSAnPyc6Ly8gPD8uLi4/PlxyXG5cdFx0XHRsb2NhdG9yJiZwb3NpdGlvbihpKTtcclxuXHRcdFx0ZW5kID0gcGFyc2VJbnN0cnVjdGlvbihzb3VyY2UsaSxkb21CdWlsZGVyKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICchJzovLyA8IWRvY3R5cGUsPCFbQ0RBVEEsPCEtLVxyXG5cdFx0XHRsb2NhdG9yJiZwb3NpdGlvbihpKTtcclxuXHRcdFx0ZW5kID0gcGFyc2VEQ0Moc291cmNlLGksZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHRyeXtcclxuXHRcdFx0XHRsb2NhdG9yJiZwb3NpdGlvbihpKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgZWwgPSBuZXcgRWxlbWVudEF0dHJpYnV0ZXMoKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL2VsU3RhcnRFbmRcclxuXHRcdFx0XHR2YXIgZW5kID0gcGFyc2VFbGVtZW50U3RhcnRQYXJ0KHNvdXJjZSxpLGVsLGVudGl0eVJlcGxhY2VyLGVycm9ySGFuZGxlcik7XHJcblx0XHRcdFx0dmFyIGxlbiA9IGVsLmxlbmd0aDtcclxuXHRcdFx0XHQvL3Bvc2l0aW9uIGZpeGVkXHJcblx0XHRcdFx0aWYobGVuICYmIGxvY2F0b3Ipe1xyXG5cdFx0XHRcdFx0dmFyIGJhY2t1cCA9IGNvcHlMb2NhdG9yKGxvY2F0b3Ise30pO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgYSA9IGVsW2ldO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbihhLm9mZnNldCk7XHJcblx0XHRcdFx0XHRcdGEub2Zmc2V0ID0gY29weUxvY2F0b3IobG9jYXRvcix7fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb3B5TG9jYXRvcihiYWNrdXAsbG9jYXRvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFlbC5jbG9zZWQgJiYgZml4U2VsZkNsb3NlZChzb3VyY2UsZW5kLGVsLnRhZ05hbWUsY2xvc2VNYXApKXtcclxuXHRcdFx0XHRcdGVsLmNsb3NlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpZighZW50aXR5TWFwLm5ic3Ape1xyXG5cdFx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygndW5jbG9zZWQgeG1sIGF0dHJpYnV0ZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIscGFyc2VTdGFjayk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoZWwudXJpID09PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgJiYgIWVsLmNsb3NlZCl7XHJcblx0XHRcdFx0XHRlbmQgPSBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsZW5kLGVsLnRhZ05hbWUsZW50aXR5UmVwbGFjZXIsZG9tQnVpbGRlcilcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGVuZCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWNhdGNoKGUpe1xyXG5cdFx0XHRcdGVycm9ySGFuZGxlci5lcnJvcignZWxlbWVudCBwYXJzZSBlcnJvcjogJytlKTtcclxuXHRcdFx0XHRlbmQgPSAtMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHRcdGlmKGVuZDwwKXtcclxuXHRcdFx0Ly9UT0RPOiDov5nph4zmnInlj6/og71zYXjlm57pgIDvvIzmnInkvY3nva7plJnor6/po47pmalcclxuXHRcdFx0YXBwZW5kVGV4dChpKzEpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBjb3B5TG9jYXRvcihmLHQpe1xyXG5cdHQubGluZU51bWJlciA9IGYubGluZU51bWJlcjtcclxuXHR0LmNvbHVtbk51bWJlciA9IGYuY29sdW1uTnVtYmVyO1xyXG5cdHJldHVybiB0O1xyXG5cdFxyXG59XHJcblxyXG4vKipcclxuICogQHNlZSAjYXBwZW5kRWxlbWVudChzb3VyY2UsZWxTdGFydEVuZCxlbCxzZWxmQ2xvc2VkLGVudGl0eVJlcGxhY2VyLGRvbUJ1aWxkZXIscGFyc2VTdGFjayk7XHJcbiAqIEByZXR1cm4gZW5kIG9mIHRoZSBlbGVtZW50U3RhcnRQYXJ0KGVuZCBvZiBlbGVtZW50RW5kUGFydCBmb3Igc2VsZkNsb3NlZCBlbClcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlRWxlbWVudFN0YXJ0UGFydChzb3VyY2Usc3RhcnQsZWwsZW50aXR5UmVwbGFjZXIsZXJyb3JIYW5kbGVyKXtcclxuXHR2YXIgYXR0ck5hbWU7XHJcblx0dmFyIHZhbHVlO1xyXG5cdHZhciBwID0gKytzdGFydDtcclxuXHR2YXIgcyA9IFNfVEFHOy8vc3RhdHVzXHJcblx0d2hpbGUodHJ1ZSl7XHJcblx0XHR2YXIgYyA9IHNvdXJjZS5jaGFyQXQocCk7XHJcblx0XHRzd2l0Y2goYyl7XHJcblx0XHRjYXNlICc9JzpcclxuXHRcdFx0aWYocyA9PT0gU19BVFRSKXsvL2F0dHJOYW1lXHJcblx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscCk7XHJcblx0XHRcdFx0cyA9IFNfRVE7XHJcblx0XHRcdH1lbHNlIGlmKHMgPT09IFNfQVRUUl9TKXtcclxuXHRcdFx0XHRzID0gU19FUTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly9mYXRhbEVycm9yOiBlcXVhbCBtdXN0IGFmdGVyIGF0dHJOYW1lIG9yIHNwYWNlIGFmdGVyIGF0dHJOYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdhdHRyaWJ1dGUgZXF1YWwgbXVzdCBhZnRlciBhdHRyTmFtZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnXFwnJzpcclxuXHRcdGNhc2UgJ1wiJzpcclxuXHRcdFx0aWYocyA9PT0gU19FUSl7Ly9lcXVhbFxyXG5cdFx0XHRcdHN0YXJ0ID0gcCsxO1xyXG5cdFx0XHRcdHAgPSBzb3VyY2UuaW5kZXhPZihjLHN0YXJ0KVxyXG5cdFx0XHRcdGlmKHA+MCl7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHRcdGVsLmFkZChhdHRyTmFtZSx2YWx1ZSxzdGFydC0xKTtcclxuXHRcdFx0XHRcdHMgPSBTX0U7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvL2ZhdGFsRXJyb3I6IG5vIGVuZCBxdW90IG1hdGNoXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBubyBlbmQgXFwnJytjKydcXCcgbWF0Y2gnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmKHMgPT0gU19WKXtcclxuXHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLGVudGl0eVJlcGxhY2VyKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJOYW1lLHZhbHVlLHN0YXJ0LHApXHJcblx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLHZhbHVlLHN0YXJ0KTtcclxuXHRcdFx0XHQvL2NvbnNvbGUuZGlyKGVsKVxyXG5cdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInK2F0dHJOYW1lKydcIiBtaXNzZWQgc3RhcnQgcXVvdCgnK2MrJykhIScpO1xyXG5cdFx0XHRcdHN0YXJ0ID0gcCsxO1xyXG5cdFx0XHRcdHMgPSBTX0VcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly9mYXRhbEVycm9yOiBubyBlcXVhbCBiZWZvcmVcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtdXN0IGFmdGVyIFwiPVwiJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICcvJzpcclxuXHRcdFx0c3dpdGNoKHMpe1xyXG5cdFx0XHRjYXNlIFNfVEFHOlxyXG5cdFx0XHRcdGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LHApKTtcclxuXHRcdFx0Y2FzZSBTX0U6XHJcblx0XHRcdGNhc2UgU19TOlxyXG5cdFx0XHRjYXNlIFNfQzpcclxuXHRcdFx0XHRzID0gU19DO1xyXG5cdFx0XHRcdGVsLmNsb3NlZCA9IHRydWU7XHJcblx0XHRcdGNhc2UgU19WOlxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0Y2FzZSBTX0FUVFJfUzpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Ly9jYXNlIFNfRVE6XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXR0cmlidXRlIGludmFsaWQgY2xvc2UgY2hhcignLycpXCIpXHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICcnOi8vZW5kIGRvY3VtZW50XHJcblx0XHRcdC8vdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcpXHJcblx0XHRcdGVycm9ySGFuZGxlci5lcnJvcigndW5leHBlY3RlZCBlbmQgb2YgaW5wdXQnKTtcclxuXHRcdGNhc2UgJz4nOlxyXG5cdFx0XHRzd2l0Y2gocyl7XHJcblx0XHRcdGNhc2UgU19UQUc6XHJcblx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpO1xyXG5cdFx0XHRjYXNlIFNfRTpcclxuXHRcdFx0Y2FzZSBTX1M6XHJcblx0XHRcdGNhc2UgU19DOlxyXG5cdFx0XHRcdGJyZWFrOy8vbm9ybWFsXHJcblx0XHRcdGNhc2UgU19WOi8vQ29tcGF0aWJsZSBzdGF0ZVxyXG5cdFx0XHRjYXNlIFNfQVRUUjpcclxuXHRcdFx0XHR2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCxwKTtcclxuXHRcdFx0XHRpZih2YWx1ZS5zbGljZSgtMSkgPT09ICcvJyl7XHJcblx0XHRcdFx0XHRlbC5jbG9zZWQgID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMCwtMSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdGNhc2UgU19BVFRSX1M6XHJcblx0XHRcdFx0aWYocyA9PT0gU19BVFRSX1Mpe1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBhdHRyTmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYocyA9PSBTX1Ype1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUucmVwbGFjZSgvJiM/XFx3KzsvZyxlbnRpdHlSZXBsYWNlciksc3RhcnQpXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyt2YWx1ZSsnXCIgbWlzc2VkIHZhbHVlISEgXCInK3ZhbHVlKydcIiBpbnN0ZWFkISEnKVxyXG5cdFx0XHRcdFx0ZWwuYWRkKHZhbHVlLHZhbHVlLHN0YXJ0KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBTX0VROlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG1pc3NlZCEhJyk7XHJcblx0XHRcdH1cclxuLy9cdFx0XHRjb25zb2xlLmxvZyh0YWdOYW1lLHRhZ05hbWVQYXR0ZXJuLHRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpXHJcblx0XHRcdHJldHVybiBwO1xyXG5cdFx0Lyp4bWwgc3BhY2UgJ1xceDIwJyB8ICN4OSB8ICN4RCB8ICN4QTsgKi9cclxuXHRcdGNhc2UgJ1xcdTAwODAnOlxyXG5cdFx0XHRjID0gJyAnO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0aWYoYzw9ICcgJyl7Ly9zcGFjZVxyXG5cdFx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0XHRjYXNlIFNfVEFHOlxyXG5cdFx0XHRcdFx0ZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQscCkpOy8vdGFnTmFtZVxyXG5cdFx0XHRcdFx0cyA9IFNfUztcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSOlxyXG5cdFx0XHRcdFx0YXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQscClcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFJfUztcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19WOlxyXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LHApLnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicrdmFsdWUrJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XHJcblx0XHRcdFx0XHRlbC5hZGQoYXR0ck5hbWUsdmFsdWUsc3RhcnQpXHJcblx0XHRcdFx0Y2FzZSBTX0U6XHJcblx0XHRcdFx0XHRzID0gU19TO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Ly9jYXNlIFNfUzpcclxuXHRcdFx0XHQvL2Nhc2UgU19FUTpcclxuXHRcdFx0XHQvL2Nhc2UgU19BVFRSX1M6XHJcblx0XHRcdFx0Ly9cdHZvaWQoKTticmVhaztcclxuXHRcdFx0XHQvL2Nhc2UgU19DOlxyXG5cdFx0XHRcdFx0Ly9pZ25vcmUgd2FybmluZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7Ly9ub3Qgc3BhY2VcclxuLy9TX1RBRyxcdFNfQVRUUixcdFNfRVEsXHRTX1ZcclxuLy9TX0FUVFJfUyxcdFNfRSxcdFNfUyxcdFNfQ1xyXG5cdFx0XHRcdHN3aXRjaChzKXtcclxuXHRcdFx0XHQvL2Nhc2UgU19UQUc6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX0FUVFI6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdC8vY2FzZSBTX1Y6dm9pZCgpO2JyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19BVFRSX1M6XHJcblx0XHRcdFx0XHRlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJythdHRyTmFtZSsnXCIgbWlzc2VkIHZhbHVlISEgXCInK2F0dHJOYW1lKydcIiBpbnN0ZWFkISEnKVxyXG5cdFx0XHRcdFx0ZWwuYWRkKGF0dHJOYW1lLGF0dHJOYW1lLHN0YXJ0KTtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdHMgPSBTX0FUVFI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfRTpcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgc3BhY2UgaXMgcmVxdWlyZWRcIicrYXR0ck5hbWUrJ1wiISEnKVxyXG5cdFx0XHRcdGNhc2UgU19TOlxyXG5cdFx0XHRcdFx0cyA9IFNfQVRUUjtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gcDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU19FUTpcclxuXHRcdFx0XHRcdHMgPSBTX1Y7XHJcblx0XHRcdFx0XHRzdGFydCA9IHA7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFNfQzpcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVsZW1lbnRzIGNsb3NlZCBjaGFyYWN0ZXIgJy8nIGFuZCAnPicgbXVzdCBiZSBjb25uZWN0ZWQgdG9cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRwKys7XHJcblx0fVxyXG59XHJcbi8qKlxyXG4gKiBAcmV0dXJuIGVuZCBvZiB0aGUgZWxlbWVudFN0YXJ0UGFydChlbmQgb2YgZWxlbWVudEVuZFBhcnQgZm9yIHNlbGZDbG9zZWQgZWwpXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50KGVsLGRvbUJ1aWxkZXIscGFyc2VTdGFjayl7XHJcblx0dmFyIHRhZ05hbWUgPSBlbC50YWdOYW1lO1xyXG5cdHZhciBsb2NhbE5TTWFwID0gbnVsbDtcclxuXHR2YXIgY3VycmVudE5TTWFwID0gcGFyc2VTdGFja1twYXJzZVN0YWNrLmxlbmd0aC0xXS5jdXJyZW50TlNNYXA7XHJcblx0dmFyIGkgPSBlbC5sZW5ndGg7XHJcblx0d2hpbGUoaS0tKXtcclxuXHRcdHZhciBhID0gZWxbaV07XHJcblx0XHR2YXIgcU5hbWUgPSBhLnFOYW1lO1xyXG5cdFx0dmFyIHZhbHVlID0gYS52YWx1ZTtcclxuXHRcdHZhciBuc3AgPSBxTmFtZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRpZihuc3A+MCl7XHJcblx0XHRcdHZhciBwcmVmaXggPSBhLnByZWZpeCA9IHFOYW1lLnNsaWNlKDAsbnNwKTtcclxuXHRcdFx0dmFyIGxvY2FsTmFtZSA9IHFOYW1lLnNsaWNlKG5zcCsxKTtcclxuXHRcdFx0dmFyIG5zUHJlZml4ID0gcHJlZml4ID09PSAneG1sbnMnICYmIGxvY2FsTmFtZVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxvY2FsTmFtZSA9IHFOYW1lO1xyXG5cdFx0XHRwcmVmaXggPSBudWxsXHJcblx0XHRcdG5zUHJlZml4ID0gcU5hbWUgPT09ICd4bWxucycgJiYgJydcclxuXHRcdH1cclxuXHRcdC8vY2FuIG5vdCBzZXQgcHJlZml4LGJlY2F1c2UgcHJlZml4ICE9PSAnJ1xyXG5cdFx0YS5sb2NhbE5hbWUgPSBsb2NhbE5hbWUgO1xyXG5cdFx0Ly9wcmVmaXggPT0gbnVsbCBmb3Igbm8gbnMgcHJlZml4IGF0dHJpYnV0ZSBcclxuXHRcdGlmKG5zUHJlZml4ICE9PSBmYWxzZSl7Ly9oYWNrISFcclxuXHRcdFx0aWYobG9jYWxOU01hcCA9PSBudWxsKXtcclxuXHRcdFx0XHRsb2NhbE5TTWFwID0ge31cclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGN1cnJlbnROU01hcCwwKVxyXG5cdFx0XHRcdF9jb3B5KGN1cnJlbnROU01hcCxjdXJyZW50TlNNYXA9e30pXHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjdXJyZW50TlNNYXAsMSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjdXJyZW50TlNNYXBbbnNQcmVmaXhdID0gbG9jYWxOU01hcFtuc1ByZWZpeF0gPSB2YWx1ZTtcclxuXHRcdFx0YS51cmkgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnRQcmVmaXhNYXBwaW5nKG5zUHJlZml4LCB2YWx1ZSkgXHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBpID0gZWwubGVuZ3RoO1xyXG5cdHdoaWxlKGktLSl7XHJcblx0XHRhID0gZWxbaV07XHJcblx0XHR2YXIgcHJlZml4ID0gYS5wcmVmaXg7XHJcblx0XHRpZihwcmVmaXgpey8vbm8gcHJlZml4IGF0dHJpYnV0ZSBoYXMgbm8gbmFtZXNwYWNlXHJcblx0XHRcdGlmKHByZWZpeCA9PT0gJ3htbCcpe1xyXG5cdFx0XHRcdGEudXJpID0gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcblx0XHRcdH1pZihwcmVmaXggIT09ICd4bWxucycpe1xyXG5cdFx0XHRcdGEudXJpID0gY3VycmVudE5TTWFwW3ByZWZpeF1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3tjb25zb2xlLmxvZygnIyMjJythLnFOYW1lLGRvbUJ1aWxkZXIubG9jYXRvci5zeXN0ZW1JZCsnJyxjdXJyZW50TlNNYXAsYS51cmkpfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBuc3AgPSB0YWdOYW1lLmluZGV4T2YoJzonKTtcclxuXHRpZihuc3A+MCl7XHJcblx0XHRwcmVmaXggPSBlbC5wcmVmaXggPSB0YWdOYW1lLnNsaWNlKDAsbnNwKTtcclxuXHRcdGxvY2FsTmFtZSA9IGVsLmxvY2FsTmFtZSA9IHRhZ05hbWUuc2xpY2UobnNwKzEpO1xyXG5cdH1lbHNle1xyXG5cdFx0cHJlZml4ID0gbnVsbDsvL2ltcG9ydGFudCEhXHJcblx0XHRsb2NhbE5hbWUgPSBlbC5sb2NhbE5hbWUgPSB0YWdOYW1lO1xyXG5cdH1cclxuXHQvL25vIHByZWZpeCBlbGVtZW50IGhhcyBkZWZhdWx0IG5hbWVzcGFjZVxyXG5cdHZhciBucyA9IGVsLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddO1xyXG5cdGRvbUJ1aWxkZXIuc3RhcnRFbGVtZW50KG5zLGxvY2FsTmFtZSx0YWdOYW1lLGVsKTtcclxuXHQvL2VuZFByZWZpeE1hcHBpbmcgYW5kIHN0YXJ0UHJlZml4TWFwcGluZyBoYXZlIG5vdCBhbnkgaGVscCBmb3IgZG9tIGJ1aWxkZXJcclxuXHQvL2xvY2FsTlNNYXAgPSBudWxsXHJcblx0aWYoZWwuY2xvc2VkKXtcclxuXHRcdGRvbUJ1aWxkZXIuZW5kRWxlbWVudChucyxsb2NhbE5hbWUsdGFnTmFtZSk7XHJcblx0XHRpZihsb2NhbE5TTWFwKXtcclxuXHRcdFx0Zm9yKHByZWZpeCBpbiBsb2NhbE5TTWFwKXtcclxuXHRcdFx0XHRkb21CdWlsZGVyLmVuZFByZWZpeE1hcHBpbmcocHJlZml4KSBcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1lbHNle1xyXG5cdFx0ZWwuY3VycmVudE5TTWFwID0gY3VycmVudE5TTWFwO1xyXG5cdFx0ZWwubG9jYWxOU01hcCA9IGxvY2FsTlNNYXA7XHJcblx0XHRwYXJzZVN0YWNrLnB1c2goZWwpO1xyXG5cdH1cclxufVxyXG5mdW5jdGlvbiBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsZWxTdGFydEVuZCx0YWdOYW1lLGVudGl0eVJlcGxhY2VyLGRvbUJ1aWxkZXIpe1xyXG5cdGlmKC9eKD86c2NyaXB0fHRleHRhcmVhKSQvaS50ZXN0KHRhZ05hbWUpKXtcclxuXHRcdHZhciBlbEVuZFN0YXJ0ID0gIHNvdXJjZS5pbmRleE9mKCc8LycrdGFnTmFtZSsnPicsZWxTdGFydEVuZCk7XHJcblx0XHR2YXIgdGV4dCA9IHNvdXJjZS5zdWJzdHJpbmcoZWxTdGFydEVuZCsxLGVsRW5kU3RhcnQpO1xyXG5cdFx0aWYoL1smPF0vLnRlc3QodGV4dCkpe1xyXG5cdFx0XHRpZigvXnNjcmlwdCQvaS50ZXN0KHRhZ05hbWUpKXtcclxuXHRcdFx0XHQvL2lmKCEvXFxdXFxdPi8udGVzdCh0ZXh0KSl7XHJcblx0XHRcdFx0XHQvL2xleEhhbmRsZXIuc3RhcnRDREFUQSgpO1xyXG5cdFx0XHRcdFx0ZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHRleHQsMCx0ZXh0Lmxlbmd0aCk7XHJcblx0XHRcdFx0XHQvL2xleEhhbmRsZXIuZW5kQ0RBVEEoKTtcclxuXHRcdFx0XHRcdHJldHVybiBlbEVuZFN0YXJ0O1xyXG5cdFx0XHRcdC8vfVxyXG5cdFx0XHR9Ly99ZWxzZXsvL3RleHQgYXJlYVxyXG5cdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoLyYjP1xcdys7L2csZW50aXR5UmVwbGFjZXIpO1xyXG5cdFx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh0ZXh0LDAsdGV4dC5sZW5ndGgpO1xyXG5cdFx0XHRcdHJldHVybiBlbEVuZFN0YXJ0O1xyXG5cdFx0XHQvL31cclxuXHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBlbFN0YXJ0RW5kKzE7XHJcbn1cclxuZnVuY3Rpb24gZml4U2VsZkNsb3NlZChzb3VyY2UsZWxTdGFydEVuZCx0YWdOYW1lLGNsb3NlTWFwKXtcclxuXHQvL2lmKHRhZ05hbWUgaW4gY2xvc2VNYXApe1xyXG5cdHZhciBwb3MgPSBjbG9zZU1hcFt0YWdOYW1lXTtcclxuXHRpZihwb3MgPT0gbnVsbCl7XHJcblx0XHQvL2NvbnNvbGUubG9nKHRhZ05hbWUpXHJcblx0XHRwb3MgPSBjbG9zZU1hcFt0YWdOYW1lXSA9IHNvdXJjZS5sYXN0SW5kZXhPZignPC8nK3RhZ05hbWUrJz4nKVxyXG5cdH1cclxuXHRyZXR1cm4gcG9zPGVsU3RhcnRFbmQ7XHJcblx0Ly99IFxyXG59XHJcbmZ1bmN0aW9uIF9jb3B5KHNvdXJjZSx0YXJnZXQpe1xyXG5cdGZvcih2YXIgbiBpbiBzb3VyY2Upe3RhcmdldFtuXSA9IHNvdXJjZVtuXX1cclxufVxyXG5mdW5jdGlvbiBwYXJzZURDQyhzb3VyY2Usc3RhcnQsZG9tQnVpbGRlcixlcnJvckhhbmRsZXIpey8vc3VyZSBzdGFydCB3aXRoICc8ISdcclxuXHR2YXIgbmV4dD0gc291cmNlLmNoYXJBdChzdGFydCsyKVxyXG5cdHN3aXRjaChuZXh0KXtcclxuXHRjYXNlICctJzpcclxuXHRcdGlmKHNvdXJjZS5jaGFyQXQoc3RhcnQgKyAzKSA9PT0gJy0nKXtcclxuXHRcdFx0dmFyIGVuZCA9IHNvdXJjZS5pbmRleE9mKCctLT4nLHN0YXJ0KzQpO1xyXG5cdFx0XHQvL2FwcGVuZCBjb21tZW50IHNvdXJjZS5zdWJzdHJpbmcoNCxlbmQpLy88IS0tXHJcblx0XHRcdGlmKGVuZD5zdGFydCl7XHJcblx0XHRcdFx0ZG9tQnVpbGRlci5jb21tZW50KHNvdXJjZSxzdGFydCs0LGVuZC1zdGFydC00KTtcclxuXHRcdFx0XHRyZXR1cm4gZW5kKzM7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGVycm9ySGFuZGxlci5lcnJvcihcIlVuY2xvc2VkIGNvbW1lbnRcIik7XHJcblx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9lcnJvclxyXG5cdFx0XHRyZXR1cm4gLTE7XHJcblx0XHR9XHJcblx0ZGVmYXVsdDpcclxuXHRcdGlmKHNvdXJjZS5zdWJzdHIoc3RhcnQrMyw2KSA9PSAnQ0RBVEFbJyl7XHJcblx0XHRcdHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignXV0+JyxzdGFydCs5KTtcclxuXHRcdFx0ZG9tQnVpbGRlci5zdGFydENEQVRBKCk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuY2hhcmFjdGVycyhzb3VyY2Usc3RhcnQrOSxlbmQtc3RhcnQtOSk7XHJcblx0XHRcdGRvbUJ1aWxkZXIuZW5kQ0RBVEEoKSBcclxuXHRcdFx0cmV0dXJuIGVuZCszO1xyXG5cdFx0fVxyXG5cdFx0Ly88IURPQ1RZUEVcclxuXHRcdC8vc3RhcnREVEQoamF2YS5sYW5nLlN0cmluZyBuYW1lLCBqYXZhLmxhbmcuU3RyaW5nIHB1YmxpY0lkLCBqYXZhLmxhbmcuU3RyaW5nIHN5c3RlbUlkKSBcclxuXHRcdHZhciBtYXRjaHMgPSBzcGxpdChzb3VyY2Usc3RhcnQpO1xyXG5cdFx0dmFyIGxlbiA9IG1hdGNocy5sZW5ndGg7XHJcblx0XHRpZihsZW4+MSAmJiAvIWRvY3R5cGUvaS50ZXN0KG1hdGNoc1swXVswXSkpe1xyXG5cdFx0XHR2YXIgbmFtZSA9IG1hdGNoc1sxXVswXTtcclxuXHRcdFx0dmFyIHB1YmlkID0gbGVuPjMgJiYgL15wdWJsaWMkL2kudGVzdChtYXRjaHNbMl1bMF0pICYmIG1hdGNoc1szXVswXVxyXG5cdFx0XHR2YXIgc3lzaWQgPSBsZW4+NCAmJiBtYXRjaHNbNF1bMF07XHJcblx0XHRcdHZhciBsYXN0TWF0Y2ggPSBtYXRjaHNbbGVuLTFdXHJcblx0XHRcdGRvbUJ1aWxkZXIuc3RhcnREVEQobmFtZSxwdWJpZCAmJiBwdWJpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJyksXHJcblx0XHRcdFx0XHRzeXNpZCAmJiBzeXNpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sJyQyJykpO1xyXG5cdFx0XHRkb21CdWlsZGVyLmVuZERURCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGxhc3RNYXRjaC5pbmRleCtsYXN0TWF0Y2hbMF0ubGVuZ3RoXHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAtMTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwYXJzZUluc3RydWN0aW9uKHNvdXJjZSxzdGFydCxkb21CdWlsZGVyKXtcclxuXHR2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJz8+JyxzdGFydCk7XHJcblx0aWYoZW5kKXtcclxuXHRcdHZhciBtYXRjaCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsZW5kKS5tYXRjaCgvXjxcXD8oXFxTKilcXHMqKFtcXHNcXFNdKj8pXFxzKiQvKTtcclxuXHRcdGlmKG1hdGNoKXtcclxuXHRcdFx0dmFyIGxlbiA9IG1hdGNoWzBdLmxlbmd0aDtcclxuXHRcdFx0ZG9tQnVpbGRlci5wcm9jZXNzaW5nSW5zdHJ1Y3Rpb24obWF0Y2hbMV0sIG1hdGNoWzJdKSA7XHJcblx0XHRcdHJldHVybiBlbmQrMjtcclxuXHRcdH1lbHNley8vZXJyb3JcclxuXHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gLTE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gc291cmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBFbGVtZW50QXR0cmlidXRlcyhzb3VyY2Upe1xyXG5cdFxyXG59XHJcbkVsZW1lbnRBdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcclxuXHRzZXRUYWdOYW1lOmZ1bmN0aW9uKHRhZ05hbWUpe1xyXG5cdFx0aWYoIXRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdGFnTmFtZTonK3RhZ05hbWUpXHJcblx0XHR9XHJcblx0XHR0aGlzLnRhZ05hbWUgPSB0YWdOYW1lXHJcblx0fSxcclxuXHRhZGQ6ZnVuY3Rpb24ocU5hbWUsdmFsdWUsb2Zmc2V0KXtcclxuXHRcdGlmKCF0YWdOYW1lUGF0dGVybi50ZXN0KHFOYW1lKSl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhdHRyaWJ1dGU6JytxTmFtZSlcclxuXHRcdH1cclxuXHRcdHRoaXNbdGhpcy5sZW5ndGgrK10gPSB7cU5hbWU6cU5hbWUsdmFsdWU6dmFsdWUsb2Zmc2V0Om9mZnNldH1cclxuXHR9LFxyXG5cdGxlbmd0aDowLFxyXG5cdGdldExvY2FsTmFtZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5sb2NhbE5hbWV9LFxyXG5cdGdldE9mZnNldDpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS5vZmZzZXR9LFxyXG5cdGdldFFOYW1lOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzW2ldLnFOYW1lfSxcclxuXHRnZXRVUkk6ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXNbaV0udXJpfSxcclxuXHRnZXRWYWx1ZTpmdW5jdGlvbihpKXtyZXR1cm4gdGhpc1tpXS52YWx1ZX1cclxuLy9cdCxnZXRJbmRleDpmdW5jdGlvbih1cmksIGxvY2FsTmFtZSkpe1xyXG4vL1x0XHRpZihsb2NhbE5hbWUpe1xyXG4vL1x0XHRcdFxyXG4vL1x0XHR9ZWxzZXtcclxuLy9cdFx0XHR2YXIgcU5hbWUgPSB1cmlcclxuLy9cdFx0fVxyXG4vL1x0fSxcclxuLy9cdGdldFZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5nZXRJbmRleC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSxcclxuLy9cdGdldFR5cGU6ZnVuY3Rpb24odXJpLGxvY2FsTmFtZSl7fVxyXG4vL1x0Z2V0VHlwZTpmdW5jdGlvbihpKXt9LFxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBfc2V0X3Byb3RvXyh0aGl6LHBhcmVudCl7XHJcblx0dGhpei5fX3Byb3RvX18gPSBwYXJlbnQ7XHJcblx0cmV0dXJuIHRoaXo7XHJcbn1cclxuaWYoIShfc2V0X3Byb3RvXyh7fSxfc2V0X3Byb3RvXy5wcm90b3R5cGUpIGluc3RhbmNlb2YgX3NldF9wcm90b18pKXtcclxuXHRfc2V0X3Byb3RvXyA9IGZ1bmN0aW9uKHRoaXoscGFyZW50KXtcclxuXHRcdGZ1bmN0aW9uIHAoKXt9O1xyXG5cdFx0cC5wcm90b3R5cGUgPSBwYXJlbnQ7XHJcblx0XHRwID0gbmV3IHAoKTtcclxuXHRcdGZvcihwYXJlbnQgaW4gdGhpeil7XHJcblx0XHRcdHBbcGFyZW50XSA9IHRoaXpbcGFyZW50XTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BsaXQoc291cmNlLHN0YXJ0KXtcclxuXHR2YXIgbWF0Y2g7XHJcblx0dmFyIGJ1ZiA9IFtdO1xyXG5cdHZhciByZWcgPSAvJ1teJ10rJ3xcIlteXCJdK1wifFteXFxzPD5cXC89XSs9P3woXFwvP1xccyo+fDwpL2c7XHJcblx0cmVnLmxhc3RJbmRleCA9IHN0YXJ0O1xyXG5cdHJlZy5leGVjKHNvdXJjZSk7Ly9za2lwIDxcclxuXHR3aGlsZShtYXRjaCA9IHJlZy5leGVjKHNvdXJjZSkpe1xyXG5cdFx0YnVmLnB1c2gobWF0Y2gpO1xyXG5cdFx0aWYobWF0Y2hbMV0pcmV0dXJuIGJ1ZjtcclxuXHR9XHJcbn1cclxuXHJcbmlmKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpe1xyXG5cdGV4cG9ydHMuWE1MUmVhZGVyID0gWE1MUmVhZGVyO1xyXG59XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHN0eWxlPlxcbiAgICAqOmZvY3VzIHtcXG4gICAgICAgIG91dGxpbmU6IDA7XFxuICAgIH1cXG5cXG4gICAgI3BsYXllcntcXG4gICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xcbiAgICAgICAgdmlzaWJpbGl0eTpoaWRkZW47XFxuICAgIH1cXG5cXG4gICAgdmlkZW97XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xcbiAgICB9XFxuXFxuICAgIHZpZGVvOjotd2Via2l0LW1lZGlhLWNvbnRyb2xzLXBhbmVse1xcbiAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O1xcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG4gICAgfVxcblxcbiAgICB2aWRlbzo6LXdlYmtpdC1mdWxsLXBhZ2UtbWVkaWE6Oi13ZWJraXQtbWVkaWEtY29udHJvbHMtcGFuZWx7XFxuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7XFxuICAgICAgICAgICAgZGlzcGxheTpub25lO1xcbiAgICB9XFxuXFxuXFxuICAgIHZpZGVvOjotd2Via2l0LW1lZGlhLWNvbnRyb2xzLXRpbWVsaW5lLFxcbiAgICAvKnZpZGVvOjotd2Via2l0LW1lZGlhLWNvbnRyb2xzLXBsYXktYnV0dG9uLCovXFxuICAgIHZpZGVvOjotd2Via2l0LW1lZGlhLWNvbnRyb2xzLXZvbHVtZS1zbGlkZXItY29udGFpbmVyLFxcbiAgICB2aWRlbzo6LXdlYmtpdC1tZWRpYS1jb250cm9scy12b2x1bWUtc2xpZGVyLFxcbiAgICB2aWRlbzo6LXdlYmtpdC1tZWRpYS1jb250cm9scy10aW1lLXJlbWFpbmluZy1kaXNwbGF5LFxcbiAgICB2aWRlbzo6LXdlYmtpdC1tZWRpYS1jb250cm9scy10aW1lbGluZS1jb250YWluZXIsXFxuICAgIHZpZGVvOjotd2Via2l0LW1lZGlhLWNvbnRyb2xzLWN1cnJlbnQtdGltZS1kaXNwbGF5IHtcXG4gICAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTpub25lO1xcbiAgICAgICAgdmlzaWJpbGl0eTpoaWRkZW47XFxuICAgIH1cXG5cXG5cXG4gICAgI3RpbWVyQ29udGFpbmVye1xcbiAgICAgICAgcG9zaXRpb246YWJzb2x1dGU7XFxuICAgICAgICBsZWZ0OjVweDtcXG4gICAgICAgIGJvdHRvbTo1cHg7XFxuICAgIH1cXG5cXG4gICAgI3RpbWVye1xcbiAgICAgICAgZGlzcGxheTpub25lO1xcbiAgICB9XFxuXFxuICAgICN0aW1lckNvbnRhaW5lciBjYW52YXN7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM2NDhiO1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMThweDtcXG4gICAgICAgIGJvcmRlcjogMnB4IHNvbGlkICMzMzY0OGI7IFxcbiAgICB9XFxuXFxuICAgICN0aW1lckNvbnRhaW5lciBpbnB1dHtcXG4gICAgICAgIGZvbnQtc2l6ZTogOXB4ICFpbXBvcnRhbnQ7XFxuICAgICAgICBoZWlnaHQ6IDEycHggIWltcG9ydGFudDtcXG4gICAgICAgIHdpZHRoOiAxM3B4ICFpbXBvcnRhbnQ7XFxuICAgIH1cXG5cXG5cXG4gICAgdmlkZW86Oi13ZWJraXQtbWVkaWEtY29udHJvbHMtZnVsbHNjcmVlbi1idXR0b257XFxuICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtcXG4gICAgICAgIGhlaWdodDoyNHB4O1xcbiAgICAgICAgd2lkdGg6MjRweDtcXG4gICAgICAgIGJhY2tncm91bmQtc2l6ZTogNzUlIGF1dG87XFxuLyogICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDQUFBQUFnQ0FZQUFBQnplbnIwQUFBQ1FFbEVRVlJZUisyWDNYSGFRQkRIZC9YeFRnZTJLNGlNQ29oZFFYQUZnWUFMOEFPYVNRV1pFUTh1d0JBckZaaFVZRklBb0ZSZ3B3TzlTN3IxWE14NTRIVEhyU0F2bVRHUGFHLzNkM3U3dC8vRGVKU3VBVEFDMTQ5b3Zwd2xWeTR6K1QwZXBnK0EySFBiVW83eGFFSnVRd0FDK3JXYUpoY2MyKzRvWFNEZ1I0NHRDNEFJZm9zNnVNaXptNExqTk9yZmRqeS9XaURDQjVlOUU2QnRjQldRQzdFWGdBZ0tVUWRuM0ozcnU5MUFQQ0ZDeDVZSlJnWW9XODJTZ1N1VnB1L2RZWHFQaVAxOWE1MEFjakZSZXdoT2NPbTdBVUFFZnhEaFJLZHVBMkVMYnZLOUE2QUt6dlBLSG5wNGZ3aUVOYmlnZ1JEaFhPK09Od0M5MnJ0ZjByNEpva1k2eisrUzNIU3UwWFVhK1lUckJyaWd3ZXA3a3NuLzllNlFBSE1DNm9ncTdPblYzb0FnK0xHY2pmY1dWVHljWklEd1dVSFFWdkNkRmczS09RSVc2S3J1TndoR2NPVkxRWmlDNi9HY0FIL1RkcDFHdHJUYk5zQmR3d0p3WmVtWTcrOEE3eG40UHpJUTliK2Q1dG5YNXpiVi9zL2FVTjN0aHd3anpocmNDTWhPWFFWWGphdFltK2NjaC9vd01xMlI4OEFQcWdjZ0tyYW1JZVYxRlY0cUNOdFVxNnZxekhZYzhxajhJSGphTjBWZmc1ZVBTb2xyZXVBVnd2UExXNU9TNGR6dHRpa3FNeUhxOEdZN3VFMlFGQ1lOeHdtdWRtNkhnSVp2bmlRempGUlhSOWdnR3RQUTlUQnBzM1BkT1FmQ0ljdnBXZFRoK1hHeXZGd2o0dW5Cc2h4Z3R6dGNxZDlXUFhyQm1kYXlhcUF0aE41cVI3OExOZzRXeStuNGtwT0JlRFI1QkFEV1F4YTd3MG5PZVVRQ3dNL2xkTXg0Y2dOSW9Rc0FuMXl3VW9tL0FDNGJqQU16Tk9XRUFBQUFBRWxGVGtTdVFtQ0MnKTsqL1xcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFCajBsRVFWUklTKzFXMjFIRFFBemNyWUIwUUtnZ29RSkNCMUJCU0FVa2xRQVZFQ29BS2lDcGdMZ0NLQUVxV0dabjdqTDIrYzdIYTRZZjlKWFlHcTIwa2xhbXBCMkFDYnJtWjI4QTdraXVrM2VkdjVJdUFNd0JqQUJNRTk4TkpXa2d3QTNKWlFYZ0dzQmx5V2NJd05rN3U2cEpjcFd1b21kREFJc2FQVEZhb09uMnF3RDJQeVc1cVZCazNwK0hLTW8xT2ZxNzBRYXhUODhralVOd056aG5qU2x5aGllZUdBRCtuWmI2Q3VDWXBNSFNDY29sdHdBd0N6M1pHc0NObk1acGtlU1NEWFFRb3IwREdLY0FrcHkxd2R0K3MxaXRKRS9YamdPbFB6Z3dnR1dwMlNFNUIzSjFaemtxc3dEVnVXdzVoRXFRbzlCdVB3YW9KZk1QVUdPbzNJTmE4MW95TVNvMXVOamtzQXYzUVlKWGxURzlDdnR3VHRKNzBiRzRhQk9TSzcrUjVDMk13ZjNJTTM1VVdMU1hrRVQwMjh2S2Z0RmFVbUhKM1dha29pR1pIaEluNGsyMlZCd21TZmVrWWtqc0xCT1drVjdwb2RwVVZsS0dkcldMWnBITEttbXJ5YWIwcVRST2YzcHcxaVROWjlXK2V6SWQrRmVPZmp3NDdVeWJNSjZ1NGpPZkxiNHBucXIwOCtmeEExSXAyaS9jRWlUWEFBQUFBRWxGVGtTdVFtQ0MnKTsgXFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM2NDhiO1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcXG4gICAgICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICAgICAgICBib3JkZXItcmFkaXVzOjVweDtcXG4gICAgICAgIGJvcmRlcjoxcHggc29saWQgI2ZmZjtcXG4gICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xcbiAgICAgICAgdG9wOjVweDtcXG4gICAgICAgIHJpZ2h0OjVweFxcbiAgICB9XFxuXFxuICAgI2Nsb3Nle1xcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTp1cmwoXFxcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUJ2MGxFUVZSSVM4MldRVmJDUUJCRXE4SUIxSk1JZUFEeEJoNEJCZGV5MEd6VmJWZ0lhMFh3QnQ2QWNBQXcza1FPUU1vMzBlQWttUkI0Nm51eWduUlR2N3RucGlaRXhhZmU3YmM4NEpoQXkwNFZFSW9LWHgvODJTWUpsZ1diNTBFYjVEMkovVTBDRXQ0Sjl1YWpxMmRYWGdGUXZ3anFOV0VNc0Y3VlhUYXVhRVdjUlE5K1pEL1BBSXk0RjNOYVZYVVoySFFUZXpxeElXdkFUOFZUYUI2eUJqUTcvWWpFNFc1aktlMGxtai82RFJOTkFHWkI2WEZjVE5kU3dvVGtwVXRLMHBCRUcrQmVQcTVZWjRzbmY1SUFqcnJCZXpGSnl4WFJNdk4wRlpBS2ZHMktNUDkvTTZyRjZQcUFacC9YZ0dtaEFtbTRHUG05OUxrTlNjWFhzVTR3Y0hXNW9ocHNkdnUzQkc2Y0kvaHEwNGFZNzZaMUY3aFFKSERIWmpjSUNSNlhMbGNPWXVlVnI5MW5scUJaSlNCSmRFQ3F4UDhQd0ZYOU52TzNPdmpqUmY3emJWcDIwR3hQcVRwb2JvUFVjdjdvNzIrMENnTUJZWTc3K3NEWjIxVEFBRUxiNWI0WnEwajg2QmZOVHNMYlluU2QzQ2NadTY0SkJVL1ozVjIvUFN3RE1EL0tqR3Q3U0ZhOEFFZ2hYc3pKcm5lREdVdnNxYjN4eWl6NkRBWXVyODkycEtWaTlHd0R0T09sYnhWcFVuS1ZpcWVBTXE4dEFNT1llc2xYbkIvbkIrVUxPWWlBcnVPR0FBQUFBRWxGVGtTdVFtQ0NcXFwiKTtcXG4gICAgICAgIGJhY2tncm91bmQtc2l6ZTogMTAwJSBhdXRvO1xcbiAgICAgICAgaGVpZ2h0OjE4cHg7XFxuICAgICAgICB3aWR0aDoxOHB4O1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czo5cHg7XFxuICAgICAgICBib3JkZXI6MXB4IHNvbGlkICNmZmY7XFxuICAgICAgICBwb3NpdGlvbjphYnNvbHV0ZTtcXG4gICAgICAgIHJpZ2h0OjVweDtcXG4gICAgICAgIHRvcDo1cHg7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgICAgICAgei1pbmRleDoxMDA7XFxuICAgfSBcXG5cXG48L3N0eWxlPlxcbjxkaXYgaWQ9XFxcInBsYXllclxcXCIgZGF0YS1ocmVmPVxcXCJ7e3tjbGlja1VSTH19fVxcXCI+XFxuXFxuICAgIHt7I3NraXB9fVxcbiAgICA8ZGl2IGlkPVxcXCJjbG9zZVxcXCI+PC9kaXY+XFxuICAgIHt7L3NraXB9fVxcblxcbiAgICA8e3t0YWd9fSBzcmM9XFxcInt7e3NyY319fVxcXCIgXFxuICAgICAgICB7eyNhdXRvcGxheX19YXV0b3BsYXl7ey9hdXRvcGxheX19XFxuICAgICAgICBwcmVsb2FkXFxuICAgICAgICBjb250cm9sc1xcbiAgICAgICAgd2Via2l0LXBsYXlzaW5saW5lIFxcbiAgICAgICAgd2lkdGggPSBcXFwie3t3aWR0aH19XFxcIiBcXG4gICAgICAgIGhlaWdodCA9IFxcXCJ7e2hlaWdodH19XFxcIlxcbiAgICAgICAge3sjcG9zdGVyfX1wb3N0ZXI9XFxcInt7e3VybH19fVxcXCJ7ey9wb3N0ZXJ9fVxcbiAgICAgICAgPlxcbiAgICA8L3t7dGFnfX0+XFxuICAgIDxzcGFuIGlkPVxcXCJ0aW1lckNvbnRhaW5lclxcXCI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcInRpbWVyXFxcIj5cXG4gICAgPC9zcGFuPlxcbjwvZGl2PlxcblxcbjwhLS0gU1RBUlQgaW1wcmVzc2lvbiBwaXhlbHMgLS0+XFxue3sjaW1wcmVzc2lvbnN9fVxcbjxzY3JpcHQgc3JjPVxcXCJ7e3sufX19XFxcIj48L3NjcmlwdD5cXG57ey9pbXByZXNzaW9uc319XFxuPCEtLSBFTkQgaW1wcmVzc2lvbiBwaXhlbHMgLS0+XFxuXFxuPCEtLSBTVEFSVCBjcmVhdGl2ZSB2aWV3IFRyYWNraW5nIFVSTHMgLS0+XFxue3sjdHJhY2tpbmcuY3JlYXRpdmVWaWV3fX1cXG48c2NyaXB0IHNyYz1cXFwie3t7Ln19fVxcXCI+PC9zY3JpcHQ+XFxue3svdHJhY2tpbmcuY3JlYXRpdmVWaWV3fX1cXG48IS0tIEVORCBjcmVhdGl2ZSB2aWV3IFRyYWNraW5nIFVSTHMgLS0+XFxuXFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFVQUFBQUhnQ0FZQUFBRFVqTFJFQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFMRndBQUN4Y0IvMmNiQ2dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFDQUFTVVJCVkhpYzdOMTNmQnoxbmYveDE4eHNMOXBkcmJwVzFhcTIzT1Jld0RaZ213NmhoQUJwaFBRalBaZDI2Ym03WEM2LzVGSXVKTGswQ0FrRUVoSWc5R0pNczhHNGQwdTJKVm05UzZ2dGJYNS9yRmhaVHFQYnluNmVqNGNlMHF4bmQ3KzdsdDQ3ODVudmZFWUJkSVFRSWd1cHAzc0FRZ2h4dWtnQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnU2dFQ0pyU1FBS0liS1dCS0FRSW10SkFBb2hzcFlFb0JBaWEwa0FDaUd5bGdTZ0VDSnJTUUFLSWJLV0JLQVFJbXRKQUFvaHNwWUVvQkFpYTBrQUNpR3lsZ1NnRUNKclNRQUtJYktXQktBUUltdEpBQW9oc3BZRW9CQWlhMGtBQ2lHeWxnVGdER2JWakZnMDQra2VoaEF6bGdMb3Azc1FRZ2h4T3NnV29CQWlhMGtBQ2lHeWxnVGdESlpqdEpKanNKenVZUWd4WTBrQXptQjJ6WVRWWURyZHd4Qml4cEtESUVLSXJDVmJnRUtJckNVQk9JT1pWUU5tMVhDNmh5SEVqQ1VCT0lPdHlhL2pyTHk2MHowTUlXWXNxUUVLSWJLV2JBRUtJYktXQktBUUltdEpBTTVnYnl0YnpOVyt4ZE51eXpVNVR0Tm9oSmg1cEFZNGc3MTBCRGlhU3B6bWtRZ3hNMGtBQ2lHeWx1d0NDeUd5bGdUZ0RMYXhjRGJyQzJkbmxvMnFSck83K2pTT1NJaVpSVTRqbU1IYVE4UG9KeFV3RXFrVTdhR0IwemNnSVdZWXFRRUtJYktXN0FJTEliS1dCT0FNMXV3cFo0RzdMTE5zVkRXcTdZV25jVVJDekN3U2dEUFlMSHMrcyt3Rm1XV3JacUxHVVhRYVJ5VEV6Q0kxUUNGRTFwSXRRQ0ZFMXBJQW5NR0tMRGtVV25LbTNXYVNCcWxDdkd3U2dET0lxaWpUbHQ5WGZSWTNWcDZWV2ZaWmMvbklyQXZmN0dFSk1XTkpEWEFHMDVUMDUxZFNUNTNta1FneE0wa0FDaUd5bHV3Q3oyQUdSY1dneUgraEVLK1cvUFhNSU5lVXpjZW1HVFBML3pIM2NyNCs1L0xNY3IyemhLL092dVowREUySUdVbDJnV2NRVlZGSW5kVDlvREduaUpRT1J5YjZnSFJOTU0va3BEODZmcnFHS01TTUlnRW9oTWhhc2dzc2hNaGFFb0F6aEtvby9Hamg1YXp5Vm1adSszekQrWHltL3Z6TThpeEhJUitzM25BYVJpZkV6Q1NuRGN3UUtWMm5MVGpDYUR5Y3VhMDdQRWJ5cEFKR01CR2xLenh5R2tZbnhNd2tOVUFoUk5hU1hXQWhSTmFTQUp3aE5FWGx5N1BQWTBudVZBUFVhMDY1TUhxK09ZZHpDK2FkanVFSk1TTkpBTTRRVG9PSjh3dnJXT2d1emR5MkxyK09kZmtObWVVS1d4N3JDK1pQdTU5UjFkNjBNUW94MDBnTmNBWXhxd2FpcVVSbSthWHVNQ2RQamhaQ3ZId1NnRUtJckNXN3dET0UzV0RpMDNWbnM4SmJrYm50M0lLR2FidkFOczFNbmFQa2RBeFBpQmxKQXZBTWRuSUQxQ1dlVXQ1UjBjd0hxMWRrYnZ0aTQ0VjhvZUdpelBLRnhRdjU0WUwzb2pCMXYzUHlGN3c1Z3hWaUJwSmQ0Qm5DcEdwY1g3NlFiU05kSFBDbm14ODBlOHBKNlRxN3h6b0JNQ2dhdVNZSEE5SU1RWWlYUlFKUUNKRzFaQmQ0aGpDcUdtOHBuVU90SXk5elc2WGRTNFhOTzIwOXMybzg5YTVDaUw5QkF2QU1kbEZ4VGVibkM0dnErT3JzOWZ6M3ZJdUJkSDN3dHFVM2NPdVNHek0xdit2S1YzSC9xaTlnVUtibS9yMjNTaTZTOUZvcHAxeU15bUEwbjZhUmlOZWJORU00Z3ozY2R6eno4OTd4UGxvQ1F6dzVrTDR0cGV2OHZtc25xUlRvazFXTVo0ZU9FRTRrU09qSnpQM3U3Tno4cG83NW41Rit5anpMUkR4Nm1rWWlYbTlTQXhSQ1pDM1pCWjRoRkdDUnA1UThrejF6bTFVell0R2s1aWZFcXlVQmVJWTZLOS9Icyt2ZXdTSlBNUUJ2TFp2TEx4ZGZ6VzNMcmtVQkxKcVJlMVoraUQrdStCZE1hcnFTY1duSlluNjErS1pwb1hoVjZkblQ1Z1dLVjY1bTNycHB5M2xsRFdnRzAya2FqWGc5U1Ezd0RKVklwWWlrRWlRbUwzcWUrWjVLZjAvcE9nazlSZktrK2xROGxTQ2FqRTg3TnppYWlyK0pvLzduZEdyTkw1Vk0vRVZkVU14TVVnT2NRWnBjUlhTR3hoaVBSd0F5MXdSK0tSeUZFSytNQk9BTTRqRlptWWhISmZDRWVKMUlEZkFNOVpiU1dqYXR1WTROaGRVQVhGclN5Sk5yUHNEdHk2NUhWUlNzbXBGYmw3eWJYeTYrSVRQNStmeWkrWHl6NmUwNERKYk00eXpOYlpBYTRHdGdNdHVadS9JS0RLYXA5OVRoS1VLVlBvdi9GQ1FBejFETHZNVVVXdXdzemsxM2Q1bnJLa1FCYWh4NTJEVVR1U1k3YzF3bE5PV1U0akhaQURnN2J6WnI4K2RRYVBZQVlGS04zRkN4RWFzMk13djJxbkw2ZnoxemNvdHBXbkU1RGxkKzVyYkt1V2RqemZIK25YdUptVUoyZ2M5UXVTWUxhL01yZUt5L25ZbEVsSHl6blJzcUY3TjdySmRIKzFzQVdPbXRKcVhEOHlQcHlkRTJ6VXl4eGMyeFlQL3BIUG8vSFVWUjBhWHM4RTlKQWxBSWtiVk8vejZHK0t2V0YxWnl5NUtMV1pXWHZnalNDbThaRDYxK0Q5K2NleUdxb21CUVZEN2ZjRDZmcmI4QWJYSlhjWjZybkhkVnJKdDJIUkMzMFhGYXh2L1B3bWkyVWozbnJHbm4vMHI5NzUrSEJPQVo2cjNWYzFtU1c4eTdLOU1YT2JyUzEwU0pOWWNMaWhvb3NiaG96Q25pS2w4elYvc1dVKzlNVDVhK2FkYjVmS2g2STgzdWRCTUZsOUhPQTZ2K2d3S3orN1M5anRmQ2JmT2NsdWM5dWZsQlpjTktWbDF5RStVTnl6TzNyYm51aTNoOTlhZGphT0oxcGdGZlBkMkRFSDhwa0loVFlMSHpxL1k5ZElUR0NTYmpMUGFVOGR4d0IzL3EyY2RJTEVTZTJja2hmeS8zOWV3bWhVNVhlSmkrNkJnUDkrOGlwYWVJcHVMYzE3dVZ3Um5hSURVeU9kL3hkSm9ZNnlNNFBrajc0YTJra3VrTFVuVWUzRUp3Yk9BMGoweThIcVFHS0lUSVdySUxmSVphbFZmS04rZXVwZGxUQkVDZE00L3ZMYmlFOTFZdEE5TDlBSzhyWDhyYnlwWm01dm41ckY3VzVUZE51NWFJZUcwMHpVaHg1VnlwKy8yVGtnQThRMzFyM2hvdUxhbmxHMDNwRS9FL1diZUtkZm16dUtsbUZmWE9BbFo2cS9sVTNYbDh1bTRqeTNMVGs2Vy9NKzhkZkxQcDdaeWJuNjRibGxuemVXRFZmMUJ0TDg0OHJ2WUd6YTE3UGVic2FTZUZqS3FvckcrNjZPK3MvY1lvOGpXeWV1UDdNc3Z6VmwzQmVXLzdJck9YWDVxNWJkM2J2MExScklWdit0akU2MDhDOEF4MTBEOE13R0gvRUFDdEUrbGxmenhDZjJTQ2p0QUlFNGtJL2tTRUUrRVJBTGFOSHFVM01zcXhZQzhBZzdGeGZ0ZjVKSDJSa2N6akp0K2crV3lwMStGeGs2bXBScTRwUGNYMnRxMnYrVEZmcWRIaFRsb1BQSjFaN3U4OHpFaC9Pd05kUnpLM3RXNS9tTEgrOWpkOWJPTDFKelhBTTVSUlZhbXl1emtXR0NPcHAxQ0FCZTRTT2tQakRNV0NBTmcwRXpvNjRhUjBmQkhpMVpBdHdETlV1UzJIVlY0ZnBWWW5rRzZFc0NUWFIwTk9RV2FkT2E0U1p1ZE1YUWpkcXBrb3QrWDl4V09KMThZOCtYOGcvdmxJQUo0aFRLcEtwVDM5aDZZcENyY3V2WkJQMXkvai94YW42MkJmbjNNZS96SnJKVDlZY0RrMWpqeFdlcXY1U2ZOMS9MVDVuU3lkckFIK1l0RUh1V3ZacHprbmZ4NEFKVll2MzV2L1ljcHRVNkZwZVFQT0MvWmEzRlE0Uy83eGluOUhjVTRKODByblo1WTExY0NpeW1XdmRXaXZXUFBLcTdqeXh1OWdzcVE3Yjg5ZGNUbHYvZGpQYVZneWRYR3B4UmUrbjd5eWh0Zjl1WTA1cDJmZVl6YVRBRHhEYUlxQ1BkUEpXY0U0ZVZEQk9IbUZOOVBrQVFKVlVUQ3FHbVoxcXBmdFN6K2J0WmUrcHgvSHBCaHdHeDJaanRIcGRWLy9GdnBHMVlCRmUyMVhTak1aVEZpTTFzeXlxaWpZelBhL2M0ODNoc2xzdzJ4eFpJNzZHb3lXeWU4dnZUNEZzOVU1clR0TXVwTDAybys4SndJemM3N21UQ1kxd0RQVVBIYys2d3VxdWIvM0tFY21oaW14T3JtK3ZKa0QvZ0VlN0QyRUFweGIySWl1d3hNRGh3RHdHTzJVV3Izczk1ODR2WVAvSjZJb0NrNVBNZjZSWHVSUDVaK1BuQWx5QnRFVUpmTW5sa2pwNk9pMEJrYUlwcEpFVTBrMFJhRTFNTVRZNUJrUzBWU0N3VmlBaWNUVXNqOFJrb2FwcjdOb2VPSjBEMEc4UVNRQXp3Q2FvbkRuaXZWOG9YRVJ1MGFIR1k1RnVHLzFXN2phTjV0ekMyZnh1ODREL1BlODgvbndySlZjV1RxZlRZUEhtTzBzNHBZbDcrWWEzekwyamZmUUZ4bm5sMHMreENkcUxxTTlORWhic0o4eVd6NmZxTG1TanZBQVkvRUFBQTZEbFlTZWZGMjNaWXBzZVJUYThoaDlEYWZjWFRyM2N0YlVuY1BlN2oyazlDU2FhcUNtb0k2UjRORHJPTkovYk8yRi84TFN0VytucC9NZ2tkQTRqWXN2NEp5clAwYzBHbVNrcncxUW1MUDZTaEx4S0pIQTZPdjJ2S3JCaERtdmlFUlF3dmJOSkRYQU00REhaR2ErMjR0Vk03QTB0NUI4czVYQ3lTSjhoYzJGeTJCbWppdDlJTU9vYXRRNThtbHlsYUFxQ3BxaU10ZmxJOGRncGNGWmdxYW9MSjVzaHJESVhjZUd3c1VzODB3VjdDOHFXa2IrNjl3Y1lVM0pZaTZ2UG0vYWJZdUw1cjJpeDFnOWF6VUx5NXJKdGVjQ2tPOHM0SnJsNzN4VG02SXFpa0psM1ZLYzdnSUtTOVBORG55em1qRmJuWlRXTkFOZ3RqbVljOVpWbE0xWmxibWZNOCtITTkvM3lwNUwxZUNrTTNZMHF3MWJjZVZyZnhIaUZkUGw2L1IvWGUycjFyODhlN0h1TVpsMVFQL2k3Qlg2TSt2ZW9YK3NkcGtPNkplV05PcWIxM3hBLyttaXEzU3JadFR6elE3OTV1WnI5Ujh1dUU3UE16dDFRTCtpZEtuK3BjYXI5U0tMUndkMFRWSDFabmV0YmxDMDAvNzYvdEZYcWR1bnp5bHVPdjNqcUp5bnoxOTJtYTRaVERxZ3UvSjhldlBhNjNTbnB5aXpqc05kcUt2cW1mK2V5dGMvL3BLRElHY29vNnJpcytad0l1VFBUSVN1dE9jeUVBMFFUTVNBOUVSb2dGQXlodE5nNFYwVmF5aXllSG1vYnhmUERSODZqYU1YWW1hUUd1QVp3R1UwY2VlSzgvaHM0eUpPQkFOMGg0UGN0ZkpTYnFwWndzcThDdTdyT2NKWDU1ekxWMmF2NTByZmZEWVBIcVBKVmNKdmxyMkhkMVNzNHRCRUh6ZlZiT1RpNGtWVTI0czVyNkNaYmFPdEdGU05kMVZzcERjNmdqOGVmTVBHWDJqelVtRDFNaGIxWjI1VEZSWDlGWHkyYm13OG42VlZ5MmtkT0VJeWxVUlZWQXBjUlFTamdUZGl5SCtWb3Fpc3ZlakRMRngxRmNQOTdZUUNJOHlhdTRZVkYzeUFXRHpNK0dBbmlxcFJ1MmdEcVdTU1NIRHNWVCtYd1dKRFVUWDB5UlpiS0FxcXlUSzFMTjRVVWdNOEE2ektLMlIyamdlYlp1QzY4bnJtdXZLb2RhUW54YzV6RlZEbjhISkpjYnFPNXpKYVdKdGZ3eVhGY3pHcEJzeXFnWXVLNTdQVU15dnplS3Fpc01SVHkvVmw1M0J0MlRyZVdUNVZuL3YzT1RjdzN6V0wxNkxlVllIcHBQbUVINTM3RHY1enhTY3lYV2txYzN4ODc1eXZ2dXpIeTdHNGVNdjhLem03Wmkxekp5ZERMeWhmekJjdStYYzg5cW1MRDluTXIzOTM2NU9ibjNvTEtxaHBYRTF1ZmptTnpSdlQ0MWg5TmQ3aVdjeGRkU1VBUlpWTk5HKzhrWVViMzVPNVgrV2k5VlF1V3YrS25yZjA3TXNwV0hKdVp0bGVVazNaSlRlOGxwY2lYZ1haQWp3RCtCTnhMaW1weEdvd2NrdjdZWjRiN3VHeTBocHNtcG51Y0pDYmoyMm55VlZJbWRWRFBKWGk1bU5ibUVoRVdWTlFqNDdLclIxYktEUzdLTEM0U1grbXFmem14R2IyanJmaE5qbjRmZGZUREViVFd5dlBqeHlpTy96YWpxd09SOGVuTlZYb0R3K3hmZUFBM1pNWFl4cVBUdkI4NzA0aWllakxlcnhZSW9iTDZpSVlDL0w0NFVlSkpXS01CSWRvR3p4RzUzQjdacjE0TXZhYXh2MFB4eEVOVVZMUmhNbHNaOWVXUCtBZjdjTm9zdUFwcU9EdzlvY1o2bTRoRWhoRE01aHAzN3Vad0dnZkFPTjk3WXozdFlQKzhyZDR4NC90STlEWm1sbU9UNHd5Zm1qNzYvMlN4RDhnTmNBemhFWFRjQmlNREVYVGMvbzhKZ3Z6WEFYc0dPMGprSWhoVkRXVzU1YlRIaHlsTTV3T3N5cTdGMTJIOXRBd3hSWTNYNTE5TmZtbVhPN3JlWkZiVG13Nm5TOW5ocE0vaTJ3aFc0Qm5BSWZCeUxmbkwrZWRsUTJjQ0FYcENRZjV6M2xuOGY2cWhSUmJjOWc4Mk1HN0t4ZnkrWVp6V0pSYnhsTkR4MW5rS2VkN0M5N0twU1hOdEFZR09LK2dpUTFGQzNBYWJOUTRmVHcyc0ljY2c0M0xTMVl4SFBNemtRaTlZZVAzV3R4NHpEbE12SVk2NCtMeUpjd3VidUxFU0FjcFBZV0Nnc1BpSkpaNFk3ZjZUcVlvQ2t2T2VodXptemN5TXRSSkpPU25wR28rODFaZlJTd1NKRGcrQ0NnVVZjOG5tWWlSaUwzNmx2MmUrbVpNcmx5aW80T3Yzd3NRcjVnRTRCbmcydkpadkx1eUFhL1p5anhYUHAyaElCK3RYWVJCTVZEdnpHZlhXRDlmbjNNZVJ0VkF2dGxKT0pua2F0OGlTcXdlektxSlNuc0JLNzMxR0ZRRG9HTFd6SXpFQTF6alc4ZWxKU3RwY0paemY5L3pBSHkrL2xwQ3lTaTlKL1VJNUJWMmtQN0I4bi9GWnJSeWFLd05CWVdmclBrcWwxV2Z5K05kV3dnbm9pd3VuTWUvcmZ3b216dTNFay85OWFMK0o4NzZLQjZibTZORHh5aDFsZktKY3o1RlkzRVQvcWlmanVFMnptbmN5SWZPL1NRdC9ZY1lEYWJIMmxTeGlNSHh2bGMwVnVVZnZMWUxMdjBrcFdWejZEaStrN0txQmF4YWZ5TXVid25PM0dLT0hYaVdpOTc5bitTVjFGSlVQWjlEMis2bnZIRUZxOS82R1FxcTUzTnN4Nk1BVkN3OEYzZEpOZU85YlM5clRDYUhtK2FQZlpmODVqVjBiYjRiZEIxUDAzSXFydndndzl0bHkvM05aUGpIcTRnM1dtOGtOTzNuZ1dnb3N3T1cwblg2d2dIOGlRZ3VRL29nUUg5a2d2N29CTFhPZEx2OGdZZ2Z0eUVIaXpaMWd2NVlMRWhIcUo5Rm5qbzZRbE1YU3Q4eWNwQ3U4Q2xiSGErZ2RnWHdiUDl1am94M3BPK0t6cUhSWTNpdEhvTHhNQUE5Z1g2MmR1LzR1elhBWFQxNzZQV25HN2Y2bzM1Q3NSQVdrNDNCaWZURmhycEdUOURTZDRqUjRIRG1QdTBEcmEvb3lITDZwZjM5OVUrMDdTWWFTNDg3T0RHY3ZnQzZvaElZR3dCMEF1TURlQ3hWazhzUUdPMG5IZ2t5Mm5zODh4aGp2Y2RlMFpqaUlUOTkyeDRqSGcyaUo5Tk5ZUDFIOXhJZGxRc3R2ZG1rMkhHR3VMQzRuQXFia3pzN2p6RVNpM0JCY1JWbjVWWHdhRjhibXdjN21KMVR3TFZsQ3pnYUdPRzJFenZ3bXV4OHBHWWRLVjNoaDBjM1VlTW80aHR6cmlISDRPU3BvVU44OGNCdlNPblE2Q3puY09BRWlaTzZMWitKN0dZSEZvT0Y0VGY1MUxkVDVSVldrZU1wcHIxMUc2bGtBcFBaVHI2dm5vSE9ROFFuZzFMODg1QnBNS2VCcWloY1dGekMyb0pDQU93R0EwdHk4MW5veWFmYW5vT3FLRFE0dmN5eXUybklTVGM0clhmbTBaaFRRSk9yaUJ5RGhYZFVMT1dpNHJsY1ZEeWY2OHBYRUV4RWlDUVRwUFFVL25pWUFyT0hPNVorbnA4MmY1emZMZjNpdEo2QXIxV2RxNEk4eTlUcGROVTVaVFI1YXpQTFJmWjhWcFV1d1h4UzcwSERTUzI1TEFZekcrdldzN3hpR1FvS3FxS3l1SHd4SzZ0WFl6ZWxUd0U4dS80Y2JqanJRelNXdnJKVDZsNEpUVFBRTkg4OURYUFdvaWdxaXFKUTVHdWcwRmVQM1ptZWZ1UE9MNk9vZkRhdXZOTEpleW5rbFRWZ2NieTIwd21kdmxwc1JSV3Y4UldJMTBwcWdLZkJPeW9xK1BiOGhWeFdXc2FoaVFuT0wvSnhZMVVqRmZZYzF1V1gweFVPOG9YRzVSU1lIU3pOOWRFZUd1Y2JjOWJqTlRtb2R1U1JaM1p5WldrejZRMTRsZm51Q2hwenlpaTM1YUdnVWVmMFVXRXZvc0ZaQVNnNERWWmNSanViQi9md2lkb3JTZWhKZWlMcFhVdFZVVjdScE9XTnBjdjVldk9IMkZpMmtvZTd0dUN6Ri9JL3F6N0x1V1VyNlFrTjBCY2E0dnZydnNKWlpjc29kT1R6UXM4dWxwUXM1RC9QL1NJR3pjakJ3Y084ZmNHMVhOUjRJYzIrWnJyOXZjekttOFYxaTk5T2JXRTlIb2VYVUR6TXUxZC9nQ0ozQ2ZNcUZyR2xaVFB4Wkl5bHRXY3pFaGdrOFRJdkFXQzFPRm05NUFvNmV3K25kMjBCVmRVeXU4VkxscjJGbFdkZlIrV3NSUVNEWTdpOXBhemU4Rjd5aTJkUjRLdW5vMlViRjkvd1h4U1V6Nlo4OWtwYWRqeEMvZEtMV0hINVI2bVl0NGFqMng5R1R5V3BXSGdPcnVJcXh2dW1hb0NLcXY3TjBvS2pwSXFGSC9sL0ZDN2J3TUNPSjBsR1F1UXRXa2ZacFRjeXZITnpaajNOWWtOUHlPVU8za2l5QmZncUdOWFgxdnpTYlpxYVJPd3ltbkFhcHJhVWJBYkR0R1VBajlFNjdWS1hPVVlMcDdLZjBwRFVwcDZ5ckpsUkZZVTZoNDlDODFUbllaTnF4S2I5NWVQOUxUbkdkQjNTckprd2F5WWNSbHZtUUlQVDVNQ29HalBOVVoybTlMb2Vpd3RWVWZGYTA4LzcwbGJlU3ovYlRMYXBjWnJzMkV4VGpWRTF6WUJ4OHYwb3lTM0gvRmRlKzk5aU5sa3B6S3RBTzNucjg2UW1xMmJMMU04V3EzM2Fzc2xpUnpPYVVTZWJ5eG9NSmxTREVZc3RKNzFzdHFFYTB2L204SmJnOEU3dmlHMHcyL2hia3JFb3FXU2NWRHhLYXZJb2R5STRUblM0ZDFwb3BtSXZieDZsZVBWa0MvQlZTTDNHcXVsK2Y3cHQxRk9EZy95Mm80MGpFK1BNZDN2UlZKWC9PclNUQi9yYW1PUEtvOFNhdzZhQkUveFB5L000akdibTVCVFJGZkh6MVlPUFVHN3o0ck42QUpVdHc4ZjRiZWRXenNwclJGVTBEdmk3K0hIYmc1eVR2eENEYWlDYWl2T2Qxai9RR3huaGdiNFhhQTEwWjhhUzBKUEVVaTkvSzZQVmY0S2h5Q2ozbk5qTWNYOFgvZUZoK3NNakhCaHA1ZUdPWjRna294d2Q2MkEwNnVmT3czOG1GQTl6ZkxTRFhYMzdlS3JqT1ZKNmlyYlJkcHhtSndmNkQvTG9rY2M0TVhvQ2g5bUpQekxPM1R2djR2amdVZHkyWEN4R0M0L3ZmNUREUGZzQk9OeTlsMGo4NWRmaEl0RWdCMXFlSTNuU2tlajRTUWRtQnZ2Yk1GdnM5UGEwc0hQYnZRejF0MkYzNWhLUFIzbCswNjJNRG5RUUNZNmhHVXpzMjNJM1E5MHRESFVmSVJvYzQvRFdld21NVEY1OTcvaGVCby92bmZiY3FiOHpmU2NSbXFEL3hjZnBlZmJQeElQcDB3Y2pRNzJNSFh4eCtvcXY4T0NVZU9Va0FFOERGWVVTbTVXeFdKd2pFMzZDeVFSR1ZhVTNIT0xSL2s1R1lsRVNlb3FKZUl4SCt0czRIaHhGMTNWc0JoUGJSN3Q0ZXZBNDdhRVI2aDJGRE1hQy9PRG9KdmFPZFpCanRCSkt4YmlsNDBrT2pKK2d5bDZFMitSazUyZ0w5L1J1SWZZM3BxUzhFcnF1WXpXWUdZcU1NUkVQVWU0bzV1S0tOWlE1U3hpSWpKRFNkZDdXY0FtTmViWFlqRmIyRFI2bXlGSEF2S0k1cFBRVXcrRlJZc2s0cXFyUk5kNUZmMkNBNHB4aUZsY3N3V0YyTWhnY0lCZ05zTEJpTVRsV054UFJDVnA2RHdFNnhaNHlZb25vdE10bnZoS2FacUM4YkE2cFZKSllMRXdxbGNCZ01ERSsxcy93WUNlcFZJSmtJa1l3TUVKUCszNlN5VGlxWmtSVk5RYTdqeEFPakdJd21uSG1sUklMQndpTnYvbzVmSnJaaXA1S2tZcS9lZk1jeFYvSytxUEFSazNCWWxDWWlLWnJSRmFqeWdxZmxVMXRVNU42NStaYk9Ed2NKVDY1NmVjMHFrU1RPckZYdVNuNC9ZVUx1TFNrREIyVm54NDdSakNaNHFNMTg5QlI2UWxIK01haGJmenZ3ZzNvdWtZS2pVL3Rmb3h2enQySVFUR2hvM0puNXo0MkZNNGh4MmhEMXpWR1loR2VHbXpsMHBJbDZMcEdMS1h6WU45T0xpbGV4VXZYcXJpNyt4bStmL1NQdktmeWZIYU9IV1hIYUFzQUNncUtvcnpzNi9wK3FPRXFMcXRZUzV3ay8vckM5L2pVL0hkVGFNOURWeFJDeVNoSHh0dHB5bXNncGFSN0RkMTY0RzR1cjc4QW05bE9Tb2V2UGZVdDF0ZWV5OUx5cGVnSy9PckZYM1BSbkl2eE9Mem9pa0tDRklmNkQ5SlFQQmRkZ1pRQzkreTRpeUtQajBVMXF4Z0pEdlBkZTc5SUxCN0ZvQmxJcHBLWm10NnlwZzBVRjFUendOTy9JcDZJVWxFNm04WHp6K2VwNSs5aWFLU0x5eS81RkZXVkM0a21ZdnoyOXMreG9QbENtaFpzSUFWczIvb0h4c2Y3V1h2UlRlZ0s5UGNkNDdtSGZzckZOL3dYYUFZU3FUajMvK3pUckx6aWs3aUxLa2twQ3MvZStVMzZqKzlqNmRXZlJBZGUvTU4zU1NYaVdISzh1TXZyNmR1L0pmTytWYTY5a3Y1OVd3Z1A5K0wwMVREdlE5OGtxU2ZaL1Q4Zkp6TGNSOTdpYzNBMUxxYnRqdTlsdGg0TmRxYzBTSDJEWlYwTk1OK3BjWElKYjJXVmxmY3VuNnFKTFNxeDhKc3J5N0NiMG0rTkF2ejZvbklhdlZNMXRYYzE1SEoyOGRTSitXWk5ZYjU3cW03MTExZzFMZlB6Zk5mVUVjUUY3bHptdXFhZXY5aGlwOWxkbEZsV2dHVmVIMFoxNnY1emNvcHduVlFMODVqc05KNTBlVXlqYXFET1djckpxdTNGRkZvOHZMdGlJMWVWbmowMUZuYzFLM0puLzkyeDErZE1IYTJjNTBrM1d6VW9Hdk84ZFJUWnBwb1ZXQXhteWs5NTNscFBOWTdKbXAraUtGUjVLcW5KbldyR1VKZGZoL2VraGdlcW9sTGludDVjdE5oZFNsMUplb3dlUng1NU9lbjNaLzZzRlpRWFRoMTlYalozSTNOclYxRGdMUU5nVHQxS2Fpb1hVbHU5Q0FCZlNicWhoTkZvcHFDZ2lxTGlrNDVjbDlSU1VGU1RXZllXVnVFdHFrNDNMZ1ZVelVodXlTdzhoVlB2Ulc1cEhYWlBBY1gxU3lpcVg0TGRrejZxWHpKdk5mT3UrQWpxNUVXcVZJT1Jrc1huNFpnODZtdjFGcU1hakdnbUMyWlArdWk4cTJZZTdxYWxhTGFwT3FTamJnSGlqWlYxdThDaDJQVGpuUjBqY1o3dm1Lb3JuUmlQODZOdHc0VGpVMnY5ZFBjdy9hR3AzY2R0QXlHT1QwenR1aVIxNkkvOC9kM0x4RW4xSEtPcXNEcS9nS1FPM3oxeWlQM2pZMndvS2tOUlZKNGI2dVBuYlFlNHJMUUdvMkxBSDQvempZTlBzeWEvR29mQkFpajhySDBiQldZblhyTVRVRG5rNytQQi9yMHN6NjBEVlBxamZ1N3QyY2F5M0VaZTJnTDhmZGRUUEQ5eWlPMmpMVHpjdjQzd1pHT0J2c2dvbmVHL1B3RjMrS1JXOStGa2xNVjVzK2tORC9IenczK2t6RkZFc2IwQUZJWHUwQUE3QnZjenkxMkJyb0N1NlB6MndCOHB0T2Zqc1hrWWkvaTVZOThmQ0NjaXpDbWNUVGdSNFhlNzd5TFA3c1hyeUFkRllTSTJ3YzRUMjZuSXE0YkpyY2hIOXQ1SDUxQWJ2cndxRG5idTR2a2pUd0xRTzN5QzhjRFVST25PL2xZNisxbzRlaUpkaitzZGJHUGNQOENlZzV0SlRyYVo4cFUyMGpmWXh2UFAvNEZFUEVwRjFVS1NxU1F2UFBzNytycVBVTjJ3QXMxZzVORHV4MmpadTRuS3hoVVlMWGI4WTMzc2Z2SzNtS3hPUE1YVlJNSUI5ajUyQ3hORDNVU0Q0L1MzN3FULzZDNEF4anBiNk56K0VEWUFwUUFBSUFCSlJFRlVHSWxvK3ZkS1Q2WG8zUElBb2NFdUFFS0QzU1NqWVVZT3ZNRFF2dlJXNHRpaDdRdzg5K0MwSzhORit1VGlWbSswckF2QWx5UHhPbDlUS005czVLS1NRa3lxUmw4a3lvRnhQMlB4T0kvMTkvS243azVhQTM0R29tSGFRd0crZFhnbjNlRUFoL3lqeFBRa1B6ajZJdnZHQnpnUjhwTnZzdlBzVUFlM3RHL2pnYjREaEJOeHRvMjI4ZDh0RDdGenRKMmU4Q2g5VVQvL2VmajNiQnRwd1dOMFlqTlllR1p3THo5cmV4Q0RxbEptS3lDV1NqRCtLcy9iN1krTTBCY2U1cG0rWFJ6emQ3Rjk0QUI1VmcrRGtSRyt2K2ZYYk9uWlNiRzlBQjE0NE5nVFBOVzVsYmF4RThSU01SNDV0b20yMFE3YVI5dnA4ZmZ3MVBGbk9EcDhsQ09EUi9DNXl3akd3OXkxNDNhZWEzMmEvSndDVkVWalMrdFRQTmZ5NU9RbE1uVzZoanZvR2VsQTEzVk1rMXZCTDAxeG1RaU5NVGphZzY2blVCU0YyVFVyS0Nxb1FsRlZoa2E2Q0FSSENZYkdhRDI2amVIaExvYUh1L0NQRDNDczlYbU90MjRuRkJ4bG9POG9RLzF0N052MloyTFJNTWxFREIwNHR1ZEpCcnRiU1VSRHFBWWpmVWQzMFh0c0Y5YWNYSXBxbXpIYW5BU0dlMGdsRTFTdnVvekNPY3RJUk1PRXg5SjFRb3M3bjFRaWpwNUtnYTRUbXhnbE5OQkpjdklzSUd0QkNkYkNjbUtqQTNMdzQwMDBvMnFBVnJOQ09LcG5mdjdCSi9Kd1dqUSs5djFCaHNhVC9Qd1RoYXh1dFBLTjIwZjQ5U1kvTjU3cjRwTVg1ZkxBOWdDZnVYMlFlV1ZtZm5CZEVYMmpDVzY4dFJkZGg1Kzh0WmdDbTRHYi90akwwYUVZSDFpYXl5VzFUcjcxekJEUG5BZ3l2OERDWjVZVzhNQlJQN2NmSHNPb0tueGlmajc5d1FTM3RxVFBVVjNnc1RMTFllYnV6blNYRm91bXNzQnRaOXZJQkM2amtTZldMQ2JmWWlXbGEzeDAxMzZ1S1N0bmhiY0FIWlUvZG5WelBCams0N1h6MFZIcENJYjRqMFBiK2QvbTlhZ1lpT3NLWDluL0ZGK2JzeDRGQXpvcUQvVzFzR25nS04rWWN4a3BYZU1MKy8rRXJzTi96YjBPQlNNSC9EMDgzTCtUajlkY3hVdGJnUDk3L0Y1VzVjNWhvYnVHbEo3aVN3ZHZZZlBnbm4vNG51ZVpYVnppVzgwVGZUdm9DUTl5OC9MUFV1NHNRVmZndHFNUFV1T3FZSEZoRTdxaTBCbnNZK2ZRWVM2c1drZEtnWlNpODVOZHQvR2VoZGVqYWdaMEZINnkvVmNzTFZ2TTNKSjU2QXI4YnZmdldWYTVIRjl1ZWJxT21JandRc2RXVnRlZWs2a0JQcmpuSGpZc3ZCd2RCVjFSZU9yQXcvU01uT0F0WjcrWFdETEtyUTkvaDBCb25IZGMvRmtjRGc5L2Z2cVhlSElLV2JYa2lzeGpQUEhzYjFpeC9FcE1KaHNwUmVIcFozNURZVWtkcytxV2tRTDI3MzJNb2NFVHJOcndYblFGaGdaUGNQelFjeXhjZXgyNm9wQlM0TUR6OTFDLy9ESlFWVktLUWxmTE50d2xzN0M0OGtnQklmOFFvMzNIS1d4Y2xuNzlLWjJ0Ly9kWml1YWZSZG5xeXdpTjliUDlmejlOYnVOUzZxNytDRWxTSExyMXYwZ2w0OVMvOXl2b21zYm93VzBjL2NXL0EyQ3c1NUNZUEVyc1dibVJncXMrUUtUN0dKMC8raktwYUFUM2VWZWdvelArK0o4a05GK2xNMm9Mc0RoZkl4Q2Erbzk4L05ZaTdub3dTR0x5b045VHZ5ckJhbFI0OFVDVWpjdHRmUG1HWEdwS1RBeU9wb2pGZGY3clBYbllUU3BONVJaKy9PQVlkMzZxaEtJY0E0c3FMZHoyakorUGJmQ3l2dEhPckR3VCs3dWpWT2FhK015NVhrcHpqS1NTOE5UeEVBKzhzNUx5SENNVk9TWnUzei9HdDg4cDVvS3FITmI1SFB6UGppSFcrWng4ZDJVcEcwcWQzTll5U2lDUjRzL256T0w2Q2k4UDkvZ1ppQ1o0YjNVaFAxNWN5LzZ4TUQ2cmhXc3Jpbm1wVDU5Vk0zQldYdjdrc2tLbFBZZDhzdzJ2eVFvb3VJd1dyQVlUc3h6cEtTNnFvdUV5MmlpeHVqTDNLYlY2OEpvY2xObThhSXFHdzJDbDNKYlBMRWNSb0pKdmRtTTFXQ2swNS9KU0FObzFLL05jMVVDNkZtZFFOWjRZMk1YYnl0YXhPcStKN1pNSFJVNzEzbG1YY0UzbGVlUmJQSFFFKzdoKzFnWHBDeWtvNERHN2FIQlhwWnNwS0FwT3M0TmNpd3VyMFRxNWpvTGQ3S0RBbnBkZVJrSFRqTXd2bm91dUtLQ0F5K3JCNXluTHJLOXBCdHhXRDJhak5iTUw3TERtNExEbXBEK3BGUVdiMVVtaHB4UzNNdytEd1VoSzEzSGEzTXlldFF4VjFYRGw1SlByS3NadTkyUWV3MnAxNHBxOHNKU3VLSmdzVm56bGMySHlVcVE1bm1MTXRod2NybnhRd09Kd1k3VFlzVG85NlhVVXNOaGRtR3c1azQrcFlQY1VZclE2TW85aHNOaXc1UmFCcWs2K0hwWEl4Q2pGQzlhaVdXeG9WZ2VqeC9kVHVIQXQxa0lmcUNySldBU1QyNHV6YWphNm9tRDJGdEw3K0Yxb0ZqdXp2MzRMUTV2dlFVOGxLYnZoYzJnNUhneTUrVVM2anFFWWpCUzkvOSt3em00bXVHY3JTZjhvNXRvbVBEZDhrdERXeDZmK0ExOWhvNHRzYzBZZEJPa2RuRDY5NGRwUERCS0pUUVhpUjc0NXpKMlBwbmZkZGh5TzBqV1FZQ3lRWXZQdU1LM2RjVTRNcE9zOGorOU9yL1A0M3ZUdXhaNk9LQVBqU1I0L0VDU1IwaGtLSk5uZUVXSEhpVEFERXdtaUNaMG5XZ01rVWpyM0gvYVQwdUhQTGVsUDN2dGEvUVRqS1g3Zk1vNE83QndJc2JVdnlKL2F4eG1jclB2OTcrRkJmdE0rUWtzZzNSN3B2cDRSdnQvU3c1WmhQNGNuUXBtanh3QTd4OGJwREUwMVB6Z3dQc2FCOGFuTEs0YVRDVjRjbm1wZUFMRDNsQTRvTFJNRDdCcnJ5aXp2SGp2QlFmL1UzTDdSV0lERC9zNXA5ems4Y1lLQjZGUUw5MFArZERPRCszdWY1M2VkbS9sYk5nM3NaTi9ZTVI3dWVaN2U4RENCK05UWVcvMGRkQWFueGhhTWh6bnU3NXAyLzZPajB6dWt0STIwMHgrWXFqa2VHenFHUHpMVlNsL1hkWHJHcHo5RzkrajAxOUkzMGtsYjMxUmdkL1FkNFVSL0M2bko2VEh0WFFjWkdKbCtuOTZCNDlNYUkvVDN0ekV5UExYT1lOOHhodnFueGhvTlR6RGNOMzNzWTRQVGEzSVRnNTBrVDVydmw0ekhtQmpxbnI1T2J6dGQyeDRCWFNmUTI4NTR4Mkg2ZHo2Sm5reVFqRVVZM1BVMEkvdWZ6MHlIR2RuMU5PZzZ5VWlRL1o5N1crYjJ3SkhkNmVjSUI0bTB0eERyNnlTMGZ4dWhmZHVJOTZYZnI5anh3NHplK3IxcHp5OWJobi9mak5vRlBwV3FnS29xSkpMcGwyQ3pxSlRuR3pqU0ZVUFgweDkrVmZsR09vY1R4Q2ZYOFRvMFFyRVU0Y2xnTldrSzVwT213VUQ2SU1YSm9lVTBxUVJpcWN3YlZaVmpJcHhJMFRkNVlHUyt4MHF1eWNDV29RRFJwRTZ0MDBxVHk4YTI0UURkNFNnWEZ1ZHhRMVU1QjhhRC9QdkJGaXJ0ZHY1dDloekNTWjJ2SGRoTE1KSGtzdzBMOEZtZC9QajRRYmFQOVBPaFdRdFluVmZPWS8wZC9MSnROeCtldFl6TFM1cm9DZ2Y0OG9GSDZBNlBzZEk3Q3gzWU9ud2NSWUdMaXhkUlpzM256NzNiR1l6NitkZTZxMmwyMTdGbjdCamZicjJMSWtzdU4xYWVUMGRvZ1A5cmUrQmxUMzA1V1pPN2huZlVYc2hRZEl3Zkhid0xsOG5KOVhVWFl6RlkrUDJ4UitnUERYRkQwOVdVNVpTeXRYY25memo4QUJmVnJtZEYyUkphUjlyNHpkNjc4TnB5dVdMdTVZeEgvUHgrNzkyVXVjdTRxdmthYkNZN2p4eCttUDNkZTdoNnlkdnhlU3ZaMDdtRCszZmR6VVhOVjlOVXRaaitzUjd1ZlBibkJNTVRMSzQvbTBBa3dLR09IZW14MVN6SGsxUElDL3NlUmRNMHpsOXpJeVdGc3pqYXVZY25udjQxamZVcm1UZjNQQVpIdW5seTh5Mll6WFpXblgwOThXU01MVS8vbG5nc3dySzFiOGZoS1dUWGxyc1pIKzVtNVlVZkpNL1hRRi9uQVo1LzRDYzBycnljcWdYbkVQUVBzZTIrLzhXUjUyUHV4bmVqQS9zZVNSOFVtWC9sUjdHNDgramErU1F0ai84V0FNMW9KaGxQVDhKV05BUDVjMWVSVEVZWk9iQU5QWlhDNU03RDdDMW00dmorVEdnWkhLNnBneUtLZ3IxK1B0R2VFeVQ4NmRLTGFyYWtMMjAyMlVSWDBRd29OanVwaWZSOU5HOEJocG81SkRxUGtldzVnV0kwb1RYTVF3K01rMnhMZDZOV1BIbGdNcVAzZDJlZUI0c1Z3bTljLzhnenlXbHJoK1YxcTJpYXdzQndNck5jWDIxazY2NG91ZzRPdThyNXE2MDgrVUtZNGJFVVJvUENXemZhT2RvUjU0WDk2VitrdDUzbklNZW04WXNIL01RVE9xdG5XMWc5eDhyUEhocW5jeWpCNmdZcjcxbm41dEhkUWU3WTRtZGhoWVd2WFpiSDRIaVNUOTAxZ05PaThxT3JpL0JhREh6dXovM3M3WTN5bTZ0OUxDcXljdnZ1Y1Q3N2VDKzNYRnpHQlpVNXRJM0V1T0srZGo2MW9JRHJhendrRXpwZjNOWkhnZG5BeCtzTElLbXdielRDemExRGZMKzVHazNSQ0NiZ3BwMUgrZGE4T3R3bUMwdHp2WFNHbzZ6TkwyQjFYcm9HR0VxazJETTJ4dFcrYWhSRkk4ZG80VHN0dTdpeGFpNW0xVXlWM2N1QjhVRXVMcW1uME9Ja3o1ekRDbThsancrMHNLRm9OaWxkNGNCa1c2bnpDcHFvc0JYVEVScGkvL2dKbHVjMjRqSTZXSnJiUUsyamxDODN2b09DeVdzQzY3ck92YjFiK0V6ZE5SaFZqZSswL0o3MlVEOUdWY05yY3RFMzJTL3dBeldYY2w3eFVsNGNQc3lQVy8vRUo1dXVvOFJlZ0s3QVNDekEzY2NmUTFNMURLcUJZRHlFV1ROUjQ2NGszNTVIZWJDRUNuY1pWelJjaU1sb3dlZnljWFMwblhXejFsRGxyVUpYSUpaSzBEcllTcW1yRktQUlRKNGpINXZKVGxWK0RUazJOOVVGZFJTNWZTeXBYWTNaWkNQSG5zdnM4bVlxaStxWVY3T1NsS0x6Mkl0L3dHSDNzS1JwUGJvQ1RmV3JlUERwVzZuMHpjRmt0aktyY2dFSGpqekw2cFZ2dzJKMWtsZFl4Y0JRQjhXbGRWVFhwbXVBOFVTTWNDVEE3SVViMEJYSThaYXdmZlB0bE01YWlHb3c0YXRkVEZGbEUxVnoxMkoxZURBN2N5bXBYMHIrclBuWVBZV2tnS3BsRnpEY2NRQ1ByNWFVQXFYTjU5RHh3a01vbWtyWnlvc1piVC9JOEpFZHpILy92K09zVE0rVkhENzRJdDJiLzBqZERWOUFkYmpvZi9aK2VoNjlnNXAvK1UvTXBaVUVPMW81ZnZNWEtiNzZnK1FzTzVkRVlJek9tNytDdWF3Rzc3VWZUdGNyNzdpWmFOZHg4ai95ZGNoeEUzcGhFNEZOOStINTEyK2hteTNvZXBLSm4zOEg4NFZYb1ZUVW9Dc1F1ZmQyZFA4b2huZitDN3Fxa05qOEVNay8vUmIxMy80YnZkaEhhdnV6OEoydndvMDN3dHBsMEhvQXZ2MFRxQ3FHRzg0Qi93amMvQ2lFNHZDK1ZlQ3l3VzB2d1BGQldGTVB6Wlh3NkFFNDBBWDVPYkJ4ZnZyblhXMmdxYkJoSVlSaThOUytkQ0RVKzZBNEQ1N1pDOGtVT0cwd3J3WjJISVpJTEIzTURWWFExUThUa3dmd1hNNzBhVmtUci83Q1dYKzFCbWpRcHAvdWRXcHRidlVpQ3lXRkdsMTk2ZkNhMzJEaXByZm44T1R6NlUraS9GeU51NzVmd0thdEVRSWhIYU5CNGJuZmxhQXFzUE5BREtOQlllLzlwWHo0K2h6Kzc2NEFzYmpPZ3o4cjVEUHZjOVBSbldSZlM0enZmaUdYTDkva1prNnRpYnNlRFBLK3EzTDQzbWU4WExQZXdTL3ZDYkM0MGN6dFh5M2t2RVUyZW9lU25PaFA4T1QvODdHeTNrcGRpWm03bnAzZ2lhK1YwVnhwNFlMNURtNS96czhQMzE3RWltb3JqWVZtUWxHZDgrcnRYRHJIU1o3TndNSVNDNG9PNzF6Z3dZRENna0lySTZFa0gxem9CVjNCWTlMSU1XcGNWK2NCSFZSZFlZblh6b3A4Qjlwa29hblFiS1F4eDRiWFpBSVVqSXBHbmRPSnoyYmxwUnBnazh0RmczT3FubGZ2OUREWDVjVm1TTjhuMzJ5bnl1Nmh4SnFlNG1KU2pWVGFjNmwxcE91R2lxSlM2eXpFWmJSeHBhK1pPa2N4cXFKUjZ5am0wcElsMkRVcnkzTWJNV3BHNXJ0cUFBV3pacVRDV2tpVmZXcCtZV05PT1c2amczWDU4eW0yZUNrMGUzaDhZQ2RmYW5nN24ydTRsbDFqUjNFWXJQemJuSGRpTlZpWTVmUmgxSXdzelorVHFRSFd1aXZSTkkzMXZwVVUyZk1wc0hzcGRSU3lvQ0M5VHFtem1GeXJCNStyRkYxSlgzV3R6RjJLeitYTFBFYVZ0NXBTdHcrM1BWMXJxeTZveFdLMFVsMVFCd3JrMkQxNEhGNktQTDVNRGJBb3Q1ektvcnJKT3FLQ3I3Q1dzc0xheVZva1dDeE84andsNlpxZkFrYVRoZHpjWWp5ZTlGeEpYVkVvS0t3aXY3QTZVNy9MTDZvbXI3Z0dSZE5BQVpQRmdTZmZoOFdSSHBlaWFianlmVGh5U3pJMVFFOXBUZnFDNkpPUFljc3R4T1dyUXpFWTBKWDAyUjZ4MERobHl5NmdxUGtjOHVldUl0aC9BdDlabDAzVkpndDhXQXBLc0JUNDBuWEZpanAwQmR6elY2SXJZSFNuNjZlNVoxK01yaWdvWmd1cXc0WHJyQXRSekJaUVZjeTFUV2g1aFJqTGE5QVZCVU5aRmFvN0YwTnBaZm85VTFWVVh5V2FyekpUZTFWckdsQWI1b0xKbk40UHJLb0RteDJhbXRPdnA3UThIWEpYWFFGYU1oMWlFMk53eFZsUTVvWUNLNWgxS0hYQkJYT2d3QW5sWHRqVEJWKzlITXE4c0xBSy9yd1RQbjRCckprREsrcmhrZDF3OWh5NGNRTXNyWWVEblJDSncvLzdBQ3liRFJOaE9Ob05uN29XTGw4RHJoellmZ2pXTElMUDNBQnphdUNKRjhCcWhoOTlCZGFmQlE5c1RtODFiMXdESDNvWGJIb09VaW53dU9Dekg0UGQreUE2ZVFyazlkZENJQWhqNlhMUVg2MEJKazQ1MDJob2RQcXVVbmQvZ3A2QjVFbi9ubVR2a2FsYVNEQ2M0c1Y5VVNaQ3FjbkgwM2x4WDVTMnJ2UXVZektsYzd3elFYdDNndGprcm1oSFQ1SjRRcWVuUDcxT2QxLzYrMHNoMnplWVFOZGhkQ0pGT0pwaVpEeVYyZlh0SDAwU2pxWHdCOVBQTnppV3ZzK3dQLzA5SEVzUmpPcU1CS2ZHUEJ4TVRsc2VDU1VaRFUrOXpwUU92Y0hwYy91R3dna1NKMzB5K09NcFFxZk1tUW1jOHVZRkV0TWZJM2pLdnlkMW5ZbFR1cHY0VHprOUtuREtlYVhCUkpUUjJOUXV5bWdzeVBoSnRibEFJc0pFWXZvNXM0SGs5UGJ0NFdTTThmalVKK2ZZNU04bndvTU1SZjJNeGlZSUppUFRkcE5IWTlQUFNvZ2xZNHhIcG03enh3TFRhb1FBd1ZPV3c2YzBTWTBuNDRST21wS1RTTVlKeHFaL29rZE82Y01YalllbTFmTmk4UWpKVTk3RDZLbjNpVTVmanNYQzB4NGpsVXhrZGxFejY1eHluL2dwTGZBVDBiL2NUVXllOHJ5SmFKalk1RzVzTWhZbWZ0SThQd0IwUFhNK01JQ2VUSklJK0tldGtwZ1ltMWJMUzRZQ0pFTlQ3MUVxRkNCMThoa2p1azRxZE1wV1VXVDZ1UFJJQkVJblRZVktKdEg5cDF6bWMzUm9lZzF4SXBUK3lpeEhJQkNkdmh5TlEzVHlkOTQvK1p6ams5OURNWWduWVh6eWVaT3BkT0RGNGhBSXA0dHhJNU92WTNqeWZScWVITk9JSDVKSkdKenNaSjVJd3NBdzlBNm13dzZnZndoYTI5THJBWVFqMEhJY0lpZU5zYjBEL0ZQL0J5L3JLSERxbEZMUm1EL0YrTVRValJOQm5ZTkhwMzRCNHdsNGFsdUUrRW0va3c4OUhlWjRaL3FOMFhYNDlUMEJmdm1IQU1uSmg3bm44UkEvdk0zUDBZNzBPcy91aUhMYnZVSCs4SEFRWFljajdYSCs4SGlRSDl3eHprUlFaM0FzeWIzUEJMbmo4UUJQN3dtVFNNS2ZuZ3V3OVZDRW14OFlJNUdDaDNZRjZSNUo4TTE3UitnWWl2UDBrUkRKRk55N2E0SmJ0b3p6NG9rSXFxTFFNaGpqU3c4TjhQeUpNQ2FEUWpJSjMzNXVpRDhlR2llY1NGRmlOL0pFUjRDdlA5OVBkekRCa2dJYmc2RUVIOS9helROOUFjNHRjbUpVVkc1dkgrVy9EL1d4b2NpRDNXQ2dkU0xLVGJ0YW1PZHlVbXkxNG8rbitOU2UvZlNFb3l6eTVKSUUvdVBRZnU3dWJPZXMvR0pNcW9IZmR4N2p1eTA3V0ozdncyMjBjbVJpbE0vc2ZZd3ltNXRLV3k1ajhRaGZPZmdJai9RZFlpZ1c0T21oVm43ZnRaM0RFNzNvNkl6R2dueTM5VDZlR3o1RWs2dUtJa3N1Ky8zdGZPUHdiVlRaaXZGWjg0Z2tZM3lyNVU3dTdkMUNRazl5d04vT3o5c2ZJcFpLc0h2c0tIZDJQY2w0UEVnZ0VhWTkySWVxcVB6eHhHYnU2WHlLQ2tjeDVZNGlZcWs0UHp4d0I0OTBiU1VZRDlNeTFzNGRMZmR6ZU9RNCtiWmNORVhqbnFPUDhNQ3h4NWxYT0ljY2l4Ti9OTUNQWC93RmlWU1N5dHdLWXFrNHY5NXhHOCsyUFl2UFUwWXNHZWZPSGJmend2R3RGTGxMc0JpdFBIL3NXZTdmK1FkcWl4dHgydHlFWWtIdWV2Ym45STUwVWw1VVJ6Z1c1SjZuZjBsNzcyRnF5dWFocUNxSDIzZnk4TE8zVWxiY2dNUHVvcjNySUE4LytUTktpbXR4T0x4RTRtRWVmK3luREE5M1V1SnJKSm1LODh5bVcyaHIzVVpaOVVKVXpjQ0o0N3ZZdHVrV1Nxc1hZckxZR1IvdDVibDd2NC9UVzR6RFUwUXNGdWJGKzI0bTVCL0dXOTZBRHJRK2R3OGQyeCtqb0g0eGlzSEFTTnNCamp4eUswTkh0aFBvNjZEOWlUc0o5TFJoc0RseGx0ZWhvM1Bpc1R2bzNuUTMxb0l5VXFra1hmZmZ3dEFMajJGd3VsRnRka1pmZkpLQmgrOGdHUmpIVkZCQ3VQMElnM2YvakhETFBreSthaEwrRVlaKzh3TkN1NTdEV0p5ZVNqUng3MjJFTnYwWjA3d2xLRTRYcWZFUkFqLzlKbWdHdE1vYTlHaVl5QysrUzJMclp0VEdlZWg2aXNSdFB5YjEySDBvM2dJd0dORHZ1eE0yUFF4RGcyQzN3SFBQcDdlMDloOEhpd0gydE1FZmQ4RFJvWFR3ZFF6REhTK21mOTU5QW5yRzRJNnRFSTdCN2c1b0g0RGZiMDBIWHZjSTdEd09ENzRJWFVQcElIeHlEenk1Q3c1UEhtamEyUUtidHFlMy9nQUdSdUQrcCtEWlhWT2g5Tmh6OE9UV3FaRHBHNFFkSnpXbFNDUmgvOEdwUUFUbzdJVHcxSWZCR2RVU1B4eVpmanltcTIvNjF0UFJFOU0vNVkrY3N0dzVtS0J6Y09vKzNTTUpibjUwNmxOdGNDTEp0eDRhSnBIVVNhWWdFZFA1OGJNak9Nd3FKOGJTai9XYjNXTWNLWW55Y0d2NkUvUysxZ25NaXNvTFBTRUM4UlRQOUFSNExOK0dQNUprMzBnWXQwbGp4MGlJQXFPSlRmMSt1aU14V2dOaEhFWURCeWVDREViaVJDWlRQcUduaUtWMHRvMk04UDVxblNRNk8wYUg2WXVFQ1NXU3VFMEtoeVpHNll1RzZJOEVxYlRsMGgzMk14QU44dEZkOTFOZ2NUQVNEWlBRMC8raGovUWRRSWZNSlNydjc5Mkp6K3JsOEVRWFNUM0YvYjB2WU5aTVBORDdBZ09STVhhTXRiSXN0NEdKWklnOVk4ZlFkUjJId1lKSk5XYTJobFJGeFdHd1ppNmtYbVl2WUhGdUE0T1JjVURuangyYnFITlgwQkhzNC9tQnZTUlNDUjdzZUJxRHFoRktwTGVRZm52b0hpcGRaZXdaT0VRaWxhQnR2SU5TVndsRDRSRTZ4N3M1UHRMR090YVNTQ1pwRzI1aklEREFIM2ZmamRPU3c5N3UzYVQwRkEvdXVZZWF3bnAydEw5QU1CcGcwOTRIT0wvNUtnNTA3NmE5dnhXYnhZSFJhQUlWeGdKRGRQUzFNTGQrTlY1M01TL3NmWWp4aVNIMkhIcVN4dVFLZHUxL25FQmdsTGFPdlJRVjFUSStOa0J2YndzNjZkMXk5QlREZ3gwRUE2UEVveUUwazVtK3pvT01EbmF4ZmRPdnFWbHdMa2QyUG9KL3VJZGRqOTNLL1BYdlpLaTdsZjVqdXhucGFjVmRVazBLT0xibFBoTFJDQU9IdCtPdXFPZjRNMzhpRlk5UmQ4RzdLVHZyTWdKRDNleTQrYk1jdSs5bmpCN1pTU0lXeGQrVzduUnovTTRmWUhMbkVldzZDcnBPOTU5K2hxV2trbkIzRytnNkk4OCtTUERvZnVLamc2UWlJUkxqSS9UZS9CWFFJZWxQenlJWSt0SFhVT3hPVXBQTHcxOThQNXEzZ09Ub01DUVRKSDd4SFpRN2ZwbythREo1Wmt6eTQyK2Y5amVVK3RFM3AvOVJidDZjL3NyOEVZM0JUeCtldnM1REI2WXZ0dzJsdjE0U1Q4QUxSNmV2YzZ4MytuSWduUDU2aWE1UGJRVytKUHI2OTBZOG8rWUIvaU9uOXBoMFdGWGNUcFhnWkhCYVRBcHI1OW80M3BkK28zSWRHajk4VHlISCt1SU0rcFBNTGpHei9jdVZYTGt3aDF1M2pKUHZOTER0VTlYY3RNckxycTR3UThFa1d6NVF6WldOTHBhVTJMaGoveGhQWEZmRnhkVXVycTUxY2Q4eFB6OVpWOFo1cFU0V2VXMjRqUWF1S0hlenRzQkpuc25BQlVWdTNDWVRGNWZrWWxRMTZwME9xaHgyMWhWNFNjOEJORExQNCtIR3FtcFVSVU5UTks0b3JXSnRZU25WZGhjS0Ntdnl5MEJYdU55WFBxMnR5cDVMWjJnQ2sycmducFh2WW5WZU5YZDM3NlBJa3NOalozK2NkMWVjeFo5NmRtUFdETnkvNnJOY1VMU1lFbXNlbmFGaC9tZitCOGt6dVZpZDEwU0x2NU12TkZ3SGdGMnpzRHgzTmdzOHM3aTRhRG1Oem5LVzVEYnc1OTR0M0xIMEMzeG8xcVVjRC9aaE0xajRVdE83TUdoR0dsMlY5SVFHK1hyemg3QVpyUlRiOC9FNWl0azJzSjg3TjN5SHEyb3ZZSFAzQzZUMEZML1krRzFXK3Bhd3BHUSsvYUVocm0rNkVsMEJqOFdOeld6bnFxYTNwT3RiQmlQTEsxWndmUGc0bno3dk15eXFXSXJGWktWcnJKTXZYZnBOR2txYldGbS9sdTNIdC9LUmk3NkkxZUtnb3FDVzhmQVliMTN6ZmxCVU5NM0FncnF6S0MyWVJaVnZEaWFUaFhrTmF6alJlNFRMTjN5RUhHY2U5YlhMNmVrN3lvYnozZ2VBemVIQm1WUEF5clBlaHFLcUtLcEdmZE02eW11YWNialRkY09TcXZuMGRSN2szS3MvanpPM21JbzVxMms3OEF3WHZQOS9jSHFMeWE5c0lqUXh6T0xMYjhKZFVvUE5VMFR4bkJXWTdEbFVMTjJJWnJWVE1uOE53MjBIbVAyV0Q2WnJjL1ljYklVK1VEUWEzL2xaQ3BhY3cvaXgvU1NqWVJaOTdkZmtyZGdJdXM3RXNRUE0vdkxQeUQvbkxiZ1dyR0w0bVFmSTMzZ05wZS85QXQ3MVZ6SDgrTjJZQ2t1cCtNYXZjRzI0a3NEMnAwaUZBdisvdlR1UGo2cTg5d2YrT2N2c1c1S1o3SHRJMkNFUTlsMEVCUmR3MzNEWHEzWEJWdEcydGw3cjFmNnN0WGE1cFhqZCtycy8xR3A3VzN2cjBvcTJvcUtpZ0t3YTlpV1FRQklTUWtMV1djL3orK09FbVV3RUFVVlpucy83OVpyWGkyZm16TXd6ay9ESk9jOTV6dmRCN2k5ZmhtZlcxWWpXVnlOYXV3dUszUW4zMVhjaVhMa0s2QjVXVVd4MklCekNLVHo1NDdnNnFlWUI5cDZ6NmJBbjM1SGwxNUsyeWZKcktNbE9GQmROZFd1WU5peFJpRExnMVRDajNJWFNUSE9iM0RRZFRxdUt3alFMYkJZRmFVNE5YcnNLVlFFS1VpencyRFI0N2ViRjd6a2VDelFGeUhDYU84bWFvaUREb1NQVGtkaHB6blRvOE5zU2JhdXFJTU9hdkZQdDcxSDhGQURTTE1tUFcxVVYyZmJrUWdwWlRuZFNPMkJ6SXMvaEF3Q1V1UDFRb01EZm82aW8zK3FDVDA5ODdsSlhObnlXNUlLY0dZN1VwSGFtTFFVRmprU1ovRHhIQUlxaUl0dGhsdUF2Y0diQVowM3VSN296TGFtZDQ4eUF5K0tBcXBxL1JtbjJGRGd0aWMrUzZjcUF6K1pKL2l5OVhzTnBkU0xObGJndnk1ZWRWQ0RWcXR2aDdGR29GQUJTUGY2a3RrVzNJclY3NllDRFBLN2trdlV1ZC9MbjkvblNrOXFxcXNMdFRuNE5senU1cjNhbkwvNVpBY0RwQzhEaFMvVEY0ZlhEa1pLODlJRGRtL3kranRSTTJOTXk0MjFiYWpyMEhqOXZlMlllRkZXQjFXdStyc1dmRFNnS2JGa0ZCenNLMVdxSDdrdjBUZlA1b1dnNlZIZDNzZFpNc3lDRjZrMkJiZFJrcUttSno2VVZsMEd4SmhmY2xkbEp2UWZZNi93QjJqcVQvMnJ0YnpXd3U4Y2hiM3VYZ2NWckU0TzBUVzB4ekYvVWpJMjE1bCsvcXNZSTFsVUg4ZFQ3emRqZEhNVys5aGcyTjRTeG9qcUk1MWUyb0NVWVExMWJGTkVZOFBDU0J0UzBSckN6Tll4Q2p4WC91N1VWTDJ4b1JsMW5GSk56M0dqc2pPS0hLK3BRMlJMRXVUays2RkR3WXRWKy9IN0hQbHlRbXdhcnFtRnZNSW9IS25kZ1psWUFWczFjc25MKzFpbzBoY0xvNS9VQlVQRFU5cTFZdUhNYlp1VVVBVkN3N3NCK1BGeTVISE1LQjBKVk5BUU5BL2QvOWk3V3R6WmdWY3Nlek4rMkZGMnhDQnBEN2RqY3RoZHYxYS9INnBaZGFJbDBvalhTaGJBdzhPRDZsN0Nyc3dGai9QMlJia3ZCbHJiZCtOWFd2MkJpWUFqU3JHWWdQYmhoSVY2dFhZcFoyZU1nQU55MWJnRWFRaTFZdEhjRjFoL1lpVGZxUGtGdDF6NU15eHdCajlXRjFuQTdmbGI1UE53V0o4cDhCVEFVQXcrdWZCSzFIUTFZczI4VGx0V3Z3N3A5bTlBWkRhSWwxQWFiYnNVdlZqeU5yYzFWbUY0OEJSYmRBZ01Ddi9uNHY1RGp6VWJBYlY1eDhkTHFQK0tUblo4Z3pabUdya2dRLy9malo3Ry9vd2syM1k3czFEeTh1UFE1Ykt2ZmpMeEFNUUxlVExRSDIvRHlrcWVwQXhCaUFBQVpWRWxFUVZTUjdzdEJJQ1ViVUlCL3JYd0ZTejliaElvQmt3RkZ3YW9ONzJINXVrWG9XendDVHFjUDI2dlg0YVBsZjBhLzByR3dPendRaXNEcmIvd0tGcXNkL3ZRQ0NBQnJWcjZPOVd2ZlJrbi9jVUQzcFhBckZpOUVJS2NNbnRRczFHeGJpWTByL2c0SWdZeWlRZWhzYjhhS1YrZWpxWG9qOG9kT2dRQ3c3S1ZIVVZ2NUVRcEh6UUEwRFhXZkw4WDJKWDlGVHNWVWFIWVhoQUo4L3VMUHNhL3lFMWpjS1dpdFdvL2FEMTVIdEtNVjRlWkdoRnIyb2ViVjM4T0lSbkNnY2ptZ0tLajV3MjhRNjJoRis2YlY1cUg2MjM5R3FIWW5JazE3RWR2ZmlJNTFuNkJ6M1NkQUxJYXVWUjhoc21zYk90NS9BeEFDb3FNTm5XLzhFYUkxTWRIZWFLaUxILzZTU2ZEMjlXNCtpeVlLWE5aNE8yQ3ppUEVCci9Eb21nQWdzdXcyY1dWQmpoaVZsaUpnem40UVU5TXp4UmgvUUFBUUZsVVY4L3FWaXljckpvdFN0MDhBRUtrV201aVJWU0xjdXUyWStxSkFpZi9icGxwRXVhOUUyRFd6YjMxY09lTHh3YmVLNzVUTUVycWlDYmZ1RVBOS0x4VS83SCtsU0xXNmhRS0k4ZjZCNHJyQ3MwVzZ6ZXpyaE1BUThYL0tieFV6Y3NZSUJZcFFvSWdCS2NVaTA1RjIxSDBLT1B6aTRnR3pSRmxhaVFBZzBsMEJNWGY4N1dKT3hWWENvbGtPMmZkRDNXd1d1MUNVeERaWnFma2l6WnNlYjd1ZFBwRVZLSXkzTGJwTjVHVDBFYXFxZGJldFlrQy9DU0l0TFZjQUVGYXJRMHcrOHdZeGJ0SWNvZXZtZCtSd3BRaC9abkhTKzFodHJxUitXRzNPcE1kMXExM29WbnU4cldxNnNIdjlpYytscU1JWnlCRzYzWG5DZjFkNTYvMy94ZndIZlUyOXYwaXZSVU5yeER4WkViQlo4ZUtZY3Z4K3h4NzhkWGN0NXZYcmk3dEsrMEZBeGZmWHJjVzBqRnhNenl5QWdBb2hORXg4N3hXOE0rVXlXQlFiV3FNeFRIcDNJV0pDNFBMOG9maXdzUXExd1ZZb1VQRGd3SE1STTRDZmJYb1RnTUJ2aDkyQWthbDljZDJudjhQT2pnWXNtdkFvbkxvRFFTT015NWY5RksrUC8ybThmNHNiMW1Dd3R3aVpkdk1RclQzYWhkOXUvMTg4ME85cUNBQXhSV0RlMnFmd3E0bzdZWFRQYzN1MDhubU1UQitJTTNQTVlxWnpQMzRjMjF0cm9Da3FORlZEK0JDTEZUbDBPNTZiOVd0QVVTR2c0T0VsaitQSFUzNEFhT2Ixc2p1YWQrSG43L3djRDU3ekVGSmRBVHowOXdmUTBtWHVzU2lLRWo4NW82czZwZytiamVWYlBrQnorejcwelJ1TTYyYmNoNWhpNERkLytnRTBUY2VkVnp3T29RQkwxLzRESDZ4NkZYZmYrQlEwaXhXdEhjMTQ1c1Y3Y1BQMXY0YmI3WWVoS0hqcDVSL2gvQXUvRDVmSER3UEF2bjNWK051ZkhzS2MyNStDeGViQWtrVlBZMXZsRWt5OStEN2s5UjJGN1JzK3hNZXZMMERSa01rWU0zc3VPdHFiOGVhQ08rRHcrSEgyOXhiQUFQQ3YrWE1SYkczR3RQdWVoZTcyb3ZLTloxR3o0bTJvbW80K002OUY3Y3JGNk5ocm51WE1xRGdEMFdBSDluZVh3ZGNkYmppeUM5RzJZLzBYdmtQNjVweFVZNENuS3I5Tng2VUZpYkVlajY1aDQ3a2o0NFZYejhrS1lMRFBneWVHRGdBQVhKbVhLUGg1Zms0K3BtVWxGeEVkbFpvSmEvZENQaDdkaWd5YkN6a09EMzdjZnlydTZXc1dNMDJ6T25GQlRqa3V5cTFBaXRVSmwyN0htTFF5cUZBeEszczAwbTArT0hXelhKUmR0Y1lMSVJ3MEpiMDhIbjRBNE5ZZG1PeFBMRUdwUXNWby80RGtmZ1VHWUhyMjZIaTdJbUErZmtidWFOdzY2UEpEZmpmWjdneW9QWDdOeXJPR0pvMmpGYVVXSWVCT1I1WTNHMWJkaXNIZHkyQ3Fpb3JicHQ0VDM2NGd2US9PSEhJK3poNStrZms2SmVQaS9TekpIWWlpbkVSZlJ3eVpqbFJ2SnZUdXhaVGM3bFI0UFFGNDNJbnh1dnlDd1hEM0dPUHpweGNna0Y0QWEvZUNUQU9HejRDcWFzZ3ZHd2tBS0I0MENZcWlvdC9JY3dFQURrOGFuTDUwWkpZT3g4Rko3aGxsRlhDbVpzRHFNc2ZpaXNmUEJnQjQ4OHBRTUdFMitzNisxZXl6YmtHL0srN0dnQnNlaUE5ODUweTdGUDN2ZkN5KzBCSUFXUDJKc1VMNlpqQUFqNE9tVUJSL3FVNk1zN1JGWThoL2ZYbjhhcHBYZHRmajZlM1Z1SENwK2RmKzhjMmI0OXMrczMwekZsWWxMdXdQR3dZK2FOeUQyaTV6R3M2V3RpYlVoOXF4cDZzVjEzLzZaL3pIaG4rYTd4bnV3TU1iL282SE5yeUc1bkFIMnFOQlBMdmpIV3hwcThVTHU5N0YzbEF6cWpyTW9nbzFYWTFZdm45ajBwb2cvMVB6SHRZZjJCbHYxM1ExNG05N2xzYmI3ZEV1dkZXM1BPbHovck4yQmY1NzYrc0FBTU13OEg2dCtYa1c3MTZHSno5NytaRGZUVTFyTGJxaWlRbkVIKzM2Qk8wOUpqcXZxbG1GaHZhOVdMcGpLWFkwN2NES1hlWjdHc0xBVSsvK09yNWRWY01XUFAvZTcvRGFzajhBQUpaODlpWU13MEJuc0IwYmQ2N0NwcXBWaUhaUEdILzd3eGZSMUZLTEE2MW1MYjdkZFZ2UWNxQUJlMm8zeC91K1pmTW5hT3hSL0dEWDl0Vm9xTitCL1kzVkFBd3NmM2NoRENPR2RSKzlBZ0JZdmZnRkNHRmcxYi8rRzRDQmhxclAwZEc4Rjd2WEwwV3d2UVhCOWhicytmd2pkRFRWb2JsNk0yQVlxSHp0S1FEQWdlcE4rUHpsSjFENThpL005NDlHc0diK3ZWajl4QjA0T0syaFp0RWZzTzZSRzJIMFdBWXozS3NvQm4welR2aHh1SXkzRkl0VnVIWDk0RGlFbUpLZUxhN01MeFZlaXprV3BTcUs4RnNkUnh3WCs3S2JBa1g0cmQ3NGVKWGY2aFYzbFY0b0xzZ1pMeFFvUWxkMGNYUFJ1ZUxPUHJQajQ0Umowd2FLbTRyT0Vha1d0d0FneWp6NVltNi9TOFR3MUg3eDEvVlluTUtpNmtmZEQ0dG1FV1grUHNKdE5jZlM3THBOVEM2ZUtDcnloaWVOcFIzejUxUFVwTzlIVlZSaDZURm1xaWlLY05qZFNXMmZOejArM3FlcW1panBNMUlVRkpVTFJWR1R0dnZhUCtQajhScThmZU8zay9vczhPa3NhTVFRN25HSnphN09kcXh2M1k5UWQwa25BWFBpZEt6SHhFZVhia1cweDNNeWJCNDRkUnM2dTh2Ymw3Z3lNU1Y5RUxhMm0xZUYzRkV5RzQ4TnZobGUzWWxQbTdmZ3oyTWV4TWpVZnBqZ0g0ejk0VmJjVURRREYrU013eEJmQ1VhbDlVUEVpT0RSd1RkaGVFb3BMc2svQTIvdFhZR0ZZMzZFZ1NrbE9EdG5OTjZ0WHdWTjBmRFlxTG5vNDgzRDhvYktvL3FzaGpEUUZlbENaL2VTbHFtT1ZOdzU3amJrcE9SaTZjNlBZUWdEWmVsbEtNMG9RMjFMN1dGZngyNTFJTnA5QmxOVGRadzNiZzZ5QTRYWVZiOEZxcUxpaWhuZnc1bGpMc1BHcXBVSWhUc3hjOHFOdUdER1hRaEZncWl0TnlmaWVqMEJCSU50TUF6REhGOVVGWFIydENBVU1pZCtaK1VOUUhIL3NkaFhaMDRVZDNyU01IRE1MQnhvMm8xb0pBUlYxVkEyOGh6RVloRUVPOHhKOWhrbFErRk16VVJuOCtIMzJCUkY3ZjZwMHNtRWg4RGZrQXR6aytlcVBUbGlNTng2WWc3ZzdYMUtjVjVPWXV4dlNubzIzcHQ2WWJ5ZDQzQmo3VmszSTdWN1RNcXU2dmg0NmgyNFBMOGNBS0FwS2haTnVndi9tSGczVkVXRkFnVXZqWm1MKy90ZGpLbnBRK0RVYkxpNjRFd0F3S1Y1a3pISVU0aVVIdlA2Yml1WmhRbitRZkgyUUU4aGJpNCtMOTYycWpvdXlac0NyY2Q0M2N6Y2NiaXBiQlpLUEhtWWtUY2V4YjBXUURvY244Mkw1MmIvSndabGRJK0JsbDhHcDlXSm90UkNETTBlQ3F0bXhiM1Rmb0FieDkyQ0FuOWgvSG5lN3JtUEFPQzB1ZkRJVlU5aVVJRzV3Tkdnd2dxTUdUQU4wMFpjalBUVUhPUmxscUtzWUJqY3poU2NOZjVxT0IxZURCdG9mdjZwRStaQTAzUUUvUG00NXFxZjRhenA1bGljeFdMRG5PdWV3RFUzL3hhcXFrSFRkSngvNVU4d2Vzb2NGUGMzeHhpblgvWWpESjF3Q1NaZWVEY0FvR0RRUkF3Lyt3YWNkY3ZqVUJRRk5xY1hFNjc5Q2NaZis1UDQySjhya0l0SjMwM1U1Vk1VRldmODlDL3dGZmFQMzZkYXJQRUZsK2pFWVFCK1ExN2IwNVRVL3NHNmpVbUZFVjdZdFJQdjFDY3VCMXJXMUlBYlZpeU90K3VESGJodDFWdG82YjRBUDJoRThjUFBGK0h0ZW5NY0t5WU1MTmoyUGhac1d3eERHQkFRZUczUEtuVEd3bGpUVW9XdVdCaDdnK1llU2t1NEhkWEI1SVdQUG0zZWd0Wm9ZczVrMkloaWRhK3EwSlVIcXBMYW0xdDNZZG0reXZqMmRWMUh0eTV1YTdnTlQ2OWNpSzFOMndFQTYyby9qejlXM1Z5TmNDeU1EZlhyMGRMWmpQb0RpZStrdGF2SFlreWhUdnpwdytld3JjNDhTMXJkdUIwR0RBVERuV2h1YThTK2xsb0E1dDd4MXAxckVBeDFJQmcweHhvYm0zWWpGb3VpdWFVT0d6ZDloTlZyM2dRQVJDSWhWSDcyRGxZdC94c01JNFpZTElxYXFyV0lSc09vcnpHdlFkMjA1bTBBd0xhMVpwWGxobDNyWVVURDJMbHVDWVFRQ0hlMW82bG1NNXFxTnlMU1hZQ2dzNmtPS3hZK0V1KzdFQVpXUGZNanRPMU9YQTVtUk1JUVgzRjlZenArT0EzbU5LWXJHb3BkV2RqWnVSY1JJNG9odm1MY1hqSWIyOXIzWU1IMjErRFZuWGhvNExXd3FoWThzdkZGTklSYWNFL1p4Ump1SzhNelZYL0grNDNyTURXekF1Zm5UY1NTdld2d3h1NlBJQ0RndGJqUUZRc2g4alVXV3ZjNy9RaEd1OUFSL3VxRk4xVlZneEJHZktxTVJiZkJibk9pcmNNOElhVnBGcVQ1c3REVXNnZEc3NG9lWHlyNXYwWFA2VGgwZXVFZTRHbE1VMVNrV2IzUUZQUEhYT1RNUkxtdkJHUFRCc0NxNnBpU1BoUVZLV1VZN0MzQ2VWbGprV3YzNDd5c2NjaDNadUNxZ21sUXV4ZE05MW1jVUJVRkJ4Y1ViWTEwZkszd0E0Q216cWF2Rlg0QVlMUFlvV3VKYVNOdXB3OXAza3dvM2V1ZzZKb09yOGNQUlRtMlEwMmwxeldaREwvVEYwK0NmRXQ4RmgyaEhuc2hYb3NGaXFMRTF3dTJheG9HK2Z6WTI3MU1vZ0xnb3R5KzJOU1dPSlMycVhxODhzdWhXRlFOUTN5RjhVUGZaeXJ1eGpVRjAzRkdlam5lckYrQlp5dm1kYiszRTI3ZGdadUtac2FmT3l5bEQ0YjRTcEJ1TThmZDB1MnAyTkM2QzQrVzM0SVVteGVqQTRQd3I3cFAwUjd0aE0vcVJzU0lRaHpEd2NQNC9OSFkwMVlMQVVDQmdzZG0vaFEraHc4Ykd6WUJBTncyTjNKU2N0SFMxWExZMTVoZVBoczFUVlV3akJoY2RnOStmTTBDVEJneUV4OSs5aWFzRmp2bVhUTWY1ZjBub2ZGQUhScjM3OFlkMS93bnlnZE5SVlpXSDJ6WWJFN3hzZHZkOGVreUFGQllQQngyaHhzZDdXYWR1VEZuWElOcEY4M0QrbFZ2d2pCaThLWGw0UEx2UFl2dG4zK0F5Q0hxLzlHcGpYdUEzNUpRcjBPd3NHRWtMWlllRXdJSGVoVGtGQURxdXBLTFdrYVBzSWFISVFSYXdva2lsMjNkWjEzYkkxMWZDTTdPYUhKeFQ3TlB5UVZCUTcydTdJaUlhUGQya1dQZUsycnFhbzVYOGhFUWFPeG94UDdPL2ZISG83RW9Pc0pmdmxaeFUxdEQvRkEyRm92Q01BeUVvbVpoVTNOQkpQT3hjUGU0YWFoN0R6TVlTbnlQMFY3RlpiczZEeUFVVEx4dlowY0xJcUd1K1B0RUlpRjB0alluTFg1RXB3K09BWjdHTkVWRnNTc2JWUjMxaUlrWVJxYjJ4U01EYjBCbDYwNzgrL3IvaDVHcGZmSEVFUE9NNkdPYi80aGxUUnZ4NHVqNzRkR2RlTGR4TFI1YXZ4RDl2UVc0dU9BTXZGTy9Fc3YzblZ5WGFlbWFEc013NGxXckhUWVhuQTR2bWxyTUV5bWFwaU9RbW91R3BwcjQ0dWxFUFRFQUphSXBLc2FrOWNlZXJpYnM2dHlMSExzZnZ4NTZHNnlxQmZkOS9neDJkTlFoMis1SEgxY09sdTNmZ0tpSVFWYzE5UFhrWTBkN0xZS3hrMzh2aUNjczZGZ3dBRThpNWttSDQvZmpzS282YmlpY2llZDN2WTJRRWNFdmh0d2FuL3MzWjhYUDhQdUtlZkhyaGFOR0ZKY3Vmd1N2am5zRUFzREc5aHJjc3ZLWGVHSHNBOGh6WjZFdDJvV0xsdHovbFpiU0JNeHJlM3MrTjhlYmc1WmdDenFQNFVTSTNlSkFNSktvR256cGxGdlEwRktMRDliOUF3Qncwd1gvanN4QUVYNzc4ajNvN0dvNzNNc2tPVGhCK1dCb0tvb0t1OE9OcnM3V0wzOGluUlk0Qm5pU1VCVUYyWGJua1RjOGdoUkxvbmhvd09yRDlZVm54WXNlRFBFVnh4L0xkZmpqNFFlWTFWWXliWW5pQUtXdVBLaUtnZ0tYZVVHK1czZkFwaVlYZHowV0JiNjhwUGE1L1dlaUpLMzRNRnNmMnVEQ0VWQzd6MmhycW9haHBlTXdadEIwQUdiQTVtWDJnYTVia09KSkZDVzEyMXlIZksyRG5FNGZyRDBLc05yc2JwUU1HSDlNL2FKVEYvY0FUM082b3NYWEVPbmp5c0h2aHMzRjZwWnRlR2pEUXR4YWZCNnVLVEFEWkZIOUNqeTY2V1hjMi9kU25CRVloaDlVUG9jTnJUdFJubEtLNy9TOUNIK3BmaGZ2MWE4NmtSL2xDNndXTzJKR0ZMSHV5K084cmpTa2VOTlJYYmY1Q004a01qRUFKVGZZVnd5TG9tRk5TK0lxQlFWSzBoU1g0MzFvVG5TeTREekEwNXhMdDhjbkxXdUtpcHVLWmlJcVltZ0l0ZURzekJINDVaRHY0TnlzTVFqR3dxaHNyY0xQQjkrQ253eThCaXVidDZJaDFJeEw4cWRnd2FoN2tXTDFITmV6d0wwbkczOFZHU201VUZVTjRZZzU3YVUwZnlpRzlCMlA2cm90NE45MU9ob2NBenlOMlRVTC9qbnhjYmcwYzZ5djFKV0RtNHBtWW43NVhBREFyS3h4OFcwdno1c0NsKzdBcE1CZ3FGQnhmZEVNQU1BZHBXWUIwdGw1azZBZDR4VVZQUjI4T3VPZ0s4b3ZRMW1nOUpoZVkwU2ZDWW5YVXhSODk1SkhjZTJNUk5IVU9lZmNpOGtqTG9RL0plc3I5NVBrd2ozQTAxaFVHSGlwZWpHNkRIUDZTbk9rRGUzUkxqeGI5US9zRDdlaE14YkV0SXdLQU1EVE85N0F1Z003a0dWTFE3RXJDLyt4OFFVMGhWdlJHR3JHaEl5aGVLbnFiYXplZi96RzF0YlhiMEJUajRuUVI2T3V1U2FwdlhiYlVueTZhUW1pM2ROemR1elpnTDFOMWRoVzg5bWhuazcwQlJ3RGxGeWExUU5OVWRFWU9uRFliZmhMUXFjckhnSkx4cTVaa2c1SEZTaEpoN2E1amdET3p4NEx2ZnMrcDJiRHJMeEpTTEY2dnZCYUp4dE4wK0hxVVVPUTZFZ1lnS2U1Ny9lOUl2NXZxNnBqOGFSZjRwYnV3cWVhb3VMVjhRL2pyMk1mZ2wyelFvR0NsMGMvZ1B2N1hZVUxjeWNDQU80ZGNDWHU3bjg1Rm95YWQxejcxY2Rma3JRQSt0SG9mZUxrK2huM1ljS1FjK0x0RzJjL2dIblh6WTh2YkVSMEpCd0RQTTE5ZG1CSGZERWtReGpvaW9YeGJ1TWFISWgwUUVBZzIrYkgzbEFMM3Q2N0VnSUNwZTVjRkxteThOU09OOUFjYm9PbWFKaVNPUnl2MUx5SHo1cTNIZUhkamw1cnNCWGhyM2xwWFYzVEx1eHUzSVp3MUN6aTBCbHNReWdTeE9hcWxjZWppeVFCRHUvUUYvUytiRTFUMUM4dHcwVjBxdUloTUNWUkZTVStiZWFnZ3dWVmlVNDMvTTAremVYWWt4ZG51cWYwRWhRNkV3dHUvOWZ3NytMRlVmZkhUNHNzR0hZWEZrMThESU44UlFDQVlhbGxlT3ZNMzJCbXp0amoyaStiYnZ2YWs2SEw4b1lnNEV2TStSdFhmaTd1dlBJWHgyV1NOY21CQVhpYVUzdnR2V21xMm10S3N2S0ZTY3FIZkoyajJPWllISTlYVTZBa2haMkM0M09GQ2NtRFk0Q1VSRlVVdUhVbldpT0pLc2xXMVlLd0VmbVNaeEdkbWhpQVJDUXRIZ0pMSm1EMUpaM1U2T3ZPUTdtdlQ3dzlPclUvNXBmUGhVMnp4dTg3V1E4ckxib1Zhby9GeFJWRmdVVzNmc2t6aUpJeEFFOXp2Yy9nZnJmMEltVDNPREh5YjBYbjRMNitsOFhiRitTT1IwVnFHWEx0Z2ZoOW85SUdmUE1kL1FyNjV3OUR3SmNkYnp2dEh2UXJxamlCUGFKVERRK0JKV2VlU0VDODNwOUYxWkZqOTJOWDU5NFQzRE9pYng0RGtJaWt4VU5neWFtS2tuU1liRk10R09ndFBJRTlJdnIyTUFBbGMzdkpMS1JZM1BIMnRRVm40YjYrbDhmYjF4Zk93TE1WOHhDd25meFZWZnJtRFVXcUozRGtEWWtPZzRmQWt1bjlBOWNWRGFxaXhBc211SFE3aG5pTHNXei94aFBTUDZKdkV3T1FpS1RGUTJENkFoWS9JRm53TjEweS9UMzU4V3JQQURBaXBReG5wZytMdDgvT0hJSDNwdndxYVNMMHljcnJTb1ZWdDUzb2J0QXBqQVZSSlhNZzJobGZLQjBBV3FPZDJCdHFScWo3V3QvMldCRGhXQlNmN3Q5MG9ycDQxTUxSTUdKRzdNZ2JFaDBHeHdDSlNGbzhCQ1lpYVRFQUpXTlI5YVMyVTdQQmEzRW1QVDcySkwzMnQ3ZVR0VWdEblRvWWdKS3hxWmFrWXFSMnpRcUhsamlSb0NzYThwMFozMzdIdmdKRlVZK3FtQ3ZSNFhBTWtJaWt4VDFBSXBJV0ExQnlDc0REU0pJV0ExQXl2YU11eTU2R0VsZDIwbjNGcml3UXlZQmpnRVFrTGU0QkVwRzBHSUJFSkMwR29PUTh1Z1BwcDBEeFU2SnZBc2NBaVVoYTNBTWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwTVFDSlNGb01RQ0tTRmdPUWlLVEZBQ1FpYVRFQWlVaGFERUFpa2hZRGtJaWt4UUFrSW1reEFJbElXZ3hBSXBJV0E1Q0lwTVVBSkNKcE1RQ0pTRm9NUUNLU0ZnT1FpS1RGQUNRaWFURUFpVWhhREVBaWtoWURrSWlreFFBa0lta3hBSWxJV2d4QUlwSVdBNUNJcE1VQUpDSnBNUUNKU0ZvTVFDS1NGZ09RaUtURkFDUWlhVEVBaVVoYURFQWlraFlEa0lpa3hRQWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwTVFDSlNGb01RQ0tTRmdPUWlLVEZBQ1FpYVRFQWlVaGFERUFpa2hZRGtJaWt4UUFrSW1reEFJbElXZ3hBSXBJV0E1Q0lwTVVBSkNKcE1RQ0pTRm9NUUNLU0ZnT1FpS1RGQUNRaWFURUFpVWhhREVBaWtoWURrSWlreFFBa0lta3hBSWxJV2d4QUlwSVdBNUNJcE1VQUpDSnBNUUNKU0ZvTVFDS1NGZ09RaUtURkFDUWlhVEVBaVVoYURFQWlraFlEa0lpa3hRQWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwTVFDSlNGb01RQ0tTRmdPUWlLVEZBQ1FpYVRFQWlVaGFERUFpa2hZRGtJaWt4UUFrSW1reEFJbElXZ3hBSXBJV0E1Q0lwTVVBSkNKcE1RQ0pTRm9NUUNLU0ZnT1FpS1RGQUNRaWFURUFpVWhhREVBaWtoWURrSWlreFFBa0lta3hBSWxJV2d4QUlwSVdBNUNJcE1VQUpDSnBNUUNKU0ZvTVFDS1NGZ09RaUtURkFDUWlhVEVBaVVoYURFQWlraFlEa0lpa3hRQWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwTVFDSlNGb01RQ0tTRmdPUWlLVEZBQ1FpYVRFQWlVaGFERUFpa2hZRGtJaWt4UUFrSW1reEFJbElXZ3hBSXBJV0E1Q0lwTVVBSkNKcE1RQ0pTRm9NUUNLU0ZnT1FpS1RGQUNRaWFURUFpVWhhREVBaWtoWURrSWlreFFBa0lta3hBSWxJV2d4QUlwSVdBNUNJcE1VQUpDSnBNUUNKU0ZvTVFDS1NGZ09RaUtURkFDUWlhVEVBaVVoYURFQWlraFlEa0lpa3hRQWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwTVFDSlNGb01RQ0tTRmdPUWlLVEZBQ1FpYVRFQWlVaGFERUFpa2hZRGtJaWt4UUFrSW1reEFJbElXZ3hBSXBJV0E1Q0lwTVVBSkNKcE1RQ0pTRm9NUUNLU0ZnT1FpS1RGQUNRaWFURUFpVWhhREVBaWtoWURrSWlreFFBa0lta3hBSWxJV2d4QUlwSVdBNUNJcE1VQUpDSnBNUUNKU0ZvTVFDS1NGZ09RaUtURkFDUWlhVEVBaVVoYURFQWlraFlEa0lpa3hRQWtJbWt4QUlsSVdneEFJcElXQTVDSXBNVUFKQ0pwL1g4dWRrRVN6eVg0RFFBQUFBQkpSVTVFcmtKZ2dnPT1cXG5cIjtcbiJdfQ==
