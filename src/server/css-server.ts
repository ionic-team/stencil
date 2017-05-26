import { PlatformApi } from '../util/interfaces';
import * as css from 'css';


export function generateCss(plt: PlatformApi, usedSelectors: {[selector: string]: boolean}) {
  const cssText = Object.keys(plt.css).sort().map(cmpModeId => plt.css[cmpModeId]).join('');

  const parsedCss = css.parse(cssText, {
    silent: true
  });

  for (var i = parsedCss.stylesheet.rules.length - 1; i >= 0; i--) {
    var rule: any = parsedCss.stylesheet.rules[i];

    if (rule.selectors) {
      for (var j = rule.selectors.length - 1; j >= 0; j--) {
        var selector: string = rule.selectors[j].split(' ')[0].trim();
        var firstChar = selector.charAt(0);

        if (firstChar === ':' || firstChar === '#' || firstChar === '*') {
          continue;
        }

        if (firstChar === '.') {
          selector = '.' + (selector.substring(1).split('.')[0]).trim();
        } else {
          selector = selector.split('.')[0].trim();
        }

        if (firstChar === '[') {
          if (selector.indexOf('=') === -1) {
            selector = selector.split(']')[0].trim() + ']';
          }
        } else {
          selector = (selector.split('[')[0]).trim();
        }

        selector = (selector.split(':')[0]).trim();

        if (!usedSelectors[selector]) {
          (<any[]>rule.selectors).splice(j, 1);
        }
      }

      if (rule.selectors.length === 0) {
        (<any[]>parsedCss.stylesheet.rules).splice(i, 1);
      }
    }
  }

  return css.stringify(parsedCss, {
    compress: true,
    inputSourcemaps: false
  });
}
