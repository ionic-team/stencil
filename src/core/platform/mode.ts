import { ConfigApi, DomApi, HostElement } from '../../util/interfaces';
import { isDef } from '../../util/helpers';


export function getMode(domApi: DomApi, config: ConfigApi, elm: HostElement): string {
  const attrMode = domApi.$getAttribute(elm, 'mode');

  // first let's see if they set the mode directly on the property
  if (isDef((<any>elm).mode)) {
    return (<any>elm).mode;
  }

  // next let's see if they set the mode on the elements attribute
  if (isDef(attrMode)) {
    return attrMode;
  }

  // ok fine, let's just get the values from the config
  return config.get('mode', 'md');
}
