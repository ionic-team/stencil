(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/common", "@angular/core", "./item", "./item-content", "./item-divider", "./item-group", "./item-options", "./item-reorder", "./item-sliding", "./reorder", "../icon/icon.module", "../label/label.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@angular/common");
    var core_1 = require("@angular/core");
    var item_1 = require("./item");
    var item_content_1 = require("./item-content");
    var item_divider_1 = require("./item-divider");
    var item_group_1 = require("./item-group");
    var item_options_1 = require("./item-options");
    var item_reorder_1 = require("./item-reorder");
    var item_sliding_1 = require("./item-sliding");
    var reorder_1 = require("./reorder");
    var icon_module_1 = require("../icon/icon.module");
    var label_module_1 = require("../label/label.module");
    /**
     * @hidden
     */
    var ItemModule = (function () {
        function ItemModule() {
        }
        /**
         * @return {?}
         */
        ItemModule.forRoot = function () {
            return {
                ngModule: ItemModule, providers: []
            };
        };
        return ItemModule;
    }());
    ItemModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        icon_module_1.IconModule,
                        label_module_1.LabelModule
                    ],
                    declarations: [
                        item_1.Item,
                        item_content_1.ItemContent,
                        item_divider_1.ItemDivider,
                        item_group_1.ItemGroup,
                        item_options_1.ItemOptions,
                        item_reorder_1.ItemReorder,
                        item_sliding_1.ItemSliding,
                        reorder_1.Reorder
                    ],
                    exports: [
                        item_1.Item,
                        item_content_1.ItemContent,
                        item_divider_1.ItemDivider,
                        item_group_1.ItemGroup,
                        item_options_1.ItemOptions,
                        item_reorder_1.ItemReorder,
                        item_sliding_1.ItemSliding,
                        reorder_1.Reorder
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ItemModule.ctorParameters = function () { return []; };
    exports.ItemModule = ItemModule;
    function ItemModule_tsickle_Closure_declarations() {
        /** @type {?} */
        ItemModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ItemModule.ctorParameters;
    }
});
//# sourceMappingURL=item.module.js.map