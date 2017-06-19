import { ComponentMeta, ComponentOptions } from '../interfaces';


export function normalizeStyles(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (!userOpts.styleUrls) {
    return;
  }

  if (typeof userOpts.styles === 'string') {
    if (userOpts.styles.trim().length) {
      cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
      (cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {}).styles = [userOpts.styles.trim()];
    }

  } else if (Array.isArray(userOpts.styles)) {
    userOpts.styles.forEach(styles => {
      if (typeof styles === 'string' && styles.trim().length) {
        cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
        cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {};
        cmpMeta.modesStyleMeta.$.styles = cmpMeta.modesStyleMeta.$.styles || [];
        cmpMeta.modesStyleMeta.$.styles.push(styles.trim());
      }
    });
  }
}


export function normalizeStyleUrls(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (!userOpts.styleUrls) {
    return;
  }

  // normalize the possible styleUrl structures

  if (typeof userOpts.styleUrls === 'string') {
    // as a string
    // styleUrls: 'my-styles.scss'

    if (!userOpts.styleUrls.trim().length) {
      throw `invalid style url for ${cmpMeta.tagNameMeta}: ${userOpts.styleUrls}`;
    }

    cmpMeta.modesStyleMeta = cmpMeta.modesStyleMeta || {};
    (cmpMeta.modesStyleMeta.$ = cmpMeta.modesStyleMeta.$ || {}).styleUrls = [userOpts.styleUrls.trim()];

  } else if (Array.isArray(userOpts.styleUrls)) {
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
