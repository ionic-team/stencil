(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./label"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var label_1 = require("./label");
    /**
     * @hidden
     */
    var LabelModule = (function () {
        function LabelModule() {
        }
        /**
         * @return {?}
         */
        LabelModule.forRoot = function () {
            return {
                ngModule: LabelModule, providers: []
            };
        };
        return LabelModule;
    }());
    LabelModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        label_1.Label
                    ],
                    exports: [
                        label_1.Label
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    LabelModule.ctorParameters = function () { return []; };
    exports.LabelModule = LabelModule;
    function LabelModule_tsickle_Closure_declarations() {
        /** @type {?} */
        LabelModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        LabelModule.ctorParameters;
    }
});
//# sourceMappingURL=label.module.js.map