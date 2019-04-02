import * as d from '../../../declarations';
import ts from 'typescript';


export function parseStringLiteral(cmpMeta: d.ComponentCompilerMeta, node: ts.StringLiteral) {
  if (typeof node.text === 'string' && node.text.includes('</')) {
    if (node.text.includes('<slot')) {
      cmpMeta.htmlTagNames.push('slot');
    }
    if (node.text.includes('<svg')) {
      cmpMeta.htmlTagNames.push('svg');
    }
  }
}
