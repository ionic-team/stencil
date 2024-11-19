"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCustomType = void 0;
var core_1 = require("@stencil/core");
var EventCustomType = /** @class */ (function () {
    function EventCustomType() {
        this.counter = 0;
    }
    EventCustomType.prototype.testEventHandler = function (newValue) {
        this.counter++;
        this.lastEventValue = newValue.detail;
    };
    EventCustomType.prototype.componentDidLoad = function () {
        this.testEvent.emit({
            value: 'Test value',
        });
    };
    EventCustomType.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("p", null, "testEvent is emitted on componentDidLoad"),
            (0, core_1.h)("div", null,
                (0, core_1.h)("p", null,
                    "Emission count: ",
                    (0, core_1.h)("span", { id: "counter" }, this.counter)),
                (0, core_1.h)("p", null,
                    "Last emitted value: ",
                    (0, core_1.h)("span", { id: "lastValue" }, JSON.stringify(this.lastEventValue))))));
    };
    __decorate([
        (0, core_1.Event)()
    ], EventCustomType.prototype, "testEvent", void 0);
    __decorate([
        (0, core_1.State)()
    ], EventCustomType.prototype, "counter", void 0);
    __decorate([
        (0, core_1.State)()
    ], EventCustomType.prototype, "lastEventValue", void 0);
    __decorate([
        (0, core_1.Listen)('testEvent')
    ], EventCustomType.prototype, "testEventHandler", null);
    EventCustomType = __decorate([
        (0, core_1.Component)({
            tag: 'event-custom-type',
        })
    ], EventCustomType);
    return EventCustomType;
}());
exports.EventCustomType = EventCustomType;
