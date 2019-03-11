import * as d from '../../declarations';


export function parseStyleDocs(styleDocs: d.StyleDoc[], styleText: string) {
  if (typeof styleText !== 'string') {
    return;
  }

  let startIndex: number;
  while ((startIndex = styleText.indexOf(CSS_DOC_START)) > -1) {
    styleText = styleText.substring(startIndex + CSS_DOC_START.length);

    const endIndex = styleText.indexOf(CSS_DOC_END);
    if (endIndex === -1) {
      break;
    }

    const comment = styleText.substring(0, endIndex);
    parseCssComment(styleDocs, comment);

    styleText = styleText.substring(endIndex + CSS_DOC_END.length);
  }
}


function parseCssComment(styleDocs: d.StyleDoc[], comment: string) {
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

  const docs = comment.split(CSS_PROP_ANNOTATION);

  docs.forEach(d => {
    const doc = d.trim();

    if (!doc.startsWith(`--`)) {
      return;
    }

    const splt = doc.split(`:`);
    const cssDoc: d.StyleDoc = {
      name: splt[0].trim(),
      docs: (splt.shift() && splt.join(`:`)).trim(),
      annotation: 'prop'
    };

    if (!styleDocs.some(c => c.name === cssDoc.name && c.annotation === 'prop')) {
      styleDocs.push(cssDoc);
    }
  });

  return styleDocs;
}

const CSS_DOC_START = `/**`;
const CSS_DOC_END = `*/`;
const CSS_PROP_ANNOTATION = `@prop`;
