import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { ModalCmp } from './modal-component';
/**
 * @hidden
 */
var ModalModule = (function () {
    function ModalModule() {
    }
    /**
     * @return {?}
     */
    ModalModule.forRoot = function () {
        return {
            ngModule: ModalModule, providers: []
        };
    };
    return ModalModule;
}());
export { ModalModule };
ModalModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule
                ],
                declarations: [
                    ModalCmp
                ],
                exports: [
                    ModalCmp
                ],
                entryComponents: [
                    ModalCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
ModalModule.ctorParameters = function () { return []; };
function ModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ModalModule.ctorParameters;
}
//# sourceMappingURL=modal.module.js.map