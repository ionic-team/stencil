(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/forms", "@angular/core", "./native-input", "./next-input", "./input"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var forms_1 = require("@angular/forms");
    var core_1 = require("@angular/core");
    var native_input_1 = require("./native-input");
    var next_input_1 = require("./next-input");
    var input_1 = require("./input");
    /**
     * @hidden
     */
    var InputModule = (function () {
        function InputModule() {
        }
        /**
         * @return {?}
         */
        InputModule.forRoot = function () {
            return {
                ngModule: InputModule, providers: []
            };
        };
        return InputModule;
    }());
    InputModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        forms_1.FormsModule,
                        forms_1.ReactiveFormsModule
                    ],
                    declarations: [
                        native_input_1.NativeInput,
                        next_input_1.NextInput,
                        input_1.TextInput
                    ],
                    exports: [
                        native_input_1.NativeInput,
                        next_input_1.NextInput,
                        input_1.TextInput
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    InputModule.ctorParameters = function () { return []; };
    exports.InputModule = InputModule;
    function InputModule_tsickle_Closure_declarations() {
        /** @type {?} */
        InputModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        InputModule.ctorParameters;
    }
});
//# sourceMappingURL=input.module.js.map