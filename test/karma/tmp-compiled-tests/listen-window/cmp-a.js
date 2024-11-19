"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenWindow = void 0;
var core_1 = require("@stencil/core");
var ListenWindow = /** @class */ (function () {
    function ListenWindow() {
        this.clicked = 0;
        this.scrolled = 0;
    }
    ListenWindow.prototype.winClick = function () {
        this.clicked++;
    };
    ListenWindow.prototype.winScroll = function () {
        this.scrolled++;
    };
    ListenWindow.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("div", { id: "clicked" },
                "Clicked: ",
                this.clicked),
            (0, core_1.h)("div", null,
                "Scrolled: ",
                this.scrolled),
            (0, core_1.h)("button", null, "Click!"),
            (0, core_1.h)("div", { style: { background: 'gray', paddingTop: '2000px' } })));
    };
    __decorate([
        (0, core_1.State)()
    ], ListenWindow.prototype, "clicked", void 0);
    __decorate([
        (0, core_1.State)()
    ], ListenWindow.prototype, "scrolled", void 0);
    __decorate([
        (0, core_1.Listen)('click', { target: 'window' })
    ], ListenWindow.prototype, "winClick", null);
    __decorate([
        (0, core_1.Listen)('scroll', { target: 'window' })
    ], ListenWindow.prototype, "winScroll", null);
    ListenWindow = __decorate([
        (0, core_1.Component)({
            tag: 'listen-window',
        })
    ], ListenWindow);
    return ListenWindow;
}());
exports.ListenWindow = ListenWindow;
