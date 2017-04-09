(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./infinite-scroll", "./infinite-scroll-content", "../spinner/spinner.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var infinite_scroll_1 = require("./infinite-scroll");
    var infinite_scroll_content_1 = require("./infinite-scroll-content");
    var spinner_module_1 = require("../spinner/spinner.module");
    /**
     * @hidden
     */
    var InfiniteScrollModule = (function () {
        function InfiniteScrollModule() {
        }
        /**
         * @return {?}
         */
        InfiniteScrollModule.forRoot = function () {
            return {
                ngModule: InfiniteScrollModule, providers: []
            };
        };
        return InfiniteScrollModule;
    }());
    InfiniteScrollModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        spinner_module_1.SpinnerModule
                    ],
                    declarations: [
                        infinite_scroll_1.InfiniteScroll,
                        infinite_scroll_content_1.InfiniteScrollContent
                    ],
                    exports: [
                        infinite_scroll_1.InfiniteScroll,
                        infinite_scroll_content_1.InfiniteScrollContent
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    InfiniteScrollModule.ctorParameters = function () { return []; };
    exports.InfiniteScrollModule = InfiniteScrollModule;
    function InfiniteScrollModule_tsickle_Closure_declarations() {
        /** @type {?} */
        InfiniteScrollModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        InfiniteScrollModule.ctorParameters;
    }
});
//# sourceMappingURL=infinite-scroll.module.js.map