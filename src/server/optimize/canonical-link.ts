

export function updateCanonicalLink(doc: Document, canonicalLinkHref: string) {
  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
  let canonicalLink = doc.head.querySelector('link[rel="canonical"]');
  if (canonicalLink == null) {
    canonicalLink = doc.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    doc.head.appendChild(canonicalLink);
  }

  canonicalLink.setAttribute('href', canonicalLinkHref);
}
