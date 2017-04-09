(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var option_1 = require("./option");
    /**
     * @hidden
     */
    var OptionModule = (function () {
        function OptionModule() {
        }
        /**
         * @return {?}
         */
        OptionModule.forRoot = function () {
            return {
                ngModule: OptionModule, providers: []
            };
        };
        return OptionModule;
    }());
    OptionModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        option_1.Option
                    ],
                    exports: [
                        option_1.Option
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    OptionModule.ctorParameters = function () { return []; };
    exports.OptionModule = OptionModule;
    function OptionModule_tsickle_Closure_declarations() {
        /** @type {?} */
        OptionModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        OptionModule.ctorParameters;
    }
});
//# sourceMappingURL=option.module.js.map