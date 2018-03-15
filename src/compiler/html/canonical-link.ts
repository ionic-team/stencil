import * as d from '../../declarations';


export function insertCanonicalLink(config: d.Config, doc: Document, windowLocationPath: string) {
  if (typeof windowLocationPath !== 'string') return;

  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />

  let canonicalLink = doc.querySelector('link[rel="canonical"]');
  if (canonicalLink) return;

  canonicalLink = doc.createElement('link');
  canonicalLink.setAttribute('rel', 'canonical');
  canonicalLink.setAttribute('href', windowLocationPath);

  config.logger.debug(`add cononical link: ${windowLocationPath}`);

  doc.head.appendChild(canonicalLink);
}
