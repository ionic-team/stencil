import { appendSwScript } from '../inject-sw-script';
import { compareHtml } from '../../../testing/mocks';


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
