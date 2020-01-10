import { MockResponse, mockFetch, newSpecPage, MockHeaders } from '@stencil/core/testing';
import { Component, Prop, Host, h } from '@stencil/core';


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
    text: string;
    headers: string[];

    async componentWillLoad() {
      const url = `/${this.data}`;
      const rsp = await fetch(url);

      this.headers = [];
      rsp.headers.forEach((v, k) => {
        this.headers.push(k + ': ' + v);
      });

      if (url.endsWith('.json')) {
        const data = await rsp.json();
        this.text = null;
        this.names = data.names;
      } else {
        this.text = await rsp.text();
        this.names = null;
      }
    }
    render() {
      return (
        <Host>
          <ul>
            {this.headers.map(n => <li>{n}</li>)}
          </ul>
          {this.names ?
            <ul>
              {this.names.map(n => <li>{n}</li>)}
            </ul> :
            null
          }
          {(this.text ? <p>{this.text}</p> : null)}
        </Host>
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
          <li>
            Content-Type: application/json
          </li>
        </ul>
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
          <li>
            Content-Type: application/json
          </li>
        </ul>
        <ul>
          <li>Bo</li>
          <li>Luke</li>
        </ul>
      </cmp-a>
    `);
  });

  it('basic', async () => {
    mockFetch.json({ names: ['Marty', 'Doc'] }, '/hillvalley.json');
    mockFetch.json({ names: ['Bo', 'Luke'] }, '/hazzard.json');

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a data="hazzard.json"></cmp-a>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-a data="hazzard.json">
      <ul>
        <li>
          Content-Type: application/json
        </li>
      </ul>
        <ul>
          <li>Bo</li>
          <li>Luke</li>
        </ul>
      </cmp-a>
    `);
  });

  it('MockRequest text', async () => {
    const res = new MockResponse('10:04', {
      url: '/hillvalley.txt',
      headers: new MockHeaders([
        ['Content-Type', 'text/plain'],
        ['Access-Control-Allow-Origin', '*']
      ])
    });
    mockFetch.response(res);

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a data="hillvalley.txt"></cmp-a>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-a data="hillvalley.txt">
        <ul>
          <li>
            Content-Type: text/plain
          </li>
          <li>
            Access-Control-Allow-Origin: *
          </li>
        </ul>
        <p>
          10:04
        </p>
      </cmp-a>
    `);
  });


  it('404', async () => {

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a data="no-findy.txt"></cmp-a>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-a data="no-findy.txt">
        <ul>
          <li>
            Content-Type: text/plain
          </li>
        </ul>
        <p>
          Not Found
        </p>
      </cmp-a>
    `);
  });

});
