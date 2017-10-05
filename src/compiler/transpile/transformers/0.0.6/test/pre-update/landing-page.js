var LandingPage = /** @class */ (function () {
    function LandingPage() {
        document.title = "Stencil";
    }
    LandingPage.prototype.render = function () {
        return (h("div", 0,
            h("h1", 0, t("The magical, reusable web component generator.")),
            h("h4", 0, t("Stencil is a tool for building modern Web Components")),
            h("p", 0, t("Stencil combines some of the best features from traditional frameworks, but outputs 100% standards-compliant Custom Elements, part of the Web Component spec.")),
            h("p", 0, t("Stencil was created by the"),
                h("a", { "a": { "href": "http://ionicframework.com/" } }, t("Ionic Framework")), t(" team to build faster, more powerful mobile and web apps. Stencil is the foundation for the next generation of Ionic Framework, but is completely independent of Ionic or any other UI framework.")),
            h("lazy-iframe", { "a": { "src": "https://www.youtube.com/embed/UfD-k7aHkQE", "title": "Ionic team at Polymer Summit video" } }),
            h("p", 0,
                h("stencil-route-link", { "c": { "button": true }, "a": { "url": "/docs/intro", "custom": "true" } }, t("Learn More about Stencil")))));
    };
    return LandingPage;
}());
export { LandingPage };
