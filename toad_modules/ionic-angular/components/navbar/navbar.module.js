import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Navbar } from './navbar';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
/**
 * @hidden
 */
var NavbarModule = (function () {
    function NavbarModule() {
    }
    /**
     * @return {?}
     */
    NavbarModule.forRoot = function () {
        return {
            ngModule: NavbarModule, providers: []
        };
    };
    return NavbarModule;
}());
export { NavbarModule };
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
NavbarModule.ctorParameters = function () { return []; };
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