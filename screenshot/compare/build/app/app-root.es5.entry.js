/*! Built with http://stenciljs.com */
App.loadBundle('app-root', ['exports'], function (exports) {
    var h = window.App.h;
    var AppRoot = /** @class */ (function () {
        function AppRoot() {
        }
        AppRoot.prototype.render = function () {
            return (h("stencil-router", null, h("stencil-route-switch", null, h("stencil-route", { url: "/", component: "screenshot-lookup", exact: true }), h("stencil-route", { url: "/:a/:b/", component: "screenshot-compare" }))));
        };
        Object.defineProperty(AppRoot, "is", {
            get: function () { return "app-root"; },
            enumerable: true,
            configurable: true
        });
        return AppRoot;
    }());
    exports.AppRoot = AppRoot;
    Object.defineProperty(exports, '__esModule', { value: true });
});
