(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../backdrop/backdrop.module", "./menu", "./menu-close", "./menu-toggle"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var backdrop_module_1 = require("../backdrop/backdrop.module");
    var menu_1 = require("./menu");
    var menu_close_1 = require("./menu-close");
    var menu_toggle_1 = require("./menu-toggle");
    /**
     * @hidden
     */
    var MenuModule = (function () {
        function MenuModule() {
        }
        /**
         * @return {?}
         */
        MenuModule.forRoot = function () {
            return {
                ngModule: MenuModule, providers: []
            };
        };
        return MenuModule;
    }());
    MenuModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        backdrop_module_1.BackdropModule
                    ],
                    declarations: [
                        menu_1.Menu,
                        menu_close_1.MenuClose,
                        menu_toggle_1.MenuToggle
                    ],
                    exports: [
                        menu_1.Menu,
                        menu_close_1.MenuClose,
                        menu_toggle_1.MenuToggle
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    MenuModule.ctorParameters = function () { return []; };
    exports.MenuModule = MenuModule;
    function MenuModule_tsickle_Closure_declarations() {
        /** @type {?} */
        MenuModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        MenuModule.ctorParameters;
    }
});
//# sourceMappingURL=menu.module.js.map