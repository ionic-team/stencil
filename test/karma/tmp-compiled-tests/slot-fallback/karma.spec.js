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
describe('slot-fallback', function () {
    var _a = (0, util_1.setupDomTests)(document), setupDom = _a.setupDom, tearDownDom = _a.tearDownDom;
    var app;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/slot-fallback/index.html')];
                case 1:
                    app = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(tearDownDom);
    it('renders fallback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, buttonChangeFallbackContent, buttonChangeLightDom, buttonChangeSlotContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buttonChangeFallbackContent = app.querySelector('button.change-fallback-content');
                    buttonChangeLightDom = app.querySelector('button.change-light-dom');
                    buttonChangeSlotContent = app.querySelector('button.change-slot-content');
                    // show fallback content
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot start fallback 0slot default fallback 0slot end fallback 0');
                    result = app.querySelector('.results1 section');
                    expect(result.textContent).toBe('slot default fallback 0');
                    result = app.querySelector('.results1 article span');
                    expect(result.textContent).toBe('slot end fallback 0');
                    // update fallback content
                    buttonChangeFallbackContent.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 1:
                    _a.sent();
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot start fallback 1slot default fallback 1slot end fallback 1');
                    result = app.querySelector('.results1 section');
                    expect(result.textContent).toBe('slot default fallback 1');
                    result = app.querySelector('.results1 article span');
                    expect(result.textContent).toBe('slot end fallback 1');
                    // set light dom instead and hide fallback content
                    buttonChangeLightDom.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 2:
                    _a.sent();
                    // light dom content rendered
                    result = app.querySelector('.results1 content-start[slot="start"]');
                    expect(result.textContent).toBe('slot light dom 0 : start');
                    result = app.querySelector('.results1 section content-default');
                    expect(result.textContent).toBe('slot light dom 0 : default');
                    result = app.querySelector('.results1 article span content-end');
                    expect(result.textContent).toBe('slot light dom 0 : end');
                    buttonChangeFallbackContent.click();
                    buttonChangeSlotContent.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 3:
                    _a.sent();
                    // fallback content is removed. Light dom is updated
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot light dom 1 : startslot light dom 1 : defaultslot light dom 1 : end');
                    result = app.querySelector('.results1 content-start[slot="start"]');
                    expect(result.textContent).toBe('slot light dom 1 : start');
                    result = app.querySelector('.results1 section');
                    expect(result.textContent).toBe('slot light dom 1 : default');
                    result = app.querySelector('.results1 article span');
                    expect(result.textContent).toBe('slot light dom 1 : end');
                    // change back to fallback content
                    buttonChangeLightDom.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 4:
                    _a.sent();
                    // fallback content should not be hidden
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot start fallback 2slot default fallback 2slot end fallback 2');
                    result = app.querySelector('.results1 section');
                    expect(result.textContent).toBe('slot default fallback 2');
                    result = app.querySelector('.results1 article span');
                    expect(result.textContent).toBe('slot end fallback 2');
                    // light dom content should not exist
                    result = app.querySelector('.results1 content-start[slot="start"]');
                    expect(result).toBe(null);
                    result = app.querySelector('.results1 section content-default');
                    expect(result).toBe(null);
                    result = app.querySelector('.results1 article span content-end');
                    expect(result).toBe(null);
                    // update content
                    buttonChangeFallbackContent.click();
                    buttonChangeSlotContent.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 5:
                    _a.sent();
                    // fallback content should not be hidden
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot start fallback 3slot default fallback 3slot end fallback 3');
                    result = app.querySelector('.results1 section');
                    expect(result.textContent).toBe('slot default fallback 3');
                    result = app.querySelector('.results1 article span');
                    expect(result.textContent).toBe('slot end fallback 3');
                    // light dom content should not exist
                    result = app.querySelector('.results1 content-start[slot="start"]');
                    expect(result).toBe(null);
                    result = app.querySelector('.results1 section content-default');
                    expect(result).toBe(null);
                    result = app.querySelector('.results1 article span content-end');
                    expect(result).toBe(null);
                    // change back to showing slot content
                    buttonChangeLightDom.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 6:
                    _a.sent();
                    // fallback content is removed. Light dom is updated
                    result = app.querySelector('.results1 div');
                    expect(result.textContent).toBe('slot light dom 2 : startslot light dom 2 : defaultslot light dom 2 : end');
                    result = app.querySelector('.results1 content-start[slot="start"]');
                    expect(result.textContent).toBe('slot light dom 2 : start');
                    result = app.querySelector('.results1 section content-default');
                    expect(result.textContent).toBe('slot light dom 2 : default');
                    result = app.querySelector('.results1 article span content-end');
                    expect(result.textContent).toBe('slot light dom 2 : end');
                    return [2 /*return*/];
            }
        });
    }); });
});
