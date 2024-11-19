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
exports.EsmImport = void 0;
var core_1 = require("@stencil/core");
var EsmImport = /** @class */ (function () {
    function EsmImport() {
        this.propVal = 0;
        this.isReady = 'false';
        this.listenVal = 0;
        this.someEventInc = 0;
    }
    EsmImport.prototype.testClick = function () {
        this.listenVal++;
    };
    EsmImport.prototype.someMethod = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.someEvent.emit();
                return [2 /*return*/];
            });
        });
    };
    EsmImport.prototype.testMethod = function () {
        this.el.someMethod();
    };
    EsmImport.prototype.componentWillLoad = function () {
        var _this = this;
        this.stateVal = 'mph';
        this.el.componentOnReady().then(function () {
            _this.isReady = 'true';
        });
    };
    EsmImport.prototype.componentDidLoad = function () {
        var _this = this;
        this.el.parentElement.addEventListener('someEvent', function () {
            _this.el.propVal++;
        });
    };
    EsmImport.prototype.render = function () {
        return ((0, core_1.h)("div", null,
            (0, core_1.h)("h1", null, "esm-import"),
            (0, core_1.h)("p", { id: "propVal" },
                "propVal: ",
                this.propVal),
            (0, core_1.h)("p", { id: "stateVal" },
                "stateVal: ",
                this.stateVal),
            (0, core_1.h)("p", { id: "listenVal" },
                "listenVal: ",
                this.listenVal),
            (0, core_1.h)("p", null,
                (0, core_1.h)("button", { onClick: this.testMethod.bind(this) }, "Test")),
            (0, core_1.h)("p", { id: "isReady" },
                "componentOnReady: ",
                this.isReady)));
    };
    __decorate([
        (0, core_1.Element)()
    ], EsmImport.prototype, "el", void 0);
    __decorate([
        (0, core_1.Prop)()
    ], EsmImport.prototype, "propVal", void 0);
    __decorate([
        (0, core_1.State)()
    ], EsmImport.prototype, "isReady", void 0);
    __decorate([
        (0, core_1.State)()
    ], EsmImport.prototype, "stateVal", void 0);
    __decorate([
        (0, core_1.State)()
    ], EsmImport.prototype, "listenVal", void 0);
    __decorate([
        (0, core_1.State)()
    ], EsmImport.prototype, "someEventInc", void 0);
    __decorate([
        (0, core_1.Event)()
    ], EsmImport.prototype, "someEvent", void 0);
    __decorate([
        (0, core_1.Listen)('click')
    ], EsmImport.prototype, "testClick", null);
    __decorate([
        (0, core_1.Method)()
    ], EsmImport.prototype, "someMethod", null);
    EsmImport = __decorate([
        (0, core_1.Component)({
            tag: 'esm-import',
            styleUrl: 'esm-import.css',
            shadow: true,
        })
    ], EsmImport);
    return EsmImport;
}());
exports.EsmImport = EsmImport;
