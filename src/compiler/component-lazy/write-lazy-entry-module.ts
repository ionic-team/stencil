import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { replaceStylePlaceholders } from '../app-core/component-styles';


export async function writeLazyModule(config: d.Config, compilerCtx: d.CompilerCtx, destinations: string[], entryModule: d.EntryModule, code: string, modeName: string, sufix: string): Promise<d.BundleModuleOutput> {
  code = replaceStylePlaceholders(entryModule.cmps, modeName, code);

  const bundleId = getBundleId(config, entryModule.entryKey, code, modeName, sufix);
  const fileName = `${bundleId}.entry.js`;

  await Promise.all(
    destinations.map(dst =>
      compilerCtx.fs.writeFile(config.sys.path.join(dst, fileName), code)
    )
  );

  return {
    bundleId,
    fileName,
    code,
    modeName,
  };
}


function getBundleId(config: d.Config, entryKey: string, code: string, modeName: string, sufix: string) {
  if (config.hashFileNames) {
    return `p-${config.sys.generateContentHash(code, config.hashedFileNameLength)}${sufix}`;
  }

  let bundleId = entryKey;
  if (modeName !== DEFAULT_STYLE_MODE) {
    bundleId += '-' + modeName;
  }

  return bundleId + sufix;
}
