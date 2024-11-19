"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicCssVariables = void 0;
var core_1 = require("@stencil/core");
var DynamicCssVariables = /** @class */ (function () {
    function DynamicCssVariables() {
        this.bgColor = 'white';
    }
    DynamicCssVariables.prototype.getBackgroundStyle = function () {
        return this.bgColor && this.bgColor !== 'white' ? { background: this.bgColor, '--font-color': 'white' } : {};
    };
    DynamicCssVariables.prototype.changeColor = function () {
        if (this.bgColor === 'white') {
            this.bgColor = 'red';
        }
        else {
            this.bgColor = 'white';
        }
    };
    DynamicCssVariables.prototype.render = function () {
        return [
            (0, core_1.h)("header", { style: this.getBackgroundStyle() }, "Dynamic CSS Variables!!"),
            (0, core_1.h)("main", null,
                (0, core_1.h)("p", null,
                    (0, core_1.h)("button", { onClick: this.changeColor.bind(this) }, "Change Color"))),
        ];
    };
    __decorate([
        (0, core_1.State)()
    ], DynamicCssVariables.prototype, "bgColor", void 0);
    DynamicCssVariables = __decorate([
        (0, core_1.Component)({
            tag: 'dynamic-css-variable',
            styleUrl: 'cmp.css',
        })
    ], DynamicCssVariables);
    return DynamicCssVariables;
}());
exports.DynamicCssVariables = DynamicCssVariables;
