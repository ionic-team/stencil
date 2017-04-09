(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/forms", "@angular/core", "../button/button.module", "../backdrop/backdrop.module", "./alert-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var forms_1 = require("@angular/forms");
    var core_1 = require("@angular/core");
    var button_module_1 = require("../button/button.module");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var alert_component_1 = require("./alert-component");
    /**
     * @hidden
     */
    var AlertModule = (function () {
        function AlertModule() {
        }
        /**
         * @return {?}
         */
        AlertModule.forRoot = function () {
            return {
                ngModule: AlertModule, providers: []
            };
        };
        return AlertModule;
    }());
    AlertModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule,
                        button_module_1.ButtonModule,
                        common_1.CommonModule,
                        forms_1.FormsModule
                    ],
                    declarations: [
                        alert_component_1.AlertCmp
                    ],
                    exports: [
                        alert_component_1.AlertCmp
                    ],
                    entryComponents: [
                        alert_component_1.AlertCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    AlertModule.ctorParameters = function () { return []; };
    exports.AlertModule = AlertModule;
    function AlertModule_tsickle_Closure_declarations() {
        /** @type {?} */
        AlertModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        AlertModule.ctorParameters;
    }
});
//# sourceMappingURL=alert.module.js.map