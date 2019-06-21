
import { CustomStyle } from './custom-style';

const win = window as any;

function needsShim() {
  return !(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'));
}

if (!win.__stencil_cssshim && needsShim()) {
  win.__stencil_cssshim = new CustomStyle(win, document);
}
