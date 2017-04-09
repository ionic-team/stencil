(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./chip"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var chip_1 = require("./chip");
    /**
     * @hidden
     */
    var ChipModule = (function () {
        function ChipModule() {
        }
        /**
         * @return {?}
         */
        ChipModule.forRoot = function () {
            return {
                ngModule: ChipModule, providers: []
            };
        };
        return ChipModule;
    }());
    ChipModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        chip_1.Chip
                    ],
                    exports: [
                        chip_1.Chip
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ChipModule.ctorParameters = function () { return []; };
    exports.ChipModule = ChipModule;
    function ChipModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ChipModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ChipModule.ctorParameters;
    }
});
//# sourceMappingURL=chip.module.js.map