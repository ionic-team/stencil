import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { ModalCmp } from './modal-component';
/**
 * @hidden
 */
export class ModalModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ModalModule, providers: []
        };
    }
}
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
ModalModule.ctorParameters = () => [];
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