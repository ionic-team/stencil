import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NativeInput } from './native-input';
import { NextInput } from './next-input';
import { TextInput } from './input';
/**
 * @hidden
 */
export class InputModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: InputModule, providers: []
        };
    }
}
InputModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule
                ],
                declarations: [
                    NativeInput,
                    NextInput,
                    TextInput
                ],
                exports: [
                    NativeInput,
                    NextInput,
                    TextInput
                ]
            },] },
];
/**
 * @nocollapse
 */
InputModule.ctorParameters = () => [];
function InputModule_tsickle_Closure_declarations() {
    /** @type {?} */
    InputModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    InputModule.ctorParameters;
}
//# sourceMappingURL=input.module.js.map