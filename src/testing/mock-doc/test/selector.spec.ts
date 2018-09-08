import { selectOne } from '../selector';
import { MockDocument } from '../document';

describe('selector', () => {

  it('not find input.checked.a.b', () => {
    const doc = new MockDocument(`
      <input class="checked a c" id="checkbox">
    `);

    const checkbox = doc.querySelector('input.checked.a.b');
    expect(checkbox).toBe(null);
  });

  it('find input.checked', () => {
    const doc = new MockDocument(`
      <input class="checked" id="checkbox">
    `);

    const checkbox = doc.querySelector('input.checked');
    expect(checkbox.id).toBe('checkbox');
  });

  it('find input[checked=true][disabled]', () => {
    const doc = new MockDocument(`
      <input checked="true" disabled id="checkbox">
    `);

    const checkbox = doc.querySelector('input[checked=true][disabled]');
    expect(checkbox.id).toBe('checkbox');
  });

  it('find input[checked=true]', () => {
    const doc = new MockDocument(`
      <input checked="true" id="checkbox">
    `);

    const checkbox = doc.querySelector('input[checked=true]');
    expect(checkbox.id).toBe('checkbox');
  });

  it('find input[checked]', () => {
    const doc = new MockDocument(`
      <input checked id="checkbox">
    `);

    const checkbox = doc.querySelector('input[checked]');
    expect(checkbox.id).toBe('checkbox');
  });

  it('find all tag names', () => {
    const doc = new MockDocument(`
      <div>1</div>
      <nav>2</nav>
    `);

    const elms = doc.querySelectorAll('a,div,nav');
    expect(elms.length).toBe(2);
  });

  it('find first tag name', () => {
    const doc = new MockDocument(`
      <div>1</div>
      <nav>2</nav>
    `);

    const div = doc.querySelector('a,div,nav');
    expect(div.outerHTML).toBe('<div>1</div>');
  });

  it('find one tag name', () => {
    const doc = new MockDocument(`
      <div>1</div>
      <nav>2</nav>
    `);

    const div = doc.querySelector('div');
    expect(div.outerHTML).toBe('<div>1</div>');

    const nav = doc.querySelector('nav');
    expect(nav.outerHTML).toBe('<nav>2</nav>');
  });

});
