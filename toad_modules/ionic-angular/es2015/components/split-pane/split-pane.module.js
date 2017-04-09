import { NgModule } from '@angular/core';
import { SplitPane } from './split-pane';
/**
 * @hidden
 */
export class SplitPaneModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SplitPaneModule, providers: []
        };
    }
}
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
SplitPaneModule.ctorParameters = () => [];
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