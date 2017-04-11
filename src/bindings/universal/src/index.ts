import { Ionic, IonicUtils, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { registerComponents } from '../../../server/registry';
import { Renderer } from '../../../renderer/core';
import { theme } from '../../../element/host';
import { upgradeInputHtml } from '../../../server/render';


export function init(serverInitConfig: ServerInitConfig) {
  const ionic: Ionic = (<any>global).Ionic = (<any>global).Ionic || {};
  const plt = PlatformServer(ionic);
  const renderer = Renderer(plt);

  const utils: IonicUtils = {
    theme: theme
  };

  registerComponents(serverInitConfig.staticDir);


  function upgradeHtml(content: string) {
    return upgradeInputHtml(utils, plt, renderer, content);
  }


  return {
    upgradeHtml: upgradeHtml
  };
}
