import { CompilerOptions, CompilerContext } from './interfaces';
import { Logger } from './logger';
import { transformTsFiles } from './transformer';
import { emptyDir } from './util';


export function compileComponents(opts: CompilerOptions, ctx: CompilerContext = {}) {
  const logger = new Logger(ctx, `compile`);

  return emptyDir(opts.destDir).then(() => {
      return transformTsFiles(opts, ctx);
    })
    .then(() => {
      // congrats, we did it!  (•_•) / ( •_•)>⌐■-■ / (⌐■_■)
      logger.finish();
    })
    .catch(err => {
      if (err.isFatal) { throw err; }
      throw logger.fail(err);
    });
}
