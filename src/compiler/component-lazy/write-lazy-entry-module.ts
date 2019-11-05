import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { replaceStylePlaceholders } from '../app-core/component-styles';


export async function writeLazyModule(
  config: d.Config, compilerCtx: d.CompilerCtx, destinations: string[],
  entryModule: d.EntryModule,
  shouldHash: boolean,
  code: string,
  modeName: string,
  sufix: string
): Promise<d.BundleModuleOutput> {
  code = replaceStylePlaceholders(entryModule.cmps, modeName, code);

  const bundleId = await getBundleId(config, entryModule.entryKey, shouldHash, code, modeName, sufix);
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


async function getBundleId(config: d.Config, entryKey: string, shouldHash: boolean, code: string, modeName: string, sufix: string) {
  if (shouldHash) {
    const hash = await config.sys.generateContentHash(code, config.hashedFileNameLength);
    return `p-${hash}${sufix}`;
  }

  const components = entryKey.split('.');
  let bundleId = components[0];
  if (components.length > 2) {
    bundleId = `${bundleId}_${components.length - 1}`;
  }
  if (modeName !== DEFAULT_STYLE_MODE) {
    bundleId += '-' + modeName;
  }

  return bundleId + sufix;
}
