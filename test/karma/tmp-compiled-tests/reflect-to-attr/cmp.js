"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectToAttr = void 0;
var core_1 = require("@stencil/core");
var ReflectToAttr = /** @class */ (function () {
    function ReflectToAttr() {
        this.str = 'single';
        this.nu = 2;
        this.null = null;
        this.bool = false;
        this.otherBool = true;
        this.disabled = false;
    }
    ReflectToAttr.prototype.componentDidLoad = function () {
        this.dynamicStr = 'value';
        this.el.dynamicNu = 123;
    };
    __decorate([
        (0, core_1.Element)()
    ], ReflectToAttr.prototype, "el", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "str", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "nu", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "undef", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "null", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "bool", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "otherBool", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "disabled", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true, mutable: true })
    ], ReflectToAttr.prototype, "dynamicStr", void 0);
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ReflectToAttr.prototype, "dynamicNu", void 0);
    ReflectToAttr = __decorate([
        (0, core_1.Component)({
            tag: 'reflect-to-attr',
        })
    ], ReflectToAttr);
    return ReflectToAttr;
}());
exports.ReflectToAttr = ReflectToAttr;
