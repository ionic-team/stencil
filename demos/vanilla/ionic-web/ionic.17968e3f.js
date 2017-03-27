(function (window, document, ionic) {

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
    function getStaticComponentDir(doc) {
        var staticDirEle = doc.querySelector('script[data-static-dir]');
        if (staticDirEle) {
            return staticDirEle.dataset['staticDir'];
        }
        var scriptElms = doc.getElementsByTagName('script');
        staticDirEle = scriptElms[scriptElms.length - 1];
        if (staticDirEle) {
            var paths = staticDirEle.src.split('/');
            paths.pop();
            return staticDirEle.dataset['staticDir'] = paths.join('/') + '/';
        }
        return '/';
    }
    function getComponentId(tag, mode, id) {
        return tag + '.' + mode + '.' + id;
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
    function noop() {}

    function attributeChangedCallback(instance, cmpMeta, attrName, oldVal, newVal, namespace) {
        if (instance) {
            if (oldVal !== newVal) {
                var propName = toCamelCase(attrName);
                if (cmpMeta.props[propName]) {
                    instance[propName] = getPropValue(cmpMeta.props[propName].type, newVal);
                }
            }
            instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
        }
    }

    function vnode(sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, data: data, children: children,
            text: text, elm: elm, key: key };
    }

    var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xmlNS = 'http://www.w3.org/XML/1998/namespace';
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
            attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs) return;
        if (oldAttrs === attrs) return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];
            if (old !== cur) {
                if (booleanAttrsDict[key]) {
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
    // type ArraysOf<T> = {
    //   [K in keyof T]: (T[K])[];
    // }
    // type ModuleHooks = ArraysOf<Module>;
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
    // const hooks: (keyof Module)[] = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
    function initRenderer(api) {
        // let i: number, j: number;
        // for (i = 0; i < hooks.length; ++i) {
        //   cbs[hooks[i]] = [];
        //   for (j = 0; j < modules.length; ++j) {
        //     const hook = modules[j][hooks[i]];
        //     if (hook !== undefined) {
        //       (cbs[hooks[i]] as Array<any>).push(hook);
        //     }
        //   }
        // }
        function emptyNodeAt(elm) {
            var id = elm.id ? '#' + elm.id : '';
            var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
            return vnode(api.tag(elm) + id + c, {}, [], undefined, elm);
        }
        function createRmCb(childElm) {
            return function rmCb() {
                var parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
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
                // for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
                updateAttrs(emptyNode, vnode$$1);
                updateClass(emptyNode, vnode$$1);
                if (isArray(children)) {
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
        // function invokeDestroyHook(vnode: VNode) {
        //   let i: any, j: number, data = vnode.data;
        //   if (data !== undefined) {
        //     if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
        //     for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
        //     if (vnode.children !== undefined) {
        //       for (j = 0; j < vnode.children.length; ++j) {
        //         i = vnode.children[j];
        //         if (i != null && typeof i !== "string") {
        //           invokeDestroyHook(i);
        //         }
        //       }
        //     }
        //   }
        // }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var _i2 = void 0,
                    rm = void 0,
                    ch = vnodes[startIdx];
                if (ch != null) {
                    if (isDef(ch.sel)) {
                        // invokeDestroyHook(ch);
                        // listeners = cbs.remove.length + 1;
                        rm = createRmCb(ch.elm);
                        // for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
                        if (isDef(_i2 = ch.data) && isDef(_i2 = _i2.hook) && isDef(_i2 = _i2.remove)) {
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
                // for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
                updateAttrs(oldVnode, vnode$$1);
                updateClass(oldVnode, vnode$$1);
                i = vnode$$1.data.hook;
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
            var elm = void 0,
                parent = void 0;
            var insertedVnodeQueue = [];
            // for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
            if (!isVnode(oldVnode)) {
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
            // for (i = 0; i < insertedVnodeQueue.length; ++i) {
            //   (((insertedVnodeQueue[i].data as VNodeData).hook as Hooks).insert as any)(insertedVnodeQueue[i]);
            // }
            // for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
            return vnode$$1;
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
        hostAttributes.upgraded = '';
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

    function initState(plt, config, renderer, elm, ctrl, cmpMeta) {
        var instance = ctrl.instance;
        var state = ctrl.state = {};
        Object.keys(cmpMeta.props).forEach(function (propName) {
            state[propName] = getInitialValue(plt, config, elm, instance, cmpMeta.props, propName);
            function getState() {
                return state[propName];
            }
            function setState(value) {
                if (state[propName] !== value) {
                    state[propName] = value;
                    queueUpdate(plt, config, renderer, elm, ctrl, cmpMeta);
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
    function getInitialValue(plt, config, elm, instance, props, propName) {
        var value = plt.getProperty(elm, propName);
        if (isDef(value)) {
            return value;
        }
        value = plt.getAttribute(elm, toCamelCase(propName));
        if (isDef(value)) {
            return getPropValue(props[propName].type, value);
        }
        if (isDef(instance[propName])) {
            plt.setProperty(elm, propName, instance[propName]);
            return instance[propName];
        }
        value = config.get(propName);
        if (isDef(value)) {
            return value;
        }
    }
    function initComponentMeta(tag, data) {
        var modeIds = data[0];
        var props = data[1] || {};
        var cmpMeta = {
            tag: tag,
            modes: {},
            props: props
        };
        var keys = Object.keys(modeIds);
        for (var i = 0; i < keys.length; i++) {
            cmpMeta.modes[keys[i]] = {
                id: modeIds[keys[i]]
            };
        }
        keys = cmpMeta.tag.split('-');
        keys.shift();
        cmpMeta.hostCss = keys.join('-');
        props.color = {};
        props.mode = {};
        var observedAttributes = cmpMeta.observedAttributes = cmpMeta.observedAttributes || [];
        keys = Object.keys(props);
        for (i = 0; i < keys.length; i++) {
            observedAttributes.push(toDashCase(keys[i]));
        }
        return cmpMeta;
    }

    function queueUpdate(plt, config, renderer, elm, ctrl, cmpMeta) {
        // only run patch if it isn't queued already
        if (!ctrl.queued) {
            ctrl.queued = true;
            // run the patch in the next tick
            plt.domWrite(function domWrite() {
                // vdom diff and patch the host element for differences
                update(plt, config, renderer, elm, ctrl, cmpMeta);
                // no longer queued
                ctrl.queued = false;
            });
        }
    }
    function update(plt, config, renderer, elm, ctrl, cmpMeta) {
        var instance = ctrl.instance;
        if (isUndef(instance)) {
            instance = ctrl.instance = new cmpMeta.module();
            initState(plt, config, renderer, elm, ctrl, cmpMeta);
        }
        if (isUndef(ctrl.root)) {
            var cmpMode = cmpMeta.modes[instance.mode];
            if (elm.attachShadow) {
                ctrl.root = elm.attachShadow({ mode: 'open' });
                var shadowStyleEle = plt.createElement('style');
                shadowStyleEle.innerHTML = cmpMode.styles;
                ctrl.root.appendChild(shadowStyleEle);
            } else {
                ctrl.root = elm;
                var cmpId = getComponentId(cmpMeta.tag, instance.mode, cmpMode.id);
                if (!plt.hasCss(cmpId)) {
                    var headStyleEle = plt.createElement('style');
                    headStyleEle.dataset['componentId'] = cmpId;
                    headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
                    plt.appendChild(plt.getDocumentHead(), headStyleEle);
                    plt.setCss(cmpId);
                }
            }
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

    function connectedCallback(plt, config, renderer, elm, ctrl, tag) {
        plt.nextTick(function () {
            var mode = getMode(plt, config, elm, 'mode');
            plt.loadComponentModule(tag, mode, function loadedModule(cmpMeta) {
                update(plt, config, renderer, elm, ctrl, cmpMeta);
            });
        });
    }
    function getMode(plt, config, elm, propName) {
        var value = plt.getProperty(elm, propName);
        if (isDef(value)) {
            return value;
        }
        value = plt.getAttribute(elm, propName);
        if (isDef(value)) {
            return value;
        }
        return config.get(propName);
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
        get(key) {
            var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (key === 'mode') {
                return 'md';
            }
            return fallback;
        }
    }

    class PlatformClient {
        constructor(w, d, ionic) {
            this.w = w;
            this.d = d;
            this.registry = {};
            this.loadCBs = {};
            this.jsonReqs = [];
            this.css = {};
            this.nextCBs = [];
            this.readCBs = [];
            this.writeCBs = [];
            var self = this;
            self.hasPromises = typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1;
            self.staticDir = getStaticComponentDir(d);
            var ua = w.navigator.userAgent.toLowerCase();
            self.isIOS = /iphone|ipad|ipod|ios/.test(ua);
            ionic.loadComponent = function loadComponent(tag, mode, id, styles, importModuleFn) {
                var cmpMeta = self.registry[tag];
                var moduleImports = {};
                importModuleFn(moduleImports);
                var importNames = Object.keys(moduleImports);
                cmpMeta.module = moduleImports[importNames[0]];
                var cmpMode = cmpMeta.modes[mode];
                cmpMode.styles = styles;
                cmpMode.loaded = true;
                var moduleId = getComponentId(tag, mode, id);
                var callbacks = self.loadCBs[moduleId];
                if (callbacks) {
                    for (var i = 0, l = callbacks.length; i < l; i++) {
                        callbacks[i](cmpMeta, cmpMode);
                    }
                    delete self.loadCBs[moduleId];
                }
            };
        }
        nextTick(cb) {
            var self = this;
            var nextCBs = self.nextCBs;
            nextCBs.push(cb);
            if (!self.nextPending) {
                self.nextPending = true;
                if (self.hasPromises) {
                    Promise.resolve().then(function nextTickHandler() {
                        self.nextPending = false;
                        var callbacks = nextCBs.slice(0);
                        nextCBs.length = 0;
                        for (var _i3 = 0; _i3 < callbacks.length; _i3++) {
                            callbacks[_i3]();
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                    if (self.isIOS) {
                        // Adopt from vue.js: https://github.com/vuejs/vue, MIT Licensed
                        // In problematic UIWebViews, Promise.then doesn't completely break, but
                        // it can get stuck in a weird state where callbacks are pushed into the
                        // microtask queue but the queue isn't being flushed, until the browser
                        // needs to do some other work, e.g. handle a timer. Therefore we can
                        // "force" the microtask queue to be flushed by adding an empty timer.
                        setTimeout(noop);
                    }
                } else {
                    setTimeout(function nextTickHandler() {
                        self.nextPending = false;
                        var callbacks = nextCBs.slice(0);
                        nextCBs.length = 0;
                        for (var _i4 = 0; _i4 < callbacks.length; _i4++) {
                            callbacks[_i4]();
                        }
                    });
                }
            }
        }
        domRead(cb) {
            this.readCBs.push(cb);
            if (!this.rafPending) {
                this.rafQueue();
            }
        }
        domWrite(cb) {
            this.writeCBs.push(cb);
            if (!this.rafPending) {
                this.rafQueue();
            }
        }
        rafQueue(self) {
            self = this;
            self.rafPending = true;
            self.w.requestAnimationFrame(function rafCallback(timeStamp) {
                self.rafFlush(timeStamp);
            });
        }
        rafFlush(timeStamp, self, cb, err) {
            self = this;
            try {
                // ******** DOM READS ****************
                while (cb = self.readCBs.shift()) {
                    cb(timeStamp);
                }
                // ******** DOM WRITES ****************
                while (cb = self.writeCBs.shift()) {
                    cb(timeStamp);
                }
            } catch (e) {
                err = e;
            }
            self.rafPending = false;
            if (self.readCBs.length || self.writeCBs.length) {
                self.rafQueue();
            }
            if (err) {
                throw err;
            }
        }
        loadComponentModule(tag, mode, cb) {
            var cmpMeta = this.registry[tag];
            var cmpMode = cmpMeta.modes[mode];
            if (cmpMode && cmpMode.loaded) {
                cb(cmpMeta, cmpMode);
            } else {
                var cmpId = getComponentId(tag, mode, cmpMode.id);
                var loadedCallbacks = this.loadCBs;
                if (!loadedCallbacks[cmpId]) {
                    loadedCallbacks[cmpId] = [cb];
                } else {
                    loadedCallbacks[cmpId].push(cb);
                }
                var url = '' + this.staticDir + cmpId + '.js';
                jsonp(url, this.jsonReqs, this.d);
            }
        }
        registerComponent(cmpMeta) {
            this.registry[cmpMeta.tag] = cmpMeta;
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
        removeChild(parentNode, childNode) {
            parentNode.removeChild(childNode);
        }
        appendChild(parentNode, childNode) {
            parentNode.appendChild(childNode);
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
        setProperty(node, propName, propValue) {
            node[propName] = propValue;
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
        hasCss(moduleId) {
            if (this.css[moduleId]) {
                return true;
            }
            if (this.d.head.querySelector('style[data-module-id="' + moduleId + '"]')) {
                this.setCss(moduleId);
                return true;
            }
            return false;
        }
        setCss(linkUrl) {
            this.css[linkUrl] = true;
        }
        getDocumentHead() {
            return this.d.head;
        }
    }
    function jsonp(jsonpUrl, jsonReqs, doc, scriptTag, tmrId) {
        if (jsonReqs.indexOf(jsonpUrl) > -1) {
            return;
        }
        jsonReqs.push(jsonpUrl);
        scriptTag = doc.createElement('script');
        scriptTag.charset = 'utf-8';
        scriptTag.async = true;
        scriptTag.timeout = 120000;
        scriptTag.src = jsonpUrl;
        tmrId = setTimeout(onScriptComplete, 120000);
        function onScriptComplete() {
            clearTimeout(tmrId);
            scriptTag.onerror = scriptTag.onload = null;
            scriptTag.parentNode.removeChild(scriptTag);
            var index = jsonReqs.indexOf(jsonpUrl);
            if (index > -1) {
                jsonReqs.splice(index, 1);
            }
        }
        scriptTag.onerror = scriptTag.onload = onScriptComplete;
        doc.head.appendChild(scriptTag);
    }

    var plt = new PlatformClient(window, document, ionic);
    var config = ionic.config || new Config();
    var renderer = initRenderer(plt);
    var ctrls = new WeakMap();
    Object.keys(ionic.components || {}).forEach(function (tag) {
        var cmpMeta = initComponentMeta(tag, ionic.components[tag]);
        plt.registerComponent(cmpMeta);
        window.customElements.define(tag, class extends HTMLElement {
            connectedCallback() {
                var ctrl = {};
                ctrls.set(this, ctrl);
                connectedCallback(plt, config, renderer, this, ctrl, tag);
            }
            attributeChangedCallback(attrName, oldVal, newVal, namespace) {
                var ctrl = ctrls.get(this);
                if (ctrl && ctrl.instance) {
                    attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal, namespace);
                }
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
})(window, document, window.ionic = window.ionic || {});