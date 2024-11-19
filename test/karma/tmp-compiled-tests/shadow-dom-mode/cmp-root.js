"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomModeRoot = void 0;
var core_1 = require("@stencil/core");
var ShadowDomModeRoot = /** @class */ (function () {
    function ShadowDomModeRoot() {
        this.showRed = false;
    }
    ShadowDomModeRoot.prototype.componentDidLoad = function () {
        var _this = this;
        setTimeout(function () {
            _this.showRed = true;
        }, 50);
    };
    ShadowDomModeRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("shadow-dom-mode", { id: "blue", colormode: "blue" }),
            this.showRed ? (0, core_1.h)("shadow-dom-mode", { id: "red" }) : null));
    };
    __decorate([
        (0, core_1.State)()
    ], ShadowDomModeRoot.prototype, "showRed", void 0);
    ShadowDomModeRoot = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-mode-root',
        })
    ], ShadowDomModeRoot);
    return ShadowDomModeRoot;
}());
exports.ShadowDomModeRoot = ShadowDomModeRoot;
