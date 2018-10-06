/*! Built with http://stenciljs.com */
App.loadBundle('screenshot-lookup', ['exports'], function (exports) {
    var h = window.App.h;
    var ScreenshotLookup = /** @class */ (function () {
        function ScreenshotLookup() {
        }
        ScreenshotLookup.prototype.render = function () {
            return [
                h("ion-header", null, h("ion-toolbar", { color: "primary" }, h("ion-title", null, "Screenshot Comparison"))),
                h("ion-content", null, "a, b")
            ];
        };
        Object.defineProperty(ScreenshotLookup, "is", {
            get: function () { return "screenshot-lookup"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenshotLookup, "style", {
            get: function () { return ".is-master {\n  background: #efffe6;\n}\n\ntable.screenshot-lookup {\n  margin: 8px;\n  width: 100%;\n  font-size: 12px;\n}\n\n.screenshot-lookup td {\n  padding: 4px 8px;\n}\n\n.screenshot-lookup .desc {\n  white-space: nowrap;\n}\n\n.screenshot-lookup .timestamp {\n  white-space: nowrap;\n}"; },
            enumerable: true,
            configurable: true
        });
        return ScreenshotLookup;
    }());
    exports.ScreenshotLookup = ScreenshotLookup;
    Object.defineProperty(exports, '__esModule', { value: true });
});
