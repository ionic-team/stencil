import { defineCustomElement } from '../../test-components/custom-element-root';

const renameTag = (tag) => {
  if (tag === 'custom-element-root') {
    return 'renamed-custom-element-root';
  }
  return tag;
}

defineCustomElement(renameTag);
