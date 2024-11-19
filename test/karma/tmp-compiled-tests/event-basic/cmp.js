"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBasic = void 0;
var core_1 = require("@stencil/core");
var EventBasic = /** @class */ (function () {
    function EventBasic() {
        this.counter = 0;
    }
    EventBasic.prototype.testEventHandler = function () {
        this.counter++;
    };
    EventBasic.prototype.componentDidLoad = function () {
        this.testEvent.emit();
    };
    EventBasic.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("p", null, "testEvent is emitted on componentDidLoad"),
            (0, core_1.h)("div", null,
                (0, core_1.h)("p", null,
                    "Emission count: ",
                    (0, core_1.h)("span", { id: "counter" }, this.counter)))));
    };
    __decorate([
        (0, core_1.Event)()
    ], EventBasic.prototype, "testEvent", void 0);
    __decorate([
        (0, core_1.State)()
    ], EventBasic.prototype, "counter", void 0);
    __decorate([
        (0, core_1.Listen)('testEvent')
    ], EventBasic.prototype, "testEventHandler", null);
    EventBasic = __decorate([
        (0, core_1.Component)({
            tag: 'event-basic',
        })
    ], EventBasic);
    return EventBasic;
}());
exports.EventBasic = EventBasic;
