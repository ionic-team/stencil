"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHost = void 0;
var core_1 = require("@stencil/core");
var AttributeHost = /** @class */ (function () {
    function AttributeHost() {
        this.attrsAdded = false;
    }
    AttributeHost.prototype.testClick = function () {
        this.attrsAdded = !this.attrsAdded;
    };
    AttributeHost.prototype.render = function () {
        var propsToRender = {};
        if (this.attrsAdded) {
            propsToRender.color = 'lime';
            propsToRender.content = 'attributes added';
            propsToRender.padding = true;
            propsToRender.margin = '';
            propsToRender.bold = 'true';
            propsToRender['no-attr'] = null;
        }
        else {
            propsToRender.content = 'attributes removed';
            propsToRender.padding = false;
            propsToRender.bold = 'false';
            propsToRender['no-attr'] = null;
        }
        return [
            (0, core_1.h)("button", { onClick: this.testClick.bind(this) },
                this.attrsAdded ? 'Remove' : 'Add',
                " Attributes"),
            (0, core_1.h)("section", __assign({}, propsToRender, { style: {
                    'border-color': this.attrsAdded ? 'black' : '',
                    display: this.attrsAdded ? 'block' : 'inline-block',
                    fontSize: this.attrsAdded ? '24px' : '',
                    '--css-var': this.attrsAdded ? '12' : '',
                } })),
        ];
    };
    __decorate([
        (0, core_1.State)()
    ], AttributeHost.prototype, "attrsAdded", void 0);
    AttributeHost = __decorate([
        (0, core_1.Component)({
            tag: 'attribute-host',
            styles: "\n    [color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }\n  ",
        })
    ], AttributeHost);
    return AttributeHost;
}());
exports.AttributeHost = AttributeHost;
