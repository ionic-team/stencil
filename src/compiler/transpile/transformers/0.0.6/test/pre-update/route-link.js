import matchPath from '../../utils/match-path';
var RouteLink = /** @class */ (function () {
    function RouteLink() {
        this.unsubscribe = function () { return; };
        this.exact = false;
        this.custom = false;
        this.activeClass = 'link-active';
        this.match = null;
    }
    // Identify if the current route is a match.
    RouteLink.prototype.computeMatch = function (pathname) {
        if (!pathname) {
            var location_1 = this.activeRouter.get('location');
            pathname = location_1.pathname;
        }
        var match = matchPath(pathname, {
            path: this.urlMatch || this.url,
            exact: this.exact,
            strict: true
        });
        return match;
    };
    RouteLink.prototype.componentWillLoad = function () {
        var _this = this;
        // subscribe the project's active router and listen
        // for changes. Recompute the match if any updates get
        // pushed
        this.unsubscribe = this.activeRouter.subscribe(function () {
            _this.match = _this.computeMatch();
        });
        // Likely that this route link could receive a location prop
        this.match = this.computeMatch();
    };
    RouteLink.prototype.componentDidUnload = function () {
        // be sure to unsubscribe to the router so that we don't
        // get any memory leaks
        this.unsubscribe();
    };
    RouteLink.prototype.handleClick = function (e) {
        e.preventDefault();
        if (!this.activeRouter) {
            console.warn('<stencil-route-link> wasn\'t passed an instance of the router as the "router" prop!');
            return;
        }
        var history = this.activeRouter.get('history');
        return history.push(this.url, {});
    };
    RouteLink.prototype.render = function () {
        var classes = (_a = {},
            _a[this.activeClass] = this.match !== null,
            _a);
        if (this.custom) {
            return (h("span", { "c": classes, "o": { "click": this.handleClick.bind(this) } },
                h(0, 0)));
        }
        else {
            return (h("a", { "c": classes, "o": { "click": this.handleClick.bind(this) }, "p": { "href": this.url } },
                h(0, 0)));
        }
        var _a;
    };
    return RouteLink;
}());
export { RouteLink };
