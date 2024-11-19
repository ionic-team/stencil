"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalBasic = void 0;
var core_1 = require("@stencil/core");
var ConditionalBasic = /** @class */ (function () {
    function ConditionalBasic() {
        this.showContent = false;
    }
    ConditionalBasic.prototype.testClick = function () {
        this.showContent = !this.showContent;
    };
    ConditionalBasic.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"),
            (0, core_1.h)("div", { class: "results" }, this.showContent ? 'Content' : '')));
    };
    __decorate([
        (0, core_1.State)()
    ], ConditionalBasic.prototype, "showContent", void 0);
    ConditionalBasic = __decorate([
        (0, core_1.Component)({
            tag: 'conditional-basic',
        })
    ], ConditionalBasic);
    return ConditionalBasic;
}());
exports.ConditionalBasic = ConditionalBasic;
