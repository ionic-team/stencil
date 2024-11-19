"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotReorder = void 0;
var core_1 = require("@stencil/core");
var SlotReorder = /** @class */ (function () {
    function SlotReorder() {
        this.reordered = false;
    }
    SlotReorder.prototype.render = function () {
        if (this.reordered) {
            return ((0, core_1.h)("div", { class: "reordered" },
                (0, core_1.h)("slot", { name: "slot-b" },
                    (0, core_1.h)("div", null, "fallback slot-b")),
                (0, core_1.h)("slot", null,
                    (0, core_1.h)("div", null, "fallback default")),
                (0, core_1.h)("slot", { name: "slot-a" },
                    (0, core_1.h)("div", null, "fallback slot-a"))));
        }
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("slot", null,
                (0, core_1.h)("div", null, "fallback default")),
            (0, core_1.h)("slot", { name: "slot-a" },
                (0, core_1.h)("div", null, "fallback slot-a")),
            (0, core_1.h)("slot", { name: "slot-b" },
                (0, core_1.h)("div", null, "fallback slot-b"))));
    };
    __decorate([
        (0, core_1.Prop)()
    ], SlotReorder.prototype, "reordered", void 0);
    SlotReorder = __decorate([
        (0, core_1.Component)({
            tag: 'slot-reorder',
        })
    ], SlotReorder);
    return SlotReorder;
}());
exports.SlotReorder = SlotReorder;
