import { HydrateResults } from '../../declarations';

export async function insertModulePreload(results: HydrateResults, doc: Document) {
  console.log('results.bundleUrls',  results.bundleUrls);
  results.bundleUrls.forEach(url => {
    const link = doc.createElement('link');
    link.rel = 'modulepreload';
    link.href = url;
    doc.head.appendChild(link);
  });
}
