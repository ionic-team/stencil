var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import matchPath from '../../utils/match-path';
var Route = (function () {
    function Route() {
        this.unsubscribe = function () { return; };
        this.componentProps = {};
        this.exact = false;
        this.group = null;
        this.routeRender = null;
        this.match = null;
    }
    // Identify if the current route is a match.
    Route.prototype.computeMatch = function (pathname) {
        if (!pathname) {
            var location_1 = this.activeRouter.get('location');
            pathname = location_1.pathname;
        }
        var newMatch = matchPath(pathname, {
            path: this.url,
            exact: this.exact,
            strict: true
        });
        // If we have a match and we've already matched for the group, don't set the match
        if (newMatch) {
            if (this.group && this.activeRouter.didGroupAlreadyMatch(this.group)) {
                return null;
            }
            this.group && this.activeRouter.setGroupMatched(this.group);
        }
        return newMatch;
    };
    Route.prototype.componentWillLoad = function () {
        // subscribe the project's active router and listen
        // for changes. Recompute the match if any updates get
        // pushed
        var _this = this;
        if (this.group) {
            this.activeRouter.addToGroup(this, this.group);
        }
        this.unsubscribe = this.activeRouter.subscribe(function () {
            _this.match = _this.computeMatch();
        });
        this.match = this.computeMatch();
    };
    Route.prototype.componentDidUnload = function () {
        // be sure to unsubscribe to the router so that we don't
        // get any memory leaks
        this.activeRouter.removeFromGroups(this);
        this.unsubscribe();
    };
    Route.prototype.render = function () {
        // If there is no activeRouter then do not render
        // Check if this route is in the matching URL (for example, a parent route)
        if (!this.activeRouter || !this.match) {
            return null;
        }
        // component props defined in route
        // the history api
        // current match data including params
        var childProps = __assign({}, this.componentProps, { history: this.activeRouter.get('history'), match: this.match });
        // If there is a routerRender defined then use
        // that and pass the component and component props with it.
        if (this.routeRender) {
            return this.routeRender(__assign({}, childProps, { component: this.component }));
        }
        if (this.component) {
            var ChildComponent = this.component;
            return h(ChildComponent, __assign({}, childProps));
        }
    };
    return Route;
}());
export { Route };
