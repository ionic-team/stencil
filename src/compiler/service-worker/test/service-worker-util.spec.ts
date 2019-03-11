import * as d from '../../declarations';
import { appendSwScript, generateServiceWorkerUrl } from '../service-worker-util';
import { compareHtml, mockConfig } from '../../../testing/mocks';
import { TestingConfig } from '../../../testing/testing-config';
import { validateConfig } from '../../config/validate-config';


describe('generateServiceWorkerUrl', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  it('sw url w/ baseUrl', () => {
    config = new TestingConfig();
    config.devMode = false;
    config.outputTargets = [
      {
        type: 'www',
        baseUrl: '/docs'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(config, outputTarget);
    expect(swUrl).toBe('/docs/sw.js');
  });

  it('default sw url', () => {
    config = new TestingConfig();
    config.devMode = false;
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(config, outputTarget);
    expect(swUrl).toBe('/sw.js');
  });

});


describe('appendSwScript', () => {

  it('append script to html w/out </body>', () => {
    const indexHtml = `<p></p>`;
    const htmlToAppend = `<script></script>`;

    const s = appendSwScript(indexHtml, htmlToAppend);
    expect(compareHtml(s)).toBe('<p></p><script></script>');
  });

  it('append script to empty html', () => {
    const indexHtml = ``;
    const htmlToAppend = `<script></script>`;

    const s = appendSwScript(indexHtml, htmlToAppend);
    expect(compareHtml(s)).toBe('<script></script>');
  });

  it('append script above </BODY>', () => {
    const indexHtml = `<html><BODY class="red"></BODY></html>`;
    const htmlToAppend = `<script></script>`;

    const s = appendSwScript(indexHtml, htmlToAppend);
    expect(compareHtml(s)).toBe(compareHtml('<html><body class="red"><script></script></body></html>'));
  });

  it('append script above </body>', () => {
    const indexHtml = `<body></body>`;
    const htmlToAppend = `<script></script>`;

    const s = appendSwScript(indexHtml, htmlToAppend);
    expect(compareHtml(s)).toBe('<body><script></script></body>');
  });

});
