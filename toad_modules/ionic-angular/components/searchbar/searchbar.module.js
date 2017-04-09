import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { Searchbar } from './searchbar';
/**
 * @hidden
 */
var SearchbarModule = (function () {
    function SearchbarModule() {
    }
    /**
     * @return {?}
     */
    SearchbarModule.forRoot = function () {
        return {
            ngModule: SearchbarModule, providers: []
        };
    };
    return SearchbarModule;
}());
export { SearchbarModule };
SearchbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    ButtonModule,
                    IconModule
                ],
                declarations: [
                    Searchbar
                ],
                exports: [
                    Searchbar
                ]
            },] },
];
/**
 * @nocollapse
 */
SearchbarModule.ctorParameters = function () { return []; };
function SearchbarModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SearchbarModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SearchbarModule.ctorParameters;
}
//# sourceMappingURL=searchbar.module.js.map