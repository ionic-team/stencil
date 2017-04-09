(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./virtual-footer", "./virtual-header", "./virtual-item", "./virtual-scroll"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var virtual_footer_1 = require("./virtual-footer");
    var virtual_header_1 = require("./virtual-header");
    var virtual_item_1 = require("./virtual-item");
    var virtual_scroll_1 = require("./virtual-scroll");
    /**
     * @hidden
     */
    var VirtualScrollModule = (function () {
        function VirtualScrollModule() {
        }
        /**
         * @return {?}
         */
        VirtualScrollModule.forRoot = function () {
            return {
                ngModule: VirtualScrollModule, providers: []
            };
        };
        return VirtualScrollModule;
    }());
    VirtualScrollModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        virtual_footer_1.VirtualFooter,
                        virtual_header_1.VirtualHeader,
                        virtual_item_1.VirtualItem,
                        virtual_scroll_1.VirtualScroll
                    ],
                    exports: [
                        virtual_footer_1.VirtualFooter,
                        virtual_header_1.VirtualHeader,
                        virtual_item_1.VirtualItem,
                        virtual_scroll_1.VirtualScroll
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    VirtualScrollModule.ctorParameters = function () { return []; };
    exports.VirtualScrollModule = VirtualScrollModule;
    function VirtualScrollModule_tsickle_Closure_declarations() {
        /** @type {?} */
        VirtualScrollModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        VirtualScrollModule.ctorParameters;
    }
});
//# sourceMappingURL=virtual-scroll.module.js.map