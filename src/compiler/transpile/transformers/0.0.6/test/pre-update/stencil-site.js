var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.render = function () {
        return (h("div", { "c": { "app": true } },
            h("site-header", 0),
            h("div", { "c": { "wrapper": true } },
                h("div", { "c": { "pull-left": true } },
                    h("site-menu", 0)),
                h("div", { "c": { "pull-right": true } },
                    h("stencil-router", 0,
                        h("stencil-route", { "a": { "url": "/", "component": "landing-page" }, "p": { "exact": true } }),
                        h("stencil-route", { "a": { "url": "/demos", "component": "demos-page" } }),
                        h("stencil-route", { "a": { "url": "/docs/:pageName" }, "p": { "routeRender": function (props) {
                                    var map = {
                                        'intro': 'intro/index.html',
                                        'getting-started': 'start/index.html',
                                        'my-first-component': 'basics/my-first-component.html',
                                        'templating': 'basics/templating.html',
                                        'decorators': 'basics/decorators.html',
                                        'events': 'basics/events.html',
                                        'component-lifecycle': 'basics/component-lifecycle.html',
                                        'stencil-config': 'basics/stencil-config.html',
                                        'config': 'compiler/config.html',
                                        'server-side-rendering': 'advanced/ssr/index.html',
                                        'routing': 'addons/stencil-router.html',
                                        'service-workers': 'advanced/service-worker/index.html',
                                        'distribution': 'advanced/distribution/index.html',
                                        'prerendering': 'advanced/pre-rendering/index.html'
                                    };
                                    return (h("document-component", { "p": { "pages": [map[props.match.params.pageName]] } }));
                                } } }),
                        h("stencil-route", { "a": { "url": "/resources", "component": "resources-page" } }))))));
    };
    return App;
}());
export { App };
