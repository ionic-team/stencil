import { NgModule } from '@angular/core';
import { Label } from './label';
/**
 * @hidden
 */
export class LabelModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: LabelModule, providers: []
        };
    }
}
LabelModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Label
                ],
                exports: [
                    Label
                ]
            },] },
];
/**
 * @nocollapse
 */
LabelModule.ctorParameters = () => [];
function LabelModule_tsickle_Closure_declarations() {
    /** @type {?} */
    LabelModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    LabelModule.ctorParameters;
}
//# sourceMappingURL=label.module.js.map