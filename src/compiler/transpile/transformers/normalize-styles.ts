import { ComponentMeta, ComponentOptions } from '../../interfaces';
import { normalizePath } from '../../util';


export function normalizeStyles(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  normalizeStyleString(userOpts, cmpMeta);
  normalizeStyleUrl(userOpts, cmpMeta);
  normalizeStyleUrls(userOpts, cmpMeta);
}


function normalizeStyleString(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styles === 'string' && userOpts.styles.trim().length) {

    cmpMeta.styleMeta = cmpMeta.styleMeta || {};
    cmpMeta.styleMeta.$ = cmpMeta.styleMeta.$ || {};

    cmpMeta.styleMeta.$.styleStr = userOpts.styles.trim();
  }
}


function normalizeStyleUrl(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styleUrl === 'string' && userOpts.styleUrl.trim().length) {
    // as a string
    // styleUrl: 'my-styles.scss'

    cmpMeta.styleMeta = cmpMeta.styleMeta || {};
    cmpMeta.styleMeta.$ = cmpMeta.styleMeta.$ || {};
    cmpMeta.styleMeta.$.parsedStyleUrls = cmpMeta.styleMeta.$.parsedStyleUrls || [];

    cmpMeta.styleMeta.$.parsedStyleUrls.push(normalizePath(userOpts.styleUrl.trim()));
  }
}


function normalizeStyleUrls(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (!userOpts.styleUrls) {
    return;
  }

  // normalize the possible styleUrl structures

  if (Array.isArray(userOpts.styleUrls)) {
    // as an array of strings
    // styleUrls: ['my-styles.scss', 'my-other-styles']

    userOpts.styleUrls.forEach(styleUrl => {
      if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {

        cmpMeta.styleMeta = cmpMeta.styleMeta || {};
        cmpMeta.styleMeta.$ = cmpMeta.styleMeta.$ || {};
        cmpMeta.styleMeta.$.parsedStyleUrls = cmpMeta.styleMeta.$.parsedStyleUrls || [];

        cmpMeta.styleMeta.$.parsedStyleUrls.push(normalizePath(styleUrl.trim()));
      }
    });

  } else {
    // as an object
    // styleUrls: {
    //   ios: 'badge.ios.scss',
    //   md: 'badge.md.scss',
    //   wp: 'badge.wp.scss'
    // }

    const styleModes: {[modeName: string]: string} = (<any>userOpts).styleUrls;

    Object.keys(styleModes).forEach(styleModeName => {
      const modeName = styleModeName.trim().toLowerCase();

      if (typeof styleModes[styleModeName] === 'string' && styleModes[styleModeName].trim()) {
        const styleUrl = styleModes[styleModeName].trim();

        cmpMeta.styleMeta = cmpMeta.styleMeta || {};
        cmpMeta.styleMeta[modeName] = cmpMeta.styleMeta[modeName] || {};
        cmpMeta.styleMeta[modeName].parsedStyleUrls = cmpMeta.styleMeta[modeName].parsedStyleUrls || [];

        cmpMeta.styleMeta[modeName].parsedStyleUrls.push(normalizePath(styleUrl));

      } else if (Array.isArray(styleModes[styleModeName])) {
        const styleUrls: string[] = (<any>userOpts).styleUrls;

        styleUrls.forEach(styleUrl => {
          if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
            cmpMeta.styleMeta = cmpMeta.styleMeta || {};
            cmpMeta.styleMeta[modeName] = cmpMeta.styleMeta[modeName] || {};
            cmpMeta.styleMeta[modeName].parsedStyleUrls = cmpMeta.styleMeta[modeName].parsedStyleUrls || [];

            cmpMeta.styleMeta[modeName].parsedStyleUrls.push(normalizePath(styleUrl.trim()));
          }
        });
      }
    });

  }
}
