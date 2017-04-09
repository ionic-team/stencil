(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./range", "./range-knob"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var range_1 = require("./range");
    var range_knob_1 = require("./range-knob");
    /**
     * @hidden
     */
    var RangeModule = (function () {
        function RangeModule() {
        }
        /**
         * @return {?}
         */
        RangeModule.forRoot = function () {
            return {
                ngModule: RangeModule, providers: []
            };
        };
        return RangeModule;
    }());
    RangeModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        range_1.Range,
                        range_knob_1.RangeKnob
                    ],
                    exports: [
                        range_1.Range,
                        range_knob_1.RangeKnob
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    RangeModule.ctorParameters = function () { return []; };
    exports.RangeModule = RangeModule;
    function RangeModule_tsickle_Closure_declarations() {
        /** @type {?} */
        RangeModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        RangeModule.ctorParameters;
    }
});
//# sourceMappingURL=range.module.js.map