(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./select"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var select_1 = require("./select");
    /**
     * @hidden
     */
    var SelectModule = (function () {
        function SelectModule() {
        }
        /**
         * @return {?}
         */
        SelectModule.forRoot = function () {
            return {
                ngModule: SelectModule, providers: []
            };
        };
        return SelectModule;
    }());
    SelectModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        select_1.Select
                    ],
                    exports: [
                        select_1.Select
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SelectModule.ctorParameters = function () { return []; };
    exports.SelectModule = SelectModule;
    function SelectModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SelectModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SelectModule.ctorParameters;
    }
});
//# sourceMappingURL=select.module.js.map