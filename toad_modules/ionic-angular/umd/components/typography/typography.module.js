(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./typography"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var typography_1 = require("./typography");
    /**
     * @hidden
     */
    var TypographyModule = (function () {
        function TypographyModule() {
        }
        /**
         * @return {?}
         */
        TypographyModule.forRoot = function () {
            return {
                ngModule: TypographyModule, providers: []
            };
        };
        return TypographyModule;
    }());
    TypographyModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        typography_1.Typography
                    ],
                    exports: [
                        typography_1.Typography
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    TypographyModule.ctorParameters = function () { return []; };
    exports.TypographyModule = TypographyModule;
    function TypographyModule_tsickle_Closure_declarations() {
        /** @type {?} */
        TypographyModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        TypographyModule.ctorParameters;
    }
});
//# sourceMappingURL=typography.module.js.map