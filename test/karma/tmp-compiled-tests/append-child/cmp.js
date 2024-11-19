"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendChild = void 0;
var core_1 = require("@stencil/core");
var AppendChild = /** @class */ (function () {
    function AppendChild() {
    }
    AppendChild.prototype.render = function () {
        return ((0, core_1.h)(core_1.Host, null,
            (0, core_1.h)("h1", null,
                "H1 Top",
                (0, core_1.h)("slot", { name: "h1" }),
                (0, core_1.h)("div", null, "H1 Bottom")),
            (0, core_1.h)("article", null,
                "Default Top",
                (0, core_1.h)("slot", null),
                "Default Bottom"),
            (0, core_1.h)("h6", null,
                (0, core_1.h)("section", null,
                    "H6 Top",
                    (0, core_1.h)("slot", { name: "h6" }),
                    (0, core_1.h)("div", null, "H6 Bottom")))));
    };
    AppendChild = __decorate([
        (0, core_1.Component)({
            tag: 'append-child',
            styles: "\n    h1 {\n      color: red;\n      font-weight: bold;\n    }\n    article {\n      color: green;\n      font-weight: bold;\n    }\n    section {\n      color: blue;\n      font-weight: bold;\n    }\n  ",
            scoped: true,
        })
    ], AppendChild);
    return AppendChild;
}());
exports.AppendChild = AppendChild;
