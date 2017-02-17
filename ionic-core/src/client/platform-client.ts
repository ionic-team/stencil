import { AppInitializeData, ComponentClass } from '../shared/interfaces';
import { createRenderer, createApp } from '../shared/renderer';
import { registerComponents } from './component-client';


export function bootstrapClient(appInit?: AppInitializeData) {
  console.time(`bootstrapClient`);

  appInit = appInit || {};
  appInit.el = appInit.el || 'ion-app';

  const r = createRenderer(window, document);
  createApp(r, appInit);

  registerComponents(r, appInit.components);

  console.timeEnd(`bootstrapClient`);
}
