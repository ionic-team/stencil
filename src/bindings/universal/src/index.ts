import { hydrateHtml } from '../../../server/hydrate-server';
import { registerComponents } from '../../../server/registry-server';
import { ServerInitConfig, HydrateConfig } from '../../../util/interfaces';


export function init(serverInitConfig: ServerInitConfig) {
  const staticDir = serverInitConfig.staticDir;
  const registry = registerComponents(staticDir);

  function hydrate(html: string, opts: HydrateConfig = {}) {
    const registryClone = Object.assign({}, registry);

    opts.config = opts.config || serverInitConfig.config;

    return hydrateHtml(registryClone, html, opts, staticDir);
  }

  return {
    hydrate: hydrate
  };
}
