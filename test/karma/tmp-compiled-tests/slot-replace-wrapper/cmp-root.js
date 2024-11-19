"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotReplaceWrapperRoot = void 0;
var core_1 = require("@stencil/core");
var SlotReplaceWrapperRoot = /** @class */ (function () {
    function SlotReplaceWrapperRoot() {
    }
    SlotReplaceWrapperRoot.prototype.componentDidLoad = function () {
        this.href = 'http://stenciljs.com/';
    };
    SlotReplaceWrapperRoot.prototype.render = function () {
        return ((0, core_1.h)("main", null,
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results1" },
                (0, core_1.h)("content-end", { slot: "start" }, "A")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results2" },
                (0, core_1.h)("content-end", null, "B")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results3" },
                (0, core_1.h)("content-end", { slot: "end" }, "C")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results4" },
                (0, core_1.h)("content-start", { slot: "start" }, "A"),
                (0, core_1.h)("content-default", null, "B"),
                (0, core_1.h)("content-end", { slot: "end" }, "C")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results5" },
                (0, core_1.h)("content-default", null, "B"),
                (0, core_1.h)("content-end", { slot: "end" }, "C"),
                (0, core_1.h)("content-start", { slot: "start" }, "A")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results6" },
                (0, core_1.h)("content-end", { slot: "end" }, "C"),
                (0, core_1.h)("content-start", { slot: "start" }, "A"),
                (0, core_1.h)("content-default", null, "B")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results7" },
                (0, core_1.h)("content-start", { slot: "start" }, "A1"),
                (0, core_1.h)("content-start", { slot: "start" }, "A2"),
                (0, core_1.h)("content-default", null, "B1"),
                (0, core_1.h)("content-default", null, "B2"),
                (0, core_1.h)("content-end", { slot: "end" }, "C1"),
                (0, core_1.h)("content-end", { slot: "end" }, "C2")),
            (0, core_1.h)("slot-replace-wrapper", { href: this.href, class: "results8" },
                (0, core_1.h)("content-default", null, "B1"),
                (0, core_1.h)("content-end", { slot: "end" }, "C1"),
                (0, core_1.h)("content-start", { slot: "start" }, "A1"),
                (0, core_1.h)("content-default", null, "B2"),
                (0, core_1.h)("content-end", { slot: "end" }, "C2"),
                (0, core_1.h)("content-start", { slot: "start" }, "A2"))));
    };
    __decorate([
        (0, core_1.State)()
    ], SlotReplaceWrapperRoot.prototype, "href", void 0);
    SlotReplaceWrapperRoot = __decorate([
        (0, core_1.Component)({
            tag: 'slot-replace-wrapper-root',
        })
    ], SlotReplaceWrapperRoot);
    return SlotReplaceWrapperRoot;
}());
exports.SlotReplaceWrapperRoot = SlotReplaceWrapperRoot;
