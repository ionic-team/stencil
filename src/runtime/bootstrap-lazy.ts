import { BUILD } from '@app-data';
import { doc, getHostRef, plt, registerHost, supportsShadow, win } from '@platform';
import { CMP_FLAGS, queryNonceMetaTagContent } from '@utils';

import type * as d from '../declarations';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { patchChildSlotNodes, patchCloneNode, patchSlotAppendChild, patchTextContent } from './dom-extras';
import { hmrStart } from './hmr-component';
import { createTime, installDevTools } from './profile';
import { proxyComponent } from './proxy-component';
import { HYDRATED_CSS, HYDRATED_STYLE_ID, PLATFORM_FLAGS, PROXY_FLAGS } from './runtime-constants';
import { convertScopedToShadow, registerStyle } from './styles';
import { appDidLoad } from './update-component';
export { setNonce } from '@platform';

function _typeof(o) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o &&
              "function" == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? "symbol"
              : typeof o;
          }),
    _typeof(o)
  );
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError(
      "Derived constructors may only return object or undefined"
    );
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf
    ? Object.setPrototypeOf.bind()
    : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf.bind()
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}
var bootstrapLazy = function bootstrapLazy(lazyBundles) {
  var options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (BUILD.profile && performance.mark) {
    performance.mark("st:app:start");
  }
  installDevTools();
  var endBootstrap = createTime("bootstrapLazy");
  var cmpTags = [];
  var exclude = options.exclude || [];
  var customElements = win.customElements;
  var head = doc.head;
  var metaCharset = /*@__PURE__*/ head.querySelector("meta[charset]");
  var visibilityStyle = /*@__PURE__*/ doc.createElement("style");
  var deferredConnectedCallbacks = [];
  var styles = /*@__PURE__*/ doc.querySelectorAll(
    "[".concat(HYDRATED_STYLE_ID, "]")
  );
  var appLoadFallback;
  var isBootstrapping = true;
  var i = 0;
  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || "./", doc.baseURI).href;
  if (BUILD.asyncQueue) {
    if (options.syncQueue) {
      plt.$flags$ |= PLATFORM_FLAGS.queueSync;
    }
  }
  if (BUILD.hydrateClientSide) {
    // If the app is already hydrated there is not point to disable the
    // async queue. This will improve the first input delay
    plt.$flags$ |= PLATFORM_FLAGS.appLoaded;
  }
  if (BUILD.hydrateClientSide && BUILD.shadowDom) {
    for (; i < styles.length; i++) {
      registerStyle(
        styles[i].getAttribute(HYDRATED_STYLE_ID),
        convertScopedToShadow(styles[i].innerHTML),
        true
      );
    }
  }
  lazyBundles.map(function (lazyBundle) {
    lazyBundle[1].map(function (compactMeta) {
      var cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3]
      };
      if (BUILD.member) {
        cmpMeta.$members$ = compactMeta[2];
      }
      if (BUILD.hostListener) {
        cmpMeta.$listeners$ = compactMeta[3];
      }
      if (BUILD.reflect) {
        cmpMeta.$attrsToReflect$ = [];
      }
      if (BUILD.watchCallback) {
        cmpMeta.$watchers$ = {};
      }
      if (
        BUILD.shadowDom &&
        !supportsShadow &&
        cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation
      ) {
        // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
        cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
      }
      var tagName =
        BUILD.transformTagName && options.transformTagName
          ? options.transformTagName(cmpMeta.$tagName$)
          : cmpMeta.$tagName$;
      var HostElement = /*#__PURE__*/ (function (_HTMLElement) {
        _inherits(HostElement, _HTMLElement);
        var _super = _createSuper(HostElement);
        // StencilLazyHost
        function HostElement(self) {
          var _this;
          _classCallCheck(this, HostElement);
          // @ts-ignore
          _this = _super.call(this, self);
          self = _assertThisInitialized(_this);
          registerHost(self, cmpMeta);
          if (
            BUILD.shadowDom &&
            cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation
          ) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            // adding the shadow root build conditionals to minimize runtime
            if (supportsShadow) {
              if (BUILD.shadowDelegatesFocus) {
                self.attachShadow({
                  mode: "open",
                  delegatesFocus: !!(
                    cmpMeta.$flags$ & CMP_FLAGS.shadowDelegatesFocus
                  )
                });
              } else {
                self.attachShadow({
                  mode: "open"
                });
              }
            } else if (!BUILD.hydrateServerSide && !("shadowRoot" in self)) {
              self.shadowRoot = self;
            }
          }
          if (BUILD.slotChildNodesFix) {
            patchChildSlotNodes(self, cmpMeta);
          }
          return _this;
        }
        _createClass(HostElement, [
          {
            key: "connectedCallback",
            value: (function (_connectedCallback) {
              function connectedCallback() {
                return _connectedCallback.apply(this, arguments);
              }
              connectedCallback.toString = function () {
                return _connectedCallback.toString();
              };
              return connectedCallback;
            })(function () {
              var _this2 = this;
              if (appLoadFallback) {
                clearTimeout(appLoadFallback);
                appLoadFallback = null;
              }
              if (isBootstrapping) {
                // connectedCallback will be processed once all components have been registered
                deferredConnectedCallbacks.push(this);
              } else {
                plt.jmp(function () {
                  return connectedCallback(_this2);
                });
              }
            })
          },
          {
            key: "disconnectedCallback",
            value: (function (_disconnectedCallback) {
              function disconnectedCallback() {
                return _disconnectedCallback.apply(this, arguments);
              }
              disconnectedCallback.toString = function () {
                return _disconnectedCallback.toString();
              };
              return disconnectedCallback;
            })(function () {
              var _this3 = this;
              plt.jmp(function () {
                return disconnectedCallback(_this3);
              });
            })
          },
          {
            key: "componentOnReady",
            value: function componentOnReady() {
              return getHostRef(this).$onReadyPromise$;
            }
          }
        ]);
        return HostElement;
      })(/*#__PURE__*/ _wrapNativeSuper(HTMLElement));
      if (BUILD.cloneNodeFix) {
        patchCloneNode(HostElement.prototype);
      }
      if (BUILD.appendChildSlotFix) {
        patchSlotAppendChild(HostElement.prototype);
      }
      if (BUILD.hotModuleReplacement) {
        HostElement.prototype["s-hmr"] = function (hmrVersionId) {
          hmrStart(this, cmpMeta, hmrVersionId);
        };
      }
      if (BUILD.scopedSlotTextContentFix) {
        patchTextContent(HostElement.prototype, cmpMeta);
      }
      cmpMeta.$lazyBundleId$ = lazyBundle[0];
      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        cmpTags.push(tagName);
        customElements.define(
          tagName,
          proxyComponent(HostElement, cmpMeta, PROXY_FLAGS.isElementConstructor)
        );
      }
    });
  });
  if (
    BUILD.invisiblePrehydration &&
    (BUILD.hydratedClass || BUILD.hydratedAttribute)
  ) {
    var _plt$$nonce$;
    visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
    visibilityStyle.setAttribute("data-styles", "");

    // Apply CSP nonce to the style tag if it exists
    var nonce =
      (_plt$$nonce$ = plt.$nonce$) !== null && _plt$$nonce$ !== void 0
        ? _plt$$nonce$
        : queryNonceMetaTagContent(doc);
    if (nonce != null) {
      visibilityStyle.setAttribute("nonce", nonce);
    }
    head.insertBefore(
      visibilityStyle,
      metaCharset ? metaCharset.nextSibling : head.firstChild
    );
  }

  // Process deferred connectedCallbacks now all components have been registered
  isBootstrapping = false;
  if (deferredConnectedCallbacks.length) {
    deferredConnectedCallbacks.map(function (host) {
      return host.connectedCallback();
    });
  } else {
    if (BUILD.profile) {
      plt.jmp(function () {
        return (appLoadFallback = setTimeout(appDidLoad, 30, "timeout"));
      });
    } else {
      plt.jmp(function () {
        return (appLoadFallback = setTimeout(appDidLoad, 30));
      });
    }
  }
  // Fallback appLoad event
  endBootstrap();
};

export bootstrapLazy;
