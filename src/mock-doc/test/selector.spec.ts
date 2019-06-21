import { MockDocument } from '../document';
import { MockElement } from '../node';


describe('selector', () => {

  it('closest', () => {
    const doc = new MockDocument(`
      <div>
        <span>
          <p></p>
        </span>
      </div>
    `);

    const p = doc.querySelector('p');
    const div = doc.querySelector('div');
    expect(p.closest('div')).toBe(div);
  });

  it('no closest', () => {
    const doc = new MockDocument(`
      <div>
        <span>
          <p></p>
        </span>
      </div>
    `);

    const p = doc.querySelector('p');
    expect(p.closest('div#my-id')).toBe(null);
  });

  it('matches, tag/class/id', () => {
    const elm = new MockElement(null, 'h1');
    elm.classList.add('my-class');
    elm.id = 'my-id';
    expect(elm.matches('h1.my-class#my-id')).toBe(true);
  });

  it('no matches, tag/class/id', () => {
    const elm = new MockElement(null, 'h1');
    expect(elm.matches('h1.my-class#my-id')).toBe(false);
  });

  it('matches, tag', () => {
    const elm = new MockElement(null, 'h1');
    expect(elm.matches('h1')).toBe(true);
  });

  it('no matches, tag', () => {
    const elm = new MockElement(null, 'h1');
    expect(elm.matches('div')).toBe(false);
  });

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
