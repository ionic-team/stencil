import { NgModule } from '@angular/core';
import { Nav } from './nav';
import { NavPop, } from './nav-pop';
import { NavPopAnchor } from './nav-pop-anchor';
import { NavPush } from './nav-push';
import { NavPushAnchor } from './nav-push-anchor';
import { OverlayPortal } from './overlay-portal';
/**
 * @hidden
 */
var NavModule = (function () {
    function NavModule() {
    }
    /**
     * @return {?}
     */
    NavModule.forRoot = function () {
        return {
            ngModule: NavModule, providers: []
        };
    };
    return NavModule;
}());
export { NavModule };
NavModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Nav,
                    NavPop,
                    NavPopAnchor,
                    NavPush,
                    NavPushAnchor,
                    OverlayPortal
                ],
                exports: [
                    Nav,
                    NavPop,
                    NavPopAnchor,
                    NavPush,
                    NavPushAnchor,
                    OverlayPortal
                ]
            },] },
];
/**
 * @nocollapse
 */
NavModule.ctorParameters = function () { return []; };
function NavModule_tsickle_Closure_declarations() {
    /** @type {?} */
    NavModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NavModule.ctorParameters;
}
//# sourceMappingURL=nav.module.js.map