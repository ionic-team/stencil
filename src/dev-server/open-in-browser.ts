import open from 'open';

export async function openInBrowser(opts: { url: string }) {
  // await open(opts.url, { app: ['google chrome', '--auto-open-devtools-for-tabs'] });
  await open(opts.url);
}
