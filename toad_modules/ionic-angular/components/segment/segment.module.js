import { NgModule } from '@angular/core';
import { Segment } from './segment';
import { SegmentButton } from './segment-button';
/**
 * @hidden
 */
var SegmentModule = (function () {
    function SegmentModule() {
    }
    /**
     * @return {?}
     */
    SegmentModule.forRoot = function () {
        return {
            ngModule: SegmentModule, providers: []
        };
    };
    return SegmentModule;
}());
export { SegmentModule };
SegmentModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Segment,
                    SegmentButton
                ],
                exports: [
                    Segment,
                    SegmentButton
                ]
            },] },
];
/**
 * @nocollapse
 */
SegmentModule.ctorParameters = function () { return []; };
function SegmentModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SegmentModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SegmentModule.ctorParameters;
}
//# sourceMappingURL=segment.module.js.map