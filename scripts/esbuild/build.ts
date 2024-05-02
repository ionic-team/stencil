import * as esbuild from 'esbuild';

import { release } from '../release';
import { validateBuild } from '../test/validate-build';
import { BuildOptions, getOptions } from '../utils/options';
import { buildCli } from './cli';
import { buildCompiler } from './compiler';
import { buildDevServer } from './dev-server';
import { buildInternal } from './internal';
import { buildMockDoc } from './mock-doc';
import { buildScreenshot } from './screenshot';
import { buildSysNode } from './sys-node';
import { buildTesting } from './testing';

// the main entry point for the build
export async function run(rootDir: string, args: ReadonlyArray<string>) {
  const opts = getOptions(process.cwd(), {
    isProd: args.includes('--prod'),
    isCI: args.includes('--ci'),
    isWatch: args.includes('--watch'),
    esbuildLogLevel: 'info',
  });

  try {
    if (args.includes('--release')) {
      await release(rootDir, args);
      return;
    }

    if (args.includes('--validate-build')) {
      await validateBuild(rootDir);
      return;
    }
    await buildAll(opts);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export async function buildAll(opts: BuildOptions) {
  const builds = await Promise.all([
    buildCli(opts),
    buildCompiler(opts),
    buildDevServer(opts),
    buildMockDoc(opts),
    buildScreenshot(opts),
    buildSysNode(opts),
    buildTesting(opts),
    buildInternal(opts),
  ]);

  if (opts.esbuildLogLevel === 'silent') {
    // esbuild's own console messages were silenced, so we should instead
    // log some messages here if there were errors or warnings
    await Promise.all(
      builds.flat().map(async (buildResult) => {
        if (!buildResult) {
          return;
        }

        if (buildResult.warnings) {
          const output = await esbuild.formatMessages(buildResult.warnings, { kind: 'warning', color: true });
          console.warn(output.join('\n'));
        }
        if (buildResult.errors) {
          const output = await esbuild.formatMessages(buildResult.errors, { kind: 'error', color: true });
          console.error(output.join('\n'));
        }
      }),
    );
  }
}
