"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeBasic = void 0;
var core_1 = require("@stencil/core");
var AttributeBasic = /** @class */ (function () {
    function AttributeBasic() {
        this.wasClicked = '';
    }
    AttributeBasic.prototype.onClick = function () {
        this.wasClicked = 'Host event';
    };
    AttributeBasic.prototype.render = function () {
        return (0, core_1.h)("span", { id: "result" }, this.wasClicked);
    };
    __decorate([
        (0, core_1.State)()
    ], AttributeBasic.prototype, "wasClicked", void 0);
    __decorate([
        (0, core_1.Listen)('click')
    ], AttributeBasic.prototype, "onClick", null);
    AttributeBasic = __decorate([
        (0, core_1.Component)({
            tag: 'listen-jsx',
            scoped: true,
            styles: "\n  :host{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }",
        })
    ], AttributeBasic);
    return AttributeBasic;
}());
exports.AttributeBasic = AttributeBasic;
