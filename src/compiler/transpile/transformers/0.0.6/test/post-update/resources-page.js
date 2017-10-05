var ResourcesPage = (function () {
    function ResourcesPage() {
        this.LINKS = {
            TEMPLATES: [
                { title: "Official Stencil Starter Project", url: "https://github.com/ionic-team/stencil-starter" },
                { title: "Stencil Boilerplate with Server Side Rendering", url: "https://github.com/mitchellsimoens/stencil-boilerplate" },
                { title: "Angular Stencil: use Stencil-built components in Angular", url: "https://github.com/seveves/angular-stencil" }
            ],
            COMPONENTS: [
                { title: "Stencil Card Component", url: "https://github.com/henriquecustodia/stencil-card-app" },
                { title: "st-image: lazy loaded images", url: "https://github.com/jgw96/st-img" },
                { title: "st-payment: Stencil Payment API Component", url: "https://github.com/Fdom92/stencil-payment" },
                { title: "st-fetch: A simple component for performing http fetch calls", url: "https://github.com/Fdom92/stencil-fetch" }
                //{ title: '', url: '' }
            ]
        };
        document.title = "Stencil Resources";
    }
    ResourcesPage.prototype.render = function () {
        return (h("div", null, h("h1", null, "Resources"), h("h4", null, "Resources to help you get more out of Stencil"), h("div", null, h("h2", null, "Community Articles/Blogs"), h("p", null, "Disclaimer: these articles are community-created, and might contain inaccurate, or outdated information and code snippets."), h("ul", null, h("li", null, h("a", { "target": "_blank", "href": "https://www.youtube.com/watch?v=UfD-k7aHkQE" }, "Announcing Stencil.js")), h("li", null, h("a", { "target": "_blank", "href": "https://www.youtube.com/watch?v=MqMYaT1GlWY" }, "Stencil - Getting Started (video)")), h("li", null, h("a", { "target": "_blank", "href": "https://github.com/ospatil/ng-components-integration" }, "Using a Stencil-built component in Angular")), h("li", null, h("a", { "target": "_blank", "href": "https://coryrylan.com/blog/create-your-first-web-component-with-stencil-js" }, "Create your First Stencil Component")), h("li", null, h("a", { "target": "_blank", "href": "https://alligator.io/stencil/getting-started/" }, "Getting Started With Stencil")), h("li", null, h("a", { "target": "_blank", "href": "https://medium.com/@sinedied/stencil-js-its-finally-time-for-vanilla-web-components-927d26b573e1" }, "Stencil.js: It's finally time for vanilla web components!")), h("li", null, h("a", { "target": "_blank", "href": "https://github.com/aaronksaunders/stencil-mobx" }, "Stencil with MobX")), h("li", null, h("a", { "target": "_blank", "href": "https://www.datacodedesign.de/webkomponenten-mit-stencil-ein-erster-ueberblick/" }, "Webkomponenten mit Stencil \u2013 Ein erster \u00DCberblick (in German)")), h("li", null, h("a", { "target": "_blank", "href": "https://medium.com/t%C3%BCrkiye/stencile-giri%C5%9F-41e90e37595d" }, "Stencil\u2019e Giri\u015F (in Turkish)")), h("li", null, h("a", { "target": "_blank", "href": "https://medium.com/t%C3%BCrkiye/stencilde-bilesenler-arasi-haberlesme-52523a470fa9" }, "Stencil\u2019de Bile\u015Fenler Aras\u0131 Haberle\u015Fme (in Turkish)")))), h("div", null, h("h2", null, "Third-party Components/Templates"), h("ul", null, this.LINKS.COMPONENTS.map(function (link) {
            return (h("li", null, h("a", { "target": "_blank", "href": link.url }, link.title)));
        }), this.LINKS.TEMPLATES.map(function (link) {
            return (h("li", null, h("a", { "target": "_blank", "href": link.url }, link.title)));
        }))), h("div", null, h("h2", null, "Present Stencil"), h("div", { "class": { "slide-wrapper": true } }, h("lazy-iframe", { "style": { "border": "1px solid #eee" }, "src": "https://ionic-team.github.io/stencil-present/", "title": "Present Stencil" })), h("p", null, "A forkable presentation for your next meetup or conference talk on Stencil. Built with ", h("a", { "href": "lab.hakim.se/reveal-js/" }, "Reveal.js")), h("a", { "target": "_blank", "href": "https://ionic-team.github.io/stencil-present/" }, "Stencil Presentation"), h("br", null), h("a", { "target": "_blank", "href": "https://github.com/ionic-team/stencil-present/" }, "Source"))));
    };
    return ResourcesPage;
}());
export { ResourcesPage };
