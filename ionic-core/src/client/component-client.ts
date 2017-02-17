import { AppInitializeData, ComponentClass } from '../shared/interfaces';
import { registerComponent, Renderer } from '../shared/renderer';
import { ionDevWarn } from '../shared/util';
import { getComponentMeta, ComponentMeta } from '../decorators/decorators';


export function registerComponents(r: Renderer, components: ComponentClass[]) {
  if (process.env.NODE_ENV !== 'production' && !Array.isArray(components)) {
    ionDevWarn(`Invalid array of components to register`);
    return;
  }

  for (var i = 0, l = components.length; i < l; i++) {

    if (process.env.NODE_ENV !== 'production') {
      // dev mode
      if (!getComponentMeta(components[i])) {
        ionDevWarn(`Component class does not have a valid @Component decorator and meta data: ${components[i]}`);
        continue;
      }
      if (!getComponentMeta(components[i]).render) {
        ionDevWarn(`${getComponentMeta(components[i]).selector} component template must be compiled before running the app`);
        continue;
      }

      registerComponent(r, components[i], getComponentMeta(components[i]));

    } else {
      // prod mode
      registerComponent(r, components[i], getComponentMeta(components[i]));
    }

  }
}
