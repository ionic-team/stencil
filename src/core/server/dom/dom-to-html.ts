import * as parse5 from 'parse5';
import { domAdapter } from './dom-adapter';


export function domToHtml(node: Node) {
  parse5.serialize(node, {
    treeAdapter: <any>domAdapter
  });
}
