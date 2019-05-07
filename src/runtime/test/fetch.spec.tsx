import { mockFetch, newSpecPage } from '@stencil/core/testing';
import { Component, Prop, h } from '@stencil/core';


describe('fetch', () => {

  afterEach(() => {
    mockFetch.reset();
  });

  @Component({
    tag: 'cmp-a'
  })
  class CmpA {
    @Prop() data: string;
    names: string[];

    async componentWillLoad() {
      const url = `/${this.data}`;
      const rsp = await fetch(url);
      const data = await rsp.json();
      this.names = data.names;
    }
    render() {
      return (
        <ul>
          {this.names.map(n => <li>{n}</li>)}
        </ul>
      );
    }
  }

  it('should mock json fetch, no input', async () => {
    mockFetch.json({ names: ['Marty', 'Doc'] });

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a data="hillvalley.json"></cmp-a>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-a data="hillvalley.json">
        <ul>
          <li>Marty</li>
          <li>Doc</li>
        </ul>
      </cmp-a>
    `);
  });

  it('should mock json fetch, url input', async () => {
    mockFetch.json({ names: ['Marty', 'Doc'] }, '/hillvalley.json');
    mockFetch.json({ names: ['Bo', 'Luke'] }, '/hazzard.json');

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a data="hazzard.json"></cmp-a>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-a data="hazzard.json">
        <ul>
          <li>Bo</li>
          <li>Luke</li>
        </ul>
      </cmp-a>
    `);
  });

});
