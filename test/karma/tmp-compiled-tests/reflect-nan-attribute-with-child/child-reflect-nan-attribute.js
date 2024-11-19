"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildReflectNanAttribute = void 0;
var core_1 = require("@stencil/core");
var ChildReflectNanAttribute = /** @class */ (function () {
    function ChildReflectNanAttribute() {
        // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
        // karma tests
        this.renderCount = 0;
    }
    ChildReflectNanAttribute.prototype.render = function () {
        this.renderCount += 1;
        return (0, core_1.h)("div", null,
            "child-reflect-nan-attribute Render Count: ",
            this.renderCount);
    };
    ChildReflectNanAttribute.prototype.componentDidUpdate = function () {
        // we don't expect the component to update, this will increment the render count in case it does (and should fail
        // the test)
        this.renderCount += 1;
    };
    __decorate([
        (0, core_1.Prop)({ reflect: true })
    ], ChildReflectNanAttribute.prototype, "val", void 0);
    ChildReflectNanAttribute = __decorate([
        (0, core_1.Component)({
            tag: 'child-reflect-nan-attribute',
            // 'shadow' is not needed here, but does make testing easier by using the shadow root to help encapsulate textContent
            shadow: true,
        })
    ], ChildReflectNanAttribute);
    return ChildReflectNanAttribute;
}());
exports.ChildReflectNanAttribute = ChildReflectNanAttribute;
