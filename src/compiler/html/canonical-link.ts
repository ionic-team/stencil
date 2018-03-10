import { Config, HydrateResults } from '../../declarations';


export function insertCanonicalLink(config: Config, doc: Document, results: HydrateResults) {
  if (!results.path) return;

  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />

  let canonicalLink = doc.querySelector('link[rel="canonical"]');
  if (canonicalLink) return;

  canonicalLink = doc.createElement('link');
  canonicalLink.setAttribute('rel', 'canonical');
  canonicalLink.setAttribute('href', results.path);

  config.logger.debug(`add cononical link: ${results.path}`);

  doc.head.appendChild(canonicalLink);
}
