(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./segment", "./segment-button"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var segment_1 = require("./segment");
    var segment_button_1 = require("./segment-button");
    /**
     * @hidden
     */
    var SegmentModule = (function () {
        function SegmentModule() {
        }
        /**
         * @return {?}
         */
        SegmentModule.forRoot = function () {
            return {
                ngModule: SegmentModule, providers: []
            };
        };
        return SegmentModule;
    }());
    SegmentModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        segment_1.Segment,
                        segment_button_1.SegmentButton
                    ],
                    exports: [
                        segment_1.Segment,
                        segment_button_1.SegmentButton
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SegmentModule.ctorParameters = function () { return []; };
    exports.SegmentModule = SegmentModule;
    function SegmentModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SegmentModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SegmentModule.ctorParameters;
    }
});
//# sourceMappingURL=segment.module.js.map