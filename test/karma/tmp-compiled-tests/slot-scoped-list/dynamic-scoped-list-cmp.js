"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicListScopedComponent = void 0;
var core_1 = require("@stencil/core");
var DynamicListScopedComponent = /** @class */ (function () {
    function DynamicListScopedComponent() {
        this.items = [];
    }
    DynamicListScopedComponent.prototype.render = function () {
        return ((0, core_1.h)("slot-light-scoped-list", null, this.items.map(function (item) { return ((0, core_1.h)("div", null, item)); })));
    };
    __decorate([
        (0, core_1.Prop)()
    ], DynamicListScopedComponent.prototype, "items", void 0);
    DynamicListScopedComponent = __decorate([
        (0, core_1.Component)({
            tag: 'slot-dynamic-scoped-list',
            scoped: true,
        })
    ], DynamicListScopedComponent);
    return DynamicListScopedComponent;
}());
exports.DynamicListScopedComponent = DynamicListScopedComponent;
