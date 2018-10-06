/*! Built with http://stenciljs.com */
App.loadBundle('compare-filter', ['exports'], function (exports) {
    var h = window.App.h;
    var CompareFilter = /** @class */ (function () {
        function CompareFilter() {
        }
        CompareFilter.prototype.render = function () {
            return (h("div", null));
        };
        Object.defineProperty(CompareFilter, "is", {
            get: function () { return "compare-filter"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareFilter, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareFilter, "style", {
            get: function () { return ":host {\n  text-align: right;\n}"; },
            enumerable: true,
            configurable: true
        });
        return CompareFilter;
    }());
    var CompareHeader = /** @class */ (function () {
        function CompareHeader() {
            this.repo = null;
        }
        CompareHeader.prototype.logoClick = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            document.querySelector('.scroll-view').scrollTop = 0;
        };
        CompareHeader.prototype.render = function () {
            return [
                (this.repo ? (h("nav", { class: "breadcrumbs" }, h("a", { href: this.repo.orgUrl }, this.repo.orgUrl), h("a", { href: this.repo.repoUrl }, this.repo.repoName), h("a", { href: this.repo.commitsUrl }, "commits"))) : null),
                h("header", null, h("div", { class: "logo" }, h("a", { href: "#", onClick: this.logoClick.bind(this) }, h("img", { src: this.appSrcUrl + '/assets/logo.png' }))), h("compare-filter", { class: "filter" }))
            ];
        };
        Object.defineProperty(CompareHeader, "is", {
            get: function () { return "compare-header"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareHeader, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareHeader, "properties", {
            get: function () {
                return {
                    "appSrcUrl": {
                        "type": String,
                        "attr": "app-src-url"
                    },
                    "repo": {
                        "type": "Any",
                        "attr": "repo"
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareHeader, "style", {
            get: function () { return ":host {\n  background: white;\n}\n\nnav {\n  padding: 4px 4px;\n}\n\nnav a {\n  font-size: 14px;\n  text-decoration: none;\n  color: var(--breadcrumb-color);\n  display: inline-block;\n  padding: 0 4px 0 4px;\n}\n\nnav a:hover {\n  text-decoration: underline;\n}\n\nheader {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 8px;\n}\n\nimg {\n  width: 174px;\n  height: 32px;\n}\n\n.logo {\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  padding: 7px;\n}\n\ncompare-filter {\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n}\n\nh1 {\n  margin: 0;\n  padding: 0;\n  font-size: 18px;\n}"; },
            enumerable: true,
            configurable: true
        });
        return CompareHeader;
    }());
    exports.CompareFilter = CompareFilter;
    exports.CompareHeader = CompareHeader;
    Object.defineProperty(exports, '__esModule', { value: true });
});
