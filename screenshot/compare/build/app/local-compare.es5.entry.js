/*! Built with http://stenciljs.com */
App.loadBundle('local-compare', ['exports', './chunk-4ef2fb97.js'], function (exports, __chunk_1) {
    var h = window.App.h;
    function createScreenshotDiff(a, b, imagesUrl, jsonpUrl) {
        var screenshotDiffs = a.screenshots.map(function (screenshotA) {
            var diff = {
                id: screenshotA.id,
                desc: screenshotA.desc,
                testPath: screenshotA.testPath,
                imageA: screenshotA.image,
                imageUrlA: "" + imagesUrl + screenshotA.image,
                jsonpUrlA: jsonpUrl + "screenshot_" + screenshotA.image + ".js",
                imageB: null,
                imageUrlB: null,
                jsonpUrlB: null,
                imageDiff: null,
                identical: false,
                mismatchedPixels: null,
                mismatchedRatio: null,
                width: screenshotA.width,
                height: screenshotA.height,
                deviceScaleFactor: screenshotA.deviceScaleFactor,
                naturalWidth: screenshotA.naturalWidth,
                naturalHeight: screenshotA.naturalHeight,
                device: screenshotA.device || screenshotA.userAgent
            };
            return diff;
        });
        b.screenshots.forEach(function (screenshotB) {
            var diff = screenshotDiffs.find(function (s) { return s.id === screenshotB.id; });
            if (diff) {
                diff.imageB = screenshotB.image;
                diff.imageUrlB = "" + imagesUrl + screenshotB.image;
                diff.jsonpUrlB = jsonpUrl + "screenshot_" + screenshotB.image + ".js";
            }
            else {
                diff = {
                    id: screenshotB.id,
                    desc: screenshotB.desc,
                    testPath: screenshotB.testPath,
                    imageA: null,
                    imageUrlA: null,
                    jsonpUrlA: null,
                    imageB: screenshotB.image,
                    imageUrlB: "" + imagesUrl + screenshotB.image,
                    jsonpUrlB: jsonpUrl + "screenshot_" + screenshotB.image + ".js",
                    imageDiff: null,
                    identical: false,
                    mismatchedPixels: null,
                    mismatchedRatio: null,
                    width: screenshotB.width,
                    height: screenshotB.height,
                    deviceScaleFactor: screenshotB.deviceScaleFactor,
                    naturalWidth: screenshotB.naturalWidth,
                    naturalHeight: screenshotB.naturalHeight,
                    device: screenshotB.device || screenshotB.userAgent
                };
                screenshotDiffs.push(diff);
            }
        });
        screenshotDiffs.forEach(function (diff) {
            diff.identical = (diff.imageUrlA === diff.imageUrlB);
            if (diff.identical) {
                diff.mismatchedPixels = 0;
                diff.mismatchedRatio = 0;
                return;
            }
            var cachedMismatchedPixels = __chunk_1.getMismatchedPixels(diff.imageA, diff.imageB);
            if (typeof cachedMismatchedPixels === 'number') {
                diff.mismatchedPixels = cachedMismatchedPixels;
                diff.mismatchedRatio = (diff.mismatchedPixels / (diff.naturalWidth * diff.naturalHeight));
                if (diff.mismatchedPixels === 0) {
                    diff.identical = true;
                    return;
                }
            }
        });
        return screenshotDiffs;
    }
    var LocalCompare = /** @class */ (function () {
        function LocalCompare() {
            this.diffs = [];
        }
        LocalCompare.prototype.componentWillLoad = function () {
            this.diffs = createScreenshotDiff(this.a, this.b, this.imagesUrl, this.jsonpUrl);
        };
        LocalCompare.prototype.componentDidLoad = function () {
            __chunk_1.runFilters();
        };
        LocalCompare.prototype.render = function () {
            var _this = this;
            return [
                h("compare-header", { appSrcUrl: this.appSrcUrl }),
                h("main", { class: "scroll-view" }, h("compare-table", null, h("compare-thead", null, h("compare-header-row", null, h("compare-cell", null, this.a.message), h("compare-cell", null, this.b.message), h("compare-cell", null, "Diff"), h("compare-cell", null, "Analysis"))), h("compare-tbody", null, this.diffs.map(function (diff) {
                    return (h("compare-row", { hidden: true, id: 'd-' + diff.id, imagesUrl: _this.imagesUrl, diff: diff }));
                }))))
            ];
        };
        Object.defineProperty(LocalCompare, "is", {
            get: function () { return "local-compare"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LocalCompare, "properties", {
            get: function () {
                return {
                    "a": {
                        "type": "Any",
                        "attr": "a"
                    },
                    "appSrcUrl": {
                        "type": String,
                        "attr": "app-src-url"
                    },
                    "b": {
                        "type": "Any",
                        "attr": "b"
                    },
                    "imagesUrl": {
                        "type": String,
                        "attr": "images-url"
                    },
                    "jsonpUrl": {
                        "type": String,
                        "attr": "jsonp-url"
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        return LocalCompare;
    }());
    exports.LocalCompare = LocalCompare;
    Object.defineProperty(exports, '__esModule', { value: true });
});
