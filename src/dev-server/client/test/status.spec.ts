import { initBuildStatus, updateFavIcon } from '../status';

describe('build-status', () => {
  let linkElm: HTMLLinkElement;

  it('should set error and remember org href', () => {
    linkElm = document.createElement('link');
    linkElm.href = 'org-icon.ico';
    linkElm.rel = 'shortcut icon';
    linkElm.type = 'org-type';
    document.head.appendChild(linkElm);
    initBuildStatus({ window: window });

    expect(linkElm.dataset.href).toBe('http://testing.stenciljs.com/org-icon.ico');
    expect(linkElm.dataset.type).toBe('org-type');

    updateFavIcon(linkElm, 'error');
    expect(linkElm.getAttribute('data-status')).toBe('error');
    expect(linkElm.type).toBe('image/x-icon');
  });
});
