/*! Built with http://stenciljs.com */
const { h } = window.App;

class ScreenshotLookup {
    render() {
        return [
            h("ion-header", null,
                h("ion-toolbar", { color: "primary" },
                    h("ion-title", null, "Screenshot Comparison"))),
            h("ion-content", null, "a, b")
        ];
    }
    static get is() { return "screenshot-lookup"; }
    static get style() { return ".is-master {\n  background: #efffe6;\n}\n\ntable.screenshot-lookup {\n  margin: 8px;\n  width: 100%;\n  font-size: 12px;\n}\n\n.screenshot-lookup td {\n  padding: 4px 8px;\n}\n\n.screenshot-lookup .desc {\n  white-space: nowrap;\n}\n\n.screenshot-lookup .timestamp {\n  white-space: nowrap;\n}"; }
}

export { ScreenshotLookup };
