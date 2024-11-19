"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomMode = void 0;
var core_1 = require("@stencil/core");
/**
 * @virtualProp {string} colormode - The mode determines which platform styles to use.
 */
var ShadowDomMode = /** @class */ (function () {
    function ShadowDomMode() {
        this.mode = (0, core_1.getMode)(this);
    }
    ShadowDomMode.prototype.render = function () {
        return (0, core_1.h)("div", null, this.mode);
    };
    ShadowDomMode = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-mode',
            styleUrls: {
                blue: 'mode-blue.css',
                red: 'mode-red.css',
            },
            shadow: true,
        })
    ], ShadowDomMode);
    return ShadowDomMode;
}());
exports.ShadowDomMode = ShadowDomMode;
