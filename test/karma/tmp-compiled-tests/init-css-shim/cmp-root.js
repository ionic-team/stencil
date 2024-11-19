"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCssRoot = void 0;
var core_1 = require("@stencil/core");
var InitCssRoot = /** @class */ (function () {
    function InitCssRoot() {
    }
    InitCssRoot.prototype.render = function () {
        return [(0, core_1.h)("div", { id: "relative" }), (0, core_1.h)("div", { id: "relativeToRoot" }), (0, core_1.h)("div", { id: "absolute" })];
    };
    InitCssRoot = __decorate([
        (0, core_1.Component)({
            tag: 'init-css-root',
            styleUrl: 'cmp-root.css',
        })
    ], InitCssRoot);
    return InitCssRoot;
}());
exports.InitCssRoot = InitCssRoot;
