"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@stencil/core");
require("@test-sibling");
var globalScript = function () {
    Context['myService'] = 12;
    (0, core_1.setMode)(function (elm) {
        return elm.colormode || elm.getAttribute('colormode') || window.KarmaMode;
    });
};
exports.default = globalScript;
