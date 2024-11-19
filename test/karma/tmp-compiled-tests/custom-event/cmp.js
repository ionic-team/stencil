"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventCmp = void 0;
var core_1 = require("@stencil/core");
var CustomEventCmp = /** @class */ (function () {
    function CustomEventCmp() {
        this.output = '';
    }
    CustomEventCmp.prototype.componentDidLoad = function () {
        this.elm.addEventListener('eventNoDetail', this.receiveEvent.bind(this));
        this.elm.addEventListener('eventWithDetail', this.receiveEvent.bind(this));
    };
    CustomEventCmp.prototype.receiveEvent = function (ev) {
        this.output = "".concat(ev.type, " ").concat(ev.detail || '').trim();
    };
    CustomEventCmp.prototype.fireCustomEventNoDetail = function () {
        var ev = new CustomEvent('eventNoDetail');
        this.elm.dispatchEvent(ev);
    };
    CustomEventCmp.prototype.fireCustomEventWithDetail = function () {
        var ev = new CustomEvent('eventWithDetail', { detail: 88 });
        this.elm.dispatchEvent(ev);
    };
    CustomEventCmp.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("div", null,
                (0, core_1.h)("button", { id: "btnNoDetail", onClick: this.fireCustomEventNoDetail.bind(this) }, "Fire Custom Event, no detail")),
            (0, core_1.h)("div", null,
                (0, core_1.h)("button", { id: "btnWithDetail", onClick: this.fireCustomEventWithDetail.bind(this) }, "Fire Custom Event, with detail")),
            (0, core_1.h)("pre", { id: "output" }, this.output)));
    };
    __decorate([
        (0, core_1.Element)()
    ], CustomEventCmp.prototype, "elm", void 0);
    __decorate([
        (0, core_1.State)()
    ], CustomEventCmp.prototype, "output", void 0);
    CustomEventCmp = __decorate([
        (0, core_1.Component)({
            tag: 'custom-event-root',
        })
    ], CustomEventCmp);
    return CustomEventCmp;
}());
exports.CustomEventCmp = CustomEventCmp;
