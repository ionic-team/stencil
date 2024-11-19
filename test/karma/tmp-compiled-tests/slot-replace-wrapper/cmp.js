"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotReplaceWrapper = void 0;
var core_1 = require("@stencil/core");
var SlotReplaceWrapper = /** @class */ (function () {
    function SlotReplaceWrapper() {
    }
    SlotReplaceWrapper.prototype.render = function () {
        var TagType = (this.href != null ? 'a' : 'div');
        var attrs = (this.href != null ? { href: this.href, target: '_blank' } : {});
        return [
            (0, core_1.h)(TagType, __assign({}, attrs),
                (0, core_1.h)("slot", { name: "start" }),
                (0, core_1.h)("span", null,
                    (0, core_1.h)("slot", null),
                    (0, core_1.h)("span", null,
                        (0, core_1.h)("slot", { name: "end" })))),
            (0, core_1.h)("hr", null),
        ];
    };
    __decorate([
        (0, core_1.Prop)()
    ], SlotReplaceWrapper.prototype, "href", void 0);
    SlotReplaceWrapper = __decorate([
        (0, core_1.Component)({
            tag: 'slot-replace-wrapper',
        })
    ], SlotReplaceWrapper);
    return SlotReplaceWrapper;
}());
exports.SlotReplaceWrapper = SlotReplaceWrapper;
