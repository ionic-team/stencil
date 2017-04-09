(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./grid", "./row", "./col"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var grid_1 = require("./grid");
    var row_1 = require("./row");
    var col_1 = require("./col");
    /**
     * @hidden
     */
    var GridModule = (function () {
        function GridModule() {
        }
        /**
         * @return {?}
         */
        GridModule.forRoot = function () {
            return {
                ngModule: GridModule, providers: []
            };
        };
        return GridModule;
    }());
    GridModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        grid_1.Grid,
                        row_1.Row,
                        col_1.Col
                    ],
                    exports: [
                        grid_1.Grid,
                        row_1.Row,
                        col_1.Col
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    GridModule.ctorParameters = function () { return []; };
    exports.GridModule = GridModule;
    function GridModule_tsickle_Closure_declarations() {
        /** @type {?} */
        GridModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        GridModule.ctorParameters;
    }
});
//# sourceMappingURL=grid.module.js.map