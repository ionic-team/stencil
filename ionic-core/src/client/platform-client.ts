import { BootstrapData } from '../shared/interfaces';
import { createRenderer, createComponent } from '../shared/renderer';


export function bootstrapClient(bootstrapData: BootstrapData) {
  console.debug(`bootstrapClient: ${bootstrapData}`);

  const r = createRenderer(window, document);

  createComponent(r);
}


export function registerComponent(selector: string, data: any) {
  console.debug(`registerComponent: ${selector}`);
}

