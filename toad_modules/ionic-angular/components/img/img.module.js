import { NgModule } from '@angular/core';
import { Img } from './img';
/**
 * @hidden
 */
var ImgModule = (function () {
    function ImgModule() {
    }
    /**
     * @return {?}
     */
    ImgModule.forRoot = function () {
        return {
            ngModule: ImgModule, providers: []
        };
    };
    return ImgModule;
}());
export { ImgModule };
ImgModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Img
                ],
                exports: [
                    Img
                ]
            },] },
];
/**
 * @nocollapse
 */
ImgModule.ctorParameters = function () { return []; };
function ImgModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ImgModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ImgModule.ctorParameters;
}
//# sourceMappingURL=img.module.js.map