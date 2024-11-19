"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotArrayComplexRoot = void 0;
var core_1 = require("@stencil/core");
var SlotArrayComplexRoot = /** @class */ (function () {
    function SlotArrayComplexRoot() {
        this.endSlot = false;
    }
    SlotArrayComplexRoot.prototype.componentDidLoad = function () {
        this.endSlot = !this.endSlot;
    };
    SlotArrayComplexRoot.prototype.render = function () {
        return ((0, core_1.h)("main", null,
            (0, core_1.h)("slot-array-complex", null,
                (0, core_1.h)("header", { slot: "start" }, "slot - start"),
                "slot - default",
                this.endSlot ? (0, core_1.h)("footer", { slot: "end" }, "slot - end") : null)));
    };
    __decorate([
        (0, core_1.State)()
    ], SlotArrayComplexRoot.prototype, "endSlot", void 0);
    SlotArrayComplexRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-array-complex-root',
        })
    ], SlotArrayComplexRoot);
    return SlotArrayComplexRoot;
}());
exports.SlotArrayComplexRoot = SlotArrayComplexRoot;
