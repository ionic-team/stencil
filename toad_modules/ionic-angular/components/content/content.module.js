import { NgModule } from '@angular/core';
import { Content } from './content';
/**
 * @hidden
 */
var ContentModule = (function () {
    function ContentModule() {
    }
    /**
     * @return {?}
     */
    ContentModule.forRoot = function () {
        return {
            ngModule: ContentModule, providers: []
        };
    };
    return ContentModule;
}());
export { ContentModule };
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
ContentModule.ctorParameters = function () { return []; };
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