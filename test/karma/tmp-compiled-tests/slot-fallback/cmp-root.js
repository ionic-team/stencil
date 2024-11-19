"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotFallbackRoot = void 0;
var core_1 = require("@stencil/core");
var SlotFallbackRoot = /** @class */ (function () {
    function SlotFallbackRoot() {
        this.fallbackInc = 0;
        this.inc = 0;
        this.slotContent = 'slot light dom 0';
        this.contentInc = 0;
    }
    SlotFallbackRoot.prototype.changeLightDom = function () {
        this.inc++;
    };
    SlotFallbackRoot.prototype.changeSlotContent = function () {
        this.contentInc++;
        this.slotContent = 'slot light dom ' + this.contentInc;
    };
    SlotFallbackRoot.prototype.changeFallbackContent = function () {
        this.fallbackInc++;
    };
    SlotFallbackRoot.prototype.render = function () {
        return [
            (0, core_1.h)("button", { onClick: this.changeFallbackContent.bind(this), class: "change-fallback-content" }, "Change Fallback Slot Content"),
            (0, core_1.h)("button", { onClick: this.changeLightDom.bind(this), class: "change-light-dom" }, this.inc % 2 === 0 ? 'Use light dom content' : 'Use fallback slot content'),
            (0, core_1.h)("button", { onClick: this.changeSlotContent.bind(this), class: "change-slot-content" }, "Change Slot Content"),
            (0, core_1.h)("slot-fallback", { inc: this.fallbackInc, class: "results1" }, this.inc % 2 !== 0
                ? [
                    (0, core_1.h)("content-default", null,
                        this.slotContent,
                        " : default"),
                    (0, core_1.h)("content-end", { slot: "end" },
                        this.slotContent,
                        " : end"),
                    (0, core_1.h)("content-start", { slot: "start" },
                        this.slotContent,
                        " : start"),
                ]
                : null),
        ];
    };
    __decorate([
        (0, core_1.State)()
    ], SlotFallbackRoot.prototype, "fallbackInc", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotFallbackRoot.prototype, "inc", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotFallbackRoot.prototype, "slotContent", void 0);
    SlotFallbackRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-fallback-root',
        })
    ], SlotFallbackRoot);
    return SlotFallbackRoot;
}());
exports.SlotFallbackRoot = SlotFallbackRoot;
