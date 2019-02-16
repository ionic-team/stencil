import * as d from '@declarations';


export function updateCanonicalLink(doc: Document, opts: d.HydrateOptions) {
  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
  const href = opts.canonicalLinkHref(doc.defaultView.location.href);

  if (typeof href === 'string') {
    let canonicalLink = doc.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = doc.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      doc.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', href);
  }
}
