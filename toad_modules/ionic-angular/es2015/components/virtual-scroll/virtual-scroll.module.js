import { NgModule } from '@angular/core';
import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualScroll } from './virtual-scroll';
/**
 * @hidden
 */
export class VirtualScrollModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: VirtualScrollModule, providers: []
        };
    }
}
VirtualScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    VirtualFooter,
                    VirtualHeader,
                    VirtualItem,
                    VirtualScroll
                ],
                exports: [
                    VirtualFooter,
                    VirtualHeader,
                    VirtualItem,
                    VirtualScroll
                ]
            },] },
];
/**
 * @nocollapse
 */
VirtualScrollModule.ctorParameters = () => [];
function VirtualScrollModule_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualScrollModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VirtualScrollModule.ctorParameters;
}
//# sourceMappingURL=virtual-scroll.module.js.map