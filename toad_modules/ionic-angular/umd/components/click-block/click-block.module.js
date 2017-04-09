(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./click-block"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var click_block_1 = require("./click-block");
    /**
     * @hidden
     */
    var ClickBlockModule = (function () {
        function ClickBlockModule() {
        }
        /**
         * @return {?}
         */
        ClickBlockModule.forRoot = function () {
            return {
                ngModule: ClickBlockModule, providers: []
            };
        };
        return ClickBlockModule;
    }());
    ClickBlockModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        click_block_1.ClickBlock
                    ],
                    exports: [
                        click_block_1.ClickBlock
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ClickBlockModule.ctorParameters = function () { return []; };
    exports.ClickBlockModule = ClickBlockModule;
    function ClickBlockModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ClickBlockModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ClickBlockModule.ctorParameters;
    }
});
//# sourceMappingURL=click-block.module.js.map