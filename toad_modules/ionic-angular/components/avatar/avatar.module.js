import { NgModule } from '@angular/core';
import { Avatar } from './avatar';
/**
 * @hidden
 */
var AvatarModule = (function () {
    function AvatarModule() {
    }
    /**
     * @return {?}
     */
    AvatarModule.forRoot = function () {
        return {
            ngModule: AvatarModule, providers: []
        };
    };
    return AvatarModule;
}());
export { AvatarModule };
AvatarModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Avatar
                ],
                exports: [
                    Avatar
                ]
            },] },
];
/**
 * @nocollapse
 */
AvatarModule.ctorParameters = function () { return []; };
function AvatarModule_tsickle_Closure_declarations() {
    /** @type {?} */
    AvatarModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    AvatarModule.ctorParameters;
}
//# sourceMappingURL=avatar.module.js.map