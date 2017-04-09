(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./checkbox"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var checkbox_1 = require("./checkbox");
    /**
     * @hidden
     */
    var CheckboxModule = (function () {
        function CheckboxModule() {
        }
        /**
         * @return {?}
         */
        CheckboxModule.forRoot = function () {
            return {
                ngModule: CheckboxModule, providers: []
            };
        };
        return CheckboxModule;
    }());
    CheckboxModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        checkbox_1.Checkbox
                    ],
                    exports: [
                        checkbox_1.Checkbox
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    CheckboxModule.ctorParameters = function () { return []; };
    exports.CheckboxModule = CheckboxModule;
    function CheckboxModule_tsickle_Closure_declarations() {
        /** @type {?} */
        CheckboxModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        CheckboxModule.ctorParameters;
    }
});
//# sourceMappingURL=checkbox.module.js.map