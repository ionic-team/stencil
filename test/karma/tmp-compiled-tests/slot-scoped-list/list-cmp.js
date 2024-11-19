"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotLightScopedList = void 0;
var core_1 = require("@stencil/core");
var SlotLightScopedList = /** @class */ (function () {
    function SlotLightScopedList() {
    }
    SlotLightScopedList.prototype.render = function () {
        return [
            (0, core_1.h)("section", null, "These are my items:"),
            (0, core_1.h)("article", { class: "list-wrapper", style: { border: '2px solid green' } },
                (0, core_1.h)("slot", null)),
            (0, core_1.h)("div", null, "That's it...."),
        ];
    };
    SlotLightScopedList = __decorate([
        (0, core_1.Component)({
            tag: 'slot-light-scoped-list',
        })
    ], SlotLightScopedList);
    return SlotLightScopedList;
}());
exports.SlotLightScopedList = SlotLightScopedList;
