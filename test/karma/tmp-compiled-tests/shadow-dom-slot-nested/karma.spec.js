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
describe('shadow-dom-slot-nested', function () {
    var _a = (0, util_1.setupDomTests)(document), setupDom = _a.setupDom, tearDownDom = _a.tearDownDom;
    var app;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/shadow-dom-slot-nested/index.html')];
                case 1:
                    app = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(tearDownDom);
    it('renders children', function () { return __awaiter(void 0, void 0, void 0, function () {
        var elm, section, article_1, testShadowNested, section, article_2, testSlotPolyfillNested;
        return __generator(this, function (_a) {
            elm = app.querySelector('main');
            expect(window.getComputedStyle(elm).color).toBe('rgb(0, 0, 255)');
            elm = app.querySelector('shadow-dom-slot-nested-root');
            expect(elm.shadowRoot).toBeDefined();
            if ('attachShadow' in HTMLElement.prototype) {
                expect(elm.shadowRoot.nodeType).toBe(11);
                section = elm.shadowRoot.querySelector('section');
                expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');
                article_1 = elm.shadowRoot.querySelector('article');
                expect(window.getComputedStyle(article_1).color).toBe('rgb(0, 128, 0)');
                expect(article_1.children.length).toBe(3);
                testShadowNested = function (i) {
                    var nestedElm = article_1.children[i];
                    var shadowRoot = nestedElm.shadowRoot;
                    var header = shadowRoot.querySelector('header');
                    expect(header.textContent.trim()).toBe('shadow dom: ' + i);
                    expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');
                    var footer = shadowRoot.querySelector('footer');
                    var footerSlot = footer.firstElementChild;
                    expect(footerSlot.nodeName.toLowerCase()).toBe('slot');
                    expect(footerSlot.childNodes.length).toBe(0);
                    expect(footerSlot.textContent.trim()).toBe('');
                    expect(nestedElm.textContent.trim()).toBe('light dom: ' + i);
                    expect(window.getComputedStyle(nestedElm).color).toBe('rgb(0, 128, 0)');
                };
                testShadowNested(0);
                testShadowNested(1);
                testShadowNested(2);
            }
            else {
                expect(elm.shadowRoot).toBe(elm);
                expect(elm.classList.contains('sc-shadow-dom-slot-nested-root-h')).toBe(true);
                section = elm.querySelector('section');
                expect(section.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
                expect(section.textContent.trim()).toBe('shadow-dom-slot-nested');
                expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');
                article_2 = elm.querySelector('article');
                expect(article_2.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
                expect(window.getComputedStyle(article_2).color).toBe('rgb(0, 128, 0)');
                expect(article_2.children.length).toBe(3);
                testSlotPolyfillNested = function (i) {
                    var nestedElm = article_2.children[i];
                    expect(nestedElm.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
                    expect(nestedElm.classList.contains('sc-shadow-dom-slot-nested-h')).toBe(true);
                    var header = nestedElm.querySelector('header');
                    expect(header.classList.contains('sc-shadow-dom-slot-nested')).toBe(true);
                    expect(header.classList.contains('sc-shadow-dom-slot-nested-s')).toBe(false);
                    expect(header.textContent.trim()).toBe('shadow dom: ' + i);
                    expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');
                    var footer = nestedElm.querySelector('footer');
                    expect(footer.classList.contains('sc-shadow-dom-slot-nested')).toBe(true);
                    expect(footer.classList.contains('sc-shadow-dom-slot-nested-s')).toBe(true);
                    expect(footer.textContent.trim()).toBe('light dom: ' + i);
                    expect(window.getComputedStyle(footer).color).toBe('rgb(0, 128, 0)');
                };
                testSlotPolyfillNested(0);
                testSlotPolyfillNested(1);
                testSlotPolyfillNested(2);
            }
            return [2 /*return*/];
        });
    }); });
});
