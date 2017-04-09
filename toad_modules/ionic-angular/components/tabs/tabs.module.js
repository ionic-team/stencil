import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { Tab } from './tab';
import { TabButton } from './tab-button';
import { TabHighlight } from './tab-highlight';
import { Tabs } from './tabs';
/**
 * @hidden
 */
var TabsModule = (function () {
    function TabsModule() {
    }
    /**
     * @return {?}
     */
    TabsModule.forRoot = function () {
        return {
            ngModule: TabsModule, providers: []
        };
    };
    return TabsModule;
}());
export { TabsModule };
TabsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    IconModule
                ],
                declarations: [
                    Tab,
                    TabButton,
                    TabHighlight,
                    Tabs
                ],
                exports: [
                    Tab,
                    TabButton,
                    TabHighlight,
                    Tabs
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/**
 * @nocollapse
 */
TabsModule.ctorParameters = function () { return []; };
function TabsModule_tsickle_Closure_declarations() {
    /** @type {?} */
    TabsModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TabsModule.ctorParameters;
}
//# sourceMappingURL=tabs.module.js.map