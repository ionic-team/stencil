(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./img"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var img_1 = require("./img");
    /**
     * @hidden
     */
    var ImgModule = (function () {
        function ImgModule() {
        }
        /**
         * @return {?}
         */
        ImgModule.forRoot = function () {
            return {
                ngModule: ImgModule, providers: []
            };
        };
        return ImgModule;
    }());
    ImgModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        img_1.Img
                    ],
                    exports: [
                        img_1.Img
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ImgModule.ctorParameters = function () { return []; };
    exports.ImgModule = ImgModule;
    function ImgModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ImgModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ImgModule.ctorParameters;
    }
});
//# sourceMappingURL=img.module.js.map