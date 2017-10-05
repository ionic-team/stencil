var ResourcesPage = /** @class */ (function () {
    function ResourcesPage() {
        this.LINKS = {
            TEMPLATES: [
                { title: 'Official Stencil Starter Project', url: 'https://github.com/ionic-team/stencil-starter' },
                { title: 'Stencil Boilerplate with Server Side Rendering', url: 'https://github.com/mitchellsimoens/stencil-boilerplate' },
                { title: 'Angular Stencil: use Stencil-built components in Angular', url: 'https://github.com/seveves/angular-stencil' }
            ],
            COMPONENTS: [
                { title: 'Stencil Card Component', url: 'https://github.com/henriquecustodia/stencil-card-app' },
                { title: 'st-image: lazy loaded images', url: 'https://github.com/jgw96/st-img' },
                { title: 'st-payment: Stencil Payment API Component', url: 'https://github.com/Fdom92/stencil-payment' },
                { title: 'st-fetch: A simple component for performing http fetch calls', url: 'https://github.com/Fdom92/stencil-fetch' }
                //{ title: '', url: '' }
            ]
        };
        document.title = "Stencil Resources";
    }
    ResourcesPage.prototype.render = function () {
        return (h("div", 0,
            h("h1", 0, t("Resources")),
            h("h4", 0, t("Resources to help you get more out of Stencil")),
            h("div", 0,
                h("h2", 0, t("Community Articles/Blogs")),
                h("p", 0, t("Disclaimer: these articles are community-created, and might contain inaccurate, or outdated information and code snippets.")),
                h("ul", 0,
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://www.youtube.com/watch?v=UfD-k7aHkQE" } }, t("Announcing Stencil.js"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://www.youtube.com/watch?v=MqMYaT1GlWY" } }, t("Stencil - Getting Started (video)"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://github.com/ospatil/ng-components-integration" } }, t("Using a Stencil-built component in Angular"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://coryrylan.com/blog/create-your-first-web-component-with-stencil-js" } }, t("Create your First Stencil Component"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://alligator.io/stencil/getting-started/" } }, t("Getting Started With Stencil"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://medium.com/@sinedied/stencil-js-its-finally-time-for-vanilla-web-components-927d26b573e1" } }, t("Stencil.js: It's finally time for vanilla web components!"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://github.com/aaronksaunders/stencil-mobx" } }, t("Stencil with MobX"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://www.datacodedesign.de/webkomponenten-mit-stencil-ein-erster-ueberblick/" } }, t("Webkomponenten mit Stencil \u2013 Ein erster \u00DCberblick (in German)"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://medium.com/t%C3%BCrkiye/stencile-giri%C5%9F-41e90e37595d" } }, t("Stencil\u2019e Giri\u015F (in Turkish)"))),
                    h("li", 0,
                        h("a", { "a": { "target": "_blank", "href": "https://medium.com/t%C3%BCrkiye/stencilde-bilesenler-arasi-haberlesme-52523a470fa9" } }, t("Stencil\u2019de Bile\u015Fenler Aras\u0131 Haberle\u015Fme (in Turkish)"))))),
            h("div", 0,
                h("h2", 0, t("Third-party Components/Templates")),
                h("ul", 0,
                    this.LINKS.COMPONENTS.map(function (link) {
                        return (h("li", 0,
                            h("a", { "a": { "target": "_blank" }, "p": { "href": link.url } }, link.title)));
                    }),
                    this.LINKS.TEMPLATES.map(function (link) {
                        return (h("li", 0,
                            h("a", { "a": { "target": "_blank" }, "p": { "href": link.url } }, link.title)));
                    }))),
            h("div", 0,
                h("h2", 0, t("Present Stencil")),
                h("div", { "c": { "slide-wrapper": true } },
                    h("lazy-iframe", { "s": { "border": '1px solid #eee' }, "a": { "src": "https://ionic-team.github.io/stencil-present/", "title": "Present Stencil" } })),
                h("p", 0, t("A forkable presentation for your next meetup or conference talk on Stencil. Built with "),
                    h("a", { "a": { "href": "lab.hakim.se/reveal-js/" } }, t("Reveal.js"))),
                h("a", { "a": { "target": "_blank", "href": "https://ionic-team.github.io/stencil-present/" } }, t("Stencil Presentation")),
                h("br", 0),
                h("a", { "a": { "target": "_blank", "href": "https://github.com/ionic-team/stencil-present/" } }, t("Source")))));
    };
    return ResourcesPage;
}());
export { ResourcesPage };
