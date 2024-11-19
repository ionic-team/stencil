"use strict";
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
var util_1 = require("../util");
describe('attribute-complex', function () {
    var _this = this;
    var _a = (0, util_1.setupDomTests)(document), setupDom = _a.setupDom, tearDownDom = _a.tearDownDom;
    var app;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/attribute-complex/index.html')];
                case 1:
                    app = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(tearDownDom);
    it('should cast attributes', function () { return __awaiter(_this, void 0, void 0, function () {
        var el, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    el = app.querySelector('attribute-complex');
                    el.setAttribute('nu-0', '3');
                    el.setAttribute('nu-1', '-2.3');
                    el.nu2 = '123';
                    el.setAttribute('bool-0', 'false');
                    el.setAttribute('bool-1', 'true');
                    el.setAttribute('bool-2', '');
                    el.setAttribute('str-0', 'false');
                    el.setAttribute('str-1', '123');
                    el.str2 = 321;
                    el.setAttribute('obj', 'James Pond RoboCod');
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, el.getInstance()];
                case 2:
                    instance = _a.sent();
                    expect(instance.nu0).toBe(3);
                    expect(instance.nu1).toBe(-2.3);
                    expect(instance.nu2).toBe(123);
                    expect(instance.bool0).toBe(false);
                    expect(instance.bool1).toBe(true);
                    expect(instance.bool2).toBe(true);
                    expect(instance.str0).toBe('false');
                    expect(instance.str1).toBe('123');
                    expect(instance.str2).toBe('321');
                    expect(instance.obj).toBe('{"name":"James Pond RoboCod"}');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should cast element props', function () { return __awaiter(_this, void 0, void 0, function () {
        var el, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    el = app.querySelector('attribute-complex');
                    return [4 /*yield*/, el.getInstance()];
                case 1:
                    instance = _a.sent();
                    el.nu0 = '1234';
                    el.nu1 = '-111.1';
                    el.bool0 = 'true';
                    el.bool1 = 'false';
                    el.bool2 = false;
                    el.obj = 'James Pond RoboCod';
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 2:
                    _a.sent();
                    expect(instance.nu0).toBe(1234);
                    expect(instance.nu1).toBe(-111.1);
                    expect(instance.bool0).toBe(true);
                    expect(instance.bool1).toBe(false);
                    expect(instance.bool2).toBe(false);
                    expect(instance.str0).toBe('hello'); // default value
                    expect(instance.obj).toBe('{"name":"James Pond RoboCod"}');
                    return [2 /*return*/];
            }
        });
    }); });
});
