/*! Built with http://stenciljs.com */
const { h } = window.App;

class AppRoot {
    render() {
        return (h("stencil-router", null,
            h("stencil-route-switch", null,
                h("stencil-route", { url: "/", component: "screenshot-lookup", exact: true }),
                h("stencil-route", { url: "/:a/:b/", component: "screenshot-compare" }))));
    }
    static get is() { return "app-root"; }
}

export { AppRoot };
