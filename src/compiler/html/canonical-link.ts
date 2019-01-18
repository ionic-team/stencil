import { sys } from '@sys';


export function updateCanonicalLink(doc: Document, windowLocationPath: string) {
  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />

  if (typeof windowLocationPath !== 'string') {
    return;
  }

  const canonicalLink = doc.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    return;
  }

  const existingHref = canonicalLink.getAttribute('href');

  const updatedRref = updateCanonicalLinkHref(existingHref, windowLocationPath);

  canonicalLink.setAttribute('href', updatedRref);
}


export function updateCanonicalLinkHref(href: string, windowLocationPath: string) {
  const parsedUrl = sys.url.parse(windowLocationPath);

  if (typeof href === 'string') {
    href = href.trim();

    if (href.endsWith('/')) {
      href = href.substr(0, href.length - 1);
    }

  } else {
    href = '';
  }

  return `${href}${parsedUrl.path}`;
}
