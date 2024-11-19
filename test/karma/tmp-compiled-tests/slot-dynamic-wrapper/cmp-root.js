"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotDynamicWrapperRoot = void 0;
var core_1 = require("@stencil/core");
var SlotDynamicWrapperRoot = /** @class */ (function () {
    function SlotDynamicWrapperRoot() {
        this.tag = 'section';
    }
    SlotDynamicWrapperRoot.prototype.changeWrapper = function () {
        if (this.tag === 'section') {
            this.tag = 'article';
        }
        else {
            this.tag = 'section';
        }
    };
    SlotDynamicWrapperRoot.prototype.render = function () {
        return [
            (0, core_1.h)("button", { onClick: this.changeWrapper.bind(this) }, "Change Wrapper"),
            (0, core_1.h)("slot-dynamic-wrapper", { tag: this.tag, class: "results1" },
                (0, core_1.h)("h1", null, "parent text")),
        ];
    };
    __decorate([
        (0, core_1.State)()
    ], SlotDynamicWrapperRoot.prototype, "tag", void 0);
    SlotDynamicWrapperRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-dynamic-wrapper-root',
        })
    ], SlotDynamicWrapperRoot);
    return SlotDynamicWrapperRoot;
}());
exports.SlotDynamicWrapperRoot = SlotDynamicWrapperRoot;
