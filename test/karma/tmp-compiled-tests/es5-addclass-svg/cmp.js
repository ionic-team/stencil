"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgAddClass = void 0;
var core_1 = require("@stencil/core");
var SvgAddClass = /** @class */ (function () {
    function SvgAddClass() {
    }
    SvgAddClass.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("svg", { viewBox: "0 0 8 8", class: "existing-css-class" },
                (0, core_1.h)("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
    };
    SvgAddClass = __decorate([
        (0, core_1.Component)({
            tag: 'es5-addclass-svg',
            shadow: true,
        })
    ], SvgAddClass);
    return SvgAddClass;
}());
exports.SvgAddClass = SvgAddClass;
