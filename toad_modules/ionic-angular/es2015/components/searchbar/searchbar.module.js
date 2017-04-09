import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { Searchbar } from './searchbar';
/**
 * @hidden
 */
export class SearchbarModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SearchbarModule, providers: []
        };
    }
}
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
SearchbarModule.ctorParameters = () => [];
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