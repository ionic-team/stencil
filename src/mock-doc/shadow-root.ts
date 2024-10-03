import { MockDocumentFragment } from './document-fragment';

export class MockShadowRoot extends MockDocumentFragment {
  get activeElement() {
    return null;
  }

  set adoptedStyleSheets(adoptedStyleSheets: any) {
    throw new Error('Unimplemented');
  }

  get adoptedStyleSheets() {
    return [];
  }

  get cloneable() {
    return false;
  }

  get delegatesFocus() {
    return false;
  }

  get fullscreenElement() {
    return null
  }

  get host() {
    let parent = this.parentElement();
    while (parent) {
      if (parent.nodeType === 11) {
        return parent;
      }
      parent = parent.parentElement();
    }
    return null;
  }

  get mode() {
    return 'open';
  }

  get pictureInPictureElement() {
    return null;
  }

  get pointerLockElement() {
    return null;
  }

  get serializable() {
    return false;
  }

  get slotAssignment() {
    return 'named'
  }

  get styleSheets() {
    return [];
  }
}
