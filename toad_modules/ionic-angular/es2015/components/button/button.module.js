import { NgModule } from '@angular/core';
import { Button } from './button';
/**
 * @hidden
 */
export class ButtonModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ButtonModule, providers: []
        };
    }
}
ButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Button
                ],
                exports: [
                    Button
                ]
            },] },
];
/**
 * @nocollapse
 */
ButtonModule.ctorParameters = () => [];
function ButtonModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ButtonModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ButtonModule.ctorParameters;
}
//# sourceMappingURL=button.module.js.map