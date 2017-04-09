(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./list", "./list-header"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var list_1 = require("./list");
    var list_header_1 = require("./list-header");
    /**
     * @hidden
     */
    var ListModule = (function () {
        function ListModule() {
        }
        /**
         * @return {?}
         */
        ListModule.forRoot = function () {
            return {
                ngModule: ListModule, providers: []
            };
        };
        return ListModule;
    }());
    ListModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        list_1.List,
                        list_header_1.ListHeader
                    ],
                    exports: [
                        list_1.List,
                        list_header_1.ListHeader
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ListModule.ctorParameters = function () { return []; };
    exports.ListModule = ListModule;
    function ListModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ListModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ListModule.ctorParameters;
    }
});
//# sourceMappingURL=list.module.js.map