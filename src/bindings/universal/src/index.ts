import { ConfigController } from '../../../util/config-controller';
import { IonicGlobal, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { registerComponents } from '../../../server/registry';
import { QueueServer } from '../../../server/queue-server';
import { upgradeInputHtml } from '../../../server/upgrade';


export function init(serverInitConfig: ServerInitConfig) {
  const IonicGbl: IonicGlobal = (<any>global).Ionic = (<any>global).Ionic || {};

  IonicGbl.DomCtrl = {
    read: function(cb: Function) { cb(performance.now()); },
    write: function(cb: Function) { cb(performance.now()); },
    raf: function(cb: Function) { cb(performance.now()); },
  };

  IonicGbl.QueueCtrl = QueueServer();

  IonicGbl.ConfigCtrl = ConfigController(IonicGbl.config, []);

  const plt = PlatformServer(IonicGbl, IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);

  registerComponents(serverInitConfig.staticDir);

  function upgradeHtml(html: string) {
    return upgradeInputHtml(plt, html);
  }

  return {
    upgradeHtml: upgradeHtml
  };
}
