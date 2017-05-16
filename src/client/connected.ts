import { ComponentMeta, ConfigApi, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { addToLoadingParentComponent, queueUpdate } from './update';
import { isDef } from '../util/helpers';


export function connectedCallback(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, cmpMeta: ComponentMeta) {
  // do not reconnect if we've already created an instance for this element

  if (!elm.$hasConnected) {
    elm.$hasConnected = true;

    // see if one of the parent components is still actively loading
    addToLoadingParentComponent(plt, elm);

    // add to the queue to load the bundle
    // it's important to have an async tick in here so we can
    // ensure the "mode" attribute has been added to the element
    plt.queue.add(() => {
      const tag = cmpMeta.tag;

      // get the mode the element which is loading
      // if there is no mode, then use "default"
      const cmpMode = cmpMeta.modes.find(m => m.modeName === getMode(plt, config, elm, 'mode') || m.modeName === 'default');

      // start loading this component mode's bundle
      // if it's already loaded then the callback will be synchronous
      plt.loadBundle(cmpMode.bundleId, cmpMeta.priority, function loadComponentCallback() {

        // we've fully loaded the component mode data
        // let's queue it up to be rendered next
        queueUpdate(plt, config, renderer, elm, tag);
      });
    });
  }
}


function getMode(plt: PlatformApi, config: ConfigApi, elm: ProxyElement, propName: string): string {
  // first let's see if they set the mode directly on the property
  let value = (<any>elm)[propName];
  if (isDef(value)) {
    return value;
  }

  // next let's see if they set the mode on the elements attribute
  value = plt.$getAttribute(elm, propName);
  if (isDef(value)) {
    return value;
  }

  // ok fine, let's just get the values from the config
  return config.get(propName, 'md');
}
