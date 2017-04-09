(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./toggle"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var toggle_1 = require("./toggle");
    /**
     * @hidden
     */
    var ToggleModule = (function () {
        function ToggleModule() {
        }
        /**
         * @return {?}
         */
        ToggleModule.forRoot = function () {
            return {
                ngModule: ToggleModule, providers: []
            };
        };
        return ToggleModule;
    }());
    ToggleModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        toggle_1.Toggle
                    ],
                    exports: [
                        toggle_1.Toggle
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ToggleModule.ctorParameters = function () { return []; };
    exports.ToggleModule = ToggleModule;
    function ToggleModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ToggleModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ToggleModule.ctorParameters;
    }
});
//# sourceMappingURL=toggle.module.js.map