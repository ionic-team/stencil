"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleAsyncB = void 0;
var core_1 = require("@stencil/core");
var util_1 = require("./util");
var LifecycleAsyncB = /** @class */ (function () {
    function LifecycleAsyncB() {
        this.value = '';
        this.rendered = 0;
    }
    LifecycleAsyncB.prototype.componentWillLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lifecycleLoad.emit('componentWillLoad-b');
                return [2 /*return*/];
            });
        });
    };
    LifecycleAsyncB.prototype.componentDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lifecycleLoad.emit('componentDidLoad-b');
                return [2 /*return*/];
            });
        });
    };
    LifecycleAsyncB.prototype.componentWillUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lifecycleUpdate.emit('componentWillUpdate-b');
                        return [4 /*yield*/, (0, util_1.timeout)(100)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LifecycleAsyncB.prototype.componentDidUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lifecycleUpdate.emit('componentDidUpdate-b');
                        return [4 /*yield*/, (0, util_1.timeout)(100)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LifecycleAsyncB.prototype.render = function () {
        this.rendered++;
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("hr", null),
            (0, core_1.h)("div", null,
                "LifecycleAsyncB ",
                this.value),
            (0, core_1.h)("div", { class: "rendered-b" },
                "rendered b: ",
                this.rendered),
            (0, core_1.h)("lifecycle-async-c", { value: this.value })));
    };
    __decorate([
        (0, core_1.Prop)()
    ], LifecycleAsyncB.prototype, "value", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleAsyncB.prototype, "lifecycleLoad", void 0);
    __decorate([
        (0, core_1.Event)()
    ], LifecycleAsyncB.prototype, "lifecycleUpdate", void 0);
    LifecycleAsyncB = __decorate([
        (0, core_1.Component)({
            tag: 'lifecycle-async-b',
        })
    ], LifecycleAsyncB);
    return LifecycleAsyncB;
}());
exports.LifecycleAsyncB = LifecycleAsyncB;
