import { NgModule } from '@angular/core';
import { Typography } from './typography';
/**
 * @hidden
 */
export class TypographyModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: TypographyModule, providers: []
        };
    }
}
TypographyModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Typography
                ],
                exports: [
                    Typography
                ]
            },] },
];
/**
 * @nocollapse
 */
TypographyModule.ctorParameters = () => [];
function TypographyModule_tsickle_Closure_declarations() {
    /** @type {?} */
    TypographyModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TypographyModule.ctorParameters;
}
//# sourceMappingURL=typography.module.js.map