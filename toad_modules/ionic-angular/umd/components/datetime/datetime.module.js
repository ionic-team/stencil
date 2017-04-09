(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./datetime"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var datetime_1 = require("./datetime");
    /**
     * @hidden
     */
    var DateTimeModule = (function () {
        function DateTimeModule() {
        }
        /**
         * @return {?}
         */
        DateTimeModule.forRoot = function () {
            return {
                ngModule: DateTimeModule, providers: []
            };
        };
        return DateTimeModule;
    }());
    DateTimeModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        datetime_1.DateTime
                    ],
                    exports: [
                        datetime_1.DateTime
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    DateTimeModule.ctorParameters = function () { return []; };
    exports.DateTimeModule = DateTimeModule;
    function DateTimeModule_tsickle_Closure_declarations() {
        /** @type {?} */
        DateTimeModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        DateTimeModule.ctorParameters;
    }
});
//# sourceMappingURL=datetime.module.js.map