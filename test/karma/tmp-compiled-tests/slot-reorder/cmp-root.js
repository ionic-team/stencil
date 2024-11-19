"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotReorderRoot = void 0;
var core_1 = require("@stencil/core");
var SlotReorderRoot = /** @class */ (function () {
    function SlotReorderRoot() {
        this.reordered = false;
    }
    SlotReorderRoot.prototype.testClick = function () {
        this.reordered = !this.reordered;
    };
    SlotReorderRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"),
            (0, core_1.h)("slot-reorder", { class: "results1", reordered: this.reordered }),
            (0, core_1.h)("hr", null),
            (0, core_1.h)("slot-reorder", { class: "results2", reordered: this.reordered },
                (0, core_1.h)("div", null, "default content")),
            (0, core_1.h)("hr", null),
            (0, core_1.h)("slot-reorder", { class: "results3", reordered: this.reordered },
                (0, core_1.h)("div", { slot: "slot-b" }, "slot-b content"),
                (0, core_1.h)("div", null, "default content"),
                (0, core_1.h)("div", { slot: "slot-a" }, "slot-a content")),
            (0, core_1.h)("hr", null),
            (0, core_1.h)("slot-reorder", { class: "results4", reordered: this.reordered },
                (0, core_1.h)("div", { slot: "slot-b" }, "slot-b content"),
                (0, core_1.h)("div", { slot: "slot-a" }, "slot-a content"),
                (0, core_1.h)("div", null, "default content"))));
    };
    __decorate([
        (0, core_1.State)()
    ], SlotReorderRoot.prototype, "reordered", void 0);
    SlotReorderRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-reorder-root',
        })
    ], SlotReorderRoot);
    return SlotReorderRoot;
}());
exports.SlotReorderRoot = SlotReorderRoot;
