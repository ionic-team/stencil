(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./scroll"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var scroll_1 = require("./scroll");
    /**
     * @hidden
     */
    var ScrollModule = (function () {
        function ScrollModule() {
        }
        /**
         * @return {?}
         */
        ScrollModule.forRoot = function () {
            return {
                ngModule: ScrollModule, providers: []
            };
        };
        return ScrollModule;
    }());
    ScrollModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        scroll_1.Scroll
                    ],
                    exports: [
                        scroll_1.Scroll
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ScrollModule.ctorParameters = function () { return []; };
    exports.ScrollModule = ScrollModule;
    function ScrollModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ScrollModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ScrollModule.ctorParameters;
    }
});
//# sourceMappingURL=scroll.module.js.map