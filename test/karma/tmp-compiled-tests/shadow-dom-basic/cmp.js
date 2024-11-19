"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomBasic = void 0;
var core_1 = require("@stencil/core");
var ShadowDomBasic = /** @class */ (function () {
    function ShadowDomBasic() {
    }
    ShadowDomBasic.prototype.render = function () {
        return [(0, core_1.h)("div", null, "shadow"), (0, core_1.h)("slot", null)];
    };
    ShadowDomBasic = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-basic',
            styles: "\n    div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }\n  ",
            shadow: true,
        })
    ], ShadowDomBasic);
    return ShadowDomBasic;
}());
exports.ShadowDomBasic = ShadowDomBasic;
