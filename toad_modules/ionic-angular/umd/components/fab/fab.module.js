(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../icon/icon.module", "./fab", "./fab-container", "./fab-list"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var icon_module_1 = require("../icon/icon.module");
    var fab_1 = require("./fab");
    var fab_container_1 = require("./fab-container");
    var fab_list_1 = require("./fab-list");
    /**
     * @hidden
     */
    var FabModule = (function () {
        function FabModule() {
        }
        /**
         * @return {?}
         */
        FabModule.forRoot = function () {
            return {
                ngModule: FabModule, providers: []
            };
        };
        return FabModule;
    }());
    FabModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        icon_module_1.IconModule
                    ],
                    declarations: [
                        fab_1.FabButton,
                        fab_container_1.FabContainer,
                        fab_list_1.FabList
                    ],
                    exports: [
                        fab_1.FabButton,
                        fab_container_1.FabContainer,
                        fab_list_1.FabList
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    FabModule.ctorParameters = function () { return []; };
    exports.FabModule = FabModule;
    function FabModule_tsickle_Closure_declarations() {
        /** @type {?} */
        FabModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        FabModule.ctorParameters;
    }
});
//# sourceMappingURL=fab.module.js.map