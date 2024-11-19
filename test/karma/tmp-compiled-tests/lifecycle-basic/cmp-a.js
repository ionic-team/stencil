"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleBasicA = void 0;
var core_1 = require("@stencil/core");
var LifecycleBasicA = /** @class */ (function () {
    function LifecycleBasicA() {
        this.value = '';
        this.rendered = 0;
        this.loads = [];
        this.updates = [];
        this.componentWillUpdated = false;
        this.componentDidUpdated = false;
    }
    LifecycleBasicA.prototype.lifecycleLoad = function (ev) {
        this.loads = __spreadArray(__spreadArray([], this.loads, true), [ev.detail], false);
    };
    LifecycleBasicA.prototype.lifecycleUpdate = function (ev) {
        this.updates = __spreadArray(__spreadArray([], this.updates, true), [ev.detail], false);
    };
    LifecycleBasicA.prototype.componentWillLoad = function () {
        this.loads = __spreadArray(__spreadArray([], this.loads, true), ['componentWillLoad-a'], false);
    };
    LifecycleBasicA.prototype.componentDidLoad = function () {
        this.loads = __spreadArray(__spreadArray([], this.loads, true), ['componentDidLoad-a'], false);
    };
    LifecycleBasicA.prototype.componentWillUpdate = function () {
        if (this.value === 'Updated' && !this.componentWillUpdated) {
            this.updates = __spreadArray(__spreadArray([], this.updates, true), ['componentWillUpdate-a'], false);
            this.componentWillUpdated = true;
        }
    };
    LifecycleBasicA.prototype.componentDidUpdate = function () {
        if (this.value === 'Updated' && !this.componentDidUpdated) {
            this.updates = __spreadArray(__spreadArray([], this.updates, true), ['componentDidUpdate-a'], false);
            this.componentDidUpdated = true;
        }
    };
    LifecycleBasicA.prototype.testClick = function () {
        this.value = 'Updated';
    };
    LifecycleBasicA.prototype.render = function () {
        this.rendered++;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this), class: "test" }, "Update"),
            (0, core_1.h)("hr", null),
            (0, core_1.h)("div", null,
                "LifecycleBasicA ",
                this.value),
            (0, core_1.h)("div", { class: "rendered-a" },
                "rendered a: ",
                this.rendered),
            (0, core_1.h)("div", null, "loads a:"),
            (0, core_1.h)("ol", { class: "lifecycle-loads-a" }, this.loads.map(function (load) {
                return (0, core_1.h)("li", null, load);
            })),
            (0, core_1.h)("div", null, "updates a:"),
            (0, core_1.h)("ol", { class: "lifecycle-updates-a" }, this.updates.map(function (update) {
                return (0, core_1.h)("li", null, update);
            })),
            (0, core_1.h)("lifecycle-basic-b", { value: this.value })));
    };
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicA.prototype, "value", void 0);
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicA.prototype, "rendered", void 0);
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicA.prototype, "loads", void 0);
    __decorate([
        (0, core_1.State)()
    ], LifecycleBasicA.prototype, "updates", void 0);
    __decorate([
        (0, core_1.Listen)('lifecycleLoad')
    ], LifecycleBasicA.prototype, "lifecycleLoad", null);
    __decorate([
        (0, core_1.Listen)('lifecycleUpdate')
    ], LifecycleBasicA.prototype, "lifecycleUpdate", null);
    LifecycleBasicA = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-basic-a',
        })
    ], LifecycleBasicA);
    return LifecycleBasicA;
}());
exports.LifecycleBasicA = LifecycleBasicA;
