import { ConfigApi, DomControllerApi, Ionic } from '../util/interfaces';
import { noop } from '../util/helpers';
import { themeVNodeData } from '../renderer/host';


export function initInjectedIonic(ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi) {

  const injectedIonic: Ionic = {
    isServer: true,
    isClient: false,
    theme: themeVNodeData,
    emit: noop,
    listener: {
      enable: noop,
      add: () => noop
    },
    config: ConfigCtrl,
    dom: DomCtrl,
    controller: serverController
  };

  function serverController(ctrlName: string, opts?: any) {
    const promise: any = new Promise((resolve, reject) => {
      const msg = `"${ctrlName}" is not available on the server`;
      console.trace(msg);

      reject(msg);

      resolve; opts; // for no TS errors
    });
    return promise;
  }

  Object.defineProperty(injectedIonic, 'Animation', {
    get: function() {
      console.error(`Ionic.Animation is not available on the server`);
      return {};
    }
  });

  return injectedIonic;
}
