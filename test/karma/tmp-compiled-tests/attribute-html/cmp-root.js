"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHtmlRoot = void 0;
var core_1 = require("@stencil/core");
var AttributeHtmlRoot = /** @class */ (function () {
    function AttributeHtmlRoot() {
    }
    AttributeHtmlRoot.prototype.render = function () {
        return [
            (0, core_1.h)("p", null,
                "strAttr:",
                ' ',
                (0, core_1.h)("strong", { id: "str-attr" },
                    this.strAttr,
                    " ",
                    typeof this.strAttr)),
            (0, core_1.h)("p", null,
                "anyAttr:",
                ' ',
                (0, core_1.h)("strong", { id: "any-attr" },
                    this.anyAttr,
                    " ",
                    typeof this.anyAttr)),
            (0, core_1.h)("p", null,
                "nuAttr:",
                ' ',
                (0, core_1.h)("strong", { id: "nu-attr" },
                    this.nuAttr,
                    " ",
                    typeof this.nuAttr)),
        ];
    };
    __decorate([
        (0, core_1.Prop)()
    ], AttributeHtmlRoot.prototype, "strAttr", void 0);
    __decorate([
        (0, core_1.Prop)()
    ], AttributeHtmlRoot.prototype, "anyAttr", void 0);
    __decorate([
        (0, core_1.Prop)()
    ], AttributeHtmlRoot.prototype, "nuAttr", void 0);
    AttributeHtmlRoot = __decorate([
        (0, core_1.Component)({
            tag: 'attribute-html-root',
        })
    ], AttributeHtmlRoot);
    return AttributeHtmlRoot;
}());
exports.AttributeHtmlRoot = AttributeHtmlRoot;
