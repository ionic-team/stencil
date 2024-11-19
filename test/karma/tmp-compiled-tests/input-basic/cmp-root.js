"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputBasicRoot = void 0;
var core_1 = require("@stencil/core");
var InputBasicRoot = /** @class */ (function () {
    function InputBasicRoot() {
    }
    InputBasicRoot.prototype.render = function () {
        var _this = this;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("p", null,
                "Value: ",
                (0, core_1.h)("span", { class: "value" }, this.value)),
            (0, core_1.h)("input", { type: "text", value: this.value, onInput: function (ev) { return (_this.value = ev.target.value); } })));
    };
    __decorate([
        (0, core_1.Element)()
    ], InputBasicRoot.prototype, "el", void 0);
    __decorate([
        (0, core_1.Prop)({ mutable: true })
    ], InputBasicRoot.prototype, "value", void 0);
    InputBasicRoot = __decorate([
        (0, core_1.Component)({
            tag: 'input-basic-root',
        })
    ], InputBasicRoot);
    return InputBasicRoot;
}());
exports.InputBasicRoot = InputBasicRoot;
