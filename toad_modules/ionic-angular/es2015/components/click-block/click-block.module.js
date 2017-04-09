import { NgModule } from '@angular/core';
import { ClickBlock } from './click-block';
/**
 * @hidden
 */
export class ClickBlockModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ClickBlockModule, providers: []
        };
    }
}
ClickBlockModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ClickBlock
                ],
                exports: [
                    ClickBlock
                ]
            },] },
];
/**
 * @nocollapse
 */
ClickBlockModule.ctorParameters = () => [];
function ClickBlockModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ClickBlockModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ClickBlockModule.ctorParameters;
}
//# sourceMappingURL=click-block.module.js.map