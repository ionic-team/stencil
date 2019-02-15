import * as d from '@declarations';
import { updateCanonicalLink, updateCanonicalLinkHref } from '../canonical-link';
import { mockConfig, mockDocument } from '../../../testing/mocks';


describe('canonical link', () => {

  const config = mockConfig();

  describe('updateCanonicalLink',  () => {

    it('update existing canonical link', () => {
      const doc = mockDocument();
      const existingLink = doc.createElement('link');
      existingLink.setAttribute('rel', 'canonical');
      existingLink.setAttribute('href', 'http://stenciljs.com');
      doc.head.appendChild(existingLink);

      updateCanonicalLink(config, doc, '/some/path?qs=true');
      const canonicalLink = doc.querySelector('link[rel="canonical"]');
      expect(canonicalLink).toBeDefined();
      expect(canonicalLink.getAttribute('href')).toBe('http://stenciljs.com/some/path?qs=true');
    });

    it('do nothing if no canonical link', () => {
      const doc = mockDocument();
      updateCanonicalLink(config, doc, '/some/path?qs=true');
      const canonicalLink = doc.querySelector('link[rel="canonical"]');
      expect(canonicalLink).toBe(null);
    });

  });

  describe('updateCanonicalLinkHref',  () => {

    it('prefix w/ attr href domain, w/ trailing slash', () => {
      const existingHref = 'https://stenciljs.com/';
      const windowLocationPath = '/some/path?qs=true';
      const href = updateCanonicalLinkHref(config, existingHref, windowLocationPath);

      expect(href).toBe('https://stenciljs.com/some/path?qs=true');
    });

    it('prefix w/ attr href domain, no trailing slash', () => {
      const existingHref = 'http://stenciljs.com';
      const windowLocationPath = '/some/path?qs=true';
      const href = updateCanonicalLinkHref(config, existingHref, windowLocationPath);

      expect(href).toBe('http://stenciljs.com/some/path?qs=true');
    });

    it('do not prefix when href attr only /', () => {
      const existingHref = '/';
      const windowLocationPath = '/some/path?qs=true';
      const href = updateCanonicalLinkHref(config, existingHref, windowLocationPath);

      expect(href).toBe('/some/path?qs=true');
    });

    it('do not prefix when empty href attr', () => {
      const existingHref = '';
      const windowLocationPath = '/some/path?qs=true';
      const href = updateCanonicalLinkHref(config, existingHref, windowLocationPath);

      expect(href).toBe('/some/path?qs=true');
    });

    it('do not prefix when no href attr', () => {
      const existingHref = null;
      const windowLocationPath = '/some/path?qs=true';
      const href = updateCanonicalLinkHref(config, existingHref, windowLocationPath);

      expect(href).toBe('/some/path?qs=true');
    });

  });

});
