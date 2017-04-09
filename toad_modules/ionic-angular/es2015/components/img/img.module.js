import { NgModule } from '@angular/core';
import { Img } from './img';
/**
 * @hidden
 */
export class ImgModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ImgModule, providers: []
        };
    }
}
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
ImgModule.ctorParameters = () => [];
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