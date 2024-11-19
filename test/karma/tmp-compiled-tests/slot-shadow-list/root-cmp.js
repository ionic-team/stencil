"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotListLightRoot = void 0;
var core_1 = require("@stencil/core");
var SlotListLightRoot = /** @class */ (function () {
    function SlotListLightRoot() {
        this.items = [];
    }
    SlotListLightRoot.prototype.needMore = function () {
        var newItems = [
            "Item ".concat(this.items.length + 1),
            "Item ".concat(this.items.length + 2),
            "Item ".concat(this.items.length + 3),
            "Item ".concat(this.items.length + 4),
        ];
        this.items = __spreadArray(__spreadArray([], this.items, true), newItems, true);
    };
    SlotListLightRoot.prototype.render = function () {
        var _this = this;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: function () { return _this.needMore(); } }, "More"),
            (0, core_1.h)("slot-dynamic-shadow-list", { items: this.items })));
    };
    __decorate([
        (0, core_1.Prop)({ mutable: true })
    ], SlotListLightRoot.prototype, "items", void 0);
    SlotListLightRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-list-light-root',
        })
    ], SlotListLightRoot);
    return SlotListLightRoot;
}());
exports.SlotListLightRoot = SlotListLightRoot;
