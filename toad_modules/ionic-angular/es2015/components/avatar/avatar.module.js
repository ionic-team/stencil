import { NgModule } from '@angular/core';
import { Avatar } from './avatar';
/**
 * @hidden
 */
export class AvatarModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: AvatarModule, providers: []
        };
    }
}
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
AvatarModule.ctorParameters = () => [];
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