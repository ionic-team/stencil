import { hydrateHtml } from '../../../core/server/hydrate-server';
import { ComponentModeData, ComponentRegistry } from '../../../util/interfaces';
import { parseModeName } from '../../../util/data-parse';
import { ServerInitConfig, HydrateConfig } from '../../../util/interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';


export function init(serverInitConfig: ServerInitConfig) {
  const staticDir = serverInitConfig.staticDir;
  const registry = registerComponents(staticDir);

  function hydrate(html: string, opts: HydrateConfig = {}) {
    opts.config = opts.config || serverInitConfig.config;

    return hydrateHtml(registry, html, opts, staticDir);
  }

  return {
    hydrate: hydrate
  };
}


function registerComponents(staticDir: string) {
  const registry: ComponentRegistry = {};

  const context: any = {
    Ionic: {
      defineComponents: function defineComponents(coreVersion: number, bundleId: string) {
        coreVersion; bundleId;
        var args = arguments;

        for (var i = 3; i < args.length; i++) {
          // first arg is core version
          // second arg is the bundleId
          // third arg is the importFn
          // each arg after that is a component/mode
          var cmpModeData: ComponentModeData = args[i];
          var tag = cmpModeData[0];
          var modeName = parseModeName(cmpModeData[7]);

          registry[tag] = registry[tag] || {};
          registry[tag].tagNameMeta = tag;
          registry[tag].modesMeta = registry[tag].modesMeta || {};
          registry[tag].modesMeta[modeName] = registry[tag].modesMeta[modeName] || {};
          registry[tag].modesMeta[modeName].bundleId = bundleId;

          if (!registry[tag].propsMeta) {
            registry[tag].propsMeta = [
              { propName: 'color', attribName: 'color' },
              { propName: 'mode' },
            ];
          }
        }
      }
    }
  };

  vm.createContext(context);

  scanDirectory(context, staticDir);

  return registry;
}


function scanDirectory(context: any, dir: string) {
  fs.readdirSync(dir).forEach(dirItem => {
    const readPath = path.join(dir, dirItem);

    if (isValidComponent(dirItem)) {
      const defineComponentsFn = fs.readFileSync(readPath, 'utf-8');

      if (defineComponentsFn.indexOf(`Ionic.defineComponents(`) > -1) {
        try {
          vm.runInContext(defineComponentsFn, context);

        } catch (e) {
          console.error(`defineComponentsFn, ${readPath}: ${e}`);
        }
      }

    } else if (fs.statSync(readPath).isDirectory()) {
      scanDirectory(context, readPath);
    }
  });
}


function isValidComponent(fileName: string) {
  return /ionic\.(.*?)\.js/.test(fileName);
}
