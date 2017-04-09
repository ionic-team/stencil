(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./backdrop"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var backdrop_1 = require("./backdrop");
    /**
     * @hidden
     */
    var BackdropModule = (function () {
        function BackdropModule() {
        }
        /**
         * @return {?}
         */
        BackdropModule.forRoot = function () {
            return {
                ngModule: BackdropModule, providers: []
            };
        };
        return BackdropModule;
    }());
    BackdropModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        backdrop_1.Backdrop
                    ],
                    exports: [
                        backdrop_1.Backdrop
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    BackdropModule.ctorParameters = function () { return []; };
    exports.BackdropModule = BackdropModule;
    function BackdropModule_tsickle_Closure_declarations() {
        /** @type {?} */
        BackdropModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        BackdropModule.ctorParameters;
    }
});
//# sourceMappingURL=backdrop.module.js.map