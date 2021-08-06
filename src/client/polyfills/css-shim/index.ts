import { CustomStyle } from './custom-style';

(function (win: any) {
  if (win && !win.__cssshim && !(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
    win.__cssshim = new CustomStyle(win, win.document);
  }
})(typeof window !== 'undefined' && window);
