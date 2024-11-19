"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeBasicRoot = void 0;
var core_1 = require("@stencil/core");
var AttributeBasicRoot = /** @class */ (function () {
    function AttributeBasicRoot() {
    }
    AttributeBasicRoot.prototype.componentWillLoad = function () {
        this.url = new URL(window.location.href);
    };
    AttributeBasicRoot.prototype.testClick = function () {
        var cmp = this.el.querySelector('attribute-basic');
        cmp.setAttribute('single', 'single-update');
        cmp.setAttribute('multi-word', 'multiWord-update');
        cmp.setAttribute('my-custom-attr', 'my-custom-attr-update');
        cmp.setAttribute('getter', 'getter-update');
    };
    AttributeBasicRoot.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this) }, "Test"),
            (0, core_1.h)("attribute-basic", null),
            (0, core_1.h)("div", null,
                "hostname: ",
                this.url.hostname,
                ", pathname: ",
                this.url.pathname)));
    };
    __decorate([
        (0, core_1.Element)()
    ], AttributeBasicRoot.prototype, "el", void 0);
    AttributeBasicRoot = __decorate([
        (0, core_1.Component)({
            tag: 'attribute-basic-root',
        })
    ], AttributeBasicRoot);
    return AttributeBasicRoot;
}());
exports.AttributeBasicRoot = AttributeBasicRoot;
