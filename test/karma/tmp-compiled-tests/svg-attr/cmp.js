"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgAttr = void 0;
var core_1 = require("@stencil/core");
var SvgAttr = /** @class */ (function () {
    function SvgAttr() {
        this.isOpen = false;
    }
    SvgAttr.prototype.testClick = function () {
        this.isOpen = !this.isOpen;
    };
    SvgAttr.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("div", null,
                (0, core_1.h)("button", { onClick: this.testClick.bind(this) }, "Test")),
            (0, core_1.h)("div", null, this.isOpen ? ((0, core_1.h)("svg", { viewBox: "0 0 54 54" },
                (0, core_1.h)("rect", { transform: "rotate(45 27 27)", y: "22", width: "54", height: "10", rx: "2", stroke: "yellow", "stroke-width": "5px", "stroke-dasharray": "8 4" }))) : ((0, core_1.h)("svg", { viewBox: "0 0 54 54" },
                (0, core_1.h)("rect", { y: "0", width: "54", height: "10", rx: "2", stroke: "blue", "stroke-width": "2px", "stroke-dasharray": "4 2" }))))));
    };
    __decorate([
        (0, core_1.State)()
    ], SvgAttr.prototype, "isOpen", void 0);
    SvgAttr = __decorate([
        (0, core_1.Component)({
            tag: 'svg-attr',
        })
    ], SvgAttr);
    return SvgAttr;
}());
exports.SvgAttr = SvgAttr;
