import { NgModule } from '@angular/core';
import { Thumbnail } from './thumbnail';
/**
 * @hidden
 */
var ThumbnailModule = (function () {
    function ThumbnailModule() {
    }
    /**
     * @return {?}
     */
    ThumbnailModule.forRoot = function () {
        return {
            ngModule: ThumbnailModule, providers: []
        };
    };
    return ThumbnailModule;
}());
export { ThumbnailModule };
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
ThumbnailModule.ctorParameters = function () { return []; };
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