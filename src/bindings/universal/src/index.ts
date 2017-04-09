import { initServer } from '../../../server/init-server';
import { LoadComponents } from '../../../util/interfaces';
import { PlatformServer } from '../../../server/platform-server';
import { renderComponentToString } from '../../../server/render';
import { Renderer } from '../../../renderer/core';


export function init(components: LoadComponents) {
  const plt = PlatformServer();
  const renderer = Renderer(plt);

  initServer(plt, components);


  function renderToString(content: string, callback: Function) {
    renderComponentToString(renderer, content, callback);
  }


  return {
    renderToString: renderToString
  }
}
