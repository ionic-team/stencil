// deno install -n stencil --allow-read --allow-write --allow-net --unstable -f ./bin/cli.ts

import { run } from '../cli/index.js';
import { createDenoLogger, createDenoSys } from '../sys/deno/index.js';

if (import.meta.main) {
  try {
    const denoLogger = createDenoLogger({ Deno });
    const denoSys = createDenoSys({ Deno });

    run({
      args: Deno.args,
      logger: denoLogger,
      sys: denoSys,
    });
  } catch (e) {
    console.error('uncaught error', e);
    Deno.exit(1);
  }
}
