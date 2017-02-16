import { BootstrapData } from '../shared/interfaces';


export function bootstrapClient(bootstrapData: BootstrapData) {
  console.debug(`bootstrapClient: ${bootstrapData}`);
}


export function registerComponent(selector: string, data: any) {
  console.debug(`registerComponent: ${selector}`);
}
