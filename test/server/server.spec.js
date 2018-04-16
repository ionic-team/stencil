const path = require('path');
const cheerio = require('cheerio');
const express = require('express');
const request = require('supertest');
const stencil = require('../../server/index.js');


describe('test/server', () => {

  let app;
  let server;

  beforeEach(done => {
    app = express();

    // load the stencil config and
    // intialize serve-side rendering
    const { wwwDir } = stencil.initApp({
      app: app,
      configPath: path.join(__dirname, 'stencil.config.js')
    });

    server = app.listen(9030, done);
  });

  afterEach(done => {
    server.close(done);
    app = null;
  });


  it('multiple components w/ styles and multiple requests', done => {

    function testResponse(res) {
      const $ = cheerio.load(res.text);

      let elm = $('html[data-ssr]');
      expect(elm.length).toBe(1);

      expect($('h1').text().trim()).toBe('Stencil SSR Example');

      const css = $('style[data-styles]').html().trim();
      expect(css).toBe(`main{font-family:"Comic Sans MS";background:#000;padding:30px}h1{margin-top:0;color:red}p{color:#00f}span{color:green}`);
    }

    // first request
    request(app)
      .get('/')
      .expect(testResponse)
      .end(err => {
        if (err) throw err;

        // second request
        request(app)
          .get('/')
          .expect(testResponse)
          .end(err => {
            if (err) throw err;
            done();
          });
      });

  });

});
