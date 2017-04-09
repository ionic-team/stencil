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
export class TabsModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: TabsModule, providers: []
        };
    }
}
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
TabsModule.ctorParameters = () => [];
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