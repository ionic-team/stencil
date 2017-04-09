import { NgModule } from '@angular/core';
import { Thumbnail } from './thumbnail';
/**
 * @hidden
 */
export class ThumbnailModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ThumbnailModule, providers: []
        };
    }
}
ThumbnailModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Thumbnail
                ],
                exports: [
                    Thumbnail
                ]
            },] },
];
/**
 * @nocollapse
 */
ThumbnailModule.ctorParameters = () => [];
function ThumbnailModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ThumbnailModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ThumbnailModule.ctorParameters;
}
//# sourceMappingURL=thumbnail.module.js.map