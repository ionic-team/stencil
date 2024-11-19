"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleUpdateB = void 0;
var core_1 = require("@stencil/core");
var LifecycleUpdateB = /** @class */ (function () {
    function LifecycleUpdateB() {
        this.value = 0;
    }
    LifecycleUpdateB.prototype.componentWillLoad = function () {
        this.start = Date.now();
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:red\">lifecycle-update-b</span> <span style=\"color:blue\">componentWillLoad</span> ".concat(this.value);
        document.getElementById('output').appendChild(li);
        return new Promise(function (resolve) {
            setTimeout(resolve, 20);
        });
    };
    LifecycleUpdateB.prototype.componentDidLoad = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:red\">lifecycle-update-b</span> <span style=\"color:green\">componentDidLoad</span> ".concat(this.value);
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateB.prototype.render = function () {
        return ((0, core_1.h)("section", null,
            "lifecycle-update-b: ",
            this.value,
            (0, core_1.h)("lifecycle-update-c", { value: this.value })));
    };
    __decorate([
        (0, core_1.Prop)()
    ], LifecycleUpdateB.prototype, "value", void 0);
    LifecycleUpdateB = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-update-b',
        })
    ], LifecycleUpdateB);
    return LifecycleUpdateB;
}());
exports.LifecycleUpdateB = LifecycleUpdateB;
