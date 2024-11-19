"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleUnloadB = void 0;
var core_1 = require("@stencil/core");
var LifecycleUnloadB = /** @class */ (function () {
    function LifecycleUnloadB() {
    }
    LifecycleUnloadB.prototype.componentDidLoad = function () {
        this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
    };
    LifecycleUnloadB.prototype.disconnectedCallback = function () {
        var elm = document.createElement('div');
        elm.textContent = 'cmp-b unload';
        this.results.appendChild(elm);
    };
    LifecycleUnloadB.prototype.render = function () {
        return [
            (0, core_1.h)("article", null, "cmp-b - top"),
            (0, core_1.h)("section", null,
                (0, core_1.h)("slot", null)),
            (0, core_1.h)("nav", null, "cmp-b - bottom"),
        ];
    };
    __decorate([
        (0, core_1.Element)()
    ], LifecycleUnloadB.prototype, "el", void 0);
    LifecycleUnloadB = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-unload-b',
            shadow: true,
        })
    ], LifecycleUnloadB);
    return LifecycleUnloadB;
}());
exports.LifecycleUnloadB = LifecycleUnloadB;
