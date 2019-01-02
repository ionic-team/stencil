import * as d from '../../../declarations';
import ts from 'typescript';


export function visitStringLiteral(moduleFile: d.Module, node: ts.StringLiteral) {
  if (typeof node.text === 'string' && node.text.includes('</')) {

    if (node.text.includes('-')) {
      moduleFile.potentialCmpRefs.push({
        html: node.text
      });
    }

    if (!moduleFile.htmlTagNames.includes('slot') && node.text.includes('<slot')) {
      moduleFile.htmlTagNames.push('slot');
    }

    if (!moduleFile.htmlTagNames.includes('svg') && node.text.includes('<svg')) {
      moduleFile.htmlTagNames.push('svg');
    }
  }
}
