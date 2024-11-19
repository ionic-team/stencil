"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonBasic = void 0;
var core_1 = require("@stencil/core");
var data_json_1 = require("./data.json");
var JsonBasic = /** @class */ (function () {
    function JsonBasic() {
    }
    JsonBasic.prototype.render = function () {
        return (0, core_1.h)("div", { id: "json-foo" }, data_json_1.foo);
    };
    JsonBasic = __decorate([
        (0, core_1.Component)({
            tag: 'json-basic',
        })
    ], JsonBasic);
    return JsonBasic;
}());
exports.JsonBasic = JsonBasic;
