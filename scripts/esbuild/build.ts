import { getOptions } from '../utils/options';
import { buildCli } from './cli';
import { buildCompiler } from './compiler';
import { buildDevServer } from './dev-server';
import { buildInternal } from './internal';
import { buildMockDoc } from './mock-doc';
import { buildScreenshot } from './screenshot';
import { buildSysNode } from './sys-node';
import { buildTesting } from './testing';

// the main entry point for the Esbuild-based build
async function main() {
  const opts = getOptions(process.cwd(), {
    isProd: !!process.argv.includes('--prod'),
    isCI: !!process.argv.includes('--ci'),
    isWatch: !!process.argv.includes('--watch'),
  });

  await Promise.all([
    buildCli(opts),
    buildCompiler(opts),
    buildDevServer(opts),
    buildMockDoc(opts),
    buildScreenshot(opts),
    buildSysNode(opts),
    buildTesting(opts),
    buildInternal(opts),
  ]);
}

main();
