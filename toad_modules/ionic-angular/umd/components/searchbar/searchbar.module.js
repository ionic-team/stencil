(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../button/button.module", "../icon/icon.module", "./searchbar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var button_module_1 = require("../button/button.module");
    var icon_module_1 = require("../icon/icon.module");
    var searchbar_1 = require("./searchbar");
    /**
     * @hidden
     */
    var SearchbarModule = (function () {
        function SearchbarModule() {
        }
        /**
         * @return {?}
         */
        SearchbarModule.forRoot = function () {
            return {
                ngModule: SearchbarModule, providers: []
            };
        };
        return SearchbarModule;
    }());
    SearchbarModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        button_module_1.ButtonModule,
                        icon_module_1.IconModule
                    ],
                    declarations: [
                        searchbar_1.Searchbar
                    ],
                    exports: [
                        searchbar_1.Searchbar
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SearchbarModule.ctorParameters = function () { return []; };
    exports.SearchbarModule = SearchbarModule;
    function SearchbarModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SearchbarModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SearchbarModule.ctorParameters;
    }
});
//# sourceMappingURL=searchbar.module.js.map