"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleUpdateC = void 0;
var core_1 = require("@stencil/core");
var LifecycleUpdateC = /** @class */ (function () {
    function LifecycleUpdateC() {
        this.value = 0;
    }
    LifecycleUpdateC.prototype.componentWillLoad = function () {
        this.start = Date.now();
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:orange\">lifecycle-update-c</span> <span style=\"color:blue\">componentWillLoad</span> ".concat(this.value);
        document.getElementById('output').appendChild(li);
        return new Promise(function (resolve) {
            setTimeout(resolve, 30);
        });
    };
    LifecycleUpdateC.prototype.componentDidLoad = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:orange\">lifecycle-update-c</span> <span style=\"color:green\">componentDidLoad</span> ".concat(this.value);
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateC.prototype.render = function () {
        return (0, core_1.h)("span", null,
            " - lifecycle-update-c: ",
            this.value);
    };
    __decorate([
        (0, core_1.Prop)()
    ], LifecycleUpdateC.prototype, "value", void 0);
    LifecycleUpdateC = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-update-c',
        })
    ], LifecycleUpdateC);
    return LifecycleUpdateC;
}());
exports.LifecycleUpdateC = LifecycleUpdateC;
