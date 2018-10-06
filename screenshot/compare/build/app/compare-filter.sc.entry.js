/*! Built with http://stenciljs.com */
const { h } = window.App;

class CompareFilter {
    render() {
        return (h("div", null));
    }
    static get is() { return "compare-filter"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return ".sc-compare-filter-h {\n  text-align: right;\n}"; }
}

class CompareHeader {
    constructor() {
        this.repo = null;
    }
    logoClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        document.querySelector('.scroll-view').scrollTop = 0;
    }
    render() {
        return [
            (this.repo ? (h("nav", { class: "breadcrumbs" },
                h("a", { href: this.repo.orgUrl }, this.repo.orgUrl),
                h("a", { href: this.repo.repoUrl }, this.repo.repoName),
                h("a", { href: this.repo.commitsUrl }, "commits"))) : null),
            h("header", null,
                h("div", { class: "logo" },
                    h("a", { href: "#", onClick: this.logoClick.bind(this) },
                        h("img", { src: this.appSrcUrl + '/assets/logo.png' }))),
                h("compare-filter", { class: "filter" }))
        ];
    }
    static get is() { return "compare-header"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "appSrcUrl": {
            "type": String,
            "attr": "app-src-url"
        },
        "repo": {
            "type": "Any",
            "attr": "repo"
        }
    }; }
    static get style() { return ".sc-compare-header-h {\n  background: white;\n}\n\nnav.sc-compare-header {\n  padding: 4px 4px;\n}\n\nnav.sc-compare-header   a.sc-compare-header {\n  font-size: 14px;\n  text-decoration: none;\n  color: var(--breadcrumb-color);\n  display: inline-block;\n  padding: 0 4px 0 4px;\n}\n\nnav.sc-compare-header   a.sc-compare-header:hover {\n  text-decoration: underline;\n}\n\nheader.sc-compare-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 8px;\n}\n\nimg.sc-compare-header {\n  width: 174px;\n  height: 32px;\n}\n\n.logo.sc-compare-header {\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  padding: 7px;\n}\n\ncompare-filter.sc-compare-header {\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n}\n\nh1.sc-compare-header {\n  margin: 0;\n  padding: 0;\n  font-size: 18px;\n}"; }
}

export { CompareFilter, CompareHeader };
