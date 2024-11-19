"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = void 0;
function timeout(ms, value) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(value); }, ms);
    });
}
exports.timeout = timeout;
