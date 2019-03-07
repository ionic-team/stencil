

export function updateCanonicalLink(doc: Document, canonicalLinkHref: string) {
  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
  let canonicalLinkElm = doc.head.querySelector('link[rel="canonical"]');
  if (canonicalLinkElm == null) {
    canonicalLinkElm = doc.createElement('link');
    canonicalLinkElm.setAttribute('rel', 'canonical');
    doc.head.appendChild(canonicalLinkElm);
  }

  canonicalLinkElm.setAttribute('href', canonicalLinkHref);
}
