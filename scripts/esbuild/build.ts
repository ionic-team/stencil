import { getOptions } from '../utils/options';
import { buildCli } from './cli';

// the main entry point for the Esbuild-based build
async function main() {
  const opts = getOptions(process.cwd(), {
    isProd: !!process.argv.includes('--prod'),
    isCI: !!process.argv.includes('--ci'),
    isWatch: !!process.argv.includes('--watch'),
  });

  await buildCli(opts);
}

main();
