import { NgModule } from '@angular/core';
import { ClickBlock } from './click-block';
/**
 * @hidden
 */
var ClickBlockModule = (function () {
    function ClickBlockModule() {
    }
    /**
     * @return {?}
     */
    ClickBlockModule.forRoot = function () {
        return {
            ngModule: ClickBlockModule, providers: []
        };
    };
    return ClickBlockModule;
}());
export { ClickBlockModule };
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
ClickBlockModule.ctorParameters = function () { return []; };
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