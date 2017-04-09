(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @hidden
     * @param {?} config
     * @param {?} plt
     * @param {?} domCtrl
     * @param {?} zone
     * @return {?}
     */
    function setupCore(config, plt, domCtrl, zone) {
        return function () {
            var /** @type {?} */ win = plt.win();
            var /** @type {?} */ doc = plt.doc();
            var /** @type {?} */ ionic = win['Ionic'];
            if (!ionic || !ionic['staticDir']) {
                // window.Ionic should already exist and
                // window.Ionic.staticDir should have been added to the
                // main bundle referencing the static www build directory
                return;
            }
            // same controllers are used by ionic core
            ionic['configCtrl'] = config;
            // keep core and angular dom reads/writes *nsync
            ionic['domCtrl'] = domCtrl;
            // next tick controller created here so that it can
            // be created to run outside of angular
            ionic['nextTickCtrl'] = getNextTickController(zone, plt.userAgent().toLowerCase());
            // build up a path for the exact ionic core javascript file this browser needs
            var /** @type {?} */ pathItems = ['core'];
            if (!('attachShadow' in Element.prototype)) {
                // browser requires the shadow dom polyfill
                pathItems.push('sd');
            }
            if (!win.customElements) {
                // browser requires the custom elements polyfill
                pathItems.push('ce');
            }
            // request the ionic core file this browser needs
            var /** @type {?} */ s = doc.createElement('script');
            s.src = ionic['staticDir'] + "ionic." + pathItems.join('.') + ".js";
            doc.head.appendChild(s);
            return {};
        };
    }
    exports.setupCore = setupCore;
    /**
     * @param {?} zone
     * @param {?} ua
     * @return {?}
     */
    function getNextTickController(zone, ua) {
        /* Adopted from Vue.js, MIT, https://github.com/vuejs/vue */
        var /** @type {?} */ callbacks = [];
        var /** @type {?} */ isIOS = /iphone|ipad|ipod|ios/.test(ua);
        var /** @type {?} */ noop = function () { };
        var /** @type {?} */ promise = Promise.resolve();
        var /** @type {?} */ logError = function (err) { console.error(err); };
        var /** @type {?} */ pending = false;
        /**
         * @return {?}
         */
        function nextTickHandler() {
            pending = false;
            var /** @type {?} */ copies = callbacks.slice(0);
            callbacks.length = 0;
            for (var /** @type {?} */ i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }
        /**
         * @return {?}
         */
        function promiseTick() {
            zone.runOutsideAngular(function () {
                promise.then(nextTickHandler).catch(logError);
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS)
                    setTimeout(noop);
            });
        }
        /**
         * @param {?} cb
         * @return {?}
         */
        function queueNextTick(cb) {
            callbacks.push(cb);
            if (!pending) {
                pending = true;
                promiseTick();
            }
        }
        return {
            nextTick: queueNextTick
        };
    }
});
//# sourceMappingURL=ionic-core.js.map