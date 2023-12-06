"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBanner = void 0;
function getBanner(opts, fileName, license = false) {
    return [
        `/*${license ? '!' : ''}`,
        ` ${fileName} v${opts.version} | MIT Licensed | https://stenciljs.com`,
        ` */`,
    ].join('\n');
}
exports.getBanner = getBanner;
