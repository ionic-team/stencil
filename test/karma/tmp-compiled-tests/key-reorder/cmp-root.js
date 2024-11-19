"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyReorderRoot = void 0;
var core_1 = require("@stencil/core");
var KeyReorderRoot = /** @class */ (function () {
    function KeyReorderRoot() {
        this.isReversed = false;
    }
    KeyReorderRoot.prototype.testClick = function () {
        this.isReversed = !this.isReversed;
    };
    KeyReorderRoot.prototype.render = function () {
        var items = [0, 1, 2, 3, 4];
        if (this.isReversed) {
            items.reverse();
        }
        return [
            (0, core_1.h)("button", { onClick: this.testClick.bind(this) }, "Test"),
            (0, core_1.h)("div", null, items.map(function (item) {
                return ((0, core_1.h)("div", { key: item, id: 'item-' + item }, item));
            })),
        ];
    };
    __decorate([
        (0, core_1.State)()
    ], KeyReorderRoot.prototype, "isReversed", void 0);
    KeyReorderRoot = __decorate([
        (0, core_1.Component)({
            tag: 'key-reorder-root',
        })
    ], KeyReorderRoot);
    return KeyReorderRoot;
}());
exports.KeyReorderRoot = KeyReorderRoot;
