import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfiniteScroll } from './infinite-scroll';
import { InfiniteScrollContent } from './infinite-scroll-content';
import { SpinnerModule } from '../spinner/spinner.module';
/**
 * @hidden
 */
export class InfiniteScrollModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: InfiniteScrollModule, providers: []
        };
    }
}
InfiniteScrollModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    SpinnerModule
                ],
                declarations: [
                    InfiniteScroll,
                    InfiniteScrollContent
                ],
                exports: [
                    InfiniteScroll,
                    InfiniteScrollContent
                ]
            },] },
];
/**
 * @nocollapse
 */
InfiniteScrollModule.ctorParameters = () => [];
function InfiniteScrollModule_tsickle_Closure_declarations() {
    /** @type {?} */
    InfiniteScrollModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    InfiniteScrollModule.ctorParameters;
}
//# sourceMappingURL=infinite-scroll.module.js.map