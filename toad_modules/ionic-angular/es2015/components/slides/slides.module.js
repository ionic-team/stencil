import { NgModule } from '@angular/core';
import { Slide } from './slide';
import { Slides } from './slides';
/**
 * @hidden
 */
export class SlidesModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SlidesModule, providers: []
        };
    }
}
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
SlidesModule.ctorParameters = () => [];
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