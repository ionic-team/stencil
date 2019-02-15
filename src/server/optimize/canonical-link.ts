import * as d from '@declarations';
import { URL } from 'url';


export function updateCanonicalLink(doc: Document, opts: d.HydrateOptions) {
  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />

  if (typeof opts.url !== 'string') {
    return;
  }

  const canonicalLink = doc.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    return;
  }

  const existingHref = canonicalLink.getAttribute('href');

  const updatedRref = updateCanonicalLinkHref(existingHref, opts.url);

  canonicalLink.setAttribute('href', updatedRref);
}


export function updateCanonicalLinkHref(href: string, windowLocationPath: string) {
  const parsedUrl = new URL(windowLocationPath);

  if (typeof href === 'string') {
    href = href.trim();

    if (href.endsWith('/')) {
      href = href.substr(0, href.length - 1);
    }

  } else {
    href = '';
  }

  return `${href}${parsedUrl.pathname}`;
}
