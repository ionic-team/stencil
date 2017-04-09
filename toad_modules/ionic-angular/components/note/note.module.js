import { NgModule } from '@angular/core';
import { Note } from './note';
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
export { NoteModule };
NoteModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Note
                ],
                exports: [
                    Note
                ]
            },] },
];
/**
 * @nocollapse
 */
NoteModule.ctorParameters = function () { return []; };
function NoteModule_tsickle_Closure_declarations() {
    /** @type {?} */
    NoteModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NoteModule.ctorParameters;
}
//# sourceMappingURL=note.module.js.map