import { NgModule } from '@angular/core';
import { Segment } from './segment';
import { SegmentButton } from './segment-button';
/**
 * @hidden
 */
export class SegmentModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SegmentModule, providers: []
        };
    }
}
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
SegmentModule.ctorParameters = () => [];
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