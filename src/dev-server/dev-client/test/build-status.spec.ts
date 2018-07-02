import { ICON_DEFAULT, ICON_DISABLED, ICON_ERROR, ICON_PENDING, ICON_TYPE, updateFavIcon } from '../build-status';


describe('build-status', () => {
  let linkElm: HTMLLinkElement;

  beforeEach(() => {
    linkElm = {
      dataset: {}
    } as any;
  });

  it('should set disabled and remember org href', () => {
    linkElm.href = 'org-icon';
    linkElm.type = 'org-type';
    updateFavIcon(linkElm, 'disabled');
    expect(linkElm.dataset.href).toBe('org-icon');
    expect(linkElm.dataset.type).toBe('org-type');
    expect(linkElm.href).toBe(ICON_DISABLED);
    expect(linkElm.type).toBe(ICON_TYPE);
  });

  it('should set pending and remember org href', () => {
    linkElm.href = 'org-icon';
    linkElm.type = 'org-type';
    updateFavIcon(linkElm, 'pending');
    expect(linkElm.dataset.href).toBe('org-icon');
    expect(linkElm.dataset.type).toBe('org-type');
    expect(linkElm.href).toBe(ICON_PENDING);
    expect(linkElm.type).toBe(ICON_TYPE);
  });

  it('should set error and remember org href', () => {
    linkElm.href = 'org-icon';
    linkElm.type = 'org-type';
    updateFavIcon(linkElm, 'error');
    expect(linkElm.dataset.href).toBe('org-icon');
    expect(linkElm.dataset.type).toBe('org-type');
    expect(linkElm.href).toBe(ICON_ERROR);
    expect(linkElm.type).toBe(ICON_TYPE);
  });

  it('should set original icon when dataset href', () => {
    linkElm.dataset.href = 'org-icon';
    linkElm.dataset.type = 'org-type';
    updateFavIcon(linkElm, 'default');
    expect(linkElm.href).toBe('org-icon');
    expect(linkElm.type).toBe('org-type');
    expect(linkElm.dataset.href).toBe(undefined);
    expect(linkElm.dataset.type).toBe(undefined);
  });

  it('should set the default icon when no href', () => {
    updateFavIcon(linkElm, 'default');
    expect(linkElm.href).toBe(ICON_DEFAULT);
    expect(linkElm.type).toBe(ICON_TYPE);
    expect(linkElm.dataset.href).toBe(undefined);
    expect(linkElm.dataset.type).toBe(undefined);
  });

});
