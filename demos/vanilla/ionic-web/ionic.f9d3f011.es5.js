var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * 2.3
 * http://w3c.github.io/webcomponents/spec/custom/#dfn-element-definition
 * @typedef {{
 *  name: string,
 *  localName: string,
 *  constructor: function(new:HTMLElement),
 *  connectedCallback: (Function|undefined),
 *  disconnectedCallback: (Function|undefined),
 *  attributeChangedCallback: (Function|undefined),
 *  observedAttributes: Array<string>,
 * }}
 */
var CustomElementDefinition = void 0;

/**
 * @typedef {{
 *  resolve: !function(undefined),
 *  promise: !Promise<undefined>,
 * }}
 */
var Deferred = void 0;

(function () {
    'use strict';

    var doc = document;
    var win = window;

    /**
     * Gets 'customElement' from window so that it could be modified after
     * the polyfill loads.
     * @function
     * @return {CustomElementRegistry}
     */
    var _customElements = function () {
        return win['customElements'];
    };

    var _observerProp = '__$CE_observer';
    var _attachedProp = '__$CE_attached';
    var _upgradedProp = '__$CE_upgraded';

    if (_customElements()) {
        _customElements().flush = function () {};
        if (!_customElements().forcePolyfill) {
            return;
        }
    }

    // name validation
    // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name

    /**
     * @const
     * @type {Array<string>}
     */
    var reservedTagList = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];

    /**
     * @param {!string} name
     * @return {!Error|undefined}
     */
    function checkValidCustomElementName(name) {
        if (!(/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(name) && reservedTagList.indexOf(name) === -1)) {
            return new Error('The element name \'' + name + '\' is not valid.');
        }
    }

    /**
     * @param {!Node} root
     * @return {TreeWalker}
     */
    function createTreeWalker(root) {
        // IE 11 requires the third and fourth arguments be present. If the third
        // arg is null, it applies the default behaviour. However IE also requires
        // the fourth argument be present even though the other browsers ignore it.
        return doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
    }

    /**
     * @param {!Node} node
     * @return {boolean}
     */
    function isElement(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }

    /**
     * @param {!Element} element
     * @return {boolean}
     */
    function isHtmlImport(element) {
        return element.tagName === 'LINK' && element.rel && element.rel.toLowerCase().split(' ').indexOf('import') !== -1;
    }

    /**
     * @param {!Element} element
     * @return {boolean}
     */
    function isConnected(element) {
        var n = element;
        do {
            if (n[_attachedProp] || n.nodeType === Node.DOCUMENT_NODE) return true;
            n = n.parentNode || n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host;
        } while (n);
        return false;
    }

    /**
     * A registry of custom element definitions.
     *
     * See https://html.spec.whatwg.org/multipage/scripting.html#customelementsregistry
     *
     * @property {boolean} enableFlush Set to true to enable the flush() method
     *   to work. This should only be done for tests, as it causes a memory leak.
     */

    var CustomElementRegistry = function () {
        function CustomElementRegistry() {
            var _this2 = this;

            _classCallCheck(this, CustomElementRegistry);

            /** @private {!Map<string, !CustomElementDefinition>} **/
            this._definitions = new Map();

            /** @private {!Map<Function, string>} **/
            this._constructors = new Map();

            /** @private {!Map<string, !Deferred>} **/
            this._whenDefinedMap = new Map();

            /** @private {!Set<!MutationObserver>} **/
            this._observers = new Set();

            /** @private {!MutationObserver} **/
            this._attributeObserver = new MutationObserver(
            /** @type {function(Array<MutationRecord>, MutationObserver)} */
            this._handleAttributeChange.bind(this));

            /** @private {?HTMLElement} **/
            this._newInstance = null;

            /** @private {!Set<string>} **/
            this._pendingHtmlImportUrls = new Set();

            /** @type {boolean} **/
            this.enableFlush = true;

            /** @private {boolean} **/
            this._ready = false;

            /** @type {MutationObserver} **/
            this._mainDocumentObserver = this._observeRoot(doc);

            var onReady = function () {
                _this2._ready = true;
                _this2._addNodes(doc.childNodes);
            };
            if (window['HTMLImports']) {
                window['HTMLImports']['whenReady'](onReady);
            } else {
                onReady();
            }
        }

        // HTML spec part 4.13.4
        // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-define
        /**
         * @param {string} name
         * @param {function(new:HTMLElement)} constructor
         * @param {{extends: string}} options
         * @return {undefined}
         */


        _createClass(CustomElementRegistry, [{
            key: 'define',
            value: function define(name, constructor, options) {
                // 1:
                if (typeof constructor !== 'function') {
                    throw new TypeError('constructor must be a Constructor');
                }

                // 2. If constructor is an interface object whose corresponding interface
                //    either is HTMLElement or has HTMLElement in its set of inherited
                //    interfaces, throw a TypeError and abort these steps.
                //
                // It doesn't appear possible to check this condition from script

                // 3:
                var nameError = checkValidCustomElementName(name);
                if (nameError) throw nameError;

                // 4, 5:
                // Note: we don't track being-defined names and constructors because
                // define() isn't normally reentrant. The only time user code can run
                // during define() is when getting callbacks off the prototype, which
                // would be highly-unusual. We can make define() reentrant-safe if needed.
                if (this._definitions.has(name)) {
                    throw new Error('An element with name \'' + name + '\' is already defined');
                }

                // 6, 7:
                if (this._constructors.has(constructor)) {
                    throw new Error('Definition failed for \'' + name + '\': ' + 'The constructor is already used.');
                }

                // 8:
                /** @type {string} */
                var localName = name;

                // 9, 10: We do not support extends currently.

                // 11, 12, 13: Our define() isn't rentrant-safe

                // 14.1:
                /** @type {Object} */
                var prototype = constructor.prototype;

                // 14.2:
                if (typeof prototype !== 'object') {
                    throw new TypeError('Definition failed for \'' + name + '\': ' + 'constructor.prototype must be an object');
                }

                /**
                 * @param {string} callbackName
                 * @return {Function|undefined}
                 */
                function getCallback(callbackName) {
                    var callback = prototype[callbackName];
                    if (callback !== undefined && typeof callback !== 'function') {
                        throw new Error(localName + ' \'' + callbackName + '\' is not a Function');
                    }
                    return callback;
                }

                // 3, 4:
                var connectedCallback = getCallback('connectedCallback');

                // 5, 6:
                var disconnectedCallback = getCallback('disconnectedCallback');

                // Divergence from spec: we always throw if attributeChangedCallback is
                // not a function.

                // 7, 9.1:
                var attributeChangedCallback = getCallback('attributeChangedCallback');

                // 8, 9.2, 9.3:
                var observedAttributes = attributeChangedCallback && constructor['observedAttributes'] || [];

                // 15:
                /** @type {CustomElementDefinition} */
                var definition = {
                    name: name,
                    localName: localName,
                    constructor: constructor,
                    connectedCallback: connectedCallback,
                    disconnectedCallback: disconnectedCallback,
                    attributeChangedCallback: attributeChangedCallback,
                    observedAttributes: observedAttributes
                };

                // 16:
                this._definitions.set(localName, definition);
                this._constructors.set(constructor, localName);

                // 17, 18, 19:
                if (this._ready) this._addNodes(doc.childNodes);

                // 20:
                /** @type {Deferred} **/
                var deferred = this._whenDefinedMap.get(localName);
                if (deferred) {
                    deferred.resolve(undefined);
                    this._whenDefinedMap.delete(localName);
                }
            }

            /**
             * Returns the constructor defined for `name`, or `null`.
             *
             * @param {string} name
             * @return {Function|undefined}
             */

        }, {
            key: 'get',
            value: function get(name) {
                // https://html.spec.whatwg.org/multipage/scripting.html#custom-elements-api
                var def = this._definitions.get(name);
                return def ? def.constructor : undefined;
            }

            /**
             * Returns a `Promise` that resolves when a custom element for `name` has
             * been defined.
             *
             * @param {string} name
             * @return {!Promise}
             */

        }, {
            key: 'whenDefined',
            value: function whenDefined(name) {
                // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-whendefined
                var nameError = checkValidCustomElementName(name);
                if (nameError) return Promise.reject(nameError);
                if (this._definitions.has(name)) return Promise.resolve();

                /** @type {Deferred} **/
                var deferred = this._whenDefinedMap.get(name);
                if (deferred) return deferred.promise;

                var resolve = void 0;
                var promise = new Promise(function (_resolve, _) {
                    resolve = _resolve;
                });
                deferred = { promise: promise, resolve: resolve };
                this._whenDefinedMap.set(name, deferred);
                return promise;
            }

            /**
             * Causes all pending mutation records to be processed, and thus all
             * customization, upgrades and custom element reactions to be called.
             * `enableFlush` must be true for this to work. Only use during tests!
             */

        }, {
            key: 'flush',
            value: function flush() {
                if (this.enableFlush) {
                    // console.warn("flush!!!");
                    this._handleMutations(this._mainDocumentObserver.takeRecords());
                    this._handleAttributeChange(this._attributeObserver.takeRecords());
                    this._observers.forEach(
                    /**
                     * @param {!MutationObserver} observer
                     * @this {CustomElementRegistry}
                     */
                    function (observer) {
                        this._handleMutations(observer.takeRecords());
                    }, this);
                }
            }

            /**
             * @param {?HTMLElement} instance
             * @private
             */

        }, {
            key: '_setNewInstance',
            value: function _setNewInstance(instance) {
                this._newInstance = instance;
            }

            /**
             * Observes a DOM root for mutations that trigger upgrades and reactions.
             * @param {Node} root
             * @private
             */

        }, {
            key: '_observeRoot',
            value: function _observeRoot(root) {
                //console.log('_observeRoot', root, root.baseURI);
                // console.assert(!root[_observerProp]);
                if (root[_observerProp] != null) {
                    //console.warn(`Root ${root} is already observed`);
                    return root[_observerProp];
                }
                root[_observerProp] = new MutationObserver(
                /** @type {function(Array<MutationRecord>, MutationObserver)} */
                this._handleMutations.bind(this));
                root[_observerProp].observe(root, { childList: true, subtree: true });
                if (this.enableFlush) {
                    // this is memory leak, only use in tests
                    this._observers.add(root[_observerProp]);
                }
                return root[_observerProp];
            }

            /**
             * @param {Node} root
             * @private
             */

        }, {
            key: '_unobserveRoot',
            value: function _unobserveRoot(root) {
                if (root[_observerProp] != null) {
                    root[_observerProp].disconnect();
                    if (this.enableFlush) {
                        this._observers.delete(root[_observerProp]);
                    }
                    root[_observerProp] = null;
                }
            }

            /**
             * @param {!Array<!MutationRecord>} mutations
             * @private
             */

        }, {
            key: '_handleMutations',
            value: function _handleMutations(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    /** @type {!MutationRecord} */
                    var mutation = mutations[i];
                    if (mutation.type === 'childList') {
                        // Note: we can't get an ordering between additions and removals, and
                        // so might diverge from spec reaction ordering
                        var addedNodes = /** @type {!NodeList<!Node>} */mutation.addedNodes;
                        var removedNodes = /** @type {!NodeList<!Node>} */mutation.removedNodes;
                        this._addNodes(addedNodes);
                        this._removeNodes(removedNodes);
                    }
                }
            }

            /**
             * @param {!(NodeList<!Node>|Array<!Node>)} nodeList
             * @param {?Set<Node>=} visitedNodes
             * @private
             */

        }, {
            key: '_addNodes',
            value: function _addNodes(nodeList, visitedNodes) {
                visitedNodes = visitedNodes || new Set();

                for (var i = 0; i < nodeList.length; i++) {
                    var root = nodeList[i];

                    if (!isElement(root)) {
                        continue;
                    }

                    // Since we're adding this node to an observed tree, we can unobserve
                    this._unobserveRoot(root);

                    var walker = createTreeWalker(root);
                    do {
                        var node = /** @type {!HTMLElement} */walker.currentNode;
                        this._addElement(node, visitedNodes);
                    } while (walker.nextNode());
                }
            }

            /**
             * @param {!HTMLElement} element
             * @param {!Set<Node>=} visitedNodes
             */

        }, {
            key: '_addElement',
            value: function _addElement(element, visitedNodes) {
                if (visitedNodes.has(element)) return;
                visitedNodes.add(element);

                /** @type {?CustomElementDefinition} */
                var definition = this._definitions.get(element.localName);
                if (definition) {
                    if (!element[_upgradedProp]) {
                        this._upgradeElement(element, definition, true);
                    }
                    if (element[_upgradedProp] && !element[_attachedProp] && isConnected(element)) {
                        element[_attachedProp] = true;
                        if (definition.connectedCallback) {
                            definition.connectedCallback.call(element);
                        }
                    }
                }
                if (element.shadowRoot) {
                    // TODO(justinfagnani): do we need to check that the shadowRoot
                    // is observed?
                    this._addNodes(element.shadowRoot.childNodes, visitedNodes);
                }
                if (isHtmlImport(element)) {
                    this._addImport( /** @type {!HTMLLinkElement} */element, visitedNodes);
                }
            }

            /**
             * @param {!HTMLLinkElement} link
             * @param {!Set<Node>=} visitedNodes
             */

        }, {
            key: '_addImport',
            value: function _addImport(link, visitedNodes) {
                // During a tree walk to add or upgrade nodes, we may encounter multiple
                // HTML imports that reference the same document, and may encounter
                // imports in various states of loading.

                // First, we only want to process the first import for a document in a
                // walk, so we check visitedNodes for the document, not the link.
                //
                // Second, for documents that haven't loaded yet, we only want to add one
                // listener, regardless of the number of links or walks, so we track
                // pending loads in _pendingHtmlImportUrls.

                // Check to see if the import is loaded
                /** @type {?Document} */
                var _import = link.import;
                if (_import) {
                    // The import is loaded, but only process the first link element
                    if (visitedNodes.has(_import)) return;
                    visitedNodes.add(_import);

                    // The import is loaded observe it
                    if (!_import[_observerProp]) this._observeRoot(_import);

                    // walk the document
                    this._addNodes(_import.childNodes, visitedNodes);
                } else {
                    // The import is not loaded, so wait for it
                    /** @type {string} */
                    var importUrl = link.href;
                    if (this._pendingHtmlImportUrls.has(importUrl)) return;
                    this._pendingHtmlImportUrls.add(importUrl);

                    /**
                     * @const
                     * @type {CustomElementRegistry}
                     */
                    var _this = this;
                    var onLoad = function () {
                        link.removeEventListener('load', /** @type {function(Event)} */onLoad);
                        if (!link.import[_observerProp]) _this._observeRoot(link.import);
                        // We don't pass visitedNodes because this is async and not part of
                        // the current tree walk.
                        _this._addNodes(link.import.childNodes);
                    };
                    link.addEventListener('load', onLoad);
                }
            }

            /**
             * @param {NodeList} nodeList
             * @private
             */

        }, {
            key: '_removeNodes',
            value: function _removeNodes(nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    var root = nodeList[i];

                    if (!isElement(root)) {
                        continue;
                    }

                    // Since we're detatching this element from an observed root, we need to
                    // reobserve it.
                    // TODO(justinfagnani): can we do this in a microtask so we don't thrash
                    // on creating and destroying MutationObservers on batch DOM mutations?
                    this._observeRoot(root);

                    var walker = createTreeWalker(root);
                    do {
                        var node = walker.currentNode;
                        if (node[_upgradedProp] && node[_attachedProp]) {
                            node[_attachedProp] = false;
                            var definition = this._definitions.get(node.localName);
                            if (definition && definition.disconnectedCallback) {
                                definition.disconnectedCallback.call(node);
                            }
                        }
                    } while (walker.nextNode());
                }
            }

            /**
             * Upgrades or customizes a custom element.
             *
             * @param {HTMLElement} element
             * @param {CustomElementDefinition} definition
             * @param {boolean} callConstructor
             * @private
             */

        }, {
            key: '_upgradeElement',
            value: function _upgradeElement(element, definition, callConstructor) {
                var prototype = definition.constructor.prototype;
                element.__proto__ = prototype;
                if (callConstructor) {
                    this._setNewInstance(element);
                    new definition.constructor();
                    element[_upgradedProp] = true;
                    console.assert(this._newInstance == null);
                }

                var observedAttributes = definition.observedAttributes;
                var attributeChangedCallback = definition.attributeChangedCallback;
                if (attributeChangedCallback && observedAttributes.length > 0) {
                    this._attributeObserver.observe(element, {
                        attributes: true,
                        attributeOldValue: true,
                        attributeFilter: observedAttributes
                    });

                    // Trigger attributeChangedCallback for existing attributes.
                    // https://html.spec.whatwg.org/multipage/scripting.html#upgrades
                    for (var i = 0; i < observedAttributes.length; i++) {
                        var name = observedAttributes[i];
                        if (element.hasAttribute(name)) {
                            var value = element.getAttribute(name);
                            attributeChangedCallback.call(element, name, null, value, null);
                        }
                    }
                }
            }

            /**
             * @param {!Array<!MutationRecord>} mutations
             * @private
             */

        }, {
            key: '_handleAttributeChange',
            value: function _handleAttributeChange(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (mutation.type === 'attributes') {
                        var target = /** @type {HTMLElement} */mutation.target;
                        // We should be gaurenteed to have a definition because this mutation
                        // observer is only observing custom elements observedAttributes
                        var definition = this._definitions.get(target.localName);
                        var name = /** @type {!string} */mutation.attributeName;
                        var oldValue = mutation.oldValue;
                        var newValue = target.getAttribute(name);
                        // Skip changes that were handled synchronously by setAttribute
                        if (newValue !== oldValue) {
                            var namespace = mutation.attributeNamespace;
                            definition.attributeChangedCallback.call(target, name, oldValue, newValue, namespace);
                        }
                    }
                }
            }
        }]);

        return CustomElementRegistry;
    }();

    // Closure Compiler Exports


    window['CustomElementRegistry'] = CustomElementRegistry;
    CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
    CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
    CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
    CustomElementRegistry.prototype['flush'] = CustomElementRegistry.prototype.flush;
    CustomElementRegistry.prototype['polyfilled'] = true;
    // TODO(justinfagnani): remove these in production code
    CustomElementRegistry.prototype['_observeRoot'] = CustomElementRegistry.prototype._observeRoot;
    CustomElementRegistry.prototype['_addImport'] = CustomElementRegistry.prototype._addImport;

    // patch window.HTMLElement

    /** @const */
    var origHTMLElement = win.HTMLElement;
    /**
     * @type {function(new: HTMLElement)}
     */
    var newHTMLElement = function HTMLElement() {
        var customElements = _customElements();

        // If there's an being upgraded, return that
        if (customElements._newInstance) {
            var i = customElements._newInstance;
            customElements._newInstance = null;
            return i;
        }
        if (this.constructor) {
            // Find the tagname of the constructor and create a new element with it
            var tagName = customElements._constructors.get(this.constructor);
            return _createElement(doc, tagName, undefined, false);
        }
        throw new Error('Unknown constructor. Did you call customElements.define()?');
    };
    win.HTMLElement = newHTMLElement;
    win.HTMLElement.prototype = Object.create(origHTMLElement.prototype, {
        constructor: { value: win.HTMLElement, configurable: true, writable: true }
    });

    // patch doc.createElement
    // TODO(justinfagnani): why is the cast neccessary?
    // Can we fix the Closure DOM externs?
    var _origCreateElement =
    /** @type {function(this:Document, string, (Object|undefined)): !HTMLElement}}*/
    doc.createElement;

    /**
     * Creates a new element and upgrades it if it's a custom element.
     * @param {!Document} doc
     * @param {!string} tagName
     * @param {Object|undefined} options
     * @param {boolean} callConstructor whether or not to call the elements
     *   constructor after upgrading. If an element is created by calling its
     *   constructor, then `callConstructor` should be false to prevent double
     *   initialization.
     */
    function _createElement(doc, tagName, options, callConstructor) {
        var customElements = _customElements();
        var element = _origCreateElement.call(doc, tagName, options);
        var definition = customElements._definitions.get(tagName.toLowerCase());
        if (definition) {
            customElements._upgradeElement(element, definition, callConstructor);
        }
        customElements._observeRoot(element);
        return element;
    };
    doc.createElement = function (tagName, options) {
        return _createElement(doc, tagName, options, true);
    };

    // patch doc.createElementNS

    var HTMLNS = 'http://www.w3.org/1999/xhtml';

    /** @type {function(this:Document,string,string):Element} */
    var _origCreateElementNS = doc.createElementNS;
    doc.createElementNS =
    /** @type {function(this:Document,(string|null),string):!Element} */
    function (namespaceURI, qualifiedName) {
        if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
            return doc.createElement(qualifiedName);
        } else {
            return _origCreateElementNS.call(doc, namespaceURI, qualifiedName);
        }
    };

    // patch Element.attachShadow

    /** @type {function({closed: boolean})} */
    var _origAttachShadow = Element.prototype['attachShadow'];
    if (_origAttachShadow) {
        Object.defineProperty(Element.prototype, 'attachShadow', {
            value: function (options) {
                /** @type {!Node} */
                var root = _origAttachShadow.call(this, options);
                /** @type {CustomElementRegistry} */
                var customElements = _customElements();
                customElements._observeRoot(root);
                return root;
            }
        });
    }

    // patch doc.importNode

    var rawImportNode = doc.importNode;
    doc.importNode = function (node, deep) {
        var clone = /** @type{!Node} */rawImportNode.call(doc, node, deep);
        var customElements = _customElements();
        var nodes = isElement(clone) ? [clone] : clone.childNodes;
        /** @type {CustomElementRegistry} */_customElements()._addNodes(nodes);
        return clone;
    };

    // patch Element.setAttribute & removeAttribute

    var _origSetAttribute = Element.prototype.setAttribute;
    Element.prototype['setAttribute'] = function (name, value) {
        changeAttribute(this, name, value, _origSetAttribute);
    };
    var _origRemoveAttribute = Element.prototype.removeAttribute;
    Element.prototype['removeAttribute'] = function (name) {
        changeAttribute(this, name, null, _origRemoveAttribute);
    };

    function changeAttribute(element, name, value, operation) {
        name = name.toLowerCase();
        var oldValue = element.getAttribute(name);
        operation.call(element, name, value);

        // Bail if this wasn't a fully upgraded custom element
        if (element[_upgradedProp] == true) {
            var definition = _customElements()._definitions.get(element.localName);
            var observedAttributes = definition.observedAttributes;
            var attributeChangedCallback = definition.attributeChangedCallback;
            if (attributeChangedCallback && observedAttributes.indexOf(name) >= 0) {
                var newValue = element.getAttribute(name);
                if (newValue !== oldValue) {
                    attributeChangedCallback.call(element, name, oldValue, newValue, null);
                }
            }
        }
    }

    Object.defineProperty(window, 'customElements', {
        value: new CustomElementRegistry(),
        configurable: true,
        enumerable: true
    });

    // TODO(justinfagnani): Remove. Temporary for backward-compatibility
    window['CustomElements'] = {
        takeRecords: function () {
            if (_customElements().flush) _customElements().flush();
        }
    };
})();

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
    function noop() {}

    function attributeChangedCallback(instance, cmpMeta, attrName, oldVal, newVal, namespace) {
        if (!instance) return;
        var propName = toCamelCase(attrName);
        if (cmpMeta.props[propName]) {
            instance[propName] = newVal;
        }
        instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
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
        var props = cmpMeta.props;
        Object.keys(props).forEach(function (propName) {
            var propType = props[propName].type;
            state[propName] = getInitialValue(plt, config, elm, instance, propName);
            function getState() {
                return state[propName];
            }
            function setState(value) {
                value = getPropValue(propType, value);
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
    function getInitialValue(plt, config, elm, instance, propName) {
        var value = plt.getProperty(elm, propName);
        if (isDef(value)) {
            return value;
        }
        value = plt.getAttribute(elm, toCamelCase(propName));
        if (isDef(value)) {
            return value;
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
            plt.nextTick(function nextUpdate() {
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
        if (isUndef(ctrl.connected)) {
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

    var Config = function () {
        function Config(config) {
            _classCallCheck(this, Config);

            this.c = config;
        }

        _createClass(Config, [{
            key: 'get',
            value: function get(key) {
                var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                if (key === 'mode') {
                    return 'md';
                }
                return fallback;
            }
        }]);

        return Config;
    }();

    var PlatformClient = function () {
        function PlatformClient(window, d, ionic) {
            _classCallCheck(this, PlatformClient);

            this.d = d;
            this.registry = {};
            this.loadCBs = {};
            this.jsonReqs = [];
            this.css = {};
            this.nextCBs = [];
            var self = this;
            self.hasPromises = typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1;
            self.staticDir = getStaticComponentDir(d);
            var ua = window.navigator.userAgent.toLowerCase();
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

        _createClass(PlatformClient, [{
            key: 'nextTick',
            value: function nextTick(cb) {
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
        }, {
            key: 'loadComponentModule',
            value: function loadComponentModule(tag, mode, cb) {
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
                    var componentFileName = cmpId + '.js';
                    this.jsonp(componentFileName);
                }
            }
        }, {
            key: 'jsonp',
            value: function jsonp(jsonpUrl) {
                var scriptTag;
                var tmrId;
                var self = this;
                jsonpUrl = self.staticDir + jsonpUrl;
                if (self.jsonReqs.indexOf(jsonpUrl) > -1) {
                    return;
                }
                self.jsonReqs.push(jsonpUrl);
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
                    var index = self.jsonReqs.indexOf(jsonpUrl);
                    if (index > -1) {
                        self.jsonReqs.splice(index, 1);
                    }
                }
                scriptTag.onerror = scriptTag.onload = onScriptComplete;
                self.d.head.appendChild(scriptTag);
            }
        }, {
            key: 'registerComponent',
            value: function registerComponent(cmpMeta) {
                this.registry[cmpMeta.tag] = cmpMeta;
            }
        }, {
            key: 'createElement',
            value: function createElement(tagName) {
                return this.d.createElement(tagName);
            }
        }, {
            key: 'createElementNS',
            value: function createElementNS(namespaceURI, qualifiedName) {
                return this.d.createElementNS(namespaceURI, qualifiedName);
            }
        }, {
            key: 'createTextNode',
            value: function createTextNode(text) {
                return this.d.createTextNode(text);
            }
        }, {
            key: 'createComment',
            value: function createComment(text) {
                return this.d.createComment(text);
            }
        }, {
            key: 'insertBefore',
            value: function insertBefore(parentNode, newNode, referenceNode) {
                parentNode.insertBefore(newNode, referenceNode);
            }
        }, {
            key: 'removeChild',
            value: function removeChild(parentNode, childNode) {
                parentNode.removeChild(childNode);
            }
        }, {
            key: 'appendChild',
            value: function appendChild(parentNode, childNode) {
                parentNode.appendChild(childNode);
            }
        }, {
            key: 'parentNode',
            value: function parentNode(node) {
                return node.parentNode;
            }
        }, {
            key: 'nextSibling',
            value: function nextSibling(node) {
                return node.nextSibling;
            }
        }, {
            key: 'tag',
            value: function tag(elm) {
                return (elm.tagName || '').toLowerCase();
            }
        }, {
            key: 'setTextContent',
            value: function setTextContent(node, text) {
                node.textContent = text;
            }
        }, {
            key: 'getTextContent',
            value: function getTextContent(node) {
                return node.textContent;
            }
        }, {
            key: 'getAttribute',
            value: function getAttribute(elm, attrName) {
                return elm.getAttribute(attrName);
            }
        }, {
            key: 'setAttribute',
            value: function setAttribute(elm, attrName, attrValue) {
                elm.setAttribute(attrName, attrValue);
            }
        }, {
            key: 'getProperty',
            value: function getProperty(node, propName) {
                return node[propName];
            }
        }, {
            key: 'setProperty',
            value: function setProperty(node, propName, propValue) {
                node[propName] = propValue;
            }
        }, {
            key: 'setStyle',
            value: function setStyle(elm, styleName, styleValue) {
                elm.style[toCamelCase(styleName)] = styleValue;
            }
        }, {
            key: 'isElement',
            value: function isElement(node) {
                return node.nodeType === 1;
            }
        }, {
            key: 'isText',
            value: function isText(node) {
                return node.nodeType === 3;
            }
        }, {
            key: 'isComment',
            value: function isComment(node) {
                return node.nodeType === 8;
            }
        }, {
            key: 'hasCss',
            value: function hasCss(moduleId) {
                if (this.css[moduleId]) {
                    return true;
                }
                if (this.d.head.querySelector('style[data-module-id="' + moduleId + '"]')) {
                    this.setCss(moduleId);
                    return true;
                }
                return false;
            }
        }, {
            key: 'setCss',
            value: function setCss(linkUrl) {
                this.css[linkUrl] = true;
            }
        }, {
            key: 'getDocumentHead',
            value: function getDocumentHead() {
                return this.d.head;
            }
        }]);

        return PlatformClient;
    }();

    var plt = new PlatformClient(window, document, ionic);
    var config = new Config();
    var renderer = initRenderer(plt);
    var ctrls = new WeakMap();
    Object.keys(ionic.components || {}).forEach(function (tag) {
        var cmpMeta = initComponentMeta(tag, ionic.components[tag]);
        plt.registerComponent(cmpMeta);
        function ProxyElementES5() {
            return HTMLElement.apply(this);
        }
        ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
        ProxyElementES5.prototype.constructor = ProxyElementES5;
        ProxyElementES5.prototype.connectedCallback = function () {
            var ctrl = {};
            ctrls.set(this, ctrl);
            connectedCallback(plt, config, renderer, this, ctrl, tag);
        };
        ProxyElementES5.prototype.attributeChangedCallback = function (attrName, oldVal, newVal, namespace) {
            var ctrl = ctrls.get(this);
            if (ctrl && ctrl.instance) {
                attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal, namespace);
            }
        };
        ProxyElementES5.prototype.disconnectedCallback = function () {
            disconnectedCallback(ctrls.get(this));
            ctrls.delete(this);
        };
        ProxyElementES5.observedAttributes = cmpMeta.observedAttributes;
        window.customElements.define(tag, ProxyElementES5);
    });
})(window, document, window.ionic = window.ionic || {});