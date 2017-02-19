import { AppInitOptions } from '../shared/interfaces';
import { createApp } from '../shared/renderer';


export function bootstrapServer(rootComponent: any, opts?: AppInitOptions) {
  console.time(`bootstrapServer`);

  opts = opts || {};

  const window = global;
  const document = {};

  createApp(window, document, rootComponent, opts);

  console.timeEnd(`bootstrapServer`);
}
