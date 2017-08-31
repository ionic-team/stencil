import { BuildConfig } from '../../util/interfaces';


export function insertCanonicalLink(config: BuildConfig, doc: Document, url: string) {
  if (!url) return;

  // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
  // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />

  let canonicalLink = doc.querySelector('link[rel="canonical"]');
  if (canonicalLink) return;

  const parsedUrl = config.sys.url.parse(url);

  canonicalLink = doc.createElement('link');
  canonicalLink.setAttribute('rel', 'canonical');
  canonicalLink.setAttribute('href', parsedUrl.path);

  doc.head.appendChild(canonicalLink);
}
