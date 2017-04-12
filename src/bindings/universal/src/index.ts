import { Ionic, IonicUtils, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { registerComponents } from '../../../server/registry';
import { theme } from '../../../client/host';
import { upgradeInputHtml } from '../../../server/upgrade';


export function init(serverInitConfig: ServerInitConfig) {
  const ionic: Ionic = (<any>global).Ionic = (<any>global).Ionic || {};
  const plt = PlatformServer(ionic);

  const utils: IonicUtils = {
    theme: theme
  };

  registerComponents(serverInitConfig.staticDir);

  function upgradeHtml(html: string) {
    return upgradeInputHtml(utils, plt, html);
  }

  return {
    upgradeHtml: upgradeHtml
  };
}
