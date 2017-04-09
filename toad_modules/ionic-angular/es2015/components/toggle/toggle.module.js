import { NgModule } from '@angular/core';
import { Toggle } from './toggle';
/**
 * @hidden
 */
export class ToggleModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ToggleModule, providers: []
        };
    }
}
ToggleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Toggle
                ],
                exports: [
                    Toggle
                ]
            },] },
];
/**
 * @nocollapse
 */
ToggleModule.ctorParameters = () => [];
function ToggleModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ToggleModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToggleModule.ctorParameters;
}
//# sourceMappingURL=toggle.module.js.map