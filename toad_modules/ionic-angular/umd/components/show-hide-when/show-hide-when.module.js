(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./show-when", "./hide-when"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var show_when_1 = require("./show-when");
    var hide_when_1 = require("./hide-when");
    /**
     * @hidden
     */
    var ShowHideWhenModule = (function () {
        function ShowHideWhenModule() {
        }
        /**
         * @return {?}
         */
        ShowHideWhenModule.forRoot = function () {
            return {
                ngModule: ShowHideWhenModule, providers: []
            };
        };
        return ShowHideWhenModule;
    }());
    ShowHideWhenModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        show_when_1.ShowWhen,
                        hide_when_1.HideWhen
                    ],
                    exports: [
                        show_when_1.ShowWhen,
                        hide_when_1.HideWhen
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ShowHideWhenModule.ctorParameters = function () { return []; };
    exports.ShowHideWhenModule = ShowHideWhenModule;
    function ShowHideWhenModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ShowHideWhenModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ShowHideWhenModule.ctorParameters;
    }
});
//# sourceMappingURL=show-hide-when.module.js.map