import { NgModule } from '@angular/core';
import { Chip } from './chip';
/**
 * @hidden
 */
export class ChipModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ChipModule, providers: []
        };
    }
}
ChipModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Chip
                ],
                exports: [
                    Chip
                ]
            },] },
];
/**
 * @nocollapse
 */
ChipModule.ctorParameters = () => [];
function ChipModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ChipModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ChipModule.ctorParameters;
}
//# sourceMappingURL=chip.module.js.map