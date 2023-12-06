"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../utils/options");
const cli_1 = require("./cli");
const compiler_1 = require("./compiler");
const screenshot_1 = require("./screenshot");
const sys_node_1 = require("./sys-node");
// the main entry point for the Esbuild-based build
async function main() {
    const opts = (0, options_1.getOptions)(process.cwd(), {
        isProd: !!process.argv.includes('--prod'),
        isCI: !!process.argv.includes('--ci'),
        isWatch: !!process.argv.includes('--watch'),
    });
    await Promise.all([(0, cli_1.buildCli)(opts), (0, compiler_1.buildCompiler)(opts), (0, sys_node_1.buildSysNode)(opts), (0, screenshot_1.buildScreenshot)(opts)]);
}
main();
