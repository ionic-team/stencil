import * as d from '../../declarations';
import MagicString from 'magic-string';
import { normalizePath } from '@utils';
import { Plugin } from 'rollup';
import { STENCIL_APP_DATA_ID, STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID } from './entry-alias-ids';


export const appDataPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, build: d.BuildConditionals, platform: 'client' | 'hydrate'): Plugin => {
  const globalPaths = getGlobalScriptPaths(config, compilerCtx);

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
        const s = new MagicString(``);
        appendNamespace(config, s);
        appendBuildConditionals(config, build, s);
        appendGlobalScripts(globalPaths, s);
        return s.toString();
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


export const getGlobalScriptPaths = (config: d.Config, compilerCtx: d.CompilerCtx) => {
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

  return globalPaths;
};


const appendGlobalScripts = (globalPaths: string[], s: MagicString) => {
  if (globalPaths.length === 1) {
    s.prepend(`import appGlobalScript from '${globalPaths[0]}';\n`);
    s.append(`export const globalScripts = appGlobalScript;\n`);

  } else if (globalPaths.length > 1) {
    globalPaths.forEach((appGlobalScriptPath, index) => {
      s.prepend(`import appGlobalScript${index} from '${appGlobalScriptPath}';\n`);
    });

    s.append(`export const globalScripts = () => {\n`);
    globalPaths.forEach((_, index) => {
      s.append(`  appGlobalScript${index}();\n`);
    });
    s.append(`};\n`);

  } else {
    s.append(`export const globalScripts = () => {};\n`);
  }
};

const appendBuildConditionals = (config: d.Config, build: d.BuildConditionals, s: MagicString) => {
  const builData = Object.keys(build).sort().map(key => (
    key + ': ' + ((build as any)[key] ? 'true' : 'false')
  )).join(', ');

  s.append(`export const BUILD = /* ${config.fsNamespace} */ { ${builData} };\n`);
};


const appendNamespace = (config: d.Config, s: MagicString) => {
  s.append(`export const NAMESPACE = '${config.fsNamespace}';\n`);
};


const getContextImport = (platform: string) => {
  return `import { Context } from '${
    platform === 'hydrate' ?
      STENCIL_INTERNAL_HYDRATE_ID :
      STENCIL_INTERNAL_CLIENT_ID
  }';\n`;
};
