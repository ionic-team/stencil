(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./slide", "./slides"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var slide_1 = require("./slide");
    var slides_1 = require("./slides");
    /**
     * @hidden
     */
    var SlidesModule = (function () {
        function SlidesModule() {
        }
        /**
         * @return {?}
         */
        SlidesModule.forRoot = function () {
            return {
                ngModule: SlidesModule, providers: []
            };
        };
        return SlidesModule;
    }());
    SlidesModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        slide_1.Slide,
                        slides_1.Slides
                    ],
                    exports: [
                        slide_1.Slide,
                        slides_1.Slides
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SlidesModule.ctorParameters = function () { return []; };
    exports.SlidesModule = SlidesModule;
    function SlidesModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SlidesModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SlidesModule.ctorParameters;
    }
});
//# sourceMappingURL=slides.module.js.map