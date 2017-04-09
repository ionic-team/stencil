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

    function registerComponents(renderer, plt, config, components) {
        var cmpControllers = new WeakMap();
        var utils = {
            theme: theme
        };
        Object.keys(components || {}).forEach(function (tag) {
            var cmpMeta = initComponentMeta(tag, components[tag]);
            plt.registerComponent(cmpMeta);
            // closure doesn't support outputting es6 classes (yet)
            // build step does some closure tricks by changing this class
            // to just a function for compiling, then changing it back to a class
            class ProxyElement extends HTMLElement {}
            ProxyElement.prototype.connectedCallback = function () {
                var ctrl = {};
                cmpControllers.set(this, ctrl);
                connectedCallback(utils, plt, config, renderer, this, ctrl, cmpMeta);
            };
            ProxyElement.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
                attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
            };
            ProxyElement.prototype.disconnectedCallback = function () {
                disconnectedCallback(cmpControllers.get(this));
                cmpControllers.delete(this);
            };
            ProxyElement.observedAttributes = cmpMeta.observedAttrs;
            window.customElements.define(tag, ProxyElement);
        });
    }

    var ionic = window.Ionic = window.Ionic || {};
    // most of the controllers are added to window.Ionic within ionic-angular
    var plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
    var renderer = initRenderer(plt);
    registerComponents(renderer, plt, ionic.configCtrl, ionic.components);
})(window, document);