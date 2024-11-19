"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicListShadowComponent = void 0;
var core_1 = require("@stencil/core");
var DynamicListShadowComponent = /** @class */ (function () {
    function DynamicListShadowComponent() {
        this.items = [];
    }
    DynamicListShadowComponent.prototype.render = function () {
        return ((0, core_1.h)("slot-light-list", null, this.items.map(function (item) { return ((0, core_1.h)("div", null, item)); })));
    };
    __decorate([
        (0, core_1.Prop)()
    ], DynamicListShadowComponent.prototype, "items", void 0);
    DynamicListShadowComponent = __decorate([
        (0, core_1.Component)({
            tag: 'slot-dynamic-shadow-list',
            shadow: true,
        })
    ], DynamicListShadowComponent);
    return DynamicListShadowComponent;
}());
exports.DynamicListShadowComponent = DynamicListShadowComponent;
