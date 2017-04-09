import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Footer } from './toolbar-footer';
import { Header } from './toolbar-header';
import { Toolbar } from './toolbar';
import { ToolbarItem } from './toolbar-item';
import { ToolbarTitle } from './toolbar-title';
/**
 * @hidden
 */
var ToolbarModule = (function () {
    function ToolbarModule() {
    }
    /**
     * @return {?}
     */
    ToolbarModule.forRoot = function () {
        return {
            ngModule: ToolbarModule, providers: []
        };
    };
    return ToolbarModule;
}());
export { ToolbarModule };
ToolbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    Footer,
                    Header,
                    Toolbar,
                    ToolbarItem,
                    ToolbarTitle
                ],
                exports: [
                    Footer,
                    Header,
                    Toolbar,
                    ToolbarItem,
                    ToolbarTitle
                ]
            },] },
];
/**
 * @nocollapse
 */
ToolbarModule.ctorParameters = function () { return []; };
function ToolbarModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToolbarModule.ctorParameters;
}
//# sourceMappingURL=toolbar.module.js.map