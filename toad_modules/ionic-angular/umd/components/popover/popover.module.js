(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../backdrop/backdrop.module", "./popover-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var popover_component_1 = require("./popover-component");
    /**
     * @hidden
     */
    var PopoverModule = (function () {
        function PopoverModule() {
        }
        /**
         * @return {?}
         */
        PopoverModule.forRoot = function () {
            return {
                ngModule: PopoverModule, providers: []
            };
        };
        return PopoverModule;
    }());
    PopoverModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule
                    ],
                    declarations: [
                        popover_component_1.PopoverCmp
                    ],
                    exports: [
                        popover_component_1.PopoverCmp
                    ],
                    entryComponents: [
                        popover_component_1.PopoverCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    PopoverModule.ctorParameters = function () { return []; };
    exports.PopoverModule = PopoverModule;
    function PopoverModule_tsickle_Closure_declarations() {
        /** @type {?} */
        PopoverModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        PopoverModule.ctorParameters;
    }
});
//# sourceMappingURL=popover.module.js.map