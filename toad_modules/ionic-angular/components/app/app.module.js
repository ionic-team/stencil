import { NgModule } from '@angular/core';
import { IonicApp } from './app-root';
import { NavModule } from '../nav/nav.module';
/**
 * @hidden
 */
var AppModule = (function () {
    function AppModule() {
    }
    /**
     * @return {?}
     */
    AppModule.forRoot = function () {
        return {
            ngModule: AppModule, providers: []
        };
    };
    return AppModule;
}());
export { AppModule };
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
AppModule.ctorParameters = function () { return []; };
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