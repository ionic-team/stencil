"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleBasicC = void 0;
var core_1 = require("@stencil/core");
var LifecycleBasicC = /** @class */ (function () {
    function LifecycleBasicC() {
        this.value = '';
        this.rendered = 0;
    }
    LifecycleBasicC.prototype.componentWillLoad = function () {
        this.lifecycleLoad.emit('componentWillLoad-c');
    };
    LifecycleBasicC.prototype.componentDidLoad = function () {
        this.lifecycleLoad.emit('componentDidLoad-c');
    };
    LifecycleBasicC.prototype.componentWillUpdate = function () {
        this.lifecycleUpdate.emit('componentWillUpdate-c');
    };
    LifecycleBasicC.prototype.componentDidUpdate = function () {
        this.lifecycleUpdate.emit('componentDidUpdate-c');
    };
    LifecycleBasicC.prototype.render = function () {
        this.rendered++;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("hr", null),
            (0, core_1.h)("div", null,
                "LifecycleBasicC ",
                this.value),
            (0, core_1.h)("div", { class: "rendered-c" },
                "rendered c: ",
                this.rendered)));
    };
    __decorate([
        (0, core_1.Prop)()
    ], LifecycleBasicC.prototype, "value", void 0);
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicC.prototype, "rendered", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleBasicC.prototype, "lifecycleLoad", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleBasicC.prototype, "lifecycleUpdate", void 0);
    LifecycleBasicC = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-basic-c',
        })
    ], LifecycleBasicC);
    return LifecycleBasicC;
}());
exports.LifecycleBasicC = LifecycleBasicC;
