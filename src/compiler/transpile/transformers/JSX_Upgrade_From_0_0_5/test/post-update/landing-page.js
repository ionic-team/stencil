var LandingPage = (function () {
    function LandingPage() {
        document.title = "Stencil";
    }
    LandingPage.prototype.render = function () {
        return (h("div", null, h("h1", null, "The magical, reusable web component generator."), h("h4", null, "Stencil is a tool for building modern Web Components"), h("p", null, "Stencil combines some of the best features from traditional frameworks, but outputs 100% standards-compliant Custom Elements, part of the Web Component spec."), h("p", null, "Stencil was created by the", h("a", { "href": "http://ionicframework.com/" }, "Ionic Framework"), " team to build faster, more powerful mobile and web apps. Stencil is the foundation for the next generation of Ionic Framework, but is completely independent of Ionic or any other UI framework."), h("lazy-iframe", { "src": "https://www.youtube.com/embed/UfD-k7aHkQE", "title": "Ionic team at Polymer Summit video" }), h("p", null, h("stencil-route-link", { "class": { "button": true }, "url": "/docs/intro", "custom": "true" }, "Learn More about Stencil"))));
    };
    return LandingPage;
}());
export { LandingPage };
