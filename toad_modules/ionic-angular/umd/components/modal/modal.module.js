(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../backdrop/backdrop.module", "./modal-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var modal_component_1 = require("./modal-component");
    /**
     * @hidden
     */
    var ModalModule = (function () {
        function ModalModule() {
        }
        /**
         * @return {?}
         */
        ModalModule.forRoot = function () {
            return {
                ngModule: ModalModule, providers: []
            };
        };
        return ModalModule;
    }());
    ModalModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule
                    ],
                    declarations: [
                        modal_component_1.ModalCmp
                    ],
                    exports: [
                        modal_component_1.ModalCmp
                    ],
                    entryComponents: [
                        modal_component_1.ModalCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ModalModule.ctorParameters = function () { return []; };
    exports.ModalModule = ModalModule;
    function ModalModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ModalModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ModalModule.ctorParameters;
    }
});
//# sourceMappingURL=modal.module.js.map