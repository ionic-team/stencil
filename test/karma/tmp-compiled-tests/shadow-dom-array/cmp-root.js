"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomArrayRoot = void 0;
var core_1 = require("@stencil/core");
var ShadowDomArrayRoot = /** @class */ (function () {
    function ShadowDomArrayRoot() {
        this.values = [0];
    }
    ShadowDomArrayRoot.prototype.addValue = function () {
        this.values = __spreadArray(__spreadArray([], this.values, true), [this.values.length], false);
    };
    ShadowDomArrayRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.addValue.bind(this) }, "Add Value"),
            (0, core_1.h)("shadow-dom-array", { values: this.values, class: "results1" })));
    };
    __decorate([
        (0, core_1.State)()
    ], ShadowDomArrayRoot.prototype, "values", void 0);
    ShadowDomArrayRoot = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-array-root',
        })
    ], ShadowDomArrayRoot);
    return ShadowDomArrayRoot;
}());
exports.ShadowDomArrayRoot = ShadowDomArrayRoot;
