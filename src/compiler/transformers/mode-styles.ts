import { ComponentMeta, ComponentOptions } from '../interfaces';


export function normalizeStyles(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styles === 'string' && userOpts.styles.trim().length) {
    cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
    cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {};
    cmpMeta.modesStyleMeta.$.styleUrls = cmpMeta.modesStyleMeta.$.styleUrls || [];

    cmpMeta.modesStyleMeta.$.styles.push(userOpts.styles.trim());
  }
}


export function normalizeStyleUrl(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styleUrl === 'string') {
    // as a string
    // styleUrl: 'my-styles.scss'

    if (!userOpts.styleUrl.trim().length) {
      throw `invalid style url for ${cmpMeta.tagNameMeta}: ${userOpts.styleUrl}`;
    }

    cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
    cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {};
    cmpMeta.modesStyleMeta.$.styleUrls = cmpMeta.modesStyleMeta.$.styleUrls || [];

    cmpMeta.modesStyleMeta.$.styleUrls.push(userOpts.styleUrl.trim());
  }
}


export function normalizeStyleUrls(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (!userOpts.styleUrls) {
    return;
  }

  // normalize the possible styleUrl structures

  if (Array.isArray(userOpts.styleUrls)) {
    // as an array of strings
    // styleUrls: ['my-styles.scss', 'my-other-styles']

    userOpts.styleUrls.forEach(styleUrl => {
      if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
        cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
        cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {};
        cmpMeta.modesStyleMeta.$.styleUrls = cmpMeta.modesStyleMeta.$.styleUrls || [];

        cmpMeta.modesStyleMeta.$.styleUrls.push(styleUrl.trim());

      } else {
        throw `invalid style url for ${cmpMeta.tagNameMeta}: ${styleUrl}`;
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

      if (typeof styleModes[styleModeName] === 'string') {
        const styleUrl = styleModes[styleModeName].trim();
        if (!styleUrl.length) {
          throw `invalid style url for ${cmpMeta.tagNameMeta}: ${styleModes[styleModeName]}`;
        }

        cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
        cmpMeta.modesStyleMeta[modeName] = cmpMeta.modesStyleMeta[modeName] || {};
        cmpMeta.modesStyleMeta[modeName].styleUrls = cmpMeta.modesStyleMeta[modeName].styleUrls || [];

        cmpMeta.modesStyleMeta[modeName].styleUrls.push(styleUrl);

      } else if (Array.isArray(styleModes[styleModeName])) {
        const styleUrls: string[] = (<any>userOpts).styleUrls;

        styleUrls.forEach(styleUrl => {
          if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
            cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
            cmpMeta.modesStyleMeta[modeName] = cmpMeta.modesStyleMeta[modeName] || {};
            cmpMeta.modesStyleMeta[modeName].styleUrls = cmpMeta.modesStyleMeta[modeName].styleUrls || [];

            cmpMeta.modesStyleMeta[modeName].styleUrls.push(styleUrl.trim());

          } else {
            throw `invalid style url for ${cmpMeta.tagNameMeta}: ${styleUrl}`;
          }
        });

      } else {
        throw `invalid style url for ${cmpMeta.tagNameMeta}: ${styleModes[styleModeName]}`;
      }
    });

  }
}
