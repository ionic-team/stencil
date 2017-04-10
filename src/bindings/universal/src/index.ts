import { registerComponents } from '../../../server/registry';
import { Ionic, ServerInitConfig } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { upgradeInputHtml } from '../../../server/render';
import { Renderer } from '../../../renderer/core';


export function init(serverInitConfig: ServerInitConfig) {
  const ionic: Ionic = (<any>global).Ionic = (<any>global).Ionic || {};
  const plt = PlatformServer(ionic);
  const renderer = Renderer(plt);


  registerComponents(serverInitConfig.staticDir);


  function upgradeHtml(content: string) {
    return upgradeInputHtml(renderer, plt, content);
  }


  return {
    upgradeHtml: upgradeHtml
  };
}
