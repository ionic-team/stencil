"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomReattach = void 0;
var core_1 = require("@stencil/core");
var DomReattach = /** @class */ (function () {
    function DomReattach() {
        this.willLoad = 0;
        this.didLoad = 0;
        this.didUnload = 0;
    }
    DomReattach.prototype.componentWillLoad = function () {
        this.willLoad++;
    };
    DomReattach.prototype.componentDidLoad = function () {
        this.didLoad++;
    };
    DomReattach.prototype.disconnectedCallback = function () {
        this.didUnload++;
    };
    DomReattach.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("p", null,
                "componentWillLoad: ",
                this.willLoad),
            (0, core_1.h)("p", null,
                "componentDidLoad: ",
                this.didLoad),
            (0, core_1.h)("p", null,
                "disconnectedCallback: ",
                this.didUnload)));
    };
    __decorate([
        (0, core_1.Prop)({ mutable: true })
    ], DomReattach.prototype, "willLoad", void 0);
    __decorate([
        (0, core_1.Prop)({ mutable: true })
    ], DomReattach.prototype, "didLoad", void 0);
    __decorate([
        (0, core_1.Prop)({ mutable: true })
    ], DomReattach.prototype, "didUnload", void 0);
    DomReattach = __decorate([
        (0, core_1.Component)({
            tag: 'dom-reattach',
        })
    ], DomReattach);
    return DomReattach;
}());
exports.DomReattach = DomReattach;
