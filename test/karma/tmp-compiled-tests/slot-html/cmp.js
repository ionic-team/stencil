"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotHtml = void 0;
var core_1 = require("@stencil/core");
var SlotHtml = /** @class */ (function () {
    function SlotHtml() {
        this.inc = 0;
    }
    SlotHtml.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("hr", null),
            (0, core_1.h)("article", null,
                (0, core_1.h)("span", null,
                    (0, core_1.h)("slot", { name: "start" }))),
            (0, core_1.h)("slot", null),
            (0, core_1.h)("section", null,
                (0, core_1.h)("slot", { name: "end" }))));
    };
    __decorate([
        (0, core_1.Prop)()
    ], SlotHtml.prototype, "inc", void 0);
    SlotHtml = __decorate([
        (0, core_1.Component)({
            tag: 'slot-html',
        })
    ], SlotHtml);
    return SlotHtml;
}());
exports.SlotHtml = SlotHtml;
