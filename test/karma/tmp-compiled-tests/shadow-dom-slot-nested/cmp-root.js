"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomSlotNestedRoot = void 0;
var core_1 = require("@stencil/core");
var ShadowDomSlotNestedRoot = /** @class */ (function () {
    function ShadowDomSlotNestedRoot() {
    }
    ShadowDomSlotNestedRoot.prototype.render = function () {
        var nested = [0, 1, 2].map(function (i) {
            return (0, core_1.h)("shadow-dom-slot-nested", { i: i },
                "light dom: ",
                i);
        });
        return [(0, core_1.h)("section", null, "shadow-dom-slot-nested"), (0, core_1.h)("article", null, nested)];
    };
    ShadowDomSlotNestedRoot = __decorate([
        (0, core_1.Component)({
            tag: 'shadow-dom-slot-nested-root',
            styles: "\n    :host {\n      color: green;\n      font-weight: bold;\n    }\n  ",
            shadow: true,
        })
    ], ShadowDomSlotNestedRoot);
    return ShadowDomSlotNestedRoot;
}());
exports.ShadowDomSlotNestedRoot = ShadowDomSlotNestedRoot;
