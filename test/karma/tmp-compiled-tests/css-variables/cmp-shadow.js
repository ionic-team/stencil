"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssVariablesRoot = void 0;
var core_1 = require("@stencil/core");
var CssVariablesRoot = /** @class */ (function () {
    function CssVariablesRoot() {
        this.isGreen = false;
    }
    CssVariablesRoot.prototype.render = function () {
        var _this = this;
        return ((0, core_1.h)(core_1.Host, { class: {
                'set-green': this.isGreen,
            } },
            (0, core_1.h)("div", { class: "inner-div" },
                "Shadow: ",
                this.isGreen ? 'Green' : 'Red',
                " background"),
            (0, core_1.h)("div", { class: "black-global-shadow" }, "Shadow: Black background (global)"),
            (0, core_1.h)("button", { onClick: function () {
                    _this.isGreen = !_this.isGreen;
                } }, "Toggle color")));
    };
    __decorate([
        (0, core_1.State)()
    ], CssVariablesRoot.prototype, "isGreen", void 0);
    CssVariablesRoot = __decorate([
        (0, core_1.Component)({
            tag: 'css-variables-shadow-dom',
            styleUrl: 'cmp-shadow-dom.css',
            shadow: true,
        })
    ], CssVariablesRoot);
    return CssVariablesRoot;
}());
exports.CssVariablesRoot = CssVariablesRoot;
