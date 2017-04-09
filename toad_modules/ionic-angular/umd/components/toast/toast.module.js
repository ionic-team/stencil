(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../backdrop/backdrop.module", "../button/button.module", "./toast-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var button_module_1 = require("../button/button.module");
    var toast_component_1 = require("./toast-component");
    /**
     * @hidden
     */
    var ToastModule = (function () {
        function ToastModule() {
        }
        /**
         * @return {?}
         */
        ToastModule.forRoot = function () {
            return {
                ngModule: ToastModule, providers: []
            };
        };
        return ToastModule;
    }());
    ToastModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule,
                        button_module_1.ButtonModule,
                        common_1.CommonModule
                    ],
                    declarations: [
                        toast_component_1.ToastCmp
                    ],
                    exports: [
                        toast_component_1.ToastCmp
                    ],
                    entryComponents: [
                        toast_component_1.ToastCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ToastModule.ctorParameters = function () { return []; };
    exports.ToastModule = ToastModule;
    function ToastModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ToastModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ToastModule.ctorParameters;
    }
});
//# sourceMappingURL=toast.module.js.map