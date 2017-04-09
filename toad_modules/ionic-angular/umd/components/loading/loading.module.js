(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../backdrop/backdrop.module", "../spinner/spinner.module", "./loading-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var spinner_module_1 = require("../spinner/spinner.module");
    var loading_component_1 = require("./loading-component");
    /**
     * @hidden
     */
    var LoadingModule = (function () {
        function LoadingModule() {
        }
        /**
         * @return {?}
         */
        LoadingModule.forRoot = function () {
            return {
                ngModule: LoadingModule, providers: []
            };
        };
        return LoadingModule;
    }());
    LoadingModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule,
                        common_1.CommonModule,
                        spinner_module_1.SpinnerModule
                    ],
                    declarations: [
                        loading_component_1.LoadingCmp
                    ],
                    exports: [
                        loading_component_1.LoadingCmp
                    ],
                    entryComponents: [
                        loading_component_1.LoadingCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    LoadingModule.ctorParameters = function () { return []; };
    exports.LoadingModule = LoadingModule;
    function LoadingModule_tsickle_Closure_declarations() {
        /** @type {?} */
        LoadingModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        LoadingModule.ctorParameters;
    }
});
//# sourceMappingURL=loading.module.js.map