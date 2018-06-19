import { escapeCssForJs } from '../style';


describe('escapeCssForJs', () => {
  /* this is all weird cuz we're testing by writing css in JS
    then testing that CSS works in JS so there's more escaping
    that you'd think, but it's more of a unit test thing */

  it(`should escape unicode characters`, () => {
    const escaped = escapeCssForJs(`p { content: '\\F113' }`);
    expect(escaped).toBe(`p { content: '\\\\F113' }`);
  });

  it(`should octal escape sequences 0 to 7 (not 8 or 9)`, () => {
    let escaped = escapeCssForJs(`p { content: '\\0660' }`);
    expect(escaped).toBe(`p { content: '\\\\0660' }`);

    escaped = escapeCssForJs(`p { content: '\\1660' }`);
    expect(escaped).toBe(`p { content: '\\\\1660' }`);

    escaped = escapeCssForJs(`p { content: '\\2660' }`);
    expect(escaped).toBe(`p { content: '\\\\2660' }`);

    escaped = escapeCssForJs(`p { content: '\\3660' }`);
    expect(escaped).toBe(`p { content: '\\\\3660' }`);

    escaped = escapeCssForJs(`p { content: '\\4660' }`);
    expect(escaped).toBe(`p { content: '\\\\4660' }`);

    escaped = escapeCssForJs(`p { content: '\\5660' }`);
    expect(escaped).toBe(`p { content: '\\\\5660' }`);

    escaped = escapeCssForJs(`p { content: '\\6660' }`);
    expect(escaped).toBe(`p { content: '\\\\6660' }`);

    escaped = escapeCssForJs(`p { content: '\\7660' }`);
    expect(escaped).toBe(`p { content: '\\\\7660' }`);

    escaped = escapeCssForJs(`p { content: '\\8660' }`);
    expect(escaped).toBe(`p { content: '\\8660' }`);

    escaped = escapeCssForJs(`p { content: '\\9660' }`);
    expect(escaped).toBe(`p { content: '\\9660' }`);
  });

  it(`should escape double quotes`, () => {
    const escaped = escapeCssForJs(`body { font-family: "Comic Sans MS"; }`);
    expect(escaped).toBe(`body { font-family: \\\"Comic Sans MS\\\"; }`);
  });

  it(`should escape new lines`, () => {
    const escaped = escapeCssForJs(`
      body {
        color: red;
      }`);
    expect(escaped).toBe(`\\n      body {\\n        color: red;\\n      }`);
  });

  it(`should escape @ in selectors`, () => {
    const escaped = escapeCssForJs('.container--small\@tablet{}');
    expect(escaped).toBe(`.container--small\\@tablet{}`);
  });

});
