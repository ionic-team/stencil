import { NgModule } from '@angular/core';
import { Content } from './content';
/**
 * @hidden
 */
export class ContentModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ContentModule, providers: []
        };
    }
}
ContentModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Content
                ],
                exports: [
                    Content
                ]
            },] },
];
/**
 * @nocollapse
 */
ContentModule.ctorParameters = () => [];
function ContentModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ContentModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ContentModule.ctorParameters;
}
//# sourceMappingURL=content.module.js.map