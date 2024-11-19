"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleUnloadA = void 0;
var core_1 = require("@stencil/core");
var LifecycleUnloadA = /** @class */ (function () {
    function LifecycleUnloadA() {
    }
    LifecycleUnloadA.prototype.componentDidLoad = function () {
        this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
    };
    LifecycleUnloadA.prototype.disconnectedCallback = function () {
        var elm = document.createElement('div');
        elm.textContent = 'cmp-a unload';
        this.results.appendChild(elm);
    };
    LifecycleUnloadA.prototype.render = function () {
        return ((0, core_1.h)("main", null,
            (0, core_1.h)("header", null, "cmp-a - top"),
            (0, core_1.h)("lifecycle-unload-b", null, "cmp-a - middle"),
            (0, core_1.h)("footer", null, "cmp-a - bottom")));
    };
    __decorate([
        (0, core_1.Element)()
    ], LifecycleUnloadA.prototype, "el", void 0);
    LifecycleUnloadA = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-unload-a',
            shadow: true,
        })
    ], LifecycleUnloadA);
    return LifecycleUnloadA;
}());
exports.LifecycleUnloadA = LifecycleUnloadA;
