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
describe('prerender', function () {
    var _a = (0, util_1.setupDomTests)(document), setupDom = _a.setupDom, tearDownDom = _a.tearDownDom;
    var app;
    afterEach(tearDownDom);
    it('server componentWillLoad Order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var elm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/prerender/index.html', 500)];
                case 1:
                    app = _a.sent();
                    elm = app.querySelector('#server-componentWillLoad');
                    expect(elm.children[0].textContent.trim()).toBe('CmpA server componentWillLoad');
                    expect(elm.children[1].textContent.trim()).toBe('CmpD - a1-child server componentWillLoad');
                    expect(elm.children[2].textContent.trim()).toBe('CmpD - a2-child server componentWillLoad');
                    expect(elm.children[3].textContent.trim()).toBe('CmpD - a3-child server componentWillLoad');
                    expect(elm.children[4].textContent.trim()).toBe('CmpD - a4-child server componentWillLoad');
                    expect(elm.children[5].textContent.trim()).toBe('CmpB server componentWillLoad');
                    expect(elm.children[6].textContent.trim()).toBe('CmpC server componentWillLoad');
                    expect(elm.children[7].textContent.trim()).toBe('CmpD - c-child server componentWillLoad');
                    return [2 /*return*/];
            }
        });
    }); });
    it('server componentDidLoad Order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var elm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/prerender/index.html', 500)];
                case 1:
                    app = _a.sent();
                    elm = app.querySelector('#server-componentDidLoad');
                    expect(elm.children[0].textContent.trim()).toBe('CmpD - a1-child server componentDidLoad');
                    expect(elm.children[1].textContent.trim()).toBe('CmpD - a2-child server componentDidLoad');
                    expect(elm.children[2].textContent.trim()).toBe('CmpD - a3-child server componentDidLoad');
                    expect(elm.children[3].textContent.trim()).toBe('CmpD - a4-child server componentDidLoad');
                    expect(elm.children[4].textContent.trim()).toBe('CmpD - c-child server componentDidLoad');
                    expect(elm.children[5].textContent.trim()).toBe('CmpC server componentDidLoad');
                    expect(elm.children[6].textContent.trim()).toBe('CmpB server componentDidLoad');
                    expect(elm.children[7].textContent.trim()).toBe('CmpA server componentDidLoad');
                    return [2 /*return*/];
            }
        });
    }); });
    it('correct scoped styles applied after scripts kick in', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/prerender/index.html', 500)];
                case 1:
                    app = _a.sent();
                    testScopedStyles(app);
                    return [2 /*return*/];
            }
        });
    }); });
    it('no-script, correct scoped styles applied before scripts kick in', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/prerender/index-no-script.html', 500)];
                case 1:
                    app = _a.sent();
                    testScopedStyles(app);
                    return [2 /*return*/];
            }
        });
    }); });
    it('root slots', function () { return __awaiter(void 0, void 0, void 0, function () {
        var scoped, scopedStyle, shadow, shadowStyle, blueText, blueTextStyle, greenText, greenTextStyle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/prerender/index.html')];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, (0, util_1.waitForChanges)(500)];
                case 2:
                    _a.sent();
                    scoped = app.querySelector('cmp-client-scoped');
                    scopedStyle = getComputedStyle(scoped.querySelector('section'));
                    expect(scopedStyle.color).toBe('rgb(255, 0, 0)');
                    shadow = app.querySelector('cmp-client-shadow');
                    shadowStyle = getComputedStyle(shadow.shadowRoot.querySelector('article'));
                    expect(shadowStyle.color).toBe('rgb(0, 155, 0)');
                    blueText = shadow.shadowRoot.querySelector('cmp-text-blue');
                    blueTextStyle = getComputedStyle(blueText.querySelector('text-blue'));
                    expect(blueTextStyle.color).toBe('rgb(0, 0, 255)');
                    greenText = shadow.shadowRoot.querySelector('cmp-text-green');
                    greenTextStyle = getComputedStyle(greenText.querySelector('text-green'));
                    expect(greenTextStyle.color).toBe('rgb(0, 255, 0)');
                    return [2 /*return*/];
            }
        });
    }); });
});
function testScopedStyles(app) {
    var cmpScopedA = app.querySelector('cmp-scoped-a');
    var scopedAStyles = window.getComputedStyle(cmpScopedA);
    expect(scopedAStyles.backgroundColor).toBe('rgb(0, 128, 0)');
    var cmpScopedADiv = cmpScopedA.querySelector('div');
    var scopedADivStyles = window.getComputedStyle(cmpScopedADiv);
    expect(scopedADivStyles.fontSize).toBe('14px');
    var cmpScopedAP = cmpScopedA.querySelector('p');
    var scopedAPStyles = window.getComputedStyle(cmpScopedAP);
    expect(scopedAPStyles.color).toBe('rgb(128, 0, 128)');
    var cmpScopedAScopedClass = cmpScopedA.querySelector('.scoped-class');
    var scopedAScopedClassStyles = window.getComputedStyle(cmpScopedAScopedClass);
    expect(scopedAScopedClassStyles.color).toBe('rgb(0, 0, 255)');
    var cmpScopedB = app.querySelector('cmp-scoped-b');
    var scopedBStyles = window.getComputedStyle(cmpScopedB);
    expect(scopedBStyles.backgroundColor).toBe('rgb(128, 128, 128)');
    var cmpScopedBDiv = cmpScopedB.querySelector('div');
    var scopedBDivStyles = window.getComputedStyle(cmpScopedBDiv);
    expect(scopedBDivStyles.fontSize).toBe('18px');
    var cmpScopedBP = cmpScopedB.querySelector('p');
    var scopedBPStyles = window.getComputedStyle(cmpScopedBP);
    expect(scopedBPStyles.color).toBe('rgb(0, 128, 0)');
    var cmpScopedBScopedClass = cmpScopedB.querySelector('.scoped-class');
    var scopedBScopedClassStyles = window.getComputedStyle(cmpScopedBScopedClass);
    expect(scopedBScopedClassStyles.color).toBe('rgb(255, 255, 0)');
}
