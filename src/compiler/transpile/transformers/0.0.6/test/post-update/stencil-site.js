var App = (function () {
    function App() {
    }
    App.prototype.render = function () {
        return (h("div", { "class": { "app": true } }, h("site-header", null), h("div", { "class": { "wrapper": true } }, h("div", { "class": { "pull-left": true } }, h("site-menu", null)), h("div", { "class": { "pull-right": true } }, h("stencil-router", null, h("stencil-route", { "url": "/", "component": "landing-page", "exact": true }), h("stencil-route", { "url": "/demos", "component": "demos-page" }), h("stencil-route", { "url": "/docs/:pageName", "routeRender": function (props) {
                var map = {
                    "intro": "intro/index.html",
                    "getting-started": "start/index.html",
                    "my-first-component": "basics/my-first-component.html",
                    "templating": "basics/templating.html",
                    "decorators": "basics/decorators.html",
                    "events": "basics/events.html",
                    "component-lifecycle": "basics/component-lifecycle.html",
                    "stencil-config": "basics/stencil-config.html",
                    "config": "compiler/config.html",
                    "server-side-rendering": "advanced/ssr/index.html",
                    "routing": "addons/stencil-router.html",
                    "service-workers": "advanced/service-worker/index.html",
                    "distribution": "advanced/distribution/index.html",
                    "prerendering": "advanced/pre-rendering/index.html"
                };
                return (h("document-component", { "pages": [map[props.match.params.pageName]] }));
            } }), h("stencil-route", { "url": "/resources", "component": "resources-page" }))))));
    };
    return App;
}());
export { App };
