import { AppInitializeData } from '../shared/interfaces';
import { createRenderer, createComponent } from '../shared/renderer';


export function bootstrapClient(bootstrapData: AppInitializeData) {
  console.debug(`bootstrapClient: ${bootstrapData}`);

  const r = createRenderer(window, document);

  createComponent(r);
}
