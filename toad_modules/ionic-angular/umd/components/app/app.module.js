(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./app-root", "../nav/nav.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_root_1 = require("./app-root");
    var nav_module_1 = require("../nav/nav.module");
    /**
     * @hidden
     */
    var AppModule = (function () {
        function AppModule() {
        }
        /**
         * @return {?}
         */
        AppModule.forRoot = function () {
            return {
                ngModule: AppModule, providers: []
            };
        };
        return AppModule;
    }());
    AppModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        nav_module_1.NavModule
                    ],
                    declarations: [
                        app_root_1.IonicApp
                    ],
                    exports: [
                        app_root_1.IonicApp
                    ],
                    entryComponents: [
                        app_root_1.IonicApp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    AppModule.ctorParameters = function () { return []; };
    exports.AppModule = AppModule;
    function AppModule_tsickle_Closure_declarations() {
        /** @type {?} */
        AppModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        AppModule.ctorParameters;
    }
});
//# sourceMappingURL=app.module.js.map