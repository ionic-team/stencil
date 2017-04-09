(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./button"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var button_1 = require("./button");
    /**
     * @hidden
     */
    var ButtonModule = (function () {
        function ButtonModule() {
        }
        /**
         * @return {?}
         */
        ButtonModule.forRoot = function () {
            return {
                ngModule: ButtonModule, providers: []
            };
        };
        return ButtonModule;
    }());
    ButtonModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        button_1.Button
                    ],
                    exports: [
                        button_1.Button
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ButtonModule.ctorParameters = function () { return []; };
    exports.ButtonModule = ButtonModule;
    function ButtonModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ButtonModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ButtonModule.ctorParameters;
    }
});
//# sourceMappingURL=button.module.js.map