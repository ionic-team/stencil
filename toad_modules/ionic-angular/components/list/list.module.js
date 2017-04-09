import { NgModule } from '@angular/core';
import { List } from './list';
import { ListHeader } from './list-header';
/**
 * @hidden
 */
var ListModule = (function () {
    function ListModule() {
    }
    /**
     * @return {?}
     */
    ListModule.forRoot = function () {
        return {
            ngModule: ListModule, providers: []
        };
    };
    return ListModule;
}());
export { ListModule };
ListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    List,
                    ListHeader
                ],
                exports: [
                    List,
                    ListHeader
                ]
            },] },
];
/**
 * @nocollapse
 */
ListModule.ctorParameters = function () { return []; };
function ListModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ListModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ListModule.ctorParameters;
}
//# sourceMappingURL=list.module.js.map