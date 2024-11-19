"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGlobals = void 0;
var core_1 = require("@stencil/core");
var os_1 = require("os");
var fs_1 = require("fs");
var NodeGlobals = /** @class */ (function () {
    function NodeGlobals() {
        this.tmpdir = '';
        this.fileSystem = false;
        this.glbl = false;
        this.buf = false;
        this.prcs = false;
    }
    NodeGlobals.prototype.componentWillLoad = function () {
        this.tmpdir = os_1.default.tmpdir();
        this.fileSystem = !!fs_1.default;
        this.glbl = !!global;
        this.buf = !!Buffer;
        this.prcs = !!process;
    };
    NodeGlobals.prototype.render = function () {
        return ((0, core_1.h)("section", null,
            (0, core_1.h)("div", null,
                "NODE_ENV: ",
                (0, core_1.h)("span", { id: "node_env" }, process.env.NODE_ENV)),
            (0, core_1.h)("div", null,
                "os.tmpdir(): ",
                (0, core_1.h)("span", { id: "tmpdir" }, this.tmpdir)),
            (0, core_1.h)("div", null,
                "fs: ",
                (0, core_1.h)("span", { id: "fs" }, this.fileSystem.toString())),
            (0, core_1.h)("div", null,
                "global: ",
                (0, core_1.h)("span", { id: "global" }, this.glbl.toString())),
            (0, core_1.h)("div", null,
                "Buffer: ",
                (0, core_1.h)("span", { id: "Buffer" }, this.buf.toString())),
            (0, core_1.h)("div", null,
                "process: ",
                (0, core_1.h)("span", { id: "process" }, this.prcs.toString()))));
    };
    NodeGlobals = __decorate([
        (0, core_1.Component)({
            tag: 'node-globals',
        })
    ], NodeGlobals);
    return NodeGlobals;
}());
exports.NodeGlobals = NodeGlobals;
