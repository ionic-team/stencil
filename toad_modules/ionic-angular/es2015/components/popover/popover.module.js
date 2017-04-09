import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { PopoverCmp } from './popover-component';
/**
 * @hidden
 */
export class PopoverModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: PopoverModule, providers: []
        };
    }
}
PopoverModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule
                ],
                declarations: [
                    PopoverCmp
                ],
                exports: [
                    PopoverCmp
                ],
                entryComponents: [
                    PopoverCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
PopoverModule.ctorParameters = () => [];
function PopoverModule_tsickle_Closure_declarations() {
    /** @type {?} */
    PopoverModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PopoverModule.ctorParameters;
}
//# sourceMappingURL=popover.module.js.map