(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./content"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var content_1 = require("./content");
    /**
     * @hidden
     */
    var ContentModule = (function () {
        function ContentModule() {
        }
        /**
         * @return {?}
         */
        ContentModule.forRoot = function () {
            return {
                ngModule: ContentModule, providers: []
            };
        };
        return ContentModule;
    }());
    ContentModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        content_1.Content
                    ],
                    exports: [
                        content_1.Content
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ContentModule.ctorParameters = function () { return []; };
    exports.ContentModule = ContentModule;
    function ContentModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ContentModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ContentModule.ctorParameters;
    }
});
//# sourceMappingURL=content.module.js.map