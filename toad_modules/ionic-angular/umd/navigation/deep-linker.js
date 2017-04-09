(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./nav-util", "../util/util", "./view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nav_util_1 = require("./nav-util");
    var util_1 = require("../util/util");
    var view_controller_1 = require("./view-controller");
    /**
     * @hidden
     */
    var DeepLinker = (function () {
        /**
         * @param {?} _app
         * @param {?} _serializer
         * @param {?} _location
         * @param {?} _moduleLoader
         * @param {?} _baseCfr
         */
        function DeepLinker(_app, _serializer, _location, _moduleLoader, _baseCfr) {
            this._app = _app;
            this._serializer = _serializer;
            this._location = _location;
            this._moduleLoader = _moduleLoader;
            this._baseCfr = _baseCfr;
            /**
             * \@internal
             */
            this._segments = [];
            /**
             * \@internal
             */
            this._history = [];
        }
        /**
         * \@internal
         * @return {?}
         */
        DeepLinker.prototype.init = function () {
            var _this = this;
            // scenario 1: Initial load of all navs from the initial browser URL
            var /** @type {?} */ browserUrl = normalizeUrl(this._location.path());
            (void 0) /* console.debug */;
            // update the Path from the browser URL
            this._segments = this._serializer.parse(browserUrl);
            // remember this URL in our internal history stack
            this._historyPush(browserUrl);
            // listen for browser URL changes
            this._location.subscribe(function (locationChg) {
                _this._urlChange(normalizeUrl(locationChg.url));
            });
        };
        /**
         * The browser's location has been updated somehow.
         * \@internal
         * @param {?} browserUrl
         * @return {?}
         */
        DeepLinker.prototype._urlChange = function (browserUrl) {
            // do nothing if this url is the same as the current one
            if (!this._isCurrentUrl(browserUrl)) {
                if (this._isBackUrl(browserUrl)) {
                    // scenario 2: user clicked the browser back button
                    // scenario 4: user changed the browser URL to what was the back url was
                    // scenario 5: user clicked a link href that was the back url
                    (void 0) /* console.debug */;
                    this._historyPop();
                }
                else {
                    // scenario 3: user click forward button
                    // scenario 4: user changed browser URL that wasn't the back url
                    // scenario 5: user clicked a link href that wasn't the back url
                    (void 0) /* console.debug */;
                    this._historyPush(browserUrl);
                }
                // get the app's root nav
                var /** @type {?} */ appRootNav = (this._app.getRootNav());
                if (appRootNav) {
                    if (browserUrl === '/') {
                        // a url change to the index url
                        if (util_1.isPresent(this._indexAliasUrl)) {
                            // we already know the indexAliasUrl
                            // update the url to use the know alias
                            browserUrl = this._indexAliasUrl;
                        }
                        else {
                            // the url change is to the root but we don't
                            // already know the url used. So let's just
                            // reset the root nav to its root page
                            appRootNav.goToRoot({
                                updateUrl: false,
                                isNavRoot: true
                            });
                            return;
                        }
                    }
                    // normal url
                    this._segments = this._serializer.parse(browserUrl);
                    this._loadNavFromPath(appRootNav);
                }
            }
        };
        /**
         * Update the deep linker using the NavController's current active view.
         * \@internal
         * @param {?} direction
         * @return {?}
         */
        DeepLinker.prototype.navChange = function (direction) {
            // all transitions completed
            if (direction) {
                // get the app's active nav, which is the lowest level one being viewed
                var /** @type {?} */ activeNav = this._app.getActiveNav();
                if (activeNav) {
                    // build up the segments of all the navs from the lowest level
                    this._segments = this._pathFromNavs(activeNav);
                    // build a string URL out of the Path
                    var /** @type {?} */ browserUrl = this._serializer.serialize(this._segments);
                    // update the browser's location
                    this._updateLocation(browserUrl, direction);
                }
            }
        };
        /**
         * \@internal
         * @param {?} browserUrl
         * @param {?} direction
         * @return {?}
         */
        DeepLinker.prototype._updateLocation = function (browserUrl, direction) {
            if (this._indexAliasUrl === browserUrl) {
                browserUrl = '/';
            }
            if (direction === nav_util_1.DIRECTION_BACK && this._isBackUrl(browserUrl)) {
                // this URL is exactly the same as the back URL
                // it's safe to use the browser's location.back()
                (void 0) /* console.debug */;
                this._historyPop();
                this._location.back();
            }
            else if (!this._isCurrentUrl(browserUrl)) {
                // probably navigating forward
                (void 0) /* console.debug */;
                this._historyPush(browserUrl);
                this._location.go(browserUrl);
            }
        };
        /**
         * @param {?} componentName
         * @return {?}
         */
        DeepLinker.prototype.getComponentFromName = function (componentName) {
            var /** @type {?} */ link = this._serializer.getLinkFromName(componentName);
            if (link) {
                // cool, we found the right link for this component name
                return this.getNavLinkComponent(link);
            }
            // umm, idk
            return Promise.reject("invalid link: " + componentName);
        };
        /**
         * @param {?} link
         * @return {?}
         */
        DeepLinker.prototype.getNavLinkComponent = function (link) {
            if (link.component) {
                // sweet, we're already got a component loaded for this link
                return Promise.resolve(link.component);
            }
            if (link.loadChildren) {
                // awesome, looks like we'll lazy load this component
                // using loadChildren as the URL to request
                return this._moduleLoader.load(link.loadChildren).then(function (response) {
                    link.component = response.component;
                    return response.component;
                });
            }
            return Promise.reject("invalid link component: " + link.name);
        };
        /**
         * \@internal
         * @param {?} component
         * @return {?}
         */
        DeepLinker.prototype.resolveComponent = function (component) {
            var /** @type {?} */ cfr = this._moduleLoader.getComponentFactoryResolver(component);
            if (!cfr) {
                cfr = this._baseCfr;
            }
            return cfr.resolveComponentFactory(component);
        };
        /**
         * \@internal
         * @param {?} nav
         * @param {?} nameOrComponent
         * @param {?} data
         * @param {?=} prepareExternalUrl
         * @return {?}
         */
        DeepLinker.prototype.createUrl = function (nav, nameOrComponent, data, prepareExternalUrl) {
            if (prepareExternalUrl === void 0) { prepareExternalUrl = true; }
            // create a segment out of just the passed in name
            var /** @type {?} */ segment = this._serializer.createSegmentFromName(nameOrComponent);
            if (segment) {
                var /** @type {?} */ path = this._pathFromNavs(nav, segment.component, data);
                // serialize the segments into a browser URL
                // and prepare the URL with the location and return
                var /** @type {?} */ url = this._serializer.serialize(path);
                return prepareExternalUrl ? this._location.prepareExternalUrl(url) : url;
            }
            return '';
        };
        /**
         * Build a browser URL out of this NavController. Climbs up the tree
         * of NavController's to create a string representation of all the
         * NavControllers state.
         *
         * \@internal
         * @param {?} nav
         * @param {?=} component
         * @param {?=} data
         * @return {?}
         */
        DeepLinker.prototype._pathFromNavs = function (nav, component, data) {
            var /** @type {?} */ segments = [];
            var /** @type {?} */ view;
            var /** @type {?} */ segment;
            var /** @type {?} */ tabSelector;
            // recursivly climb up the nav ancestors
            // and set each segment's data
            while (nav) {
                // this could be an ion-nav, ion-tab or ion-portal
                // if a component and data was already passed in then use it
                // otherwise get this nav's active view controller
                if (!component && nav_util_1.isNav(nav)) {
                    view = nav.getActive(true);
                    if (view) {
                        component = view.component;
                        data = view.data;
                    }
                }
                // the ion-nav or ion-portal has an active view
                // serialize the component and its data to a NavSegment
                segment = this._serializer.serializeComponent(component, data);
                // reset the component/data
                component = data = null;
                if (!segment) {
                    break;
                }
                // add the segment to the path
                segments.push(segment);
                if (nav_util_1.isTab(nav)) {
                    // this nav is a Tab, which is a child of Tabs
                    // add a segment to represent which Tab is the selected one
                    tabSelector = this._getTabSelector(/** @type {?} */ (nav));
                    segments.push({
                        id: tabSelector,
                        name: tabSelector,
                        component: null,
                        data: null
                    });
                    // a parent to Tab is a Tabs
                    // we should skip over any Tabs and go to the next parent
                    nav = nav.parent && nav.parent.parent;
                }
                else {
                    // this is an ion-nav
                    // climb up to the next parent
                    nav = nav.parent;
                }
            }
            // segments added from bottom to top, so Ti esrever dna ti pilf
            return segments.reverse();
        };
        /**
         * \@internal
         * @param {?} tab
         * @return {?}
         */
        DeepLinker.prototype._getTabSelector = function (tab) {
            if (util_1.isPresent(tab.tabUrlPath)) {
                return tab.tabUrlPath;
            }
            if (util_1.isPresent(tab.tabTitle)) {
                return this._serializer.formatUrlPart(tab.tabTitle);
            }
            return "tab-" + tab.index;
        };
        /**
         * \@internal
         * @param {?} tabsNav
         * @param {?} pathName
         * @param {?=} fallbackIndex
         * @return {?}
         */
        DeepLinker.prototype.getSelectedTabIndex = function (tabsNav, pathName, fallbackIndex) {
            var _this = this;
            if (fallbackIndex === void 0) { fallbackIndex = 0; }
            // we found a segment which probably represents which tab to select
            var /** @type {?} */ indexMatch = pathName.match(/tab-(\d+)/);
            if (indexMatch) {
                // awesome, the segment name was something "tab-0", and
                // the numbe represents which tab to select
                return parseInt(indexMatch[1], 10);
            }
            // wasn't in the "tab-0" format so maybe it's using a word
            var /** @type {?} */ tab = tabsNav._tabs.find(function (t) {
                return (util_1.isPresent(t.tabUrlPath) && t.tabUrlPath === pathName) ||
                    (util_1.isPresent(t.tabTitle) && _this._serializer.formatUrlPart(t.tabTitle) === pathName);
            });
            return util_1.isPresent(tab) ? tab.index : fallbackIndex;
        };
        /**
         * Each NavController will call this method when it initializes for
         * the first time. This allows each NavController to figure out
         * where it lives in the path and load up the correct component.
         * \@internal
         * @param {?} nav
         * @return {?}
         */
        DeepLinker.prototype.initNav = function (nav) {
            var /** @type {?} */ path = this._segments;
            if (nav && path.length) {
                if (!nav.parent) {
                    // a nav without a parent is always the first nav segment
                    path[0].navId = nav.id;
                    return path[0];
                }
                for (var /** @type {?} */ i = 1; i < path.length; i++) {
                    if (path[i - 1].navId === nav.parent.id) {
                        // this nav's parent segment is the one before this segment's index
                        path[i].navId = nav.id;
                        return path[i];
                    }
                }
            }
            return null;
        };
        /**
         * \@internal
         * @param {?} segment
         * @return {?}
         */
        DeepLinker.prototype.initViews = function (segment) {
            var _this = this;
            var /** @type {?} */ link = this._serializer.getLinkFromName(segment.name);
            return this.getNavLinkComponent(link).then(function (component) {
                segment.component = component;
                var /** @type {?} */ view = new view_controller_1.ViewController(component, segment.data);
                view.id = segment.id;
                if (util_1.isArray(segment.defaultHistory)) {
                    return nav_util_1.convertToViews(_this, segment.defaultHistory).then(function (views) {
                        views.push(view);
                        return views;
                    });
                }
                return [view];
            });
        };
        /**
         * Using the known Path of Segments, walk down all descendents
         * from the root NavController and load each NavController according
         * to each Segment. This is usually called after a browser URL and
         * Path changes and needs to update all NavControllers to match
         * the new browser URL. Because the URL is already known, it will
         * not update the browser's URL when transitions have completed.
         *
         * \@internal
         * @param {?} nav
         * @param {?=} done
         * @return {?}
         */
        DeepLinker.prototype._loadNavFromPath = function (nav, done) {
            var _this = this;
            if (!nav) {
                done && done();
            }
            else {
                this._loadViewFromSegment(nav, function () {
                    _this._loadNavFromPath(nav.getActiveChildNav(), done);
                });
            }
        };
        /**
         * \@internal
         * @param {?} navInstance
         * @param {?} done
         * @return {?}
         */
        DeepLinker.prototype._loadViewFromSegment = function (navInstance, done) {
            // load up which nav ids belong to its nav segment
            var /** @type {?} */ segment = this.initNav(navInstance);
            if (!segment) {
                done();
                return;
            }
            if (nav_util_1.isTabs(navInstance)) {
                ((navInstance)).select(this.getSelectedTabIndex(((navInstance)), segment.name), {
                    updateUrl: false,
                    animate: false
                });
                done();
                return;
            }
            var /** @type {?} */ nav = (navInstance);
            // walk backwards to see if the exact view we want to show here
            // is already in the stack that we can just pop back to
            var /** @type {?} */ view;
            var /** @type {?} */ count = nav.length() - 1;
            for (var /** @type {?} */ i = count; i >= 0; i--) {
                view = nav.getByIndex(i);
                if (view && view.id === segment.id) {
                    // hooray! we've already got a view loaded in the stack
                    // matching the view they wanted to show
                    if (i === count) {
                        // this is the last view in the stack and it's the same
                        // as the segment so there's no change needed
                        done();
                    }
                    else {
                        // it's not the exact view as the end
                        // let's have this nav go back to this exact view
                        nav.popTo(view, {
                            animate: false,
                            updateUrl: false,
                        }, done);
                    }
                    return;
                }
            }
            // ok, so they must be pushing a new view to the stack
            // since we didn't find this same component already in the stack
            nav.push(segment.component, segment.data, {
                id: segment.id, animate: false, updateUrl: false
            }, done);
        };
        /**
         * \@internal
         * @param {?} browserUrl
         * @return {?}
         */
        DeepLinker.prototype._isBackUrl = function (browserUrl) {
            return (browserUrl === this._history[this._history.length - 2]);
        };
        /**
         * \@internal
         * @param {?} browserUrl
         * @return {?}
         */
        DeepLinker.prototype._isCurrentUrl = function (browserUrl) {
            return (browserUrl === this._history[this._history.length - 1]);
        };
        /**
         * \@internal
         * @param {?} browserUrl
         * @return {?}
         */
        DeepLinker.prototype._historyPush = function (browserUrl) {
            if (!this._isCurrentUrl(browserUrl)) {
                this._history.push(browserUrl);
                if (this._history.length > 30) {
                    this._history.shift();
                }
            }
        };
        /**
         * \@internal
         * @return {?}
         */
        DeepLinker.prototype._historyPop = function () {
            this._history.pop();
            if (!this._history.length) {
                this._historyPush(this._location.path());
            }
        };
        return DeepLinker;
    }());
    exports.DeepLinker = DeepLinker;
    function DeepLinker_tsickle_Closure_declarations() {
        /**
         * \@internal
         * @type {?}
         */
        DeepLinker.prototype._segments;
        /**
         * \@internal
         * @type {?}
         */
        DeepLinker.prototype._history;
        /**
         * \@internal
         * @type {?}
         */
        DeepLinker.prototype._indexAliasUrl;
        /** @type {?} */
        DeepLinker.prototype._app;
        /** @type {?} */
        DeepLinker.prototype._serializer;
        /** @type {?} */
        DeepLinker.prototype._location;
        /** @type {?} */
        DeepLinker.prototype._moduleLoader;
        /** @type {?} */
        DeepLinker.prototype._baseCfr;
    }
    /**
     * @param {?} app
     * @param {?} serializer
     * @param {?} location
     * @param {?} moduleLoader
     * @param {?} cfr
     * @return {?}
     */
    function setupDeepLinker(app, serializer, location, moduleLoader, cfr) {
        var /** @type {?} */ deepLinker = new DeepLinker(app, serializer, location, moduleLoader, cfr);
        deepLinker.init();
        return deepLinker;
    }
    exports.setupDeepLinker = setupDeepLinker;
    /**
     * @param {?} browserUrl
     * @return {?}
     */
    function normalizeUrl(browserUrl) {
        browserUrl = browserUrl.trim();
        if (browserUrl.charAt(0) !== '/') {
            // ensure first char is a /
            browserUrl = '/' + browserUrl;
        }
        if (browserUrl.length > 1 && browserUrl.charAt(browserUrl.length - 1) === '/') {
            // ensure last char is not a /
            browserUrl = browserUrl.substr(0, browserUrl.length - 1);
        }
        return browserUrl;
    }
    exports.normalizeUrl = normalizeUrl;
});
//# sourceMappingURL=deep-linker.js.map