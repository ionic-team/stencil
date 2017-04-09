import { NgModule } from '@angular/core';
import { SplitPane } from './split-pane';
/**
 * @hidden
 */
var SplitPaneModule = (function () {
    function SplitPaneModule() {
    }
    /**
     * @return {?}
     */
    SplitPaneModule.forRoot = function () {
        return {
            ngModule: SplitPaneModule, providers: []
        };
    };
    return SplitPaneModule;
}());
export { SplitPaneModule };
SplitPaneModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SplitPane
                ],
                exports: [
                    SplitPane
                ]
            },] },
];
/**
 * @nocollapse
 */
SplitPaneModule.ctorParameters = function () { return []; };
function SplitPaneModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SplitPaneModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SplitPaneModule.ctorParameters;
}
//# sourceMappingURL=split-pane.module.js.map