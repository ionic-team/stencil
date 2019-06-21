import { MockHTMLElement } from './node';
import { NODE_TYPES } from './constants';


export class MockDocumentTypeNode extends MockHTMLElement {

  constructor(ownerDocument: any) {
    super(ownerDocument, '!DOCTYPE');
    this.nodeType = NODE_TYPES.DOCUMENT_TYPE_NODE;
    this.setAttribute('html', '');
  }

}
