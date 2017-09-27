import { BuildConfig } from '../../../util/interfaces';
import { mockHtml } from '../../../testing/mocks';
import { removeUnusedStyles } from '../remove-unused-styles';
import { UsedSelectors } from '../../html/used-selectors';


describe('removeUnusedStyles', () => {

  it('should remove unused nested selectors', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div dir="ltr">
        <h1>Used</h1>
        <h2>Used</h2>
      </div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      [dir="ltr"] h1+h2 { font: used; }
      [dir="ltr"] h1+h3 { font: unused; }
    `);

    expectSelector(css, '[dir="ltr"] h1+h2');
    expectNoSelector(css, '[dir="ltr"] h1+h3');
  });

  it('should remove unused nested selectors', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div>
        <button id="usedId" class="my-used" mph="88">Unused</button>
      </div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      div label { font: used; }
      div label#usedId { font: used; }
      div label#usedId.my-used { font: used; }
      div label#usedId.my-used[mph] { font: used; }
    `);

    expectNoSelector(css, 'label { font: used; }');
    expectNoSelector(css, 'div label { font: used; }');
    expectNoSelector(css, 'div label#usedId { font: used; }');
    expectNoSelector(css, 'div label#usedId.my-used { font: used; }');
    expectNoSelector(css, 'div label#usedId.my-used[mph] { font: used; }');
  });

  it('should keep used nested selectors', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div>
        <label id="usedId" class="my-used" mph="88">Used</label>
      </div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      div { font: used; }
      label { font: used; }
      div label { font: used; }
      div label#usedId { font: used; }
      div label#usedId.my-used { font: used; }
      div label#usedId.my-used[mph] { font: used; }
    `);

    expectSelector(css, 'div { font: used; }');
    expectSelector(css, 'label { font: used; }');
    expectSelector(css, 'div label { font: used; }');
    expectSelector(css, 'div label#usedId { font: used; }');
    expectSelector(css, 'div label#usedId.my-used { font: used; }');
    expectSelector(css, 'div label#usedId.my-used[mph] { font: used; }');
  });

  it('should remove unused id selector', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div>
        <label id="usedId">Used</label>
        <div id="another-UsedId">Used</div>
      </div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      label { font: used; }
      label#usedId { font: used; }
      label#unusedId { font: unused; }
      #another-UsedId { font: used; }
      #another-UnusedId { font: unused; }
    `);

    expectSelector(css, 'label { font: used; }');
    expectSelector(css, 'label#usedId');
    expectSelector(css, '#another-UsedId');
    expectNoSelector(css, 'label#unusedId');
    expectNoSelector(css, '#another-UnusedId');
  });

  it('should remove unused attr selector', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <label mph="88">Used</label>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      label { font: used; }
      label[mph="88"] { font: used; }
      label[unused="val"] { font: unused; }
    `);

    expectSelector(css, 'label { font: used; }');
    expectSelector(css, 'label[mph="88"]');
    expectNoSelector(css, 'label[unused="val"]');
  });

  it('should remove unused tag selector', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <label class="div">Used</label>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      div { font: unused }
      label { font: used }
    `);

    expectSelector(css, 'label');
    expectNoSelector(css, 'div');
  });

  it('should remove unused classname in multi-selector', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div class="used-class"></div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      .unused-class, .unused-class2 { font: unused }
      .used-class { font: used }
    `);

    expectSelector(css, '.used-class');
    expectNoSelector(css, '.unused-class');
    expectNoSelector(css, '.unused-class2');
  });

  it('should remove unused classname', () => {
    let usedSelectors = new UsedSelectors(mockHtml(`
      <div class="used-class"></div>
    `));

    let css = removeUnusedStyles(config, usedSelectors, `
      .used-class { font: used }
      .unused-class { font: unused }
    `);

    expectSelector(css, '.used-class');
    expectNoSelector(css, '.unused-class');
  });


  function expectSelector(css: string, selector: string) {
    selector = selector.replace(/ \{ /g, '{')
                       .replace(/ \} /g, '}')
                       .replace(/\: /g, ':')
                       .replace(/\; /g, ';');
    expect(css).toContain(selector);
  }

  function expectNoSelector(css: string, selector: string) {
    selector = selector.replace(/ \{ /g, '{')
                       .replace(/ \} /g, '}')
                       .replace(/\: /g, ':')
                       .replace(/\; /g, ';');
    expect(css).not.toContain(selector);
  }

  var config: BuildConfig = {};

});
