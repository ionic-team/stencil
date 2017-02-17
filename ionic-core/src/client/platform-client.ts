import { AppInitializeData, ComponentClass } from '../shared/interfaces';
import { createRenderer, registerComponent, Renderer } from '../shared/renderer';
import { registerComponents } from './component-client';


export function bootstrapClient(appInit: AppInitializeData) {
  console.time(`bootstrapClient`);

  const r = createRenderer(window, document);

  registerComponents(r, appInit.components);

  console.timeEnd(`bootstrapClient`);
}
