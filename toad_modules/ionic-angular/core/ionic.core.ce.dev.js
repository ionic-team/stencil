/*! document-register-element, 1.4.1
https://github.com/WebReflection/document-register-element
(C) Andrea Giammarchi - @WebReflection - Mit Style License */
(function(e,t){"use strict";function Ht(){var e=wt.splice(0,wt.length);Et=0;while(e.length)e.shift().call(null,e.shift())}function Bt(e,t){for(var n=0,r=e.length;n<r;n++)Jt(e[n],t)}function jt(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],Pt(r,A[It(r)])}function Ft(e){return function(t){ut(t)&&(Jt(t,e),O.length&&Bt(t.querySelectorAll(O),e))}}function It(e){var t=ht.call(e,"is"),n=e.nodeName.toUpperCase(),r=_.call(L,t?N+t.toUpperCase():T+n);return t&&-1<r&&!qt(n,t)?-1:r}function qt(e,t){return-1<O.indexOf(e+'[is="'+t+'"]')}function Rt(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target,s=e[y]||2,o=e[w]||3;kt&&(!i||i===t)&&t[h]&&r!=="style"&&(e.prevValue!==e.newValue||e.newValue===""&&(n===s||n===o))&&t[h](r,n===s?null:e.prevValue,n===o?null:e.newValue)}function Ut(e){var t=Ft(e);return function(e){wt.push(t,e.target),Et&&clearTimeout(Et),Et=setTimeout(Ht,1)}}function zt(e){Ct&&(Ct=!1,e.currentTarget.removeEventListener(S,zt)),O.length&&Bt((e.target||n).querySelectorAll(O),e.detail===l?l:a),st&&Vt()}function Wt(e,t){var n=this;vt.call(n,e,t),Lt.call(n,{target:n})}function Xt(e,t){nt(e,t),Mt?Mt.observe(e,yt):(Nt&&(e.setAttribute=Wt,e[o]=Ot(e),e[u](x,Lt)),e[u](E,Rt)),e[m]&&kt&&(e.created=!0,e[m](),e.created=!1)}function Vt(){for(var e,t=0,n=at.length;t<n;t++)e=at[t],M.contains(e)||(n--,at.splice(t--,1),Jt(e,l))}function $t(e){throw new Error("A "+e+" type is already registered")}function Jt(e,t){var n,r=It(e);-1<r&&(Dt(e,A[r]),r=0,t===a&&!e[a]?(e[l]=!1,e[a]=!0,r=1,st&&_.call(at,e)<0&&at.push(e)):t===l&&!e[l]&&(e[a]=!1,e[l]=!0,r=1),r&&(n=e[t+f])&&n.call(e))}function Kt(){}function Qt(e,t,r){var i=r&&r[c]||"",o=t.prototype,u=tt(o),a=t.observedAttributes||j,f={prototype:u};ot(u,m,{value:function(){if(Q)Q=!1;else if(!this[W]){this[W]=!0,new t(this),o[m]&&o[m].call(this);var e=G[Z.get(t)];(!V||e.create.length>1)&&Zt(this)}}}),ot(u,h,{value:function(e){-1<_.call(a,e)&&o[h].apply(this,arguments)}}),o[d]&&ot(u,p,{value:o[d]}),o[v]&&ot(u,g,{value:o[v]}),i&&(f[c]=i),e=e.toUpperCase(),G[e]={constructor:t,create:i?[i,et(e)]:[e]},Z.set(t,e),n[s](e.toLowerCase(),f),en(e),Y[e].r()}function Gt(e){var t=G[e.toUpperCase()];return t&&t.constructor}function Yt(e){return typeof e=="string"?e:e&&e.is||""}function Zt(e){var t=e[h],n=t?e.attributes:j,r=n.length,i;while(r--)i=n[r],t.call(e,i.name||i.nodeName,null,i.value||i.nodeValue)}function en(e){return e=e.toUpperCase(),e in Y||(Y[e]={},Y[e].p=new K(function(t){Y[e].r=t})),Y[e].p}function tn(){X&&delete e.customElements,B(e,"customElements",{configurable:!0,value:new Kt}),B(e,"CustomElementRegistry",{configurable:!0,value:Kt});for(var t=function(t){var r=e[t];if(r){e[t]=function(t){var i,s;return t||(t=this),t[W]||(Q=!0,i=G[Z.get(t.constructor)],s=V&&i.create.length===1,t=s?Reflect.construct(r,j,i.constructor):n.createElement.apply(n,i.create),t[W]=!0,Q=!1,s||Zt(t)),t},e[t].prototype=r.prototype;try{r.prototype.constructor=e[t]}catch(i){z=!0,B(r,W,{value:e[t]})}}},r=i.get(/^HTML[A-Z]*[a-z]/),o=r.length;o--;t(r[o]));n.createElement=function(e,t){var n=Yt(t);return n?gt.call(this,e,et(n)):gt.call(this,e)},St||(Tt=!0,n[s](""))}var n=e.document,r=e.Object,i=function(e){var t=/^[A-Z]+[a-z]/,n=function(e){var t=[],n;for(n in s)e.test(n)&&t.push(n);return t},i=function(e,t){t=t.toLowerCase(),t in s||(s[e]=(s[e]||[]).concat(t),s[t]=s[t.toUpperCase()]=e)},s=(r.create||r)(null),o={},u,a,f,l;for(a in e)for(l in e[a]){f=e[a][l],s[l]=f;for(u=0;u<f.length;u++)s[f[u].toLowerCase()]=s[f[u].toUpperCase()]=l}return o.get=function(r){return typeof r=="string"?s[r]||(t.test(r)?[]:""):n(r)},o.set=function(n,r){return t.test(n)?i(n,r):i(r,n),o},o}({collections:{HTMLAllCollection:["all"],HTMLCollection:["forms"],HTMLFormControlsCollection:["elements"],HTMLOptionsCollection:["options"]},elements:{Element:["element"],HTMLAnchorElement:["a"],HTMLAppletElement:["applet"],HTMLAreaElement:["area"],HTMLAttachmentElement:["attachment"],HTMLAudioElement:["audio"],HTMLBRElement:["br"],HTMLBaseElement:["base"],HTMLBodyElement:["body"],HTMLButtonElement:["button"],HTMLCanvasElement:["canvas"],HTMLContentElement:["content"],HTMLDListElement:["dl"],HTMLDataElement:["data"],HTMLDataListElement:["datalist"],HTMLDetailsElement:["details"],HTMLDialogElement:["dialog"],HTMLDirectoryElement:["dir"],HTMLDivElement:["div"],HTMLDocument:["document"],HTMLElement:["element","abbr","address","article","aside","b","bdi","bdo","cite","code","command","dd","dfn","dt","em","figcaption","figure","footer","header","i","kbd","mark","nav","noscript","rp","rt","ruby","s","samp","section","small","strong","sub","summary","sup","u","var","wbr"],HTMLEmbedElement:["embed"],HTMLFieldSetElement:["fieldset"],HTMLFontElement:["font"],HTMLFormElement:["form"],HTMLFrameElement:["frame"],HTMLFrameSetElement:["frameset"],HTMLHRElement:["hr"],HTMLHeadElement:["head"],HTMLHeadingElement:["h1","h2","h3","h4","h5","h6"],HTMLHtmlElement:["html"],HTMLIFrameElement:["iframe"],HTMLImageElement:["img"],HTMLInputElement:["input"],HTMLKeygenElement:["keygen"],HTMLLIElement:["li"],HTMLLabelElement:["label"],HTMLLegendElement:["legend"],HTMLLinkElement:["link"],HTMLMapElement:["map"],HTMLMarqueeElement:["marquee"],HTMLMediaElement:["media"],HTMLMenuElement:["menu"],HTMLMenuItemElement:["menuitem"],HTMLMetaElement:["meta"],HTMLMeterElement:["meter"],HTMLModElement:["del","ins"],HTMLOListElement:["ol"],HTMLObjectElement:["object"],HTMLOptGroupElement:["optgroup"],HTMLOptionElement:["option"],HTMLOutputElement:["output"],HTMLParagraphElement:["p"],HTMLParamElement:["param"],HTMLPictureElement:["picture"],HTMLPreElement:["pre"],HTMLProgressElement:["progress"],HTMLQuoteElement:["blockquote","q","quote"],HTMLScriptElement:["script"],HTMLSelectElement:["select"],HTMLShadowElement:["shadow"],HTMLSlotElement:["slot"],HTMLSourceElement:["source"],HTMLSpanElement:["span"],HTMLStyleElement:["style"],HTMLTableCaptionElement:["caption"],HTMLTableCellElement:["td","th"],HTMLTableColElement:["col","colgroup"],HTMLTableElement:["table"],HTMLTableRowElement:["tr"],HTMLTableSectionElement:["thead","tbody","tfoot"],HTMLTemplateElement:["template"],HTMLTextAreaElement:["textarea"],HTMLTimeElement:["time"],HTMLTitleElement:["title"],HTMLTrackElement:["track"],HTMLUListElement:["ul"],HTMLUnknownElement:["unknown","vhgroupv","vkeygen"],HTMLVideoElement:["video"]},nodes:{Attr:["node"],Audio:["audio"],CDATASection:["node"],CharacterData:["node"],Comment:["#comment"],Document:["#document"],DocumentFragment:["#document-fragment"],DocumentType:["node"],HTMLDocument:["#document"],Image:["img"],Option:["option"],ProcessingInstruction:["node"],ShadowRoot:["#shadow-root"],Text:["#text"],XMLDocument:["xml"]}});t||(t="auto");var s="registerElement",o="__"+s+(e.Math.random()*1e5>>0),u="addEventListener",a="attached",f="Callback",l="detached",c="extends",h="attributeChanged"+f,p=a+f,d="connected"+f,v="disconnected"+f,m="created"+f,g=l+f,y="ADDITION",b="MODIFICATION",w="REMOVAL",E="DOMAttrModified",S="DOMContentLoaded",x="DOMSubtreeModified",T="<",N="=",C=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,k=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],L=[],A=[],O="",M=n.documentElement,_=L.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},D=r.prototype,P=D.hasOwnProperty,H=D.isPrototypeOf,B=r.defineProperty,j=[],F=r.getOwnPropertyDescriptor,I=r.getOwnPropertyNames,q=r.getPrototypeOf,R=r.setPrototypeOf,U=!!r.__proto__,z=!1,W="__dreCEv1",X=e.customElements,V=t!=="force"&&!!(X&&X.define&&X.get&&X.whenDefined),$=r.create||r,J=e.Map||function(){var t=[],n=[],r;return{get:function(e){return n[_.call(t,e)]},set:function(e,i){r=_.call(t,e),r<0?n[t.push(e)-1]=i:n[r]=i}}},K=e.Promise||function(e){function i(e){n=!0;while(t.length)t.shift()(e)}var t=[],n=!1,r={"catch":function(){return r},then:function(e){return t.push(e),n&&setTimeout(i,1),r}};return e(i),r},Q=!1,G=$(null),Y=$(null),Z=new J,et=String,tt=r.create||function sn(e){return e?(sn.prototype=e,new sn):this},nt=R||(U?function(e,t){return e.__proto__=t,e}:I&&F?function(){function e(e,t){for(var n,r=I(t),i=0,s=r.length;i<s;i++)n=r[i],P.call(e,n)||B(e,n,F(t,n))}return function(t,n){do e(t,n);while((n=q(n))&&!H.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),rt=e.MutationObserver||e.WebKitMutationObserver,it=(e.HTMLElement||e.Element||e.Node).prototype,st=!H.call(it,M),ot=st?function(e,t,n){return e[t]=n.value,e}:B,ut=st?function(e){return e.nodeType===1}:function(e){return H.call(it,e)},at=st&&[],ft=it.attachShadow,lt=it.cloneNode,ct=it.dispatchEvent,ht=it.getAttribute,pt=it.hasAttribute,dt=it.removeAttribute,vt=it.setAttribute,mt=n.createElement,gt=mt,yt=rt&&{attributes:!0,characterData:!0,attributeOldValue:!0},bt=rt||function(e){Nt=!1,M.removeEventListener(E,bt)},wt,Et=0,St=s in n,xt=!0,Tt=!1,Nt=!0,Ct=!0,kt=!0,Lt,At,Ot,Mt,_t,Dt,Pt;St||(R||U?(Dt=function(e,t){H.call(t,e)||Xt(e,t)},Pt=Xt):(Dt=function(e,t){e[o]||(e[o]=r(!0),Xt(e,t))},Pt=Dt),st?(Nt=!1,function(){var e=F(it,u),t=e.value,n=function(e){var t=new CustomEvent(E,{bubbles:!0});t.attrName=e,t.prevValue=ht.call(this,e),t.newValue=null,t[w]=t.attrChange=2,dt.call(this,e),ct.call(this,t)},r=function(e,t){var n=pt.call(this,e),r=n&&ht.call(this,e),i=new CustomEvent(E,{bubbles:!0});vt.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[b]=i.attrChange=1:i[y]=i.attrChange=0,ct.call(this,i)},i=function(e){var t=e.currentTarget,n=t[o],r=e.propertyName,i;n.hasOwnProperty(r)&&(n=n[r],i=new CustomEvent(E,{bubbles:!0}),i.attrName=n.name,i.prevValue=n.value||null,i.newValue=n.value=t[r]||null,i.prevValue==null?i[y]=i.attrChange=0:i[b]=i.attrChange=1,ct.call(t,i))};e.value=function(e,s,u){e===E&&this[h]&&this.setAttribute!==r&&(this[o]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",i)),t.call(this,e,s,u)},B(it,u,e)}()):rt||(M[u](E,bt),M.setAttribute(o,1),M.removeAttribute(o),Nt&&(Lt=function(e){var t=this,n,r,i;if(t===e.target){n=t[o],t[o]=r=Ot(t);for(i in r){if(!(i in n))return At(0,t,i,n[i],r[i],y);if(r[i]!==n[i])return At(1,t,i,n[i],r[i],b)}for(i in n)if(!(i in r))return At(2,t,i,n[i],r[i],w)}},At=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,Rt(o)},Ot=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),n[s]=function(t,r){p=t.toUpperCase(),xt&&(xt=!1,rt?(Mt=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new rt(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,kt&&s[h]&&i.attributeName!=="style"&&(o=ht.call(s,i.attributeName),o!==i.oldValue&&s[h](i.attributeName,i.oldValue,o)))})}(Ft(a),Ft(l)),_t=function(e){return Mt.observe(e,{childList:!0,subtree:!0}),e},_t(n),ft&&(it.attachShadow=function(){return _t(ft.apply(this,arguments))})):(wt=[],n[u]("DOMNodeInserted",Ut(a)),n[u]("DOMNodeRemoved",Ut(l))),n[u](S,zt),n[u]("readystatechange",zt),it.cloneNode=function(e){var t=lt.call(this,!!e),n=It(t);return-1<n&&Pt(t,A[n]),e&&O.length&&jt(t.querySelectorAll(O)),t});if(Tt)return Tt=!1;-2<_.call(L,N+p)+_.call(L,T+p)&&$t(t);if(!C.test(p)||-1<_.call(k,p))throw new Error("The type "+t+" is invalid");var i=function(){return o?n.createElement(f,p):n.createElement(f)},s=r||D,o=P.call(s,c),f=o?r[c].toUpperCase():p,p,d;return o&&-1<_.call(L,T+f)&&$t(f),d=L.push((o?N:T)+p)-1,O=O.concat(O.length?",":"",o?f+'[is="'+t.toLowerCase()+'"]':f),i.prototype=A[d]=P.call(s,"prototype")?s.prototype:tt(it),O.length&&Bt(n.querySelectorAll(O),a),i},n.createElement=gt=function(e,t){var r=Yt(t),i=r?mt.call(n,e,et(r)):mt.call(n,e),s=""+e,o=_.call(L,(r?N:T)+(r||s).toUpperCase()),u=-1<o;return r&&(i.setAttribute("is",r=r.toLowerCase()),u&&(u=qt(s.toUpperCase(),r))),kt=!n.createElement.innerHTMLHelper,u&&Pt(i,A[o]),i}),Kt.prototype={constructor:Kt,define:V?function(e,t,n){if(n)Qt(e,t,n);else{var r=e.toUpperCase();G[r]={constructor:t,create:[r]},Z.set(t,r),X.define(e,t)}}:Qt,get:V?function(e){return X.get(e)||Gt(e)}:Gt,whenDefined:V?function(e){return K.race([X.whenDefined(e),en(e)])}:en};if(!X||t==="force")tn();else try{(function(t,r,i){r[c]="a",t.prototype=tt(HTMLAnchorElement.prototype),t.prototype.constructor=t,e.customElements.define(i,t,r);if(ht.call(n.createElement("a",{is:i}),"is")!==i||V&&ht.call(new t,"is")!==i)throw r})(function on(){return Reflect.construct(HTMLAnchorElement,[],on)},{},"document-register-element-a")}catch(nn){tn()}try{mt.call(n,"a","a")}catch(rn){et=function(e){return{is:e}}}})(window);
/*! (C) Ionic, https://ionicframework.com/ - Mit License */
(function (window, document) {
    "use strict";

    function PlatformClient(win, doc, ionic, staticDir, domCtrl, nextTickCtrl) {
        var registry = {};
        var bundleCBs = {};
        var jsonReqs = [];
        var css = {};
        var hasNativeShadowDom = !(win.ShadyDOM && win.ShadyDOM.inUse);
        ionic.loadComponents = function loadComponent(bundleId) {
            var args = arguments;
            for (var i = 1; i < args.length; i++) {
                var cmpModeData = args[i];
                var tag = cmpModeData[0];
                var mode = cmpModeData[1];
                var cmpMeta = registry[tag];
                var cmpMode = cmpMeta.modes[mode];
                cmpMode.styles = cmpModeData[2];
                var importModuleFn = cmpModeData[3];
                var moduleImports = {};
                importModuleFn(moduleImports);
                cmpMeta.componentModule = moduleImports[Object.keys(moduleImports)[0]];
                cmpMode.isLoaded = true;
            }
            var callbacks = bundleCBs[bundleId];
            if (callbacks) {
                for (var i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i]();
                }
                delete bundleCBs[bundleId];
            }
        };
        function loadComponent(cmpMeta, cmpMode, cb) {
            if (cmpMode && cmpMode.isLoaded) {
                cb(cmpMeta, cmpMode);
            } else {
                var bundleId = cmpMode.bundleId;
                if (bundleCBs[bundleId]) {
                    bundleCBs[bundleId].push(cb);
                } else {
                    bundleCBs[bundleId] = [cb];
                }
                var url = staticDir + 'ionic.' + bundleId;
                if (ionic.devMode) {
                    url += '.dev';
                }
                url += '.js';
                if (jsonReqs.indexOf(url) === -1) {
                    jsonp(url);
                }
            }
        }
        function jsonp(jsonpUrl) {
            jsonReqs.push(jsonpUrl);
            var scriptElm = createElement('script');
            scriptElm.charset = 'utf-8';
            scriptElm.async = true;
            scriptElm.src = jsonpUrl;
            var tmrId = setTimeout(onScriptComplete, 120000);
            function onScriptComplete() {
                clearTimeout(tmrId);
                scriptElm.onerror = scriptElm.onload = null;
                scriptElm.parentNode.removeChild(scriptElm);
                var index = jsonReqs.indexOf(jsonpUrl);
                if (index > -1) {
                    jsonReqs.splice(index, 1);
                }
            }
            scriptElm.onerror = scriptElm.onload = onScriptComplete;
            doc.head.appendChild(scriptElm);
        }
        function attachShadow(elm, cmpMode, cmpModeId) {
            var shadowElm = elm.attachShadow({ mode: 'open' });
            if (hasNativeShadowDom) {
                if (!cmpMode.styleElm) {
                    cmpMode.styleElm = createElement('style');
                    cmpMode.styleElm.innerHTML = cmpMode.styles;
                }
                shadowElm.appendChild(cmpMode.styleElm.cloneNode(true));
            } else {
                if (!hasCss(cmpModeId)) {
                    var headStyleEle = createElement('style');
                    headStyleEle.dataset['cmpModeId'] = cmpModeId;
                    headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
                    appendChild(doc.head, headStyleEle);
                    setCss(cmpModeId);
                }
            }
            return shadowElm;
        }
        function registerComponent(cmpMeta) {
            registry[cmpMeta.tag] = cmpMeta;
        }
        function getComponentMeta(tag) {
            return registry[tag];
        }
        function createElement(tagName) {
            return doc.createElement(tagName);
        }
        function createElementNS(namespaceURI, qualifiedName) {
            return doc.createElementNS(namespaceURI, qualifiedName);
        }
        function createTextNode(text) {
            return doc.createTextNode(text);
        }
        function createComment(text) {
            return doc.createComment(text);
        }
        function insertBefore(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        }
        function removeChild(parentNode, childNode) {
            parentNode.removeChild(childNode);
        }
        function appendChild(parentNode, childNode) {
            parentNode.appendChild(childNode);
        }
        function parentNode(node) {
            return node.parentNode;
        }
        function nextSibling(node) {
            return node.nextSibling;
        }
        function tagName(elm) {
            return (elm.tagName || '').toLowerCase();
        }
        function setTextContent(node, text) {
            node.textContent = text;
        }
        function getTextContent(node) {
            return node.textContent;
        }
        function getAttribute(elm, attrName) {
            return elm.getAttribute(attrName);
        }
        function isElement(node) {
            return node.nodeType === 1;
        }
        function isText(node) {
            return node.nodeType === 3;
        }
        function isComment(node) {
            return node.nodeType === 8;
        }
        function hasCss(moduleId) {
            return !!css[moduleId];
        }
        function setCss(linkUrl) {
            css[linkUrl] = true;
        }
        return {
            registerComponent: registerComponent,
            getComponentMeta: getComponentMeta,
            loadComponent: loadComponent,
            isElement: isElement,
            isText: isText,
            isComment: isComment,
            nextTick: nextTickCtrl.nextTick.bind(nextTickCtrl),
            domRead: domCtrl.read.bind(domCtrl),
            domWrite: domCtrl.write.bind(domCtrl),
            $createElement: createElement,
            $createElementNS: createElementNS,
            $createTextNode: createTextNode,
            $createComment: createComment,
            $insertBefore: insertBefore,
            $removeChild: removeChild,
            $appendChild: appendChild,
            $parentNode: parentNode,
            $nextSibling: nextSibling,
            $tagName: tagName,
            $setTextContent: setTextContent,
            $getTextContent: getTextContent,
            $getAttribute: getAttribute,
            $attachShadow: attachShadow
        };
    }

    function vnode(sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, vdata: data, vchildren: children,
            vtext: text, elm: elm, vkey: key };
    }

    function isDef(s) {
        return s !== undefined && s !== null;
    }
    function isUndef(s) {
        return s === undefined;
    }
    var isArray = Array.isArray;
    function isPrimitive(s) {
        return isString(s) || isNumber(s);
    }

    function isString(val) {
        return typeof val === 'string';
    }
    function isNumber(val) {
        return typeof val === 'number';
    }
    function toCamelCase(str) {
        return str.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    }
    function toDashCase(str) {
        return str.replace(/([A-Z])/g, function (g) {
            return '-' + g[0].toLowerCase();
        });
    }
    function getPropValue(propType, value) {
        if (propType === 'boolean') {
            if (isString(value)) {
                return value !== 'false';
            }
            return !!value;
        }
        if (propType === 'number') {
            if (isNumber(value)) {
                return value;
            }
            try {
                return parseFloat(value);
            } catch (e) {}
            return NaN;
        }
        return value;
    }

    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xmlNS = 'http://www.w3.org/XML/1998/namespace';
    function updateAttrs(oldVnode, vnode) {
        var key,
            cur,
            old,
            elm = vnode.elm,
            oldAttrs = oldVnode.vdata.attrs,
            attrs = vnode.vdata.attrs;
        if (!oldAttrs && !attrs) return;
        if (oldAttrs === attrs) return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];
            if (old !== cur) {
                if (typeof cur === 'boolean') {
                    if (cur) {
                        elm.setAttribute(key, "");
                    } else {
                        elm.removeAttribute(key);
                    }
                } else {
                    if (key.charCodeAt(0) !== 120) {
                        elm.setAttribute(key, cur);
                    } else if (key.charCodeAt(3) === 58) {
                        // Assume xml namespace
                        elm.setAttributeNS(xmlNS, key, cur);
                    } else if (key.charCodeAt(5) === 58) {
                        // Assume xlink namespace
                        elm.setAttributeNS(xlinkNS, key, cur);
                    } else {
                        elm.setAttribute(key, cur);
                    }
                }
            }
        }
        // remove removed attributes
        // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
        // the other option is to remove all attributes with value == undefined
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }

    function updateClass(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldClass = oldVnode.vdata.class,
            klass = vnode.vdata.class;
        if (!oldClass && !klass) return;
        if (oldClass === klass) return;
        oldClass = oldClass || {};
        klass = klass || {};
        for (name in oldClass) {
            if (!klass[name]) {
                elm.classList.remove(name);
            }
        }
        for (name in klass) {
            cur = klass[name];
            if (cur !== oldClass[name]) {
                elm.classList[cur ? 'add' : 'remove'](name);
            }
        }
    }

    function addNS(data, children, sel) {
        data.ns = 'http://www.w3.org/2000/svg';
        if (sel !== 'foreignObject' && children !== undefined) {
            for (var i = 0; i < children.length; ++i) {
                var childData = children[i].vdata;
                if (childData !== undefined) {
                    addNS(childData, children[i].vchildren, children[i].sel);
                }
            }
        }
    }
    function h(sel, b, c) {
        var data = {},
            children,
            text,
            i;
        var elm = undefined;
        if (sel.nodeType) {
            elm = sel;
        }
        if (c !== undefined) {
            data = b;
            if (isArray(c)) {
                children = c;
            } else if (isPrimitive(c)) {
                text = c;
            } else if (c && c.sel) {
                children = [c];
            }
        } else if (b !== undefined) {
            if (isArray(b)) {
                children = b;
            } else if (isPrimitive(b)) {
                text = b;
            } else if (b && b.sel) {
                children = [b];
            } else {
                data = b;
            }
        }
        if (isArray(children)) {
            for (i = 0; i < children.length; ++i) {
                if (isPrimitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i]);
            }
        }
        if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
            addNS(data, children, sel);
        }
        return vnode(sel, data, children, text, elm);
    }

    var emptyNode = vnode('', {}, [], undefined, undefined);
    function sameVnode(vnode1, vnode2) {
        return vnode1.vkey === vnode2.vkey && vnode1.sel === vnode2.sel;
    }
    function isVnode(vnode$$1) {
        return vnode$$1.sel !== undefined || vnode$$1.elm !== undefined;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i = void 0,
            map = {},
            key = void 0,
            ch = void 0;
        for (i = beginIdx; i <= endIdx; ++i) {
            ch = children[i];
            if (ch != null) {
                key = ch.vkey;
                if (key !== undefined) map[key] = i;
            }
        }
        return map;
    }
    function initRenderer(api) {
        function emptyNodeAt(elm) {
            var id = elm.id ? '#' + elm.id : '';
            var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
            return vnode(api.$tagName(elm) + id + c, {}, [], undefined, elm);
        }
        function createRmCb(childElm) {
            return function rmCb() {
                var parent = api.$parentNode(childElm);
                api.$removeChild(parent, childElm);
            };
        }
        function createElm(vnode$$1, insertedVnodeQueue) {
            var i = void 0,
                data = vnode$$1.vdata;
            if (data !== undefined) {
                if (isDef(i = data.hook) && isDef(i = i.init)) {
                    i(vnode$$1);
                    data = vnode$$1.vdata;
                }
            }
            var children = vnode$$1.vchildren,
                sel = vnode$$1.sel;
            if (sel === '!') {
                if (isUndef(vnode$$1.vtext)) {
                    vnode$$1.vtext = '';
                }
                vnode$$1.elm = api.$createComment(vnode$$1.vtext);
            } else if (sel !== undefined) {
                // Parse selector
                var hashIdx = sel.indexOf('#');
                var dotIdx = sel.indexOf('.', hashIdx);
                var hash = hashIdx > 0 ? hashIdx : sel.length;
                var dot = dotIdx > 0 ? dotIdx : sel.length;
                var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                var elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.$createElementNS(i, tag) : api.$createElement(tag);
                if (hash < dot) elm.id = sel.slice(hash + 1, dot);
                if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
                updateAttrs(emptyNode, vnode$$1);
                updateClass(emptyNode, vnode$$1);
                if (isArray(children)) {
                    for (i = 0; i < children.length; ++i) {
                        var ch = children[i];
                        if (ch != null) {
                            api.$appendChild(elm, createElm(ch, insertedVnodeQueue));
                        }
                    }
                } else if (isPrimitive(vnode$$1.vtext)) {
                    api.$appendChild(elm, api.$createTextNode(vnode$$1.vtext));
                }
                i = vnode$$1.vdata.hook; // Reuse variable
                if (isDef(i)) {
                    if (i.create) i.create(emptyNode, vnode$$1);
                    if (i.insert) insertedVnodeQueue.push(vnode$$1);
                }
            } else {
                vnode$$1.elm = api.$createTextNode(vnode$$1.vtext);
            }
            return vnode$$1.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (ch != null) {
                    api.$insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var i = void 0,
                    rm = void 0,
                    ch = vnodes[startIdx];
                if (ch != null) {
                    if (isDef(ch.sel)) {
                        rm = createRmCb(ch.elm);
                        if (isDef(i = ch.vdata) && isDef(i = i.hook) && isDef(i = i.remove)) {
                            i(ch, rm);
                        } else {
                            rm();
                        }
                    } else {
                        api.$removeChild(parentElm, ch.elm);
                    }
                }
            }
        }
        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
            var oldStartIdx = 0,
                newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx = void 0;
            var idxInOld = void 0;
            var elmToMove = void 0;
            var before = void 0;
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVnode == null) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                } else if (oldEndVnode == null) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (newStartVnode == null) {
                    newStartVnode = newCh[++newStartIdx];
                } else if (newEndVnode == null) {
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    api.$insertBefore(parentElm, oldStartVnode.elm, api.$nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    api.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (oldKeyToIdx === undefined) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.vkey];
                    if (isUndef(idxInOld)) {
                        api.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.sel !== newStartVnode.sel) {
                            api.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        } else {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            api.$insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                        }
                        newStartVnode = newCh[++newStartIdx];
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
            var i = void 0,
                hook = void 0;
            if (isDef(i = vnode$$1.vdata) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
                i(oldVnode, vnode$$1);
            }
            var elm = vnode$$1.elm = oldVnode.elm;
            var oldCh = oldVnode.vchildren;
            var ch = vnode$$1.vchildren;
            if (oldVnode === vnode$$1) return;
            if (vnode$$1.vdata !== undefined) {
                updateAttrs(oldVnode, vnode$$1);
                updateClass(oldVnode, vnode$$1);
                i = vnode$$1.vdata.hook;
                if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode$$1);
            }
            if (isUndef(vnode$$1.vtext)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                        updateChildren(elm.shadowRoot || elm, oldCh, ch, insertedVnodeQueue);
                    }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.vtext)) api.$setTextContent(elm, '');
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.vtext)) {
                    api.$setTextContent(elm, '');
                }
            } else if (oldVnode.vtext !== vnode$$1.vtext) {
                api.$setTextContent(elm, vnode$$1.vtext);
            }
            if (isDef(hook) && isDef(i = hook.postpatch)) {
                i(oldVnode, vnode$$1);
            }
        }
        return function patch(oldVnode, vnode$$1) {
            var elm = void 0,
                parent = void 0;
            var insertedVnodeQueue = [];
            if (!isVnode(oldVnode)) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            if (vnode$$1.elm || sameVnode(oldVnode, vnode$$1)) {
                patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
            } else {
                elm = oldVnode.elm;
                parent = api.$parentNode(elm);
                createElm(vnode$$1, insertedVnodeQueue);
                if (parent !== null) {
                    api.$insertBefore(parent, vnode$$1.elm, api.$nextSibling(elm));
                    removeVnodes(parent, [oldVnode], 0, 0);
                }
            }
            return vnode$$1;
        };
    }

    function attributeChangedCallback(elm, cmpMeta, attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            var propName = toCamelCase(attrName);
            if (cmpMeta.props[propName]) {
                elm[propName] = getPropValue(cmpMeta.props[propName].type, newVal);
            }
        }
    }

    function generateVNode(utils, elm, instance, hostCss) {
        var vnode$$1 = instance.render && instance.render(h, utils);
        if (!vnode$$1) {
            // use the default render function instead
            vnode$$1 = h(elm, h('div', theme(hostCss, instance.mode, instance.color), h('slot')));
        }
        delete vnode$$1.sel;
        return vnode$$1;
    }
    function theme(cssClassName, mode, color) {
        var cssClasses = {};
        cssClasses['' + cssClassName] = true;
        if (mode) {
            cssClasses[cssClassName + '-' + mode] = true;
            if (color) {
                cssClasses[cssClassName + '-' + color] = cssClasses[cssClassName + '-' + mode + '-' + color] = true;
            }
        }
        return {
            class: cssClasses
        };
    }

    function initProps(utils, plt, config, renderer, elm, ctrl, tag, props) {
        var instance = ctrl.instance;
        var lastPropValues = {};
        Object.keys(props).forEach(function (propName) {
            lastPropValues[propName] = getInitialValue(plt, config, elm, props, propName);
            function getPropValue$$1() {
                return lastPropValues[propName];
            }
            // dom's element instance
            Object.defineProperty(elm, propName, {
                get: getPropValue$$1,
                set: function setPropValue(value) {
                    if (lastPropValues[propName] !== value) {
                        lastPropValues[propName] = value;
                        queueUpdate(utils, plt, config, renderer, elm, ctrl, tag);
                    }
                }
            });
            // user's component instance
            Object.defineProperty(instance, propName, {
                get: getPropValue$$1,
                set: function invalidSetProperty() {
                    console.error(propName + ': passed in property values cannot be changed');
                }
            });
        });
    }
    function getInitialValue(plt, config, elm, props, propName) {
        var value = elm[propName];
        if (value !== undefined) {
            return value;
        }
        value = plt.$getAttribute(elm, toCamelCase(propName));
        if (value !== null && value !== '') {
            return getPropValue(props[propName].type, value);
        }
        value = config.get(propName);
        if (value !== null) {
            return value;
        }
    }
    function initComponentMeta(tag, data) {
        var modeBundleIds = data[0];
        var props = data[1] || {};
        var cmpMeta = {
            tag: tag,
            modes: {},
            props: props
        };
        var keys = Object.keys(modeBundleIds);
        for (var i = 0; i < keys.length; i++) {
            cmpMeta.modes[keys[i]] = {
                bundleId: modeBundleIds[keys[i]]
            };
        }
        keys = cmpMeta.tag.split('-');
        keys.shift();
        cmpMeta.hostCss = keys.join('-');
        props.color = {};
        props.mode = {};
        var observedAttributes = cmpMeta.observedAttrs = cmpMeta.observedAttrs || [];
        keys = Object.keys(props);
        for (i = 0; i < keys.length; i++) {
            observedAttributes.push(toDashCase(keys[i]));
        }
        return cmpMeta;
    }

    function queueUpdate(utils, plt, config, renderer, elm, ctrl, tag) {
        // only run patch if it isn't queued already
        if (!ctrl.queued) {
            ctrl.queued = true;
            // run the patch in the next tick
            plt.nextTick(function queueUpdateNextTick() {
                // vdom diff and patch the host element for differences
                update(utils, plt, config, renderer, elm, ctrl, tag);
                // no longer queued
                ctrl.queued = false;
            });
        }
    }
    function update(utils, plt, config, renderer, elm, ctrl, tag) {
        var cmpMeta = plt.getComponentMeta(tag);
        var instance = ctrl.instance;
        if (!instance) {
            instance = ctrl.instance = new cmpMeta.componentModule();
            initProps(utils, plt, config, renderer, elm, ctrl, tag, cmpMeta.props);
        }
        if (!ctrl.rootElm) {
            var cmpMode = cmpMeta.modes[instance.mode];
            var cmpModeId = tag + '.' + instance.mode;
            ctrl.rootElm = plt.$attachShadow(elm, cmpMode, cmpModeId);
        }
        var vnode = generateVNode(utils, ctrl.rootElm, instance, cmpMeta.hostCss);
        // if we already have a vnode then use it
        // otherwise, elm is the initial patch and
        // we need it to pass it the actual host element
        ctrl.vnode = renderer(ctrl.vnode ? ctrl.vnode : elm, vnode);
    }

    function connectedCallback(utils, plt, config, renderer, elm, ctrl, cmpMeta) {
        plt.nextTick(function () {
            var tag = cmpMeta.tag;
            var mode = getMode(plt, config, elm, 'mode');
            var cmpMode = cmpMeta.modes[mode];
            plt.loadComponent(cmpMeta, cmpMode, function loadComponentCallback() {
                queueUpdate(utils, plt, config, renderer, elm, ctrl, tag);
            });
        });
    }
    function getMode(plt, config, elm, propName) {
        var value = elm[propName];
        if (isDef(value)) {
            return value;
        }
        value = plt.$getAttribute(elm, propName);
        if (isDef(value)) {
            return value;
        }
        return config.get(propName, 'md');
    }

    function disconnectedCallback(ctrl) {
        if (ctrl) {
            ctrl.instance = ctrl.vnode = ctrl.rootElm = null;
        }
    }

    function registerComponentsES5(renderer, plt, config, components) {
        var cmpControllers = new WeakMap();
        var utils = {
            theme: theme
        };
        Object.keys(components || {}).forEach(function (tag) {
            var cmpMeta = initComponentMeta(tag, components[tag]);
            plt.registerComponent(cmpMeta);
            function ProxyElement(self) {
                return HTMLElement.call(this, self);
            }
            ProxyElement.prototype = Object.create(HTMLElement.prototype, {
                constructor: { value: ProxyElement, configurable: true },
                connectedCallback: { configurable: true, value: function () {
                        var ctrl = {};
                        cmpControllers.set(this, ctrl);
                        connectedCallback(utils, plt, config, renderer, this, ctrl, cmpMeta);
                    }
                },
                attributeChangedCallback: { configurable: true, value: function (attrName, oldVal, newVal) {
                        attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
                    }
                },
                disconnectedCallback: { configurable: true, value: function () {
                        disconnectedCallback(cmpControllers.get(this));
                        cmpControllers.delete(this);
                    }
                }
            });
            ProxyElement.observedAttributes = cmpMeta.observedAttrs;
            window.customElements.define(tag, ProxyElement);
        });
    }

    var ionic = window.Ionic = window.Ionic || {};
    var plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
    var renderer = initRenderer(plt);
    registerComponentsES5(renderer, plt, ionic.configCtrl, ionic.components);
})(window, document);