import { NgModule } from '@angular/core';
import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualScroll } from './virtual-scroll';
/**
 * @hidden
 */
var VirtualScrollModule = (function () {
    function VirtualScrollModule() {
    }
    /**
     * @return {?}
     */
    VirtualScrollModule.forRoot = function () {
        return {
            ngModule: VirtualScrollModule, providers: []
        };
    };
    return VirtualScrollModule;
}());
export { VirtualScrollModule };
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
VirtualScrollModule.ctorParameters = function () { return []; };
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