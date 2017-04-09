import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';
import { IconModule } from '../icon/icon.module';
import { ActionSheetCmp } from './action-sheet-component';
/**
 * @hidden
 */
var ActionSheetModule = (function () {
    function ActionSheetModule() {
    }
    /**
     * @return {?}
     */
    ActionSheetModule.forRoot = function () {
        return {
            ngModule: ActionSheetModule, providers: []
        };
    };
    return ActionSheetModule;
}());
export { ActionSheetModule };
ActionSheetModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule,
                    ButtonModule,
                    CommonModule,
                    IconModule
                ],
                declarations: [
                    ActionSheetCmp
                ],
                exports: [
                    ActionSheetCmp
                ],
                entryComponents: [
                    ActionSheetCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
ActionSheetModule.ctorParameters = function () { return []; };
function ActionSheetModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionSheetModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ActionSheetModule.ctorParameters;
}
//# sourceMappingURL=action-sheet.module.js.map