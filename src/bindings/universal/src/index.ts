import { ConfigController } from '../../../client/config-controller';
import { IonicGlobal, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { registerComponents } from '../../../server/registry';
import { upgradeInputHtml } from '../../../server/upgrade';


export function init(serverInitConfig: ServerInitConfig) {
  const IonicGbl: IonicGlobal = (<any>global).Ionic = (<any>global).Ionic || {};

  IonicGbl.domCtrl = {
    read: function(cb: Function) { cb(); },
    write: function(cb: Function) { cb(); },
  };

  IonicGbl.nextTickCtrl = null;

  IonicGbl.configCtrl = ConfigController(IonicGbl.config || {});

  const plt = PlatformServer(IonicGbl, IonicGbl.configCtrl, IonicGbl.domCtrl);

  registerComponents(serverInitConfig.staticDir);

  function upgradeHtml(html: string) {
    return upgradeInputHtml(plt, html);
  }

  return {
    upgradeHtml: upgradeHtml
  };
}
