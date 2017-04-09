(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./thumbnail"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var thumbnail_1 = require("./thumbnail");
    /**
     * @hidden
     */
    var ThumbnailModule = (function () {
        function ThumbnailModule() {
        }
        /**
         * @return {?}
         */
        ThumbnailModule.forRoot = function () {
            return {
                ngModule: ThumbnailModule, providers: []
            };
        };
        return ThumbnailModule;
    }());
    ThumbnailModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        thumbnail_1.Thumbnail
                    ],
                    exports: [
                        thumbnail_1.Thumbnail
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ThumbnailModule.ctorParameters = function () { return []; };
    exports.ThumbnailModule = ThumbnailModule;
    function ThumbnailModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ThumbnailModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ThumbnailModule.ctorParameters;
    }
});
//# sourceMappingURL=thumbnail.module.js.map