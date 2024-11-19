"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var external_data_1 = require("./external-data");
function store() {
    return {
        data: (0, external_data_1.data)(),
    };
}
exports.store = store;
