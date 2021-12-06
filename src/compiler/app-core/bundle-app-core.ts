import type * as d from '../../declarations';
import type { OutputAsset, OutputChunk, OutputOptions, RollupBuild } from 'rollup';
import { STENCIL_CORE_ID } from '../bundle/entry-alias-ids';

export const generateRollupOutput = async (
  build: RollupBuild,
  options: OutputOptions,
  config: d.Config,
  entryModules: d.EntryModule[]
): Promise<d.RollupResult[]> => {
  if (build == null) {
    return null;
  }

  const { output }: { output: [OutputChunk, ...(OutputChunk | OutputAsset)[]] } = await build.generate(options);
  return output.map((chunk: OutputChunk | OutputAsset) => {
    if (chunk.type === 'chunk') {
      const isCore = Object.keys(chunk.modules).some((m) => m.includes('@stencil/core'));
      return {
        type: 'chunk',
        fileName: chunk.fileName,
        map: chunk.map,
        code: chunk.code,
        moduleFormat: options.format,
        entryKey: chunk.name,
        imports: chunk.imports,
        isEntry: !!chunk.isEntry,
        isComponent: !!chunk.isEntry && entryModules.some((m) => m.entryKey === chunk.name),
        isBrowserLoader: chunk.isEntry && chunk.name === config.fsNamespace,
        isIndex: chunk.isEntry && chunk.name === 'index',
        isCore,
      };
    } else {
      return {
        type: 'asset',
        fileName: chunk.fileName,
        content: chunk.source as any,
      };
    }
  });
};

export const DEFAULT_CORE = `
export * from '${STENCIL_CORE_ID}';
`;

export const DEFAULT_ENTRY = `
export * from '@stencil/core';
`;
