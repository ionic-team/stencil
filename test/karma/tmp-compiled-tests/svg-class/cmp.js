"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgClass = void 0;
var core_1 = require("@stencil/core");
var SvgClass = /** @class */ (function () {
    function SvgClass() {
        this.hasColor = false;
    }
    SvgClass.prototype.testClick = function () {
        this.hasColor = !this.hasColor;
    };
    SvgClass.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("div", null,
                (0, core_1.h)("button", { onClick: this.testClick.bind(this) }, "Test")),
            (0, core_1.h)("div", null,
                (0, core_1.h)("svg", { viewBox: "0 0 54 54", class: this.hasColor ? 'primary' : undefined },
                    (0, core_1.h)("circle", { cx: "8", cy: "18", width: "54", height: "8", r: "2", class: this.hasColor ? 'red' : undefined }),
                    (0, core_1.h)("rect", { y: "2", width: "54", height: "8", rx: "2", class: this.hasColor ? 'blue' : undefined })))));
    };
    __decorate([
        (0, core_1.State)()
    ], SvgClass.prototype, "hasColor", void 0);
    SvgClass = __decorate([
        (0, core_1.Component)({
            tag: 'svg-class',
        })
    ], SvgClass);
    return SvgClass;
}());
exports.SvgClass = SvgClass;
