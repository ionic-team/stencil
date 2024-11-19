"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleBasicB = void 0;
var core_1 = require("@stencil/core");
var LifecycleBasicB = /** @class */ (function () {
    function LifecycleBasicB() {
        this.value = '';
        this.rendered = 0;
    }
    LifecycleBasicB.prototype.componentWillLoad = function () {
        this.lifecycleLoad.emit('componentWillLoad-b');
    };
    LifecycleBasicB.prototype.componentDidLoad = function () {
        this.lifecycleLoad.emit('componentDidLoad-b');
    };
    LifecycleBasicB.prototype.componentWillUpdate = function () {
        this.lifecycleUpdate.emit('componentWillUpdate-b');
    };
    LifecycleBasicB.prototype.componentDidUpdate = function () {
        this.lifecycleUpdate.emit('componentDidUpdate-b');
    };
    LifecycleBasicB.prototype.render = function () {
        this.rendered++;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("hr", null),
            (0, core_1.h)("div", null,
                "LifecycleBasicB ",
                this.value),
            (0, core_1.h)("div", { class: "rendered-b" },
                "rendered b: ",
                this.rendered),
            (0, core_1.h)("lifecycle-basic-c", { value: this.value })));
    };
    __decorate([
        (0, core_1.Prop)()
    ], LifecycleBasicB.prototype, "value", void 0);
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicB.prototype, "rendered", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleBasicB.prototype, "lifecycleLoad", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleBasicB.prototype, "lifecycleUpdate", void 0);
    LifecycleBasicB = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-basic-b',
        })
    ], LifecycleBasicB);
    return LifecycleBasicB;
}());
exports.LifecycleBasicB = LifecycleBasicB;
