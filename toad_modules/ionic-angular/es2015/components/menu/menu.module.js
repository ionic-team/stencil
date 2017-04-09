import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { Menu } from './menu';
import { MenuClose } from './menu-close';
import { MenuToggle } from './menu-toggle';
/**
 * @hidden
 */
export class MenuModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: MenuModule, providers: []
        };
    }
}
MenuModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule
                ],
                declarations: [
                    Menu,
                    MenuClose,
                    MenuToggle
                ],
                exports: [
                    Menu,
                    MenuClose,
                    MenuToggle
                ]
            },] },
];
/**
 * @nocollapse
 */
MenuModule.ctorParameters = () => [];
function MenuModule_tsickle_Closure_declarations() {
    /** @type {?} */
    MenuModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    MenuModule.ctorParameters;
}
//# sourceMappingURL=menu.module.js.map