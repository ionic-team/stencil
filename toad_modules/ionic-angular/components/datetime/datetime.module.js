import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateTime } from './datetime';
/**
 * @hidden
 */
var DateTimeModule = (function () {
    function DateTimeModule() {
    }
    /**
     * @return {?}
     */
    DateTimeModule.forRoot = function () {
        return {
            ngModule: DateTimeModule, providers: []
        };
    };
    return DateTimeModule;
}());
export { DateTimeModule };
DateTimeModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DateTime
                ],
                exports: [
                    DateTime
                ]
            },] },
];
/**
 * @nocollapse
 */
DateTimeModule.ctorParameters = function () { return []; };
function DateTimeModule_tsickle_Closure_declarations() {
    /** @type {?} */
    DateTimeModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DateTimeModule.ctorParameters;
}
//# sourceMappingURL=datetime.module.js.map