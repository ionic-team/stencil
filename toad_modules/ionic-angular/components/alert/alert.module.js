import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';
import { AlertCmp } from './alert-component';
/**
 * @hidden
 */
var AlertModule = (function () {
    function AlertModule() {
    }
    /**
     * @return {?}
     */
    AlertModule.forRoot = function () {
        return {
            ngModule: AlertModule, providers: []
        };
    };
    return AlertModule;
}());
export { AlertModule };
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
AlertModule.ctorParameters = function () { return []; };
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