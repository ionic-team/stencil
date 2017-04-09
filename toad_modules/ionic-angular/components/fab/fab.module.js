import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { FabButton } from './fab';
import { FabContainer } from './fab-container';
import { FabList } from './fab-list';
/**
 * @hidden
 */
var FabModule = (function () {
    function FabModule() {
    }
    /**
     * @return {?}
     */
    FabModule.forRoot = function () {
        return {
            ngModule: FabModule, providers: []
        };
    };
    return FabModule;
}());
export { FabModule };
FabModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    IconModule
                ],
                declarations: [
                    FabButton,
                    FabContainer,
                    FabList
                ],
                exports: [
                    FabButton,
                    FabContainer,
                    FabList
                ]
            },] },
];
/**
 * @nocollapse
 */
FabModule.ctorParameters = function () { return []; };
function FabModule_tsickle_Closure_declarations() {
    /** @type {?} */
    FabModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FabModule.ctorParameters;
}
//# sourceMappingURL=fab.module.js.map