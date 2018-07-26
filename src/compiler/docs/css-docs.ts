import * as d from '../../declarations';


export function parseCssCustomProperties(styleText: string) {
  const cssProps: d.CssCustomProperty[] = [];

  if (typeof styleText !== 'string') {
    return cssProps;
  }

  let startIndex: number;
  while ((startIndex = styleText.indexOf(CSS_DOC_START)) > -1) {
    styleText = styleText.substring(startIndex + CSS_DOC_START.length);

    const endIndex = styleText.indexOf(CSS_DOC_END);
    if (endIndex === -1) {
      break;
    }

    const comment = styleText.substring(0, endIndex);
    parseCssComment(cssProps, comment);

    styleText = styleText.substring(endIndex + CSS_DOC_END.length);
  }

  return cssProps;
}


function parseCssComment(cssProps: d.CssCustomProperty[], comment: string) {
  /**
   * @prop --max-width: Max width of the alert
   */

  const lines = comment.split(/\r?\n/).map(line => {
    line = line.trim();

    while (line.startsWith('*')) {
      line = line.substring(1).trim();
    }

    return line;
  });

  comment = lines.join(' ').replace(/\t/g, ' ').trim();

  while (comment.includes('  ')) {
    comment = comment.replace('  ', ' ');
  }

  const docs = comment.split(CSS_PROP_KEYWORD);

  docs.forEach(d => {
    const doc = d.trim();

    if (!doc.startsWith(`--`)) {
      return;
    }

    const splt = doc.split(`:`);
    const cssProp: d.CssCustomProperty = {
      name: splt[0].trim(),
      docs: (splt.shift() && splt.join(`:`)).trim()
    };

    if (!cssProps.some(c => c.name === cssProp.name)) {
      cssProps.push(cssProp);
    }
  });

  return cssProps;
}

const CSS_DOC_START = `/**`;
const CSS_DOC_END = `*/`;
const CSS_PROP_KEYWORD = `@prop`;
