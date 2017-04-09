(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "../icon/icon.module", "./tab", "./tab-button", "./tab-highlight", "./tabs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var icon_module_1 = require("../icon/icon.module");
    var tab_1 = require("./tab");
    var tab_button_1 = require("./tab-button");
    var tab_highlight_1 = require("./tab-highlight");
    var tabs_1 = require("./tabs");
    /**
     * @hidden
     */
    var TabsModule = (function () {
        function TabsModule() {
        }
        /**
         * @return {?}
         */
        TabsModule.forRoot = function () {
            return {
                ngModule: TabsModule, providers: []
            };
        };
        return TabsModule;
    }());
    TabsModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        icon_module_1.IconModule
                    ],
                    declarations: [
                        tab_1.Tab,
                        tab_button_1.TabButton,
                        tab_highlight_1.TabHighlight,
                        tabs_1.Tabs
                    ],
                    exports: [
                        tab_1.Tab,
                        tab_button_1.TabButton,
                        tab_highlight_1.TabHighlight,
                        tabs_1.Tabs
                    ],
                    schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
                },] },
    ];
    /**
     * @nocollapse
     */
    TabsModule.ctorParameters = function () { return []; };
    exports.TabsModule = TabsModule;
    function TabsModule_tsickle_Closure_declarations() {
        /** @type {?} */
        TabsModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        TabsModule.ctorParameters;
    }
});
//# sourceMappingURL=tabs.module.js.map