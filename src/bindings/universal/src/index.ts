import { initServer } from '../../../server/init-server';
import { LoadComponents } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { upgradeInputHtml } from '../../../server/render';
import { Renderer } from '../../../renderer/core';


export function init(components: LoadComponents) {
  const plt = PlatformServer();
  const renderer = Renderer(plt);

  initServer(plt, components);


  function upgradeHtml(content: string) {
    return upgradeInputHtml(renderer, plt, content);
  }


  return {
    upgradeHtml: upgradeHtml
  }
}
