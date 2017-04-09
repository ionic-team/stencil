import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';
import { AlertCmp } from './alert-component';
/**
 * @hidden
 */
export class AlertModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: AlertModule, providers: []
        };
    }
}
AlertModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule,
                    ButtonModule,
                    CommonModule,
                    FormsModule
                ],
                declarations: [
                    AlertCmp
                ],
                exports: [
                    AlertCmp
                ],
                entryComponents: [
                    AlertCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
AlertModule.ctorParameters = () => [];
function AlertModule_tsickle_Closure_declarations() {
    /** @type {?} */
    AlertModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    AlertModule.ctorParameters;
}
//# sourceMappingURL=alert.module.js.map