import createHistory from '../../utils/createBrowserHistory';
var Router = /** @class */ (function () {
    function Router() {
        this.root = '/';
        // A suffix to append to the page title whenever
        // it's updated through RouteTitle
        this.titleSuffix = '';
        this.unsubscribe = function () { };
        this.match = null;
    }
    Router.prototype.titleSuffixChanged = function (newValue) {
        console.log('title suffix changed');
        this.activeRouter.set({
            titleSuffix: newValue
        });
    };
    Router.prototype.computeMatch = function (pathname) {
        return {
            path: this.root,
            url: this.root,
            isExact: pathname === this.root,
            params: {}
        };
    };
    Router.prototype.componentWillLoad = function () {
        var _this = this;
        var history = createHistory();
        history.listen(function (location) {
            _this.activeRouter.set({ location: location });
        });
        this.activeRouter.set({
            location: history.location,
            titleSuffix: this.titleSuffix,
            history: history
        });
        // subscribe the project's active router and listen
        // for changes. Recompute the match if any updates get
        // pushed
        this.unsubscribe = this.activeRouter.subscribe(function () {
            _this.match = _this.computeMatch();
        });
        this.match = this.computeMatch();
    };
    Router.prototype.componentDidUnload = function () {
        // be sure to unsubscribe to the router so that we don't
        // get any memory leaks
        this.unsubscribe();
    };
    Router.prototype.render = function () {
        return h(0, 0);
    };
    return Router;
}());
export { Router };
