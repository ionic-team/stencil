import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { ButtonModule } from '../button/button.module';
import { ToastCmp } from './toast-component';
/**
 * @hidden
 */
export class ToastModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ToastModule, providers: []
        };
    }
}
ToastModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule,
                    ButtonModule,
                    CommonModule
                ],
                declarations: [
                    ToastCmp
                ],
                exports: [
                    ToastCmp
                ],
                entryComponents: [
                    ToastCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
ToastModule.ctorParameters = () => [];
function ToastModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ToastModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToastModule.ctorParameters;
}
//# sourceMappingURL=toast.module.js.map