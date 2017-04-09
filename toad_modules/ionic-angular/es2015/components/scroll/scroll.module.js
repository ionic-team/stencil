import { NgModule } from '@angular/core';
import { Scroll } from './scroll';
/**
 * @hidden
 */
export class ScrollModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ScrollModule, providers: []
        };
    }
}
ScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Scroll
                ],
                exports: [
                    Scroll
                ]
            },] },
];
/**
 * @nocollapse
 */
ScrollModule.ctorParameters = () => [];
function ScrollModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ScrollModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ScrollModule.ctorParameters;
}
//# sourceMappingURL=scroll.module.js.map