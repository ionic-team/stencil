import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { Plugin } from 'rollup';
import { STENCIL_APP_DATA_ID, STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID } from './entry-alias-ids';


export const appDataPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, build: d.BuildConditionals, platform: 'client' | 'hydrate'): Plugin => {
  const globalPaths: string[] = [];

  if (typeof config.globalScript === 'string') {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    if (mod != null && mod.jsFilePath) {
      globalPaths.push(normalizePath(mod.jsFilePath));
    }
  }

  compilerCtx.collections.forEach(collection => {
    if (collection.global != null && typeof collection.global.jsFilePath === 'string') {
      globalPaths.push(normalizePath(collection.global.jsFilePath));
    }
  });

  return {
    name: 'appDataPlugin',

    resolveId(id) {
      if (id === STENCIL_APP_DATA_ID) {
        return id;
      }
      return null;
    },

    load(id) {
      if (id === STENCIL_APP_DATA_ID) {
        return [
          getGlobalScripts(globalPaths),
          getBuildConditionals(config, build),
          getNamespace(config),
        ].join('\n');
      }
      return null;
    },

    transform(code, id) {
      id = normalizePath(id);
      if (globalPaths.includes(id)) {
        const program = this.parse(code, {});
        const needsDefault = !program.body.some(s => s.type === 'ExportDefaultDeclaration');
        const defaultExport = needsDefault
          ? '\nexport const globalFn = () => {};\nexport default globalFn;'
          : '';

        return getContextImport(platform) + code + defaultExport;
      }
      return null;
    }
  };
};


const getBuildConditionals = (config: d.Config, build: d.BuildConditionals) => {
  const builData = Object.keys(build).map(key => {
    return key + ': ' + ((build as any)[key] ? 'true' : 'false');
  });

  return `export const BUILD = /* ${config.fsNamespace} custom */ { ${builData.join(', ')} };`;
};


const getNamespace = (config: d.Config) => {
  return `export const NAMESPACE = '${config.fsNamespace}';`;
};


const getGlobalScripts = (globalPaths: string[]) => {
  const output = globalPaths.map((appGlobalScriptPath, index) => (
    `import appGlobalScript${index} from '${appGlobalScriptPath}';`
  ));

  output.push(
    `export const globalScripts = /*@__PURE__*/ () => {`,
    ...globalPaths.map((_, index) => `  appGlobalScript${index}();`),
    `};`
  );

  return output.join('\n');
};

const getContextImport = (platform: string) => {
  return `import { Context } from '${
    platform === 'hydrate' ?
      STENCIL_INTERNAL_HYDRATE_ID :
      STENCIL_INTERNAL_CLIENT_ID
  }';\n`;
};
