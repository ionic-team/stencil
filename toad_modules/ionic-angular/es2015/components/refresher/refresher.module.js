import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { Refresher } from './refresher';
import { RefresherContent } from './refresher-content';
/**
 * @hidden
 */
export class RefresherModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: RefresherModule, providers: []
        };
    }
}
RefresherModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    IconModule,
                    SpinnerModule
                ],
                declarations: [
                    Refresher,
                    RefresherContent
                ],
                exports: [
                    Refresher,
                    RefresherContent
                ]
            },] },
];
/**
 * @nocollapse
 */
RefresherModule.ctorParameters = () => [];
function RefresherModule_tsickle_Closure_declarations() {
    /** @type {?} */
    RefresherModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RefresherModule.ctorParameters;
}
//# sourceMappingURL=refresher.module.js.map