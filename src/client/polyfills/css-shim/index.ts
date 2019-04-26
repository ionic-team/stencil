
import { CustomStyle } from './custom-style';

if (!(window as any).__stencil_cssshim) {
  (window as any).__stencil_cssshim = new CustomStyle(window, document);
}
