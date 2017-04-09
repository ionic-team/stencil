import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Item } from './item';
import { ItemContent } from './item-content';
import { ItemDivider } from './item-divider';
import { ItemGroup } from './item-group';
import { ItemOptions } from './item-options';
import { ItemReorder } from './item-reorder';
import { ItemSliding } from './item-sliding';
import { Reorder } from './reorder';
import { IconModule } from '../icon/icon.module';
import { LabelModule } from '../label/label.module';
/**
 * @hidden
 */
export class ItemModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ItemModule, providers: []
        };
    }
}
ItemModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    IconModule,
                    LabelModule
                ],
                declarations: [
                    Item,
                    ItemContent,
                    ItemDivider,
                    ItemGroup,
                    ItemOptions,
                    ItemReorder,
                    ItemSliding,
                    Reorder
                ],
                exports: [
                    Item,
                    ItemContent,
                    ItemDivider,
                    ItemGroup,
                    ItemOptions,
                    ItemReorder,
                    ItemSliding,
                    Reorder
                ]
            },] },
];
/**
 * @nocollapse
 */
ItemModule.ctorParameters = () => [];
function ItemModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ItemModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ItemModule.ctorParameters;
}
//# sourceMappingURL=item.module.js.map