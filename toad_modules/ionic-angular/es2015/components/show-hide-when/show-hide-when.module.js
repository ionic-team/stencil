import { NgModule } from '@angular/core';
import { ShowWhen } from './show-when';
import { HideWhen } from './hide-when';
/**
 * @hidden
 */
export class ShowHideWhenModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ShowHideWhenModule, providers: []
        };
    }
}
ShowHideWhenModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShowWhen,
                    HideWhen
                ],
                exports: [
                    ShowWhen,
                    HideWhen
                ]
            },] },
];
/**
 * @nocollapse
 */
ShowHideWhenModule.ctorParameters = () => [];
function ShowHideWhenModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ShowHideWhenModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ShowHideWhenModule.ctorParameters;
}
//# sourceMappingURL=show-hide-when.module.js.map