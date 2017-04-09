import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Navbar } from './navbar';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
/**
 * @hidden
 */
export class NavbarModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: NavbarModule, providers: []
        };
    }
}
NavbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    ButtonModule,
                    CommonModule,
                    IconModule
                ],
                declarations: [
                    Navbar
                ],
                exports: [
                    Navbar
                ]
            },] },
];
/**
 * @nocollapse
 */
NavbarModule.ctorParameters = () => [];
function NavbarModule_tsickle_Closure_declarations() {
    /** @type {?} */
    NavbarModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NavbarModule.ctorParameters;
}
//# sourceMappingURL=navbar.module.js.map