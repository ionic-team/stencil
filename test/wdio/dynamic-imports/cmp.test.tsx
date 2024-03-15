import { render } from '@wdio/browser-runner/stencil';

describe('tag-names', () => {
  beforeEach(() => {
    render({
      template: () => <dynamic-import></dynamic-import>
    });
  });

  it('should load content from dynamic import', async () => {
    await expect($('dynamic-import')).toHaveText('1 hello1 world1');

    const dynamicImport = document.querySelector('dynamic-import');
    dynamicImport.update()

    await expect($('dynamic-import')).toHaveText('2 hello2 world2');
  });
});
