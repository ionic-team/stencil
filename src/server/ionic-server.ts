import { ConfigApi, DomControllerApi, Ionic } from '../util/interfaces';
import { noop } from '../util/helpers';
import { themeVNodeData } from '../client/host';


export function initInjectedIonic(ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi) {

  const injectedIonic: Ionic = {
    theme: themeVNodeData,
    emit: noop,
    listener: {
      enable: noop,
      add: () => noop
    },
    controllers: {},
    config: ConfigCtrl,
    dom: DomCtrl,
    modal: {
      create: () => {
        return {
          present: () => Promise.resolve(),
          dismiss: () => Promise.resolve()
        };
      }
    },
    Animation: {}
  };

  return injectedIonic;
}
