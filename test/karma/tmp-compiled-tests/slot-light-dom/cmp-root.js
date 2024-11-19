"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotLightDomRoot = void 0;
var core_1 = require("@stencil/core");
var SlotLightDomRoot = /** @class */ (function () {
    function SlotLightDomRoot() {
        this.a = 'a';
        this.b = 'b';
        this.c = 'c';
        this.d = 'd';
        this.e = 'e';
        this.f = 'f';
        this.g = 'g';
        this.h = 'h';
        this.i = 'i';
        this.j = 'j';
        this.k = 'k';
        this.l = 'l';
        this.m = 'm';
    }
    SlotLightDomRoot.prototype.testClick = function () {
        this.a = 'A';
        this.b = 'B';
        this.c = 'C';
        this.d = 'D';
        this.e = 'E';
        this.f = 'F';
        this.g = 'G';
        this.h = 'H';
        this.i = 'I';
        this.j = 'J';
        this.k = 'K';
        this.l = 'L';
        this.m = 'M';
    };
    SlotLightDomRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this) }, "Test"),
            (0, core_1.h)("slot-light-dom-content", { class: "results1" }, this.a),
            (0, core_1.h)("slot-light-dom-content", { class: "results2" }, this.b),
            (0, core_1.h)("slot-light-dom-content", { class: "results3" },
                (0, core_1.h)("nav", null, this.c)),
            (0, core_1.h)("slot-light-dom-content", { class: "results4" },
                (0, core_1.h)("nav", null, this.d),
                this.e),
            (0, core_1.h)("slot-light-dom-content", { class: "results5" },
                this.f,
                (0, core_1.h)("nav", null, this.g)),
            (0, core_1.h)("slot-light-dom-content", { class: "results6" },
                this.h,
                (0, core_1.h)("nav", null, this.i),
                this.j),
            (0, core_1.h)("slot-light-dom-content", { class: "results7" },
                (0, core_1.h)("nav", null, this.k),
                (0, core_1.h)("nav", null, this.l),
                (0, core_1.h)("nav", null, this.m))));
    };
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "a", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "b", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "c", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "d", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "e", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "f", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "g", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "h", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "i", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "j", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "k", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "l", void 0);
    __decorate([
        (0, core_1.State)()
    ], SlotLightDomRoot.prototype, "m", void 0);
    SlotLightDomRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-light-dom-root',
        })
    ], SlotLightDomRoot);
    return SlotLightDomRoot;
}());
exports.SlotLightDomRoot = SlotLightDomRoot;
