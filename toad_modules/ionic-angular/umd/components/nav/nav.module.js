(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./nav", "./nav-pop", "./nav-pop-anchor", "./nav-push", "./nav-push-anchor", "./overlay-portal"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var nav_1 = require("./nav");
    var nav_pop_1 = require("./nav-pop");
    var nav_pop_anchor_1 = require("./nav-pop-anchor");
    var nav_push_1 = require("./nav-push");
    var nav_push_anchor_1 = require("./nav-push-anchor");
    var overlay_portal_1 = require("./overlay-portal");
    /**
     * @hidden
     */
    var NavModule = (function () {
        function NavModule() {
        }
        /**
         * @return {?}
         */
        NavModule.forRoot = function () {
            return {
                ngModule: NavModule, providers: []
            };
        };
        return NavModule;
    }());
    NavModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        nav_1.Nav,
                        nav_pop_1.NavPop,
                        nav_pop_anchor_1.NavPopAnchor,
                        nav_push_1.NavPush,
                        nav_push_anchor_1.NavPushAnchor,
                        overlay_portal_1.OverlayPortal
                    ],
                    exports: [
                        nav_1.Nav,
                        nav_pop_1.NavPop,
                        nav_pop_anchor_1.NavPopAnchor,
                        nav_push_1.NavPush,
                        nav_push_anchor_1.NavPushAnchor,
                        overlay_portal_1.OverlayPortal
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    NavModule.ctorParameters = function () { return []; };
    exports.NavModule = NavModule;
    function NavModule_tsickle_Closure_declarations() {
        /** @type {?} */
        NavModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NavModule.ctorParameters;
    }
});
//# sourceMappingURL=nav.module.js.map