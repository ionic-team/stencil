(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./split-pane"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var split_pane_1 = require("./split-pane");
    /**
     * @hidden
     */
    var SplitPaneModule = (function () {
        function SplitPaneModule() {
        }
        /**
         * @return {?}
         */
        SplitPaneModule.forRoot = function () {
            return {
                ngModule: SplitPaneModule, providers: []
            };
        };
        return SplitPaneModule;
    }());
    SplitPaneModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        split_pane_1.SplitPane
                    ],
                    exports: [
                        split_pane_1.SplitPane
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    SplitPaneModule.ctorParameters = function () { return []; };
    exports.SplitPaneModule = SplitPaneModule;
    function SplitPaneModule_tsickle_Closure_declarations() {
        /** @type {?} */
        SplitPaneModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SplitPaneModule.ctorParameters;
    }
});
//# sourceMappingURL=split-pane.module.js.map