"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeBasic = void 0;
var core_1 = require("@stencil/core");
var AttributeBasic = /** @class */ (function () {
    function AttributeBasic() {
        this._getter = 'getter';
        this.single = 'single';
        this.multiWord = 'multiWord';
        this.customAttr = 'my-custom-attr';
    }
    Object.defineProperty(AttributeBasic.prototype, "getter", {
        get: function () {
            return this._getter;
        },
        set: function (newVal) {
            this._getter = newVal;
        },
        enumerable: false,
        configurable: true
    });
    AttributeBasic.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("div", { class: "single" }, this.single),
            (0, core_1.h)("div", { class: "multiWord" }, this.multiWord),
            (0, core_1.h)("div", { class: "customAttr" }, this.customAttr),
            (0, core_1.h)("div", { class: "getter" }, this.getter),
            (0, core_1.h)("div", null,
                (0, core_1.h)("label", { class: "htmlForLabel", htmlFor: 'a' }, "htmlFor"),
                (0, core_1.h)("input", { type: "checkbox", id: 'a' }))));
    };
    __decorate([
        (0, core_1.Prop)()
    ], AttributeBasic.prototype, "single", void 0);
    __decorate([
        (0, core_1.Prop)()
    ], AttributeBasic.prototype, "multiWord", void 0);
    __decorate([
        (0, core_1.Prop)({ attribute: 'my-custom-attr' })
    ], AttributeBasic.prototype, "customAttr", void 0);
    __decorate([
        (0, core_1.Prop)()
    ], AttributeBasic.prototype, "getter", null);
    AttributeBasic = __decorate([
        (0, core_1.Component)({
            tag: 'attribute-basic',
        })
    ], AttributeBasic);
    return AttributeBasic;
}());
exports.AttributeBasic = AttributeBasic;
