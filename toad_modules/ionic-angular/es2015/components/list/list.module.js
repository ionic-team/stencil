import { NgModule } from '@angular/core';
import { List } from './list';
import { ListHeader } from './list-header';
/**
 * @hidden
 */
export class ListModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ListModule, providers: []
        };
    }
}
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
ListModule.ctorParameters = () => [];
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