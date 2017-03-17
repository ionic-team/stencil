import { CompilerOptions, CompilerContext } from './interfaces';
import { Logger } from './logger';
import { transformTsFiles } from './transformer';
import { emptyDir, writeFile } from './util';
import * as path from 'path';


export function compileComponents(opts: CompilerOptions, ctx: CompilerContext = {}) {
  const logger = new Logger(ctx, `compile`);

  return transpile(opts, ctx)
    .then(() => {
      // congrats, we did it!  (•_•) / ( •_•)>⌐■-■ / (⌐■_■)
      logger.finish();
    })
    .catch(err => {
      if (err.isFatal) { throw err; }
      throw logger.fail(err);
    });
}


export function transpile(opts: CompilerOptions, ctx: CompilerContext) {
  return emptyDir(opts.destDir)
    .then(() => {
      return transformTsFiles(opts, ctx)
    .then(files => {
      return generateManifest(opts, ctx);
    });
  });
}


function generateManifest(opts: CompilerOptions, ctx: CompilerContext) {
  const manifestPath = path.join(opts.destDir, 'manifest.json');

  ctx.manifest = {
    components: []
  };

  ctx.files.forEach(f => {
    f.components.forEach(c => {
      delete c.preprocessStyles;
      ctx.manifest.components.push(c);
    });
  });

  return writeFile(manifestPath, JSON.stringify(ctx.manifest, null, 2));
}
