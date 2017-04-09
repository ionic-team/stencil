(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./toolbar-footer", "./toolbar-header", "./toolbar", "./toolbar-item", "./toolbar-title"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var toolbar_footer_1 = require("./toolbar-footer");
    var toolbar_header_1 = require("./toolbar-header");
    var toolbar_1 = require("./toolbar");
    var toolbar_item_1 = require("./toolbar-item");
    var toolbar_title_1 = require("./toolbar-title");
    /**
     * @hidden
     */
    var ToolbarModule = (function () {
        function ToolbarModule() {
        }
        /**
         * @return {?}
         */
        ToolbarModule.forRoot = function () {
            return {
                ngModule: ToolbarModule, providers: []
            };
        };
        return ToolbarModule;
    }());
    ToolbarModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        toolbar_footer_1.Footer,
                        toolbar_header_1.Header,
                        toolbar_1.Toolbar,
                        toolbar_item_1.ToolbarItem,
                        toolbar_title_1.ToolbarTitle
                    ],
                    exports: [
                        toolbar_footer_1.Footer,
                        toolbar_header_1.Header,
                        toolbar_1.Toolbar,
                        toolbar_item_1.ToolbarItem,
                        toolbar_title_1.ToolbarTitle
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ToolbarModule.ctorParameters = function () { return []; };
    exports.ToolbarModule = ToolbarModule;
    function ToolbarModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ToolbarModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ToolbarModule.ctorParameters;
    }
});
//# sourceMappingURL=toolbar.module.js.map