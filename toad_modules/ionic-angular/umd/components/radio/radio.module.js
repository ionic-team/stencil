(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./radio-button", "./radio-group"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var radio_button_1 = require("./radio-button");
    var radio_group_1 = require("./radio-group");
    /**
     * @hidden
     */
    var RadioModule = (function () {
        function RadioModule() {
        }
        /**
         * @return {?}
         */
        RadioModule.forRoot = function () {
            return {
                ngModule: RadioModule, providers: []
            };
        };
        return RadioModule;
    }());
    RadioModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        radio_button_1.RadioButton,
                        radio_group_1.RadioGroup
                    ],
                    exports: [
                        radio_button_1.RadioButton,
                        radio_group_1.RadioGroup
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    RadioModule.ctorParameters = function () { return []; };
    exports.RadioModule = RadioModule;
    function RadioModule_tsickle_Closure_declarations() {
        /** @type {?} */
        RadioModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        RadioModule.ctorParameters;
    }
});
//# sourceMappingURL=radio.module.js.map