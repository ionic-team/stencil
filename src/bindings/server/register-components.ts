import { ComponentRegistry, StencilSystem } from '../../util/interfaces';
import { parseComponentRegistry } from '../../util/data-parse';


export function registerComponents(sys: StencilSystem, staticDir: string) {
  const registry: ComponentRegistry = {};
  const registryFilePath = sys.path.join(staticDir, 'cmp-registry.json');
  const cmpRegistryData = JSON.parse(sys.fs.readFileSync(registryFilePath, 'utf-8'));

  parseComponentRegistry(cmpRegistryData, registry);

  console.log(`stencil-server-renderer: registered ${Object.keys(registry).length} components`);

  return registry;
}
