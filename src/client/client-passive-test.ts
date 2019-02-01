import { BUILD } from '@build-conditionals';
import { plt, win } from './client-window';


if (BUILD.hostListener) {
  try {
    (win as Window).addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { plt.supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
}
