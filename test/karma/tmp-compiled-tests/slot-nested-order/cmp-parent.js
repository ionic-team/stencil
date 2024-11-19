"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotNestedOrderParent = void 0;
var core_1 = require("@stencil/core");
var SlotNestedOrderParent = /** @class */ (function () {
    function SlotNestedOrderParent() {
    }
    SlotNestedOrderParent.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("slot", null),
            (0, core_1.h)("slot-nested-order-child", null,
                (0, core_1.h)("slot", { name: "italic-slot-name" }),
                (0, core_1.h)("cmp-6", { slot: "end-slot-name" }, "6"))));
    };
    SlotNestedOrderParent = __decorate([
        (0, core_1.Component)({
            tag: 'slot-nested-order-parent',
            shadow: false,
        })
    ], SlotNestedOrderParent);
    return SlotNestedOrderParent;
}());
exports.SlotNestedOrderParent = SlotNestedOrderParent;
