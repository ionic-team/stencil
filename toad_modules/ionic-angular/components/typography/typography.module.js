import { NgModule } from '@angular/core';
import { Typography } from './typography';
/**
 * @hidden
 */
var TypographyModule = (function () {
    function TypographyModule() {
    }
    /**
     * @return {?}
     */
    TypographyModule.forRoot = function () {
        return {
            ngModule: TypographyModule, providers: []
        };
    };
    return TypographyModule;
}());
export { TypographyModule };
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
TypographyModule.ctorParameters = function () { return []; };
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