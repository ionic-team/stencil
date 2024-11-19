"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenReattach = void 0;
var core_1 = require("@stencil/core");
var ListenReattach = /** @class */ (function () {
    function ListenReattach() {
        this.clicked = 0;
    }
    ListenReattach.prototype.click = function () {
        this.clicked++;
    };
    ListenReattach.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("div", { id: "clicked" },
                "Clicked: ",
                this.clicked)));
    };
    __decorate([
        (0, core_1.State)()
    ], ListenReattach.prototype, "clicked", void 0);
    __decorate([
        (0, core_1.Listen)('click')
    ], ListenReattach.prototype, "click", null);
    ListenReattach = __decorate([
        (0, core_1.Component)({
            tag: 'listen-reattach',
            styles: ':host { display: block; background: gray;}',
            scoped: true,
        })
    ], ListenReattach);
    return ListenReattach;
}());
exports.ListenReattach = ListenReattach;
