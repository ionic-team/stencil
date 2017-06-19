import { ComponentRegistry, StencilSystem } from '../../../util/interfaces';
import { parseComponentMeta } from '../../../util/data-parse';


export function registerDirectory(sys: StencilSystem, staticDir: string) {
  // walk through the static directory looking for
  // stencil components
  const registry: ComponentRegistry = {};
  const moduleImports: any = {};

  const context: any = {
    Ionic: {
      defineComponents: function(coreVersion: number, bundleId: string) {
        coreVersion; bundleId;
        const args = arguments;

        for (var i = 3; i < args.length; i++) {
          parseComponentMeta(registry, moduleImports, args[i]);
        }
      }
    }
  };

  sys.vm.createContext(context);
  scanDirectory(sys, context, staticDir);

  console.log(`stencil-server-renderer: registered ${Object.keys(registry).length} components`);

  return registry;
}


function scanDirectory(sys: StencilSystem, context: any, dir: string) {
  sys.fs.readdirSync(dir).forEach(dirItem => {
    const readPath = sys.path.join(dir, dirItem);

    if (isValidComponent(dirItem)) {
      const defineComponentsFn = sys.fs.readFileSync(readPath, 'utf-8');

      if (defineComponentsFn.indexOf(`Ionic.defineComponents(`) > -1) {
        try {
          sys.vm.runInContext(defineComponentsFn, context);

        } catch (e) {
          console.error(`defineComponentsFn, ${readPath}: ${e}`);
        }
      }

    } else if (sys.fs.statSync(readPath).isDirectory()) {
      scanDirectory(sys, context, readPath);
    }
  });
}


function isValidComponent(fileName: string) {
  return /ionic\.(.*?)\.js/.test(fileName);
}
