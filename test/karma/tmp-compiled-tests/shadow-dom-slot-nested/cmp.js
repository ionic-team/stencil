"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomSlotNested = void 0;
var core_1 = require("@stencil/core");
var ShadowDomSlotNested = /** @class */ (function () {
    function ShadowDomSlotNested() {
    }
    ShadowDomSlotNested.prototype.render = function () {
        return [
            (0, core_1.h)("header", null,
                "shadow dom: ",
                this.i),
            (0, core_1.h)("footer", null,
                (0, core_1.h)("slot", null)),
        ];
    };
    __decorate([
        (0, core_1.Prop)()
    ], ShadowDomSlotNested.prototype, "i", void 0);
    ShadowDomSlotNested = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-slot-nested',
            styles: "\n    header {\n      color: red;\n    }\n  ",
            shadow: true,
        })
    ], ShadowDomSlotNested);
    return ShadowDomSlotNested;
}());
exports.ShadowDomSlotNested = ShadowDomSlotNested;
