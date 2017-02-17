import { AppInitOptions, ComponentClass } from '../shared/interfaces';
import { createRenderer, createApp } from '../shared/renderer';
import { registerComponents } from './component-client';


export function bootstrapClient(rootComponent: any, opts?: AppInitOptions) {
  console.time(`bootstrapClient`);

  opts = opts || {};

  createApp(window, document, rootComponent, opts);

  // registerComponents(r, opts.components);

  console.timeEnd(`bootstrapClient`);
}
