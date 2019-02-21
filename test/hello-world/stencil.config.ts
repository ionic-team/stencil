import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      prerenderCookie: () => 'mph=88',
      prerenderReferrer: () => 'http://www.google.com/',
      prerenderDirection: () => 'rtl',
      prerenderLanguage: () => 'fr',
      prerenderCanonicalLink: (url) => url.href,
      prerenderTitle: () => 'Hello World!'
    },
    {
      type: 'dist'
    },
    {
      type: 'angular',
      serverModuleFile: 'dist/server/helloworld-serve.ts'
    }
  ],
  enableCache: false
};