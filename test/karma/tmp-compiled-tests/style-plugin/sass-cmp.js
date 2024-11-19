"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SassCmp = void 0;
var core_1 = require("@stencil/core");
var SassCmp = /** @class */ (function () {
    function SassCmp() {
    }
    SassCmp.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("div", { class: "sass-entry" }, "Sass Entry"),
            (0, core_1.h)("div", { class: "sass-importee" }, "Sass Importee"),
            (0, core_1.h)("div", { class: "css-importee" }, "Css Importee"),
            (0, core_1.h)("button", { class: "btn btn-primary" }, "Bootstrap"),
            (0, core_1.h)("hr", null)));
    };
    SassCmp = __decorate([
        (0, core_1.Component)({
            tag: 'sass-cmp',
            styleUrl: 'sass-entry.scss',
            shadow: true,
        })
    ], SassCmp);
    return SassCmp;
}());
exports.SassCmp = SassCmp;
