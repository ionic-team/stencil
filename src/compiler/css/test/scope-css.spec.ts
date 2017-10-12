import { BuildConfig } from '../../../util/interfaces';
import { parseCss } from '../parse-css';
import { StringifyCss } from '../stringify-css';


describe('scoped css', () => {

  it('multiple selectors', () => {
    const css = `p, b, r { color: red; }`;
    const ast = parseCss(config, css);
    const stringify = new StringifyCss({ scopeIdSelector: '[xyz]' });
    const scopedCss = stringify.compile(ast);
    expect(scopedCss).toBe('p[xyz],b[xyz],r[xyz]{color:red;}');
  });

  it('pseudo', () => {
    const css = `p::after { color: red; }`;
    const ast = parseCss(config, css);
    const stringify = new StringifyCss({ scopeIdSelector: '[xyz]' });
    const scopedCss = stringify.compile(ast);
    expect(scopedCss).toBe('p[xyz]::after{color:red;}');
  });

  it('single tag selector', () => {
    const css = `p { color: red; }`;
    const ast = parseCss(config, css);
    const stringify = new StringifyCss({ scopeIdSelector: '[xyz]' });
    const scopedCss = stringify.compile(ast);
    expect(scopedCss).toBe('p[xyz]{color:red;}');
  });

  it('multiple tag selector', () => {
    const css = `p a { color: red; }`;
    const ast = parseCss(config, css);
    const stringify = new StringifyCss({ scopeIdSelector: '[xyz]' });
    const scopedCss = stringify.compile(ast);
    expect(scopedCss).toBe('p[xyz] a[xyz]{color:red;}');
  });

  it('single tag w/ attr', () => {
    const css = `input[checked] { color: red; }`;
    const ast = parseCss(config, css);
    const stringify = new StringifyCss({ scopeIdSelector: '[xyz]' });
    const scopedCss = stringify.compile(ast);
    expect(scopedCss).toBe('input[checked][xyz]{color:red;}');
  });

  var config: BuildConfig = {};

});
