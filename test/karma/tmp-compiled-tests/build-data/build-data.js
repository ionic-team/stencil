"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildData = void 0;
var core_1 = require("@stencil/core");
var BuildData = /** @class */ (function () {
    function BuildData() {
    }
    BuildData.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("p", { class: "is-dev" },
                "isDev: ", "".concat(core_1.Build.isDev)),
            (0, core_1.h)("p", { class: "is-browser" },
                "isBrowser: ", "".concat(core_1.Build.isBrowser)),
            (0, core_1.h)("p", { class: "is-testing" },
                "isTesting: ", "".concat(core_1.Build.isTesting))));
    };
    BuildData = __decorate([
        (0, core_1.Component)({
            tag: 'build-data',
        })
    ], BuildData);
    return BuildData;
}());
exports.BuildData = BuildData;
