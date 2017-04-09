(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./note"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var note_1 = require("./note");
    /**
     * @hidden
     */
    var NoteModule = (function () {
        function NoteModule() {
        }
        /**
         * @return {?}
         */
        NoteModule.forRoot = function () {
            return {
                ngModule: NoteModule, providers: []
            };
        };
        return NoteModule;
    }());
    NoteModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        note_1.Note
                    ],
                    exports: [
                        note_1.Note
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    NoteModule.ctorParameters = function () { return []; };
    exports.NoteModule = NoteModule;
    function NoteModule_tsickle_Closure_declarations() {
        /** @type {?} */
        NoteModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NoteModule.ctorParameters;
    }
});
//# sourceMappingURL=note.module.js.map