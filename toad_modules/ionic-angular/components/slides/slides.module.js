import { NgModule } from '@angular/core';
import { Slide } from './slide';
import { Slides } from './slides';
/**
 * @hidden
 */
var SlidesModule = (function () {
    function SlidesModule() {
    }
    /**
     * @return {?}
     */
    SlidesModule.forRoot = function () {
        return {
            ngModule: SlidesModule, providers: []
        };
    };
    return SlidesModule;
}());
export { SlidesModule };
SlidesModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Slide,
                    Slides
                ],
                exports: [
                    Slide,
                    Slides
                ]
            },] },
];
/**
 * @nocollapse
 */
SlidesModule.ctorParameters = function () { return []; };
function SlidesModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SlidesModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SlidesModule.ctorParameters;
}
//# sourceMappingURL=slides.module.js.map