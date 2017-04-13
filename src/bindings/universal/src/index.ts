import { Ionic, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { registerComponents } from '../../../server/registry';
import { upgradeInputHtml } from '../../../server/upgrade';


export function init(serverInitConfig: ServerInitConfig) {
  const ionic: Ionic = (<any>global).Ionic = (<any>global).Ionic || {};
  const plt = PlatformServer(ionic);

  registerComponents(serverInitConfig.staticDir);

  function upgradeHtml(html: string) {
    return upgradeInputHtml(plt, html);
  }

  return {
    upgradeHtml: upgradeHtml
  };
}
