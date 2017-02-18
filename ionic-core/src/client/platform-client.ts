import { AppInitOptions, ComponentClass } from '../shared/interfaces';
import { createApp } from '../shared/renderer';


export function bootstrapClient(rootComponent: any, opts?: AppInitOptions) {
  console.time(`bootstrapClient`);

  opts = opts || {};

  createApp(window, document, rootComponent, opts);

  console.timeEnd(`bootstrapClient`);
}
