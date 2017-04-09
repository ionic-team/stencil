(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../icon/icon.module", "../spinner/spinner.module", "./refresher", "./refresher-content"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var icon_module_1 = require("../icon/icon.module");
    var spinner_module_1 = require("../spinner/spinner.module");
    var refresher_1 = require("./refresher");
    var refresher_content_1 = require("./refresher-content");
    /**
     * @hidden
     */
    var RefresherModule = (function () {
        function RefresherModule() {
        }
        /**
         * @return {?}
         */
        RefresherModule.forRoot = function () {
            return {
                ngModule: RefresherModule, providers: []
            };
        };
        return RefresherModule;
    }());
    RefresherModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        icon_module_1.IconModule,
                        spinner_module_1.SpinnerModule
                    ],
                    declarations: [
                        refresher_1.Refresher,
                        refresher_content_1.RefresherContent
                    ],
                    exports: [
                        refresher_1.Refresher,
                        refresher_content_1.RefresherContent
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    RefresherModule.ctorParameters = function () { return []; };
    exports.RefresherModule = RefresherModule;
    function RefresherModule_tsickle_Closure_declarations() {
        /** @type {?} */
        RefresherModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        RefresherModule.ctorParameters;
    }
});
//# sourceMappingURL=refresher.module.js.map