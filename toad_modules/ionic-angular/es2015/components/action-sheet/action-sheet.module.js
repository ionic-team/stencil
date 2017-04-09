import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';
import { IconModule } from '../icon/icon.module';
import { ActionSheetCmp } from './action-sheet-component';
/**
 * @hidden
 */
export class ActionSheetModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ActionSheetModule, providers: []
        };
    }
}
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
ActionSheetModule.ctorParameters = () => [];
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