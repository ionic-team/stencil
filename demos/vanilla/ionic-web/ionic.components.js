(function (window, document, components) {

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
    function getStaticComponentDir(doc) {
        var staticDirEle = doc.querySelector('script[data-static-dir]');
        if (staticDirEle) {
            return staticDirEle.dataset['staticDir'];
        }
        var scriptElms = doc.getElementsByTagName('script');
        staticDirEle = scriptElms[scriptElms.length - 1];
        var paths = staticDirEle.src.split('/');
        paths.pop();
        return staticDirEle.dataset['staticDir'] = paths.join('/') + '/';
    }

    function attributeChangedCallback(instance, cmpMeta, attrName, oldVal, newVal, namespace) {
        if (!instance) return;
        var propName = toCamelCase(attrName);
        if (cmpMeta.props[propName]) {
            instance[propName] = newVal;
        }
        instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
    }

    function initState(plt, config, renderer, elm, ctrl, cmpMeta) {
        var instance = ctrl.instance;
        var state = ctrl.state = {};
        var props = cmpMeta.props || {};
        Object.keys(props).forEach(function (propName) {
            if (isUndef(instance[propName])) {
                // no instance value, so get it from the element
                state[propName] = elm[propName];
            } else if (isUndef(elm[propName])) {
                // no element value, so get it from from instance
                // but also be sure to set the element to have the same value
                // before we assign the getters/setters
                state[propName] = elm[propName] = instance[propName];
            }
            function getState() {
                return state[propName];
            }
            function setState(value) {
                value = getValue$1(props[propName], value);
                if (state[propName] !== value) {
                    state[propName] = value;
                    update(plt, config, renderer, elm, ctrl, cmpMeta);
                }
            }
            Object.defineProperty(elm, propName, {
                get: getState,
                set: setState
            });
            Object.defineProperty(instance, propName, {
                get: getState,
                set: setState
            });
        });
    }
    function getValue$1(propOpts, value) {
        if (propOpts.type === 'boolean') {
            if (isString(value)) {
                return value !== 'false';
            }
            return !!value;
        }
        if (propOpts.type === 'number') {
            if (isNumber(value)) {
                return value;
            }
            return parseFloat(value);
        }
        return value;
    }

    function vnode(sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, data: data, children: children,
            text: text, elm: elm, key: key };
    }

    var NamespaceURIs = {
        "xlink": "http://www.w3.org/1999/xlink"
    };
    var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];
    var booleanAttrsDict = Object.create(null);
    for (var i = 0, len = booleanAttrs.length; i < len; i++) {
        booleanAttrsDict[booleanAttrs[i]] = true;
    }
    function updateAttrs(oldVnode, vnode) {
        var key,
            cur,
            old,
            elm = vnode.elm,
            oldAttrs = oldVnode.data.attrs,
            attrs = vnode.data.attrs,
            namespaceSplit;
        if (!oldAttrs && !attrs) return;
        if (oldAttrs === attrs) return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];
            if (old !== cur) {
                if (!cur && booleanAttrsDict[key]) elm.removeAttribute(key);else {
                    namespaceSplit = key.split(":");
                    if (namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0])) elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);else elm.setAttribute(key, cur);
                }
            }
        }
        //remove removed attributes
        // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
        // the other option is to remove all attributes with value == undefined
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }
    var attributesModule = { create: updateAttrs, update: updateAttrs };

    function updateClass(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldClass = oldVnode.data.class,
            klass = vnode.data.class;
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
    var classModule = { create: updateClass, update: updateClass };

    function addNS(data, children, sel) {
        data.ns = 'http://www.w3.org/2000/svg';
        if (sel !== 'foreignObject' && children !== undefined) {
            for (var _i = 0; _i < children.length; ++_i) {
                var childData = children[_i].data;
                if (childData !== undefined) {
                    addNS(childData, children[_i].children, children[_i].sel);
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
        return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
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
                key = ch.key;
                if (key !== undefined) map[key] = i;
            }
        }
        return map;
    }
    var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
    function initRenderer(modules, api) {
        var i = void 0,
            j = void 0,
            cbs = {};
        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = [];
            for (j = 0; j < modules.length; ++j) {
                var hook = modules[j][hooks[i]];
                if (hook !== undefined) {
                    cbs[hooks[i]].push(hook);
                }
            }
        }
        function emptyNodeAt(elm) {
            var id = elm.id ? '#' + elm.id : '';
            var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
            return vnode(api.tag(elm) + id + c, {}, [], undefined, elm);
        }
        function createRmCb(childElm, listeners) {
            return function rmCb() {
                if (--listeners === 0) {
                    var parent = api.parentNode(childElm);
                    api.removeChild(parent, childElm);
                }
            };
        }
        function createElm(vnode$$1, insertedVnodeQueue) {
            var i = void 0,
                data = vnode$$1.data;
            if (data !== undefined) {
                if (isDef(i = data.hook) && isDef(i = i.init)) {
                    i(vnode$$1);
                    data = vnode$$1.data;
                }
            }
            var children = vnode$$1.children,
                sel = vnode$$1.sel;
            if (sel === '!') {
                if (isUndef(vnode$$1.text)) {
                    vnode$$1.text = '';
                }
                vnode$$1.elm = api.createComment(vnode$$1.text);
            } else if (sel !== undefined) {
                // Parse selector
                var hashIdx = sel.indexOf('#');
                var dotIdx = sel.indexOf('.', hashIdx);
                var hash = hashIdx > 0 ? hashIdx : sel.length;
                var dot = dotIdx > 0 ? dotIdx : sel.length;
                var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                var elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
                if (hash < dot) elm.id = sel.slice(hash + 1, dot);
                if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
                for (i = 0; i < cbs.create.length; ++i) {
                    cbs.create[i](emptyNode, vnode$$1);
                }if (isArray(children)) {
                    for (i = 0; i < children.length; ++i) {
                        var ch = children[i];
                        if (ch != null) {
                            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                        }
                    }
                } else if (isPrimitive(vnode$$1.text)) {
                    api.appendChild(elm, api.createTextNode(vnode$$1.text));
                }
                i = vnode$$1.data.hook; // Reuse variable
                if (isDef(i)) {
                    if (i.create) i.create(emptyNode, vnode$$1);
                    if (i.insert) insertedVnodeQueue.push(vnode$$1);
                }
            } else {
                vnode$$1.elm = api.createTextNode(vnode$$1.text);
            }
            return vnode$$1.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (ch != null) {
                    api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
                }
            }
        }
        function invokeDestroyHook(vnode$$1) {
            var i = void 0,
                j = void 0,
                data = vnode$$1.data;
            if (data !== undefined) {
                if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode$$1);
                for (i = 0; i < cbs.destroy.length; ++i) {
                    cbs.destroy[i](vnode$$1);
                }if (vnode$$1.children !== undefined) {
                    for (j = 0; j < vnode$$1.children.length; ++j) {
                        i = vnode$$1.children[j];
                        if (i != null && typeof i !== "string") {
                            invokeDestroyHook(i);
                        }
                    }
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var _i2 = void 0,
                    listeners = void 0,
                    rm = void 0,
                    ch = vnodes[startIdx];
                if (ch != null) {
                    if (isDef(ch.sel)) {
                        invokeDestroyHook(ch);
                        listeners = cbs.remove.length + 1;
                        rm = createRmCb(ch.elm, listeners);
                        for (_i2 = 0; _i2 < cbs.remove.length; ++_i2) {
                            cbs.remove[_i2](ch, rm);
                        }if (isDef(_i2 = ch.data) && isDef(_i2 = _i2.hook) && isDef(_i2 = _i2.remove)) {
                            _i2(ch, rm);
                        } else {
                            rm();
                        }
                    } else {
                        api.removeChild(parentElm, ch.elm);
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
                    api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (oldKeyToIdx === undefined) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.key];
                    if (isUndef(idxInOld)) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.sel !== newStartVnode.sel) {
                            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        } else {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
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
            if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
                i(oldVnode, vnode$$1);
            }
            var elm = vnode$$1.elm = oldVnode.elm;
            var oldCh = oldVnode.children;
            var ch = vnode$$1.children;
            if (oldVnode === vnode$$1) return;
            if (vnode$$1.data !== undefined) {
                for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode$$1);
                }i = vnode$$1.data.hook;
                if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode$$1);
            }
            if (isUndef(vnode$$1.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                        updateChildren(elm.shadowRoot || elm, oldCh, ch, insertedVnodeQueue);
                    }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) api.setTextContent(elm, '');
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.text)) {
                    api.setTextContent(elm, '');
                }
            } else if (oldVnode.text !== vnode$$1.text) {
                api.setTextContent(elm, vnode$$1.text);
            }
            if (isDef(hook) && isDef(i = hook.postpatch)) {
                i(oldVnode, vnode$$1);
            }
        }
        return function patch(oldVnode, vnode$$1) {
            var i = void 0,
                elm = void 0,
                parent = void 0;
            var insertedVnodeQueue = [];
            for (i = 0; i < cbs.pre.length; ++i) {
                cbs.pre[i]();
            }if (!isVnode(oldVnode)) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            if (vnode$$1.elm || sameVnode(oldVnode, vnode$$1)) {
                patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
            } else {
                elm = oldVnode.elm;
                parent = api.parentNode(elm);
                createElm(vnode$$1, insertedVnodeQueue);
                if (parent !== null) {
                    api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
                    removeVnodes(parent, [oldVnode], 0, 0);
                }
            }
            for (i = 0; i < insertedVnodeQueue.length; ++i) {
                insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
            }
            for (i = 0; i < cbs.post.length; ++i) {
                cbs.post[i]();
            }return vnode$$1;
        };
    }

    function generateVNode(elm, instance, cmpMeta) {
        var vnode$$1 = instance.render && instance.render();
        if (!vnode$$1) {
            vnode$$1 = h('.' + cmpMeta.hostCss, h('slot'));
        }
        vnode$$1.elm = elm;
        var hostCssClasses = vnode$$1.data.class = vnode$$1.data.class || {};
        var hostAttributes = vnode$$1.data.attrs = vnode$$1.data.attrs || {};
        var cssClasses = vnode$$1.sel.split('.');
        for (var i = 1; i < cssClasses.length; i++) {
            hostCssClasses[cssClasses[i]] = true;
        }
        delete vnode$$1.sel;
        hostCssClasses[cmpMeta.hostCss + '-' + instance.mode] = true;
        hostAttributes.mode = instance.mode;
        if (instance.color) {
            hostCssClasses[cmpMeta.hostCss + '-' + instance.color] = true;
            hostCssClasses[cmpMeta.hostCss + '-' + instance.mode + '-' + instance.color] = true;
            hostAttributes.color = instance.color;
        }
        return vnode$$1;
    }

    function update(plt, config, renderer, elm, ctrl, cmpMeta, cmpModule) {
        // only run patch if it isn't queued already
        if (!ctrl.queued) {
            ctrl.queued = true;
            // run the patch in the next tick
            plt.nextTick(function patchUpdate() {
                // vdom diff and patch the host element for differences
                patch(plt, config, renderer, elm, ctrl, cmpMeta, cmpModule);
                // no longer queued
                ctrl.queued = false;
            });
        }
    }
    function patch(plt, config, renderer, elm, ctrl, cmpMeta, cmpModule) {
        var instance = ctrl.instance;
        if (!instance) {
            instance = ctrl.instance = new cmpModule();
            initState(plt, config, renderer, elm, ctrl, cmpMeta);
        }
        instance.mode = getValue('mode', config, plt, elm);
        instance.color = getValue('color', config, plt, elm);
        if (!ctrl.root) {
            createRoot(plt, config, elm, ctrl, cmpMeta);
        }
        var vnode = generateVNode(ctrl.root, instance, cmpMeta);
        // if we already have a vnode then use it
        // otherwise, elm is the initial patch and
        // we need it to pass it the actual host element
        ctrl.vnode = renderer(ctrl.vnode ? ctrl.vnode : elm, vnode);
        if (!ctrl.connected) {
            instance.connectedCallback && instance.connectedCallback();
            ctrl.connected = true;
        }
    }
    function createRoot(plt, config, elm, ctrl, cmpMeta) {
        ctrl.shadowDom = !!elm.attachShadow;
        if (ctrl.shadowDom && cmpMeta.shadow !== false) {
            // huzzah!! support for native shadow DOM!
            ctrl.root = elm.attachShadow({ mode: 'open' });
            injectCssLink(plt, config, cmpMeta, ctrl.root, true);
        } else {
            // yeah, no native shadow DOM, but we can still do this, don't panic
            ctrl.root = elm;
            injectCssLink(plt, config, cmpMeta, plt.getDocumentHead(), false);
        }
    }
    function injectCssLink(plt, config, cmpMeta, parentNode, supportsShadowDom) {
        var modeStyleFilename = cmpMeta.modeStyleUrls[config.getValue('mode')];
        if (!modeStyleFilename) {
            return;
        }
        var linkUrl = plt.staticDir + modeStyleFilename;
        if (!supportsShadowDom) {
            linkUrl = linkUrl.replace('.css', '.scoped.css');
            if (plt.hasCssLink(linkUrl)) {
                return;
            }
            plt.setCssLink(linkUrl);
        }
        var linkEle = plt.createElement('link');
        linkEle.href = linkUrl;
        linkEle.rel = 'stylesheet';
        plt.appendChild(parentNode, linkEle);
    }
    function getValue(name, config, api, elm) {
        var fallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        var val = api.getPropOrAttr(elm, name);
        return isDef(val) ? val : config.getValue(name, fallback);
    }

    function disconnectedCallback(ctrl) {
        if (ctrl) {
            ctrl.instance && ctrl.instance.disconnectedCallback && ctrl.instance.disconnectedCallback();
            ctrl.instance = ctrl.state = ctrl.vnode = ctrl.root = null;
        }
    }

    class Config {
        constructor(config) {
            this.c = config;
        }
        getValue(key) {
            var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (key === 'mode') {
                return 'md';
            }
            return fallback;
        }
    }

    class PlatformClient {
        constructor(win, d) {
            this.win = win;
            this.d = d;
            this.registry = {};
            this.modules = {};
            this.loadCallbacks = {};
            this.activeRequests = [];
            this.cssLink = {};
            var self = this;
            self.win;
            self.staticDir = getStaticComponentDir(d);
            self.hasPromises = typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1;
            win.ionicComponent = function (tag, moduleFn) {
                console.debug('ionicComponent', tag);
                var cmpMeta = self.getComponentMeta(tag);
                var cmpModule = moduleFn();
                self.modules[tag] = cmpModule;
                var callbacks = self.loadCallbacks[tag];
                if (callbacks) {
                    callbacks.forEach(function (cb) {
                        cb(cmpMeta, cmpModule);
                    });
                    delete self.loadCallbacks[tag];
                }
            };
        }
        registerComponent(cmpMeta) {
            this.registry[cmpMeta.tag] = cmpMeta;
        }
        getComponentMeta(tag) {
            return this.registry[tag];
        }
        loadComponentModule(cmpMeta, cb) {
            var self = this;
            var loadedCallbacks = self.loadCallbacks;
            var tag = cmpMeta.tag;
            var cmpModule = self.modules[tag];
            if (cmpModule) {
                cb(cmpModule);
            } else if (cmpMeta.moduleUrl) {
                if (!loadedCallbacks[tag]) {
                    loadedCallbacks[tag] = [cb];
                } else {
                    loadedCallbacks[tag].push(cb);
                }
                self.jsonp(cmpMeta.moduleUrl);
            } else {
                cb(CommonComponent);
            }
        }
        jsonp(jsonpUrl) {
            var scriptTag;
            var tmrId;
            var self = this;
            // jsonpUrl = scriptsDir + jsonpUrl;
            if (self.activeRequests.indexOf(jsonpUrl) > -1) {
                return;
            }
            self.activeRequests.push(jsonpUrl);
            scriptTag = self.createElement('script');
            scriptTag.charset = 'utf-8';
            scriptTag.async = true;
            scriptTag.timeout = 120000;
            scriptTag.src = jsonpUrl;
            tmrId = setTimeout(onScriptComplete, 120000);
            function onScriptComplete() {
                clearTimeout(tmrId);
                scriptTag.onerror = scriptTag.onload = null;
                scriptTag.parentNode.removeChild(scriptTag);
                var index = self.activeRequests.indexOf(jsonpUrl);
                if (index > -1) {
                    self.activeRequests.splice(index, 1);
                }
            }
            scriptTag.onerror = scriptTag.onload = onScriptComplete;
            self.d.head.appendChild(scriptTag);
        }
        createElement(tagName) {
            return this.d.createElement(tagName);
        }
        createElementNS(namespaceURI, qualifiedName) {
            return this.d.createElementNS(namespaceURI, qualifiedName);
        }
        createTextNode(text) {
            return this.d.createTextNode(text);
        }
        createComment(text) {
            return this.d.createComment(text);
        }
        insertBefore(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        }
        removeChild(node, child) {
            node.removeChild(child);
        }
        appendChild(node, child) {
            node.appendChild(child);
        }
        parentNode(node) {
            return node.parentNode;
        }
        nextSibling(node) {
            return node.nextSibling;
        }
        tag(elm) {
            return (elm.tagName || '').toLowerCase();
        }
        setTextContent(node, text) {
            node.textContent = text;
        }
        getTextContent(node) {
            return node.textContent;
        }
        getAttribute(elm, attrName) {
            return elm.getAttribute(attrName);
        }
        getProperty(node, propName) {
            return node[propName];
        }
        getPropOrAttr(elm, name) {
            var val = elm[toCamelCase(name)];
            return isDef(val) ? val : elm.getAttribute(name);
        }
        setStyle(elm, styleName, styleValue) {
            elm.style[toCamelCase(styleName)] = styleValue;
        }
        isElement(node) {
            return node.nodeType === 1;
        }
        isText(node) {
            return node.nodeType === 3;
        }
        isComment(node) {
            return node.nodeType === 8;
        }
        nextTick(cb) {
            var timerId = setTimeout(cb);
            if (this.hasPromises) {
                Promise.resolve().then(function () {
                    clearTimeout(timerId);
                    cb && cb();
                });
            }
        }
        hasCssLink(linkUrl) {
            if (this.cssLink[linkUrl]) {
                return true;
            }
            if (this.d.head.querySelector('link[href="' + linkUrl + '"]')) {
                this.setCssLink(linkUrl);
                return true;
            }
            return false;
        }
        setCssLink(linkUrl) {
            this.cssLink[linkUrl] = true;
        }
        getDocumentHead() {
            return this.d.head;
        }
    }
    class CommonComponent {}

    var plt = new PlatformClient(window, document);
    var config = new Config();
    var renderer = initRenderer([attributesModule, classModule], plt);
    var ctrls = new WeakMap();
    components.forEach(function registerComponentMeta(cmpMeta) {
        plt.registerComponent(cmpMeta);
        window.customElements.define(cmpMeta.tag, class extends HTMLElement {
            constructor() {
                super();
                ctrls.set(this, {});
            }
            connectedCallback() {
                var elm = this;
                plt.loadComponentModule(cmpMeta.tag, function loadedModule(cmpModule) {
                    update(plt, config, renderer, elm, ctrls.get(elm), cmpMeta, cmpModule);
                });
            }
            attributeChangedCallback(attrName, oldVal, newVal, namespace) {
                attributeChangedCallback(ctrls.get(this).instance, cmpMeta, attrName, oldVal, newVal, namespace);
            }
            disconnectedCallback() {
                disconnectedCallback(ctrls.get(this));
                ctrls.delete(this);
            }
            static get observedAttributes() {
                return cmpMeta.observedAttributes;
            }
        });
    });
})(window, document, [{
    tag: 'ion-badge',
    modeStyleUrls: {
        ios: ['badge.ios.css'],
        md: ['badge.md.css'],
        wp: ['badge.wp.css']
    },
    hostCss: 'badge',
    props: {
        color: {},
        mode: {}
    },
    observedAttributes: ['color', 'mode']
}]);