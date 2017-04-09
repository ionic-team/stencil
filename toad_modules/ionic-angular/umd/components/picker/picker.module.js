(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../backdrop/backdrop.module", "../button/button.module", "./picker-component", "./picker-column"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var button_module_1 = require("../button/button.module");
    var picker_component_1 = require("./picker-component");
    var picker_column_1 = require("./picker-column");
    /**
     * @hidden
     */
    var PickerModule = (function () {
        function PickerModule() {
        }
        /**
         * @return {?}
         */
        PickerModule.forRoot = function () {
            return {
                ngModule: PickerModule, providers: []
            };
        };
        return PickerModule;
    }());
    PickerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule,
                        button_module_1.ButtonModule,
                        common_1.CommonModule
                    ],
                    declarations: [
                        picker_component_1.PickerCmp,
                        picker_column_1.PickerColumnCmp
                    ],
                    exports: [
                        picker_component_1.PickerCmp,
                        picker_column_1.PickerColumnCmp
                    ],
                    entryComponents: [
                        picker_component_1.PickerCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    PickerModule.ctorParameters = function () { return []; };
    exports.PickerModule = PickerModule;
    function PickerModule_tsickle_Closure_declarations() {
        /** @type {?} */
        PickerModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        PickerModule.ctorParameters;
    }
});
//# sourceMappingURL=picker.module.js.map