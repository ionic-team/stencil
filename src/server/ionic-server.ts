import { ConfigApi, DomControllerApi, Ionic } from '../util/interfaces';
import { noop } from '../util/helpers';
import { themeVNodeData } from '../renderer/host';


export function initInjectedIonic(ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi) {

  const injectedIonic: Ionic = {
    theme: themeVNodeData,
    emit: noop,
    listener: {
      enable: noop,
      add: () => noop
    },
    config: ConfigCtrl,
    dom: DomCtrl,
    controller: (ctrlName: string, opts?: any) => {
      throw `TODO: initInjectedIonic ${ctrlName} ${opts}`;
    }
  };

  Object.defineProperty(injectedIonic, 'Animation', {
    get: function() {
      throw `Ionic.Animation is not available on the server`;
    }
  });

  return injectedIonic;
}
