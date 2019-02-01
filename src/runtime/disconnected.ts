import * as d from '@declarations';
import { activelyProcessingCmps } from '@platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  activelyProcessingCmps.delete(elm);
};
