(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../button/button.module", "../backdrop/backdrop.module", "../icon/icon.module", "./action-sheet-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var button_module_1 = require("../button/button.module");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var icon_module_1 = require("../icon/icon.module");
    var action_sheet_component_1 = require("./action-sheet-component");
    /**
     * @hidden
     */
    var ActionSheetModule = (function () {
        function ActionSheetModule() {
        }
        /**
         * @return {?}
         */
        ActionSheetModule.forRoot = function () {
            return {
                ngModule: ActionSheetModule, providers: []
            };
        };
        return ActionSheetModule;
    }());
    ActionSheetModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule,
                        button_module_1.ButtonModule,
                        common_1.CommonModule,
                        icon_module_1.IconModule
                    ],
                    declarations: [
                        action_sheet_component_1.ActionSheetCmp
                    ],
                    exports: [
                        action_sheet_component_1.ActionSheetCmp
                    ],
                    entryComponents: [
                        action_sheet_component_1.ActionSheetCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ActionSheetModule.ctorParameters = function () { return []; };
    exports.ActionSheetModule = ActionSheetModule;
    function ActionSheetModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ActionSheetModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ActionSheetModule.ctorParameters;
    }
});
//# sourceMappingURL=action-sheet.module.js.map