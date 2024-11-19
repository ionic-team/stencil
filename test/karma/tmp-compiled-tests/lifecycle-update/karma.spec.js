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
describe('lifecycle-update', function () {
    var _this = this;
    var _a = (0, util_1.setupDomTests)(document), setupDom = _a.setupDom, tearDownDom = _a.tearDownDom;
    var app;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupDom('/lifecycle-update/index.html')];
                case 1:
                    app = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(tearDownDom);
    it('fire load methods in order', function () { return __awaiter(_this, void 0, void 0, function () {
        var loads, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loads = app.querySelectorAll('#output li');
                    expect(loads.length).toBe(2);
                    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
                    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');
                    button = app.querySelector('button');
                    button.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 1:
                    _a.sent();
                    loads = app.querySelectorAll('#output li');
                    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
                    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');
                    expect(loads[2].textContent).toBe('async add child components to lifecycle-update-a 1');
                    expect(loads[3].textContent).toBe('lifecycle-update-a componentWillUpdate 1');
                    expect(loads[4].textContent).toBe('lifecycle-update-b componentWillLoad 1');
                    expect(loads[5].textContent).toBe('lifecycle-update-c componentWillLoad 1');
                    expect(loads[6].textContent).toBe('lifecycle-update-c componentDidLoad 1');
                    expect(loads[7].textContent).toBe('lifecycle-update-b componentDidLoad 1');
                    expect(loads[8].textContent).toBe('lifecycle-update-a componentDidUpdate 1');
                    expect(loads.length).toBe(9);
                    button.click();
                    return [4 /*yield*/, (0, util_1.waitForChanges)()];
                case 2:
                    _a.sent();
                    loads = app.querySelectorAll('#output li');
                    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
                    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');
                    expect(loads[2].textContent).toBe('async add child components to lifecycle-update-a 1');
                    expect(loads[3].textContent).toBe('lifecycle-update-a componentWillUpdate 1');
                    expect(loads[4].textContent).toBe('lifecycle-update-b componentWillLoad 1');
                    expect(loads[5].textContent).toBe('lifecycle-update-c componentWillLoad 1');
                    expect(loads[6].textContent).toBe('lifecycle-update-c componentDidLoad 1');
                    expect(loads[7].textContent).toBe('lifecycle-update-b componentDidLoad 1');
                    expect(loads[8].textContent).toBe('lifecycle-update-a componentDidUpdate 1');
                    expect(loads[9].textContent).toBe('async add child components to lifecycle-update-a 2');
                    expect(loads[10].textContent).toBe('lifecycle-update-a componentWillUpdate 2');
                    expect(loads[11].textContent).toBe('lifecycle-update-b componentWillLoad 2');
                    expect(loads[12].textContent).toBe('lifecycle-update-c componentWillLoad 2');
                    expect(loads[13].textContent).toBe('lifecycle-update-c componentDidLoad 2');
                    expect(loads[14].textContent).toBe('lifecycle-update-b componentDidLoad 2');
                    expect(loads[15].textContent).toBe('lifecycle-update-a componentDidUpdate 2');
                    expect(loads.length).toBe(16);
                    return [2 /*return*/];
            }
        });
    }); });
});
