import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateTime } from './datetime';
/**
 * @hidden
 */
export class DateTimeModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: DateTimeModule, providers: []
        };
    }
}
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
DateTimeModule.ctorParameters = () => [];
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