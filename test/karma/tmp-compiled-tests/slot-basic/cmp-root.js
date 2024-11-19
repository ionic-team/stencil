"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotBasicRoot = void 0;
var core_1 = require("@stencil/core");
var textA = 'A';
var spanA = (0, core_1.h)("span", null, "A");
var divA = (0, core_1.h)("div", null, "A");
var textB = 'B';
var spanB = (0, core_1.h)("span", null, "B");
var divB = (0, core_1.h)("div", null, "B");
var divC = (0, core_1.h)("div", null, "C");
var SlotBasicRoot = /** @class */ (function () {
    function SlotBasicRoot() {
        this.inc = 1;
    }
    SlotBasicRoot.prototype.testClick = function () {
        this.inc++;
    };
    SlotBasicRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"),
            (0, core_1.h)("div", { class: "inc" },
                "Rendered: ",
                this.inc),
            (0, core_1.h)("div", { class: "results1" },
                (0, core_1.h)("slot-basic", null,
                    textA,
                    textB)),
            (0, core_1.h)("div", { class: "results2" },
                (0, core_1.h)("slot-basic", null,
                    textA,
                    spanB)),
            (0, core_1.h)("div", { class: "results3" },
                (0, core_1.h)("slot-basic", null,
                    textA,
                    divB)),
            (0, core_1.h)("div", { class: "results4" },
                (0, core_1.h)("slot-basic", null,
                    (0, core_1.h)("footer", null,
                        textA,
                        divB))),
            (0, core_1.h)("div", { class: "results5" },
                (0, core_1.h)("slot-basic", null,
                    spanA,
                    textB)),
            (0, core_1.h)("div", { class: "results6" },
                (0, core_1.h)("slot-basic", null,
                    spanA,
                    spanB)),
            (0, core_1.h)("div", { class: "results7" },
                (0, core_1.h)("slot-basic", null,
                    spanA,
                    divB)),
            (0, core_1.h)("div", { class: "results8" },
                (0, core_1.h)("slot-basic", null,
                    divA,
                    textB)),
            (0, core_1.h)("div", { class: "results9" },
                (0, core_1.h)("slot-basic", null,
                    divA,
                    spanB)),
            (0, core_1.h)("div", { class: "results10" },
                (0, core_1.h)("slot-basic", null,
                    divA,
                    divB)),
            (0, core_1.h)("div", { class: "results11" },
                (0, core_1.h)("slot-basic", null,
                    divA,
                    (0, core_1.h)("footer", null, divB),
                    divC))));
    };
    __decorate([
        (0, core_1.State)()
    ], SlotBasicRoot.prototype, "inc", void 0);
    SlotBasicRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-basic-root',
        })
    ], SlotBasicRoot);
    return SlotBasicRoot;
}());
exports.SlotBasicRoot = SlotBasicRoot;
