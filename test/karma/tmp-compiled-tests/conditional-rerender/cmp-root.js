"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalRerenderRoot = void 0;
var core_1 = require("@stencil/core");
var ConditionalRerenderRoot = /** @class */ (function () {
    function ConditionalRerenderRoot() {
        this.showContent = false;
        this.showFooter = false;
    }
    ConditionalRerenderRoot.prototype.componentDidLoad = function () {
        var _this = this;
        this.showFooter = true;
        setTimeout(function () { return (_this.showContent = true); }, 20);
    };
    ConditionalRerenderRoot.prototype.render = function () {
        return ((0, core_1.h)("conditional-rerender", null,
            (0, core_1.h)("header", null, "Header"),
            this.showContent ? (0, core_1.h)("section", null, "Content") : null,
            this.showFooter ? (0, core_1.h)("footer", null, "Footer") : null));
    };
    __decorate([
        (0, core_1.State)()
    ], ConditionalRerenderRoot.prototype, "showContent", void 0);
    __decorate([
        (0, core_1.State)()
    ], ConditionalRerenderRoot.prototype, "showFooter", void 0);
    ConditionalRerenderRoot = __decorate([
        (0, core_1.Component)({
            tag: 'conditional-rerender-root',
        })
    ], ConditionalRerenderRoot);
    return ConditionalRerenderRoot;
}());
exports.ConditionalRerenderRoot = ConditionalRerenderRoot;
