import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { ButtonModule } from '../button/button.module';
import { PickerCmp } from './picker-component';
import { PickerColumnCmp } from './picker-column';
/**
 * @hidden
 */
var PickerModule = (function () {
    function PickerModule() {
    }
    /**
     * @return {?}
     */
    PickerModule.forRoot = function () {
        return {
            ngModule: PickerModule, providers: []
        };
    };
    return PickerModule;
}());
export { PickerModule };
PickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule,
                    ButtonModule,
                    CommonModule
                ],
                declarations: [
                    PickerCmp,
                    PickerColumnCmp
                ],
                exports: [
                    PickerCmp,
                    PickerColumnCmp
                ],
                entryComponents: [
                    PickerCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
PickerModule.ctorParameters = function () { return []; };
function PickerModule_tsickle_Closure_declarations() {
    /** @type {?} */
    PickerModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PickerModule.ctorParameters;
}
//# sourceMappingURL=picker.module.js.map