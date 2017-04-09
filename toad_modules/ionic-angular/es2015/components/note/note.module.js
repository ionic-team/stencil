import { NgModule } from '@angular/core';
import { Note } from './note';
/**
 * @hidden
 */
export class NoteModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: NoteModule, providers: []
        };
    }
}
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
NoteModule.ctorParameters = () => [];
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