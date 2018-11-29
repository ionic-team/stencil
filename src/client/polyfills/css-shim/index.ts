
import { CustomStyle } from './custom-style';

(window as any).customStyleShim = new CustomStyle(window, document);
