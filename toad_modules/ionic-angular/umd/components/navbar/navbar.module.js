(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./navbar", "../button/button.module", "../icon/icon.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var navbar_1 = require("./navbar");
    var button_module_1 = require("../button/button.module");
    var icon_module_1 = require("../icon/icon.module");
    /**
     * @hidden
     */
    var NavbarModule = (function () {
        function NavbarModule() {
        }
        /**
         * @return {?}
         */
        NavbarModule.forRoot = function () {
            return {
                ngModule: NavbarModule, providers: []
            };
        };
        return NavbarModule;
    }());
    NavbarModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        button_module_1.ButtonModule,
                        common_1.CommonModule,
                        icon_module_1.IconModule
                    ],
                    declarations: [
                        navbar_1.Navbar
                    ],
                    exports: [
                        navbar_1.Navbar
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    NavbarModule.ctorParameters = function () { return []; };
    exports.NavbarModule = NavbarModule;
    function NavbarModule_tsickle_Closure_declarations() {
        /** @type {?} */
        NavbarModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NavbarModule.ctorParameters;
    }
});
//# sourceMappingURL=navbar.module.js.map