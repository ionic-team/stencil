(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./spinner"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var spinner_1 = require("./spinner");
    /**
     * @hidden
     */
    var SpinnerModule = (function () {
        function SpinnerModule() {
        }
        /**
         * @return {?}
         */
        SpinnerModule.forRoot = function () {
            return {
                ngModule: SpinnerModule, providers: []
            };
        };
        return SpinnerModule;
    }());
    SpinnerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        spinner_1.Spinner
                    ],
                    exports: [
                        spinner_1.Spinner
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SpinnerModule.ctorParameters = function () { return []; };
    exports.SpinnerModule = SpinnerModule;
    function SpinnerModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SpinnerModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SpinnerModule.ctorParameters;
    }
});
//# sourceMappingURL=spinner.module.js.map