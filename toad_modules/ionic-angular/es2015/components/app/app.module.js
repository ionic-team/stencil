import { NgModule } from '@angular/core';
import { IonicApp } from './app-root';
import { NavModule } from '../nav/nav.module';
/**
 * @hidden
 */
export class AppModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: AppModule, providers: []
        };
    }
}
AppModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    NavModule
                ],
                declarations: [
                    IonicApp
                ],
                exports: [
                    IonicApp
                ],
                entryComponents: [
                    IonicApp
                ]
            },] },
];
/**
 * @nocollapse
 */
AppModule.ctorParameters = () => [];
function AppModule_tsickle_Closure_declarations() {
    /** @type {?} */
    AppModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    AppModule.ctorParameters;
}
//# sourceMappingURL=app.module.js.map