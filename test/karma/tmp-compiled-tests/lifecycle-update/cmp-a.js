"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleUpdateA = void 0;
var core_1 = require("@stencil/core");
var LifecycleUpdateA = /** @class */ (function () {
    function LifecycleUpdateA() {
        this.values = [];
    }
    LifecycleUpdateA.prototype.testClick = function () {
        this.values.push(this.values.length + 1);
        this.values = this.values.slice();
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:gray\">async add child components to lifecycle-update-a</span> ".concat(this.values[this.values.length - 1]);
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateA.prototype.componentWillLoad = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:maroon\">lifecycle-update-a</span> <span style=\"color:blue\">componentWillLoad</span>";
        document.getElementById('output').appendChild(li);
        return new Promise(function (resolve) {
            setTimeout(resolve, 10);
        });
    };
    LifecycleUpdateA.prototype.componentDidLoad = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:maroon\">lifecycle-update-a</span> <span style=\"color:green\">componentDidLoad</span>";
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateA.prototype.componentWillUpdate = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:maroon\">lifecycle-update-a</span> <span style=\"color:cyan\">componentWillUpdate</span> ".concat(this.values[this.values.length - 1]);
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateA.prototype.componentDidUpdate = function () {
        var li = document.createElement('li');
        li.innerHTML = "<span style=\"color:maroon\">lifecycle-update-a</span> <span style=\"color:limegreen\">componentDidUpdate</span> ".concat(this.values[this.values.length - 1]);
        document.getElementById('output').appendChild(li);
    };
    LifecycleUpdateA.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("button", { onClick: this.testClick.bind(this), class: "test" }, "Add Child Components"),
            (0, core_1.h)("hr", null),
            this.values.map(function (value) {
                return (0, core_1.h)("lifecycle-update-b", { value: value });
            })));
    };
    __decorate([
        (0, core_1.State)()
    ], LifecycleUpdateA.prototype, "values", void 0);
    LifecycleUpdateA = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-update-a',
        })
    ], LifecycleUpdateA);
    return LifecycleUpdateA;
}());
exports.LifecycleUpdateA = LifecycleUpdateA;
