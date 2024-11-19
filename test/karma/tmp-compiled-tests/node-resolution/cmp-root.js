"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeResolution = void 0;
var core_1 = require("@stencil/core");
var module_1 = require("./module");
var index_1 = require("./module/index");
var NodeResolution = /** @class */ (function () {
    function NodeResolution() {
    }
    NodeResolution.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("h1", null, "node-resolution"),
            (0, core_1.h)("p", { id: "module-index" }, index_1.location),
            (0, core_1.h)("p", { id: "module" }, module_1.location)));
    };
    NodeResolution = __decorate([
        (0, core_1.Component)({
            tag: 'node-resolution',
        })
    ], NodeResolution);
    return NodeResolution;
}());
exports.NodeResolution = NodeResolution;
