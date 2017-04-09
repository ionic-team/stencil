import { LoadComponents, PlatformApi } from '../util/interfaces';
import { initComponentMeta } from '../element/proxy';


export function initServer(plt: PlatformApi, components: LoadComponents) {

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = initComponentMeta(tag, components[tag]);

    plt.registerComponent(cmpMeta);
  });

}
