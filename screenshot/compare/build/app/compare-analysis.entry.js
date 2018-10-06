/*! Built with http://stenciljs.com */
const { h } = window.App;

import { a as updateHash, b as setMismatchedPixels, c as runFilters } from './chunk-00b307b7.js';

class CompareAnalysis {
    constructor() {
        this.mismatchedPixels = null;
        this.mismatchedRatio = null;
    }
    navToId(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        updateHash({
            diff: this.diffId
        });
    }
    render() {
        return [
            h("p", { class: "test-path" }, this.testPath),
            h("dl", null,
                h("div", null,
                    h("dt", null, "Diff"),
                    h("dd", null,
                        h("a", { href: '#diff-' + this.diffId, onClick: this.navToId.bind(this) }, this.diffId))),
                h("div", null,
                    h("dt", null, "Mismatched Pixels"),
                    h("dd", null, typeof this.mismatchedPixels === 'number' ? this.mismatchedPixels : '--')),
                h("div", null,
                    h("dt", null, "Mismatched Ratio"),
                    h("dd", null, typeof this.mismatchedRatio === 'number' ? this.mismatchedRatio.toFixed(4) : '--')),
                h("div", null,
                    h("dt", null, "Device"),
                    h("dd", null, this.device)),
                h("div", null,
                    h("dt", null, "Width"),
                    h("dd", null, this.width)),
                h("div", null,
                    h("dt", null, "Height"),
                    h("dd", null, this.height)),
                h("div", null,
                    h("dt", null, "Device Scale Factor"),
                    h("dd", null, this.deviceScaleFactor)),
                h("div", { class: "desc" },
                    h("dt", null, "Description"),
                    h("dd", null, this.desc)))
        ];
    }
    static get is() { return "compare-analysis"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
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
    }; }
    static get style() { return ".test-path {\n  margin-top: 0;\n  padding-top: 0;\n  font-size: 10px;\n  color: var(--analysis-data-color);\n}\n\ndl {\n  padding: 0;\n  margin: 0;\n  font-size: var(--analysis-data-font-size);\n  line-height: 28px;\n}\n\ndiv {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 240px;\n}\n\ndt {\n  display: inline;\n  -webkit-box-flex: 2;\n  -ms-flex: 2;\n  flex: 2;\n  font-weight: 500;\n}\n\ndd {\n  display: inline;\n  -webkit-box-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  color: var(--analysis-data-color);\n}\n\n.desc,\n.desc dt {\n  display: block;\n}\n\n.desc dd {\n  display: block;\n  margin: 0;\n  line-height: 22px;\n}\n\np {\n  padding-top: 14px;\n  font-size: var(--analysis-data-font-size);\n}\n\na {\n  color: var(--analysis-data-color);\n}\n\na:hover {\n  text-decoration: none;\n}"; }
}

var pixelmatch_1 = pixelmatch;

function pixelmatch(img1, img2, output, width, height, options) {

    if (!options) options = {};

    var threshold = options.threshold === undefined ? 0.1 : options.threshold;

    // maximum acceptable square distance between two colors;
    // 35215 is the maximum possible value for the YIQ difference metric
    var maxDelta = 35215 * threshold * threshold,
        diff = 0;

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
                    if (output) drawPixel(output, pos, 255, 255, 0);

                } else {
                    // found substantial difference not caused by anti-aliasing; draw it as red
                    if (output) drawPixel(output, pos, 255, 0, 0);
                    diff++;
                }

            } else if (output) {
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
    var x0 = Math.max(x1 - 1, 0),
        y0 = Math.max(y1 - 1, 0),
        x2 = Math.min(x1 + 1, width - 1),
        y2 = Math.min(y1 + 1, height - 1),
        pos = (y1 * width + x1) * 4,
        zeroes = 0,
        positives = 0,
        negatives = 0,
        min = 0,
        max = 0,
        minX, minY, maxX, maxY;

    // go through 8 adjacent pixels
    for (var x = x0; x <= x2; x++) {
        for (var y = y0; y <= y2; y++) {
            if (x === x1 && y === y1) continue;

            // brightness delta between the center pixel and adjacent one
            var delta = colorDelta(img, img, pos, (y * width + x) * 4, true);

            // count the number of equal, darker and brighter adjacent pixels
            if (delta === 0) zeroes++;
            else if (delta < 0) negatives++;
            else if (delta > 0) positives++;

            // if found more than 2 equal siblings, it's definitely not anti-aliasing
            if (zeroes > 2) return false;

            if (!img2) continue;

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

    if (!img2) return true;

    // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
    if (negatives === 0 || positives === 0) return false;

    // if either the darkest or the brightest pixel has more than 2 equal siblings in both images
    // (definitely not anti-aliased), this pixel is anti-aliased
    return (!antialiased(img, minX, minY, width, height) && !antialiased(img2, minX, minY, width, height)) ||
           (!antialiased(img, maxX, maxY, width, height) && !antialiased(img2, maxX, maxY, width, height));
}

// calculate color difference according to the paper "Measuring perceived color difference
// using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos

function colorDelta(img1, img2, k, m, yOnly) {
    var a1 = img1[k + 3] / 255,
        a2 = img2[m + 3] / 255,

        r1 = blend(img1[k + 0], a1),
        g1 = blend(img1[k + 1], a1),
        b1 = blend(img1[k + 2], a1),

        r2 = blend(img2[m + 0], a2),
        g2 = blend(img2[m + 1], a2),
        b2 = blend(img2[m + 2], a2),

        y = rgb2y(r1, g1, b1) - rgb2y(r2, g2, b2);

    if (yOnly) return y; // brightness difference only

    var i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2),
        q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);

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
    var a = img[i + 3] / 255,
        r = blend(img[i + 0], a),
        g = blend(img[i + 1], a),
        b = blend(img[i + 2], a);
    return rgb2y(r, g, b);
}

function getMismatch(imageA, imageB, canvasDiff, naturalWidth, naturalHeight) {
    const canvasA = document.createElement('canvas');
    canvasA.width = naturalWidth;
    canvasA.height = naturalHeight;
    const canvasB = document.createElement('canvas');
    canvasB.width = naturalWidth;
    canvasB.height = naturalHeight;
    const ctxA = canvasA.getContext('2d');
    ctxA.drawImage(imageA, 0, 0);
    const ctxB = canvasB.getContext('2d');
    ctxB.drawImage(imageB, 0, 0);
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.drawImage(imageA, 0, 0);
    ctx.getImageData(0, 0, naturalWidth, naturalHeight);
    const dataA = ctxA.getImageData(0, 0, naturalWidth, naturalHeight).data;
    const dataB = ctxB.getImageData(0, 0, naturalWidth, naturalHeight).data;
    const ctxDiff = canvasDiff.getContext('2d');
    const imageDiff = ctxDiff.createImageData(naturalWidth, canvasA.height);
    const mismatchedPixels = pixelmatch_1(dataA, dataB, imageDiff.data, naturalWidth, naturalHeight, { threshold: 0.1 });
    ctxDiff.putImageData(imageDiff, 0, 0);
    return mismatchedPixels;
}

function loadJsonpDataUri(imageId, jsonpUrl, cb) {
    if (completedImages.has(imageId)) {
        cb(completedImages.get(imageId));
        return;
    }
    if (pendingImages.has(imageId)) {
        const pendingImage = pendingImages.get(imageId);
        pendingImage.push(cb);
        return;
    }
    pendingImages.set(imageId, [cb]);
    const jsonp = document.createElement('script');
    jsonp.src = jsonpUrl;
    document.head.appendChild(jsonp);
}
window.loadScreenshot = (imageId, dataUri) => {
    const callbacks = pendingImages.get(imageId);
    if (callbacks) {
        callbacks.forEach(cb => cb(dataUri));
        pendingImages.delete(imageId);
    }
    completedImages.set(imageId, dataUri);
};
const pendingImages = new Map();
const completedImages = new Map();

class CompareRow {
    constructor() {
        this.imagesLoaded = new Set();
        this.isImageALoaded = false;
        this.isImageBLoaded = false;
        this.isCanvasLoaded = false;
        this.initialized = false;
        this.isComparing = false;
    }
    runCompare() {
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
    }
    loadImages() {
        if (this.diff.imageA != null) {
            loadJsonpDataUri(this.diff.imageA, this.diff.jsonpUrlA, dataUri => {
                this.imageA.src = dataUri;
                this.imageA.style.visibility = '';
                this.isImageALoaded = true;
            });
        }
        if (this.diff.imageB != null) {
            loadJsonpDataUri(this.diff.imageB, this.diff.jsonpUrlB, dataUri => {
                this.imageB.src = dataUri;
                this.imageB.style.visibility = '';
                this.isImageBLoaded = true;
            });
        }
    }
    async compareImages() {
        const diff = this.diff;
        if (!this.isImageALoaded || !this.isImageBLoaded || this.isComparing || this.isCanvasLoaded) {
            return;
        }
        this.isComparing = true;
        diff.mismatchedPixels = await getMismatch(this.imageA, this.imageB, this.canvas, diff.naturalWidth, diff.naturalHeight);
        this.canvas.style.visibility = '';
        this.isCanvasLoaded = true;
        diff.mismatchedRatio = (diff.mismatchedPixels / (diff.naturalWidth * diff.naturalHeight));
        if (this.analysis) {
            this.analysis.mismatchedPixels = diff.mismatchedPixels;
            this.analysis.mismatchedRatio = diff.mismatchedRatio;
        }
        setMismatchedPixels(diff.imageA, diff.imageB, diff.mismatchedPixels);
        runFilters();
    }
    render() {
        const diff = this.diff;
        const style = {
            width: diff.width + 'px',
            height: diff.height + 'px',
            visibility: this.diff.identical ? '' : 'hidden'
        };
        return [
            h("compare-cell", null,
                h("img", { src: this.diff.identical ? (this.imagesUrl + diff.imageA) : '', style: style, onLoad: this.diff.identical ? null : this.compareImages.bind(this), ref: (elm) => this.imageA = elm })),
            h("compare-cell", null,
                h("img", { src: this.diff.identical ? (this.imagesUrl + diff.imageA) : '', style: style, onLoad: this.diff.identical ? null : this.compareImages.bind(this), ref: (elm) => this.imageB = elm })),
            h("compare-cell", null, this.diff.identical ? (h("img", { style: style, src: this.imagesUrl + diff.imageA })) : (h("canvas", { width: diff.naturalWidth, height: diff.naturalHeight, style: style, ref: (elm) => this.canvas = elm }))),
            h("compare-cell", null,
                h("compare-analysis", { diffId: this.diff.id, mismatchedPixels: this.diff.mismatchedPixels, mismatchedRatio: this.diff.mismatchedRatio, device: this.diff.device, width: this.diff.width, height: this.diff.height, deviceScaleFactor: this.diff.deviceScaleFactor, desc: this.diff.desc, testPath: this.diff.testPath, ref: elm => this.analysis = elm }))
        ];
    }
    static get is() { return "compare-row"; }
    static get properties() { return {
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
    }; }
    static get style() { return "compare-row img,\ncompare-row canvas {\n  -webkit-box-shadow: var(--screenshot-box-shadow);\n  box-shadow: var(--screenshot-box-shadow);\n  border-radius: var(--screenshot-border-radius);\n}"; }
}

export { CompareAnalysis, CompareRow };
