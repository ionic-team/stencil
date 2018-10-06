var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
/*! Built with http://stenciljs.com */
App.loadBundle('compare-analysis', ['exports', './chunk-4ef2fb97.js'], function (exports, __chunk_1) {
    var h = window.App.h;
    var CompareAnalysis = /** @class */ (function () {
        function CompareAnalysis() {
            this.mismatchedPixels = null;
            this.mismatchedRatio = null;
        }
        CompareAnalysis.prototype.navToId = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            __chunk_1.updateHash({
                diff: this.diffId
            });
        };
        CompareAnalysis.prototype.render = function () {
            return [
                h("p", { class: "test-path" }, this.testPath),
                h("dl", null, h("div", null, h("dt", null, "Diff"), h("dd", null, h("a", { href: '#diff-' + this.diffId, onClick: this.navToId.bind(this) }, this.diffId))), h("div", null, h("dt", null, "Mismatched Pixels"), h("dd", null, typeof this.mismatchedPixels === 'number' ? this.mismatchedPixels : '--')), h("div", null, h("dt", null, "Mismatched Ratio"), h("dd", null, typeof this.mismatchedRatio === 'number' ? this.mismatchedRatio.toFixed(4) : '--')), h("div", null, h("dt", null, "Device"), h("dd", null, this.device)), h("div", null, h("dt", null, "Width"), h("dd", null, this.width)), h("div", null, h("dt", null, "Height"), h("dd", null, this.height)), h("div", null, h("dt", null, "Device Scale Factor"), h("dd", null, this.deviceScaleFactor)), h("div", { class: "desc" }, h("dt", null, "Description"), h("dd", null, this.desc)))
            ];
        };
        Object.defineProperty(CompareAnalysis, "is", {
            get: function () { return "compare-analysis"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareAnalysis, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareAnalysis, "properties", {
            get: function () {
                return {
                    "desc": {
                        "type": String,
                        "attr": "desc"
                    },
                    "device": {
                        "type": String,
                        "attr": "device"
                    },
                    "deviceScaleFactor": {
                        "type": Number,
                        "attr": "device-scale-factor"
                    },
                    "diffId": {
                        "type": String,
                        "attr": "diff-id"
                    },
                    "height": {
                        "type": Number,
                        "attr": "height"
                    },
                    "mismatchedPixels": {
                        "type": Number,
                        "attr": "mismatched-pixels"
                    },
                    "mismatchedRatio": {
                        "type": Number,
                        "attr": "mismatched-ratio"
                    },
                    "testPath": {
                        "type": String,
                        "attr": "test-path"
                    },
                    "width": {
                        "type": Number,
                        "attr": "width"
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareAnalysis, "style", {
            get: function () { return ".test-path {\n  margin-top: 0;\n  padding-top: 0;\n  font-size: 10px;\n  color: var(--analysis-data-color);\n}\n\ndl {\n  padding: 0;\n  margin: 0;\n  font-size: var(--analysis-data-font-size);\n  line-height: 28px;\n}\n\ndiv {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 240px;\n}\n\ndt {\n  display: inline;\n  -webkit-box-flex: 2;\n  -ms-flex: 2;\n  flex: 2;\n  font-weight: 500;\n}\n\ndd {\n  display: inline;\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  color: var(--analysis-data-color);\n}\n\n.desc,\n.desc dt {\n  display: block;\n}\n\n.desc dd {\n  display: block;\n  margin: 0;\n  line-height: 22px;\n}\n\np {\n  padding-top: 14px;\n  font-size: var(--analysis-data-font-size);\n}\n\na {\n  color: var(--analysis-data-color);\n}\n\na:hover {\n  text-decoration: none;\n}"; },
            enumerable: true,
            configurable: true
        });
        return CompareAnalysis;
    }());
    var pixelmatch_1 = pixelmatch;
    function pixelmatch(img1, img2, output, width, height, options) {
        if (!options)
            options = {};
        var threshold = options.threshold === undefined ? 0.1 : options.threshold;
        // maximum acceptable square distance between two colors;
        // 35215 is the maximum possible value for the YIQ difference metric
        var maxDelta = 35215 * threshold * threshold, diff = 0;
        // compare each pixel of one image against the other one
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var pos = (y * width + x) * 4;
                // squared YUV distance between colors at this pixel position
                var delta = colorDelta(img1, img2, pos, pos);
                // the color difference is above the threshold
                if (delta > maxDelta) {
                    // check it's a real rendering difference or just anti-aliasing
                    if (!options.includeAA && (antialiased(img1, x, y, width, height, img2) ||
                        antialiased(img2, x, y, width, height, img1))) {
                        // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
                        if (output)
                            drawPixel(output, pos, 255, 255, 0);
                    }
                    else {
                        // found substantial difference not caused by anti-aliasing; draw it as red
                        if (output)
                            drawPixel(output, pos, 255, 0, 0);
                        diff++;
                    }
                }
                else if (output) {
                    // pixels are similar; draw background as grayscale image blended with white
                    var val = blend(grayPixel(img1, pos), 0.1);
                    drawPixel(output, pos, val, val, val);
                }
            }
        }
        // return the number of different pixels
        return diff;
    }
    // check if a pixel is likely a part of anti-aliasing;
    // based on "Anti-aliased Pixel and Intensity Slope Detector" paper by V. Vysniauskas, 2009
    function antialiased(img, x1, y1, width, height, img2) {
        var x0 = Math.max(x1 - 1, 0), y0 = Math.max(y1 - 1, 0), x2 = Math.min(x1 + 1, width - 1), y2 = Math.min(y1 + 1, height - 1), pos = (y1 * width + x1) * 4, zeroes = 0, positives = 0, negatives = 0, min = 0, max = 0, minX, minY, maxX, maxY;
        // go through 8 adjacent pixels
        for (var x = x0; x <= x2; x++) {
            for (var y = y0; y <= y2; y++) {
                if (x === x1 && y === y1)
                    continue;
                // brightness delta between the center pixel and adjacent one
                var delta = colorDelta(img, img, pos, (y * width + x) * 4, true);
                // count the number of equal, darker and brighter adjacent pixels
                if (delta === 0)
                    zeroes++;
                else if (delta < 0)
                    negatives++;
                else if (delta > 0)
                    positives++;
                // if found more than 2 equal siblings, it's definitely not anti-aliasing
                if (zeroes > 2)
                    return false;
                if (!img2)
                    continue;
                // remember the darkest pixel
                if (delta < min) {
                    min = delta;
                    minX = x;
                    minY = y;
                }
                // remember the brightest pixel
                if (delta > max) {
                    max = delta;
                    maxX = x;
                    maxY = y;
                }
            }
        }
        if (!img2)
            return true;
        // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
        if (negatives === 0 || positives === 0)
            return false;
        // if either the darkest or the brightest pixel has more than 2 equal siblings in both images
        // (definitely not anti-aliased), this pixel is anti-aliased
        return (!antialiased(img, minX, minY, width, height) && !antialiased(img2, minX, minY, width, height)) ||
            (!antialiased(img, maxX, maxY, width, height) && !antialiased(img2, maxX, maxY, width, height));
    }
    // calculate color difference according to the paper "Measuring perceived color difference
    // using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos
    function colorDelta(img1, img2, k, m, yOnly) {
        var a1 = img1[k + 3] / 255, a2 = img2[m + 3] / 255, r1 = blend(img1[k + 0], a1), g1 = blend(img1[k + 1], a1), b1 = blend(img1[k + 2], a1), r2 = blend(img2[m + 0], a2), g2 = blend(img2[m + 1], a2), b2 = blend(img2[m + 2], a2), y = rgb2y(r1, g1, b1) - rgb2y(r2, g2, b2);
        if (yOnly)
            return y; // brightness difference only
        var i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2), q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);
        return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
    }
    function rgb2y(r, g, b) { return r * 0.29889531 + g * 0.58662247 + b * 0.11448223; }
    function rgb2i(r, g, b) { return r * 0.59597799 - g * 0.27417610 - b * 0.32180189; }
    function rgb2q(r, g, b) { return r * 0.21147017 - g * 0.52261711 + b * 0.31114694; }
    // blend semi-transparent color with white
    function blend(c, a) {
        return 255 + (c - 255) * a;
    }
    function drawPixel(output, pos, r, g, b) {
        output[pos + 0] = r;
        output[pos + 1] = g;
        output[pos + 2] = b;
        output[pos + 3] = 255;
    }
    function grayPixel(img, i) {
        var a = img[i + 3] / 255, r = blend(img[i + 0], a), g = blend(img[i + 1], a), b = blend(img[i + 2], a);
        return rgb2y(r, g, b);
    }
    function getMismatch(imageA, imageB, canvasDiff, naturalWidth, naturalHeight) {
        var canvasA = document.createElement('canvas');
        canvasA.width = naturalWidth;
        canvasA.height = naturalHeight;
        var canvasB = document.createElement('canvas');
        canvasB.width = naturalWidth;
        canvasB.height = naturalHeight;
        var ctxA = canvasA.getContext('2d');
        ctxA.drawImage(imageA, 0, 0);
        var ctxB = canvasB.getContext('2d');
        ctxB.drawImage(imageB, 0, 0);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        ctx.drawImage(imageA, 0, 0);
        ctx.getImageData(0, 0, naturalWidth, naturalHeight);
        var dataA = ctxA.getImageData(0, 0, naturalWidth, naturalHeight).data;
        var dataB = ctxB.getImageData(0, 0, naturalWidth, naturalHeight).data;
        var ctxDiff = canvasDiff.getContext('2d');
        var imageDiff = ctxDiff.createImageData(naturalWidth, canvasA.height);
        var mismatchedPixels = pixelmatch_1(dataA, dataB, imageDiff.data, naturalWidth, naturalHeight, { threshold: 0.1 });
        ctxDiff.putImageData(imageDiff, 0, 0);
        return mismatchedPixels;
    }
    function loadJsonpDataUri(imageId, jsonpUrl, cb) {
        if (completedImages.has(imageId)) {
            cb(completedImages.get(imageId));
            return;
        }
        if (pendingImages.has(imageId)) {
            var pendingImage = pendingImages.get(imageId);
            pendingImage.push(cb);
            return;
        }
        pendingImages.set(imageId, [cb]);
        var jsonp = document.createElement('script');
        jsonp.src = jsonpUrl;
        document.head.appendChild(jsonp);
    }
    window.loadScreenshot = function (imageId, dataUri) {
        var callbacks = pendingImages.get(imageId);
        if (callbacks) {
            callbacks.forEach(function (cb) { return cb(dataUri); });
            pendingImages.delete(imageId);
        }
        completedImages.set(imageId, dataUri);
    };
    var pendingImages = new Map();
    var completedImages = new Map();
    var CompareRow = /** @class */ (function () {
        function CompareRow() {
            this.imagesLoaded = new Set();
            this.isImageALoaded = false;
            this.isImageBLoaded = false;
            this.isCanvasLoaded = false;
            this.initialized = false;
            this.isComparing = false;
        }
        CompareRow.prototype.runCompare = function () {
            if (this.diff.identical || this.initialized) {
                return;
            }
            this.initialized = true;
            if (window.requestIdleCallback) {
                window.requestIdleCallback(this.loadImages.bind(this));
            }
            else {
                window.requestAnimationFrame(this.loadImages.bind(this));
            }
        };
        CompareRow.prototype.loadImages = function () {
            var _this = this;
            if (this.diff.imageA != null) {
                loadJsonpDataUri(this.diff.imageA, this.diff.jsonpUrlA, function (dataUri) {
                    _this.imageA.src = dataUri;
                    _this.imageA.style.visibility = '';
                    _this.isImageALoaded = true;
                });
            }
            if (this.diff.imageB != null) {
                loadJsonpDataUri(this.diff.imageB, this.diff.jsonpUrlB, function (dataUri) {
                    _this.imageB.src = dataUri;
                    _this.imageB.style.visibility = '';
                    _this.isImageBLoaded = true;
                });
            }
        };
        CompareRow.prototype.compareImages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var diff, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            diff = this.diff;
                            if (!this.isImageALoaded || !this.isImageBLoaded || this.isComparing || this.isCanvasLoaded) {
                                return [2 /*return*/];
                            }
                            this.isComparing = true;
                            _a = diff;
                            return [4 /*yield*/, getMismatch(this.imageA, this.imageB, this.canvas, diff.naturalWidth, diff.naturalHeight)];
                        case 1:
                            _a.mismatchedPixels = _b.sent();
                            this.canvas.style.visibility = '';
                            this.isCanvasLoaded = true;
                            diff.mismatchedRatio = (diff.mismatchedPixels / (diff.naturalWidth * diff.naturalHeight));
                            if (this.analysis) {
                                this.analysis.mismatchedPixels = diff.mismatchedPixels;
                                this.analysis.mismatchedRatio = diff.mismatchedRatio;
                            }
                            __chunk_1.setMismatchedPixels(diff.imageA, diff.imageB, diff.mismatchedPixels);
                            __chunk_1.runFilters();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareRow.prototype.render = function () {
            var _this = this;
            var diff = this.diff;
            var style = {
                width: diff.width + 'px',
                height: diff.height + 'px',
                visibility: this.diff.identical ? '' : 'hidden'
            };
            return [
                h("compare-cell", null, h("img", { src: this.diff.identical ? (this.imagesUrl + diff.imageA) : '', style: style, onLoad: this.diff.identical ? null : this.compareImages.bind(this), ref: function (elm) { return _this.imageA = elm; } })),
                h("compare-cell", null, h("img", { src: this.diff.identical ? (this.imagesUrl + diff.imageA) : '', style: style, onLoad: this.diff.identical ? null : this.compareImages.bind(this), ref: function (elm) { return _this.imageB = elm; } })),
                h("compare-cell", null, this.diff.identical ? (h("img", { style: style, src: this.imagesUrl + diff.imageA })) : (h("canvas", { width: diff.naturalWidth, height: diff.naturalHeight, style: style, ref: function (elm) { return _this.canvas = elm; } }))),
                h("compare-cell", null, h("compare-analysis", { diffId: this.diff.id, mismatchedPixels: this.diff.mismatchedPixels, mismatchedRatio: this.diff.mismatchedRatio, device: this.diff.device, width: this.diff.width, height: this.diff.height, deviceScaleFactor: this.diff.deviceScaleFactor, desc: this.diff.desc, testPath: this.diff.testPath, ref: function (elm) { return _this.analysis = elm; } }))
            ];
        };
        Object.defineProperty(CompareRow, "is", {
            get: function () { return "compare-row"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareRow, "properties", {
            get: function () {
                return {
                    "diff": {
                        "type": "Any",
                        "attr": "diff"
                    },
                    "elm": {
                        "elementRef": true
                    },
                    "imagesUrl": {
                        "type": String,
                        "attr": "images-url"
                    },
                    "runCompare": {
                        "method": true
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompareRow, "style", {
            get: function () { return "compare-row img,\ncompare-row canvas {\n  -webkit-box-shadow: var(--screenshot-box-shadow);\n  box-shadow: var(--screenshot-box-shadow);\n  border-radius: var(--screenshot-border-radius);\n}"; },
            enumerable: true,
            configurable: true
        });
        return CompareRow;
    }());
    exports.CompareAnalysis = CompareAnalysis;
    exports.CompareRow = CompareRow;
    Object.defineProperty(exports, '__esModule', { value: true });
});
